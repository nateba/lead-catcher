import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Copy,
  Sparkles,
  Navigation,
  Globe,
  Check,
  Target,
  MessageCircle,
  Users,
} from 'lucide-react';
import { Lead } from '../types';
import { formatOpeningHours } from '../utils/formatters';
import { getWhatsappUrl } from '../utils/phoneUtils';
import { isLeadSaved, saveLeadFromSearch } from '../services/storageService';
import { useToast } from './Toast';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onGenerateSite: (lead: Lead) => void;
  onSaveToCrm?: (lead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onGenerateSite,
  onSaveToCrm,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);

  useEffect(() => {
    if (!lead) return;
    let cancelled = false;
    isLeadSaved(lead).then((saved) => {
      if (!cancelled) setAlreadySaved(saved);
    });
    return () => {
      cancelled = true;
    };
  }, [lead]);

  if (!lead) return null;

  const copyAddress = () => {
    if (lead.address) {
      navigator.clipboard.writeText(lead.address);
      setCopied(true);
      showToast('Endereço copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveToCrmClick = async () => {
    const res = await saveLeadFromSearch(lead);
    setAlreadySaved(true);
    if (onSaveToCrm) {
      onSaveToCrm(lead);
    }
    if (res.isNew) {
      showToast('Lead adicionado ao CRM com sucesso!', 'Status: NOVO');
    } else {
      showToast('Lead já está registrado no CRM.', '', 'info');
    }
  };

  const waUrl = getWhatsappUrl(lead.phone, lead.name);
  const osmUrl = `https://www.openstreetmap.org/${lead.osmType}/${lead.osmId}`;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${lead.name} ${lead.city} ${lead.state}`
  )}`;

  const getScoreColor = () => {
    if (lead.leadScore >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (lead.leadScore >= 60) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
    if (lead.leadScore >= 40) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  return (
    <div id="lead-detail-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        id="lead-detail-card"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 transition-all max-h-[90vh] flex flex-col justify-between"
      >
        <div className="overflow-y-auto pr-1 space-y-4">
          {/* Header with Close */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl text-white font-extrabold text-base flex items-center justify-center shadow-sm shrink-0 select-none"
                style={{ backgroundColor: lead.avatarBg || '#4f46e5' }}
              >
                {lead.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {lead.categoryLabel}
                  </span>
                  {!lead.hasWebsite ? (
                    <span className="text-[12px] px-2 py-0.5 rounded-full font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                      Site não identificado
                    </span>
                  ) : (
                    <span className="text-[12px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Já possui website
                    </span>
                  )}
                  {alreadySaved && (
                    <span className="text-[12px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Salvo no CRM
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {lead.name}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lead Score Qualification Box */}
          <div className={`p-3.5 rounded-xl border ${getScoreColor()}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="font-extrabold text-sm">
                  Lead Score: {lead.leadScore}/100 • {lead.leadQualityLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowScoreDetails(!showScoreDetails)}
                className="text-xs font-bold underline opacity-80 hover:opacity-100"
              >
                {showScoreDetails ? 'Ocultar critérios' : 'Ver critérios'}
              </button>
            </div>

            {showScoreDetails && lead.scoreBreakdown && (
              <div className="mt-2.5 pt-2.5 border-t border-current/20 grid grid-cols-2 gap-1.5 text-[13px] font-medium">
                <div>• Sem site cadastrado: <strong>+{lead.scoreBreakdown.noWebsiteScore} pts</strong></div>
                <div>• Telefone disponível: <strong>+{lead.scoreBreakdown.phoneScore} pts</strong></div>
                <div>• WhatsApp válido: <strong>+{lead.scoreBreakdown.whatsappScore} pts</strong></div>
                <div>• Endereço detalhado: <strong>+{lead.scoreBreakdown.addressScore} pts</strong></div>
                <div>• Horário de funcionamento: <strong>+{lead.scoreBreakdown.openingHoursScore} pts</strong></div>
                <div>• Proximidade: <strong>+{lead.scoreBreakdown.distanceScore} pts</strong></div>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                Endereço Registrado
              </span>
              {lead.address && (
                <button
                  type="button"
                  onClick={copyAddress}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-xs font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              )}
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm">
              {lead.address || <span className="italic text-slate-400">Não informado no OpenStreetMap</span>}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[13px] text-slate-500">
              <Navigation className="w-3 h-3" />
              <span>Aproximadamente {lead.distanceFormatted || `${lead.distanceKm} km`} do centro de busca</span>
            </div>
          </div>

          {/* Contact */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              Telefone & WhatsApp
            </span>
            {lead.phone ? (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  {lead.phone}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${lead.phone.replace(/\D/g, '')}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 transition-colors"
                  >
                    Ligar
                  </a>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp ↗
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Nenhum telefone registrado no OpenStreetMap. Você ainda pode gerar o site e abordar presencialmente ou por outros canais.
              </p>
            )}
          </div>

          {/* Opening Hours */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Horário de Funcionamento
            </span>
            <p className="text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm">
              {formatOpeningHours(lead.opening_hours)}
            </p>
          </div>

          {/* External Links */}
          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <a
              href={osmUrl}
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Ver no OpenStreetMap ↗
            </a>
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buscar no Google Maps ↗
            </a>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleSaveToCrmClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>{alreadySaved ? 'Atualizado no CRM' : 'Salvar no CRM'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onGenerateSite(lead);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/20 hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              Gerar Landing Page Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
