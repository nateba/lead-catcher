import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  Phone,
  Building2,
  XCircle,
  Clock,
  ExternalLink,
  Globe,
  RotateCcw,
  X,
  Target,
} from 'lucide-react';
import { SearchFilters, RecentSearch } from '../types';
import { BRAZIL_STATES, BUSINESS_CATEGORIES } from '../data/categories';
import { NICHE_DEFINITIONS, findNicheByTerm } from '../data/nicheMappings';
import { getNicheIcon } from '../data/nicheIcons';
import {
  getCountries,
  getStates,
  getCities,
  getCitiesByUf,
  type CountryOption,
} from '../services/locationService';
import { getRecentSearches, saveRecentSearch } from '../services/storageService';

// Labels carry qualifiers ("Salão de Beleza & Estética") that hurt a plain-text
// Google search, so keep only the leading name.
function toSearchTerm(label: string): string {
  return label.split(/[&(]/)[0].trim();
}

// Cities are omitted when a country/state has no list, so the search still
// works at state level instead of producing a dangling comma.
function buildMapsQuery(niche: string, city: string, stateName: string, country: string): string {
  const place = [city, stateName, country].filter(Boolean).join(', ');
  return `${niche} empresas que não tem site em ${place}`;
}

function buildGoogleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

// Keyless embed (`output=embed`). It needs no Maps API key, but it is an
// undocumented endpoint — if Google ever drops it, the "open in a new tab"
// button below the map still works.
function buildGoogleMapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  onCancelSearch?: () => void;
  isLoading: boolean;
  loadingStep: number;
  loadingMessage: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  onCancelSearch,
  isLoading,
  loadingStep,
  loadingMessage,
}) => {
  const [state, setState] = useState('SP');
  const [city, setCity] = useState('São Paulo');
  const [searchMode, setSearchMode] = useState<'auto' | 'manual'>('auto');

  // Manual mode keeps its own location: it is worldwide and uses full state
  // names, while the automatic search is Brazil-only and keyed by UF code.
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [manualCountry, setManualCountry] = useState('Brazil');
  const [manualStates, setManualStates] = useState<string[]>([]);
  const [manualState, setManualState] = useState('São Paulo');
  const [manualCities, setManualCities] = useState<string[]>([]);
  const [manualCity, setManualCity] = useState('São Paulo');
  const [isLoadingManualStates, setIsLoadingManualStates] = useState(false);
  const [isLoadingManualCities, setIsLoadingManualCities] = useState(false);
  const [manualError, setManualError] = useState('');
  const [categoryKey, setCategoryKey] = useState('barbearia');
  const [customTag, setCustomTag] = useState('');
  const [radiusKm, setRadiusKm] = useState(5);
  const [limit, setLimit] = useState(50);

  // Advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [onlyWithPhone, setOnlyWithPhone] = useState(false);
  const [onlyWithFullAddress, setOnlyWithFullAddress] = useState(false);
  const [excludeClosed, setExcludeClosed] = useState(true);
  const [minScore, setMinScore] = useState<number>(0);
  const [websiteFilter, setWebsiteFilter] = useState<'all' | 'no_website_only' | 'has_website_only'>('no_website_only');

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Municipality list for the selected state (IBGE)
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [citiesError, setCitiesError] = useState('');

  // Niche picker search (matches labels and synonyms)
  const [categorySearch, setCategorySearch] = useState('');

  // Load recent searches on mount
  useEffect(() => {
    getRecentSearches().then(setRecentSearches);
  }, []);

  const selectedCategory =
    NICHE_DEFINITIONS.find((c) => c.key === categoryKey) ||
    BUSINESS_CATEGORIES.find((c) => c.key === categoryKey);

  const countryLabel =
    countries.find((c) => c.value === manualCountry)?.label || manualCountry;
  const mapsQuery = buildMapsQuery(
    toSearchTerm(selectedCategory?.label || ''),
    manualCity,
    manualState,
    countryLabel
  );
  const mapsEmbedUrl = buildGoogleMapsEmbedUrl(mapsQuery);

  const handleOpenGoogleMaps = () => {
    window.open(buildGoogleMapsUrl(mapsQuery), '_blank', 'noopener,noreferrer');
  };


  // Countries for the manual mode picker (loaded once)
  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch(() => setManualError('Não foi possível carregar a lista de países.'));
  }, []);

  // States of the chosen country
  useEffect(() => {
    let cancelled = false;
    setIsLoadingManualStates(true);
    setManualError('');

    getStates(manualCountry)
      .then((list) => {
        if (cancelled) return;
        setManualStates(list);
        setManualState((current) => (list.includes(current) ? current : list[0] ?? ''));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setManualStates([]);
        setManualState('');
        setManualError(err.message || 'Não foi possível carregar os estados.');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingManualStates(false);
      });

    return () => {
      cancelled = true;
    };
  }, [manualCountry]);

  // Cities of the chosen state
  useEffect(() => {
    if (!manualState) {
      setManualCities([]);
      setManualCity('');
      return;
    }

    let cancelled = false;
    setIsLoadingManualCities(true);

    getCities(manualCountry, manualState)
      .then((list) => {
        if (cancelled) return;
        setManualCities(list);
        setManualCity((current) => (list.includes(current) ? current : list[0] ?? ''));
      })
      .catch(() => {
        if (cancelled) return;
        // No city list for this state: fall back to searching the state itself.
        setManualCities([]);
        setManualCity('');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingManualCities(false);
      });

    return () => {
      cancelled = true;
    };
  }, [manualCountry, manualState]);

  // Load the state's municipalities, keeping the selected city when it exists there
  useEffect(() => {
    let cancelled = false;
    setIsLoadingCities(true);
    setCitiesError('');

    getCitiesByUf(state)
      .then((list) => {
        if (cancelled) return;
        setCities(list);
        setCity((current) => (list.includes(current) ? current : list[0] ?? ''));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setCities([]);
        setCitiesError(err.message || 'Não foi possível carregar os municípios.');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCities(false);
      });

    return () => {
      cancelled = true;
    };
  }, [state]);

  // Filter categories with synonym search
  const filteredCategories = NICHE_DEFINITIONS.filter((c) => {
    const q = categorySearch.toLowerCase().trim();
    if (!q) return true;
    if (c.label.toLowerCase().includes(q)) return true;
    if (c.description.toLowerCase().includes(q)) return true;
    if (c.primaryTag.toLowerCase().includes(q)) return true;
    if (c.synonyms && c.synonyms.some((syn) => syn.toLowerCase().includes(q))) return true;
    return false;
  });

  const isFormValid = Boolean(
    state && city.trim() && (categoryKey !== 'personalizado' || customTag.trim())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    const label = selectedCategory?.label || 'Negócio Local';

    // Save recent search
    const updatedRecents = await saveRecentSearch({
      city: city.trim(),
      state,
      categoryKey,
      categoryLabel: label,
      radiusKm,
      limit,
    });
    setRecentSearches(updatedRecents);

    onSearch({
      state,
      city: city.trim(),
      categoryKey,
      customCategoryTag: customTag.trim(),
      radiusKm,
      limit,
      onlyWithPhone,
      onlyWithFullAddress,
      excludeClosed,
      minScore,
      websiteFilter,
    });
  };

  const handleApplyRecent = (recent: RecentSearch) => {
    setState(recent.state);
    setCity(recent.city);
    setCategoryKey(recent.categoryKey);
    setRadiusKm(recent.radiusKm || 5);
  };

  return (
    <div id="search-card-container" className="w-full max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 transition-all">
        {/* Card Header */}
        <div className="mb-6 pb-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" />
            <span>Radar de Prospecção & Qualificação de Leads</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Encontrar Empresas Locais
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pesquise no OpenStreetMap, identifique oportunidades de alta conversão e aborde com landing pages prontas.
          </p>

          {/* Quick Recent Searches Chips */}
          {recentSearches.length > 0 && !isLoading && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 text-[13px]">
                <Clock className="w-3 h-3" />
                Recentes:
              </span>
              {recentSearches.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => handleApplyRecent(rec)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-medium transition-colors border border-slate-200/60 dark:border-slate-700"
                >
                  {rec.city}/{rec.state} • {rec.categoryLabel}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: State & City — the automatic search is Brazil-only, so the
              manual mode brings its own worldwide country/state/city pickers. */}
          {searchMode === 'auto' && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* State */}
            <div className="sm:col-span-4">
              <label htmlFor="state-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Estado <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="state-select"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                >
                  {BRAZIL_STATES.map((s) => (
                    <option key={s.uf} value={s.uf}>
                      {s.uf} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City */}
            <div className="sm:col-span-8">
              <label htmlFor="city-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Cidade <span className="text-rose-500">*</span></span>
                {isLoadingCities ? (
                  <span className="text-[13px] text-slate-400 font-normal flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                    Carregando municípios...
                  </span>
                ) : (
                  cities.length > 0 && (
                    <span className="text-[13px] text-slate-400 font-normal">
                      {cities.length} municípios
                    </span>
                  )
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  id="city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isLoading || isLoadingCities || cities.length === 0}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer disabled:opacity-60"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {citiesError && <p className="text-[13px] mt-1 text-rose-500">{citiesError}</p>}
            </div>
          </div>
          )}

          {/* Row 2: Business Category Picker */}
          <div>
            <div className="flex items-end justify-between mb-1.5 gap-3 flex-wrap">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nicho / Categoria de Negócio <span className="text-rose-500">*</span>
              </label>
              <span className="text-[13px] font-semibold text-slate-400">
                {filteredCategories.length} nicho{filteredCategories.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="relative mb-2.5">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="category-search-input"
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                disabled={isLoading}
                placeholder="Buscar nicho... (ex: barbearia, pizzaria, advocacia)"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            {filteredCategories.length === 0 ? (
              <div className="p-5 text-center text-xs text-slate-400 border border-dashed border-slate-700 rounded-xl">
                Nenhum nicho encontrado para "{categorySearch}". Limpe a busca e escolha "Personalizado" para usar sua própria tag OSM.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[19rem] overflow-y-auto pr-1">
                {filteredCategories.map((cat) => {
                  const Icon = getNicheIcon(cat.iconName);
                  const isSelected = categoryKey === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      title={cat.description}
                      onClick={() => setCategoryKey(cat.key)}
                      disabled={isLoading}
                      className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border text-left transition-all disabled:opacity-50 ${
                        isSelected
                          ? 'bg-[#1C0D2A] border-[#8126C2] text-white shadow-[0_0_18px_rgba(129,38,194,0.45)]'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#8126C2]/60 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#B65AF0]' : 'text-slate-400'}`} />
                      <span className="text-[12px] font-semibold leading-tight">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search mode: live Overpass query vs. a manual Google Maps lookup */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[13px] font-bold uppercase tracking-wider text-slate-500">Modo</span>
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 gap-1">
              {[
                { id: 'auto' as const, label: 'API Inteligente (Auto)' },
                { id: 'manual' as const, label: 'Pesquisa Manual (Maps)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSearchMode(m.id)}
                  disabled={isLoading}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all disabled:opacity-50 ${
                    searchMode === m.id
                      ? 'bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white shadow-[0_0_14px_rgba(129,38,194,0.4)]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom OSM Tag field if 'personalizado' */}
          {categoryKey === 'personalizado' && (
            <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-1.5 animate-fadeIn">
              <label htmlFor="custom-tag-input" className="block text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Tag Personalizada do OpenStreetMap (chave=valor)
              </label>
              <input
                id="custom-tag-input"
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Ex: shop=bicycle, leisure=bowling_alley, amenity=post_office"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[13px] text-indigo-600 dark:text-indigo-400">
                Consulte as tags oficiais em <a href="https://wiki.openstreetmap.org/wiki/Map_features" target="_blank" rel="noreferrer" className="underline font-semibold">wiki.openstreetmap.org</a>
              </p>
            </div>
          )}

          {/* Manual mode: hand the search off to Google Maps instead of Overpass */}
          {searchMode === 'manual' && (
            <div className="p-4 rounded-xl border border-[#25123A] bg-[#0d0813]/60 space-y-3.5 animate-fadeIn">
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const Icon = getNicheIcon(selectedCategory?.iconName);
                  return <Icon className="w-4 h-4 text-[#B65AF0]" />;
                })()}
                <span className="text-sm font-bold text-white">{selectedCategory?.label}</span>
                <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#8126C2]/20 text-[#B65AF0] border border-[#8126C2]/40">
                  Selecionado
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="country-select" className="block text-[13px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                    País
                  </label>
                  <select
                    id="country-select"
                    value={manualCountry}
                    onChange={(e) => {
                      // Clear the state first: otherwise the cities effect fires
                      // once with the previous country's state still selected.
                      setManualState('');
                      setManualCities([]);
                      setManualCountry(e.target.value);
                    }}
                    disabled={countries.length === 0}
                    className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer disabled:opacity-60"
                  >
                    {countries.length === 0 ? (
                      <option>Carregando...</option>
                    ) : (
                      countries.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="manual-state-select" className="block text-[13px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                    Estado
                  </label>
                  <select
                    id="manual-state-select"
                    value={manualState}
                    onChange={(e) => setManualState(e.target.value)}
                    disabled={isLoadingManualStates || manualStates.length === 0}
                    className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer disabled:opacity-60"
                  >
                    {isLoadingManualStates ? (
                      <option>Carregando...</option>
                    ) : manualStates.length === 0 ? (
                      <option value="">Sem estados</option>
                    ) : (
                      manualStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="manual-city-select" className="block text-[13px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                    Cidade
                  </label>
                  <select
                    id="manual-city-select"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    disabled={isLoadingManualCities || manualCities.length === 0}
                    className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer disabled:opacity-60"
                  >
                    {isLoadingManualCities ? (
                      <option>Carregando...</option>
                    ) : manualCities.length === 0 ? (
                      <option value="">Busca no estado inteiro</option>
                    ) : (
                      manualCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {manualError && <p className="text-[13px] text-rose-500">{manualError}</p>}

              <div>
                <p className="text-[13px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Busca que será aberta
                </p>
                <p className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[12px] text-slate-300 truncate" title={mapsQuery}>
                  {mapsQuery}
                </p>
              </div>

              {/* Google's keyless embed — same results, without leaving the app */}
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                <iframe
                  key={mapsEmbedUrl}
                  title="Mapa da busca no Google Maps"
                  src={mapsEmbedUrl}
                  className="w-full h-[380px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                disabled={!manualState && !manualCity}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wide bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white hover:brightness-110 shadow-[0_0_24px_rgba(129,38,194,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir no Google Maps (aba nova)
              </button>

              <p className="text-[13px] text-slate-500 leading-relaxed">
                O mapa acima é o próprio Google Maps. Abra em aba nova para ver a lista completa,
                telefones e avaliações. Use quando o nicho tiver pouca cobertura no OpenStreetMap —
                os resultados daqui não entram no CRM automaticamente.
              </p>
            </div>
          )}

          {searchMode === 'auto' && (
          <>
          {/* Row 3: Radius & Result Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-1">
            {/* Radius Options */}
            <div className="sm:col-span-7">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Raio de Busca
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {radiusKm} km
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[2, 5, 10, 20, 30].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadiusKm(r)}
                    disabled={isLoading}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      radiusKm === r
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            {/* Limit Quantity */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Limite de Resultados
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[25, 50, 100, 200].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setLimit(qty)}
                    disabled={isLoading}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      limit === qty
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Advanced Filters */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros Avançados & Qualificação</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
                {/* Website filter mode */}
                <div className="space-y-1">
                  <span className="block text-[13px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status do Website:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setWebsiteFilter('no_website_only')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        websiteFilter === 'no_website_only'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Site não identificado (Recomendado)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWebsiteFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        websiteFilter === 'all'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Todos os negócios
                    </button>
                    <button
                      type="button"
                      onClick={() => setWebsiteFilter('has_website_only')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        websiteFilter === 'has_website_only'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Já possui site
                    </button>
                  </div>
                </div>

                {/* Score filter */}
                <div className="space-y-1">
                  <span className="block text-[13px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Lead Score Mínimo:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { val: 0, label: 'Qualquer score' },
                      { val: 40, label: '40+ (Média)' },
                      { val: 60, label: '60+ (Boa)' },
                      { val: 80, label: '80+ (Excelente)' },
                    ].map((s) => (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => setMinScore(s.val)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          minScore === s.val
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="pt-1 space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyWithPhone}
                      onChange={(e) => setOnlyWithPhone(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Somente empresas com telefone ou WhatsApp</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyWithFullAddress}
                      onChange={(e) => setOnlyWithFullAddress(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                    />
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Somente empresas com endereço completo (rua + número)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={excludeClosed}
                      onChange={(e) => setExcludeClosed(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                    />
                    <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Excluir empresas marcadas como desativadas / fechadas</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button & Cancel Action */}
          <div className="pt-4 flex items-center gap-3">
            <button
              id="search-leads-button"
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white transition-all shadow-lg ${
                !isFormValid
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  : isLoading
                  ? 'bg-indigo-700 cursor-wait'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 animate-soft-pulse'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Buscando no OpenStreetMap...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Buscar Oportunidades</span>
                </>
              )}
            </button>

            {isLoading && onCancelSearch && (
              <button
                type="button"
                onClick={onCancelSearch}
                className="px-4 py-3.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            )}
          </div>

          {/* Step-by-Step Loading Progress Bar */}
          {isLoading && (
            <div id="search-progress-bar" className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600 animate-pulse" />
                  {loadingMessage || 'Processando busca...'}
                </span>
                <span>Etapa {loadingStep} de 4</span>
              </div>

              {/* Multi-step bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(10, (loadingStep / 4) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-1 text-[12px] text-slate-500 dark:text-slate-400 mt-2 text-center">
                <span className={loadingStep >= 1 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>1. Localizar</span>
                <span className={loadingStep >= 2 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>2. Overpass</span>
                <span className={loadingStep >= 3 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>3. Normalizar</span>
                <span className={loadingStep >= 4 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>4. Qualificar</span>
              </div>
            </div>
          )}
          </>
          )}
        </form>
      </div>
    </div>
  );
};
