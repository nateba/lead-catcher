import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Send, Sparkles, ListOrdered } from 'lucide-react';
import { Lead, GeneratedSite } from '../../types';
import { buildOutreachScript, buildFullOutreachText, buildWhatsappUrl } from '../../services/outreachScript';

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

export const WhatsappTab: React.FC<WhatsappTabProps> = ({ lead, notes, setNotes }) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [sendWithSite, setSendWithSite] = useState(false);

  const steps = buildOutreachScript(lead);
  const fullText = buildFullOutreachText(lead);

  const messageToSend = sendWithSite
    ? `${fullText}\n\nSegue a prévia do site que preparei para a ${lead.name}.`
    : fullText;

  const waUrl = buildWhatsappUrl(lead.phone, messageToSend);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(id);
      window.setTimeout(() => setCopiedStep(null), 2000);
    } catch {
      setCopiedStep(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Send-with-site toggle */}
      <button
        type="button"
        onClick={() => setSendWithSite((v) => !v)}
        className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-left hover:border-slate-700 transition-colors"
      >
        <span
          className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
            sendWithSite ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
              sendWithSite ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </span>
        <span className="text-xs font-bold text-slate-200">Enviar com site pronto</span>
      </button>

      {/* Step-by-step script */}
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-800/40 border-b border-slate-800">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <ListOrdered className="w-4 h-4 text-slate-400" />
            Por etapas
          </span>
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar no WhatsApp
            </a>
          ) : (
            <span className="text-[13px] text-slate-500 italic">Sem telefone válido</span>
          )}
        </div>

        <div className="divide-y divide-slate-800">
          {steps.map((step) => (
            <div key={step.id} className="p-3.5 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${step.dotColor}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200">
                      {step.order}. {step.title}
                    </p>
                    <p className="text-[13px] text-slate-500">{step.hint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {waUrl && (
                    <a
                      href={buildWhatsappUrl(lead.phone, step.text) || '#'}
                      target="_blank"
                      rel="noreferrer"
                      title="Enviar só esta etapa"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/60 text-emerald-400 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => copy(step.id, step.text)}
                    title="Copiar esta etapa"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedStep === step.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pl-[18px]">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3.5 bg-amber-950/20 border-t border-amber-900/40">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[13px] text-amber-200/80 leading-relaxed">
            <span className="font-bold text-amber-300">Dica de ouro:</span> envie a abordagem antes de
            gerar o site. Quando o cliente demonstrar interesse, gere a prévia ao vivo e fecha a venda
            na hora.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => copy('full', fullText)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
      >
        {copiedStep === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copiedStep === 'full' ? 'Roteiro completo copiado!' : 'Copiar roteiro completo'}
      </button>

      {/* CRM Notes */}
      <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 space-y-2">
        <label htmlFor="crm-notes" className="block text-xs font-bold text-slate-300">
          Anotações Internas do Lead (CRM)
        </label>
        <textarea
          id="crm-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: Falou com dono Marcelo, agendada reunião para sexta-feira às 14h..."
          className="w-full p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};
