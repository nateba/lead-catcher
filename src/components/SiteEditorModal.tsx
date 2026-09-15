import React, { useState, useMemo } from 'react';
import {
  FileText,
  Palette,
  Sparkles,
  MessageSquare,
  Code,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead, GeneratedSite, ColorPalette } from '../types';
import { SitePreview } from './SitePreview';
import { generateStandaloneHtml, downloadHtmlFile } from '../services/htmlExportService';
import { regenerateTestimonials } from '../services/geminiService';
import { saveLead } from '../services/storageService';
import { formatWhatsappUrl, cleanPhoneForWhatsapp } from '../utils/formatters';
import { useToast } from './Toast';
import { EditorHeader } from './editor/EditorHeader';
import { ContentEditorTab } from './editor/ContentEditorTab';
import { ColorsTab } from './editor/ColorsTab';
import { TestimonialsTab } from './editor/TestimonialsTab';
import { WhatsappTab } from './editor/WhatsappTab';
import { CodeTab } from './editor/CodeTab';

interface SiteEditorModalProps {
  lead: Lead;
  initialSiteData: GeneratedSite;
  onClose: () => void;
  onSaveToCrm?: () => void;
}

type EditorTab = 'content' | 'colors' | 'testimonials' | 'whatsapp' | 'code';

export const SiteEditorModal: React.FC<SiteEditorModalProps> = ({
  lead,
  initialSiteData,
  onClose,
  onSaveToCrm,
}) => {
  const { showToast } = useToast();
  const [siteData, setSiteData] = useState<GeneratedSite>(initialSiteData);
  const [colors, setColors] = useState<ColorPalette>(
    initialSiteData.paleta_sugerida || {
      primaria: '#4f46e5',
      secundaria: '#06b6d4',
      texto_sobre_primaria: '#ffffff',
    }
  );
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<EditorTab>('content');
  const [isRegeneratingTestimonials, setIsRegeneratingTestimonials] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const [notes, setNotes] = useState('');

  const standaloneHtml = useMemo(() => {
    return generateStandaloneHtml(lead, siteData, colors);
  }, [lead, siteData, colors]);

  const handleDownload = () => {
    const filename = `site_${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    downloadHtmlFile(filename, standaloneHtml);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    showToast('Download concluído!', `Arquivo ${filename}.html baixado com sucesso.`);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(standaloneHtml);
    setCopiedCode(true);
    showToast('Código HTML copiado para a área de transferência!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyWa = () => {
    navigator.clipboard.writeText(siteData.mensagem_abordagem_whatsapp);
    setCopiedWa(true);
    showToast('Roteiro copiado!', 'Cole no WhatsApp para abordar o lead.');
    setTimeout(() => setCopiedWa(false), 2000);
  };

  const handleSaveCrm = async () => {
    await saveLead(
      lead,
      siteData,
      { primary: colors.primaria, secondary: colors.secundaria },
      notes
    );
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
    showToast('Salvo no CRM!', `Site e lead "${lead.name}" armazenados com sucesso.`);
    onSaveToCrm?.();
  };

  const handleRegenerateTestimonials = async () => {
    setIsRegeneratingTestimonials(true);
    try {
      const newDeps = await regenerateTestimonials(lead);
      if (newDeps && newDeps.length > 0) {
        setSiteData((prev) => ({ ...prev, depoimentos: newDeps }));
        showToast('Depoimentos regenerados com sucesso pelo Gemini AI!');
      }
    } catch (err: any) {
      showToast('Falha ao regenerar depoimentos', err.message, 'error');
    } finally {
      setIsRegeneratingTestimonials(false);
    }
  };

  // WhatsApp direct link for approach
  const cleanPhone = cleanPhoneForWhatsapp(lead.phone);
  const waDirectUrl = cleanPhone
    ? formatWhatsappUrl(lead.phone, siteData.mensagem_abordagem_whatsapp)
    : null;

  return (
    <div id="site-editor-modal-overlay" className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <EditorHeader
        lead={lead}
        viewport={viewport}
        setViewport={setViewport}
        onSaveCrm={handleSaveCrm}
        onDownload={handleDownload}
        onClose={onClose}
      />

      {/* Main Two-Panel Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Editor Panel */}
        <div className="w-full lg:w-[480px] xl:w-[520px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden">
          {/* Editor Sub-Tabs */}
          <div className="flex items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-slate-50 dark:bg-slate-900/50">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Textos & Seções</span>
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'colors'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Cores</span>
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'testimonials'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Depoimentos</span>
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>Abordagem WhatsApp</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Código HTML</span>
            </button>
          </div>

          {/* Tab Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {activeTab === 'content' && (
              <ContentEditorTab
                siteData={siteData}
                setSiteData={setSiteData}
              />
            )}

            {activeTab === 'colors' && (
              <ColorsTab
                colors={colors}
                setColors={setColors}
                siteData={siteData}
                setSiteData={setSiteData}
              />
            )}

            {activeTab === 'testimonials' && (
              <TestimonialsTab
                siteData={siteData}
                setSiteData={setSiteData}
                onRegenerate={handleRegenerateTestimonials}
                isRegenerating={isRegeneratingTestimonials}
              />
            )}

            {activeTab === 'whatsapp' && (
              <WhatsappTab
                lead={lead}
                siteData={siteData}
                setSiteData={setSiteData}
                notes={notes}
                setNotes={setNotes}
                onCopyWa={handleCopyWa}
                copiedWa={copiedWa}
                waDirectUrl={waDirectUrl}
              />
            )}

            {activeTab === 'code' && (
              <CodeTab
                standaloneHtml={standaloneHtml}
                onCopyHtml={handleCopyHtml}
                copiedCode={copiedCode}
              />
            )}
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="flex-1 h-full min-h-[400px] overflow-hidden bg-slate-950">
          <SitePreview
            lead={lead}
            siteData={siteData}
            colors={colors}
            viewport={viewport}
          />
        </div>
      </div>
    </div>
  );
};
