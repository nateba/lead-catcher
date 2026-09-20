import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Copy,
  Sparkles,
  Eye,
  Download,
  MessageSquare,
  Calendar,
  DollarSign,
  AlertTriangle,
  Send,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  FileText,
  History,
  Target,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  SavedLead,
  LeadStatus,
  Lead,
  GeneratedSite,
  LeadFollowUp,
  LeadMeeting,
} from '../../types';
import { CRM_STATUS_CONFIG, CRM_LOST_REASONS } from '../../constants';
import { getWhatsappUrl } from '../../utils/phoneUtils';
import { formatOpeningHours } from '../../utils/formatters';
import { useToast } from '../Toast';

interface CrmLeadDetailModalProps {
  leadItem: SavedLead | null;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    newStatus: LeadStatus,
    options?: {
      dealValue?: number;
      lostReason?: string;
      meetingInfo?: LeadMeeting;
    }
  ) => void;
  onAddNote: (id: string, noteText: string) => void;
  onSetFollowUp: (id: string, followUp: LeadFollowUp | null) => void;
  onOpenSiteEditor: (lead: Lead, siteData: GeneratedSite) => void;
  onGenerateSite: (lead: Lead) => void;
  onDownloadHtml: (item: SavedLead) => void;
  onDeleteLead: (id: string, name: string) => void;
}

export const CrmLeadDetailModal: React.FC<CrmLeadDetailModalProps> = ({
  leadItem,
  onClose,
  onUpdateStatus,
  onAddNote,
  onSetFollowUp,
  onOpenSiteEditor,
  onGenerateSite,
  onDownloadHtml,
  onDeleteLead,
}) => {
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'outreach' | 'site' | 'activity'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Deal Value & Lost Reason local edit states
  const [editingDealValue, setEditingDealValue] = useState<string>(
    leadItem?.dealValue ? String(leadItem.dealValue) : '1500'
  );
  const [selectedLostReason, setSelectedLostReason] = useState<string>(
    leadItem?.lostReason || CRM_LOST_REASONS[0]
  );

  // Meeting local edit state
  const [meetingDate, setMeetingDate] = useState(
    leadItem?.meetingInfo?.date || new Date().toISOString().slice(0, 10)
  );
  const [meetingTime, setMeetingTime] = useState(leadItem?.meetingInfo?.time || '14:00');
  const [meetingNote, setMeetingNote] = useState(leadItem?.meetingInfo?.note || '');

  // Follow-up local edit state
  const [followUpDate, setFollowUpDate] = useState(
    leadItem?.followUp?.date || new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [followUpNote, setFollowUpNote] = useState(leadItem?.followUp?.note || '');

  // Custom outreach message state
  const [customOutreachText, setCustomOutreachText] = useState(
    leadItem?.outreachMessage ||
      leadItem?.siteData?.mensagem_abordagem_whatsapp ||
      (leadItem?.lead ? `Olá! Me chamo Consultor Digital. Notei que a empresa ${leadItem.lead.name} tem excelente potencial e preparei uma prévia de site para apresentar a vocês. Posso enviar o link?` : '')
  );

  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!leadItem) return null;

  const lead = leadItem.lead;
  const statusConfig = CRM_STATUS_CONFIG[leadItem.status] || CRM_STATUS_CONFIG.NOVO;
  const waUrl = getWhatsappUrl(lead.phone, lead.name, customOutreachText);

  // Check if follow-up is overdue
  const isFollowUpOverdue =
    leadItem.followUp &&
    !leadItem.followUp.completed &&
    new Date(leadItem.followUp.date).getTime() < new Date().setHours(0, 0, 0, 0);

  const handleStatusChange = (newStatus: LeadStatus) => {
    let options: { dealValue?: number; lostReason?: string; meetingInfo?: LeadMeeting } = {};

    if (newStatus === 'FECHADO') {
      const val = parseFloat(editingDealValue.replace(/\D/g, '')) || 1500;
      options.dealValue = val;
    } else if (newStatus === 'PERDIDO') {
      options.lostReason = selectedLostReason;
    } else if (newStatus === 'REUNIAO_MARCADA') {
      options.meetingInfo = {
        date: meetingDate,
        time: meetingTime,
        note: meetingNote,
      };
    }

    onUpdateStatus(leadItem.id, newStatus, options);
    showToast(`Status atualizado para "${CRM_STATUS_CONFIG[newStatus]?.label || newStatus}"`);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(leadItem.id, newNoteText.trim());
    setNewNoteText('');
    showToast('Anotação salva no histórico!');
  };

  const handleSaveFollowUp = () => {
    if (!followUpDate) return;
    onSetFollowUp(leadItem.id, {
      date: followUpDate,
      note: followUpNote,
      completed: false,
    });
    showToast('Lembrete de follow-up configurado!');
  };

  const handleClearFollowUp = () => {
    onSetFollowUp(leadItem.id, null);
    showToast('Follow-up concluído / removido.');
  };

  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(customOutreachText);
    setCopiedMsg(true);
    showToast('Mensagem copiada para a área de transferência!');
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleMarkMessageSent = () => {
    onUpdateStatus(leadItem.id, 'MENSAGEM_ENVIADA');
    showToast('Status marcado como "Mensagem Enviada"!');
  };

  const handleMarkResponded = () => {
    onUpdateStatus(leadItem.id, 'RESPONDEU');
    showToast('Status marcado como "Respondeu"!');
  };

  return (
    <div
      id="crm-lead-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="crm-lead-detail-dialog"
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-xl text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0 select-none"
              style={{ backgroundColor: lead.avatarBg || '#4f46e5' }}
            >
              {lead.initials || 'EM'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {lead.categoryLabel}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {lead.city}, {lead.state}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                {lead.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status Dropdown in Header */}
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-slate-400 hidden sm:inline">Status:</span>
              <select
                value={leadItem.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusConfig.badgeBg}`}
              >
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

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION SUB-TABS */}
        <div className="px-4 sm:px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto text-xs font-bold select-none">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Visão Geral & Contato</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('outreach')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'outreach'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Abordagem & WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('site')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'site'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Site Associado</span>
            {leadItem.siteData && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('activity')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'activity'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Histórico & Notas ({leadItem.activities?.length || 0})</span>
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-800 dark:text-slate-200">
          {/* TAB 1: VISÃO GERAL & CONTATO */}
          {activeSubTab === 'overview' && (
            <div className="space-y-4">
              {/* Quick Pipeline Status Card with specialized actions */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider block">
                    Etapa Atual no Funil
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold border ${statusConfig.badgeBg}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Última atualização: {new Date(leadItem.updatedAt).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(leadItem.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Conditional Fields based on status */}
                {leadItem.status === 'FECHADO' && (
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-300 block">
                        Valor Fechado
                      </span>
                      <span className="font-extrabold text-emerald-800 dark:text-emerald-200 text-sm">
                        R$ {(leadItem.dealValue || 1500).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}

                {leadItem.status === 'PERDIDO' && (
                  <div className="bg-rose-50 dark:bg-rose-950/60 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                    <span className="text-[12px] font-bold block">Motivo da Perda</span>
                    <span className="font-semibold">{leadItem.lostReason || 'Não informado'}</span>
                  </div>
                )}

                {leadItem.status === 'REUNIAO_MARCADA' && leadItem.meetingInfo && (
                  <div className="bg-purple-50 dark:bg-purple-950/60 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 text-xs text-purple-700 dark:text-purple-300">
                    <span className="text-[12px] font-bold block flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Reunião Agendada
                    </span>
                    <span className="font-bold">
                      {leadItem.meetingInfo.date} {leadItem.meetingInfo.time && `às ${leadItem.meetingInfo.time}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Specific Configuration Forms if active */}
              {leadItem.status === 'FECHADO' && (
                <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-2">
                  <label className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                    Definir / Atualizar Valor do Contrato (R$):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editingDealValue}
                      onChange={(e) => setEditingDealValue(e.target.value)}
                      placeholder="Ex: 1500"
                      className="w-40 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg font-bold text-slate-800 dark:text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleStatusChange('FECHADO')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Salvar Valor
                    </button>
                  </div>
                </div>
              )}

              {leadItem.status === 'PERDIDO' && (
                <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl space-y-2">
                  <label className="text-xs font-bold text-rose-800 dark:text-rose-300 block">
                    Motivo da Perda da Oportunidade:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={selectedLostReason}
                      onChange={(e) => setSelectedLostReason(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 rounded-lg font-semibold text-slate-800 dark:text-slate-200"
                    >
                      {CRM_LOST_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('PERDIDO')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Salvar Motivo
                    </button>
                  </div>
                </div>
              )}

              {leadItem.status === 'REUNIAO_MARCADA' && (
                <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-xl space-y-2">
                  <label className="text-xs font-bold text-purple-800 dark:text-purple-300 block">
                    Detalhes da Reunião Agendada:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 rounded-lg text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 rounded-lg text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      value={meetingNote}
                      onChange={(e) => setMeetingNote(e.target.value)}
                      placeholder="Pauta / Link do Meet"
                      className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 rounded-lg text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('REUNIAO_MARCADA')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Salvar Dados da Reunião
                  </button>
                </div>
              )}

              {/* Contact & Location Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Contact Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    Contato Telefônico
                  </span>

                  {lead.phone ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                          {lead.phone}
                        </span>
                        <a
                          href={`tel:${lead.phone.replace(/\D/g, '')}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300"
                        >
                          Ligar
                        </a>
                      </div>

                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Conversar no WhatsApp
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Nenhum telefone registrado no OpenStreetMap.
                    </p>
                  )}
                </div>

                {/* Address Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    Endereço Registrado
                  </span>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {lead.address || 'Endereço não cadastrado'}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[13px]">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${lead.name} ${lead.city} ${lead.state}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Google Maps
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/${lead.osmType}/${lead.osmId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:underline flex items-center gap-1"
                    >
                      OSM ID {lead.osmId}
                    </a>
                  </div>
                </div>
              </div>

              {/* Follow-up Section */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isFollowUpOverdue
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isFollowUpOverdue ? 'text-amber-600' : 'text-indigo-500'}`} />
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Próximo Follow-up & Lembrete
                    </span>
                  </div>

                  {leadItem.followUp && (
                    <button
                      type="button"
                      onClick={handleClearFollowUp}
                      className="text-[13px] text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      Remover lembrete
                    </button>
                  )}
                </div>

                {isFollowUpOverdue && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Atenção: O follow-up deste lead está atrasado!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                  <input
                    type="text"
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                    placeholder="Ex: Perguntar se viram a proposta"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 sm:col-span-2"
                  />
                </div>

                <div className="mt-2.5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveFollowUp}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {leadItem.followUp ? 'Atualizar Follow-up' : 'Agendar Follow-up'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABORDAGEM & WHATSAPP */}
          {activeSubTab === 'outreach' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    Script de Abordagem Comercial (WhatsApp / Email)
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyOutreach}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300"
                  >
                    {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMsg ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={customOutreachText}
                  onChange={(e) => setCustomOutreachText(e.target.value)}
                  placeholder="Mensagem de abordagem persuasiva..."
                  className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleMarkMessageSent}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold hover:bg-sky-100 transition-colors"
                    >
                      ✓ Marcar Mensagem Enviada
                    </button>
                    <button
                      type="button"
                      onClick={handleMarkResponded}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
                    >
                      ✓ Marcar que Respondeu
                    </button>
                  </div>

                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Abrir no WhatsApp Web ↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SITE ASSOCIADO */}
          {activeSubTab === 'site' && (
            <div className="space-y-4">
              {leadItem.siteData ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Landing Page Criada
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {leadItem.siteData.headline || 'Landing Page Personalizada'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenSiteEditor(lead, leadItem.siteData!)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir no Editor</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDownloadHtml(leadItem)}
                        className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                        title="Baixar Arquivo HTML"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {leadItem.siteData.subheadline}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[13px] pt-1">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block">Estilo Visual</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {leadItem.siteData.estilo_visual || 'MODERN'}
                      </strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block">Serviços</span>
                      <strong>{leadItem.siteData.servicos?.length || 0} seções</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block">Depoimentos</span>
                      <strong>{leadItem.siteData.depoimentos?.length || 0} avaliações</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block">FAQ</span>
                      <strong>{leadItem.siteData.faq?.length || 0} perguntas</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-500 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Nenhum site gerado para este lead ainda
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      Gere uma landing page completa e persuasiva em segundos utilizando a inteligência do Gemini AI.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onGenerateSite(lead);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Site Agora</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HISTÓRICO & NOTAS */}
          {activeSubTab === 'activity' && (
            <div className="space-y-5">
              {/* Add Note Form */}
              <form onSubmit={handleSaveNote} className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white block">
                  Adicionar Nova Anotação do Contato:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Ex: Liguei hoje, falou que vai olhar a proposta à noite..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors shrink-0"
                  >
                    Salvar Nota
                  </button>
                </div>
              </form>

              {/* Activity Timeline */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Linha do Tempo de Atividades
                </span>

                {(!leadItem.activities || leadItem.activities.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">Nenhuma atividade registrada.</p>
                ) : (
                  <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {leadItem.activities.map((act) => (
                      <div key={act.id} className="flex items-start gap-3 relative pl-1">
                        <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shrink-0 z-10">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex-1 text-xs">
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {act.description}
                          </p>
                          <span className="text-[12px] text-slate-400 block mt-1">
                            {new Date(act.timestamp).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(act.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDeleteLead(leadItem.id, lead.name)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir do CRM</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
