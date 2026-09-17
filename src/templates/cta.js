const { renderHeader, renderFooter } = require('./common');

function renderCta(slide, { slideIndex, totalSlides, handle, theme }) {
  const actions = slide.actions || [
    { icon: '💾', text: 'Salve este post para consultar mais tarde' },
    { icon: '🚀', text: 'Compartilhe com quem programa na sua rede' },
    { icon: '💬', text: 'Deixe sua opinião nos comentários' }
  ];

  return `
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-between; padding: 70px; background-color: ${theme.bg};">
      <!-- Header -->
      ${renderHeader({ tag: slide.tag || 'CONCLUSÃO', slideIndex, totalSlides, theme })}

      <!-- Body Content -->
      <div style="display: flex; flex-direction: column; gap: 32px; width: 100%; flex: 1; justify-content: center;">
        <!-- Title -->
        <div style="display: flex;">
          <span style="font-size: 52px; font-weight: 700; color: ${theme.textMain}; line-height: 1.2;">
            ${slide.title || 'Resumo da Edição'}
          </span>
        </div>

        ${slide.takeaway ? `
          <div style="display: flex; background: ${theme.accentBadgeBg}; border: 1.5px solid ${theme.accentBadgeBorder}; border-radius: 16px; padding: 26px 32px;">
            <span style="font-size: 26px; color: ${theme.primary}; font-weight: 700; line-height: 1.4;">
              💡 Takeaway: ${slide.takeaway}
            </span>
          </div>
        ` : ''}

        <!-- Action Items -->
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; margin-top: 10px;">
          ${actions.map(action => `
            <div style="display: flex; align-items: center; gap: 20px; background: ${theme.cardBg}; border: 1px solid ${theme.cardBorder}; border-radius: 16px; padding: 20px 28px;">
              <span style="font-size: 32px;">${action.icon || '👉'}</span>
              <span style="font-size: 24px; font-weight: 600; color: ${theme.textMain};">${action.text}</span>
            </div>
          `).join('')}
        </div>

        <!-- Follow Box -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 10px;">
          <span style="font-size: 24px; color: ${theme.textMuted};">Siga para novidades diárias:</span>
          <span style="font-size: 26px; font-weight: 700; color: ${theme.primary};">${handle || '@tech.newsletter'}</span>
        </div>
      </div>

      <!-- Footer -->
      ${renderFooter({ handle, isLast: true, theme })}
    </div>
  `;
}

module.exports = { renderCta };
