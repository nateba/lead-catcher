import React from 'react';
import {
  Download,
  Trash2,
  Eye,
  MessageSquare,
  Clock,
  Edit3,
  Sparkles,
  Calendar,
  AlertTriangle,
  DollarSign,
  Phone,
  Target,
} from 'lucide-react';
import { SavedLead, LeadStatus, GeneratedSite, Lead } from '../../types';
import { CRM_KANBAN_COLUMNS, CRM_STATUS_CONFIG } from '../../constants';
import { getDaysSince, formatWhatsappUrl, cleanPhoneForWhatsapp } from '../../utils/formatters';

interface CrmKanbanProps {
  filteredLeads: SavedLead[];
  editingNotesId: string | null;
  setEditingNotesId: (id: string | null) => void;
  noteText: string;
  setNoteText: (s: string) => void;
  onSaveNotes: (id: string) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  onDelete: (id: string, name: string) => void;
  onDownload: (item: SavedLead) => void;
  onOpenSiteEditor: (lead: Lead, siteData: GeneratedSite) => void;
  onOpenLeadDetail: (leadItem: SavedLead) => void;
  onGenerateSite: (lead: Lead) => void;
}

export const CrmKanban: React.FC<CrmKanbanProps> = ({
  filteredLeads,
  editingNotesId,
  setEditingNotesId,
  noteText,
  setNoteText,
  onSaveNotes,
  onStatusChange,
  onDelete,
  onDownload,
  onOpenSiteEditor,
  onOpenLeadDetail,
  onGenerateSite,
}) => {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-3.5 min-w-[1400px]">
        {CRM_KANBAN_COLUMNS.map((col) => {
          const columnLeads = filteredLeads.filter((l) => {
            if (col.status === 'PERDIDO') {
              return l.status === 'PERDIDO' || l.status === 'RECUSADO';
            }
            return l.status === col.status;
          });

          const colConfig = CRM_STATUS_CONFIG[col.status];

          return (
            <div
              key={col.status}
              className="w-[280px] shrink-0 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col min-h-[560px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full ${colConfig.dotColor || 'bg-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {col.label}
                  </span>
                </div>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  {columnLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                {columnLeads.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-[11px] text-slate-400 italic text-center p-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <span>Nenhum lead nesta etapa</span>
                  </div>
                ) : (
                  columnLeads.map((item) => {
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

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all space-y-2.5 group"
                      >
                        {/* Header: Avatar + Name + Score + Delete */}
                        <div className="flex items-start justify-between gap-1.5">
                          <div
                            onClick={() => onOpenLeadDetail(item)}
                            className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                          >
                            <div
                              className="w-7 h-7 rounded-lg text-white font-extrabold text-[10px] flex items-center justify-center shrink-0"
                              style={{ backgroundColor: item.lead.avatarBg || '#4f46e5' }}
                            >
                              {item.lead.initials || 'EM'}
                            </div>
                            <div className="truncate min-w-0">
                              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {item.lead.name}
                              </h4>
                              <span className="text-[10px] text-slate-400 truncate block">
                                {item.lead.categoryLabel} • {item.lead.city}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onDelete(item.id, item.lead.name)}
                            className="text-slate-300 hover:text-rose-500 transition-colors p-0.5"
                            title="Remover lead do CRM"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Score & Badges */}
                        <div className="flex items-center justify-between gap-1 flex-wrap text-[10px]">
                          <span
                            className="inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            title={`Lead Score: ${item.lead.leadScore || 0}/100`}
                          >
                            <Target className="w-2.5 h-2.5 text-indigo-500" />
                            {item.lead.leadScore || 0} pts
                          </span>

                          {item.siteData ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              Site Gerado
                            </span>
                          ) : (
                            <span className="text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              Sem site
                            </span>
                          )}
                        </div>

                        {/* Deal Value if FECHADO */}
                        {item.status === 'FECHADO' && (
                          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <DollarSign className="w-3 h-3" />
                            <span>R$ {(item.dealValue || 1500).toLocaleString('pt-BR')}</span>
                          </div>
                        )}

                        {/* Lost Reason if PERDIDO */}
                        {(item.status === 'PERDIDO' || item.status === 'RECUSADO') && item.lostReason && (
                          <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                            Motivo: {item.lostReason}
                          </div>
                        )}

                        {/* Follow-up alert if scheduled */}
                        {item.followUp && !item.followUp.completed && (
                          <div
                            className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                              isFollowUpOverdue
                                ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60'
                                : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <Calendar className="w-2.5 h-2.5" />
                            <span className="truncate">
                              {isFollowUpOverdue ? 'Atrasado: ' : 'Follow-up: '}
                              {item.followUp.date}
                            </span>
                          </div>
                        )}

                        {/* Stale Badge if >= 5 days without contact */}
                        {isStale && !isFollowUpOverdue && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/60">
                            <Clock className="w-2.5 h-2.5" />
                            <span>há {daysSince} dias sem contato</span>
                          </div>
                        )}

                        {/* Notes Preview / Inline edit */}
                        <div className="text-[10px] bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg text-slate-600 dark:text-slate-400">
                          {editingNotesId === item.id ? (
                            <div className="space-y-1">
                              <textarea
                                rows={2}
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Anotações do contato..."
                                className="w-full p-1 text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200"
                                autoFocus
                              />
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingNotesId(null)}
                                  className="px-1.5 py-0.5 text-[9px] text-slate-500"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onSaveNotes(item.id)}
                                  className="px-1.5 py-0.5 text-[9px] bg-indigo-600 text-white rounded font-bold"
                                >
                                  Salvar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setEditingNotesId(item.id);
                                setNoteText(item.notes || '');
                              }}
                              className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-between"
                              title="Clique para editar anotações"
                            >
                              <span className="line-clamp-2">
                                {item.notes || <span className="italic opacity-60">+ Anotação</span>}
                              </span>
                              <Edit3 className="w-2.5 h-2.5 opacity-40 shrink-0 ml-1" />
                            </div>
                          )}
                        </div>

                        {/* Inline Status Select */}
                        <select
                          value={item.status}
                          onChange={(e) => onStatusChange(item.id, e.target.value as LeadStatus)}
                          className="w-full px-2 py-1 text-[10px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                        >
                          <option value="NOVO">1. Novo Lead</option>
                          <option value="SITE_GERADO">2. Site Gerado</option>
                          <option value="PRONTO_CONTATO">3. Pronto Contato</option>
                          <option value="MENSAGEM_ENVIADA">4. Msg Enviada</option>
                          <option value="RESPONDEU">5. Respondeu</option>
                          <option value="NEGOCIACAO">6. Negociação</option>
                          <option value="REUNIAO_MARCADA">7. Reunião</option>
                          <option value="FECHADO">8. Fechado</option>
                          <option value="PERDIDO">9. Perdido</option>
                        </select>

                        {/* Card Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1 text-[10px]">
                          {item.siteData ? (
                            <button
                              type="button"
                              onClick={() => onOpenSiteEditor(item.lead, item.siteData!)}
                              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Ver Site</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onGenerateSite(item.lead)}
                              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Gerar Site</span>
                            </button>
                          )}

                          <div className="flex items-center gap-1.5">
                            {item.siteData && (
                              <button
                                type="button"
                                onClick={() => onDownload(item)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                title="Baixar HTML"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 text-emerald-500 hover:text-emerald-600"
                                title="Conversar no WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => onOpenLeadDetail(item)}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold"
                            >
                              Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
