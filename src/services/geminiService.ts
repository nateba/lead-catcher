import { Lead, GeneratedSite } from '../types';
import { authHeaders } from '../lib/apiAuth';

export interface GenerateSiteOptions {
  customInstructions?: string;
}

export async function generateSiteContent(
  lead: Lead,
  options?: GenerateSiteOptions
): Promise<GeneratedSite> {
  const response = await fetch('/api/generate-site', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({
      name: lead.name,
      category: lead.categoryLabel,
      city: lead.city,
      state: lead.state,
      address: lead.address,
      phone: lead.phone,
      opening_hours: lead.opening_hours,
      customInstructions: options?.customInstructions,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro ao gerar site: HTTP ${response.status}`);
  }

  const result = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Resposta inválida do Gemini AI');
  }

  return result.data as GeneratedSite;
}

export async function regenerateTestimonials(
  lead: Lead
): Promise<GeneratedSite['depoimentos']> {
  const response = await fetch('/api/regenerate-testimonials', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({
      name: lead.name,
      category: lead.categoryLabel,
      city: lead.city,
    }),
  });

  if (!response.ok) {
    throw new Error('Falha ao regenerar depoimentos');
  }

  const result = await response.json();
  return result.depoimentos || [];
}
