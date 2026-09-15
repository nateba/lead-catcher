import React, { useState } from 'react';
import {
  Download,
  Trash2,
  Eye,
  MessageSquare,
  Phone,
  ArrowUpDown,
  Clock,
  CheckSquare,
  Square,
  Sparkles,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Target,
} from 'lucide-react';
import { SavedLead, LeadStatus, GeneratedSite, Lead } from '../../types';
import { CRM_STATUS_CONFIG } from '../../constants';
import { getDaysSince, formatWhatsappUrl, cleanPhoneForWhatsapp } from '../../utils/formatters';

export type SortField = 'name' | 'category' | 'city' | 'score' | 'date' | 'status' | 'days' | 'followup';

interface CrmTableProps {
  filteredLeads: SavedLead[];
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  sortField: SortField;
  handleSort: (field: SortField) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  onDelete: (id: string, name: string) => void;
  onDownload: (item: SavedLead) => void;
  onOpenSiteEditor: (lead: Lead, siteData: GeneratedSite) => void;
  onOpenLeadDetail: (leadItem: SavedLead) => void;
  onGenerateSite: (lead: Lead) => void;
}

export const CrmTable: React.FC<CrmTableProps> = ({
  filteredLeads,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  sortField,
  handleSort,
  onStatusChange,
  onDelete,
  onDownload,
  onOpenSiteEditor,
  onOpenLeadDetail,
  onGenerateSite,
}) => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-3 w-10 text-center">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="p-1 hover:text-indigo-600 text-slate-400 transition-colors"
                  title="Selecionar todos"
                >
                  {selectedIds.length === filteredLeads.length && filteredLeads.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Empresa</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>
              <th
                onClick={() => handleSort('category')}
                className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Categoria</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>
              <th
                onClick={() => handleSort('city')}
                className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Cidade</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>
              <th
                onClick={() => handleSort('score')}
                className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Score</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>
              <th
                onClick={() => handleSort('followup')}
                className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Follow-up / Atividade</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Status do Funil</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>
              <th className="py-3.5 px-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                  Nenhum lead encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              paginatedLeads.map((item) => {
                const daysSince = getDaysSince(item.updatedAt || item.generatedAt);
                const isStale =
                  daysSince >= 5 &&
                  item.status !== 'FECHADO' &&
                  item.status !== 'PERDIDO' &&
                  item.status !== 'RECUSADO';

                const isFollowUpOverdue =
                  item.followUp &&
                  !item.followUp.completed &&
                  new Date(item.followUp.date).getTime() < new Date().setHours(0, 0, 0, 0);

                const cleanPhone = cleanPhoneForWhatsapp(item.lead.phone);
                const waUrl = cleanPhone
                  ? formatWhatsappUrl(
                      item.lead.phone,
                      item.outreachMessage || item.siteData?.mensagem_abordagem_whatsapp || `Olá!`
                    )
                  : null;

                const statusConf = CRM_STATUS_CONFIG[item.status] || CRM_STATUS_CONFIG.NOVO;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      selectedIds.includes(item.id) ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelect(item.id)}
                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {selectedIds.includes(item.id) ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Name + Avatar */}
                    <td className="py-3.5 px-3">
                      <div
                        onClick={() => onOpenLeadDetail(item)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <div
                          className="w-7 h-7 rounded-lg text-white font-extrabold text-[10px] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: item.lead.avatarBg || '#4f46e5' }}
                        >
                          {item.lead.initials || 'EM'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[180px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {item.lead.name}
                          </h4>
                          {item.lead.phone ? (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <Phone className="w-2.5 h-2.5 text-emerald-500" />
                              {item.lead.phone}
                            </p>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Sem telefone</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                        {item.lead.categoryLabel}
                      </span>
                    </td>

                    {/* City */}
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {item.lead.city}, {item.lead.state}
                    </td>

                    {/* Lead Score */}
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 font-bold text-[11px] text-slate-700 dark:text-slate-300">
                        <Target className="w-3 h-3 text-indigo-500" />
                        {item.lead.leadScore || 0} pts
                      </span>
                    </td>

                    {/* Follow-up / Last contact indicator */}
                    <td className="py-3.5 px-3">
                      {item.followUp && !item.followUp.completed ? (
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isFollowUpOverdue
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60'
                          }`}
                        >
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{item.followUp.date}</span>
                        </div>
                      ) : isStale ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                          <Clock className="w-2.5 h-2.5" />
                          <span>há {daysSince} dias</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {daysSince === 0 ? 'Hoje' : `há ${daysSince} dia(s)`}
                        </span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-3">
                      <select
                        value={item.status}
                        onChange={(e) => onStatusChange(item.id, e.target.value as LeadStatus)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${statusConf.badgeBg}`}
                      >
                        <option value="NOVO">1. Novo Lead</option>
                        <option value="SITE_GERADO">2. Site Gerado</option>
                        <option value="PRONTO_CONTATO">3. Pronto Contato</option>
                        <option value="MENSAGEM_ENVIADA">4. Msg Enviada</option>
                        <option value="RESPONDEU">5. Respondeu</option>
                        <option value="NEGOCIACAO">6. Negociação</option>
                        <option value="REUNIAO_MARCADA">7. Reunião Marcada</option>
                        <option value="FECHADO">8. Fechado</option>
                        <option value="PERDIDO">9. Perdido</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenLeadDetail(item)}
                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition-colors"
                          title="Abrir detalhes e histórico completo"
                        >
                          Detalhes
                        </button>

                        {item.siteData ? (
                          <button
                            type="button"
                            onClick={() => onOpenSiteEditor(item.lead, item.siteData!)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold transition-colors"
                            title="Ver landing page gerada"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Site</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onGenerateSite(item.lead)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-2xs"
                            title="Gerar Landing Page com IA"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Gerar</span>
                          </button>
                        )}

                        {item.siteData && (
                          <button
                            type="button"
                            onClick={() => onDownload(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Baixar arquivo HTML"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title="Abordar no WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => onDelete(item.id, item.lead.name)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remover do CRM"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredLeads.length > 0 && (
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Exibindo</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>por página • Total de {filteredLeads.length} leads</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={validCurrentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              Página {validCurrentPage} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={validCurrentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
