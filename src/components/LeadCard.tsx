import React from 'react';
import {
  MapPin,
  Phone,
  Sparkles,
  Eye,
  CheckSquare,
  Square,
  Navigation,
  MessageCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Lead } from '../types';
import { getWhatsappUrl } from '../utils/phoneUtils';

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetails: (lead: Lead) => void;
  onGenerateSite: (lead: Lead) => void;
  onHover?: (lead: Lead | null) => void;
  isGenerating?: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  isSelected,
  onToggleSelect,
  onViewDetails,
  onGenerateSite,
  onHover,
  isGenerating = false,
}) => {
  const whatsappUrl = getWhatsappUrl(lead.phone, lead.name);

  // Quality badge color mapping
  const getQualityBadge = () => {
    switch (lead.leadQuality) {
      case 'EXCELLENT':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80';
      case 'GOOD':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80';
      case 'MEDIUM':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80';
      case 'LOW':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div
      id={`lead-card-${lead.id}`}
      onMouseEnter={() => onHover?.(lead)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/10 dark:bg-indigo-950/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-xl hover:-translate-y-0.5'
      }`}
    >
      <div>
        {/* Top Header: Checkbox + Avatar + Category + Score / Website Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Selection Checkbox */}
            <button
              type="button"
              onClick={() => onToggleSelect(lead.id)}
              className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5"
              title={isSelected ? 'Desmarcar' : 'Selecionar empresa'}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-indigo-600 fill-indigo-50 dark:fill-indigo-950" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>

            {/* Initials Avatar */}
            <div
              className="w-10 h-10 rounded-xl text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-105 select-none"
              style={{ backgroundColor: lead.avatarBg || '#4f46e5' }}
            >
              {lead.initials || 'EM'}
            </div>

            <div className="min-w-0">
              <span className="inline-block text-[13px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                {lead.categoryLabel}
              </span>
            </div>
          </div>

          {/* Lead Score & Website Status Badges */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`inline-flex items-center gap-1 text-[12px] font-extrabold px-2 py-0.5 rounded-full border ${getQualityBadge()}`}
              title={`Lead Score: ${lead.leadScore}/100`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {lead.leadScore} pts • {lead.leadQualityLabel}
            </span>

            <div className="flex items-center gap-1.5">
              {!lead.hasWebsite ? (
                <span className="text-[12px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-200/60 dark:border-rose-900/60">
                  Site não identificado
                </span>
              ) : (
                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  Já possui site
                </span>
              )}

              <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-slate-400 dark:text-slate-500">
                <Navigation className="w-2.5 h-2.5" />
                {lead.distanceFormatted || `${lead.distanceKm} km`}
              </span>
            </div>
          </div>
        </div>

        {/* Business Name */}
        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {lead.name}
        </h3>

        {/* Address */}
        <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2">
            {lead.address || (
              <span className="italic text-slate-400 dark:text-slate-500">Endereço não informado no OpenStreetMap</span>
            )}
          </p>
        </div>

        {/* Phone & WhatsApp status */}
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {lead.phone ? (
              <a
                href={`tel:${lead.phone.replace(/\D/g, '')}`}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                {lead.phone}
              </a>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 text-[13px] italic">Sem telefone registrado</span>
            )}
          </div>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 transition-colors"
              title="Abrir WhatsApp"
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(lead)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Ver Detalhes
        </button>

        <button
          type="button"
          onClick={() => onGenerateSite(lead)}
          disabled={isGenerating}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          Gerar Site
        </button>
      </div>
    </div>
  );
};
