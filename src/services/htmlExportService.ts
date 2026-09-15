import { Lead, GeneratedSite, ColorPalette } from '../types';
import { sanitizeFilename } from '../utils/sanitize';
import { cleanPhoneForWhatsapp, formatWhatsappUrl } from '../utils/formatters';
import { buildCompleteSiteHtml } from './generator/templateEngine';
import { SECTION_ICONS } from './generator/sectionRenderer';

export const SVG_ICONS = SECTION_ICONS;
export { cleanPhoneForWhatsapp, formatWhatsappUrl };

/**
 * Generate a standalone, production-ready, accessible HTML site with dynamic styles,
 * SEO schema, OpenGraph tags, responsive layout and niche-adapted structure.
 */
export function generateStandaloneHtml(
  lead: Lead,
  siteData: GeneratedSite,
  colors?: ColorPalette
): string {
  return buildCompleteSiteHtml(lead, siteData, colors);
}

/**
 * Utility to download the HTML file in the browser
 */
export function downloadHtmlFile(filename: string, content: string) {
  const safeName = sanitizeFilename(filename.replace(/\.html$/i, '')) || 'site';
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
