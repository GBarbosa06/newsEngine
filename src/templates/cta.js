const { renderHeader, renderFooter } = require('./common');

function getActionIcon(icon, color) {
  const iconStr = String(icon || '').toLowerCase();
  if (iconStr.includes('salve') || iconStr.includes('save') || iconStr === '💾') {
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
  }
  if (iconStr.includes('compartilhe') || iconStr.includes('share') || iconStr === '🚀' || iconStr.includes('time')) {
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;
  }
  if (iconStr.includes('coment') || iconStr === '💬' || iconStr.includes('opini') || iconStr.includes('primeiro')) {
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
  }
  return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
}

function renderCta(slide, { slideIndex, totalSlides, handle, theme }) {
  const actions = slide.actions || [
    { icon: 'save', text: 'Salve este post para consultar mais tarde' },
    { icon: 'share', text: 'Compartilhe com quem programa na sua rede' },
    { icon: 'comment', text: 'Deixe sua opinião nos comentários' }
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
          <div style="display: flex; align-items: center; background: ${theme.accentBadgeBg}; border: 1.5px solid ${theme.accentBadgeBorder}; border-radius: 16px; padding: 26px 32px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${theme.primary}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 14px; flex-shrink: 0;">
              <path d="M9 18h6"></path>
              <path d="M10 22h4"></path>
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
            </svg>
            <span style="font-size: 26px; color: ${theme.primary}; font-weight: 700; line-height: 1.4;">
              Takeaway: ${slide.takeaway}
            </span>
          </div>
        ` : ''}

        <!-- Action Items -->
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; margin-top: 10px;">
          ${actions.map(action => `
            <div style="display: flex; align-items: center; gap: 20px; background: ${theme.cardBg}; border: 1px solid ${theme.cardBorder}; border-radius: 16px; padding: 20px 28px;">
              <div style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; background: ${theme.accentBadgeBg}; flex-shrink: 0;">
                ${getActionIcon(action.icon || action.text, theme.primary)}
              </div>
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
