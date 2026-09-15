import React from 'react';
import { HypeLeadsLogo } from './BrandLogo';
import { ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onStartClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartClick }) => {
  return (
    <footer className="relative pt-20 pb-12 overflow-hidden border-t border-[#0b0716] bg-[#020104]">
      
      {/* Subtle bottom lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#36145A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[#0F091A]">
          
          {/* Brand and Slogan */}
          <div className="space-y-3 max-w-sm">
            <HypeLeadsLogo size="lg" />
            <p className="text-xs text-[#817D8A] font-medium leading-relaxed">
              Encontre clientes. Crie o site. Feche o negócio.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] text-emerald-400/90 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Operação Brasil · 100% em nuvem
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#98949E]">
            <a href="#produto" className="hover:text-white transition-colors">Produto</a>
            <a href="#inteligencia" className="hover:text-white transition-colors">Inteligência</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a 
              href="#planos"
              onClick={(e) => {
                e.preventDefault();
                onStartClick();
              }}
              className="inline-flex items-center gap-1 text-[#B65AF0] font-semibold hover:underline"
            >
              Começar agora
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Bottom copyright and legal note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#817D8A]">
          <p>© {new Date().getFullYear()} HypeLeads. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#F4F2F7] transition-colors cursor-pointer">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-[#F4F2F7] transition-colors cursor-pointer">Privacidade</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#8126C2]" />
              Pagamento Seguro
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
