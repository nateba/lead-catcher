import React, { useState, useEffect } from 'react';
import { HypeLeadsLogo } from './BrandLogo';
import { ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout?: (planId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCheckout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Produto', href: '#produto' },
    { label: 'Inteligência', href: '#inteligencia' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Planos', href: '#planos' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-4">
      <div 
        className={`max-w-6xl mx-auto rounded-full transition-all duration-500 px-5 sm:px-6 py-3 flex items-center justify-between border ${
          scrolled 
            ? 'bg-[#040307]/80 backdrop-blur-xl border-[#1C0D2A]/80 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(90,20,48,0.25)]' 
            : 'bg-transparent border-transparent'
        }`}
      >
        {/* Brand */}
        <a 
          href="#" 
          id="navbar-brand"
          className="group flex items-center transition-opacity hover:opacity-90"
        >
          <HypeLeadsLogo size="md" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13.5px] font-medium text-[#98949E] hover:text-[#F4F2F7] px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-[#0D0813]/60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="/app/"
            id="navbar-login-link"
            className="text-[13.5px] font-medium text-[#98949E] hover:text-[#F4F2F7] px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-[#0D0813]/60"
          >
            Entrar
          </a>
          <a
            href="#planos"
            onClick={(e) => {
              if (onOpenCheckout) {
                e.preventDefault();
                onOpenCheckout('vitalicio');
              }
            }}
            id="navbar-cta-button"
            className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase overflow-hidden transition-all duration-300 active:scale-95"
          >
            {/* Background gradient with wine accent */}
            <span className="absolute inset-0 bg-gradient-to-r from-[#8126C2] to-[#9436D9] transition-all duration-300 group-hover:brightness-110" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_25px_#B65AF0]" />
            <span className="relative z-10 text-white font-medium flex items-center gap-1.5">
              Começar agora
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#98949E] hover:text-[#F4F2F7] transition-colors"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-sm rounded-2xl bg-[#040409]/95 backdrop-blur-2xl border border-[#1C0D2A] p-5 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#98949E] hover:text-[#F4F2F7] px-4 py-2.5 rounded-lg hover:bg-[#0D0813] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-[#150C1F] space-y-2">
            <a
              href="/app/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-medium text-[#98949E] hover:text-[#F4F2F7] hover:bg-[#0D0813] transition-colors"
            >
              Entrar
            </a>
            <a
              href="#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white text-sm font-semibold shadow-lg shadow-[#8126C2]/25"
            >
              Começar agora
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
