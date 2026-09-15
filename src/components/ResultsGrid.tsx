import React, { useState, useMemo } from 'react';
import {
  Grid,
  Map as MapIcon,
  ArrowUpDown,
  Download,
  Sparkles,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw,
  Users,
} from 'lucide-react';
import { Lead, SearchFilters } from '../types';
import { LeadCard } from './LeadCard';
import { LeadMap } from './LeadMap';

interface ResultsGridProps {
  leads: Lead[];
  filters: SearchFilters | null;
  center: { lat: number; lng: number };
  onSelectLead: (lead: Lead) => void;
  onGenerateSite: (lead: Lead) => void;
  onBatchGenerate: (selectedLeads: Lead[]) => void;
  onSaveToCrm?: (selectedLeads: Lead[]) => void;
  onExportCsv: (leads: Lead[]) => void;
  onResetSearch: () => void;
}

type SortOption = 'opportunity' | 'distance' | 'name' | 'phone_first';
type ViewMode = 'grid' | 'map';

export const ResultsGrid: React.FC<ResultsGridProps> = ({
  leads,
  filters,
  center,
  onSelectLead,
  onGenerateSite,
  onBatchGenerate,
  onSaveToCrm,
  onExportCsv,
  onResetSearch,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('opportunity');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const sortedLeads = useMemo(() => {
    const list = [...leads];
    if (sortBy === 'opportunity') {
      return list.sort((a, b) => {
        if (b.leadScore !== a.leadScore) return b.leadScore - a.leadScore;
        return a.distanceKm - b.distanceKm;
      });
    }
    if (sortBy === 'distance') {
      return list.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    if (sortBy === 'name') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'phone_first') {
      return list.sort((a, b) => {
        if (a.phone && !b.phone) return -1;
        if (!a.phone && b.phone) return 1;
        return b.leadScore - a.leadScore;
      });
    }
    return list;
  }, [leads, sortBy]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l.id));
    }
  };

  const selectedLeads = leads.filter((l) => selectedIds.includes(l.id));

  // Count businesses without website identified
  const noWebsiteCount = useMemo(() => {
    return leads.filter((l) => !l.hasWebsite).length;
  }, [leads]);

  if (leads.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-900/60">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Nenhuma empresa encontrada com os filtros selecionados
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Dica: Aumente o raio de busca (ex: 10km ou 15km), reduza os filtros avançados ou experimente uma categoria de alta densidade como Barbearia, Dentista, Oficina Mecânica ou Salão de Beleza.
        </p>
        <button
          type="button"
          onClick={onResetSearch}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          Ajustar Filtros de Busca
        </button>
      </div>
    );
  }

  return (
    <div id="results-section" className="space-y-5">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Count & Meta */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {leads.length} {leads.length === 1 ? 'empresa qualificada' : 'empresas qualificadas'}
            </h2>
            {filters && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {filters.city}, {filters.state} ({filters.radiusKm} km)
              </span>
            )}
            {noWebsiteCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-extrabold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                {noWebsiteCount} sem site identificado
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5">
            <span>Classificadas por Lead Score (0–100) baseado em dados verificados do OpenStreetMap</span>
          </p>
        </div>

        {/* Right Controls: Sort, Export & View Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sorting */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="opportunity">Melhor Oportunidade (Score)</option>
              <option value="distance">Mais Próximas</option>
              <option value="name">Nome (A - Z)</option>
              <option value="phone_first">Com Telefone Primeiro</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => onExportCsv(selectedLeads.length > 0 ? selectedLeads : sortedLeads)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
            title="Exportar dados para planilha CSV"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Visualização em Grade"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Visualização em Mapa Interativo"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Batch Selection Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {selectedIds.length === leads.length && leads.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-indigo-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>
              {selectedIds.length === leads.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </span>
          </button>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 font-medium">
            {selectedIds.length} de {leads.length} selecionados
          </span>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {onSaveToCrm && (
              <button
                type="button"
                onClick={() => onSaveToCrm(selectedLeads)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all"
              >
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                Salvar no CRM ({selectedIds.length})
              </button>
            )}

            <button
              type="button"
              onClick={() => onBatchGenerate(selectedLeads)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm shadow-indigo-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Gerar Sites em Lote ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Grid or Map */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              isSelected={selectedIds.includes(lead.id)}
              onToggleSelect={toggleSelect}
              onViewDetails={onSelectLead}
              onGenerateSite={onGenerateSite}
            />
          ))}
        </div>
      ) : (
        <LeadMap
          leads={sortedLeads}
          center={center}
          onSelectLead={onSelectLead}
          onGenerateSite={onGenerateSite}
        />
      )}
    </div>
  );
};
