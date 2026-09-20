import { Lead } from '../types';

export interface OutreachStep {
  id: string;
  order: number;
  title: string;
  hint: string;
  dotColor: string;
  text: string;
}

// The five-step approach the user works through on WhatsApp. Kept as data so
// each step can be copied or sent on its own.
export function buildOutreachScript(lead: Lead): OutreachStep[] {
  const name = lead.name;
  const segment = (lead.categoryLabel || 'negócios locais').toLowerCase();
  const place = lead.address || lead.city || 'sua região';

  return [
    {
      id: 'abertura',
      order: 1,
      title: 'Abertura',
      hint: 'Quebre o gelo com cordialidade',
      dotColor: 'bg-amber-400',
      text: `Olá! Tudo bem? Falo com o responsável pela ${name}?`,
    },
    {
      id: 'apresentacao',
      order: 2,
      title: 'Apresentação',
      hint: 'Quem é você e o que faz',
      dotColor: 'bg-violet-400',
      text: `Meu nome é [Seu Nome] e trabalho criando sites profissionais de alta conversão para empresas do segmento de ${segment} aqui em ${place}.`,
    },
    {
      id: 'diagnostico',
      order: 3,
      title: 'Diagnóstico',
      hint: 'Mostre que estudou o cliente',
      dotColor: 'bg-pink-500',
      text: `Analisei rapidamente a presença digital da ${name} e identifiquei pontos importantes que estão fazendo a empresa perder clientes todos os dias para a concorrência.`,
    },
    {
      id: 'proposta',
      order: 4,
      title: 'Proposta de valor',
      hint: 'Os 3 resultados que entrega',
      dotColor: 'bg-orange-400',
      text: `Preparei uma proposta exclusiva de site profissional pensada especificamente para a ${name}, com foco em três entregas claras:

✅ Captação ativa de novos clientes pelo Google e redes sociais
✅ Autoridade e credibilidade que justificam um ticket maior
✅ Atendimento integrado ao WhatsApp, 24h por dia, sem perder lead`,
    },
    {
      id: 'fechamento',
      order: 5,
      title: 'Fechamento',
      hint: 'Chamada para ação direta',
      dotColor: 'bg-emerald-400',
      text: `Já deixei uma prévia do projeto pronta para você visualizar. Posso te enviar agora mesmo para agendar uma conversa?`,
    },
  ];
}

export function buildFullOutreachText(lead: Lead): string {
  return buildOutreachScript(lead)
    .map((step) => step.text)
    .join('\n\n');
}

export function buildWhatsappUrl(phone: string, message: string): string | null {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length < 10) return null;
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}
