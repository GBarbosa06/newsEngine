/**
 * Common styles and layout components for slides.
 */

const THEMES = {
  blue: {
    bg: '#090d16',
    cardBg: '#131b2e',
    cardBorder: '#1e293b',
    primary: '#38bdf8',
    secondary: '#818cf8',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    accentBadgeBg: 'rgba(56, 189, 248, 0.12)',
    accentBadgeBorder: 'rgba(56, 189, 248, 0.3)',
  },
  purple: {
    bg: '#0c0717',
    cardBg: '#19112e',
    cardBorder: '#2e1c54',
    primary: '#c084fc',
    secondary: '#f472b6',
    textMain: '#f8fafc',
    textMuted: '#a8a29e',
    accentBadgeBg: 'rgba(192, 132, 252, 0.12)',
    accentBadgeBorder: 'rgba(192, 132, 252, 0.3)',
  },
  emerald: {
    bg: '#06120e',
    cardBg: '#0e241c',
    cardBorder: '#164234',
    primary: '#34d399',
    secondary: '#38bdf8',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    accentBadgeBg: 'rgba(52, 211, 153, 0.12)',
    accentBadgeBorder: 'rgba(52, 211, 153, 0.3)',
  },
  amber: {
    bg: '#140c04',
    cardBg: '#261608',
    cardBorder: '#45260c',
    primary: '#fbbf24',
    secondary: '#f87171',
    textMain: '#f8fafc',
    textMuted: '#a3a3a3',
    accentBadgeBg: 'rgba(251, 191, 36, 0.12)',
    accentBadgeBorder: 'rgba(251, 191, 36, 0.3)',
  }
};

function getTheme(themeName) {
  return THEMES[themeName] || THEMES.blue;
}

function renderHeader({ tag, slideIndex, totalSlides, theme }) {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 40px;">
      <div style="display: flex; align-items: center; background: ${theme.accentBadgeBg}; border: 1.5px solid ${theme.accentBadgeBorder}; border-radius: 9999px; padding: 10px 24px;">
        <span style="font-size: 20px; font-weight: 700; color: ${theme.primary}; letter-spacing: 2px; text-transform: uppercase;">
          ${tag || 'TECH UPDATE'}
        </span>
      </div>
      <div style="display: flex; align-items: center; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 9999px; padding: 8px 20px;">
        <span style="font-size: 20px; font-weight: 700; color: ${theme.textMuted};">
          ${String(slideIndex).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}
        </span>
      </div>
    </div>
  `;
}

function renderFooter({ handle, isLast, theme }) {
  const ctaText = isLast ? 'Compartilhe & Salve' : 'Deslize para ver ➔';
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
      <div style="display: flex; align-items: center;">
        <span style="font-size: 22px; font-weight: 700; color: ${theme.textMuted};">
          ${handle || '@tech.newsletter'}
        </span>
      </div>
      <div style="display: flex; align-items: center; background: ${theme.accentBadgeBg}; border-radius: 9999px; padding: 8px 20px;">
        <span style="font-size: 20px; font-weight: 700; color: ${theme.primary};">
          ${ctaText}
        </span>
      </div>
    </div>
  `;
}

module.exports = {
  THEMES,
  getTheme,
  renderHeader,
  renderFooter
};
