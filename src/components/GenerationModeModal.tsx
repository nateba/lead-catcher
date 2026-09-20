import React, { useState } from 'react';
import { X, Zap, Sparkles, Wand2, ArrowRight, AlertTriangle, KeyRound, Check, ExternalLink, Loader2 } from 'lucide-react';
import { Lead } from '../types';

export type GenerationMode = 'basic' | 'gemini' | 'aistudio';

interface GenerationModeModalProps {
  lead: Lead | null;
  geminiKey: string;
  onSaveGeminiKey: (key: string) => Promise<void>;
  onClose: () => void;
  onSelect: (mode: GenerationMode) => void;
}

const GEMINI_KEY_URL = 'https://aistudio.google.com/apikey';

const MODES = [
  {
    id: 'basic' as GenerationMode,
    icon: Zap,
    title: 'Site Básico',
    tagline: 'Pronto na hora, sem IA',
    description:
      'Monta o site a partir do modelo do nicho, com os dados reais do lead. Instantâneo e sem depender de chave de API.',
    accent: 'text-slate-300',
    ring: 'hover:border-slate-500',
  },
  {
    id: 'gemini' as GenerationMode,
    icon: Sparkles,
    title: 'Gerar com IA do Google',
    tagline: 'Textos escritos pelo Gemini',
    description:
      'O Gemini escreve headline, serviços, diferenciais e FAQ sob medida para a empresa. Requer chave do Gemini em Configurações.',
    accent: 'text-indigo-400',
    ring: 'hover:border-[#8126C2]',
  },
  {
    id: 'aistudio' as GenerationMode,
    icon: Wand2,
    title: 'Estúdio de IA (Google AI Studio)',
    tagline: 'Você escolhe a identidade visual',
    description:
      'Você define nome, cores e recursos. Montamos o prompt completo de design e abrimos o Google AI Studio com ele pronto para gerar.',
    accent: 'text-[#B65AF0]',
    ring: 'hover:border-[#B65AF0]',
  },
];

export const GenerationModeModal: React.FC<GenerationModeModalProps> = ({
  lead,
  geminiKey,
  onSaveGeminiKey,
  onClose,
  onSelect,
}) => {
  const [keyDraft, setKeyDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!lead) return null;

  const hasKey = Boolean(geminiKey.trim());

  const connectKey = async () => {
    const key = keyDraft.trim();
    if (!key) return;
    setIsSaving(true);
    setSaveError('');
    try {
      await onSaveGeminiKey(key);
      setKeyDraft('');
    } catch (err: any) {
      setSaveError(err?.message || 'Não foi possível salvar a chave.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-[#25123A] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#B65AF0]">
            Como quer gerar o site?
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">{lead.name}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {lead.categoryLabel} · {lead.city}
          </p>
        </div>

        <div className="space-y-2.5">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const needsKey = mode.id === 'gemini' && !hasKey;

            return (
              <div key={mode.id}>
                <button
                  type="button"
                  onClick={() => onSelect(mode.id)}
                  className={`w-full flex items-start gap-3.5 p-4 bg-slate-800/40 border border-slate-800 text-left transition-all group ${
                    needsKey ? 'rounded-t-xl border-b-0' : 'rounded-xl'
                  } ${mode.ring}`}
                >
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${mode.accent}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{mode.title}</span>
                      <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                        {mode.tagline}
                      </span>
                      {mode.id === 'gemini' && hasKey && (
                        <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                          <Check className="w-3 h-3" />
                          Chave conectada
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">{mode.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0 mt-2" />
                </button>

                {needsKey && (
                  <div className="rounded-b-xl border border-amber-900/60 border-t-0 bg-amber-950/20 p-3.5 space-y-2.5">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[13px] text-amber-200/90 leading-relaxed">
                        <span className="font-bold text-amber-300">Sem chave do Google configurada.</span>{' '}
                        Sem ela, esta opção gera um site genérico (sem IA) e não avisa. Conecte sua
                        chave do Gemini abaixo — é gratuita.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="password"
                          value={keyDraft}
                          onChange={(e) => setKeyDraft(e.target.value)}
                          placeholder="Cole sua chave do Gemini (AIza...)"
                          className="w-full pl-9 pr-3 py-2 text-[13px] bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={connectKey}
                        disabled={!keyDraft.trim() || isSaving}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Conectar
                      </button>
                    </div>

                    {saveError && <p className="text-[13px] text-rose-400">{saveError}</p>}

                    <a
                      href={GEMINI_KEY_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Pegar minha chave no Google AI Studio
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
