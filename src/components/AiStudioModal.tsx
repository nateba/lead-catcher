import React, { useEffect, useRef, useState } from 'react';
import { X, Palette, MapPin, Phone, Wand2, ExternalLink, Copy, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Lead } from '../types';
import { ColorSelect } from './ColorSelect';
import {
  AVAILABLE_FEATURES,
  buildAiStudioPrompt,
  buildAiStudioUrl,
  buildDefaultIdentity,
  type SiteIdentity,
} from '../services/aiStudioPrompt';

interface AiStudioModalProps {
  lead: Lead | null;
  onClose: () => void;
}

const BOOT_LINES = [
  '$ initializing axionfly engine...',
  '→ loading neural prompt model v3.2',
  '✓ context window: 128k tokens ready',
  "import { AxionAI } from '@axionfly/core';",
  "const project = new AxionAI({ tier: 'pro' });",
  '→ analyzing niche keywords...',
  '→ optimizing conversion structure...',
  '✓ landing sections: hero, features, cta',
  '→ generating responsive layout grid...',
  '→ injecting framer-motion animations...',
  '✓ tailwind tokens compiled',
];

export const AiStudioModal: React.FC<AiStudioModalProps> = ({ lead, onClose }) => {
  const [step, setStep] = useState<'form' | 'building' | 'ready'>('form');
  const [identity, setIdentity] = useState<SiteIdentity | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (lead) setIdentity(buildDefaultIdentity(lead));
  }, [lead]);

  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  if (!lead || !identity) return null;

  const prompt = buildAiStudioPrompt(lead, identity);

  const update = (patch: Partial<SiteIdentity>) => setIdentity((prev) => ({ ...prev!, ...patch }));

  const toggleFeature = (feature: string) =>
    update({
      features: identity.features.includes(feature)
        ? identity.features.filter((f) => f !== feature)
        : [...identity.features, feature],
    });

  const startBuilding = () => {
    setStep('building');
    setVisibleLines(0);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = BOOT_LINES.map((_, i) =>
      window.setTimeout(() => {
        setVisibleLines(i + 1);
        if (i === BOOT_LINES.length - 1) {
          timers.current.push(window.setTimeout(() => setStep('ready'), 1200));
        }
      }, 560 * (i + 1))
    );
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const openAiStudio = async () => {
    // The URL already carries the prompt; the copy is a fallback in case AI
    // Studio ever stops honouring the query parameter.
    await copyPrompt();
    window.open(buildAiStudioUrl(prompt), '_blank', 'noopener,noreferrer');
  };

  const progress = step === 'form' ? 0 : step === 'ready' ? 100 : Math.round((visibleLines / BOOT_LINES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 rounded-2xl border border-[#25123A] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#1C0D2A] border border-[#8126C2]/50 flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-[#B65AF0]" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white leading-tight">Estúdio de IA</h3>
            <p className="text-[13px] text-slate-400">
              {step === 'form' ? 'Defina a identidade visual do site' : 'Preparando seu prompt de design'}
            </p>
          </div>
        </div>

        {step === 'form' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
              <label htmlFor="site-name" className="block text-[13px] font-bold uppercase tracking-wide text-slate-400">
                Nome do site *
              </label>
              <input
                id="site-name"
                type="text"
                value={identity.siteName}
                onChange={(e) => update({ siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#B65AF0]" />
                <span className="text-[13px] font-bold uppercase tracking-wide text-slate-400">
                  Identidade visual
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="primary-color" className="block text-[13px] font-semibold text-slate-400 mb-1.5">
                    Cor principal
                  </label>
                  <ColorSelect
                    id="primary-color"
                    value={identity.primaryColorHex}
                    onChange={(color) =>
                      update({ primaryColorHex: color.hex, primaryColorName: color.name })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="secondary-color" className="block text-[13px] font-semibold text-slate-400 mb-1.5">
                    Cor secundária
                  </label>
                  <ColorSelect
                    id="secondary-color"
                    value={identity.secondaryColorHex}
                    onChange={(color) =>
                      update({ secondaryColorHex: color.hex, secondaryColorName: color.name })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                <span
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ background: identity.primaryColorHex }}
                />
                <span
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ background: identity.secondaryColorHex }}
                />
                <span className="text-[12px] font-bold uppercase tracking-wide text-slate-500 ml-1">
                  Pré-visualização da paleta
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
              <span className="text-[13px] font-bold uppercase tracking-wide text-slate-400">
                Contato e localização
              </span>
              <div>
                <label htmlFor="site-address" className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 mb-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Endereço
                </label>
                <input
                  id="site-address"
                  type="text"
                  value={identity.address}
                  onChange={(e) => update({ address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label htmlFor="site-phone" className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 mb-1.5">
                  <Phone className="w-3.5 h-3.5" /> Telefone / WhatsApp
                </label>
                <input
                  id="site-phone"
                  type="text"
                  value={identity.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2.5">
              <span className="text-[13px] font-bold uppercase tracking-wide text-slate-400">
                Funcionalidades
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_FEATURES.map((feature) => {
                  const active = identity.features.includes(feature);
                  return (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`px-2.5 py-1.5 rounded-lg text-[13px] font-semibold border transition-all ${
                        active
                          ? 'bg-[#1C0D2A] border-[#8126C2] text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {feature}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={startBuilding}
              disabled={!identity.siteName.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wide bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white hover:brightness-110 shadow-[0_0_24px_rgba(129,38,194,0.35)] transition-all disabled:opacity-50"
            >
              Montar prompt de design
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step !== 'form' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  {step === 'ready' ? 'Tudo pronto!' : 'Compilando...'}
                </p>
                <p className="text-[13px] text-slate-400">
                  {step === 'ready' ? 'Finalização liberada' : 'Analisando nicho e estrutura'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-[#B65AF0]">{progress}%</span>
                <p className="text-[12px] uppercase tracking-wide text-slate-500">Processando</p>
              </div>
            </div>

            <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8126C2] to-[#B65AF0] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="rounded-xl bg-[#05040a] border border-slate-800 overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-[12px] font-mono text-slate-500">axionfly-engine — generating</span>
              </div>
              <div className="p-3.5 font-mono text-[13px] leading-relaxed min-h-[210px]">
                {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith('✓')
                        ? 'text-emerald-400'
                        : line.startsWith('→')
                        ? 'text-[#B65AF0]'
                        : line.startsWith('$')
                        ? 'text-slate-300'
                        : 'text-sky-300'
                    }
                  >
                    <span className="text-slate-500 mr-1.5">&gt;</span>
                    {line}
                  </div>
                ))}
                {step === 'building' && <span className="inline-block w-2 h-3.5 bg-[#B65AF0] animate-pulse" />}
              </div>
            </div>

            {step === 'ready' && (
              <>
                <p className="text-[13px] text-slate-400 text-center leading-relaxed">
                  O Google AI Studio abre com o prompt já preenchido, e ele também fica copiado na
                  área de transferência. Esteja logado na sua conta Google: deslogado, o prompt é
                  grande demais para a tela de login do Google e ela retorna erro — nesse caso, entre
                  no AI Studio primeiro e cole o prompt.
                </p>

                <button
                  type="button"
                  onClick={openAiStudio}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wide bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white hover:brightness-110 shadow-[0_0_24px_rgba(129,38,194,0.35)] transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Finalizar meu site profissional
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyPrompt}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Prompt copiado!' : 'Copiar prompt'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Ajustar
                  </button>
                </div>

                <details className="rounded-xl bg-slate-800/40 border border-slate-800">
                  <summary className="px-3.5 py-2.5 text-[13px] font-bold text-slate-400 cursor-pointer">
                    Ver o prompt gerado
                  </summary>
                  <pre className="px-3.5 pb-3.5 text-[12px] text-slate-400 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {prompt}
                  </pre>
                </details>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
