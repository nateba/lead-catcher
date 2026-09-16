import React, { useState, useEffect, useRef } from 'react';
import {
  ActiveTab,
  Lead,
  SearchFilters,
  GeneratedSite,
  SavedLead,
  AppSettings,
} from './types';
import { Navigation } from './components/Navigation';
import { SearchForm } from './components/SearchForm';
import { ResultsGrid } from './components/ResultsGrid';
import { LeadDetailModal } from './components/LeadDetailModal';
import { SiteEditorModal } from './components/SiteEditorModal';
import { BatchGenerationModal } from './components/BatchGenerationModal';
import { CrmPipeline } from './components/CrmPipeline';
import { MetricsDashboard } from './components/MetricsDashboard';
import { SettingsView } from './components/SettingsView';
import { OnboardingModal } from './components/OnboardingModal';
import { ToastProvider, useToast } from './components/Toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { PaywallScreen } from './components/auth/PaywallScreen';
import { AdminPanel } from './components/AdminPanel';
import { searchLeads } from './services/osmService';
import { generateSiteContent } from './services/geminiService';
import {
  getSavedLeads,
  getSettings,
  saveSettings,
  exportSearchLeadsToCsv,
  saveLeadFromSearch,
  DEFAULT_SETTINGS,
} from './services/storageService';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { showToast } = useToast();
  const {
    session,
    user,
    isLoading: isAuthLoading,
    hasActiveSubscription,
    isAdmin,
    isAccessLoading,
    signOut,
  } = useAuth();

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');

  // Search State
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number }>({
    lat: -23.5505,
    lng: -46.6333,
  });
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Search Abort Controller ref
  const searchAbortControllerRef = useRef<AbortController | null>(null);

  // CRM State
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>([]);

  // Modals State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  // Single Site Editor State
  const [editorLead, setEditorLead] = useState<Lead | null>(null);
  const [editorSiteData, setEditorSiteData] = useState<GeneratedSite | null>(null);
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);

  // Batch Generation State
  const [batchLeads, setBatchLeads] = useState<Lead[] | null>(null);

  // Load settings & saved leads from Supabase once the user is authenticated
  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    (async () => {
      setIsDataLoading(true);
      const [loadedSettings, loadedLeads] = await Promise.all([getSettings(), getSavedLeads()]);
      if (cancelled) return;
      setSettings(loadedSettings);
      setSavedLeads(loadedLeads);
      setIsDataLoading(false);
      if (!loadedSettings.onboardingCompleted) {
        setIsOnboardingOpen(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const handleCloseOnboarding = async () => {
    setIsOnboardingOpen(false);
    const updated = await saveSettings({ onboardingCompleted: true });
    setSettings(updated);
  };

  const handleRefreshLeads = async () => {
    setSavedLeads(await getSavedLeads());
  };

  // Cancel search in-flight
  const handleCancelSearch = () => {
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
      searchAbortControllerRef.current = null;
    }
    setIsSearching(false);
    showToast('Busca cancelada', 'A operação foi interrompida.', 'info');
  };

  // Perform search via OSM Overpass & Scorer Pipeline
  const handleExecuteSearch = async (filters: SearchFilters) => {
    // Abort any prior ongoing search
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    searchAbortControllerRef.current = abortController;

    setIsSearching(true);
    setCurrentFilters(filters);
    setLoadingStep(1);
    setLoadingMessage('Iniciando radar de prospecção...');

    try {
      const response = await searchLeads(
        filters,
        (step, msg) => {
          setLoadingStep(step);
          setLoadingMessage(msg);
        },
        settings.overpassServer,
        abortController.signal
      );

      setSearchResults(response.results);
      setSearchCenter(response.center);
      setHasSearched(true);

      if (response.results.length > 0) {
        const excellentCount = response.results.filter((l) => l.leadQuality === 'EXCELLENT').length;
        const subMsg =
          excellentCount > 0
            ? `${response.results.length} empresas encontradas (${excellentCount} com alta chance de conversão).`
            : `${response.results.length} empresas encontradas em ${filters.city}.`;

        showToast(
          response.fromCache ? 'Resultados carregados (Cache)' : 'Busca concluída!',
          subMsg
        );
      } else {
        showToast(
          'Nenhum resultado nesta área',
          'Tente ampliar o raio de busca ou mudar a categoria.',
          'info'
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('cancelada')) {
        // User aborted, silently ignore
        return;
      }
      console.error('Search error:', err);
      showToast('Erro ao buscar empresas', err.message || 'Falha na conexão com OpenStreetMap.', 'error');
    } finally {
      setIsSearching(false);
      searchAbortControllerRef.current = null;
    }
  };

  // Handle single lead site generation
  const handleGenerateSite = async (lead: Lead) => {
    setIsGeneratingSingle(true);
    showToast('Iniciando Gemini AI...', `Criando landing page para "${lead.name}".`, 'info');

    try {
      const siteData = await generateSiteContent(lead);
      setDetailLead(null);
      setEditorLead(lead);
      setEditorSiteData(siteData);
      showToast('Site gerado com sucesso!', 'Você já pode customizar ou baixar o HTML.');
    } catch (err: any) {
      console.error('Generation error:', err);
      showToast('Falha na geração do site', err.message || 'Tente novamente.', 'error');
    } finally {
      setIsGeneratingSingle(false);
    }
  };

  // Open site editor directly with existing site data
  const handleOpenExistingSite = (lead: Lead, siteData: GeneratedSite) => {
    setEditorLead(lead);
    setEditorSiteData(siteData);
  };

  // Batch generation start
  const handleBatchGenerate = (selected: Lead[]) => {
    setBatchLeads(selected);
  };

  // Direct save to CRM from search results or details
  const handleSaveLeadsToCrm = async (leadsToSave: Lead[]) => {
    let newCount = 0;
    for (const lead of leadsToSave) {
      const res = await saveLeadFromSearch(lead);
      if (res.isNew) newCount++;
    }
    await handleRefreshLeads();
    if (newCount > 0) {
      showToast(`${newCount} lead(s) adicionados ao CRM!`, 'Acesse a aba "CRM & Funil" para acompanhar o status.');
    } else {
      showToast('Leads já estavam registrados no CRM.', '', 'info');
    }
  };

  // Auth gate: still resolving session, or no session at all
  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (isAccessLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!hasActiveSubscription && !isAdmin) {
    return <PaywallScreen />;
  }

  if (isDataLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Ambient violet wash, echoing the landing page's lit backdrop */}
      <div className="app-ambient-glow pointer-events-none absolute inset-0 z-0" />

      {/* Sidebar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        crmCount={savedLeads.length}
        userEmail={user?.email || ''}
        onSignOut={signOut}
        isAdmin={isAdmin}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* TAB 1: SEARCH & PROSPECTING */}
            {activeTab === 'search' && (
              <div className="space-y-8">
                {/* Search Form Card */}
                <SearchForm
                  onSearch={handleExecuteSearch}
                  onCancelSearch={handleCancelSearch}
                  isLoading={isSearching}
                  loadingStep={loadingStep}
                  loadingMessage={loadingMessage}
                />

                {/* Results Section */}
                {hasSearched && (
                  <ResultsGrid
                    leads={searchResults}
                    filters={currentFilters}
                    center={searchCenter}
                    onSelectLead={(lead) => setDetailLead(lead)}
                    onGenerateSite={handleGenerateSite}
                    onBatchGenerate={handleBatchGenerate}
                    onSaveToCrm={handleSaveLeadsToCrm}
                    onExportCsv={exportSearchLeadsToCsv}
                    onResetSearch={() => setHasSearched(false)}
                  />
                )}
              </div>
            )}

            {/* TAB 2: CRM & SAVED LEADS */}
            {activeTab === 'crm' && (
              <CrmPipeline
                savedLeads={savedLeads}
                onRefreshLeads={handleRefreshLeads}
                onOpenSiteEditor={handleOpenExistingSite}
                onGenerateSite={handleGenerateSite}
              />
            )}

            {/* TAB 3: ANALYTICS & METRICS */}
            {activeTab === 'metrics' && (
              <MetricsDashboard
                savedLeads={savedLeads}
                totalSearchedCount={searchResults.length}
              />
            )}

            {/* TAB 4: SETTINGS */}
            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={setSettings}
                savedLeads={savedLeads}
                onRefreshLeads={handleRefreshLeads}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
              />
            )}

            {/* TAB 5: ADMIN (only reachable when Navigation renders the tab, i.e. isAdmin) */}
            {activeTab === 'admin' && isAdmin && <AdminPanel />}
          </div>
        </main>
      </div>

      {/* MODALS */}

      {/* Onboarding 3-step walkthrough */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={detailLead}
        onClose={() => setDetailLead(null)}
        onGenerateSite={handleGenerateSite}
        onSaveToCrm={(l) => handleSaveLeadsToCrm([l])}
      />

      {/* Full Site Editor & Preview */}
      {editorLead && editorSiteData && (
        <SiteEditorModal
          lead={editorLead}
          initialSiteData={editorSiteData}
          onClose={() => {
            setEditorLead(null);
            setEditorSiteData(null);
          }}
          onSaveToCrm={handleRefreshLeads}
        />
      )}

      {/* Batch Generation Modal */}
      {batchLeads && (
        <BatchGenerationModal
          leads={batchLeads}
          onClose={() => {
            setBatchLeads(null);
            handleRefreshLeads();
            setActiveTab('crm');
          }}
          onOpenSiteEditor={(lead, data) => {
            setBatchLeads(null);
            handleOpenExistingSite(lead, data);
          }}
        />
      )}

      {/* Generating Overlay Indicator for single generation */}
      {isGeneratingSingle && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Criando Landing Page
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                A inteligência artificial do Gemini está gerando textos persuasivos, depoimentos e SEO para a empresa...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
