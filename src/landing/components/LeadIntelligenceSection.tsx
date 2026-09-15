import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Star, 
  Globe, 
  TrendingUp, 
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Clock,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { LeadItem } from '../types';

interface LeadIntelligenceSectionProps {
  onGenerateForLead?: (lead: LeadItem) => void;
}

export const LeadIntelligenceSection: React.FC<LeadIntelligenceSectionProps> = ({ onGenerateForLead }) => {
  const odontoPrime: LeadItem = {
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
  };

  return (
    <section id="inteligencia" className="relative py-24 md:py-36 lg:py-44 overflow-hidden border-t border-[#0b0716]">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#36145A]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical 2-Column High-End Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Bold Editorial Presentation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F0A1A] border border-[#27113E] text-xs font-semibold text-[#B65AF0]">
              <Sparkles className="w-3.5 h-3.5" />
              Lead Intelligence
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F2F7] leading-[1.08] tracking-[-0.035em]">
              Priorize quem realmente quer comprar.
            </h2>

            <p className="text-base sm:text-lg text-[#98949E] leading-relaxed max-w-md">
              A HypeLeads cruza telefone, WhatsApp, endereço completo e ausência de site no OpenStreetMap para entregar oportunidades prontas para fechamento.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#F4F2F7]">
                <div className="w-6 h-6 rounded-full bg-[#1C0D2A] border border-[#36145A] flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-[#8126C2]" />
                </div>
                <span>Filtro automático de negócios sem site oficial</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-[#F4F2F7]">
                <div className="w-6 h-6 rounded-full bg-[#1C0D2A] border border-[#36145A] flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-[#8126C2]" />
                </div>
                <span>Score preditivo de propensão de fechamento</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-[#F4F2F7]">
                <div className="w-6 h-6 rounded-full bg-[#1C0D2A] border border-[#36145A] flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-[#8126C2]" />
                </div>
                <span>Telefone e WhatsApp direto dos responsáveis</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onGenerateForLead && onGenerateForLead(odontoPrime)}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B65AF0] hover:text-white transition-colors"
              >
                <span>Ver fluxo completo deste lead</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column: Deep Product Showcase (OdontoPrime Card) */}
          <div className="lg:col-span-7">
            <div className="relative">
              
              {/* Backlight glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#36145A]/30 to-[#8126C2]/20 rounded-3xl blur-2xl opacity-70" />

              {/* Glass Container */}
              <div className="relative rounded-2xl md:rounded-[24px] bg-[#05040A]/90 backdrop-blur-xl border border-[#1B0E2B] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] space-y-6">
                
                {/* Header with Name & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#10091C]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-2xl font-bold text-[#F4F2F7] font-display">
                        OdontoPrime
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#36145A]/70 text-[#B65AF0] text-xs font-semibold border border-[#8126C2]/50 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Oportunidade Alta
                      </span>
                    </div>
                    <p className="text-xs text-[#817D8A] mt-1 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#8126C2]" />
                      São Paulo, SP · Av. Paulista, 1200
                    </p>
                  </div>

                  {/* Visual Radial Gauge Score 92 */}
                  <div className="flex items-center gap-3 bg-[#090613] border border-[#1A0D2B] rounded-2xl px-4 py-2.5 self-start sm:self-auto">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          className="stroke-[#150B22]"
                          strokeWidth="3.5"
                          fill="transparent"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          className="stroke-[#8126C2]"
                          strokeWidth="3.5"
                          strokeDasharray="125.6"
                          strokeDashoffset="10"
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-sm font-extrabold text-[#F4F2F7] font-display">
                        92
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase tracking-wider text-[#817D8A] font-semibold">
                        Lead Score
                      </div>
                      <div className="text-xs font-medium text-emerald-400">
                        Altíssima Conversão
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid (Clean, sophisticated, not a generic card) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  <div className="p-3.5 rounded-xl bg-[#09050F] border border-[#10091C]">
                    <span className="text-[10px] uppercase font-semibold text-[#817D8A] block mb-1">
                      WhatsApp
                    </span>
                    <div className="flex items-center gap-1.5 text-base font-bold text-[#F4F2F7] font-display">
                      <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      Disponível
                    </div>
                    <span className="text-[10px] text-[#817D8A]">Telefone validado</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#09050F] border border-[#10091C]">
                    <span className="text-[10px] uppercase font-semibold text-[#817D8A] block mb-1">
                      Status do Site
                    </span>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-[#B65AF0] font-display">
                      <Globe className="w-4 h-4" />
                      Não encontrado
                    </div>
                    <span className="text-[10px] text-rose-400/80">Sem página web</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#09050F] border border-[#10091C]">
                    <span className="text-[10px] uppercase font-semibold text-[#817D8A] block mb-1">
                      Segmento
                    </span>
                    <div className="text-xs font-semibold text-[#F4F2F7] truncate font-display pt-1">
                      Clínica Odontológica
                    </div>
                    <span className="text-[10px] text-[#817D8A]">Ticket médio alto</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#09050F] border border-[#10091C]">
                    <span className="text-[10px] uppercase font-semibold text-[#817D8A] block mb-1">
                      Potencial Mensal
                    </span>
                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-400 font-display">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +45 clientes
                    </div>
                    <span className="text-[10px] text-[#817D8A]">Demanda reprimida</span>
                  </div>

                </div>

                {/* AI Opportunity Diagnostic Snippet */}
                <div className="p-4 rounded-xl bg-[#0A0614] border border-[#1C0E2E] flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-[#1C0D2A] text-[#B65AF0] shrink-0 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-[#F4F2F7]">
                      Diagnóstico de Abordagem Comercial
                    </div>
                    <p className="text-[#98949E] leading-relaxed">
                      Estabelecimento consolidado em área nobre, com telefone e WhatsApp validados. A ausência de site faz com que pacientes pesquisem na busca e migrem para concorrentes com agendamento online.
                    </p>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-[#817D8A]">
                    <span className="flex items-center gap-1 text-[#F4F2F7]">
                      <PhoneCall className="w-3.5 h-3.5 text-[#8126C2]" />
                      (11) 98421-9904
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Atualizado há 14min
                    </span>
                  </div>

                  <button
                    onClick={() => onGenerateForLead && onGenerateForLead(odontoPrime)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#8126C2] to-[#9436D9] hover:shadow-[0_0_20px_rgba(194,38,85,0.45)] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Gerar site para OdontoPrime
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
