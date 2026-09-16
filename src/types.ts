export type OsmType = 'node' | 'way' | 'relation';

export type LeadStatus =
  | 'NOVO'
  | 'SITE_GERADO'
  | 'PRONTO_CONTATO'
  | 'MENSAGEM_ENVIADA'
  | 'RESPONDEU'
  | 'NEGOCIACAO'
  | 'REUNIAO_MARCADA'
  | 'FECHADO'
  | 'PERDIDO'
  | 'RECUSADO'; // Compatibility alias for PERDIDO

export type ActivityType =
  | 'LEAD_SALVO'
  | 'SITE_GERADO'
  | 'MENSAGEM_PREPARADA'
  | 'MENSAGEM_ENVIADA'
  | 'STATUS_ALTERADO'
  | 'RESPOSTA_RECEBIDA'
  | 'NOTA_ADICIONADA'
  | 'FOLLOWUP_CRIADO'
  | 'FOLLOWUP_CONCLUIDO'
  | 'REUNIAO_MARCADA'
  | 'NEGOCIO_FECHADO'
  | 'MARCADO_PERDIDO';

export interface LeadActivity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string; // ISO string
  metadata?: Record<string, any>;
}

export interface LeadFollowUp {
  date: string; // YYYY-MM-DD
  note?: string;
  completed?: boolean;
}

export interface LeadNoteItem {
  id: string;
  text: string;
  createdAt: string; // ISO string
}

export interface LeadMeeting {
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  note?: string;
}

export type LeadQualityTier = 'EXCELLENT' | 'GOOD' | 'MEDIUM' | 'LOW';

export type WebsiteStatus = 'HAS_WEBSITE' | 'NO_WEBSITE_IDENTIFIED';

export interface LeadScoreBreakdown {
  phoneScore: number;
  whatsappScore: number;
  noWebsiteScore: number;
  addressScore: number;
  openingHoursScore: number;
  categoryScore: number;
  distanceScore: number;
  completenessScore: number;
  penaltyClosed: number;
  totalScore: number;
}

export interface Lead {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  city: string;
  state: string;
  address: string;
  street?: string;
  housenumber?: string;
  neighbourhood?: string;
  postcode?: string;
  phone: string;
  cleanPhone?: string;
  whatsappAvailable: boolean;
  website?: string;
  hasWebsite: boolean;
  websiteStatus: WebsiteStatus;
  opening_hours?: string;
  lat: number;
  lng: number;
  distanceKm: number;
  distanceFormatted: string;
  osmType: OsmType;
  osmId: string | number;
  initials: string;
  avatarBg: string;
  closed?: boolean;
  tags?: Record<string, string>;
  source: 'openstreetmap';
  leadScore: number; // 0 to 100
  leadQuality: LeadQualityTier;
  leadQualityLabel: string;
  scoreBreakdown?: LeadScoreBreakdown;
  dataCompleteness: number; // 0 to 100%
}

export interface ServiceItem {
  titulo: string;
  descricao: string;
  icone_sugerido: string;
}

export interface TestimonialItem {
  texto: string;
  autor: string;
  estrelas: number;
}

export interface FaqItem {
  pergunta: string;
  resposta: string;
}

export interface ColorPalette {
  primaria: string;
  secundaria: string;
  texto_sobre_primaria?: string;
}

export type VisualStyleType = 'MODERN' | 'PREMIUM' | 'LOCAL' | 'MINIMAL' | 'BOLD';

export interface GeneratedSite {
  estilo_visual?: VisualStyleType;
  paleta_sugerida: ColorPalette;
  headline: string;
  subheadline: string;
  sobre_titulo: string;
  sobre_texto: string;
  servicos: ServiceItem[];
  diferenciais: string[];
  depoimentos: TestimonialItem[];
  faq: FaqItem[];
  cta_titulo: string;
  cta_texto: string;
  meta_descricao_seo: string;
  palavras_chave_seo?: string;
  mensagem_abordagem_whatsapp?: string;
  mostrar_depoimentos?: boolean;
}

export interface SavedLead {
  id: string;
  lead: Lead;
  siteData?: GeneratedSite;
  customColors?: {
    primary: string;
    secondary: string;
  };
  status: LeadStatus;
  dealValue?: number;
  lostReason?: string;
  meetingInfo?: LeadMeeting;
  outreachMessage?: string;
  notes?: string;
  notesList?: LeadNoteItem[];
  activities?: LeadActivity[];
  followUp?: LeadFollowUp | null;
  generatedAt: string;
  updatedAt: string;
  closedAt?: string | null;
  lostAt?: string | null;
}

export type SortOption =
  | 'opportunity'
  | 'score'
  | 'distance'
  | 'name'
  | 'completeness'
  | 'no_website_first';

export interface SearchFilters {
  state: string;
  city: string;
  categoryKey: string;
  customCategoryTag?: string;
  radiusKm: number;
  limit: number;
  onlyWithPhone: boolean;
  onlyWithFullAddress: boolean;
  excludeClosed: boolean;
  minScore?: number;
  websiteFilter?: 'all' | 'no_website_only' | 'has_website_only';
}

export interface BusinessCategory {
  key: string;
  label: string;
  iconName: string;
  osmTag: string; // e.g., 'amenity=restaurant'
  description?: string;
  synonyms?: string[];
}

export interface RecentSearch {
  id: string;
  city: string;
  state: string;
  categoryKey: string;
  categoryLabel: string;
  radiusKm: number;
  limit: number;
  timestamp: number;
}

export interface AppSettings {
  overpassServer: 'auto' | 'overpass-api.de' | 'overpass.kumi.systems' | 'mail.ru';
  darkMode: boolean;
  onboardingCompleted: boolean;
  userName: string;
  agencyName: string;
}

export type ViewMode = 'grid' | 'list' | 'map';
export type ActiveTab = 'search' | 'crm' | 'metrics' | 'settings' | 'admin';
export type DevicePreviewMode = 'desktop' | 'tablet' | 'mobile';
