import { PORTFOLIO_PALETTES } from '../data/portfolioOptions';

export interface PortfolioBrief {
  siteType: string;
  name: string;
  profession: string;
  tagline: string;
  about: string;
  services: string;
  differentials: string;
  audience: string;
  city: string;
  mainAction: string;
  visualStyle: string;
  paletteLabel: string;
  sections: string[];
  whatsapp: string;
  instagram: string;
  references: string;
}

export const EMPTY_BRIEF: PortfolioBrief = {
  siteType: '',
  name: '',
  profession: '',
  tagline: '',
  about: '',
  services: '',
  differentials: '',
  audience: '',
  city: '',
  mainAction: '',
  visualStyle: '',
  paletteLabel: '',
  sections: [],
  whatsapp: '',
  instagram: '',
  references: '',
};

const orEmpty = (value: string) => value.trim();

export function buildPortfolioPrompt(brief: PortfolioBrief): string {
  const palette =
    PORTFOLIO_PALETTES.find((p) => p.label === brief.paletteLabel)?.prompt || brief.paletteLabel;

  const services = orEmpty(brief.services)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `  • ${s}`)
    .join('\n');

  const sections = brief.sections.map((s, i) => `${i + 1}. ${s}`).join('\n');

  const integrations = [
    brief.whatsapp.trim() &&
      `- WhatsApp: ${brief.whatsapp.trim()} (botão flutuante + botões de chamada principal com link wa.me já formatado)`,
    brief.instagram.trim() && `- Instagram: ${brief.instagram.trim()} (link no footer e no header)`,
    '- SEO básico: title, description, Open Graph e favicon coerentes com a marca.',
    '- Acessibilidade: contraste AA, navegação por teclado e textos alternativos nas imagens.',
  ]
    .filter(Boolean)
    .join('\n');

  return `Crie um ${brief.siteType.toLowerCase()} profissional, de alto padrão e alta conversão, totalmente em português do Brasil.

== IDENTIDADE ==
- Nome / marca: ${orEmpty(brief.name)}
- Profissão / nicho: ${orEmpty(brief.profession)}
- Tagline / frase de impacto: "${orEmpty(brief.tagline)}"
- Cidade / região de atuação: ${orEmpty(brief.city) || 'não informado'}
- Público-alvo: ${orEmpty(brief.audience) || 'não informado'}

== CONTEÚDO ==
- Sobre: ${orEmpty(brief.about) || 'não informado'}
- Serviços oferecidos:
${services || '  • não informado'}
- Diferenciais competitivos: ${orEmpty(brief.differentials) || 'não informado'}
- Ação principal que o visitante deve tomar: ${orEmpty(brief.mainAction) || 'entrar em contato'}

== DESIGN ==
- Estilo visual: ${brief.visualStyle}
- Paleta de cores: ${palette}
- Tipografia: escolha uma fonte de título marcante e uma fonte de corpo limpa, legível e profissional.
- Estrutura visual: seção inicial forte, cartões com bordas elegantes, seções bem espaçadas, chamadas principais visíveis e aparência de agência de alto padrão.
- Interações: microanimações suaves, efeitos ao passar o mouse, revelação ao rolar a página e responsividade perfeita no celular.
- Imagens: use imagens provisórias de alta qualidade coerentes com o nicho até que o usuário substitua.
- Referências de inspiração: ${orEmpty(brief.references) || 'sem referências específicas'}

== SEÇÕES (na ordem) ==
${sections}

== INTEGRAÇÕES ==
${integrations}

== ENTREGA ==
- Construa em React + Vite + Tailwind + shadcn/ui.
- Use tokens semânticos no index.css para cores, gradientes e sombras. Não use cores fixas direto nos componentes.
- Texto 100% em português do Brasil, profissional, persuasivo, claro e sem clichês.
- O resultado precisa parecer feito por uma agência de alto padrão, não por um modelo genérico.`;
}
