import React from 'react';
import { ArrowRight, Search, Sparkles, Check, Zap } from 'lucide-react';

interface ValuePropositionProps {
  onStartClick: () => void;
}

export const ValuePropositionSection: React.FC<ValuePropositionProps> = ({ onStartClick }) => {
  return (
    <section className="relative py-24 md:py-36 lg:py-44 overflow-hidden border-t border-[#0b0716]">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#36145A]/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Formula Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B65AF0]">
            A Proposta Central
          </span>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F2F7] leading-[1.08] tracking-[-0.035em]">
            Duas ferramentas essenciais unidas em um único lugar.
          </h2>
        </div>

        {/* The Two Pillars Visual Juxtaposition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Pillar 1 */}
          <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#090610] to-[#050307] border border-[#1B0E2B] p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#160C23] border border-[#301448] flex items-center justify-center text-[#B65AF0]">
                <Search className="w-6 h-6" />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-[#8126C2]">
                Pilar 01
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2F7] tracking-tight font-display">
                Encontrar para quem vender
              </h3>

              <p className="text-sm text-[#98949E] leading-relaxed">
                Descubra negócios lucrativos da sua região que possuem clientes e faturamento, mas ainda não têm um site moderno no Google.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#10091C] space-y-2 text-xs text-[#817D8A]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8126C2]" />
                Varredura direta no OpenStreetMap
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8126C2]" />
                Filtro de oportunidades de alto valor
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#0C0715] to-[#040308] border border-[#27123E] p-8 sm:p-10 flex flex-col justify-between shadow-[0_20px_60px_rgba(90,20,48,0.25)]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8126C2] to-[#36145A] flex items-center justify-center text-white shadow-[0_0_20px_rgba(194,38,85,0.4)]">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-[#B65AF0]">
                Pilar 02
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2F7] tracking-tight font-display">
                Criar o que apresentar
              </h3>

              <p className="text-sm text-[#98949E] leading-relaxed">
                A IA desenvolve a página completa personalizada para o cliente em segundos. Você já chega na conversa mostrando o resultado.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#130B22] space-y-2 text-xs text-[#817D8A]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#B65AF0]" />
                Copy, layout e seções geradas com IA
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#B65AF0]" />
                Ajuste cores, textos e depoimentos direto na prévia ao vivo
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#B65AF0]" />
                Exporte leads em CSV ou faça backup completo em JSON
              </div>
            </div>
          </div>

        </div>

        {/* Central Closing Conversion Card */}
        <div className="mt-10 max-w-4xl mx-auto text-center p-6 sm:p-8 rounded-2xl bg-[#06040B]/80 border border-[#150C24] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-left space-y-1">
            <div className="text-base font-bold text-[#F4F2F7] font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8126C2]" />
              Sem assinaturas de múltiplas ferramentas
            </div>
            <p className="text-xs text-[#817D8A]">
              Você não precisa pagar um scraper de leads e outro construtor de sites separado.
            </p>
          </div>

          <button
            onClick={onStartClick}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#8126C2] to-[#9436D9] hover:shadow-[0_0_25px_rgba(194,38,85,0.5)] transition-all flex items-center justify-center gap-2 shrink-0"
          >
            Começar agora
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
