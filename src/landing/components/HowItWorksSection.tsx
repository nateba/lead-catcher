import React from 'react';
import { 
  MapPin, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Globe2,
  Users2
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      action: 'ENCONTRE',
      desc: 'Escolha cidade e nicho.',
      icon: MapPin,
      highlight: 'Varredura e inteligência de leads em tempo real',
    },
    {
      step: '02',
      action: 'ANALISE',
      desc: 'Priorize boas oportunidades.',
      icon: Filter,
      highlight: 'Filtro automático de quem não tem site',
    },
    {
      step: '03',
      action: 'CRIE',
      desc: 'Gere o site com IA.',
      icon: Sparkles,
      highlight: 'Layout completo e copy persuasiva em segundos',
    },
    {
      step: '04',
      action: 'VENDA',
      desc: 'Apresente e feche.',
      icon: CheckCircle2,
      highlight: 'Abordagem consultiva com a solução já pronta',
    },
  ];

  const pipeline = [
    { label: 'HypeLeads', icon: Sparkles, active: true },
    { label: 'Lead', icon: Database },
    { label: 'Site', icon: Globe2 },
    { label: 'Cliente', icon: Users2 },
  ];

  return (
    <section id="como-funciona" className="relative py-24 md:py-36 lg:py-44 overflow-hidden border-t border-[#0b0716]">
      
      {/* Background subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#36145A]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Editorial Headline */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D0717] border border-[#25103A] text-xs font-semibold text-[#B65AF0]">
            Processo Simples
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F2F7] leading-tight tracking-[-0.035em]">
            Como funciona
          </h2>
          <p className="text-base text-[#98949E] max-w-md mx-auto">
            Um fluxo fluido e direto para você fechar contratos todos os dias.
          </p>
        </div>

        {/* Cinematic Pipeline Visual Nodes: HypeLeads → Lead → Site → Cliente */}
        <div className="mb-16 sm:mb-20 max-w-3xl mx-auto">
          <div className="relative rounded-2xl bg-[#050309]/90 border border-[#160C26] p-4 sm:p-6 backdrop-blur-xl shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto py-1">
              {pipeline.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <React.Fragment key={item.label}>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                        item.active 
                          ? 'bg-gradient-to-br from-[#8126C2] to-[#36145A] text-white shadow-[0_0_20px_#8126C2]' 
                          : 'bg-[#0A0614] border border-[#1C0D2A] text-[#98949E]'
                      }`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className={`text-xs sm:text-sm font-bold font-display ${
                        item.active ? 'text-white' : 'text-[#817D8A]'
                      }`}>
                        {item.label}
                      </span>
                    </div>

                    {idx < pipeline.length - 1 && (
                      <div className="flex items-center text-[#36145A] shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4 Steps Rhythm Grid (Clean, generous spacing, large typography) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative rounded-2xl bg-[#05040A]/80 border border-[#130B20] hover:border-[#36145A]/70 p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_35px_rgba(90,20,48,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-[#211035] group-hover:text-[#36145A] transition-colors font-display">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#0A0614] border border-[#1B0E2B] group-hover:border-[#8126C2]/50 flex items-center justify-center text-[#8126C2] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#F4F2F7] tracking-tight font-display mb-1.5">
                    {item.action}
                  </h3>

                  <p className="text-sm font-medium text-[#98949E]">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#0d0818] text-[11px] text-[#817D8A]">
                  {item.highlight}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
