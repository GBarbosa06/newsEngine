const fs = require('fs');
const path = require('path');
const satori = require('satori').default || require('satori');
const { html } = require('satori-html');
const { Resvg } = require('@resvg/resvg-js');

const { getTheme } = require('./templates/common');
const { renderCover } = require('./templates/cover');
const { renderContent } = require('./templates/content');
const { renderCode } = require('./templates/code');
const { renderComparison } = require('./templates/comparison');
const { renderCta } = require('./templates/cta');

class SlideRenderer {
  constructor(fontsDir) {
    this.fontsDir = fontsDir || path.join(__dirname, '../assets/fonts');
    this.fonts = this.loadFonts();
  }

  loadFonts() {
    const regularFontPath = path.join(this.fontsDir, 'Regular.ttf');
    const boldFontPath = path.join(this.fontsDir, 'Bold.ttf');
    const monoFontPath = path.join(this.fontsDir, 'Mono.ttf');

    const fonts = [];

    if (fs.existsSync(regularFontPath)) {
      fonts.push({
        name: 'NotoSans',
        data: fs.readFileSync(regularFontPath),
        weight: 400,
        style: 'normal'
      });
    }

    if (fs.existsSync(boldFontPath)) {
      fonts.push({
        name: 'NotoSans',
        data: fs.readFileSync(boldFontPath),
        weight: 700,
        style: 'normal'
      });
    }

    if (fs.existsSync(monoFontPath)) {
      fonts.push({
        name: 'NotoSansMono',
        data: fs.readFileSync(monoFontPath),
        weight: 400,
        style: 'normal'
      });
    }

    if (fonts.length === 0) {
      throw new Error(`Nenhuma fonte encontrada em ${this.fontsDir}. Certifique-se de que Regular.ttf existe.`);
    }

    return fonts;
  }

  getTemplateHtml(slide, context) {
    switch (slide.type) {
      case 'cover':
        return renderCover(slide, context);
      case 'code':
        return renderCode(slide, context);
      case 'comparison':
        return renderComparison(slide, context);
      case 'cta':
        return renderCta(slide, context);
      case 'content':
      default:
        return renderContent(slide, context);
    }
  }

  async renderSlide(slide, context, dimensions = { width: 1080, height: 1350 }) {
    const rawHtml = this.getTemplateHtml(slide, context);
    const element = html(rawHtml);

    const svg = await satori(element, {
      width: dimensions.width,
      height: dimensions.height,
      fonts: this.fonts
    });

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: dimensions.width
      }
    });

    const pngData = resvg.render();
    return pngData.asPng();
  }

  async renderPost(postData, outputDir) {
    const startTime = Date.now();
    const slides = postData.slides || [];
    const totalSlides = slides.length;
    const theme = getTheme(postData.theme || 'blue');
    const handle = postData.handle || '@tech.newsletter';

    // Parse dimension ratio (default: 1080x1350 portrait 4:5)
    let width = 1080;
    let height = 1350;
    if (postData.ratio === '1080x1080') {
      height = 1080;
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const generatedFiles = [];

    for (let i = 0; i < totalSlides; i++) {
      const slide = slides[i];
      const slideIndex = i + 1;
      const slideType = slide.type || 'content';

      const pngBuffer = await this.renderSlide(slide, {
        slideIndex,
        totalSlides,
        handle,
        theme
      }, { width, height });

      const fileName = `${String(slideIndex).padStart(2, '0')}_${slideType}.png`;
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, pngBuffer);
      generatedFiles.push({ fileName, filePath, size: pngBuffer.length });
    }

    // Save social media post copy
    if (postData.social_caption) {
      const captionPath = path.join(outputDir, 'caption.txt');
      let captionContent = postData.social_caption.trim();
      if (postData.hashtags && Array.isArray(postData.hashtags)) {
        captionContent += '\n\n' + postData.hashtags.map(h => (h.startsWith('#') ? h : `#${h}`)).join(' ');
      }
      fs.writeFileSync(captionPath, captionContent, 'utf-8');
      generatedFiles.push({ fileName: 'caption.txt', filePath: captionPath, size: captionContent.length });
    }

    // Also save a copy of the input json for reproducibility
    const metaPath = path.join(outputDir, 'metadata.json');
    fs.writeFileSync(metaPath, JSON.stringify(postData, null, 2), 'utf-8');

    const duration = Date.now() - startTime;
    return {
      outputDir,
      totalSlides,
      generatedFiles,
      durationMs: duration
    };
  }
}

module.exports = { SlideRenderer };
