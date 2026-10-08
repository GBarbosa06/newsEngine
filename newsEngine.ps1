<#
.SYNOPSIS
    newsEngine CLI para Windows via Docker.
.DESCRIPTION
    Encapsula toda a renderização (Satori, Resvg, Fontes e Templates) em container Docker.
    Integra com a Área de Transferência (Clipboard) nativa do Windows e salva os posts
    diretamente na pasta output local.
.EXAMPLE
    .\newsEngine.ps1 --copy "Novidades do Go 1.24"
    .\newsEngine.ps1 --paste
    .\newsEngine.ps1
    .\newsEngine.ps1 input\meu-post.yaml --theme emerald --handle @dev.news
#>

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ScriptArgs
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$PromptFile = Join-Path $ScriptDir "PROMPT.md"
$InputDir = Join-Path $ScriptDir "input"
$OutputDir = Join-Path $ScriptDir "output"
$SampleFile = Join-Path $InputDir "sample.json"
$ImageName = "news-engine:latest"

function Show-Help {
    Write-Host "⚡ newsEngine CLI (Windows + Docker)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso:"
    Write-Host "  .\newsEngine.ps1 [opções|arquivo]"
    Write-Host ""
    Write-Host "Comandos integrados:"
    Write-Host "  --build           Reconstrói a imagem Docker"
    Write-Host "  --copy <tema>     Preenche o tema no PROMPT.md e copia para o Clipboard"
    Write-Host "  --paste           Salva o clipboard direto em input\sample.json (com auto-reparo de aspas)"
    Write-Host "  -h, --help        Exibe esta mensagem de ajuda"
    Write-Host ""
    Write-Host "Geração de slides:"
    Write-Host "  .\newsEngine.ps1                    Renderiza o padrão (input\sample.json)"
    Write-Host "  .\newsEngine.ps1 <arquivo>          Renderiza arquivo customizado (JSON ou YAML)"
    Write-Host "  .\newsEngine.ps1 [opções do motor]  Repassa flags (--theme, --handle, -o)"
    Write-Host ""
    Write-Host "Exemplo de fluxo rápido:"
    Write-Host "  1. .\newsEngine.ps1 --copy `"Novidades do Go 1.24`""
    Write-Host "  2. (Gere na IA e copie a resposta)"
    Write-Host "  3. .\newsEngine.ps1 --paste"
    Write-Host "  4. .\newsEngine.ps1"
    Write-Host ""
}

# Garante a existência dos diretórios locais
if (-not (Test-Path $InputDir)) { New-Item -ItemType Directory -Path $InputDir -Force | Out-Null }
if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null }

$cmd = if ($ScriptArgs.Count -gt 0) { $ScriptArgs[0] } else { "" }

switch -Regex ($cmd) {
    "^(-h|--help)$" {
        Show-Help
        exit 0
    }

    "^--build$" {
        Write-Host "🔨 Construindo imagem Docker: $ImageName..." -ForegroundColor Cyan
        docker build -t $ImageName $ScriptDir
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Falha no build da imagem Docker." -ForegroundColor Red
            exit $LASTEXITCODE
        }
        Write-Host "✔ Imagem Docker construída com sucesso!" -ForegroundColor Green
        exit 0
    }

    "^--copy$" {
        $themeArgs = $ScriptArgs[1..($ScriptArgs.Count - 1)]
        $theme = $themeArgs -join " "
        if ([string]::IsNullOrWhiteSpace($theme)) {
            Write-Host "Erro: Informe o tema após --copy." -ForegroundColor Red
            Write-Host "Exemplo: .\newsEngine.ps1 --copy `"Novidades do Java 27`""
            exit 1
        }

        if (-not (Test-Path $PromptFile)) {
            Write-Host "Erro: Arquivo PROMPT.md não encontrado em $PromptFile" -ForegroundColor Red
            exit 1
        }

        $rawPrompt = Get-Content -Path $PromptFile -Raw -Encoding UTF8
        $finalPrompt = $rawPrompt.Replace("[DIGITE SEU TÓPICO AQUI]", $theme)

        Set-Clipboard -Value $finalPrompt
        Write-Host "✅ Prompt sobre `"$theme`" copiado para a Área de Transferência!" -ForegroundColor Green
        exit 0
    }

    "^--paste$" {
        $clipText = Get-Clipboard -Raw
        if ([string]::IsNullOrWhiteSpace($clipText)) {
            Write-Host "❌ Área de transferência vazia!" -ForegroundColor Red
            exit 1
        }

        # Remove marcadores de código Markdown (```json ... ```)
        $cleanJson = $clipText -replace '(?m)^\s*```(json|JSON)?\s*$', ''

        $tempJson = Join-Path $InputDir "temp_paste.json"
        [System.IO.File]::WriteAllText($tempJson, $cleanJson, [System.Text.Encoding]::UTF8)

        # Garante que a imagem Docker existe para rodar o validador/reparador
        $imageExists = docker images -q $ImageName
        if (-not $imageExists) {
            Write-Host "📦 Imagem não encontrada. Construindo $ImageName..." -ForegroundColor Yellow
            docker build -t $ImageName $ScriptDir
        }

        # Script inline de validação e reparo de aspas em campos 'code'
        $repairScript = @"
const fs = require('fs');
const file = '/app/input/temp_paste.json';
let text = fs.readFileSync(file, 'utf8');

function validate(str) {
    try { JSON.parse(str); return null; } catch(e) { return e; }
}

let error = validate(text);
if (!error) {
    fs.writeFileSync('/app/input/sample.json', text, 'utf8');
    console.log('✅ JSON já estava válido. Nenhum reparo necessário.');
    process.exit(0);
}

console.log('⚠️ JSON recebido está inválido: ' + error.message);
console.log('🔧 Tentando reparar campos \"code\"...');

const marker = /"code"\s*:\s*"/g;
let result = '', cursor = 0, match, repairs = 0;

while ((match = marker.exec(text)) !== null) {
    const start = marker.lastIndex;
    result += text.slice(cursor, start);
    let i = start, val = '';

    while (i < text.length) {
        let ch = text[i];
        if (ch === '\\') {
            val += ch;
            if (i + 1 < text.length) { val += text[i + 1]; i += 2; } else { i++; }
            continue;
        }
        if (ch === '"') {
            let j = i + 1;
            while (j < text.length && /\s/.test(text[j])) j++;
            let rest = text.slice(j);
            let isEndOfField = /^,\s*"[a-zA-Z0-9_]+"\s*:/.test(rest) || /^\}\s*(?:,|\s*\])/.test(rest) || j >= text.length;
            if (isEndOfField) {
                val += '"'; i++; break;
            }
            val += '\\"'; repairs++; i++; continue;
        }
        val += ch; i++;
    }
    result += val;
    cursor = i;
    marker.lastIndex = i;
}
result += text.slice(cursor);

let repErr = validate(result);
if (repErr) {
    console.error('❌ Não foi possível reparar o JSON automaticamente: ' + repErr.message);
    process.exit(1);
}

fs.writeFileSync('/app/input/sample.json', result, 'utf8');
console.log('✅ JSON reparado com sucesso (' + repairs + ' aspas corrigidas).');
"@

        docker run --rm `
            -v "${InputDir}:/app/input" `
            --entrypoint node `
            $ImageName `
            -e $repairScript

        $dockerStatus = $LASTEXITCODE
        Remove-Item $tempJson -Force -ErrorAction SilentlyContinue

        if ($dockerStatus -ne 0) {
            Write-Host "❌ Falha ao processar o JSON da área de transferência." -ForegroundColor Red
            exit 1
        }

        Write-Host "✅ Conteúdo salvo em: input\sample.json" -ForegroundColor Green
        exit 0
    }

    default {
        # Garante que a imagem existe
        $imageExists = docker images -q $ImageName
        if (-not $imageExists) {
            Write-Host "📦 Imagem não encontrada. Construindo $ImageName..." -ForegroundColor Yellow
            docker build -t $ImageName $ScriptDir
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Erro ao construir a imagem Docker." -ForegroundColor Red
                exit $LASTEXITCODE
            }
        }

        # Trata caminhos para o padrão Linux do container
        $containerArgs = @()
        foreach ($arg in $ScriptArgs) {
            if ($arg -match '^(input[\\/].+)$') {
                $containerArgs += ($matches[1] -replace '\\', '/')
            } else {
                $containerArgs += $arg
            }
        }

        if ($containerArgs.Count -eq 0) {
            $containerArgs = @("input/sample.json")
        }

        Write-Host "🎨 Renderizando carrossel via Docker..." -ForegroundColor Cyan

        # Roda o container com mapeamento direto dos volumes de input e output
        docker run --rm `
            -v "${InputDir}:/app/input" `
            -v "${OutputDir}:/app/output" `
            $ImageName `
            $containerArgs

        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erro durante a geração dos slides." -ForegroundColor Red
            exit $LASTEXITCODE
        }

        # Se houver caption no diretório gerado mais recente, copia para o Clipboard do Windows
        $latestDir = Get-ChildItem -Path $OutputDir -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($latestDir) {
            $captionFile = Join-Path $latestDir.FullName "caption.txt"
            if (Test-Path $captionFile) {
                try {
                    $captionText = Get-Content -Path $captionFile -Raw -Encoding UTF8
                    Set-Clipboard -Value $captionText
                    Write-Host "📋 Legenda copiada automaticamente para a Área de Transferência do Windows!" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️ Não foi possível copiar caption automaticamente: $_" -ForegroundColor Yellow
                }
            }
        }
    }
}
