const { renderHeader, renderFooter } = require('./common');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderCode(slide, { slideIndex, totalSlides, handle, theme }) {
  const rawCode = slide.code || '';
  const escapedCode = escapeHtml(rawCode);

  return `
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-between; padding: 70px; background-color: ${theme.bg};">
      <!-- Header -->
      ${renderHeader({ tag: slide.tag, slideIndex, totalSlides, theme })}

      <!-- Main Body -->
      <div style="display: flex; flex-direction: column; gap: 24px; width: 100%; flex: 1; justify-content: center;">
        <!-- Title -->
        <div style="display: flex;">
          <span style="font-size: 48px; font-weight: 700; color: ${theme.textMain}; line-height: 1.2;">
            ${slide.title}
          </span>
        </div>

        ${slide.description ? `
          <div style="display: flex;">
            <span style="font-size: 26px; font-weight: 400; color: ${theme.textMuted}; line-height: 1.4;">
              ${slide.description}
            </span>
          </div>
        ` : ''}

        <!-- Code Terminal Window -->
        <div style="display: flex; flex-direction: column; width: 100%; background: #030712; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; margin-top: 10px;">
          <!-- Window Title Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background: #111827; border-bottom: 1px solid #1f2937;">
            <!-- Traffic light buttons -->
            <div style="display: flex; gap: 8px;">
              <div style="display: flex; width: 14px; height: 14px; border-radius: 9999px; background: #ef4444;"></div>
              <div style="display: flex; width: 14px; height: 14px; border-radius: 9999px; background: #f59e0b;"></div>
              <div style="display: flex; width: 14px; height: 14px; border-radius: 9999px; background: #10b981;"></div>
            </div>
            <!-- Filename / Lang -->
            <div style="display: flex;">
              <span style="font-size: 18px; color: #9ca3af; font-family: NotoSansMono, monospace;">
                ${slide.filename || slide.language || 'code.ts'}
              </span>
            </div>
            <div style="width: 40px; display: flex;"></div>
          </div>

          <!-- Code Content Area -->
          <div style="display: flex; padding: 28px; background: #030712;">
            <span style="font-family: NotoSansMono, monospace; font-size: 22px; color: #e5e7eb; line-height: 1.5; white-space: pre-wrap;">${escapedCode}</span>
          </div>
        </div>

        ${slide.note ? `
          <div style="display: flex; background: ${theme.cardBg}; border: 1px solid ${theme.cardBorder}; border-radius: 12px; padding: 18px 24px;">
            <span style="font-size: 22px; color: ${theme.primary}; font-weight: 700;">
              📌 ${slide.note}
            </span>
          </div>
        ` : ''}
      </div>

      <!-- Footer -->
      ${renderFooter({ handle, isLast: slideIndex === totalSlides, theme })}
    </div>
  `;
}

module.exports = { renderCode };
