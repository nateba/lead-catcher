import { GoogleGenAI } from '@google/genai';

export function getGeminiClient(): GoogleGenAI {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no servidor.');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'leadsite-ai-vercel',
      },
    },
  });
}

// Retriable HTTP status codes & transient error signatures
function isRetriableError(err: any): boolean {
  const status = err?.status || err?.code || err?.statusCode;
  if ([429, 500, 502, 503, 504].includes(Number(status))) {
    return true;
  }

  const msg = String(err?.message || '').toLowerCase();
  return (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('429') ||
    msg.includes('resource has been exhausted') ||
    msg.includes('resource_exhausted') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    msg.includes('rate limit') ||
    msg.includes('econnreset') ||
    msg.includes('etimedout')
  );
}

// Resilient Gemini generateContent with controlled retries (max 3) and exponential backoff
export async function generateWithGeminiFallback(
  client: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  const modelsToTry = ['gemini-2.5-flash', 'gemini-3.7-flash'];
  let lastError: any = null;
  const MAX_RETRIES = 3;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        const retriable = isRetriableError(err);

        console.warn(
          `[Gemini Call] Model: ${model}, Attempt: ${attempt + 1}/${MAX_RETRIES}, Retriable: ${retriable}, Msg: ${msg}`
        );

        if (retriable && attempt < MAX_RETRIES - 1) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 4000);
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          continue;
        }

        break;
      }
    }
  }

  throw lastError;
}

// Domain-specific smart fallback generator if AI service is temporarily unavailable
export function generateSmartFallbackSite(data: {
  name: string;
  category: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
  opening_hours?: string;
  tags?: Record<string, string>;
}) {
  const { name, category, city = 'Sua Cidade', state = '', phone = '' } = data;
  const locationStr = city ? `${city}${state ? ` - ${state}` : ''}` : 'sua região';

  const catLower = (category || '').toLowerCase();
  let estiloVisual: 'MODERN' | 'PREMIUM' | 'LOCAL' | 'MINIMAL' | 'BOLD' = 'MODERN';
  let primaryColor = '#4f46e5';
  let secondaryColor = '#06b6d4';
  let services = [
    { titulo: 'Atendimento Especializado', descricao: `Serviços profissionais dedicados em ${category.toLowerCase()} com pontualidade e atenção.`, icone_sugerido: 'sparkles' },
    { titulo: 'Soluções Sob Medida', descricao: 'Atendimento adaptado para a necessidade individual de cada cliente.', icone_sugerido: 'shield' },
    { titulo: 'Agilidade & Praticidade', descricao: 'Facilidade de contato e comunicação ágil via WhatsApp e canais diretos.', icone_sugerido: 'clock' },
    { titulo: 'Compromisso com o Cliente', descricao: 'Transparência e respeito aos prazos e condições acordadas.', icone_sugerido: 'check-circle' },
  ];

  if (catLower.includes('ar-condicionado') || catLower.includes('climatiza') || catLower.includes('refrigera') || catLower.includes('split')) {
    estiloVisual = 'MODERN';
    primaryColor = '#0284c7';
    secondaryColor = '#06b6d4';
    services = [
      { titulo: 'Instalação de Ar-Condicionado', descricao: 'Instalação técnica e segura para residências e comércios.', icone_sugerido: 'sparkles' },
      { titulo: 'Manutenção & Higienização', descricao: 'Limpeza e revisão preventiva para melhor qualidade do ar e economia.', icone_sugerido: 'shield' },
      { titulo: 'Diagnóstico & Carga de Gás', descricao: 'Identificação rápida de problemas e regularização de sistemas.', icone_sugerido: 'wrench' },
      { titulo: 'Projetos de Climatização', descricao: 'Dimensionamento adequado para ambientes residenciais e comerciais.', icone_sugerido: 'check-circle' },
    ];
  } else if (catLower.includes('barbearia') || catLower.includes('barbeiro') || catLower.includes('barba')) {
    estiloVisual = 'PREMIUM';
    primaryColor = '#18181b';
    secondaryColor = '#d97706';
    services = [
      { titulo: 'Corte Clássico & Moderno', descricao: 'Técnicas de corte alinhadas ao seu estilo e preferência.', icone_sugerido: 'scissors' },
      { titulo: 'Barba com Toalha Quente', descricao: 'Experiência tradicional com navalha e produtos específicos.', icone_sugerido: 'sparkles' },
      { titulo: 'Acabamento & Alinhamento', descricao: 'Contorno de barba e sobrancelha com máxima precisão.', icone_sugerido: 'check-circle' },
      { titulo: 'Tratamento & Hidratação', descricao: 'Cuidados capilares e finalização com produtos premium.', icone_sugerido: 'star' },
    ];
  } else if (catLower.includes('dentista') || catLower.includes('odontolog') || catLower.includes('clinica') || catLower.includes('saude') || catLower.includes('medico') || catLower.includes('fisioterapia')) {
    estiloVisual = 'MINIMAL';
    primaryColor = '#0d9488';
    secondaryColor = '#0284c7';
    services = [
      { titulo: 'Consultas & Avaliação Inicial', descricao: 'Atendimento cuidadoso e plano individualizado para sua saúde.', icone_sugerido: 'heart' },
      { titulo: 'Prevenção & Cuidados Periódicos', descricao: 'Acompanhamento preventivo para manter seu bem-estar sempre em dia.', icone_sugerido: 'shield' },
      { titulo: 'Tratamentos Especializados', descricao: 'Procedimentos realizados em ambiente acolhedor e seguro.', icone_sugerido: 'smile' },
      { titulo: 'Orientações & Suporte Contínuo', descricao: 'Esclarecimento detalhado de dúvidas sobre o seu atendimento.', icone_sugerido: 'check-circle' },
    ];
  } else if (catLower.includes('advoga') || catLower.includes('juridico') || catLower.includes('direito') || catLower.includes('oab')) {
    estiloVisual = 'PREMIUM';
    primaryColor = '#1e293b';
    secondaryColor = '#94a3b8';
    services = [
      { titulo: 'Consultoria & Pareceres', descricao: 'Análise detalhada de demandas com rigor técnico e ético.', icone_sugerido: 'shield' },
      { titulo: 'Atuação Preventiva & Contratual', descricao: 'Elaboração e revisão de instrumentos jurídicos seguros.', icone_sugerido: 'check-circle' },
      { titulo: 'Acompanhamento Processual', descricao: 'Condução criteriosa de processos judiciais e administrativos.', icone_sugerido: 'sparkles' },
      { titulo: 'Orientação Estratégica', descricao: 'Soluções jurídicas estruturadas para pessoas e empresas.', icone_sugerido: 'star' },
    ];
  } else if (catLower.includes('restaurante') || catLower.includes('lanchonete') || catLower.includes('pizzaria') || catLower.includes('cafe') || catLower.includes('gastronomia')) {
    estiloVisual = 'LOCAL';
    primaryColor = '#ea580c';
    secondaryColor = '#f59e0b';
    services = [
      { titulo: 'Pratos Principais & Especialidades', descricao: 'Opções preparadas com ingredientes selecionados e muito sabor.', icone_sugerido: 'coffee' },
      { titulo: 'Almoço Executivo & Porções', descricao: 'Opções práticas para o seu dia a dia ou momentos de lazer.', icone_sugerido: 'heart' },
      { titulo: 'Bebidas & Acompanhamentos', descricao: 'Variedade de bebidas para complementar sua refeição.', icone_sugerido: 'star' },
      { titulo: 'Atendimento no Local & Retirada', descricao: 'Ambiente agradável e facilidade para pedidos para viagem.', icone_sugerido: 'clock' },
    ];
  } else if (catLower.includes('oficina') || catLower.includes('mecanica') || catLower.includes('auto') || catLower.includes('carro')) {
    estiloVisual = 'BOLD';
    primaryColor = '#dc2626';
    secondaryColor = '#2563eb';
    services = [
      { titulo: 'Revisão Preventiva Completa', descricao: 'Inspeção criteriosa dos principais componentes do veículo.', icone_sugerido: 'wrench' },
      { titulo: 'Freios, Suspensão & Direção', descricao: 'Manutenção essencial para a estabilidade e segurança ao rodar.', icone_sugerido: 'shield' },
      { titulo: 'Troca de Óleo & Filtros', descricao: 'Substituição rápida e preventiva com produtos adequados.', icone_sugerido: 'sparkles' },
      { titulo: 'Diagnóstico Eletrônico', descricao: 'Localização ágil de falhas com equipamentos de diagnóstico.', icone_sugerido: 'check-circle' },
    ];
  } else if (catLower.includes('academia') || catLower.includes('fitness') || catLower.includes('pilates') || catLower.includes('crossfit')) {
    estiloVisual = 'BOLD';
    primaryColor = '#4f46e5';
    secondaryColor = '#ec4899';
    services = [
      { titulo: 'Aulas & Treinos Orientados', descricao: 'Ambiente dinâmico com instrutores para orientar sua evolução.', icone_sugerido: 'sparkles' },
      { titulo: 'Avaliação Inicial & Metas', descricao: 'Planejamento de treino de acordo com seus objetivos físicos.', icone_sugerido: 'target' },
      { titulo: 'Condicionamento & Força', descricao: 'Estrutura completa de equipamentos para seu treino diário.', icone_sugerido: 'zap' },
      { titulo: 'Variedade de Horários', descricao: 'Flexibilidade de horários para se encaixar na sua rotina.', icone_sugerido: 'calendar' },
    ];
  }

  return {
    estilo_visual: estiloVisual,
    paleta_sugerida: {
      primaria: primaryColor,
      secundaria: secondaryColor,
      texto_sobre_primaria: '#ffffff',
    },
    headline: `${category} de Confiança em ${city}`,
    subheadline: `A ${name} oferece atendimento dedicado e soluções práticas para você em ${city}. Fale conosco e solicite seu atendimento.`,
    sobre_titulo: `Conheça a ${name}`,
    sobre_texto: `A ${name} é especializada em ${category.toLowerCase()} e atende clientes em ${locationStr} com compromisso, atenção aos detalhes e foco constante na qualidade do atendimento.`,
    servicos: services,
    diferenciais: [
      `Atendimento dedicado e transparente em ${city}`,
      'Facilidade de contato e comunicação ágil pelo WhatsApp',
      'Compromisso com prazos e com a satisfação do cliente',
    ],
    depoimentos: [
      { texto: `Excelente atendimento na ${name}! Equipe atenciosa e serviço executado dentro do combinado em ${city}.`, autor: 'Cliente Local', estrelas: 5 },
      { texto: `Comunicação rápida pelo WhatsApp e atendimento prestativo. Recomendo para quem busca praticidade.`, autor: 'Morador da Região', estrelas: 5 },
      { texto: `Experiência transparente e de confiança. Muito satisfeito com o atendimento recebido.`, autor: 'Consumidor', estrelas: 5 },
    ],
    faq: [
      { pergunta: 'Como solicitar um orçamento ou agendamento?', resposta: `Basta entrar em contato pelo WhatsApp ou telefone${phone ? ` (${phone})` : ''} informando a sua necessidade.` },
      { pergunta: 'Qual é a região de atendimento?', resposta: `Atendemos em ${locationStr} e bairros adjacentes. Entre em contato para confirmar a disponibilidade.` },
      { pergunta: `Onde a ${name} está localizada?`, resposta: `Estamos localizados em ${locationStr}. Confira o endereço completo e o mapa de localização nesta página.` },
    ],
    cta_titulo: `Precisa de ${category} em ${city}?`,
    cta_texto: `Fale agora mesmo com a ${name} pelo WhatsApp e tire todas as suas dúvidas sem burocracia.`,
    meta_descricao_seo: `${category} em ${locationStr}. Conheça os serviços da ${name}, localização e atendimento direto via WhatsApp.`,
    palavras_chave_seo: `${category}, ${name}, ${city}, serviços ${city}`,
    mensagem_abordagem_whatsapp: `Olá! Notei que a *${name}* é uma ótima referência em ${category} em ${city}, mas ainda não possui um site moderno e otimizado para o Google e WhatsApp. Criei uma proposta visual exclusiva para vocês: [link]. Gostaria de ver sem compromisso?`,
  };
}
