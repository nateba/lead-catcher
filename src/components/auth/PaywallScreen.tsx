import React from 'react';
import { Zap, Lock, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CHECKOUT_URLS } from '../../constants';

export const PaywallScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100/60 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 mb-4">
          <Lock className="w-5 h-5" />
        </div>

        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Sua assinatura não está ativa
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          {user?.email ? `A conta ${user.email} ainda` : 'Sua conta ainda'} não tem um plano pago
          confirmado. Assine para liberar o acesso ao LeadSite AI.
        </p>

        <div className="mt-6 space-y-2.5 text-left">
          <a
            href={CHECKOUT_URLS.vitalicio}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold shadow-md shadow-indigo-500/25 transition-all"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Acesso Pra Sempre
            </span>
            <span>R$ 249,90</span>
          </a>
          <a
            href={CHECKOUT_URLS.mensal}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold transition-all"
          >
            <span>Plano Mensal</span>
            <span>R$ 169,90</span>
          </a>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
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
