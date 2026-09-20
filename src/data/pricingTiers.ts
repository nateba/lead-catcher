export interface PricingTier {
  id: string;
  label: string;
  name: string;
  min: number;
  max: number;
  description: string;
  idealClient: string;
  delivers: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'simples',
    label: 'Tier 01',
    name: 'Site Simples',
    min: 200,
    max: 500,
    description: 'Landing page única, design padrão, entrega rápida e barata.',
    idealClient: 'Autônomo, MEI, negócio de bairro sem presença digital.',
    delivers: [
      'Uma página com as seções essenciais',
      'Template adaptado com as cores do cliente',
      'Botão de WhatsApp e mapa',
      'Domínio e publicação',
    ],
  },
  {
    id: 'medio',
    label: 'Tier 02',
    name: 'Site Médio',
    min: 500,
    max: 1000,
    description: 'Site institucional de 3 a 7 páginas, design personalizado.',
    idealClient: 'PME estruturada, que já fatura e tem equipe.',
    delivers: [
      'Layout próprio, não template',
      'Textos escritos para o negócio',
      'Formulário e captação de contatos',
      'SEO básico e Google Meu Negócio',
      'Uma rodada de ajustes incluída',
    ],
  },
  {
    id: 'premium',
    label: 'Tier 03',
    name: 'Site Premium',
    min: 1000,
    max: 2500,
    description: 'Projeto profissional com design forte, integrações e animações.',
    idealClient: 'Marca consolidada, e-commerce ou operação com time comercial.',
    delivers: [
      'Identidade visual completa',
      'Animações e micro-interações',
      'Integrações (agenda, pagamento, CRM)',
      'Performance e SEO avançados',
      'Acompanhamento pós-entrega',
    ],
  },
];

export interface PriceLever {
  title: string;
  gain: string;
  detail: string;
}

// Concrete ways to move a deal up a tier instead of discounting.
export const PRICE_LEVERS: PriceLever[] = [
  {
    title: 'Cobre por resultado, não por página',
    gain: '+30% a +80%',
    detail:
      'Troque "site de 5 páginas" por "sistema que traz orçamentos pelo WhatsApp". O cliente compara preço quando o entregável é genérico.',
  },
  {
    title: 'Venda a manutenção junto',
    gain: '+R$ 100 a R$ 300/mês',
    detail:
      'Hospedagem, backup, pequenas alterações e relatório mensal. Um cliente de R$ 800 vira R$ 800 + R$ 150 recorrentes.',
  },
  {
    title: 'Mostre a prévia antes de falar preço',
    gain: 'Menos objeção',
    detail:
      'Gere o site na aba Buscar Leads e mande a prévia pronta. Quem já viu o próprio negócio no ar negocia menos.',
  },
  {
    title: 'Ofereça três faixas, não uma',
    gain: 'Ticket médio maior',
    detail:
      'Apresentar Simples, Médio e Premium faz o cliente escolher entre opções suas — a maioria fica no do meio.',
  },
  {
    title: 'Some integrações concretas',
    gain: '+R$ 200 a R$ 600',
    detail:
      'Agendamento online, cardápio digital, catálogo, pagamento. Cada integração é um item a mais que justifica a faixa.',
  },
  {
    title: 'Cobre pelo porte do cliente',
    gain: 'Mesmo trabalho, preço maior',
    detail:
      'O mesmo site vale mais para uma clínica com 5 dentistas do que para um autônomo. Pergunte o faturamento antes de orçar.',
  },
];

export const USAGE_RULES = [
  'A maioria dos sites vale entre R$ 200 e R$ 1.000.',
  'Use Simples para autônomos e MEIs.',
  'Use Médio para PMEs que já têm faturamento.',
  'Só venda na faixa Premium quando o projeto tiver design forte e várias integrações.',
  'Nunca dê desconto sem tirar escopo — tire uma página ou uma integração junto.',
  'Peça 50% na aprovação e 50% na entrega.',
];

export function tierForValue(value: number): PricingTier | undefined {
  return PRICING_TIERS.find((t) => value >= t.min && value <= t.max) ||
    (value > PRICING_TIERS[PRICING_TIERS.length - 1].max ? PRICING_TIERS[PRICING_TIERS.length - 1] : undefined);
}
