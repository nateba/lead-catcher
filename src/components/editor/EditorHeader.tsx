import React from 'react';
import {
  X,
  Download,
  Save,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react';
import { Lead } from '../../types';

interface EditorHeaderProps {
  lead: Lead;
  viewport: 'desktop' | 'tablet' | 'mobile';
  setViewport: (v: 'desktop' | 'tablet' | 'mobile') => void;
  onSaveCrm: () => void;
  onDownload: () => void;
  onClose: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  lead,
  viewport,
  setViewport,
  onSaveCrm,
  onDownload,
  onClose,
}) => {
  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 z-10">
      {/* Left: Lead Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-lg text-white font-extrabold text-xs flex items-center justify-center shrink-0"
          style={{ backgroundColor: lead.avatarBg || '#4f46e5' }}
        >
          {lead.initials}
        </div>
        <div className="truncate">
          <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
            {lead.name}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
            Editor & Live Preview — {lead.city}, {lead.state}
          </p>
        </div>
      </div>

      {/* Center: Viewport Switcher */}
      <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setViewport('desktop')}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewport === 'desktop'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>
        <button
          onClick={() => setViewport('tablet')}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewport === 'tablet'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>
        <button
          onClick={() => setViewport('mobile')}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewport === 'mobile'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSaveCrm}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salvar no CRM</span>
        </button>

        <button
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar HTML</span>
        </button>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Fechar Editor"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
