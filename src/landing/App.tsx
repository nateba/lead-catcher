import React, { useEffect, useState } from 'react';
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
import { ProgressiveBlur } from '../components/ProgressiveBlur';
import { CHECKOUT_URLS, type PlanId } from '../data/checkout';
import { affiliatePromise, hasAffiliateSlug, withTrackingParams } from './affiliate';

export default function App() {
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Starts on our own links and swaps to the affiliate's once the lookup lands.
  // The request is already in flight before this component mounts.
  const [checkoutUrls, setCheckoutUrls] = useState<Record<PlanId, string>>(CHECKOUT_URLS);

  useEffect(() => {
    let cancelled = false;
    affiliatePromise.then((affiliate) => {
      if (!cancelled && affiliate) setCheckoutUrls(affiliate.urls);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Affiliate URLs serve the same page as /, so let only the canonical one be
  // indexed — otherwise every affiliate is a duplicate competing with it.
  useEffect(() => {
    if (!hasAffiliateSlug) return;
    const tag = document.createElement('meta');
    tag.name = 'robots';
    tag.content = 'noindex, follow';
    document.head.appendChild(tag);
    return () => {
      tag.remove();
    };
  }, []);

  const handleOpenCheckout = (planId: string = 'vitalicio') => {
    const base = checkoutUrls[planId as PlanId] || checkoutUrls.vitalicio;
    // Carry the affiliate code and campaign params through to the checkout.
    // Cakto sends its affiliates here with ?code=..., and dropping it loses
    // them the commission without anything visibly failing.
    window.location.href = withTrackingParams(base);
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
        <PricingSection onSelectPlan={handleOpenCheckout} />

        {/* 7. FAQ */}
        <FaqSection />
      </main>

      {/* Footer Oficial */}
      <Footer onStartClick={() => handleOpenCheckout('vitalicio')} />

      {/* Bottom edge blur: content dissolves as it scrolls off instead of being cut. */}
      <ProgressiveBlur />

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
