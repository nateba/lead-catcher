import React from 'react';
import { MessageSquare, Copy, Check } from 'lucide-react';
import { Lead, GeneratedSite } from '../../types';

interface WhatsappTabProps {
  lead: Lead;
  siteData: GeneratedSite;
  setSiteData: React.Dispatch<React.SetStateAction<GeneratedSite>>;
  notes: string;
  setNotes: (n: string) => void;
  onCopyWa: () => void;
  copiedWa: boolean;
  waDirectUrl: string | null;
}

export const WhatsappTab: React.FC<WhatsappTabProps> = ({
  lead,
  siteData,
  setSiteData,
  notes,
  setNotes,
  onCopyWa,
  copiedWa,
  waDirectUrl,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Roteiro de Abordagem B2B Personalizado
          </span>
          <button
            type="button"
            onClick={onCopyWa}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100"
          >
            {copiedWa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedWa ? 'Copiado!' : 'Copiar Texto'}
          </button>
        </div>

        <textarea
          rows={6}
          value={siteData.mensagem_abordagem_whatsapp}
          onChange={(e) =>
            setSiteData({ ...siteData, mensagem_abordagem_whatsapp: e.target.value })
          }
          className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed focus:ring-1 focus:ring-emerald-500"
        />

        {lead.phone && (
          <div className="pt-2">
            {waDirectUrl ? (
              <a
                href={waDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Abrir Conversa no WhatsApp com {lead.phone} ↗
              </a>
            ) : (
              <p className="text-xs text-slate-400 italic text-center">
                Telefone: {lead.phone}
              </p>
            )}
          </div>
        )}
      </div>

      {/* CRM Notes */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Anotações Internas do Lead (CRM)
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: Falou com dono Marcelo, agendada reunião para sexta-feira às 14h..."
          className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};
