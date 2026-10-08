# ⚡ newsEngine

> Motor de geração rápida de carrosséis visuais para redes sociais (Instagram, LinkedIn, Bluesky) a partir de JSON ou YAML estruturado gerado por IA.

Construído com **Node.js**, **Satori** (Vercel) e **@resvg/resvg-js**, renderizando carrosséis em resolução nativa (1080x1350 ou 1080x1080) em **menos de 2 segundos** sem a sobrecarga de memória de um navegador Chrome headless.

---

## 🌿 Branches e Ambientes do Repositório

O projeto possui ramificações dedicadas conforme o sistema operacional e a preferência de execução:

| Branch | Ambiente / Alvo | Como Funciona |
| :--- | :--- | :--- |
| **`main`** | Híbrido / Universal | Contém o motor principal, o suporte a Docker (`Dockerfile`, `.dockerignore`) e compatibilidade geral. |
| **`windows`** | Windows (PowerShell + Docker) | Inclui a CLI `newsEngine.ps1` com integração à Área de Transferência nativa (`Set-Clipboard`), execução 100% isolada via Docker (fontes e templates no container) e montagem direta das pastas `input/` e `output/`. |
| **`linux`** | Linux Nativo | Versão original executada diretamente via Node.js nativo e Bash (`./newsEngine`), integrada com ferramentas de clipboard X11/Wayland (`copyq`, `wl-copy`, `xclip`). |

---

## 📁 Estrutura do Projeto

```
newsEngine/
├── Dockerfile             # Imagem Docker com Node, Satori, Resvg, fontes e templates
├── .dockerignore          # Evita copiar node_modules, output e histórico git para o container
├── assets/
│   └── fonts/             # Fontes Open Source (NotoSans Regular, Bold, Mono)
├── input/
│   ├── sample.json        # Exemplo em JSON
│   └── sample.yaml        # Exemplo em YAML
├── output/                # Saída organizada com pastas datadas e numeradas
│   └── YYYY-MM-DD_<slug>/
│       ├── 01_cover.png
│       ├── 02_content.png
│       ├── 03_code.png
│       ├── 04_comparison.png
│       ├── 05_cta.png
│       └── caption.txt    # Legenda pronta para copiar e postar
├── src/
│   ├── templates/         # Componentes visuais dos slides (cover, content, code, comparison, cta)
│   ├── renderer.js        # Motor Satori + Resvg
│   └── index.js           # CLI runner
├── newsEngine             # CLI unificada Bash para Linux
├── newsEngine.ps1         # CLI unificada PowerShell para Windows (disponível na branch windows)
├── PROMPT.md              # Prompt mestre para envio a LLMs
└── package.json
```

---

## 🐳 Executando com Docker (Recomendado / Fácil de limpar)

Para não poluir o sistema operacional host com dependências nativas (`node_modules`), você pode rodar tudo empacotado em container Docker.

### 1. Construir a imagem
```bash
docker build -t news-engine .
```

### 2. Renderizar posts (Host ↔ Docker)
Mapeie suas pastas locais `input/` e `output/` para o container:

```bash
docker run --rm \
  -v "$(pwd)/input:/app/input" \
  -v "$(pwd)/output:/app/output" \
  news-engine input/sample.json
```

O carrossel e o arquivo `caption.txt` serão gerados **diretamente na sua pasta local `output/`**.

---

## 💻 Uso no Windows (Branch `windows`)

Na branch `windows`, você utiliza o script PowerShell `newsEngine.ps1` que automatiza o ciclo completo com a Área de Transferência do Windows:

```powershell
# 1. Copia o prompt com o tema preenchido direto para o seu Ctrl+V
.\newsEngine.ps1 --copy "Novidades do TypeScript 5.8"

# 2. Gere na IA, copie a resposta e cole com validação e auto-reparo de aspas
.\newsEngine.ps1 --paste

# 3. Renderiza no Docker e descarrega os PNGs na pasta output local
.\newsEngine.ps1

# (A legenda caption.txt é automaticamente enviada para a Área de Transferência!)
```

---

## 🐧 Uso no Linux (Branch `linux` ou Nativo)

```bash
# Instalação local
npm install

# Fluxo rápido via CLI Bash
./newsEngine --copy "Novidades do Rust 1.85"
./newsEngine --paste
./newsEngine
```

---

## 🎨 Tipos de Slides Suportados

1. **`cover`**: Slide de capa com tag de categoria, título em destaque, subtítulo e frase de impacto.
2. **`content`**: Slide explicativo com lista de pontos organizados em cards estilizados.
3. **`code`**: Mock de terminal macOS com destaque de código e anotação técnica.
4. **`comparison`**: Comparação em colunas duplas (*Antes vs Agora* ou *Prós vs Contras*).
5. **`cta`**: Slide de conclusão com takeaway e chamadas para ação.
