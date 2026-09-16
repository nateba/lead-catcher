import React, { useState } from 'react';
import { Search, Sparkles, Send, ArrowRight, Check, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: '1. Radar de Empresas no OpenStreetMap',
      subtitle: 'Encontre negócios locais que ainda não têm site',
      description:
        'O HypeLeads varre a base do OpenStreetMap na cidade e no nicho que você escolher, e mostra empresas reais — com telefone e endereço — que ainda não possuem site próprio.',
      icon: Search,
      badge: 'Buscas Ilimitadas',
      color: 'from-indigo-500 to-violet-600',
    },
    {
      step: 2,
      title: '2. Geração Instantânea com Gemini AI',
      subtitle: 'Landing page completa e moderna em segundos',
      description:
        'A inteligência artificial do Google Gemini analisa os dados públicos da empresa e cria uma página de alta conversão com serviços, depoimentos, diferenciais, FAQ e botão de WhatsApp.',
      icon: Sparkles,
      badge: 'Powered by Gemini AI',
      color: 'from-violet-500 to-indigo-600',
    },
    {
      step: 3,
      title: '3. Amostra Grátis & Fechamento B2B',
      subtitle: 'A melhor estratégia para agências e freelancers',
      description:
        'Use o site gerado como uma amostra grátis irresistível. Copie o roteiro de abordagem pronto para WhatsApp, envie para o dono do negócio e ofereça o site oficial e serviços de marketing.',
      icon: Send,
      badge: 'Prospecção Validada',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const current = steps[currentStep - 1];

  return (
    <div id="onboarding-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        id="onboarding-modal-card"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 transition-all"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.step === currentStep
                  ? 'w-10 bg-indigo-600 dark:bg-indigo-400'
                  : s.step < currentStep
                  ? 'w-4 bg-indigo-300 dark:bg-indigo-900'
                  : 'w-4 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Visual Card */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${current.color} flex items-center justify-center text-white shadow-lg mb-6 transform transition-transform hover:scale-105`}
          >
            <current.icon className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            {current.badge}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {current.title}
          </h2>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-3">
            {current.subtitle}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-md">
            {current.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-3 py-2"
          >
            Pular Tutorial
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Voltar
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((p) => Math.min(3, p + 1))}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/20"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                Começar a Prospectar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
