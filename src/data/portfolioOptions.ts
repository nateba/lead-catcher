export const PORTFOLIO_TYPES = [
  'Portfólio pessoal (profissional autônomo)',
  'Portfólio de agência / estúdio',
  'Portfólio de freelancer criativo',
  'Site de currículo / carreira',
];

export const VISUAL_STYLES = [
  'Moderno minimalista, com muito espaço, hierarquia forte e visual de alto padrão',
  'Clean profissional, corporativo, confiável e muito organizado',
  'Criativo e ousado, com formas marcantes, animações e personalidade',
  'Elegante luxuoso, com aparência de alto padrão e acabamento refinado',
  'Tecnológico futurista, escuro, com brilho sutil e sensação de produto digital de alto padrão',
  'Editorial sofisticado, com fotos grandes, ritmo de revista e tipografia marcante',
];

export interface PortfolioPalette {
  label: string;
  /** Written out for the prompt, with hex codes where they matter. */
  prompt: string;
  swatches: string[];
}

export const PORTFOLIO_PALETTES: PortfolioPalette[] = [
  {
    label: 'Azul marinho + branco + preto',
    prompt: 'azul marinho (#0A2540), branco e preto',
    swatches: ['#0A2540', '#FFFFFF', '#000000'],
  },
  {
    label: 'Preto + dourado',
    prompt: 'preto (#0B0B0B) e dourado (#D4AF37)',
    swatches: ['#0B0B0B', '#D4AF37'],
  },
  {
    label: 'Verde esmeralda + creme',
    prompt: 'verde esmeralda (#0F766E) e creme (#F5F0E6)',
    swatches: ['#0F766E', '#F5F0E6'],
  },
  {
    label: 'Roxo profundo + rosa neon',
    prompt: 'roxo profundo (#3B0764) e rosa neon (#F472B6)',
    swatches: ['#3B0764', '#F472B6'],
  },
  {
    label: 'Vinho + off-white',
    prompt: 'vinho (#7F1D1D) e off-white (#FAF7F2)',
    swatches: ['#7F1D1D', '#FAF7F2'],
  },
  {
    label: 'Grafite + laranja queimado',
    prompt: 'grafite (#1F2937) e laranja queimado (#EA580C)',
    swatches: ['#1F2937', '#EA580C'],
  },
  {
    label: 'Escolher depois (deixar a IA decidir)',
    prompt: 'escolha uma paleta sofisticada e coerente com o nicho, e mantenha-a em todo o site',
    swatches: ['#4B5563', '#94A3B8'],
  },
];

export const PORTFOLIO_SECTIONS = [
  'Seção inicial impactante',
  'Sobre / Quem sou',
  'Serviços',
  'Portfólio / Projetos',
  'Depoimentos',
  'Estatísticas (anos, projetos, clientes)',
  'Processo de trabalho',
  'Blog / Conteúdo',
  'Preços / Planos',
  'FAQ',
  'Formulário de contato',
  'WhatsApp flutuante',
];

export const DEFAULT_SECTIONS = [
  'Seção inicial impactante',
  'Sobre / Quem sou',
  'Serviços',
  'Portfólio / Projetos',
  'Depoimentos',
  'Formulário de contato',
  'WhatsApp flutuante',
];
