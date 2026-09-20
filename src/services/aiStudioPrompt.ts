import { Lead } from '../types';
import { detectNicheProfile, NicheDefinition } from './generator/nicheConfig';
import { SITE_COLORS, type SiteColor } from '../data/siteColors';

// Maps an arbitrary hex to the closest named swatch, so the picker always shows
// a real option instead of an unnamed custom colour.
function nearestSiteColor(hex: string): SiteColor {
  const parse = (h: string) => {
    const clean = h.replace('#', '');
    return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) || 0);
  };
  const [r, g, b] = parse(hex);

  return SITE_COLORS.reduce((best, color) => {
    const [cr, cg, cb] = parse(color.hex);
    const distance = (cr - r) ** 2 + (cg - g) ** 2 + (cb - b) ** 2;
    const [br, bg, bb] = parse(best.hex);
    const bestDistance = (br - r) ** 2 + (bg - g) ** 2 + (bb - b) ** 2;
    return distance < bestDistance ? color : best;
  }, SITE_COLORS[0]);
}

export const AI_STUDIO_URL = 'https://aistudio.google.com/apps';

// AI Studio accepts the brief straight in the query string, so the prompt
// arrives already filled in instead of relying on the user pasting it.
export function buildAiStudioUrl(prompt: string): string {
  const params = new URLSearchParams({
    prompt,
    utm_source: 'organic',
    utm_campaign: '',
    utm_medium: '',
    utm_content: '',
    utm_term: '',
  });
  return `${AI_STUDIO_URL}?${params.toString()}`;
}

export interface SiteIdentity {
  siteName: string;
  primaryColorName: string;
  primaryColorHex: string;
  secondaryColorName: string;
  secondaryColorHex: string;
  address: string;
  phone: string;
  features: string[];
}

export const AVAILABLE_FEATURES = [
  'Agendamento Online',
  'Cardápio Digital',
  'SEO Avançado',
  'Micro-interações premium',
  'Otimização de performance extrema',
  'Copywriting magnético',
  'Design responsivo fluido',
  'Galeria de fotos',
  'Depoimentos de clientes',
  'Integração com WhatsApp',
];

// Per-niche flavour for the prompt. Falls back to the generic entry, so a niche
// missing here still produces a complete brief.
const NICHE_FLAVOUR: Record<
  string,
  { objective: string; styleRef: string; typography: string; sections: string; brief: string }
> = {
  restaurant: {
    objective: 'gerar-pedidos',
    styleRef: 'cardapio-digital',
    typography: 'Playfair Display + Raleway',
    sections: 'inicio → cardapio → localizacao → contato',
    brief:
      'Visual quente e acolhedor com um fundo sofisticado que maximize o contraste com as cores primárias. Use fontes display bold para títulos e uma fonte corpo clean. Seções: Hero com imagem apetitosa do prato principal, seção "Cardápio" com cards dos itens (com preço e descrição), seção "Sobre Nós" contando a história da casa, seção "Contato" com endereço, telefone, horário e formulário de pedido/reserva. Footer simples.',
  },
  barbershop: {
    objective: 'gerar-agendamentos',
    styleRef: 'barbearia-premium',
    typography: 'Bebas Neue + Inter Tight',
    sections: 'inicio → servicos → galeria → contato',
    brief:
      'Visual masculino e sofisticado, com bastante contraste e textura. Hero com foto de corte em andamento, seção "Serviços" com preços claros, seção de galeria com trabalhos reais e seção "Contato" com agendamento e localização.',
  },
  clinic: {
    objective: 'gerar-consultas',
    styleRef: 'clinica-clean',
    typography: 'Fraunces + Karla',
    sections: 'inicio → especialidades → sobre → contato',
    brief:
      'Visual limpo, arejado e confiável, transmitindo cuidado e profissionalismo. Hero sereno, seção de especialidades com ícones discretos, seção sobre a equipe e seção de contato com agendamento.',
  },
  law: {
    objective: 'gerar-contatos',
    styleRef: 'advocacia-institucional',
    typography: 'Cormorant Garamond + Source Sans 3',
    sections: 'inicio → areas-de-atuacao → sobre → contato',
    brief:
      'Visual sóbrio e imponente, com tipografia serifada e muito respiro. Hero institucional, seção de áreas de atuação, seção sobre o escritório e contato direto.',
  },
  fitness: {
    objective: 'gerar-matriculas',
    styleRef: 'academia-energetica',
    typography: 'Archivo Black + Space Grotesk',
    sections: 'inicio → modalidades → estrutura → contato',
    brief:
      'Visual energético e de alto contraste, com fotos em movimento. Hero impactante, seção de modalidades, seção de estrutura com fotos amplas e contato com chamada para aula experimental.',
  },
  pet: {
    objective: 'gerar-agendamentos',
    styleRef: 'petshop-afetivo',
    typography: 'Baloo 2 + Nunito Sans',
    sections: 'inicio → servicos → galeria → contato',
    brief:
      'Visual afetivo e alegre, sem ser infantil. Hero com foto de pet feliz, seção de serviços (banho, tosa, veterinário), galeria de clientes e contato com agendamento.',
  },
  workshop: {
    objective: 'gerar-orcamentos',
    styleRef: 'oficina-tecnica',
    typography: 'Oswald + IBM Plex Sans',
    sections: 'inicio → servicos → diferenciais → contato',
    brief:
      'Visual técnico e robusto, com senso de confiança e precisão. Hero com oficina em operação, seção de serviços objetiva, diferenciais em destaque e contato para orçamento.',
  },
  realestate: {
    objective: 'gerar-contatos',
    styleRef: 'imobiliaria-editorial',
    typography: 'DM Serif Display + Inter Tight',
    sections: 'inicio → imoveis → sobre → contato',
    brief:
      'Visual editorial e elegante, com fotos grandes de imóveis. Hero com destaque, seção de imóveis em grid assimétrico, seção sobre a corretora e contato.',
  },
  hvac: {
    objective: 'gerar-orcamentos',
    styleRef: 'climatizacao-tecnica',
    typography: 'Sora + Inter Tight',
    sections: 'inicio → servicos → diferenciais → contato',
    brief:
      'Visual técnico e limpo, sensação de ar puro e precisão. Hero com equipamento instalado, seção de serviços, diferenciais técnicos e contato para orçamento.',
  },
  generic: {
    objective: 'gerar-contatos',
    styleRef: 'negocio-local-moderno',
    typography: 'Sora + Inter Tight',
    sections: 'inicio → servicos → sobre → contato',
    brief:
      'Visual moderno e acolhedor, com fotos reais do dia a dia do negócio. Hero direto, seção de serviços, seção sobre a empresa e contato destacado.',
  },
};

const CTA_BY_OBJECTIVE: Record<string, string> = {
  'gerar-pedidos': 'Fazer pedido',
  'gerar-agendamentos': 'Agendar horário',
  'gerar-orcamentos': 'Pedir orçamento',
  'gerar-consultas': 'Marcar consulta',
  'gerar-matriculas': 'Fazer matrícula',
  'gerar-contatos': 'Entrar em contato',
};

function flavourFor(niche: NicheDefinition) {
  return NICHE_FLAVOUR[niche.key] || NICHE_FLAVOUR.generic;
}

export function buildAiStudioPrompt(lead: Lead, identity: SiteIdentity): string {
  const niche = detectNicheProfile(lead.categoryLabel || lead.category, lead.name, lead.tags || {});
  const flavour = flavourFor(niche);
  const cta = CTA_BY_OBJECTIVE[flavour.objective] || 'Entrar em contato';
  const features = identity.features.length ? identity.features.join(', ') : 'Design responsivo fluido';
  const colorLabel = `${identity.primaryColorName} (${identity.primaryColorHex})`;
  const secondaryLabel = `${identity.secondaryColorName} (${identity.secondaryColorHex})`;

  return `Você é um diretor de arte premiado (nível Awwwards) e desenvolvedor front-end sênior. Crie em UMA ÚNICA passada um site cuja PRIORIDADE Nº 1 é a BELEZA VISUAL. Sem perguntas, sem plano, sem placeholders: implemente diretamente o resultado final.

A REGRA DE OURO: menos é mais. Sites bonitos têm POUCO TEXTO e MUITO RESPIRO. Não encha a página de informação: cada seção deve dizer uma única coisa, com poucas palavras, tipografia grande e espaçamento generoso. Se uma seção parecer um bloco de texto corrido, você errou.

🎯 O PROJETO

Negócio: ${identity.siteName}
Nicho:  ${lead.categoryLabel || niche.name}
Slogan: (crie um headline curto e marcante — máx. 8 palavras)
Objetivo: ${flavour.objective}
Ação principal (CTA): ${cta}

🎨 DESIGN — O QUE DEFINE UM SITE LINDO

1. PRIMEIRA TELA IMPECÁVEL: é 70% do julgamento. Título enorme e confiante, no máximo uma frase de apoio, UMA imagem grande e deslumbrante do nicho e o botão de ação. Nada mais. Deixe a borda da próxima seção aparecer para convidar à rolagem.
2. TIPOGRAFIA COMO PROTAGONISTA: escolha uma dupla tipográfica expressiva (títulos com personalidade + corpo neutro). Títulos muito grandes com clamp() responsivo, entrelinha apertada nos títulos e generosa no corpo. Jamais Inter/Poppins como escolha automática.
3. RESPIRO: paddings verticais grandes (mínimo 6–8rem por seção), margens consistentes, grid com colunas claras. Espaço vazio é elegância — não preencha por preencher.
4. IMAGENS GRANDES E REAIS: poucas, porém enormes e de altíssima qualidade, sempre do nicho, com boa luz. Use-as como elementos de composição (sangradas, sobrepostas, em mascaras/arcos), nunca como thumbnails genéricas em cards.
5. RITMO VISUAL: cada seção com um arranjo diferente (texto à esquerda/imagem à direita, depois inverta, depois centralizado, depois editorial assimétrico). Proibida a sequência de seções iguais com 3 cards lado a lado.
6. PALETA DISCIPLINADA: as duas cores escolhidas abaixo dominam tudo. Fundos amplos e limpos, acentos pontuais. Se houver cor escura (preto/marinho), faça tema dark premium. Tokens semânticos em HSL no index.css; nada de cores hardcoded nos componentes.
7. DETALHES FINOS: cantos, bordas e sombras consistentes; divisores discretos; micro-interações sutis ao passar o mouse apenas em elementos clicáveis; scroll-reveal suave (framer-motion, whileInView, once, 0.6s). Respeite prefers-reduced-motion. Zero brilho exagerado, zero glitter.
Estilo de referência: ${flavour.styleRef} · Tom de voz: ${niche.tone} · Tipografia sugerida: ${flavour.typography}.

🧱 ESTRUTURA ENXUTA (máx. 6 seções)

${flavour.sections}.
Copy em português do Brasil: títulos de até 6 palavras, frases curtas, zero enrolação, zero texto corporativo genérico. Não invente prêmios, números, clientes ou endereços — omita o que não foi informado.
Funcionalidades desejadas: ${features} — integre-as com discrição visual.

🎨 BRIEFING DO NICHO (inspire-se, não copie)

Crie um site landing page para ${lead.categoryLabel ? `um negócio do segmento de ${lead.categoryLabel.toLowerCase()}` : 'um negócio local'} chamado "${identity.siteName}". ${flavour.brief} Acentos em ${colorLabel} e ${secondaryLabel}. Animações suaves com framer-motion. Design responsivo. Funcionalidades extras: ${features}.

🔒 ESCOLHAS DO USUÁRIO — INEGOCIÁVEIS

- Cor principal: ${colorLabel} · Cor secundária: ${secondaryLabel}.
- Estas cores definem TODA a identidade (fundos, botões, destaques, estados). Ignore qualquer paleta sugerida pelo nicho que conflite com elas. Nunca troque por branco/cinza automático.
- As funcionalidades selecionadas pelo usuário devem ser preservadas.

📞 CONTATO (usar só o que existir)

Endereço: ${identity.address || 'não informado'}
Telefone: ${identity.phone || 'não informado'}
Horário: ${lead.opening_hours || 'não informado'}
Se houver telefone: botão de WhatsApp com wa.me, número sanitizado, mensagem pronta e abertura em nova aba.

✅ TÉCNICA (silenciosa)

- Perfeito em 360px, 768px e desktop; sem corte, sobreposição ou rolagem horizontal.
- Todos os botões funcionam e levam a "${cta}" ou à seção correspondente; nenhum link "#" vazio.
- Formulário (se houver) com rótulos e validação; sem integração, direciona ao WhatsApp se houver telefone.
- SEO básico: um único H1, title ≤ 60, meta description ≤ 160, alt nas imagens.
- Revisão final: se qualquer seção parecer um template genérico, refaça-a com mais ousadia visual antes de entregar.`;
}

export function buildDefaultIdentity(lead: Lead): SiteIdentity {
  const niche = detectNicheProfile(lead.categoryLabel || lead.category, lead.name, lead.tags || {});
  // Start from the niche's recommended palette, snapped to the named swatches.
  const primary = nearestSiteColor(niche.recommendedPalette.primaria);
  const secondary = nearestSiteColor(niche.recommendedPalette.secundaria);

  return {
    siteName: lead.name,
    primaryColorName: primary.name,
    primaryColorHex: primary.hex,
    secondaryColorName: secondary.name,
    secondaryColorHex: secondary.hex,
    address: lead.address || '',
    phone: lead.phone || '',
    features: ['SEO Avançado', 'Micro-interações premium', 'Design responsivo fluido'],
  };
}
