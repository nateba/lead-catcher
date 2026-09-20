import React from 'react';
import { Tag, TrendingUp, Lightbulb, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SavedLead } from '../types';
import { PRICING_TIERS, PRICE_LEVERS, USAGE_RULES, tierForValue } from '../data/pricingTiers';
import { ScrollReveal } from './ScrollReveal';

interface SiteAnalysisViewProps {
  savedLeads: SavedLead[];
}

const brl = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const SiteAnalysisView: React.FC<SiteAnalysisViewProps> = ({ savedLeads }) => {
  const closedWithValue = savedLeads.filter(
    (l) => l.status === 'FECHADO' && typeof l.dealValue === 'number' && l.dealValue > 0
  );
  const avgTicket = closedWithValue.length
    ? Math.round(closedWithValue.reduce((acc, l) => acc + (l.dealValue || 0), 0) / closedWithValue.length)
    : 0;
  const currentTier = avgTicket ? tierForValue(avgTicket) : undefined;
  const nextTier = currentTier
    ? PRICING_TIERS[PRICING_TIERS.findIndex((t) => t.id === currentTier.id) + 1]
    : undefined;

  return (
    <div id="site-analysis-container" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <ScrollReveal direction="up" className="text-center space-y-3 pt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C0D2A] border border-[#8126C2]/50 text-[12px] font-bold uppercase tracking-wider text-[#B65AF0]">
          <Tag className="w-3 h-3" />
          Precificação de mercado
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Análise de <span className="text-[#B65AF0]">Site</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Faixas reais de preço para você fechar com o cliente sem cálculo complicado. Escolha o
          tier, apresente com confiança.
        </p>
      </ScrollReveal>

      {/* Where the user stands today — uses their own closed deals */}
      {avgTicket > 0 ? (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C0D2A]/80 to-[#0d0813]/60 border border-[#25123A]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-wide text-slate-400">
                Seu ticket médio atual
              </p>
              <p className="text-3xl font-extrabold text-white mt-1">
                {brl(avgTicket)}{' '}
                <span className="font-sans text-xs font-normal text-slate-400">
                  ({closedWithValue.length} venda{closedWithValue.length === 1 ? '' : 's'} fechada
                  {closedWithValue.length === 1 ? '' : 's'})
                </span>
              </p>
              {currentTier && (
                <p className="text-xs text-slate-400 mt-1.5">
                  Você está na faixa <span className="font-bold text-[#B65AF0]">{currentTier.name}</span>.
                </p>
              )}
            </div>

            {nextTier && (
              <div className="text-right">
                <p className="text-[13px] font-bold uppercase tracking-wide text-slate-400">
                  Próxima faixa
                </p>
                <p className="text-xl font-extrabold text-emerald-400 mt-1 flex items-center gap-1.5 justify-end">
                  <ArrowUpRight className="w-4 h-4" />
                  {nextTier.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {brl(nextTier.min)} a {brl(nextTier.max)} — falta {brl(Math.max(0, nextTier.min - avgTicket))}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-start gap-2.5">
          <Target className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Ainda não há vendas fechadas com valor registrado. Preencha o valor do negócio ao marcar
            um lead como <span className="font-bold text-slate-300">Fechado</span> no CRM — aqui vai
            aparecer seu ticket médio real comparado às faixas de mercado.
          </p>
        </div>
      )}

      {/* Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRICING_TIERS.map((tier, index) => {
          const isCurrent = currentTier?.id === tier.id;
          return (
            <ScrollReveal key={tier.id} direction="up" delay={index * 150} className="h-full">
            <div
              className={`h-full p-5 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-[#1C0D2A]/70 border-[#8126C2] shadow-[0_0_24px_rgba(129,38,194,0.28)]'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#B65AF0]">
                  {tier.label}
                </span>
                {isCurrent && (
                  <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#8126C2]/25 text-[#B65AF0] border border-[#8126C2]/50">
                    Você está aqui
                  </span>
                )}
              </div>

              <h3 className="text-base font-extrabold text-white mt-2">{tier.name}</h3>

              <p className="text-2xl font-extrabold text-white mt-2">
                {brl(tier.min)}{' '}
                <span className="font-sans text-xs font-normal text-slate-500">a</span>{' '}
                <span className="text-[#B65AF0]">{brl(tier.max)}</span>
              </p>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed">{tier.description}</p>
              <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                <span className="font-bold text-slate-400">Ideal para:</span> {tier.idealClient}
              </p>

              <ul className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
                {tier.delivers.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-[13px] text-slate-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* How to use the bands */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-[#B65AF0] mb-3.5">
          <Lightbulb className="w-3.5 h-3.5" />
          Como usar essas faixas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {USAGE_RULES.map((rule) => (
            <div key={rule} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B65AF0] shrink-0 mt-1.5" />
              <p className="text-xs text-slate-300 leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Levers to raise the average ticket */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          Como aumentar o preço médio
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Subir de faixa quase nunca é cobrar mais pelo mesmo site — é mudar o que está sendo vendido.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRICE_LEVERS.map((lever) => (
            <div
              key={lever.title}
              className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs font-bold text-slate-200 leading-tight">{lever.title}</p>
                <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-900 text-emerald-400 shrink-0 whitespace-nowrap">
                  {lever.gain}
                </span>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed">{lever.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
