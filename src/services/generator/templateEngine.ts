import { Lead, GeneratedSite, ColorPalette } from '../../types';
import { escapeHtml } from '../../utils/sanitize';
import { cleanPhoneForWhatsapp } from '../../utils/formatters';
import { detectNicheProfile, VisualStyleType } from './nicheConfig';
import { STYLES_REGISTRY, generateStyleCss } from './styleRegistry';
import {
  renderHeader,
  renderHeroSection,
  renderDifferentials,
  renderServicesSection,
  renderProcessSection,
  renderAboutSection,
  renderTestimonialsSection,
  renderFaqSection,
  renderContactSection,
  renderCtaBanner,
  renderFooter,
  renderSchemaOrgJsonLd,
} from './sectionRenderer';

/**
 * Main Template Engine for generating responsive, accessible, modular HTML sites
 */
export function buildCompleteSiteHtml(
  lead: Lead,
  siteData: GeneratedSite,
  colors?: ColorPalette,
  forcedStyle?: VisualStyleType
): string {
  // Determine niche profile
  const niche = detectNicheProfile(lead.categoryLabel || lead.category, lead.name, lead.tags || {});

  // Determine active visual style (priority: forcedStyle > siteData.estilo_visual > niche default)
  const visualStyle: VisualStyleType =
    forcedStyle || siteData.estilo_visual || niche.defaultStyle || 'MODERN';

  const styleConfig = STYLES_REGISTRY[visualStyle] || STYLES_REGISTRY.MODERN;

  // Active palette
  const activeColors: ColorPalette = colors ||
    siteData.paleta_sugerida ||
    niche.recommendedPalette || {
      primaria: '#4f46e5',
      secundaria: '#06b6d4',
      texto_sobre_primaria: '#ffffff',
    };

  const cleanPhone = cleanPhoneForWhatsapp(lead.phone);
  const locationText = lead.city ? `${lead.city}${lead.state ? ` - ${lead.state}` : ''}` : '';
  const pageTitle = `${lead.name} | ${siteData.headline || lead.categoryLabel}`;

  // Assemble modular body sections
  const headerHtml = renderHeader(lead, cleanPhone);
  const heroHtml = renderHeroSection(lead, siteData, niche.defaultImageTheme, visualStyle, cleanPhone);
  const diffsHtml = renderDifferentials(siteData);
  const servicesHtml = renderServicesSection(siteData);
  const processHtml = renderProcessSection(siteData);
  const aboutHtml = renderAboutSection(lead, siteData, niche.defaultImageTheme);
  const testimonialsHtml = renderTestimonialsSection(siteData);
  const faqHtml = renderFaqSection(siteData);
  const contactHtml = renderContactSection(lead, cleanPhone);
  const ctaBannerHtml = renderCtaBanner(lead, siteData, cleanPhone);
  const footerHtml = renderFooter(lead);
  const schemaJsonLd = renderSchemaOrgJsonLd(lead, siteData);
  const dynamicCss = generateStyleCss(visualStyle, activeColors);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(siteData.meta_descricao_seo)}">
  <meta name="keywords" content="${escapeHtml(siteData.palavras_chave_seo || `${lead.categoryLabel}, ${lead.name}, ${locationText}`)}">
  <meta name="author" content="${escapeHtml(lead.name)}">

  <!-- OpenGraph Meta Tags -->
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(siteData.meta_descricao_seo)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="${escapeHtml(lead.name)}">

  <!-- Dynamic Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${styleConfig.googleFontsUrl}" rel="stylesheet">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
${schemaJsonLd}
  </script>

  <style>
${dynamicCss}
  </style>
</head>
<body>
  ${headerHtml}

  <main>
    ${heroHtml}
    ${diffsHtml}
    ${servicesHtml}
    ${processHtml}
    ${aboutHtml}
    ${testimonialsHtml}
    ${faqHtml}
    ${contactHtml}
    ${ctaBannerHtml}
  </main>

  ${footerHtml}

  <script>
    function toggleFaq(index) {
      var ans = document.getElementById('faq-ans-' + index);
      var btn = document.querySelector('[aria-controls="faq-ans-' + index + '"]');
      var chevron = document.getElementById('faq-chevron-' + index);
      
      if (!ans) return;

      var isOpen = ans.classList.contains('open');
      
      // Close all other FAQs
      var allAnswers = document.querySelectorAll('.faq-answer');
      var allChevrons = document.querySelectorAll('.faq-chevron');
      var allButtons = document.querySelectorAll('.faq-question');
      
      allAnswers.forEach(function(el) { el.classList.remove('open'); });
      allChevrons.forEach(function(el) { el.innerText = '+'; });
      allButtons.forEach(function(el) { el.setAttribute('aria-expanded', 'false'); });

      if (!isOpen) {
        ans.classList.add('open');
        if (chevron) chevron.innerText = '−';
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    }
  </script>
</body>
</html>`;
}
