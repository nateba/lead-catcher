import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-24 md:py-36 lg:py-44 overflow-hidden border-t border-[#0b0716]">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#36145A]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0d0718] border border-[#23103A] text-xs font-semibold text-[#B65AF0]">
            <HelpCircle className="w-3.5 h-3.5" />
            Perguntas Frequentes
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F4F2F7] leading-tight tracking-[-0.035em]">
            Dúvidas frequentes
          </h2>

          <p className="text-base text-[#98949E]">
            Tudo o que você precisa saber sobre a HypeLeads de forma direta e transparente.
          </p>
        </div>

        {/* Clean Minimalist Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen 
                    ? 'bg-[#080510] border-[#36145A]/80 shadow-[0_10px_30px_rgba(0,0,0,0.6)]' 
                    : 'bg-[#050309]/70 border-[#120C1F] hover:border-[#231238]'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 select-none focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base sm:text-lg text-[#F4F2F7] font-display">
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#211035] text-[#B65AF0]' : 'bg-[#0A0614] text-[#817D8A]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-[#98949E] leading-relaxed border-t border-[#0F091C] animate-in fade-in duration-200">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
