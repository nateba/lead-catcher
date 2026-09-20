import React from 'react';
import { ColorPalette, GeneratedSite, VisualStyleType } from '../../types';
import { COLOR_PRESETS } from '../../constants';
import { STYLES_REGISTRY } from '../../services/generator/styleRegistry';

interface ColorsTabProps {
  colors: ColorPalette;
  setColors: React.Dispatch<React.SetStateAction<ColorPalette>>;
  siteData?: GeneratedSite;
  setSiteData?: React.Dispatch<React.SetStateAction<GeneratedSite>>;
}

export const ColorsTab: React.FC<ColorsTabProps> = ({
  colors,
  setColors,
  siteData,
  setSiteData,
}) => {
  const currentStyle: VisualStyleType = siteData?.estilo_visual || 'MODERN';

  const handleSelectStyle = (styleKey: VisualStyleType) => {
    if (setSiteData && siteData) {
      setSiteData({ ...siteData, estilo_visual: styleKey });
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual Style Selector */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Estilo Visual do Layout
          </h4>
          <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            {STYLES_REGISTRY[currentStyle]?.label || 'Modern'}
          </span>
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          Altera tipografia, composição, cartões e contraste do site gerado.
        </p>

        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(STYLES_REGISTRY) as VisualStyleType[]).map((key) => {
            const item = STYLES_REGISTRY[key];
            const isSelected = currentStyle === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectStyle(key)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </span>
                  {isSelected && (
                    <span className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400">
                      ✓ Ativo
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-tight">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Palettes */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Paletas de Cores Recomendadas
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() =>
                setColors({
                  primaria: preset.primary,
                  secundaria: preset.secondary,
                  texto_sobre_primaria: '#ffffff',
                })
              }
              className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-500 transition-all text-left"
            >
              <div className="flex -space-x-1 shrink-0">
                <span
                  className="w-4 h-4 rounded-full border border-white dark:border-slate-800"
                  style={{ backgroundColor: preset.primary }}
                />
                <span
                  className="w-4 h-4 rounded-full border border-white dark:border-slate-800"
                  style={{ backgroundColor: preset.secondary }}
                />
              </div>
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Tuning */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Ajuste Customizado de Cores
        </h4>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Cor Primária (Header, Botões, Destaques)
            </label>
            <span className="text-[13px] font-mono text-slate-400">{colors.primaria}</span>
          </div>
          <input
            type="color"
            value={colors.primaria}
            onChange={(e) => setColors({ ...colors, primaria: e.target.value })}
            className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Cor Secundária (Gradientes, Ícones)
            </label>
            <span className="text-[13px] font-mono text-slate-400">{colors.secundaria}</span>
          </div>
          <input
            type="color"
            value={colors.secundaria}
            onChange={(e) => setColors({ ...colors, secundaria: e.target.value })}
            className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};
