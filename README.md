# ⚡ newsEngine

> Motor de geração rápida de carrosséis visuais para redes sociais (Instagram, LinkedIn, Bluesky) a partir de JSON ou YAML estruturado gerado por IA.

Construído em **Node.js** com **Satori** (Vercel) e **@resvg/resvg-js**, renderizando carrosséis em resolução nativa (1080x1350 ou 1080x1080) em **menos de 2 segundos** sem a sobrecarga de memória de um navegador Chrome headless.

---

## 📁 Estrutura do Projeto

```
newsEngine/
├── assets/
│   └── fonts/             # Fontes Open Source (NotoSans Regular, Bold, Mono)
├── input/
│   ├── sample.json        # Exemplo completo em JSON (Node.js 22)
│   └── sample.yaml        # Exemplo completo em YAML (Docker Compose Watch)
├── output/                # Saída organizada com pastas datadas e numeradas
│   └── YYYY-MM-DD_<slug>/
│       ├── 01_cover.png
│       ├── 02_content.png
│       ├── 03_code.png
│       ├── 04_comparison.png
│       ├── 05_cta.png
│       └── caption.txt    # Legenda pronta com hashtags para copiar e colar
├── src/
│   ├── templates/         # Componentes visuais dos slides
│   │   ├── common.js      # Temas de cores, header e footer
│   │   ├── cover.js       # Slide de capa de alto impacto
│   │   ├── content.js     # Slide explicativo com cards
│   │   ├── code.js        # Janela de código (estilo terminal macOS)
│   │   ├── comparison.js  # Comparação visual (Antes vs Agora)
│   │   └── cta.js         # Chamada para ação e encerramento
│   ├── renderer.js        # Motor de compilação Satori + Resvg
│   └── index.js           # CLI runner
├── newsEngine             # CLI unificada (--copy, --paste e renderizador)
├── PROMPT.md              # Prompt mestre pronto para envio a LLMs
└── package.json
```

---

## 🚀 Como Usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Gerar o carrossel de exemplo
```bash
npm start
# ou
node src/index.js input/sample.json
```

### 3. Usar arquivo YAML ou opções personalizadas
```bash
node src/index.js input/sample.yaml --handle @meu.perfil --theme emerald
```

### Opções da CLI
| Flag | Descrição |
| :--- | :--- |
| `<arquivo>` | Caminho do arquivo de entrada (`.json` ou `.yaml`) |
| `-o, --output <dir>` | Diretório de saída customizado |
| `--handle <@user>` | Substitui a arroba/marca no rodapé dos slides |
| `--theme <nome>` | Define o esquema de cores: `blue`, `purple`, `emerald`, `amber` |
| `-h, --help` | Exibe a ajuda da CLI |

---

## 🎨 Tipos de Slides Suportados

1. **`cover`**: Slide de capa com tag de categoria, título em destaque, subtítulo e frase de impacto.
2. **`content`**: Slide explicativo com lista de pontos organizados em cards estilizados.
3. **`code`**: Mock de janela de terminal (com botões macOS, arquivo/linguagem, fonte monospace e bloco de anotação).
4. **`comparison`**: Comparação em colunas lado a lado (*Antes vs Agora* ou *Prós vs Contras*).
5. **`cta`**: Slide final com resumo/takeaway principal e lista de ações (Salvar, Compartilhar, Comentar).

---

## 🤖 Como Gerar Novos Posts com IA (Fluxo Rápido)

O fluxo foi desenhado para ser o mais rápido e fluido possível usando a CLI unificada `./newsEngine`:

### 1. Copiar o prompt com seu tema
Use `--copy` informando o assunto. Ele injeta o tema no [PROMPT.md](PROMPT.md) em memória e já copia tudo para o **CopyQ**:

```bash
./newsEngine --copy "Novidades do Rust 1.85"
```

### 2. Gerar com a IA
Cole o prompt no **Gemini**, **ChatGPT** ou **Claude**. Ao terminar, copie o JSON ou YAML retornado pela IA.

### 3. Colar do clipboard e Gerar os Slides
Use `--paste` para salvar a resposta copiada no `input/sample.json` e execute para gerar:

```bash
./newsEngine --paste
./newsEngine
```

Pronto! Os slides em PNG e o texto da legenda (`caption.txt`) estarão na pasta `output/` em menos de 2 segundos.


