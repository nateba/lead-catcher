export interface LeadItem {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  hasWebsite: boolean;
  websiteStatus: 'Não encontrado' | 'Desatualizado' | 'Encontrado';
  city: string;
  niche: string;
  opportunity: 'Alta' | 'Média' | 'Baixa';
  score: number;
  phone?: string;
  address?: string;
}

export interface GenerationStep {
  label: string;
  status: 'completed' | 'processing' | 'pending';
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  featured?: boolean;
  badge?: string;
  installments?: string[];
  features: string[];
  cta: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
