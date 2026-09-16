import React, { useRef } from 'react';
import {
  Search,
  Download,
  Upload,
  Table as TableIcon,
  LayoutGrid,
  Filter,
  X,
  Clock,
  AlertTriangle,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { SavedLead, LeadStatus } from '../../types';

interface CrmHeaderProps {
  savedLeads: SavedLead[];
  filteredCount: number;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  quickFilter: 'all' | 'overdue' | 'stale' | 'with_site' | 'no_site' | 'closed';
  setQuickFilter: (q: 'all' | 'overdue' | 'stale' | 'with_site' | 'no_site' | 'closed') => void;
  categoriesList: string[];
  viewMode: 'table' | 'kanban';
  setViewMode: (v: 'table' | 'kanban') => void;
  onExportCsv: () => void;
  onExportJsonBackup: () => void;
  onImportJsonBackup: (json: string) => void;
  onResetFilters: () => void;
}

export const CrmHeader: React.FC<CrmHeaderProps> = ({
  savedLeads,
  filteredCount,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  quickFilter,
  setQuickFilter,
  categoriesList,
  viewMode,
  setViewMode,
  onExportCsv,
  onExportJsonBackup,
  onImportJsonBackup,
  onResetFilters,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        onImportJsonBackup(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    quickFilter !== 'all';

  // Counts for quick chips
  const overdueCount = savedLeads.filter(
    (l) =>
      l.followUp &&
      !l.followUp.completed &&
      new Date(l.followUp.date).getTime() < new Date().setHours(0, 0, 0, 0)
  ).length;

  const staleCount = savedLeads.filter((l) => {
    const daysSince = Math.floor(
      (Date.now() - new Date(l.updatedAt || l.generatedAt).getTime()) / (1000 * 3600 * 24)
    );
    return daysSince >= 5 && l.status !== 'FECHADO' && l.status !== 'PERDIDO' && l.status !== 'RECUSADO';
  }).length;

  const closedCount = savedLeads.filter((l) => l.status === 'FECHADO').length;

  return (
    <div className="space-y-3">
      {/* Top Header & View Switcher */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Pipeline & Funil Comercial
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {savedLeads.length} leads cadastrados
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize a prospecção, envie mensagens de abordagem, marque reuniões e registre fechamentos.
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Table / Kanban Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Lista / Tabela</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Quadro Kanban</span>
            </button>
          </div>

          {/* Export CSV */}
          <button
            type="button"
            onClick={onExportCsv}
            disabled={savedLeads.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
            title="Exportar dados para planilha CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          {/* Backup JSON */}
          <button
            type="button"
            onClick={onExportJsonBackup}
            disabled={savedLeads.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
            title="Fazer backup completo em arquivo JSON"
          >
            <span>Backup</span>
          </button>

          {/* Import JSON */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Restaurar backup de arquivo JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restaurar</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold select-none">
        <button
          type="button"
          onClick={() => setQuickFilter('all')}
          className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
            quickFilter === 'all'
              ? 'bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white border-transparent shadow-[0_0_14px_rgba(129,38,194,0.4)]'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          Todos ({savedLeads.length})
        </button>

        {overdueCount > 0 && (
          <button
            type="button"
            onClick={() => setQuickFilter('overdue')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 whitespace-nowrap ${
              quickFilter === 'overdue'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Follow-up Atrasado ({overdueCount})</span>
          </button>
        )}

        {staleCount > 0 && (
          <button
            type="button"
            onClick={() => setQuickFilter('stale')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 whitespace-nowrap ${
              quickFilter === 'stale'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Sem contato há 5+ dias ({staleCount})</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setQuickFilter('with_site')}
          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 whitespace-nowrap ${
            quickFilter === 'with_site'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Com Site Gerado</span>
        </button>

        <button
          type="button"
          onClick={() => setQuickFilter('closed')}
          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 whitespace-nowrap ${
            quickFilter === 'closed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Fechados ({closedCount})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-1 flex-wrap">
          {/* Search text */}
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por empresa, cidade, telefone ou anotação..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todos os Estágios</option>
              <option value="NOVO">1. Novo Lead</option>
              <option value="SITE_GERADO">2. Site Gerado</option>
              <option value="PRONTO_CONTATO">3. Pronto Contato</option>
              <option value="MENSAGEM_ENVIADA">4. Msg Enviada</option>
              <option value="RESPONDEU">5. Respondeu</option>
              <option value="NEGOCIACAO">6. Negociação</option>
              <option value="REUNIAO_MARCADA">7. Reunião Marcada</option>
              <option value="FECHADO">8. Fechado / Ganho</option>
              <option value="PERDIDO">9. Perdido</option>
            </select>
          </div>

          {/* Category Filter */}
          {categoriesList.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todas as Categorias</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 text-xs font-bold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        <div className="text-slate-400 text-[11px] shrink-0">
          Exibindo <strong className="text-slate-700 dark:text-slate-200">{filteredCount}</strong> de {savedLeads.length} leads
        </div>
      </div>
    </div>
  );
};
