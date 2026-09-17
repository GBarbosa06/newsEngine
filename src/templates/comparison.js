const { renderHeader, renderFooter } = require('./common');

function renderComparison(slide, { slideIndex, totalSlides, handle, theme }) {
  const left = slide.left || { title: 'Antes', points: [] };
  const right = slide.right || { title: 'Agora', points: [] };

  return `
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-between; padding: 70px; background-color: ${theme.bg};">
      <!-- Header -->
      ${renderHeader({ tag: slide.tag, slideIndex, totalSlides, theme })}

      <!-- Body Content -->
      <div style="display: flex; flex-direction: column; gap: 28px; width: 100%; flex: 1; justify-content: center;">
        <!-- Title -->
        <div style="display: flex;">
          <span style="font-size: 48px; font-weight: 700; color: ${theme.textMain}; line-height: 1.2;">
            ${slide.title}
          </span>
        </div>

        ${slide.subtitle ? `
          <div style="display: flex;">
            <span style="font-size: 26px; font-weight: 400; color: ${theme.textMuted}; line-height: 1.4;">
              ${slide.subtitle}
            </span>
          </div>
        ` : ''}

        <!-- Comparison Columns / Cards -->
        <div style="display: flex; gap: 24px; width: 100%; margin-top: 10px;">
          <!-- Left Column (Before / Problem) -->
          <div style="display: flex; flex-direction: column; flex: 1; background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.25); border-radius: 20px; padding: 28px; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 26px; font-weight: 700; color: #f87171;">
                ❌ ${left.title || 'Antes'}
              </span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 6px;">
              ${(left.points || []).map(pt => `
                <div style="display: flex; gap: 10px; align-items: flex-start;">
                  <span style="font-size: 22px; color: #fca5a5; line-height: 1.35;">• ${pt}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right Column (Now / Solution) -->
          <div style="display: flex; flex-direction: column; flex: 1; background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.3); border-radius: 20px; padding: 28px; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 26px; font-weight: 700; color: #34d399;">
                ✅ ${right.title || 'Agora'}
              </span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 6px;">
              ${(right.points || []).map(pt => `
                <div style="display: flex; gap: 10px; align-items: flex-start;">
                  <span style="font-size: 22px; color: #a7f3d0; line-height: 1.35;">• ${pt}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      ${renderFooter({ handle, isLast: slideIndex === totalSlides, theme })}
    </div>
  `;
}

module.exports = { renderComparison };
