const { renderFooter } = require('./common');

function renderCover(slide, { totalSlides, handle, theme }) {
  return `
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-between; padding: 70px; background-color: ${theme.bg};">
      <!-- Top Tag & Brand -->
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div style="display: flex; align-items: center; background: ${theme.accentBadgeBg}; border: 1.5px solid ${theme.accentBadgeBorder}; border-radius: 9999px; padding: 12px 28px;">
          <span style="font-size: 22px; font-weight: 700; color: ${theme.primary}; letter-spacing: 2px; text-transform: uppercase;">
            ${slide.tag || 'NOVIDADE TECH'}
          </span>
        </div>
        <div style="display: flex; align-items: center;">
          <span style="font-size: 20px; font-weight: 700; color: ${theme.textMuted};">
            ${handle || '@tech.newsletter'}
          </span>
        </div>
      </div>

      <!-- Main Center Content -->
      <div style="display: flex; flex-direction: column; gap: 28px; width: 100%; margin-top: 40px; margin-bottom: 40px;">
        <div style="display: flex;">
          <span style="font-size: 64px; font-weight: 700; color: ${theme.textMain}; line-height: 1.15; letter-spacing: -1px;">
            ${slide.title}
          </span>
        </div>

        ${slide.subtitle ? `
          <div style="display: flex;">
            <span style="font-size: 32px; font-weight: 400; color: ${theme.textMuted}; line-height: 1.4;">
              ${slide.subtitle}
            </span>
          </div>
        ` : ''}

        ${slide.highlight ? `
          <div style="display: flex; margin-top: 16px; background: ${theme.cardBg}; border-left: 6px solid ${theme.primary}; border-radius: 0 16px 16px 0; padding: 24px 32px;">
            <span style="font-size: 26px; color: ${theme.textMain}; font-weight: 700;">
              💡 ${slide.highlight}
            </span>
          </div>
        ` : ''}
      </div>

      <!-- Footer CTA -->
      ${renderFooter({ handle, isLast: false, theme })}
    </div>
  `;
}

module.exports = { renderCover };
