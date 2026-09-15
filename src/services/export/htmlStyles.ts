import { ColorPalette } from '../../types';

export function getExportStyles(colors: ColorPalette): string {
  const primaryColor = colors.primaria || '#4f46e5';
  const secondaryColor = colors.secundaria || '#06b6d4';
  const textOnPrimary = colors.texto_sobre_primaria || '#ffffff';

  return `
    :root {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --text-on-primary: ${textOnPrimary};
      --bg-light: #f8fafc;
      --surface: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
      --radius: 16px;
      --radius-sm: 8px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--bg-light);
      color: var(--text-main);
      line-height: 1.6;
      scroll-behavior: smooth;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    .container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Header */
    header {
      position: sticky;
      top: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      z-index: 100;
      padding: 16px 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-box {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-badge {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: var(--primary);
      color: var(--text-on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 18px;
    }

    .logo-name {
      font-weight: 800;
      font-size: 20px;
      color: var(--text-main);
    }

    .btn-header {
      background: var(--primary);
      color: var(--text-on-primary);
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-header:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(6, 182, 212, 0.08) 100%);
      padding: 80px 0 60px;
      text-align: center;
      position: relative;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid var(--border-color);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 24px;
    }

    .hero-title {
      font-size: 44px;
      font-weight: 800;
      line-height: 1.2;
      max-width: 840px;
      margin: 0 auto 20px;
      color: var(--text-main);
    }

    .hero-subtitle {
      font-size: 18px;
      color: var(--text-muted);
      max-width: 640px;
      margin: 0 auto 36px;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn-primary {
      background: var(--primary);
      color: var(--text-on-primary);
      padding: 14px 32px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 16px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.35);
    }

    .btn-outline {
      background: var(--surface);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      padding: 14px 28px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 16px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-outline:hover {
      background: #f1f5f9;
    }

    /* Section Styles */
    section {
      padding: 70px 0;
    }

    .section-header {
      text-align: center;
      max-width: 650px;
      margin: 0 auto 48px;
    }

    .section-tag {
      color: var(--primary);
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .section-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-main);
    }

    /* About Section */
    .about-card {
      background: var(--surface);
      border-radius: var(--radius);
      border: 1px solid var(--border-color);
      padding: 48px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .about-text h3 {
      font-size: 26px;
      font-weight: 800;
      margin-bottom: 16px;
    }

    .about-text p {
      color: var(--text-muted);
      font-size: 16px;
      margin-bottom: 24px;
    }

    .about-visual {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 12px;
      min-height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      padding: 32px;
      text-align: center;
    }

    /* Services Grid */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .service-card {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 28px;
      transition: all 0.2s;
    }

    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.08);
      border-color: var(--primary);
    }

    .service-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      background: rgba(79, 70, 229, 0.1);
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
    }

    .service-card p {
      color: var(--text-muted);
      font-size: 14px;
    }

    /* Differentials Horizontal */
    .diff-section {
      background: var(--surface);
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
    }

    .diff-row {
      display: flex;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .diff-pill {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-light);
      border: 1px solid var(--border-color);
      padding: 14px 24px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 15px;
    }

    .diff-icon {
      color: #10b981;
      display: flex;
    }

    /* Testimonials */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .testimonial-card {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .stars-row {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
    }

    .dep-text {
      font-style: italic;
      color: #334155;
      font-size: 15px;
      margin-bottom: 24px;
      flex-grow: 1;
    }

    .dep-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .dep-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #475569;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dep-name {
      font-weight: 700;
      font-size: 14px;
    }

    /* FAQ */
    .faq-list {
      max-width: 760px;
      margin: 0 auto;
    }

    .faq-item {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      margin-bottom: 12px;
      overflow: hidden;
    }

    .faq-question {
      width: 100%;
      background: none;
      border: none;
      padding: 20px 24px;
      text-align: left;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-main);
    }

    .faq-chevron {
      font-size: 20px;
      font-weight: bold;
      color: var(--primary);
    }

    .faq-answer {
      display: none;
      padding: 0 24px 20px;
      color: var(--text-muted);
      font-size: 15px;
    }

    .faq-answer.open {
      display: block;
    }

    /* Location & Contact Section */
    .location-box {
      background: var(--surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 36px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .info-item {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .info-icon {
      color: var(--primary);
      margin-top: 4px;
    }

    .info-content h4 {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .info-content p {
      color: var(--text-muted);
      font-size: 14px;
    }

    /* Final CTA */
    .cta-section {
      background: linear-gradient(135deg, var(--primary) 0%, #3730a3 100%);
      color: #fff;
      text-align: center;
      padding: 80px 0;
      border-radius: var(--radius);
      margin: 40px auto;
    }

    .cta-section h2 {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 16px;
    }

    .cta-section p {
      font-size: 18px;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 32px;
    }

    .btn-cta-white {
      background: #fff;
      color: var(--primary);
      padding: 16px 36px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 16px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .btn-cta-white:hover {
      transform: scale(1.03);
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--border-color);
      background: var(--surface);
      padding: 40px 0 24px;
      text-align: center;
      font-size: 14px;
      color: var(--text-muted);
    }

    .footer-note {
      font-size: 12px;
      margin-top: 12px;
      color: #94a3b8;
    }

    @media (max-width: 768px) {
      .about-card, .location-box {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 32px;
      }
      .section-title {
        font-size: 26px;
      }
    }
  `;
}
