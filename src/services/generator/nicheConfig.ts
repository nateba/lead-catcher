import { ColorPalette } from '../../types';

export type VisualStyleType = 'MODERN' | 'PREMIUM' | 'LOCAL' | 'MINIMAL' | 'BOLD';

export type SectionType =
  | 'hero'
  | 'differentials'
  | 'services'
  | 'process'
  | 'about'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'cta'
  | 'footer';

export interface ProcessStep {
  numero: string;
  titulo: string;
  descricao: string;
}

export interface NicheDefinition {
  key: string;
  name: string;
  aliases: string[];
  defaultStyle: VisualStyleType;
  allowedStyles: VisualStyleType[];
  tone: 'tecnico' | 'premium' | 'acolhedor' | 'formal' | 'direto' | 'energetico';
  ctaStyle: 'orcamento' | 'agendamento' | 'whatsapp' | 'consulta' | 'contato';
  recommendedPalette: ColorPalette;
  alternativePalettes: ColorPalette[];
  sectionsOrder: SectionType[];
  heroLayout: 'split_image' | 'centered_badge' | 'bold_card' | 'minimal_clean';
  servicesLayout: 'grid_cards' | 'horizontal_list' | 'bento_blocks' | 'icon_strip';
  suggestedServiceNames: string[];
  suggestedDifferentials: string[];
  safeProcessSteps: ProcessStep[];
  faqTemplates: { pergunta: string; resposta: string }[];
  defaultImageTheme: string;
}

export const NICHE_DEFINITIONS: Record<string, NicheDefinition> = {
  hvac: {
    key: 'hvac',
    name: 'Climatização & Ar-Condicionado',
    aliases: ['ar-condicionado', 'climatizacao', 'refrigeracao', 'aquecedor', 'aquecimento', 'split', 'hvac'],
    defaultStyle: 'MODERN',
    allowedStyles: ['MODERN', 'LOCAL', 'BOLD', 'MINIMAL'],
    tone: 'tecnico',
    ctaStyle: 'orcamento',
    recommendedPalette: {
      primaria: '#0284c7', // Sky blue
      secundaria: '#06b6d4',
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#0369a1', secundaria: '#f97316', texto_sobre_primaria: '#ffffff' },
      { primaria: '#0f172a', secundaria: '#38bdf8', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'differentials', 'services', 'process', 'about', 'faq', 'contact', 'cta', 'footer'],
    heroLayout: 'split_image',
    servicesLayout: 'grid_cards',
    suggestedServiceNames: [
      'Instalação de Ar-Condicionado',
      'Manutenção Preventiva & Corretiva',
      'Higienização & Limpeza Técnica',
      'Projetos de Climatização',
    ],
    suggestedDifferentials: [
      'Atendimento técnico especializado',
      'Orçamento transparente sob consulta',
      'Atendimento residencial e comercial',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Contato Inicial', descricao: 'Envie sua solicitação informando o tipo de ambiente ou necessidade.' },
      { numero: '02', titulo: 'Avaliação & Orçamento', descricao: 'Apresentamos a proposta adequada para a sua demanda sem compromisso.' },
      { numero: '03', titulo: 'Execução do Serviço', descricao: 'Realização do atendimento com pontualidade e padrões técnicos.' },
    ],
    faqTemplates: [
      { pergunta: 'Como solicitar um orçamento de instalação ou manutenção?', resposta: 'Basta entrar em contato pelo WhatsApp ou telefone informando seu bairro e necessidade para receber as orientações.' },
      { pergunta: 'Quais tipos de equipamentos são atendidos?', resposta: 'Atendemos sistemas residenciais e comerciais como modelos Split, Hi-Wall, Cassete e Multi-Split sob consulta.' },
      { pergunta: 'Qual é a região de atendimento?', resposta: 'Atendemos na cidade e bairros adjacentes. Entre em contato para confirmar a disponibilidade para o seu endereço.' },
    ],
    defaultImageTheme: 'hvac',
  },

  barbershop: {
    key: 'barbershop',
    name: 'Barbearia & Estilo Masculino',
    aliases: ['barbearia', 'barbeiro', 'barba', 'corte masculino', 'barbershop'],
    defaultStyle: 'PREMIUM',
    allowedStyles: ['PREMIUM', 'BOLD', 'MODERN'],
    tone: 'premium',
    ctaStyle: 'agendamento',
    recommendedPalette: {
      primaria: '#18181b', // Dark zinc
      secundaria: '#d97706', // Amber gold
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#0f172a', secundaria: '#b45309', texto_sobre_primaria: '#ffffff' },
      { primaria: '#27272a', secundaria: '#e11d48', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'services', 'differentials', 'about', 'testimonials', 'contact', 'cta', 'footer'],
    heroLayout: 'bold_card',
    servicesLayout: 'bento_blocks',
    suggestedServiceNames: [
      'Corte de Cabelo Clássico & Moderno',
      'Barba com Toalha Quente',
      'Acabamento & Alinhamento',
      'Tratamento Capilar & Hidratação',
    ],
    suggestedDifferentials: [
      'Espaço confortável e climatizado',
      'Agendamento prático e sem filas',
      'Profissionais dedicados ao estilo',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Escolha seu Horário', descricao: 'Selecione o melhor dia e horário para o seu atendimento.' },
      { numero: '02', titulo: 'Agendamento Direto', descricao: 'Confirme seu horário rapidamente pelo WhatsApp ou telefone.' },
      { numero: '03', titulo: 'Atendimento Exclusivo', descricao: 'Aproveite uma experiência completa de cuidado e estilo.' },
    ],
    faqTemplates: [
      { pergunta: 'É necessário agendar horário com antecedência?', resposta: 'Recomendamos o agendamento prévio via WhatsApp para garantir o seu horário sem espera.' },
      { pergunta: 'Quais serviços são oferecidos no espaço?', resposta: 'Oferecemos cortes clássicos, modernos, barba completa com navalha e toalha quente, e finalizações.' },
      { pergunta: 'Onde a barbearia está localizada?', resposta: 'Estamos localizados em endereço de fácil acesso na cidade. Confira nosso mapa de localização abaixo.' },
    ],
    defaultImageTheme: 'barbershop',
  },

  clinic: {
    key: 'clinic',
    name: 'Saúde, Odontologia & Clínica',
    aliases: ['dentista', 'odontologia', 'clinica', 'consultorio', 'saude', 'medico', 'fisioterapia', 'psicologia', 'nutricao', 'oftalmologia'],
    defaultStyle: 'MINIMAL',
    allowedStyles: ['MINIMAL', 'MODERN', 'LOCAL'],
    tone: 'acolhedor',
    ctaStyle: 'agendamento',
    recommendedPalette: {
      primaria: '#0d9488', // Teal
      secundaria: '#0284c7', // Sky
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#0891b2', secundaria: '#10b981', texto_sobre_primaria: '#ffffff' },
      { primaria: '#2563eb', secundaria: '#38bdf8', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'differentials', 'services', 'about', 'process', 'faq', 'contact', 'cta', 'footer'],
    heroLayout: 'split_image',
    servicesLayout: 'grid_cards',
    suggestedServiceNames: [
      'Consultas & Avaliação Inicial',
      'Prevenção & Cuidados Periódicos',
      'Tratamentos Especializados',
      'Acompanhamento Contínuo',
    ],
    suggestedDifferentials: [
      'Atendimento humanizado e atencioso',
      'Ambiente acolhedor e higienizado',
      'Facilidade no agendamento de consultas',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Contato & Agendamento', descricao: 'Fale conosco para encontrar o horário mais conveniente para sua consulta.' },
      { numero: '02', titulo: 'Consulta & Avaliação', descricao: 'Atendimento cuidadoso com foco nas suas necessidades individuais.' },
      { numero: '03', titulo: 'Plano de Cuidados', descricao: 'Orientações claras e acompanhamento profissional para o seu bem-estar.' },
    ],
    faqTemplates: [
      { pergunta: 'Como funciona o agendamento de consultas?', resposta: 'Você pode solicitar seu horário pelo WhatsApp ou por telefone. Nossa equipe responderá com as opções disponíveis.' },
      { pergunta: 'O que devo levar na primeira consulta?', resposta: 'Recomendamos trazer documentos de identificação e exames anteriores relevantes, caso possua.' },
      { pergunta: 'Qual é o horário de atendimento?', resposta: 'Consulte os horários de funcionamento informados nesta página ou entre em contato para verificar encaixes.' },
    ],
    defaultImageTheme: 'clinic',
  },

  law: {
    key: 'law',
    name: 'Advocacia & Consultoria Jurídica',
    aliases: ['advogado', 'advocacia', 'juridico', 'direito', 'consultoria juridica', 'oab'],
    defaultStyle: 'PREMIUM',
    allowedStyles: ['PREMIUM', 'MINIMAL', 'MODERN'],
    tone: 'formal',
    ctaStyle: 'consulta',
    recommendedPalette: {
      primaria: '#1e293b', // Slate 800
      secundaria: '#94a3b8', // Slate 400
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#0f172a', secundaria: '#b45309', texto_sobre_primaria: '#ffffff' },
      { primaria: '#1c1917', secundaria: '#78716c', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'services', 'about', 'process', 'differentials', 'faq', 'contact', 'cta', 'footer'],
    heroLayout: 'minimal_clean',
    servicesLayout: 'horizontal_list',
    suggestedServiceNames: [
      'Consultoria & Pareceres Jurídicos',
      'Atuação Preventiva & Contratual',
      'Representação & Acompanhamento de Processos',
      'Orientação Estratégica em Demandas Específicas',
    ],
    suggestedDifferentials: [
      'Atendimento ético, confidencial e transparente',
      'Análise criteriosa de cada situação',
      'Comunicação clara e acessível sobre o andamento',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Contato Inicial', descricao: 'Apresentação preliminar da demanda para verificar a área de atuação.' },
      { numero: '02', titulo: 'Análise do Caso', descricao: 'Exame minucioso da situação e dos documentos pertinentes.' },
      { numero: '03', titulo: 'Definição da Estratégia', descricao: 'Apresentação dos caminhos jurídicos cabíveis com transparência.' },
    ],
    faqTemplates: [
      { pergunta: 'Como solicitar uma consulta ou análise inicial?', resposta: 'Basta entrar em contato pelos nossos canais informando resumidamente a natureza do seu caso para agendarmos uma conversa.' },
      { pergunta: 'O atendimento pode ser realizado de forma remota?', resposta: 'Sim, realizamos atendimentos presenciais e orientações por videoconferência ou canais digitais conforme a conveniência.' },
      { pergunta: 'Como é garantido o sigilo das informações?', resposta: 'Todas as informações compartilhadas são resguardadas pelo sigilo profissional inerente à advocacia.' },
    ],
    defaultImageTheme: 'law',
  },

  restaurant: {
    key: 'restaurant',
    name: 'Restaurante, Gastronomia & Café',
    aliases: ['restaurante', 'lanchonete', 'pizzaria', 'hamburgueria', 'cafe', 'bar', 'padaria', 'confeitaria', 'comida', 'gastronomia'],
    defaultStyle: 'LOCAL',
    allowedStyles: ['LOCAL', 'BOLD', 'MODERN', 'PREMIUM'],
    tone: 'acolhedor',
    ctaStyle: 'contato',
    recommendedPalette: {
      primaria: '#ea580c', // Orange 600
      secundaria: '#f59e0b', // Amber 500
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#b91c1c', secundaria: '#fbbf24', texto_sobre_primaria: '#ffffff' },
      { primaria: '#1c1917', secundaria: '#ea580c', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'services', 'differentials', 'about', 'testimonials', 'contact', 'cta', 'footer'],
    heroLayout: 'split_image',
    servicesLayout: 'grid_cards',
    suggestedServiceNames: [
      'Pratos Principais & Especialidades da Casa',
      'Opções Rápidas & Almoço Executivo',
      'Bebidas, Cafés & Acompanhamentos',
      'Atendimento no Local & Para Viagem',
    ],
    suggestedDifferentials: [
      'Ingredientes selecionados e preparo cuidadoso',
      'Ambiente agradável para amigos e família',
      'Atendimento cortês e acolhedor',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Consulte o Cardápio', descricao: 'Conheça nossas opções e especialidades preparadas com carinho.' },
      { numero: '02', titulo: 'Faça seu Contato', descricao: 'Consulte disponibilidade de mesas ou pedidos diretamente conosco.' },
      { numero: '03', titulo: 'Aproveite a Experiência', descricao: 'Desfrute de momentos agradáveis e sabores especiais.' },
    ],
    faqTemplates: [
      { pergunta: 'É necessário fazer reserva com antecedência?', resposta: 'Trabalhamos com atendimento por ordem de chegada e reservas sob consulta via WhatsApp.' },
      { pergunta: 'Há opções para viagem ou pedidos antecipados?', resposta: 'Entre em contato pelo WhatsApp para verificar a disponibilidade de pedidos para retirada.' },
      { pergunta: 'Onde o estabelecimento está localizado?', resposta: 'Estamos em localização acessível na cidade. Confira nosso endereço completo na seção de contato.' },
    ],
    defaultImageTheme: 'restaurant',
  },

  workshop: {
    key: 'workshop',
    name: 'Oficina Mecânica & Auto Center',
    aliases: ['oficina', 'mecanica', 'auto center', 'autocenter', 'funilaria', 'lanternagem', 'pneus', 'borracharia', 'eletrica automotiva'],
    defaultStyle: 'BOLD',
    allowedStyles: ['BOLD', 'LOCAL', 'MODERN'],
    tone: 'direto',
    ctaStyle: 'orcamento',
    recommendedPalette: {
      primaria: '#dc2626', // Red 600
      secundaria: '#2563eb', // Blue 600
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#0f172a', secundaria: '#ef4444', texto_sobre_primaria: '#ffffff' },
      { primaria: '#ea580c', secundaria: '#1e293b', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'differentials', 'services', 'process', 'about', 'faq', 'contact', 'cta', 'footer'],
    heroLayout: 'bold_card',
    servicesLayout: 'grid_cards',
    suggestedServiceNames: [
      'Revisão Preventiva Geral',
      'Manutenção de Freios & Suspensão',
      'Troca de Óleo & Filtros',
      'Diagnóstico de Falhas & Injeção',
    ],
    suggestedDifferentials: [
      'Atendimento transparente e objetivo',
      'Avaliação detalhada antes da execução',
      'Compromisso com prazos combinados',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Traga seu Veículo', descricao: 'Entre em contato para agendar ou trazer seu carro para avaliação.' },
      { numero: '02', titulo: 'Diagnóstico & Orçamento', descricao: 'Apresentamos o diagnóstico claro e o orçamento prévio sem surpresas.' },
      { numero: '03', titulo: 'Serviço Concluído', descricao: 'Retirada do veículo revisado com orientações do que foi realizado.' },
    ],
    faqTemplates: [
      { pergunta: 'Como solicitar um orçamento de manutenção?', resposta: 'Basta entrar em contato pelo WhatsApp informando o modelo do veículo e o serviço desejado ou agendar uma visita.' },
      { pergunta: 'Quais marcas e modelos são atendidos?', resposta: 'Atendemos veículos nacionais e importados das principais marcas do mercado.' },
      { pergunta: 'Como funciona o prazo de entrega dos serviços?', resposta: 'O prazo é informado após a avaliação inicial do veículo conforme a disponibilidade das peças e complexidade.' },
    ],
    defaultImageTheme: 'workshop',
  },

  fitness: {
    key: 'fitness',
    name: 'Academia, Pilates & Treinamento',
    aliases: ['academia', 'fitness', 'pilates', 'crossfit', 'treinamento', 'musculacao', 'lutas', 'artes marciais', 'yoga', 'danca'],
    defaultStyle: 'BOLD',
    allowedStyles: ['BOLD', 'MODERN', 'LOCAL'],
    tone: 'energetico',
    ctaStyle: 'agendamento',
    recommendedPalette: {
      primaria: '#4f46e5', // Indigo
      secundaria: '#ec4899', // Pink
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#0f172a', secundaria: '#10b981', texto_sobre_primaria: '#ffffff' },
      { primaria: '#7c3aed', secundaria: '#06b6d4', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'services', 'differentials', 'about', 'testimonials', 'faq', 'contact', 'cta', 'footer'],
    heroLayout: 'bold_card',
    servicesLayout: 'bento_blocks',
    suggestedServiceNames: [
      'Aulas & Treinos Orientados',
      'Avaliação Física Inicial',
      'Treinamento Funcional & Condicionamento',
      'Planos & Modalidades Flexíveis',
    ],
    suggestedDifferentials: [
      'Ambiente motivador e estruturado',
      'Acompanhamento e suporte nos treinos',
      'Variedade de horários e modalidades',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Conheça o Espaço', descricao: 'Entre em contato para agendar uma visita e conhecer as instalações.' },
      { numero: '02', titulo: 'Escolha a Modalidade', descricao: 'Descubra a opção que melhor se encaixa nos seus objetivos e rotina.' },
      { numero: '03', titulo: 'Inicie seus Treinos', descricao: 'Comece a praticar com orientação e consistência para sua saúde.' },
    ],
    faqTemplates: [
      { pergunta: 'É possível fazer uma aula experimental ou visita?', resposta: 'Sim! Entre em contato pelo WhatsApp para agendar um horário e conhecer o espaço.' },
      { pergunta: 'Há acompanhamento para iniciantes?', resposta: 'Sim, nossos instrutores orientam os primeiros passos para que você treine de forma segura.' },
      { pergunta: 'Quais são os horários de funcionamento?', resposta: 'Confira os horários informados abaixo ou consulte nossa equipe para detalhes por modalidade.' },
    ],
    defaultImageTheme: 'fitness',
  },

  realestate: {
    key: 'realestate',
    name: 'Imobiliária & Corretores',
    aliases: ['imobiliaria', 'imoveis', 'corretor', 'corretagem', 'locacao', 'venda de imoveis'],
    defaultStyle: 'PREMIUM',
    allowedStyles: ['PREMIUM', 'MODERN', 'MINIMAL'],
    tone: 'formal',
    ctaStyle: 'contato',
    recommendedPalette: {
      primaria: '#0f172a', // Slate 900
      secundaria: '#d97706', // Gold
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#1e3a8a', secundaria: '#f59e0b', texto_sobre_primaria: '#ffffff' },
      { primaria: '#134e4a', secundaria: '#2dd4bf', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'differentials', 'services', 'about', 'process', 'faq', 'contact', 'cta', 'footer'],
    heroLayout: 'split_image',
    servicesLayout: 'grid_cards',
    suggestedServiceNames: [
      'Intermediação de Venda & Compra',
      'Locação Residencial & Comercial',
      'Avaliação Imobiliária Criteriosa',
      'Assessoria & Suporte em Documentação',
    ],
    suggestedDifferentials: [
      'Atendimento personalizado e transparente',
      'Conhecimento do mercado imobiliário local',
      'Suporte completo em todas as etapas da negociação',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Entendimento do Perfil', descricao: 'Conversamos para entender exatamente o tipo de imóvel ou objetivo desejado.' },
      { numero: '02', titulo: 'Seleção & Visitas', descricao: 'Apresentamos opções compatíveis e agendamos visitas guiadas.' },
      { numero: '03', titulo: 'Condução Segura', descricao: 'Acompanhamento documental completo para uma transação tranquila.' },
    ],
    faqTemplates: [
      { pergunta: 'Como agendar uma visita a um imóvel?', resposta: 'Fale diretamente conosco pelo WhatsApp informando a região e o perfil de imóvel que procura para agendarmos.' },
      { pergunta: 'Como anunciar meu imóvel para venda ou locação?', resposta: 'Entre em contato pelos nossos canais. Faremos uma avaliação prévia e explicaremos todas as condições.' },
      { pergunta: 'Qual é a região de atuação da imobiliária?', resposta: 'Atuamos fortemente na cidade e bairros vizinhos com ampla assessoria local.' },
    ],
    defaultImageTheme: 'realestate',
  },

  pet: {
    key: 'pet',
    name: 'Pet Shop & Clínica Veterinária',
    aliases: ['pet', 'pet shop', 'veterinario', 'veterinaria', 'banho e tosa', 'agropecuaria', 'animais'],
    defaultStyle: 'LOCAL',
    allowedStyles: ['LOCAL', 'MODERN', 'MINIMAL'],
    tone: 'acolhedor',
    ctaStyle: 'agendamento',
    recommendedPalette: {
      primaria: '#059669', // Emerald 600
      secundaria: '#f59e0b', // Amber 500
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#0891b2', secundaria: '#10b981', texto_sobre_primaria: '#ffffff' },
      { primaria: '#854d0e', secundaria: '#22c55e', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'differentials', 'services', 'about', 'testimonials', 'faq', 'contact', 'cta', 'footer'],
    heroLayout: 'split_image',
    servicesLayout: 'grid_cards',
    suggestedServiceNames: [
      'Banho & Tosa com Cuidado Especial',
      'Consultas & Acompanhamento Preventivo',
      'Vacinação & Higiene Pet',
      'Rações & Acessórios Selecionados',
    ],
    suggestedDifferentials: [
      'Carinho e paciência no cuidado com cada animal',
      'Ambiente limpo, seguro e adaptado para pets',
      'Agendamento rápido e flexível',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Agende o Atendimento', descricao: 'Escolha o serviço desejado e reserve o melhor horário para seu pet.' },
      { numero: '02', titulo: 'Recepção & Cuidados', descricao: 'Recebemos seu companheiro com todo o carinho e atenção necessária.' },
      { numero: '03', titulo: 'Pet Pronto & Feliz', descricao: 'Aviso imediato assim que o serviço estiver concluído para retirada.' },
    ],
    faqTemplates: [
      { pergunta: 'Como funciona o agendamento de banho e tosa?', resposta: 'Basta enviar uma mensagem no WhatsApp informando o porte do seu pet e o serviço desejado para reservarmos o horário.' },
      { pergunta: 'Quais cuidados são tomados durante o atendimento?', resposta: 'Utilizamos produtos adequados para animais e realizamos todo o manejo com calma e respeito aos limites do seu pet.' },
      { pergunta: 'Onde o espaço está localizado?', resposta: 'Estamos em endereço de fácil acesso na cidade. Consulte o mapa e endereço na seção de contato.' },
    ],
    defaultImageTheme: 'pet',
  },

  generic: {
    key: 'generic',
    name: 'Comércio & Serviços Locais',
    aliases: [],
    defaultStyle: 'MODERN',
    allowedStyles: ['MODERN', 'LOCAL', 'PREMIUM', 'MINIMAL', 'BOLD'],
    tone: 'acolhedor',
    ctaStyle: 'contato',
    recommendedPalette: {
      primaria: '#4f46e5', // Indigo
      secundaria: '#06b6d4', // Cyan
      texto_sobre_primaria: '#ffffff',
    },
    alternativePalettes: [
      { primaria: '#2563eb', secundaria: '#10b981', texto_sobre_primaria: '#ffffff' },
      { primaria: '#0f172a', secundaria: '#6366f1', texto_sobre_primaria: '#ffffff' },
    ],
    sectionsOrder: ['hero', 'differentials', 'services', 'about', 'testimonials', 'faq', 'contact', 'cta', 'footer'],
    heroLayout: 'split_image',
    servicesLayout: 'grid_cards',
    suggestedServiceNames: [
      'Atendimento Especializado',
      'Soluções Sob Medida',
      'Orientação & Suporte',
      'Serviços Dedicados',
    ],
    suggestedDifferentials: [
      'Atendimento dedicado e transparente',
      'Facilidade de contato e comunicação ágil',
      'Compromisso com a satisfação do cliente',
    ],
    safeProcessSteps: [
      { numero: '01', titulo: 'Fale Conosco', descricao: 'Entre em contato para apresentar sua demanda ou tirar dúvidas.' },
      { numero: '02', titulo: 'Alinhamento', descricao: 'Entendemos o que você precisa e apresentamos as melhores opções.' },
      { numero: '03', titulo: 'Atendimento', descricao: 'Execução com dedicação e foco na qualidade combinada.' },
    ],
    faqTemplates: [
      { pergunta: 'Como posso entrar em contato ou solicitar atendimento?', resposta: 'Você pode falar diretamente conosco pelo WhatsApp ou telefone informado nesta página.' },
      { pergunta: 'Qual é a região de atendimento?', resposta: 'Atendemos na cidade e região. Entre em contato para confirmar a disponibilidade para sua localização.' },
      { pergunta: 'Quais são os horários de funcionamento?', resposta: 'Confira os horários informados nesta página ou envie sua mensagem que retornaremos prontamente.' },
    ],
    defaultImageTheme: 'business',
  },
};

/**
 * Identify the most suitable niche profile given the business category, tags, or name
 */
export function detectNicheProfile(category: string, name = '', tags: Record<string, string> = {}): NicheDefinition {
  const textToSearch = `${category} ${name} ${Object.values(tags).join(' ')}`.toLowerCase();

  for (const [key, niche] of Object.entries(NICHE_DEFINITIONS)) {
    if (key === 'generic') continue;
    for (const alias of niche.aliases) {
      if (textToSearch.includes(alias.toLowerCase())) {
        return niche;
      }
    }
  }

  return NICHE_DEFINITIONS.generic;
}
