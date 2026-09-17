const { renderHeader, renderFooter } = require('./common');

function renderContent(slide, { slideIndex, totalSlides, handle, theme }) {
  const items = slide.bullets || slide.items || [];

  return `
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-between; padding: 70px; background-color: ${theme.bg};">
      <!-- Header -->
      ${renderHeader({ tag: slide.tag, slideIndex, totalSlides, theme })}

      <!-- Body Content -->
      <div style="display: flex; flex-direction: column; gap: 28px; width: 100%; flex: 1; justify-content: center;">
        <!-- Slide Title -->
        <div style="display: flex;">
          <span style="font-size: 52px; font-weight: 700; color: ${theme.textMain}; line-height: 1.2;">
            ${slide.title}
          </span>
        </div>

        ${slide.body ? `
          <div style="display: flex;">
            <span style="font-size: 28px; font-weight: 400; color: ${theme.textMuted}; line-height: 1.45;">
              ${slide.body}
            </span>
          </div>
        ` : ''}

        <!-- Bullet Cards -->
        ${items.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 18px; margin-top: 10px; width: 100%;">
            ${items.map((item, idx) => {
              const text = typeof item === 'string' ? item : item.text;
              const title = typeof item === 'object' && item.title ? item.title : null;

              return `
                <div style="display: flex; align-items: flex-start; gap: 20px; background: ${theme.cardBg}; border: 1px solid ${theme.cardBorder}; border-radius: 16px; padding: 22px 28px;">
                  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 9999px; background: ${theme.accentBadgeBg}; border: 1px solid ${theme.accentBadgeBorder}; flex-shrink: 0; margin-top: 4px;">
                    <span style="font-size: 18px; font-weight: 700; color: ${theme.primary};">${idx + 1}</span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 6px; flex: 1;">
                    ${title ? `<span style="font-size: 24px; font-weight: 700; color: ${theme.primary};">${title}</span>` : ''}
                    <span style="font-size: 24px; color: ${theme.textMain}; line-height: 1.4;">${text}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Footer -->
      ${renderFooter({ handle, isLast: slideIndex === totalSlides, theme })}
    </div>
  `;
}

module.exports = { renderContent };
