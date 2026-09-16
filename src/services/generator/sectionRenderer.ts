import { Lead, GeneratedSite, ColorPalette } from '../../types';
import { escapeHtml } from '../../utils/sanitize';
import { cleanPhoneForWhatsapp, formatWhatsappUrl } from '../../utils/formatters';
import { VisualStyleType } from './nicheConfig';
import { getNicheImages } from './curatedImages';

export const SECTION_ICONS: Record<string, string> = {
  check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
  whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
  mapPin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  sparkles: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>',
  shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  info: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
};

/**
 * Render Header
 */
export function renderHeader(lead: Lead, cleanPhone?: string): string {
  const hasPhone = Boolean(lead.phone && lead.phone.trim().length > 0);
  const waUrl = cleanPhone ? formatWhatsappUrl(lead.phone, `Olá! Encontrei a ${lead.name} e gostaria de informações.`) : '#contato';

  return `
  <header>
    <div class="container header-content">
      <div class="logo-box">
        <div class="logo-badge">${escapeHtml(lead.initials || 'EM')}</div>
        <div class="logo-text">
          <span class="logo-name">${escapeHtml(lead.name)}</span>
          <span class="logo-tag">${escapeHtml(lead.categoryLabel || 'Atendimento Local')}</span>
        </div>
      </div>
      <div class="header-actions">
        ${hasPhone ? `
        <a href="${cleanPhone ? waUrl : '#contato'}" ${cleanPhone ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-header">
          ${cleanPhone ? SECTION_ICONS.whatsapp : SECTION_ICONS.phone}
          <span>${cleanPhone ? 'WhatsApp' : 'Fale Conosco'}</span>
        </a>` : `
        <a href="#contato" class="btn-header">
          <span>Localização & Contato</span>
        </a>`}
      </div>
    </div>
  </header>`;
}

/**
 * Render Hero Section with contextual split or centered layout
 */
export function renderHeroSection(
  lead: Lead,
  siteData: GeneratedSite,
  nicheTheme: string,
  styleType: VisualStyleType,
  cleanPhone?: string
): string {
  const images = getNicheImages(nicheTheme);
  const waLink = cleanPhone ? formatWhatsappUrl(lead.phone, `Olá! Gostaria de mais informações sobre os serviços da ${lead.name}.`) : null;
  const locationLabel = lead.city ? `${lead.city}${lead.state ? ` - ${lead.state}` : ''}` : 'Atendimento Local';

  return `
  <section class="hero-section">
    <div class="container">
      <div class="hero-split">
        <div>
          <div class="hero-badge">
            ${SECTION_ICONS.sparkles} ${escapeHtml(lead.categoryLabel)} em ${escapeHtml(locationLabel)}
          </div>
          <h1 class="hero-title">${escapeHtml(siteData.headline)}</h1>
          <p class="hero-subtitle">${escapeHtml(siteData.subheadline)}</p>
          <div class="hero-actions">
            ${waLink ? `
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-primary">
              ${SECTION_ICONS.whatsapp} Falar pelo WhatsApp
            </a>` : `
            <a href="#contato" class="btn-primary">
              ${SECTION_ICONS.phone} Entrar em Contato
            </a>`}
            <a href="#servicos" class="btn-secondary">
              Ver Serviços ${SECTION_ICONS.arrowRight}
            </a>
          </div>
        </div>

        <div class="hero-image-box">
          <img src="${images.hero}" alt="${escapeHtml(images.altHero || lead.name)}" class="hero-image" loading="lazy" />
          <div class="hero-image-overlay-card">
            <div style="color: var(--primary);">${SECTION_ICONS.mapPin}</div>
            <div>
              <strong style="display: block; font-size: 13px; color: var(--text-main);">${escapeHtml(lead.name)}</strong>
              <span style="font-size: 11px; color: var(--text-muted);">${escapeHtml(locationLabel)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

/**
 * Render Differentials Bar
 */
export function renderDifferentials(siteData: GeneratedSite): string {
  if (!siteData.diferenciais || siteData.diferenciais.length === 0) return '';

  const items = siteData.diferenciais
    .map(
      (diff) => `
    <div class="diff-item">
      <div class="diff-icon">${SECTION_ICONS.check}</div>
      <span>${escapeHtml(diff)}</span>
    </div>`
    )
    .join('\n');

  return `
  <div class="diff-bar">
    <div class="container">
      <div class="diff-grid">
        ${items}
      </div>
    </div>
  </div>`;
}

/**
 * Render Services Section
 */
export function renderServicesSection(siteData: GeneratedSite): string {
  if (!siteData.servicos || siteData.servicos.length === 0) return '';

  const cards = siteData.servicos
    .map(
      (srv) => `
    <div class="service-card">
      <div class="service-icon-box">
        ${SECTION_ICONS.sparkles}
      </div>
      <h3>${escapeHtml(srv.titulo)}</h3>
      <p>${escapeHtml(srv.descricao)}</p>
    </div>`
    )
    .join('\n');

  return `
  <section id="servicos">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Serviços & Atendimento</span>
        <h2 class="section-title">Soluções Dedicadas Para Você</h2>
        <p class="section-subtitle">Conheça as principais opções disponíveis para atender sua necessidade.</p>
      </div>
      <div class="services-grid">
        ${cards}
      </div>
    </div>
  </section>`;
}

/**
 * Render Safe Process (Como Funciona) Section
 */
export function renderProcessSection(siteData: GeneratedSite): string {
  // If siteData has specific steps or fallback to safe steps
  const steps = [
    { num: '01', title: 'Contato & Solicitação', desc: 'Envie sua mensagem pelo WhatsApp ou telefone explicando sua demanda.' },
    { num: '02', title: 'Alinhamento & Orçamento', desc: 'Apresentamos com total clareza as condições e orientações necessárias.' },
    { num: '03', title: 'Atendimento & Conclusão', desc: 'Execução dedicada com foco na qualidade e no seu resultado.' },
  ];

  const stepsHtml = steps
    .map(
      (s) => `
    <div class="process-card">
      <div class="process-num">${s.num}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>`
    )
    .join('\n');

  return `
  <section id="como-funciona" style="background: var(--surface-alt);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Como Funciona</span>
        <h2 class="section-title">Atendimento Simples e Sem Burocracia</h2>
        <p class="section-subtitle">Processo transparente desde o primeiro contato até a entrega.</p>
      </div>
      <div class="process-grid">
        ${stepsHtml}
      </div>
    </div>
  </section>`;
}

/**
 * Render About Section
 */
export function renderAboutSection(lead: Lead, siteData: GeneratedSite, nicheTheme: string): string {
  const images = getNicheImages(nicheTheme);
  const locationText = lead.city ? ` em ${lead.city}` : '';

  return `
  <section id="sobre">
    <div class="container">
      <div class="about-card">
        <div class="about-text">
          <span class="section-tag">Sobre Nós</span>
          <h3>${escapeHtml(siteData.sobre_titulo || `Conheça a ${lead.name}`)}</h3>
          <p>${escapeHtml(siteData.sobre_texto)}</p>
          ${lead.phone ? `
          <div style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: var(--primary);">
            ${SECTION_ICONS.phone} <span>Atendimento Direto: ${escapeHtml(lead.phone)}</span>
          </div>` : ''}
        </div>
        <div class="about-image-box">
          <img src="${images.about}" alt="${escapeHtml(lead.name)}${locationText}" class="about-image" loading="lazy" />
        </div>
      </div>
    </div>
  </section>`;
}

/**
 * Render Testimonials (Explicitly Marked as Demonstrative)
 */
export function renderTestimonialsSection(siteData: GeneratedSite): string {
  if (!siteData.depoimentos || siteData.depoimentos.length === 0) return '';

  const cards = siteData.depoimentos
    .map(
      (dep) => `
    <div class="testimonial-card">
      <div class="stars-row">
        ${Array(dep.estrelas || 5).fill(SECTION_ICONS.star).join('')}
      </div>
      <p class="dep-text">"${escapeHtml(dep.texto)}"</p>
      <div class="dep-author">
        <div class="dep-avatar">${dep.autor ? dep.autor.charAt(0) : 'C'}</div>
        <span class="dep-name">${escapeHtml(dep.autor)}</span>
      </div>
    </div>`
    )
    .join('\n');

  return `
  <section id="depoimentos" style="background: var(--surface-alt);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Avaliações & Experiências</span>
        <h2 class="section-title">Satisfação de Quem Já Conhece</h2>
        <div class="demo-notice">
          ${SECTION_ICONS.info} <span>Exemplos demonstrativos de satisfação de clientes</span>
        </div>
      </div>
      <div class="testimonials-grid">
        ${cards}
      </div>
    </div>
  </section>`;
}

/**
 * Render FAQ Section
 */
export function renderFaqSection(siteData: GeneratedSite): string {
  if (!siteData.faq || siteData.faq.length === 0) return '';

  const items = siteData.faq
    .map(
      (f, idx) => `
    <div class="faq-item">
      <button class="faq-question" type="button" onclick="toggleFaq(${idx})" aria-expanded="false" aria-controls="faq-ans-${idx}">
        <span>${escapeHtml(f.pergunta)}</span>
        <span class="faq-chevron" id="faq-chevron-${idx}">+</span>
      </button>
      <div class="faq-answer" id="faq-ans-${idx}">
        <p>${escapeHtml(f.resposta)}</p>
      </div>
    </div>`
    )
    .join('\n');

  return `
  <section id="faq">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Dúvidas Frequentes</span>
        <h2 class="section-title">Perguntas Comuns</h2>
        <p class="section-subtitle">Tire suas dúvidas sobre nossos serviços e atendimento.</p>
      </div>
      <div class="faq-list">
        ${items}
      </div>
    </div>
  </section>`;
}

/**
 * Render Location & Contact Section (Strictly using verified data)
 */
export function renderContactSection(lead: Lead, cleanPhone?: string): string {
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.name} ${lead.city} ${lead.state}`)}`;

  return `
  <section id="contato" style="background: var(--surface-alt);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Atendimento & Localização</span>
        <h2 class="section-title">Entre em Contato Conosco</h2>
        <p class="section-subtitle">Estamos prontos para atender você com agilidade e atenção.</p>
      </div>

      <div class="contact-card">
        <div>
          ${lead.address ? `
          <div class="info-item">
            <div class="info-icon">${SECTION_ICONS.mapPin}</div>
            <div class="info-content">
              <h4>Endereço</h4>
              <p>${escapeHtml(lead.address)}</p>
            </div>
          </div>` : `
          <div class="info-item">
            <div class="info-icon">${SECTION_ICONS.mapPin}</div>
            <div class="info-content">
              <h4>Região de Atendimento</h4>
              <p>${escapeHtml(lead.city)}${lead.state ? ` - ${escapeHtml(lead.state)}` : ''}</p>
            </div>
          </div>`}

          ${lead.phone ? `
          <div class="info-item">
            <div class="info-icon">${SECTION_ICONS.phone}</div>
            <div class="info-content">
              <h4>Telefone ${cleanPhone ? '& WhatsApp' : ''}</h4>
              <p>${escapeHtml(lead.phone)}</p>
            </div>
          </div>` : ''}

          ${lead.opening_hours ? `
          <div class="info-item">
            <div class="info-icon">${SECTION_ICONS.clock}</div>
            <div class="info-content">
              <h4>Horário de Funcionamento</h4>
              <p>${escapeHtml(lead.opening_hours)}</p>
            </div>
          </div>` : ''}
        </div>

        <div class="map-preview-box">
          <div>
            <div style="color: var(--primary); margin-bottom: 8px;">${SECTION_ICONS.mapPin}</div>
            <strong style="display: block; font-size: 15px; margin-bottom: 6px; color: var(--text-main);">${escapeHtml(lead.name)}</strong>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">${escapeHtml(lead.city)}${lead.state ? `, ${escapeHtml(lead.state)}` : ''}</p>
            <a href="${mapSearchUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding: 8px 16px; font-size: 12px;">
              Abrir no Google Maps ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

/**
 * Render Final CTA Banner
 */
export function renderCtaBanner(lead: Lead, siteData: GeneratedSite, cleanPhone?: string): string {
  const waUrl = cleanPhone ? formatWhatsappUrl(lead.phone, `Olá! Vim pelo site da ${lead.name} e gostaria de solicitar um atendimento.`) : '#contato';

  return `
  <div class="container">
    <div class="cta-banner">
      <h2>${escapeHtml(siteData.cta_titulo)}</h2>
      <p>${escapeHtml(siteData.cta_texto)}</p>
      <a href="${waUrl}" ${cleanPhone ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-cta-action">
        ${cleanPhone ? SECTION_ICONS.whatsapp : SECTION_ICONS.phone}
        <span>${cleanPhone ? 'Falar Agora no WhatsApp' : 'Entrar em Contato'}</span>
      </a>
    </div>
  </div>`;
}

/**
 * Render Footer
 */
export function renderFooter(lead: Lead): string {
  return `
  <footer>
    <div class="container">
      <p><strong>${escapeHtml(lead.name)}</strong> — ${escapeHtml(lead.city)}${lead.state ? `, ${escapeHtml(lead.state)}` : ''}</p>
      <p class="footer-note">Página modelo desenvolvida com HypeLeads • ${new Date().getFullYear()}</p>
    </div>
  </footer>`;
}

/**
 * Render Schema.org LocalBusiness JSON-LD (Strictly based on verified data, never hallucinated)
 */
export function renderSchemaOrgJsonLd(lead: Lead, siteData: GeneratedSite): string {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: lead.name,
    description: siteData.meta_descricao_seo,
  };

  if (lead.phone) {
    schema.telephone = lead.phone;
  }

  if (lead.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: lead.street ? `${lead.street}${lead.housenumber ? `, ${lead.housenumber}` : ''}` : lead.address,
      addressLocality: lead.city,
      addressRegion: lead.state,
      addressCountry: 'BR',
    };
  }

  if (lead.lat && lead.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: lead.lat,
      longitude: lead.lng,
    };
  }

  if (lead.opening_hours) {
    schema.openingHours = lead.opening_hours;
  }

  return JSON.stringify(schema, null, 2);
}
