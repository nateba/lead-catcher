import React from 'react';
import { X, Star, MapPin, Globe, Phone, Sparkles, TrendingUp, ArrowRight, ShieldAlert } from 'lucide-react';
import { LeadItem } from '../types';

interface LeadModalProps {
  lead: LeadItem | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateSite: (lead: LeadItem) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onGenerateSite,
}) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl md:rounded-3xl bg-[#040308] border border-[#25123A] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(194,38,85,0.3)] text-[#F4F2F7]">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#0b0716] text-[#98949E] hover:text-white hover:bg-[#140C25] transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#120A1F] border border-[#2f1448] flex flex-col items-center justify-center text-center shrink-0">
              <span className="text-lg font-black text-[#F4F2F7] font-display leading-none">
                {lead.score}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#B65AF0] font-semibold mt-0.5">
                Score
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-white font-display">
                  {lead.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#36145A]/70 text-[#B65AF0] text-xs font-semibold border border-[#8126C2]/40">
                  Oportunidade {lead.opportunity}
                </span>
              </div>
              <p className="text-xs text-[#817D8A] mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8126C2]" />
                {lead.address || lead.city}
              </p>
            </div>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#090511] border border-[#130C23]">
              <span className="text-[10px] uppercase font-semibold text-[#817D8A] block mb-1">
                Lead Score
              </span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#F4F2F7] font-display">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {lead.score}
                <span className="text-xs font-normal text-[#817D8A]">/ 100</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090511] border border-[#130C23]">
              <span className="text-[10px] uppercase font-semibold text-[#817D8A] block mb-1">
                Website Atual
              </span>
              <div className="text-xs font-bold text-[#B65AF0] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {lead.websiteStatus}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090511] border border-[#130C23] col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-semibold text-[#817D8A] block mb-1">
                Contato Direto
              </span>
              <div className="text-xs font-bold text-[#F4F2F7] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#8126C2]" />
                {lead.phone || '(11) 98421-9904'}
              </div>
            </div>
          </div>

          {/* Diagnostic Box */}
          <div className="p-4 rounded-xl bg-[#090613] border border-[#1B0E2C] space-y-2">
            <div className="text-xs font-bold text-[#F4F2F7] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#8126C2]" />
              Resumo da Prospecção
            </div>
            <p className="text-xs text-[#98949E] leading-relaxed">
              Empresa com excelente autoridade local e fluxo constante de pacientes. Não possui website oficial cadastrado no OpenStreetMap. O potencial de conversão para aquisição de site é classificado como crítico.
            </p>
          </div>

          {/* Action */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-medium text-[#817D8A] hover:text-white bg-transparent"
            >
              Voltar à lista
            </button>

            <button
              onClick={() => {
                onClose();
                onGenerateSite(lead);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8126C2] to-[#9436D9] hover:shadow-[0_0_25px_#8126C2] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Gerar site com IA para {lead.name}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
