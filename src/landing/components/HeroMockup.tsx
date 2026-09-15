import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Sparkles, 
  Eye, 
  Globe, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  FolderKanban, 
  Users, 
  BarChart3,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { INITIAL_LEADS } from '../data/mockData';
import { LeadItem } from '../types';

interface HeroMockupProps {
  onSelectLead?: (lead: LeadItem) => void;
  onGenerateSite?: (lead: LeadItem) => void;
}

export const HeroMockup: React.FC<HeroMockupProps> = ({ onSelectLead, onGenerateSite }) => {
  const [activeTab, setActiveTab] = useState<'prospeccao' | 'leads'>('prospeccao');
  const [filterWithoutSite, setFilterWithoutSite] = useState(true);
  const [hoveredLeadId, setHoveredLeadId] = useState<string | null>(null);

  const leads = INITIAL_LEADS;

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Behind ambient soft wine aura */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#36145A]/35 via-[#8126C2]/20 to-[#1C0D2A]/40 rounded-[32px] blur-3xl opacity-75 pointer-events-none" />
      
      {/* Outer shell with high-end border highlight */}
      <div className="relative rounded-2xl md:rounded-[24px] bg-[#040307]/90 backdrop-blur-2xl border border-[#1C0D2A] p-1.5 md:p-3 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_60px_-15px_rgba(90,20,48,0.4)]">
        
        {/* Window Chrome Header */}
        <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-[#100A1A] mb-2 md:mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#231235]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#2F164A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#36145A]" />
            <span className="text-[11px] font-mono text-[#817D8A] ml-2 hidden sm:inline">
              hypeleads.app/prospeccao/sp-odontologia
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B65AF0] bg-[#1C0D2A]/80 px-2.5 py-0.5 rounded-full border border-[#36145A]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B65AF0] animate-pulse" />
              OpenStreetMap Conectado
            </span>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 min-h-[460px]">
          
          {/* Subtle Software Sidebar */}
          <aside className="w-full lg:w-48 shrink-0 flex lg:flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#0f0919] p-1 lg:pr-3 overflow-x-auto">
            <div className="flex lg:flex-col gap-1 w-full">
              <button 
                onClick={() => setActiveTab('prospeccao')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'prospeccao'
                    ? 'bg-[#110A1D] text-[#F4F2F7] border border-[#36145A]/40 shadow-sm'
                    : 'text-[#817D8A] hover:text-[#F4F2F7] hover:bg-[#0D0813]'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-[#8126C2]" />
                <span>Prospecção</span>
                <span className="ml-auto text-[10px] bg-[#1C0D2A] text-[#B65AF0] px-1.5 py-0.2 rounded font-mono hidden lg:inline">
                  LIVE
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('leads')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'leads'
                    ? 'bg-[#110A1D] text-[#F4F2F7] border border-[#36145A]/40'
                    : 'text-[#817D8A] hover:text-[#F4F2F7] hover:bg-[#0D0813]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Leads Salvos</span>
                <span className="ml-auto text-[10px] text-[#817D8A] hidden lg:inline">4</span>
              </button>

              <div className="hidden lg:flex flex-col gap-1 pt-2 mt-2 border-t border-[#0f0919]">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#817D8A] hover:text-[#F4F2F7]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sites com IA</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#817D8A] hover:text-[#F4F2F7]">
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Projetos</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#817D8A] hover:text-[#F4F2F7]">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </div>
              </div>
            </div>

            {/* Quick Status Box in Sidebar */}
            <div className="hidden lg:block p-2.5 rounded-xl bg-[#08050E] border border-[#160C23] text-[11px] text-[#817D8A]">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-[#98949E] mb-1">
                Taxa de Fechamento
              </div>
              <div className="text-sm font-bold text-[#F4F2F7] flex items-center gap-1 font-display">
                73.8%
                <span className="text-[10px] text-emerald-400 font-normal flex items-center">
                  <TrendingUp className="w-3 h-3" /> +14%
                </span>
              </div>
              <p className="text-[10px] text-[#817D8A] mt-0.5">Leads com site pronto têm 3.4x mais resposta.</p>
            </div>
          </aside>

          {/* Main Dashboard Canvas */}
          <main className="flex-1 flex flex-col min-w-0">
            
            {/* Search and Filters Bar */}
            <div className="bg-[#08050D] rounded-xl border border-[#160C23] p-2.5 sm:p-3 mb-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                {/* Location Input */}
                <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#040206] border border-[#140C1F] text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#8126C2] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-[#817D8A]">Localização</span>
                    <span className="text-[#F4F2F7] font-medium truncate">São Paulo, SP</span>
                  </div>
                </div>

                {/* Niche Input */}
                <div className="sm:col-span-5 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#040206] border border-[#140C1F] text-xs">
                  <Search className="w-3.5 h-3.5 text-[#8126C2] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-[#817D8A]">Nicho</span>
                    <span className="text-[#F4F2F7] font-medium truncate">Clínicas Odontológicas</span>
                  </div>
                </div>

                {/* Filter Chip / Status */}
                <div className="sm:col-span-3 flex items-center justify-between sm:justify-center gap-2 px-3 py-2 rounded-lg bg-[#0f0919] border border-[#27103E] text-xs text-[#F4F2F7]">
                  <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-[#B65AF0]">
                    <Flame className="w-3.5 h-3.5 text-[#B65AF0]" />
                    42 Oportunidades
                  </span>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-[#0d0818] text-[11px]">
                <span className="text-[#817D8A] text-[10px] uppercase font-semibold mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> Filtros:
                </span>
                <button 
                  onClick={() => setFilterWithoutSite(!filterWithoutSite)}
                  className={`px-2.5 py-0.5 rounded-full border transition-colors flex items-center gap-1 text-[11px] ${
                    filterWithoutSite 
                      ? 'bg-[#1C0D2A] border-[#8126C2]/60 text-[#F4F2F7]' 
                      : 'bg-[#050309] border-[#110A1C] text-[#817D8A]'
                  }`}
                >
                  <CheckCircle2 className={`w-3 h-3 ${filterWithoutSite ? 'text-[#8126C2]' : 'opacity-30'}`} />
                  Sem site oficial
                </button>
                <span className="px-2.5 py-0.5 rounded-full bg-[#050309] border border-[#110A1C] text-[#98949E]">
                  Lead Score 80+
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#050309] border border-[#110A1C] text-[#98949E] hidden sm:inline">
                  OpenStreetMap Ativo
                </span>
              </div>
            </div>

            {/* Results Table / Cards */}
            <div className="space-y-2">
              {leads.map((lead) => {
                const isHovered = hoveredLeadId === lead.id;
                const isTopOpportunity = lead.opportunity === 'Alta';

                return (
                  <div
                    key={lead.id}
                    onMouseEnter={() => setHoveredLeadId(lead.id)}
                    onMouseLeave={() => setHoveredLeadId(null)}
                    className={`group relative rounded-xl transition-all duration-300 p-3 sm:p-3.5 border ${
                      isTopOpportunity
                        ? 'bg-gradient-to-r from-[#0B0712] via-[#08050D] to-[#040307] border-[#25103A] hover:border-[#8126C2]/60 hover:shadow-[0_4px_25px_rgba(194,38,85,0.15)]'
                        : 'bg-[#05040A] border-[#110A1C] hover:border-[#1C0F2E]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Business Core Info */}
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Score Indicator Ring */}
                        <div className="shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-[#0D0814] border border-[#1D0E2B] group-hover:border-[#8126C2]/50 transition-colors">
                          <span className="text-xs font-extrabold text-[#F4F2F7] font-display">
                            {lead.score}
                          </span>
                          <span className="text-[8px] tracking-wider uppercase text-[#817D8A]">
                            Score
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-sm text-[#F4F2F7] group-hover:text-white transition-colors">
                              {lead.name}
                            </h4>
                            {isTopOpportunity && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#36145A]/60 text-[#B65AF0] border border-[#8126C2]/40 flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> Oportunidade alta
                              </span>
                            )}
                            {lead.opportunity === 'Média' && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#2A0D25]/60 text-amber-300 border border-amber-500/30">
                                Oportunidade média
                              </span>
                            )}
                            {lead.opportunity === 'Baixa' && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#121515] text-[#817D8A] border border-[#262B2A]">
                                Oportunidade baixa
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#817D8A] mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-amber-300 font-medium">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {lead.rating.toFixed(1).replace('.', ',')}
                              <span className="text-[#817D8A] font-normal">({lead.reviewCount} avaliações)</span>
                            </span>
                            <span className="text-[#28183A]">•</span>
                            <span className="text-[#98949E]">{lead.city}</span>
                            <span className="text-[#28183A]">•</span>
                            <span className={`inline-flex items-center gap-1 font-medium ${
                              lead.websiteStatus === 'Não encontrado' 
                                ? 'text-[#B65AF0]' 
                                : lead.websiteStatus === 'Desatualizado'
                                  ? 'text-amber-400'
                                  : 'text-zinc-400'
                            }`}>
                              <Globe className="w-3 h-3" />
                              {lead.websiteStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => onSelectLead && onSelectLead(lead)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#98949E] hover:text-[#F4F2F7] bg-[#0A0712] hover:bg-[#0F0A1A] border border-[#150C24] transition-all flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Ver lead
                        </button>
                        
                        <button
                          onClick={() => onGenerateSite && onGenerateSite(lead)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                            isTopOpportunity
                              ? 'bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white shadow-[0_0_15px_rgba(194,38,85,0.35)] hover:shadow-[0_0_20px_rgba(240,90,130,0.5)] hover:scale-[1.02]'
                              : 'bg-[#160D23] text-[#CDA5E8] hover:bg-[#211234] border border-[#36145A]/50'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          Gerar site
                          <ArrowUpRight className="w-3 h-3 opacity-70" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle table footer */}
            <div className="flex items-center justify-between mt-3 px-2 text-[11px] text-[#817D8A]">
              <span>Mostrando 4 de 42 empresas qualificadas em São Paulo</span>
              <span className="text-[#8126C2] font-medium cursor-pointer hover:underline">
                Exportar lista completa →
              </span>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
};
