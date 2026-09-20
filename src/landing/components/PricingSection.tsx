import React, { useState } from 'react';
import { Check, Sparkles, Shield, ArrowRight, Zap, Flame } from 'lucide-react';
import { PRICING_PLANS } from '../data/mockData';
import { ScrollReveal } from '../../components/ScrollReveal';

interface PricingSectionProps {
  onSelectPlan: (planId: string) => void;
  remainingSlots?: number;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ 
  onSelectPlan, 
  remainingSlots = 3 
}) => {
  const [selectedInstallment, setSelectedInstallment] = useState<'pix' | '12x' | '6x'>('pix');

  return (
    <section id="planos" className="relative py-24 md:py-36 lg:py-44 overflow-hidden border-t border-[#0b0716]">
      
      {/* Background ambient glow centered on pricing cards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[#36145A]/22 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0d0718] border border-[#23103A] text-xs font-semibold text-[#B65AF0]">
            <Sparkles className="w-3.5 h-3.5" />
            Planos e Acesso
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F2F7] leading-tight tracking-[-0.035em]">
            Escolha como quer começar
          </h2>

          <p className="text-base text-[#98949E] max-w-md mx-auto">
            Sem pegadinhas. Comece a prospectar e gerar sites profissionais hoje mesmo.
          </p>
        </ScrollReveal>

        {/* Pricing Cards Grid (Rhythm: Mensal clean, Vitalício dominating with special border & glow) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Card 1: Plano Mensal (5 columns) */}
          <ScrollReveal direction="up" delay={200} className="lg:col-span-5">
          <div className="h-full rounded-2xl md:rounded-3xl bg-[#050409]/90 border border-[#140C22] p-7 sm:p-9 flex flex-col justify-between transition-all hover:border-[#231238]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#F4F2F7] font-display">
                  Plano Mensal
                </h3>
                <span className="text-[11px] font-medium text-[#817D8A] bg-[#0A0614] px-2.5 py-0.5 rounded-full border border-[#150C24]">
                  Recorrente
                </span>
              </div>

              <p className="text-xs text-[#98949E] mb-6">
                Renovação mensal com liberdade para cancelar a qualquer momento.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 pb-6 border-b border-[#0E081B]">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#F4F2F7] font-display">
                  R$ 169,90
                </span>
                <span className="text-xs text-[#817D8A]">
                  / mês
                </span>
              </div>

              {/* Features List */}
              <div className="py-6 space-y-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#817D8A] block">
                  O que está incluso:
                </span>
                {PRICING_PLANS[0].features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-[#98949E]">
                    <div className="w-4 h-4 rounded-full bg-[#0d0718] flex items-center justify-center shrink-0 mt-0.5 text-[#8126C2]">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button
                onClick={() => onSelectPlan('mensal')}
                className="w-full py-3.5 px-6 rounded-xl text-xs font-semibold text-[#F4F2F7] bg-[#0A0614] hover:bg-[#10091E] border border-[#1B0E2B] hover:border-[#36145A] transition-all flex items-center justify-center gap-2"
              >
                Assinar Plano Mensal
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          </ScrollReveal>

          {/* Card 2: Plano Acesso Pra Sempre (7 columns - Dominant Presence) */}
          <ScrollReveal direction="up" delay={350} duration={800} className="lg:col-span-7">
          <div className="h-full relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#0b0716] via-[#07040E] to-[#050307] border-2 border-[#8126C2]/60 p-8 sm:p-10 flex flex-col justify-between shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(194,38,85,0.25)]">
            
            {/* Top Badge (🔥 RESTAM APENAS X ACESSOS NESTE LOTE) */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white text-[11px] font-extrabold uppercase tracking-wide shadow-[0_0_20px_#B65AF0]">
                <Flame className="w-3.5 h-3.5 fill-white text-white" />
                RESTAM APENAS {remainingSlots} ACESSOS NESTE LOTE
              </span>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pt-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2F7] font-display flex items-center gap-2">
                    Plano Acesso Pra Sempre
                  </h3>
                  <span className="text-xs text-[#B65AF0] font-semibold mt-0.5 block">
                    Pagamento único. Acesso vitalício.
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#211035] border border-[#8126C2]/50 text-white text-xs font-semibold self-start sm:self-auto">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Mais Escolhido
                </div>
              </div>

              <p className="text-xs text-[#98949E] mb-6">
                Tenha a HypeLeads para sempre sem nunca mais pagar nenhuma mensalidade ou renovação.
              </p>

              {/* Pricing Box & Installments Selector */}
              <div className="p-4 rounded-2xl bg-[#090511] border border-[#1B0E2B] mb-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#120921]">
                  <div>
                    <span className="text-3xl sm:text-4xl font-black text-[#F4F2F7] font-display">
                      R$ 249,90
                    </span>
                    <span className="text-xs text-[#B65AF0] font-bold ml-1.5">
                      à vista no Pix
                    </span>
                  </div>
                  <div className="text-xs text-[#817D8A]">
                    Sem taxas adicionais
                  </div>
                </div>

                {/* Installment Options in Pill Tabs */}
                <div className="pt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#0c0718] border border-[#1C0E30] text-[#F4F2F7] text-center font-medium">
                    12x de <strong className="text-white">R$ 26,63</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0c0718] border border-[#1C0E30] text-[#F4F2F7] text-center font-medium">
                    6x de <strong className="text-white">R$ 47,91</strong>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pb-6">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#B65AF0] block">
                  Vantagens Exclusivas do Acesso Pra Sempre:
                </span>
                {PRICING_PLANS[1].features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-[#F4F2F7]">
                    <div className="w-4 h-4 rounded-full bg-[#211035] flex items-center justify-center shrink-0 mt-0.5 text-[#B65AF0]">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Contrast Dominant CTA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onSelectPlan('vitalicio')}
                id="pricing-vitalicio-cta"
                className="w-full group relative py-4 px-8 rounded-xl text-sm font-extrabold text-white tracking-wide bg-gradient-to-r from-[#8126C2] via-[#9436D9] to-[#8126C2] hover:shadow-[0_0_40px_rgba(240,90,130,0.7)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Garantir Acesso Vitalício</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[#817D8A]">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Garantia incondicional de 7 dias
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#B65AF0]" />
                  Acesso liberado imediatamente
                </span>
              </div>
            </div>

          </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
