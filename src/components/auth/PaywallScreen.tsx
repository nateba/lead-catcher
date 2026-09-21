import React from 'react';
import { Zap, Lock, LogOut, Check, Flame } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CHECKOUT_URLS } from '../../constants';
import { OfferBadges } from '../OfferBadges';
import { OFFER, brl, MENSAL_OFF, VITALICIO_OFF } from '../../data/offer';

export const PaywallScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 p-4">
      <div className="app-ambient-glow pointer-events-none absolute inset-0" />
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-[#25123A] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(129,38,194,0.18)] p-6 sm:p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 mb-4">
          <Lock className="w-5 h-5" />
        </div>

        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Sua assinatura não está ativa
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          {user?.email ? `A conta ${user.email} ainda` : 'Sua conta ainda'} não tem um plano pago
          confirmado. Assine para liberar o acesso ao HypeLeads.
        </p>

        <OfferBadges size="compact" className="mt-5" />

        <div className="mt-4 space-y-2.5 text-left">
          <a
            href={CHECKOUT_URLS.vitalicio}
            className="relative block w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-all"
          >
            {/* Left-aligned: the prices are right-aligned, and the badge crowded
                the struck-through anchor when it sat on that side. */}
            <span className="absolute -top-2.5 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2E0A10] border border-[#7F1D2B] text-[10px] font-extrabold uppercase tracking-wide text-[#FF6B6B]">
              <Flame className="w-2.5 h-2.5 fill-[#FF6B6B]" />
              Restam {OFFER.lifetimeSlotsLeft} vitalícios
            </span>
            <span className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-bold">
                <Zap className="w-4 h-4" />
                Acesso Pra Sempre
              </span>
              <span className="text-right leading-tight">
                <span className="block text-[11px] font-semibold text-white/55 line-through">
                  {brl(OFFER.vitalicio.anchor)}
                </span>
                <span className="block text-sm font-extrabold">{brl(OFFER.vitalicio.price)}</span>
              </span>
            </span>
            <span className="mt-1 block text-[11px] font-medium text-white/70">
              {OFFER.vitalicio.period} · {VITALICIO_OFF}% de desconto
            </span>
          </a>

          <a
            href={CHECKOUT_URLS.mensal}
            className="block w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold">Plano Mensal</span>
              <span className="text-right leading-tight">
                <span className="block text-[11px] font-semibold text-slate-500 line-through">
                  {brl(OFFER.mensal.anchor)}
                </span>
                <span className="block text-sm font-extrabold">
                  {brl(OFFER.mensal.price)}
                  <span className="text-[11px] font-medium text-slate-400"> {OFFER.mensal.period}</span>
                </span>
              </span>
            </span>
            <span className="mt-1 block text-[11px] font-medium text-slate-400">
              {MENSAL_OFF}% de desconto
            </span>
          </a>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-slate-400 dark:text-slate-500">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          Acesso liberado automaticamente após a confirmação do pagamento
        </div>

        <button
          type="button"
          onClick={signOut}
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair e usar outra conta
        </button>
      </div>
    </div>
  );
};
