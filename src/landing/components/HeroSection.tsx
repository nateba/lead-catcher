import React from 'react';
import { ArrowRight, Play, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { HeroMockup } from './HeroMockup';
import { LeadItem } from '../types';

interface HeroSectionProps {
  onStartClick: () => void;
  onSelectLead: (lead: LeadItem) => void;
  onGenerateSite: (lead: LeadItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartClick,
  onSelectLead,
  onGenerateSite,
}) => {
  return (
    <section id="inicio" className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden">
      
      {/* Central lighting core for the hero headline */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#36145A]/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Eyebrow / Feature Pill */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0712]/90 border border-[#25123A] shadow-[0_0_20px_rgba(90,20,48,0.3)]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8126C2] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8126C2]" />
            </span>
            <span className="text-xs font-medium text-[#F4F2F7] tracking-tight">
              Prospecção via OpenStreetMap + Criação com IA
            </span>
            <span className="text-[10px] text-[#B65AF0] bg-[#1C0D2A] px-2 py-0.5 rounded-full font-semibold">
              v2.4
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold text-[#F4F2F7] leading-[1.04] tracking-[-0.035em]">
            Encontre clientes.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4F2F7] via-[#B65AF0] to-[#8126C2]">
              Crie o site.
            </span>{' '}
            Feche o negócio.
          </h1>

          {/* Subheadline - concise, crisp */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#98949E] font-normal leading-relaxed">
            Encontre negócios reais pelo OpenStreetMap, identifique oportunidades e gere sites profissionais com IA para apresentar e vender.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <a
              href="#planos"
              onClick={(e) => {
                e.preventDefault();
                onStartClick();
              }}
              id="hero-primary-cta"
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold text-white tracking-wide overflow-hidden shadow-[0_0_40px_-5px_rgba(194,38,85,0.6)] transition-all duration-300 hover:shadow-[0_0_55px_rgba(240,90,130,0.8)] hover:scale-[1.02] active:scale-95"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#8126C2] via-[#9436D9] to-[#8126C2] transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_70%)]" />
              <span className="relative z-10 flex items-center gap-2">
                Começar agora
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </a>

            <a
              href="#como-funciona"
              id="hero-secondary-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm font-medium text-[#F4F2F7] bg-[#0B0712]/80 hover:bg-[#100B1C] border border-[#1B0E2B] hover:border-[#36145A] transition-all duration-200 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 text-[#8126C2] fill-[#8126C2]" />
              Ver como funciona
            </a>
          </div>

          {/* Trust Micro-Indicators */}
          <div className="pt-3 flex items-center justify-center gap-6 text-xs text-[#817D8A]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8126C2]" />
              Sem necessidade de código
            </span>
            <span className="hidden sm:inline text-[#1C0D2A]">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#B65AF0]" />
              Sites gerados em segundos
            </span>
          </div>

        </div>

        {/* Floating Product UI Stage */}
        <div className="mt-14 sm:mt-18 lg:mt-22 relative">
          <HeroMockup 
            onSelectLead={onSelectLead}
            onGenerateSite={onGenerateSite}
          />
        </div>

      </div>
    </section>
  );
};
