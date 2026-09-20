import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeTabProps {
  standaloneHtml: string;
  onCopyHtml: () => void;
  copiedCode: boolean;
}

export const CodeTab: React.FC<CodeTabProps> = ({
  standaloneHtml,
  onCopyHtml,
  copiedCode,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Código Fonte HTML (100% Autossuficiente)
        </span>
        <button
          type="button"
          onClick={onCopyHtml}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200"
        >
          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedCode ? 'Copiado!' : 'Copiar Código'}
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <pre className="p-3 text-[13px] font-mono bg-slate-900 text-slate-200 max-h-[480px] overflow-y-auto leading-relaxed">
          {standaloneHtml}
        </pre>
      </div>
    </div>
  );
};
