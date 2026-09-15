import React, { useState, useMemo } from 'react';
import { Users, Trash2 } from 'lucide-react';
import {
  SavedLead,
  LeadStatus,
  GeneratedSite,
  Lead,
  LeadFollowUp,
  LeadMeeting,
} from '../types';
import {
  updateLeadStatus,
  batchUpdateLeadStatus,
  batchDeleteSavedLeads,
  addLeadNote,
  setLeadFollowUp,
  deleteSavedLead,
  exportLeadsToCsv,
  exportCrmBackupJson,
  importCrmBackupJson,
} from '../services/storageService';
import { generateStandaloneHtml, downloadHtmlFile } from '../services/htmlExportService';
import { useToast } from './Toast';
import { getDaysSince } from '../utils/formatters';
import { CrmHeader } from './crm/CrmHeader';
import { CrmTable, SortField } from './crm/CrmTable';
import { CrmKanban } from './crm/CrmKanban';
import { CrmLeadDetailModal } from './crm/CrmLeadDetailModal';

interface CrmPipelineProps {
  savedLeads: SavedLead[];
  onRefreshLeads: () => void;
  onOpenSiteEditor: (lead: Lead, siteData: GeneratedSite) => void;
  onGenerateSite: (lead: Lead) => void;
}

export const CrmPipeline: React.FC<CrmPipelineProps> = ({
  savedLeads,
  onRefreshLeads,
  onOpenSiteEditor,
  onGenerateSite,
}) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<'all' | 'overdue' | 'stale' | 'with_site' | 'no_site' | 'closed'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<LeadStatus>('MENSAGEM_ENVIADA');

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Selected lead for detail modal
  const [detailLeadId, setDetailLeadId] = useState<string | null>(null);
  const detailLead = useMemo(() => {
    if (!detailLeadId) return null;
    return savedLeads.find((l) => l.id === detailLeadId) || null;
  }, [detailLeadId, savedLeads]);

  // Categories list for filter
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    savedLeads.forEach((l) => {
      if (l.lead.categoryLabel) set.add(l.lead.categoryLabel);
    });
    return Array.from(set).sort();
  }, [savedLeads]);

  // Filtered and Sorted Leads
  const filteredLeads = useMemo(() => {
    return savedLeads
      .filter((item) => {
        const matchSearch =
          !searchTerm.trim() ||
          item.lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.lead.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.lead.phone && item.lead.phone.includes(searchTerm)) ||
          (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.lostReason && item.lostReason.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchStatus =
          statusFilter === 'ALL' ||
          item.status === statusFilter ||
          (statusFilter === 'PERDIDO' && item.status === 'RECUSADO');

        const matchCat = categoryFilter === 'ALL' || item.lead.categoryLabel === categoryFilter;

        // Quick filter checks
        let matchQuick = true;
        if (quickFilter === 'overdue') {
          matchQuick = !!(
            item.followUp &&
            !item.followUp.completed &&
            new Date(item.followUp.date).getTime() < new Date().setHours(0, 0, 0, 0)
          );
        } else if (quickFilter === 'stale') {
          const daysSince = getDaysSince(item.updatedAt || item.generatedAt);
          matchQuick =
            daysSince >= 5 &&
            item.status !== 'FECHADO' &&
            item.status !== 'PERDIDO' &&
            item.status !== 'RECUSADO';
        } else if (quickFilter === 'with_site') {
          matchQuick = !!item.siteData;
        } else if (quickFilter === 'no_site') {
          matchQuick = !item.siteData;
        } else if (quickFilter === 'closed') {
          matchQuick = item.status === 'FECHADO';
        }

        return matchSearch && matchStatus && matchCat && matchQuick;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'name') {
          diff = a.lead.name.localeCompare(b.lead.name);
        } else if (sortField === 'category') {
          diff = a.lead.categoryLabel.localeCompare(b.lead.categoryLabel);
        } else if (sortField === 'city') {
          diff = a.lead.city.localeCompare(b.lead.city);
        } else if (sortField === 'score') {
          diff = (a.lead.leadScore || 0) - (b.lead.leadScore || 0);
        } else if (sortField === 'date') {
          const tA = new Date(a.generatedAt || 0).getTime();
          const tB = new Date(b.generatedAt || 0).getTime();
          diff = tA - tB;
        } else if (sortField === 'status') {
          diff = a.status.localeCompare(b.status);
        } else if (sortField === 'days') {
          diff = getDaysSince(a.updatedAt || a.generatedAt) - getDaysSince(b.updatedAt || b.generatedAt);
        } else if (sortField === 'followup') {
          const fA = a.followUp?.date ? new Date(a.followUp.date).getTime() : 9999999999999;
          const fB = b.followUp?.date ? new Date(b.followUp.date).getTime() : 9999999999999;
          diff = fA - fB;
        }
        return sortAsc ? diff : -diff;
      });
  }, [savedLeads, searchTerm, statusFilter, categoryFilter, quickFilter, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: LeadStatus,
    options?: {
      dealValue?: number;
      lostReason?: string;
      meetingInfo?: LeadMeeting;
    }
  ) => {
    await updateLeadStatus(id, newStatus, options);
    onRefreshLeads();
  };

  const handleAddNote = async (id: string, noteText: string) => {
    await addLeadNote(id, noteText);
    onRefreshLeads();
  };

  const handleSetFollowUp = async (id: string, followUp: LeadFollowUp | null) => {
    await setLeadFollowUp(id, followUp);
    onRefreshLeads();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover o lead "${name}" do CRM?`)) {
      await deleteSavedLead(id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      if (detailLeadId === id) setDetailLeadId(null);
      onRefreshLeads();
      showToast('Lead removido do CRM.');
    }
  };

  const handleSaveNotes = async (id: string) => {
    await addLeadNote(id, noteText);
    setEditingNotesId(null);
    onRefreshLeads();
    showToast('Anotações salvas!');
  };

  const handleDownload = (item: SavedLead) => {
    if (!item.siteData) {
      showToast('Este lead ainda não possui site gerado.');
      return;
    }
    const colors = item.siteData.paleta_sugerida || {
      primaria: '#4f46e5',
      secundaria: '#06b6d4',
      texto_sobre_primaria: '#ffffff',
    };
    const html = generateStandaloneHtml(item.lead, item.siteData, colors);
    const filename = `site_${item.lead.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    downloadHtmlFile(filename, html);
    showToast('Download iniciado!', `${filename}.html`);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length && filteredLeads.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  const handleBulkStatusChange = async () => {
    if (selectedIds.length === 0) return;
    await batchUpdateLeadStatus(selectedIds, bulkStatus);
    onRefreshLeads();
    showToast(`Status atualizado para ${selectedIds.length} lead(s)!`);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Excluir permanentemente ${selectedIds.length} lead(s) selecionados?`)) {
      await batchDeleteSavedLeads(selectedIds);
      onRefreshLeads();
      showToast(`${selectedIds.length} lead(s) removidos.`);
      setSelectedIds([]);
    }
  };

  const handleImportJsonBackup = async (jsonStr: string) => {
    try {
      const result = await importCrmBackupJson(jsonStr);
      onRefreshLeads();
      showToast(
        'Backup restaurado com sucesso!',
        `${result.importedCount} novos leads adicionados. Total: ${result.totalCount}`
      );
    } catch (err: any) {
      showToast('Erro ao importar backup.', err?.message || 'Arquivo JSON inválido.');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setQuickFilter('all');
  };

  return (
    <div id="crm-section" className="space-y-4">
      <CrmHeader
        savedLeads={savedLeads}
        filteredCount={filteredLeads.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        categoriesList={categoriesList}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportCsv={() => exportLeadsToCsv(savedLeads)}
        onExportJsonBackup={exportCrmBackupJson}
        onImportJsonBackup={handleImportJsonBackup}
        onResetFilters={handleResetFilters}
      />

      {/* Bulk Action Bar (when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm animate-fadeIn flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-indigo-900 dark:text-indigo-200">
              {selectedIds.length} lead(s) selecionado(s)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-600 dark:text-slate-300 font-semibold">Alterar status:</span>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as LeadStatus)}
              className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="NOVO">1. Novo Lead</option>
              <option value="SITE_GERADO">2. Site Gerado</option>
              <option value="PRONTO_CONTATO">3. Pronto Contato</option>
              <option value="MENSAGEM_ENVIADA">4. Mensagem Enviada</option>
              <option value="RESPONDEU">5. Respondeu</option>
              <option value="NEGOCIACAO">6. Negociação</option>
              <option value="REUNIAO_MARCADA">7. Reunião Marcada</option>
              <option value="FECHADO">8. Fechado / Ganho</option>
              <option value="PERDIDO">9. Perdido</option>
            </select>
            <button
              type="button"
              onClick={handleBulkStatusChange}
              className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-2xs"
            >
              Aplicar Status
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 font-bold rounded-lg transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Excluir</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      {savedLeads.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Nenhum lead no seu CRM ainda
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
            Faça uma busca na aba "Buscar Leads", gere landing pages com IA ou salve as empresas diretamente aqui para gerenciar suas negociações.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <CrmTable
          filteredLeads={filteredLeads}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          toggleSelectAll={toggleSelectAll}
          sortField={sortField}
          handleSort={handleSort}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onOpenSiteEditor={onOpenSiteEditor}
          onOpenLeadDetail={(lead) => setDetailLeadId(lead.id)}
          onGenerateSite={onGenerateSite}
        />
      ) : (
        <CrmKanban
          filteredLeads={filteredLeads}
          editingNotesId={editingNotesId}
          setEditingNotesId={setEditingNotesId}
          noteText={noteText}
          setNoteText={setNoteText}
          onSaveNotes={handleSaveNotes}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onOpenSiteEditor={onOpenSiteEditor}
          onOpenLeadDetail={(lead) => setDetailLeadId(lead.id)}
          onGenerateSite={onGenerateSite}
        />
      )}

      {/* CRM Lead Detail Modal */}
      {detailLead && (
        <CrmLeadDetailModal
          leadItem={detailLead}
          onClose={() => setDetailLeadId(null)}
          onUpdateStatus={handleStatusChange}
          onAddNote={handleAddNote}
          onSetFollowUp={handleSetFollowUp}
          onOpenSiteEditor={onOpenSiteEditor}
          onGenerateSite={onGenerateSite}
          onDownloadHtml={handleDownload}
          onDeleteLead={handleDelete}
        />
      )}
    </div>
  );
};
