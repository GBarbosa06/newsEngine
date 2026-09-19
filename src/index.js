#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { SlideRenderer } = require('./renderer');

function printUsage() {
  console.log(`
\x1b[1m\x1b[36m⚡ NewsEngine - Social Carousel Generator\x1b[0m

\x1b[1mUso:\x1b[0m
  node src/index.js <arquivo.json|yaml> [opções]

\x1b[1mOpções:\x1b[0m
  -o, --output <dir>    Diretório de saída personalizado
  --handle <@user>      Substitui o arroba/marca nos slides
  --theme <nome>        Tema de cores (blue, purple, emerald, amber)
  -h, --help            Mostra esta ajuda

\x1b[1mExemplos:\x1b[0m
  node src/index.js input/sample.json
  node src/index.js input/post.yaml --theme emerald --handle @dev.news
  `);
}

function parseArgs(args) {
  const options = {
    inputFile: null,
    outputDir: null,
    handle: null,
    theme: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      printUsage();
      process.exit(0);
    } else if (arg === '-o' || arg === '--output') {
      options.outputDir = args[++i];
    } else if (arg === '--handle') {
      options.handle = args[++i];
    } else if (arg === '--theme') {
      options.theme = args[++i];
    } else if (!arg.startsWith('-') && !options.inputFile) {
      options.inputFile = arg;
    }
  }

  // Se nenhum arquivo de entrada foi passado explicitamente, tenta o padrão input/sample.json
  if (!options.inputFile) {
    const defaultSampleJson = path.join(process.cwd(), 'input', 'sample.json');
    const defaultSampleYaml = path.join(process.cwd(), 'input', 'sample.yaml');
    if (fs.existsSync(defaultSampleJson)) {
      options.inputFile = defaultSampleJson;
    } else if (fs.existsSync(defaultSampleYaml)) {
      options.inputFile = defaultSampleYaml;
    }
  }

  return options;
}

function slugify(text) {
  return String(text || 'post')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function loadInputFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo de entrada não encontrado: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.yaml' || ext === '.yml') {
    return YAML.parse(raw);
  } else {
    return JSON.parse(raw);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.inputFile) {
    console.error('\x1b[31mErro: Nenhum arquivo de entrada fornecido.\x1b[0m\n');
    printUsage();
    process.exit(1);
  }

  const resolvedInput = path.resolve(process.cwd(), options.inputFile);
  console.log(`\x1b[36m📂 Carregando:\x1b[0m ${resolvedInput}`);

  let postData;
  try {
    postData = loadInputFile(resolvedInput);
  } catch (err) {
    console.error(`\x1b[31mFalha ao ler o arquivo:\x1b[0m ${err.message}`);
    process.exit(1);
  }

  // Apply CLI overrides if passed
  if (options.handle) postData.handle = options.handle;
  if (options.theme) postData.theme = options.theme;

  const topicSlug = slugify(postData.slug || postData.theme_slug || postData.slides?.[0]?.title || 'newsletter');
  const dateStr = new Date().toISOString().split('T')[0];
  
  const defaultOutputDir = path.join(process.cwd(), 'output', `${dateStr}_${topicSlug}`);
  const finalOutputDir = options.outputDir ? path.resolve(process.cwd(), options.outputDir) : defaultOutputDir;

  console.log(`\x1b[36m🎨 Renderizando carrossel com Satori + Resvg...\x1b[0m`);
  console.log(`   Tema: \x1b[33m${postData.theme || 'blue'}\x1b[0m | Slides: \x1b[33m${postData.slides?.length || 0}\x1b[0m | Handle: \x1b[33${postData.handle || '@tech.newsletter'}\x1b[0m`);

  const renderer = new SlideRenderer();
  const result = await renderer.renderPost(postData, finalOutputDir);

  console.log(`\n\x1b[32m✔ Sucesso! Carrossel gerado em ${result.durationMs}ms\x1b[0m`);
  console.log(`\x1b[1m📁 Diretório de saída:\x1b[0m ${result.outputDir}\n`);

  result.generatedFiles.forEach(file => {
    const sizeKb = (file.size / 1024).toFixed(1);
    console.log(`  📸 \x1b[37m${file.fileName}\x1b[0m \x1b[90m(${sizeKb} KB)\x1b[0m`);
  });

  console.log(`\n\x1b[35mPronto para postar no Instagram / LinkedIn!\x1b[0m\n`);
}

main().catch(err => {
  console.error('\x1b[31mErro durante a geração:\x1b[0m', err);
  process.exit(1);
});
