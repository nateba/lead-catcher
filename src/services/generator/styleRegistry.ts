import { VisualStyleType } from './nicheConfig';
import { ColorPalette } from '../../types';

export interface StyleConfig {
  type: VisualStyleType;
  label: string;
  description: string;
  fontHeading: string;
  fontBody: string;
  googleFontsUrl: string;
  borderRadius: string;
  buttonRadius: string;
  shadowLevel: string;
  headerStyle: 'sticky_glass' | 'solid_clean' | 'dark_luxury' | 'bordered_minimal';
  heroAlignment: 'left' | 'center' | 'split';
  cardTreatment: 'clean_border' | 'solid_shadow' | 'dark_bento' | 'minimal_flat';
  buttonStyle: 'rounded_glow' | 'pill' | 'sharp_bold' | 'soft_outline';
}

export const STYLES_REGISTRY: Record<VisualStyleType, StyleConfig> = {
  MODERN: {
    type: 'MODERN',
    label: 'Modern Clean',
    description: 'Design contemporâneo, tipografia fluida, bordas suaves e gradientes sutis.',
    fontHeading: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    borderRadius: '16px',
    buttonRadius: '12px',
    shadowLevel: '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
    headerStyle: 'sticky_glass',
    heroAlignment: 'split',
    cardTreatment: 'clean_border',
    buttonStyle: 'rounded_glow',
  },

  PREMIUM: {
    type: 'PREMIUM',
    label: 'Premium Dark / Luxury',
    description: 'Estética sofisticada, paleta refinada, detalhes dourados/âmbar e ar institucional.',
    fontHeading: "'Cinzel', 'Playfair Display', serif",
    fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    borderRadius: '12px',
    buttonRadius: '8px',
    shadowLevel: '0 15px 35px -5px rgba(0, 0, 0, 0.35)',
    headerStyle: 'dark_luxury',
    heroAlignment: 'left',
    cardTreatment: 'dark_bento',
    buttonStyle: 'soft_outline',
  },

  LOCAL: {
    type: 'LOCAL',
    label: 'Local Acolhedor',
    description: 'Visual amigável, cores quentes, foco em proximidade humana e contato facilitado.',
    fontHeading: "'DM Sans', system-ui, sans-serif",
    fontBody: "'DM Sans', system-ui, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap',
    borderRadius: '20px',
    buttonRadius: '9999px',
    shadowLevel: '0 8px 24px rgba(0, 0, 0, 0.06)',
    headerStyle: 'solid_clean',
    heroAlignment: 'center',
    cardTreatment: 'solid_shadow',
    buttonStyle: 'pill',
  },

  MINIMAL: {
    type: 'MINIMAL',
    label: 'Minimalista & Técnico',
    description: 'Foco total no conteúdo, alta legibilidade, fundo claro e sem ruído visual.',
    fontHeading: "'Instrument Sans', 'Inter', system-ui, sans-serif",
    fontBody: "'Instrument Sans', 'Inter', system-ui, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap',
    borderRadius: '8px',
    buttonRadius: '6px',
    shadowLevel: 'none',
    headerStyle: 'bordered_minimal',
    heroAlignment: 'left',
    cardTreatment: 'minimal_flat',
    buttonStyle: 'sharp_bold',
  },

  BOLD: {
    type: 'BOLD',
    label: 'Bold & Energético',
    description: 'Títulos imponentes, alto contraste, blocos visuais marcantes e CTAs dinâmicos.',
    fontHeading: "'Syne', 'Outfit', sans-serif",
    fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    borderRadius: '16px',
    buttonRadius: '12px',
    shadowLevel: '0 12px 30px rgba(0, 0, 0, 0.14)',
    headerStyle: 'solid_clean',
    heroAlignment: 'split',
    cardTreatment: 'clean_border',
    buttonStyle: 'sharp_bold',
  },
};

/**
 * Generates the CSS rules dynamically adapted to the specific visual style and palette
 */
export function generateStyleCss(styleType: VisualStyleType, colors: ColorPalette): string {
  const style = STYLES_REGISTRY[styleType] || STYLES_REGISTRY.MODERN;
  const primaryColor = colors.primaria || '#4f46e5';
  const secondaryColor = colors.secundaria || '#06b6d4';
  const textOnPrimary = colors.texto_sobre_primaria || '#ffffff';

  const isDarkTheme = styleType === 'PREMIUM';

  const bgColor = isDarkTheme ? '#090d16' : '#f8fafc';
  const surfaceColor = isDarkTheme ? '#111827' : '#ffffff';
  const surfaceColorAlt = isDarkTheme ? '#1a2234' : '#f1f5f9';
  const textMainColor = isDarkTheme ? '#f8fafc' : '#0f172a';
  const textMutedColor = isDarkTheme ? '#94a3b8' : '#64748b';
  const borderColor = isDarkTheme ? '#1e293b' : '#e2e8f0';

  return `
    :root {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --text-on-primary: ${textOnPrimary};
      --bg: ${bgColor};
      --surface: ${surfaceColor};
      --surface-alt: ${surfaceColorAlt};
      --text-main: ${textMainColor};
      --text-muted: ${textMutedColor};
      --border-color: ${borderColor};
      --radius: ${style.borderRadius};
      --btn-radius: ${style.buttonRadius};
      --shadow: ${style.shadowLevel};
      --font-heading: ${style.fontHeading};
      --font-body: ${style.fontBody};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg);
      color: var(--text-main);
      line-height: 1.65;
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4, .brand-font {
      font-family: var(--font-heading);
      letter-spacing: -0.02em;
    }

    a {
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    .container {
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* HEADER */
    header {
      position: sticky;
      top: 0;
      background: ${isDarkTheme ? 'rgba(9, 13, 22, 0.92)' : 'rgba(255, 255, 255, 0.94)'};
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border-color);
      z-index: 100;
      padding: 16px 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .logo-box {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-badge {
      width: 42px;
      height: 42px;
      border-radius: var(--btn-radius);
      background: var(--primary);
      color: var(--text-on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 17px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      flex-shrink: 0;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-name {
      font-weight: 800;
      font-size: 18px;
      color: var(--text-main);
      line-height: 1.2;
    }

    .logo-tag {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-header {
      background: var(--primary);
      color: var(--text-on-primary);
      padding: 9px 18px;
      border-radius: var(--btn-radius);
      font-weight: 700;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .btn-header:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }

    /* BUTTONS */
    .btn-primary {
      background: var(--primary);
      color: var(--text-on-primary);
      padding: 14px 28px;
      border-radius: var(--btn-radius);
      font-weight: 700;
      font-size: 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
      cursor: pointer;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.22);
      opacity: 0.95;
    }

    .btn-secondary {
      background: var(--surface);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      padding: 14px 24px;
      border-radius: var(--btn-radius);
      font-weight: 600;
      font-size: 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-secondary:hover {
      background: var(--surface-alt);
      border-color: var(--primary);
      color: var(--primary);
    }

    /* HERO SECTION */
    .hero-section {
      padding: 70px 0 60px;
      position: relative;
      overflow: hidden;
      ${isDarkTheme
        ? 'background: radial-gradient(circle at 50% 0%, rgba(217, 119, 6, 0.08) 0%, rgba(9, 13, 22, 1) 70%);'
        : 'background: linear-gradient(180deg, rgba(79, 70, 229, 0.04) 0%, rgba(248, 250, 252, 1) 100%);'}
    }

    .hero-split {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 48px;
      align-items: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: ${isDarkTheme ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
      border: 1px solid var(--border-color);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 20px;
    }

    .hero-title {
      font-size: 44px;
      font-weight: 800;
      line-height: 1.18;
      color: var(--text-main);
      margin-bottom: 18px;
    }

    .hero-subtitle {
      font-size: 18px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 32px;
      max-width: 580px;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .hero-image-box {
      position: relative;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow);
    }

    .hero-image {
      width: 100%;
      height: 380px;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .hero-image-box:hover .hero-image {
      transform: scale(1.02);
    }

    .hero-image-overlay-card {
      position: absolute;
      bottom: 16px;
      left: 16px;
      right: 16px;
      background: ${isDarkTheme ? 'rgba(17, 24, 39, 0.92)' : 'rgba(255, 255, 255, 0.94)'};
      backdrop-filter: blur(8px);
      padding: 14px 18px;
      border-radius: var(--btn-radius);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* SECTIONS GENERAL */
    section {
      padding: 70px 0;
    }

    .section-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 48px;
    }

    .section-tag {
      color: var(--primary);
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1px;
      margin-bottom: 8px;
      display: inline-block;
    }

    .section-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.25;
    }

    .section-subtitle {
      font-size: 16px;
      color: var(--text-muted);
      margin-top: 10px;
    }

    /* DIFFERENTIALS */
    .diff-bar {
      background: var(--surface);
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      padding: 24px 0;
    }

    .diff-grid {
      display: flex;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .diff-item {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--surface-alt);
      border: 1px solid var(--border-color);
      padding: 10px 20px;
      border-radius: var(--btn-radius);
      font-weight: 600;
      font-size: 14px;
    }

    .diff-icon {
      color: #10b981;
      display: flex;
      align-items: center;
    }

    /* SERVICES */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
    }

    .service-card {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 28px;
      transition: all 0.25s ease;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
    }

    .service-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary);
    }

    .service-icon-box {
      width: 48px;
      height: 48px;
      border-radius: var(--btn-radius);
      background: ${isDarkTheme ? 'rgba(30, 41, 59, 0.8)' : 'rgba(79, 70, 229, 0.08)'};
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
    }

    .service-card h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--text-main);
    }

    .service-card p {
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.6;
      flex-grow: 1;
    }

    /* PROCESS / HOW IT WORKS */
    .process-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .process-card {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 28px;
      position: relative;
    }

    .process-num {
      font-family: var(--font-heading);
      font-size: 28px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 12px;
      opacity: 0.9;
    }

    .process-card h3 {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .process-card p {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.55;
    }

    /* ABOUT */
    .about-card {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 44px;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 40px;
      align-items: center;
      box-shadow: var(--shadow);
    }

    .about-text h3 {
      font-size: 26px;
      font-weight: 800;
      margin-bottom: 16px;
      color: var(--text-main);
    }

    .about-text p {
      color: var(--text-muted);
      font-size: 15px;
      line-height: 1.7;
      margin-bottom: 24px;
    }

    .about-image-box {
      border-radius: var(--btn-radius);
      overflow: hidden;
      border: 1px solid var(--border-color);
      max-height: 320px;
    }

    .about-image {
      width: 100%;
      height: 320px;
      object-fit: cover;
    }

    /* TESTIMONIALS (EXPLICITLY MARKED AS DEMO) */
    .demo-notice {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      background: var(--surface-alt);
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid var(--border-color);
      margin-top: 12px;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .testimonial-card {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: var(--shadow);
    }

    .stars-row {
      display: flex;
      gap: 4px;
      margin-bottom: 14px;
    }

    .dep-text {
      font-style: italic;
      color: var(--text-main);
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 20px;
      flex-grow: 1;
    }

    .dep-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .dep-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--surface-alt);
      color: var(--primary);
      font-weight: 800;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-color);
    }

    .dep-name {
      font-weight: 700;
      font-size: 13px;
    }

    /* FAQ */
    .faq-list {
      max-width: 760px;
      margin: 0 auto;
    }

    .faq-item {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: var(--btn-radius);
      margin-bottom: 12px;
      overflow: hidden;
    }

    .faq-question {
      width: 100%;
      background: none;
      border: none;
      padding: 18px 24px;
      text-align: left;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-main);
    }

    .faq-chevron {
      font-size: 18px;
      font-weight: bold;
      color: var(--primary);
    }

    .faq-answer {
      display: none;
      padding: 0 24px 18px;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.6;
    }

    .faq-answer.open {
      display: block;
    }

    /* LOCATION & CONTACT */
    .contact-card {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 36px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      box-shadow: var(--shadow);
    }

    .info-item {
      display: flex;
      gap: 14px;
      margin-bottom: 20px;
    }

    .info-icon {
      color: var(--primary);
      margin-top: 3px;
      flex-shrink: 0;
    }

    .info-content h4 {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 3px;
    }

    .info-content p {
      color: var(--text-muted);
      font-size: 13px;
      line-height: 1.5;
    }

    .map-preview-box {
      background: var(--surface-alt);
      border: 1px solid var(--border-color);
      border-radius: var(--btn-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      text-align: center;
      padding: 24px;
    }

    /* FINAL CTA */
    .cta-banner {
      background: ${isDarkTheme
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)'};
      color: #ffffff;
      text-align: center;
      padding: 60px 24px;
      border-radius: var(--radius);
      margin: 40px auto 0;
      border: 1px solid ${isDarkTheme ? 'var(--border-color)' : 'transparent'};
      box-shadow: var(--shadow);
    }

    .cta-banner h2 {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 14px;
      color: #ffffff;
    }

    .cta-banner p {
      font-size: 16px;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 28px;
    }

    .btn-cta-action {
      background: #ffffff;
      color: #0f172a;
      padding: 15px 32px;
      border-radius: var(--btn-radius);
      font-weight: 700;
      font-size: 15px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    }

    .btn-cta-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
    }

    /* FOOTER */
    footer {
      border-top: 1px solid var(--border-color);
      background: var(--surface);
      padding: 40px 0 24px;
      text-align: center;
      font-size: 13px;
      color: var(--text-muted);
    }

    .footer-note {
      font-size: 11px;
      margin-top: 8px;
      color: var(--text-muted);
      opacity: 0.7;
    }

    /* RESPONSIVE BREAKPOINTS (1440, 1024, 768, 430, 390) */
    @media (max-width: 992px) {
      .hero-split, .about-card, .contact-card {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      .hero-title {
        font-size: 36px;
      }
      .hero-image {
        height: 280px;
      }
    }

    @media (max-width: 640px) {
      section {
        padding: 50px 0;
      }
      .hero-title {
        font-size: 28px;
      }
      .hero-subtitle {
        font-size: 16px;
      }
      .section-title {
        font-size: 24px;
      }
      .about-card, .contact-card {
        padding: 24px;
      }
      .hero-actions {
        flex-direction: column;
        width: 100%;
      }
      .hero-actions a {
        width: 100%;
        text-align: center;
      }
    }
  `;
}
