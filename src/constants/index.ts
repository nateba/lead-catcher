import { LeadStatus, AppSettings } from '../types';

export const STORAGE_KEYS = {
  LEADS: 'leadsite_crm_leads_v2',
  SETTINGS: 'leadsite_settings_v2',
  RECENT_SEARCHES: 'leadsite_recent_searches_v2',
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  overpassServer: 'auto',
  darkMode: false,
  onboardingCompleted: false,
  userName: 'Consultor Digital',
  agencyName: 'Minha Agência Digital',
};

export const COLOR_PRESETS = [
  { name: 'Índigo Moderno', primary: '#4f46e5', secondary: '#06b6d4' },
  { name: 'Esmeralda & Ouro', primary: '#059669', secondary: '#d97706' },
  { name: 'Azul Corporativo', primary: '#2563eb', secondary: '#38bdf8' },
  { name: 'Vinho & Bronze', primary: '#881337', secondary: '#f59e0b' },
  { name: 'Roxo Criativo', primary: '#7c3aed', secondary: '#ec4899' },
  { name: 'Dark Monocromático', primary: '#0f172a', secondary: '#64748b' },
];

export const CRM_STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; badgeBg: string; textClass: string; dotColor: string }
> = {
  NOVO: {
    label: 'Novo',
    color: 'border-slate-400',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    textClass: 'text-slate-600 dark:text-slate-400',
    dotColor: 'bg-slate-400',
  },
  SITE_GERADO: {
    label: 'Site Gerado',
    color: 'border-indigo-500',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    dotColor: 'bg-indigo-500',
  },
  PRONTO_CONTATO: {
    label: 'Pronto Contato',
    color: 'border-cyan-500',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    textClass: 'text-cyan-600 dark:text-cyan-400',
    dotColor: 'bg-cyan-500',
  },
  MENSAGEM_ENVIADA: {
    label: 'Msg Enviada',
    color: 'border-sky-500',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    textClass: 'text-sky-600 dark:text-sky-400',
    dotColor: 'bg-sky-500',
  },
  RESPONDEU: {
    label: 'Respondeu',
    color: 'border-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    textClass: 'text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  NEGOCIACAO: {
    label: 'Negociação',
    color: 'border-blue-500',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    textClass: 'text-blue-600 dark:text-blue-400',
    dotColor: 'bg-blue-500',
  },
  REUNIAO_MARCADA: {
    label: 'Reunião',
    color: 'border-purple-500',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    textClass: 'text-purple-600 dark:text-purple-400',
    dotColor: 'bg-purple-500',
  },
  FECHADO: {
    label: 'Fechado',
    color: 'border-emerald-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  PERDIDO: {
    label: 'Perdido',
    color: 'border-rose-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    textClass: 'text-rose-600 dark:text-rose-400',
    dotColor: 'bg-rose-500',
  },
  RECUSADO: {
    label: 'Perdido',
    color: 'border-rose-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    textClass: 'text-rose-600 dark:text-rose-400',
    dotColor: 'bg-rose-500',
  },
};

export const CRM_KANBAN_COLUMNS: { status: LeadStatus; label: string; desc?: string }[] = [
  { status: 'NOVO', label: '1. Novo Lead', desc: 'Salvo da busca' },
  { status: 'SITE_GERADO', label: '2. Site Gerado', desc: 'Página criada' },
  { status: 'PRONTO_CONTATO', label: '3. Pronto Contato', desc: 'Copy preparada' },
  { status: 'MENSAGEM_ENVIADA', label: '4. Msg Enviada', desc: 'Abordagem feita' },
  { status: 'RESPONDEU', label: '5. Respondeu', desc: 'Interesse inicial' },
  { status: 'NEGOCIACAO', label: '6. Negociação', desc: 'Proposta e valores' },
  { status: 'REUNIAO_MARCADA', label: '7. Reunião', desc: 'Call agendada' },
  { status: 'FECHADO', label: '8. Fechado', desc: 'Venda realizada' },
  { status: 'PERDIDO', label: '9. Perdido', desc: 'Oportunidade perdida' },
];

export const CRM_LOST_REASONS = [
  'Sem interesse no momento',
  'Já possui site / agência contratada',
  'Achou o preço elevado',
  'Não respondeu ao contato',
  'Contato / telefone inválido',
  'Fechou com concorrente',
  'Outro motivo',
];

export const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.openstreetmap.ru/cgi/interpreter',
];
