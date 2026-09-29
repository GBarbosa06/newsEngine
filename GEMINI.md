# Contexto do Projeto: newsEngine

Motor Node.js de geração rápida de carrosséis visuais (PNG) para redes sociais (Instagram, LinkedIn, Bluesky) a partir de JSON ou YAML, renderizados com **Satori** (HTML/CSS para SVG) e **@resvg/resvg-js** (SVG para PNG).

---

## 🛠️ Stack & Arquitetura

- **Runtime**: Node.js (CommonJS).
- **Renderização**: `satori` + `satori-html` + `@resvg/resvg-js`.
- **Parsing**: `yaml` para YAML e `JSON.parse` para JSON.
- **Fontes**: Noto Sans (Regular 400, Bold 700) e Noto Sans Mono (400) em `assets/fonts/`.
- **Clipboard**: `copyq`, `wl-copy` ou `xclip`.

### Árvore de Diretórios
- `src/index.js`: Ponto de entrada CLI e orquestrador de arquivos.
- `src/renderer.js`: Classe `SlideRenderer` (carrega fontes, integra Satori e Resvg).
- `src/templates/`: Componentes visuais dos slides:
  - `cover.js`: Capa (tag, título, subtítulo, destaque).
  - `content.js`: Slide informativo com lista de tópicos (bullets).
  - `code.js`: Janela estilo terminal macOS com destaque de código e anotação.
  - `comparison.js`: Comparação em colunas duplas (*Antes vs Agora*).
  - `cta.js`: Conclusão, resumo e chamadas para ação.
  - `common.js`: Paletas de cores (`blue`, `purple`, `emerald`, `amber`), cabeçalho e rodapé.
- `newsEngine`: Script Bash CLI unificado (`--copy`, `--paste`, renderização).
- `input/`: Arquivos de entrada (`sample.json`, `sample.yaml`).
- `output/`: Saídas geradas em `YYYY-MM-DD_<slug>/` contendo PNGs numerados, `caption.txt` e `metadata.json`.
- `PROMPT.md`: Prompt base enviado a LLMs para gerar o conteúdo.

---

## 🚀 Comandos Rápidos

```bash
# Execução direta com sample.json
npm start
# ou
node src/index.js input/sample.json

# CLI unificada (com atalhos de clipboard)
./newsEngine                           # Renderiza input/sample.json
./newsEngine --copy "<tema>"           # Preenche PROMPT.md e copia para o clipboard
./newsEngine --paste                   # Salva clipboard em input/sample.json e repara aspas
./newsEngine input/sample.yaml --theme emerald --handle @meu.perfil
```

---

## 📐 Estrutura de Dados (Schema)

```json
{
  "theme": "blue" | "purple" | "emerald" | "amber",
  "ratio": "1080x1350" | "1080x1080",
  "slug": "slug-kebab-case",
  "handle": "@perfil.dev",
  "social_caption": "Texto da legenda...",
  "hashtags": ["tech", "dev"],
  "slides": [
    {
      "type": "cover",
      "tag": "CATEGORIA",
      "title": "Título",
      "subtitle": "Subtítulo",
      "highlight": "Frase de destaque"
    },
    {
      "type": "content",
      "tag": "TÓPICO",
      "title": "Título",
      "body": "Texto introdutório",
      "bullets": [{ "title": "Ponto", "text": "Detalhe" }]
    },
    {
      "type": "code",
      "tag": "PRÁTICA",
      "title": "Título",
      "description": "Contexto do snippet",
      "language": "linguagem ou arquivo.ext",
      "code": "linhas de código com aspas duplas escapadas (\\\")",
      "note": "Nota em destaque"
    },
    {
      "type": "comparison",
      "tag": "COMPARAÇÃO",
      "title": "Título",
      "subtitle": "Subtítulo",
      "left": { "title": "Antes", "points": ["..."] },
      "right": { "title": "Agora", "points": ["..."] }
    },
    {
      "type": "cta",
      "tag": "FINAL",
      "title": "Título",
      "takeaway": "Síntese principal",
      "actions": [{ "icon": "💾", "text": "Ação" }]
    }
  ]
}
```

---

## ⚠️ Regras Críticas e Prevenção de Erros

1. **Escape de Aspas no JSON (`code`)**:
   - Em `input/sample.json`, trechos de código dentro de `"code"` **sempre** precisam ter aspas duplas internas escapadas com `\"`.
   - Como alternativa sem necessidade de escapes, utilize YAML (`input/sample.yaml`) com a sintaxe de bloco escalar `code: |`.
2. **Restrições do Satori**:
   - Elementos HTML gerados pelos templates **devem** usar `display: flex` em todos os contêineres de layout.
   - Satori não suporta tags sem display flexível explícito ou propriedades CSS complexas fora do padrão flexbox.
3. **Cores**:
   - Apenas os temas definidos em `src/templates/common.js` são suportados diretamente via chave `theme` (`blue`, `purple`, `emerald`, `amber`).
