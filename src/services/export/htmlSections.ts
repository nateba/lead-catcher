import { Lead, GeneratedSite } from '../../types';
import { escapeHtml } from '../../utils/sanitize';
import { cleanPhoneForWhatsapp } from '../../utils/formatters';

export const SVG_ICONS: Record<string, string> = {
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
  whatsapp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
  mapPin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  sparkles: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>',
};

export function renderServicesHtml(siteData: GeneratedSite): string {
  return siteData.servicos
    .map(
      (srv) => `
    <div class="service-card">
      <div class="service-icon-box">
        ${SVG_ICONS.sparkles}
      </div>
      <h3>${escapeHtml(srv.titulo)}</h3>
      <p>${escapeHtml(srv.descricao)}</p>
    </div>`
    )
    .join('\n');
}

export function renderDifferentialsHtml(siteData: GeneratedSite): string {
  return siteData.diferenciais
    .map(
      (diff) => `
    <div class="diff-pill">
      <div class="diff-icon">${SVG_ICONS.check}</div>
      <span>${escapeHtml(diff)}</span>
    </div>`
    )
    .join('\n');
}

export function renderTestimonialsHtml(siteData: GeneratedSite): string {
  return siteData.depoimentos
    .map(
      (dep) => `
    <div class="testimonial-card">
      <div class="stars-row">
        ${Array(dep.estrelas || 5)
          .fill(SVG_ICONS.star)
          .join('')}
      </div>
      <p class="dep-text">"${escapeHtml(dep.texto)}"</p>
      <div class="dep-author">
        <div class="dep-avatar">${dep.autor ? dep.autor.charAt(0) : 'C'}</div>
        <span class="dep-name">${escapeHtml(dep.autor)}</span>
      </div>
    </div>`
    )
    .join('\n');
}

export function renderFaqHtml(siteData: GeneratedSite): string {
  return siteData.faq
    .map(
      (f, idx) => `
    <div class="faq-item">
      <button class="faq-question" onclick="toggleFaq(${idx})">
        <span>${escapeHtml(f.pergunta)}</span>
        <span class="faq-chevron" id="faq-chevron-${idx}">+</span>
      </button>
      <div class="faq-answer" id="faq-ans-${idx}">
        <p>${escapeHtml(f.resposta)}</p>
      </div>
    </div>`
    )
    .join('\n');
}
