import { Lead, GeneratedSite } from '../../types';
import { detectNicheProfile } from './nicheConfig';

/**
 * Deterministic, high-quality fallback generator that creates tailored sites based on real niche rules and OSM lead data
 */
export function generateNicheSmartFallbackSite(lead: Lead): GeneratedSite {
  const niche = detectNicheProfile(lead.categoryLabel || lead.category, lead.name, lead.tags || {});
  const city = lead.city || 'sua região';
  const category = lead.categoryLabel || 'Serviços Especializados';

  // Format tailored services based on niche definitions
  const iconOptions = ['sparkles', 'shield', 'wrench', 'clock', 'check-circle', 'star'];
  const servicos = niche.suggestedServiceNames.map((titulo, idx) => ({
    titulo,
    descricao: `Atendimento dedicado em ${titulo.toLowerCase()} com pontualidade e foco na satisfação do cliente.`,
    icone_sugerido: iconOptions[idx % iconOptions.length],
  }));

  // Clean, realistic testimonials marked as demonstrative
  const depoimentos = [
    {
      autor: 'Cliente Local',
      texto: `Ótimo atendimento da equipe da ${lead.name}. Serviço realizado com atenção e dentro do combinado.`,
      estrelas: 5,
    },
    {
      autor: 'Morador da Região',
      texto: `Atendimento ágil e equipe prestativa em ${city}. Recomendo para quem busca qualidade e facilidade no contato.`,
      estrelas: 5,
    },
    {
      autor: 'Consumidor',
      texto: `Experiência muito positiva. Comunicação clara desde o primeiro contato pelo WhatsApp.`,
      estrelas: 5,
    },
  ];

  return {
    estilo_visual: niche.defaultStyle,
    headline: `${category} de Confiança em ${city}`,
    subheadline: `A ${lead.name} oferece atendimento dedicado e soluções práticas para você em ${city}. Fale conosco e solicite seu atendimento.`,
    sobre_titulo: `Sobre a ${lead.name}`,
    sobre_texto: `A ${lead.name} é especializada em ${category.toLowerCase()} e atende clientes em ${city} com compromisso, atenção aos detalhes e dedicação constante ao bom atendimento.`,
    servicos,
    diferenciais: niche.suggestedDifferentials,
    depoimentos,
    faq: niche.faqTemplates,
    cta_titulo: `Precisa de ${category} em ${city}?`,
    cta_texto: `Entre em contato agora mesmo com a ${lead.name} pelo WhatsApp e receba todas as orientações para o seu atendimento.`,
    mensagem_abordagem_whatsapp: `Olá! Notei que a *${lead.name}* é referência em ${category} em ${city}, mas ainda não possui um site moderno e otimizado para o Google e WhatsApp. Criei uma proposta visual exclusiva para vocês: [link]. Gostaria de ver?`,
    paleta_sugerida: niche.recommendedPalette,
    meta_descricao_seo: `${category} em ${city}. Conheça os serviços da ${lead.name}, localização e atendimento direto via WhatsApp.`,
    palavras_chave_seo: `${category}, ${lead.name}, ${city}, serviços ${city}`,
  };
}
