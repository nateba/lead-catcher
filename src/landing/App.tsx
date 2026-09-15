import React, { useState } from 'react';
import Velaris from './components/Velaris';
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

  // Checkout isn't wired to a real payment gateway yet, so every "assinar" CTA
  // sends the visitor to sign up in the app instead of a fake payment flow.
  const handleOpenCheckout = (_planId: string = 'vitalicio') => {
    window.location.href = '/app/';
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
    <div className="relative min-h-screen bg-[#020103] text-[#F4F2F7] overflow-x-hidden selection:bg-[#8126C2]/40 selection:text-[#B65AF0]">
      {/* Living animated gradient background (WebGL simplex noise) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Velaris
          height="100%"
          className="h-full"
          bg="#020103"
          colors={["#8126C2", "#9436D9", "#36145A", "#020103"]}
          speed={0.6}
          grain={0.25}
        />
      </div>

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
