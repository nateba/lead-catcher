import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Save,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead, GeneratedSite, SavedLead } from '../types';
import { generateSiteContent } from '../services/geminiService';
import { saveLead } from '../services/storageService';
import { generateStandaloneHtml, downloadHtmlFile, cleanPhoneForWhatsapp } from '../services/htmlExportService';
import { useToast } from './Toast';

interface BatchGenerationModalProps {
  leads: Lead[];
  onClose: () => void;
  onOpenSiteEditor: (lead: Lead, siteData: GeneratedSite) => void;
}

interface BatchItemStatus {
  lead: Lead;
  status: 'pending' | 'generating' | 'success' | 'error';
  siteData?: GeneratedSite;
  error?: string;
}

export const BatchGenerationModal: React.FC<BatchGenerationModalProps> = ({
  leads,
  onClose,
  onOpenSiteEditor,
}) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<BatchItemStatus[]>(
    leads.map((l) => ({ lead: l, status: 'pending' }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const completedCount = items.filter((i) => i.status === 'success').length;
  const errorCount = items.filter((i) => i.status === 'error').length;
  const isAllFinished = items.every((i) => i.status === 'success' || i.status === 'error');

  const startBatch = async () => {
    setIsRunning(true);

    for (let i = 0; i < items.length; i++) {
      setCurrentIndex(i);
      const current = items[i];

      setItems((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: 'generating' } : item))
      );

      try {
        const siteData = await generateSiteContent(current.lead);
        // Automatically save to CRM
        await saveLead(current.lead, siteData);

        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'success', siteData } : item
          )
        );
      } catch (err: any) {
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'error', error: err.message || 'Erro na geração' } : item
          )
        );
      }

      // 800ms throttle between generations
      if (i < items.length - 1) {
        await new Promise((r) => setTimeout(r, 800));
      }
    }

    setIsRunning(false);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    showToast('Processamento em lote concluído!', 'Todos os sites gerados foram salvos no seu CRM.');
  };

  const handleDownloadItem = (item: BatchItemStatus) => {
    if (!item.siteData) return;
    const colors = item.siteData.paleta_sugerida || {
      primaria: '#4f46e5',
      secundaria: '#06b6d4',
      texto_sobre_primaria: '#ffffff',
    };
    const html = generateStandaloneHtml(item.lead, item.siteData, colors);
    const filename = `site_${item.lead.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    downloadHtmlFile(filename, html);
  };

  const handleDownloadAllCompleted = () => {
    const successItems = items.filter((i) => i.status === 'success' && i.siteData);
    successItems.forEach((item, idx) => {
      setTimeout(() => {
        handleDownloadItem(item);
      }, idx * 300);
    });
    showToast(`Baixando ${successItems.length} arquivos HTML...`);
  };

  return (
    <div id="batch-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div
        id="batch-modal-card"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Geração em Lote com Gemini AI
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {items.length} empresas selecionadas para criação simultânea de sites
              </p>
            </div>
          </div>
          {!isRunning && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Progresso Geral</span>
            <span>
              {completedCount + errorCount} de {items.length} concluídos
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full transition-all duration-300 rounded-full"
              style={{
                width: `${((completedCount + errorCount) / items.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* List of Batch items */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1 mb-6">
          {items.map((item, idx) => (
            <div
              key={item.lead.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                item.status === 'generating'
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                  : item.status === 'success'
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : item.status === 'error'
                  ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                  : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: item.lead.avatarBg || '#4f46e5' }}
                >
                  {item.lead.initials}
                </div>
                <div className="truncate">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {item.lead.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.lead.categoryLabel} • {item.lead.city}
                  </p>
                </div>
              </div>

              {/* Status indicator & actions */}
              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'pending' && (
                  <span className="text-[11px] text-slate-400 font-medium">Aguardando</span>
                )}
                {item.status === 'generating' && (
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Gerando IA...
                  </span>
                )}
                {item.status === 'error' && (
                  <span className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Erro
                  </span>
                )}
                {item.status === 'success' && item.siteData && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold flex items-center gap-1 text-[11px] mr-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pronto
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenSiteEditor(item.lead, item.siteData!)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                      title="Editar & Visualizar"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadItem(item)}
                      className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400"
                      title="Baixar HTML"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleDownloadAllCompleted}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar Todos ({completedCount})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isRunning && !isAllFinished && (
              <button
                type="button"
                onClick={startBatch}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Iniciar Geração em Lote
              </button>
            )}

            {isAllFinished && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
              >
                Concluir & Ir para o CRM
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
