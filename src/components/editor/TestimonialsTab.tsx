import React from 'react';
import { RefreshCw, Plus, Trash2, Info } from 'lucide-react';
import { GeneratedSite } from '../../types';

interface TestimonialsTabProps {
  siteData: GeneratedSite;
  setSiteData: React.Dispatch<React.SetStateAction<GeneratedSite>>;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const TestimonialsTab: React.FC<TestimonialsTabProps> = ({
  siteData,
  setSiteData,
  onRegenerate,
  isRegenerating,
}) => {
  const handleAddTestimonial = () => {
    const newDep = {
      autor: 'Cliente Local',
      texto: 'Excelente atendimento e compromisso com o combinado. Recomendo!',
      estrelas: 5,
    };
    setSiteData({
      ...siteData,
      depoimentos: [...(siteData.depoimentos || []), newDep],
    });
  };

  const handleRemoveTestimonial = (index: number) => {
    const updated = siteData.depoimentos.filter((_, idx) => idx !== index);
    setSiteData({ ...siteData, depoimentos: updated });
  };

  return (
    <div className="space-y-4">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Depoimentos Demonstrativos
        </h4>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAddTestimonial}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerar IA
          </button>
        </div>
      </div>

      {/* Notice */}
      <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Transparência:</strong> Estes depoimentos são exemplos demonstrativos para a proposta visual e estão devidamente identificados na página.
        </p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {siteData.depoimentos.map((dep, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Depoimento #{idx + 1}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-500 font-bold">★★★★★ 5 estrelas</span>
                {siteData.depoimentos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTestimonial(idx)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                    title="Remover depoimento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <textarea
              rows={2}
              value={dep.texto}
              onChange={(e) => {
                const updated = [...siteData.depoimentos];
                updated[idx].texto = e.target.value;
                setSiteData({ ...siteData, depoimentos: updated });
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 italic"
            />
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-semibold text-slate-500">Autor:</label>
              <input
                type="text"
                value={dep.autor}
                onChange={(e) => {
                  const updated = [...siteData.depoimentos];
                  updated[idx].autor = e.target.value;
                  setSiteData({ ...siteData, depoimentos: updated });
                }}
                className="flex-1 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-semibold"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
