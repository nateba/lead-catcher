import { LeadItem, PricingPlan, FaqItem } from '../types';

export const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    name: 'OdontoPrime',
    rating: 4.8,
    reviewCount: 182,
    hasWebsite: false,
    websiteStatus: 'Não encontrado',
    city: 'São Paulo, SP',
    niche: 'Clínica Odontológica',
    opportunity: 'Alta',
    score: 92,
    phone: '(11) 98421-9904',
    address: 'Av. Paulista, 1200 - Bela Vista',
  },
  {
    id: 'lead-2',
    name: 'Clínica Sorriso',
    rating: 4.9,
    reviewCount: 240,
    hasWebsite: false,
    websiteStatus: 'Não encontrado',
    city: 'São Paulo, SP',
    niche: 'Clínica Odontológica',
    opportunity: 'Alta',
    score: 95,
    phone: '(11) 97134-8201',
    address: 'R. Oscar Freire, 850 - Jardins',
  },
  {
    id: 'lead-3',
    name: 'Odonto Center',
    rating: 4.6,
    reviewCount: 97,
    hasWebsite: true,
    websiteStatus: 'Desatualizado',
    city: 'São Paulo, SP',
    niche: 'Clínica Odontológica',
    opportunity: 'Média',
    score: 74,
    phone: '(11) 3288-1120',
    address: 'R. Domingos de Morais, 1420 - Vila Mariana',
  },
  {
    id: 'lead-4',
    name: 'Dental Sul',
    rating: 4.5,
    reviewCount: 63,
    hasWebsite: true,
    websiteStatus: 'Encontrado',
    city: 'São Paulo, SP',
    niche: 'Clínica Odontológica',
    opportunity: 'Baixa',
    score: 41,
    phone: '(11) 5051-7890',
    address: 'Av. Ibirapuera, 2300 - Moema',
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'mensal',
    name: 'Plano Mensal',
    price: 'R$ 169,90',
    period: '/ mês',
    description: 'Flexibilidade total com renovação mensal sem contrato de fidelidade.',
    featured: false,
    features: [
      'Prospecção contínua via OpenStreetMap',
      'Busca inteligente por cidade e nicho no Brasil',
      'Lead Intelligence com cálculo de Score',
      'Geração de sites profissionais com IA',
      'Editor visual completo com exportação',
      'Suporte prioritário via WhatsApp',
    ],
    cta: 'Assinar Plano Mensal',
  },
  {
    id: 'vitalicio',
    name: 'Plano Acesso Pra Sempre',
    price: 'R$ 249,90',
    period: 'à vista no Pix',
    description: 'Pagamento único. Acesso vitalício para prospectar e criar sites sem mensalidades.',
    featured: true,
    installments: [
      'ou 12x de R$ 26,63',
      'ou 6x de R$ 47,91',
    ],
    features: [
      'Acesso vitalício sem nenhuma mensalidade futura',
      'Prospecção e exportação de leads ilimitadas',
      'Geração de sites com IA sem limites',
      'Todas as atualizações futuras inclusas',
      'Editor visual drag & drop completo',
      'Comunidade exclusiva de agências e freelancers',
      'Garantia incondicional de 7 dias',
    ],
    cta: 'Garantir Acesso Vitalício',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Como a HypeLeads encontra empresas?',
    answer: 'A HypeLeads consulta diretamente a base pública do OpenStreetMap, varrendo qualquer cidade e segmento do Brasil para identificar estabelecimentos com telefone e endereço cadastrados, porém sem site oficial vinculado.',
  },
  {
    question: 'Os leads já estão prontos para comprar?',
    answer: 'Sim. Ao identificar empresas que já investem no negócio, possuem notas altas e recebem clientes diariamente mas ainda perdem vendas por não terem um site moderno, você chega com o diagnóstico pronto e uma proposta irrecusável.',
  },
  {
    question: 'Preciso saber programar?',
    answer: 'Não. A plataforma foi construída tanto para quem nunca criou um site quanto para agências. A inteligência artificial gera o conteúdo persuasivo, a estrutura estética e a arquitetura visual automaticamente com apenas 1 clique.',
  },
  {
    question: 'Como o site é criado?',
    answer: 'Nossa IA analisa o segmento da empresa, localização, pontos fortes e perfil do cliente ideal. Em segundos, ela produz o layout completo com seções de início, serviços, depoimentos, sobre e botão direto para o WhatsApp.',
  },
  {
    question: 'Posso editar o site depois?',
    answer: 'Totalmente. Você conta com um editor visual completo e intuitivo para alterar tipografia, paleta de cores, imagens, textos, links e botões de chamada para ação antes de enviar a demonstração ao cliente.',
  },
  {
    question: 'Posso utilizar a HypeLeads para vender sites?',
    answer: 'Com certeza. Esse é o principal objetivo da plataforma. Você descobre o cliente certo, gera o site em minutos, envia o link de demonstração como proposta e fecha contratos recorrentes ou pontuais.',
  },
];
