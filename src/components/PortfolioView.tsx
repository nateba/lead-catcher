import React, { useState } from 'react';
import {
  Layers,
  User,
  Briefcase,
  MessageSquare,
  Star,
  Target,
  MapPin,
  Rocket,
  Palette,
  Instagram,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';
import {
  PORTFOLIO_TYPES,
  VISUAL_STYLES,
  PORTFOLIO_PALETTES,
  PORTFOLIO_SECTIONS,
  DEFAULT_SECTIONS,
} from '../data/portfolioOptions';
import { buildPortfolioPrompt, EMPTY_BRIEF, type PortfolioBrief } from '../services/portfolioPrompt';
import { buildAiStudioUrl } from '../services/aiStudioPrompt';
import { PromptTerminal } from './PromptTerminal';

const FIELD =
  'w-full px-3.5 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all';

const Label: React.FC<{ htmlFor: string; icon: React.ElementType; children: React.ReactNode; required?: boolean }> = ({
  htmlFor,
  icon: Icon,
  children,
  required,
}) => (
  <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">
    <Icon className="w-3.5 h-3.5 text-[#B65AF0]" />
    {children}
    {required && <span className="text-rose-500">*</span>}
  </label>
);

export const PortfolioView: React.FC = () => {
  const [brief, setBrief] = useState<PortfolioBrief>({
    ...EMPTY_BRIEF,
    siteType: PORTFOLIO_TYPES[0],
    visualStyle: VISUAL_STYLES[0],
    paletteLabel: PORTFOLIO_PALETTES[0].label,
    sections: DEFAULT_SECTIONS,
  });
  const [step, setStep] = useState<'form' | 'building' | 'ready'>('form');
  const [copied, setCopied] = useState(false);

  const set = (patch: Partial<PortfolioBrief>) => setBrief((prev) => ({ ...prev, ...patch }));

  const toggleSection = (section: string) =>
    set({
      sections: brief.sections.includes(section)
        ? brief.sections.filter((s) => s !== section)
        : [...brief.sections, section],
    });

  const canGenerate = Boolean(brief.name.trim() && brief.profession.trim());
  const prompt = buildPortfolioPrompt(brief);

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
    await copyPrompt();
    window.open(buildAiStudioUrl(prompt), '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="portfolio-container" className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Monte <span className="text-[#B65AF0]">seu portfólio perfeito</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Responda as perguntas abaixo e a IA gera o seu portfólio profissional na hora.
        </p>
      </div>

      {step === 'form' && (
        <>
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div>
              <Label htmlFor="pf-type" icon={Layers}>Tipo de site</Label>
              <select id="pf-type" value={brief.siteType} onChange={(e) => set({ siteType: e.target.value })} className={`${FIELD} cursor-pointer`}>
                {PORTFOLIO_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pf-name" icon={User} required>Seu nome ou nome da marca</Label>
                <input id="pf-name" value={brief.name} onChange={(e) => set({ name: e.target.value })} placeholder="ex: Marina Costa / Studio Norte" className={FIELD} />
              </div>
              <div>
                <Label htmlFor="pf-profession" icon={Briefcase} required>Profissão ou nicho</Label>
                <input id="pf-profession" value={brief.profession} onChange={(e) => set({ profession: e.target.value })} placeholder="ex: arquiteta de interiores / agência de sites" className={FIELD} />
              </div>
            </div>

            <div>
              <Label htmlFor="pf-tagline" icon={MessageSquare}>Tagline (frase de impacto que abre o site)</Label>
              <input id="pf-tagline" value={brief.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder={'ex: "Projetos que vendem antes do cliente entrar."'} className={FIELD} />
            </div>

            <div>
              <Label htmlFor="pf-about" icon={User}>Sobre você / sua empresa (1 parágrafo)</Label>
              <textarea id="pf-about" rows={3} value={brief.about} onChange={(e) => set({ about: e.target.value })} placeholder="quem é, quantos anos de mercado, especialidade, propósito" className={FIELD} />
            </div>

            <div>
              <Label htmlFor="pf-services" icon={Star}>Serviços (separe por vírgula)</Label>
              <textarea id="pf-services" rows={2} value={brief.services} onChange={(e) => set({ services: e.target.value })} placeholder="ex: criação de sites, páginas de venda, identidade visual, gestão de tráfego" className={FIELD} />
            </div>

            <div>
              <Label htmlFor="pf-diff" icon={Rocket}>Diferenciais competitivos</Label>
              <textarea id="pf-diff" rows={2} value={brief.differentials} onChange={(e) => set({ differentials: e.target.value })} placeholder="ex: entrego em 7 dias, atendimento humano, garantia de revisão, +100 sites no ar" className={FIELD} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pf-audience" icon={Target}>Público-alvo</Label>
                <input id="pf-audience" value={brief.audience} onChange={(e) => set({ audience: e.target.value })} placeholder="ex: pequenas empresas locais que querem profissionalizar" className={FIELD} />
              </div>
              <div>
                <Label htmlFor="pf-city" icon={MapPin}>Cidade / região (opcional)</Label>
                <input id="pf-city" value={brief.city} onChange={(e) => set({ city: e.target.value })} placeholder="ex: Curitiba e região" className={FIELD} />
              </div>
            </div>

            <div>
              <Label htmlFor="pf-action" icon={Rocket}>Ação principal que o visitante deve tomar</Label>
              <input id="pf-action" value={brief.mainAction} onChange={(e) => set({ mainAction: e.target.value })} placeholder={'ex: "Solicitar orçamento no WhatsApp" / "Agendar reunião"'} className={FIELD} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pf-style" icon={Rocket}>Estilo visual</Label>
                <select id="pf-style" value={brief.visualStyle} onChange={(e) => set({ visualStyle: e.target.value })} className={`${FIELD} cursor-pointer`}>
                  {VISUAL_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="pf-palette" icon={Palette}>Paleta de cores</Label>
                <select id="pf-palette" value={brief.paletteLabel} onChange={(e) => set({ paletteLabel: e.target.value })} className={`${FIELD} cursor-pointer`}>
                  {PORTFOLIO_PALETTES.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
                </select>
                <div className="flex items-center gap-1.5 mt-2">
                  {PORTFOLIO_PALETTES.find((p) => p.label === brief.paletteLabel)?.swatches.map((hex) => (
                    <span key={hex} className="w-4 h-4 rounded-full border border-white/20" style={{ background: hex }} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="pf-sections" icon={Layers}>Seções que o site deve ter (clique pra escolher)</Label>
              <div id="pf-sections" className="flex flex-wrap gap-1.5">
                {PORTFOLIO_SECTIONS.map((section) => {
                  const active = brief.sections.includes(section);
                  return (
                    <button
                      key={section}
                      type="button"
                      onClick={() => toggleSection(section)}
                      className={`px-3 py-1.5 rounded-full text-[13px] font-bold border transition-all ${
                        active
                          ? 'bg-[#1C0D2A] border-[#8126C2] text-white shadow-[0_0_12px_rgba(129,38,194,0.35)]'
                          : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {section}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pf-whatsapp" icon={MessageSquare}>WhatsApp (com DDI/DDD)</Label>
                <input id="pf-whatsapp" value={brief.whatsapp} onChange={(e) => set({ whatsapp: e.target.value })} placeholder="ex: 5541999999999" className={FIELD} />
              </div>
              <div>
                <Label htmlFor="pf-instagram" icon={Instagram}>Instagram</Label>
                <input id="pf-instagram" value={brief.instagram} onChange={(e) => set({ instagram: e.target.value })} placeholder="ex: @marinacosta.arq" className={FIELD} />
              </div>
            </div>

            <div>
              <Label htmlFor="pf-refs" icon={Star}>Referências de inspiração (opcional)</Label>
              <textarea id="pf-refs" rows={2} value={brief.references} onChange={(e) => set({ references: e.target.value })} placeholder="ex: gosto do site da Apple, da Linear e do estúdio Pentagram" className={FIELD} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C0D2A]/70 to-[#0d0813]/50 border border-[#25123A] text-center space-y-2">
            <button
              type="button"
              onClick={() => setStep('building')}
              disabled={!canGenerate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wide bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white hover:brightness-110 shadow-[0_0_24px_rgba(129,38,194,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Rocket className="w-4 h-4" />
              Gerar meu portfólio profissional
            </button>
            <p className="text-[13px] text-slate-500">
              {canGenerate ? 'Tudo pronto para gerar.' : 'Preencha pelo menos o nome e a profissão para liberar.'}
            </p>
          </div>
        </>
      )}

      {step === 'building' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <PromptTerminal onDone={() => setStep('ready')} />
        </div>
      )}

      {step === 'ready' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="text-center">
            <p className="text-lg font-extrabold text-white">Tudo pronto!</p>
            <p className="text-[13px] text-slate-400 mt-1 leading-relaxed max-w-md mx-auto">
              O Google AI Studio abre com o prompt já preenchido, e ele também fica copiado. Esteja
              logado na sua conta Google — deslogado, a tela de login do Google não aceita um prompt
              deste tamanho e retorna erro.
            </p>
          </div>

          <button
            type="button"
            onClick={openAiStudio}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wide bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white hover:brightness-110 shadow-[0_0_24px_rgba(129,38,194,0.35)] transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir no Google AI Studio
          </button>

          <div className="flex gap-2">
            <button type="button" onClick={copyPrompt} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Prompt copiado!' : 'Copiar prompt'}
            </button>
            <button type="button" onClick={() => setStep('form')} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Ajustar respostas
            </button>
          </div>

          <details className="rounded-xl bg-slate-800/40 border border-slate-800">
            <summary className="px-3.5 py-2.5 text-[13px] font-bold text-slate-400 cursor-pointer">Ver o prompt gerado</summary>
            <pre className="px-3.5 pb-3.5 text-[12px] text-slate-400 whitespace-pre-wrap max-h-72 overflow-y-auto">{prompt}</pre>
          </details>
        </div>
      )}
    </div>
  );
};
