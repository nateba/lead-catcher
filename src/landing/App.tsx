import React, { useState } from 'react';
import FluidFieldBackground from './components/FluidField';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LeadIntelligenceSection } from './components/LeadIntelligenceSection';
import { AiWebsiteGeneratorSection } from './components/AiWebsiteGeneratorSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ValuePropositionSection } from './components/ValuePropositionSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { LeadModal } from './components/LeadModal';
import { LeadItem } from './types';

export default function App() {
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const CHECKOUT_URLS: Record<string, string> = {
    mensal: 'https://checkout.applyfy.com.br/checkout/cmu2vbt1y0jqv01pwpekeuyx2?offer=YKR5ZRD',
    vitalicio: 'https://checkout.applyfy.com.br/checkout/cmu2wb7u50l9201oh3jbdn2dn?offer=SPN02ZK',
  };

  const handleOpenCheckout = (planId: string = 'vitalicio') => {
    window.location.href = CHECKOUT_URLS[planId] || CHECKOUT_URLS.vitalicio;
  };

  const handleSelectLead = (lead: LeadItem) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleGenerateSite = (lead: LeadItem) => {
    const productEl = document.getElementById('produto');
    if (productEl) {
      productEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen text-[#F4F2F7] overflow-x-hidden selection:bg-[#8126C2]/40 selection:text-[#B65AF0]">
      {/* Living fluid WebGL background (three.js simplex-noise shader) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <FluidFieldBackground className="w-full h-full" />
      </div>
      {/* Dark scrim so body text stays readable over the bright parts of the shader */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[#020103]/55" />

      {/* Interactive Fixed Navbar */}
      <Navbar onOpenCheckout={handleOpenCheckout} />

      {/* Main Content Sections (Structured strictly in concise high-impact visual blocks) */}
      <main className="relative z-10">
        {/* 1. Início / Hero com Mockup Principal Flutuante */}
        <HeroSection
          onStartClick={() => handleOpenCheckout('vitalicio')}
          onSelectLead={handleSelectLead}
          onGenerateSite={handleGenerateSite}
        />

        {/* 2. Produto & Geração com IA / Editor Visual */}
        <AiWebsiteGeneratorSection />

        {/* 3. Lead Intelligence / Análise OdontoPrime */}
        <LeadIntelligenceSection onGenerateForLead={handleGenerateSite} />

        {/* 4. Como Funciona / Fluxo Enxuto */}
        <HowItWorksSection />

        {/* 5. Proposta de Valor / Conversão */}
        <ValuePropositionSection onStartClick={() => handleOpenCheckout('vitalicio')} />

        {/* 6. Planos / Pricing com Destaque Vitalício */}
        <PricingSection onSelectPlan={handleOpenCheckout} remainingSlots={3} />

        {/* 7. FAQ */}
        <FaqSection />
      </main>

      {/* Footer Oficial */}
      <Footer onStartClick={() => handleOpenCheckout('vitalicio')} />

      {/* Modal de Interatividade: detalhe de lead de exemplo */}
      <LeadModal
        lead={selectedLead}
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onGenerateSite={handleGenerateSite}
      />
    </div>
  );
}
