export interface CourseModule {
  number: string;
  title: string;
  description: string;
}

export const COURSE_MODULES: CourseModule[] = [
  {
    number: '01',
    title: 'Tráfego orgânico',
    description: 'Cresça sua audiência sem gastar um real com conteúdo estratégico.',
  },
  {
    number: '02',
    title: 'Tráfego pago',
    description: 'Anúncios rentáveis desde o primeiro teste, com estrutura validada.',
  },
  {
    number: '03',
    title: 'Estratégias de venda',
    description: 'Copy, oferta e gatilhos mentais que realmente convertem no digital.',
  },
  {
    number: '04',
    title: 'Primeira venda',
    description: 'Passo a passo do zero ao primeiro cliente pagante confirmado.',
  },
];

export const HOW_TO_USE = [
  'Assista os módulos na ordem, do 01 ao 04.',
  'Aplique cada aula antes de avançar para a próxima.',
  'Anote o que testar na sua operação da semana.',
  'Volte no contador e não perca o bônus liberado em 6 dias.',
];

export interface DemoPeriod {
  key: 'diario' | 'sete' | 'trinta' | 'noventa';
  label: string;
  /** Faturamento do período. A quantidade de vendas vem de auto / ticket. */
  auto: number;
}

// Reference figures used by the mockup when no manual value is set.
export const DEMO_PERIODS: DemoPeriod[] = [
  { key: 'diario', label: 'Diário', auto: 1975 },
  { key: 'sete', label: '7 dias', auto: 12536 },
  { key: 'trinta', label: '30 dias', auto: 48286 },
  { key: 'noventa', label: '90 dias', auto: 144495 },
];

/**
 * Ticket médio padrão, usado quando o painel não define um.
 *
 * A quantidade de vendas de cada período é sempre faturamento ÷ ticket, nunca
 * um número guardado à parte: assim receita, vendas e preço unitário não têm
 * como se contradizer, que é o primeiro sinal de uma dashboard inventada.
 */
export const DEMO_DEFAULT_TICKET = 400;

export const DEMO_PAYMENT_METHODS = [
  { name: 'Cartão de crédito', share: 58 },
  { name: 'Pix', share: 36 },
  { name: 'Pic Pay', share: 6 },
];
