import React from 'react';
import {
  Search,
  Users,
  BarChart3,
  Settings,
  Sun,
  Moon,
  HelpCircle,
  Sparkles,
  Zap,
  LogOut,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenOnboarding: () => void;
  crmCount: number;
  userEmail: string;
  onSignOut: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenOnboarding,
  crmCount,
  userEmail,
  onSignOut,
}) => {
  const navItems = [
    { id: 'search' as ActiveTab, label: 'Buscar Leads', icon: Search, badge: null },
    {
      id: 'crm' as ActiveTab,
      label: 'Meus Leads',
      icon: Users,
      badge: crmCount > 0 ? crmCount : null,
    },
    { id: 'metrics' as ActiveTab, label: 'Métricas', icon: BarChart3, badge: null },
    { id: 'settings' as ActiveTab, label: 'Configurações', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Desktop Fixed Left Sidebar (0 width / hidden on mobile) */}
      <aside
        id="app-sidebar"
        className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0 select-none z-30 transition-colors h-full"
      >
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  LeadSite
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Prospecção OpenStreetMap
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Free Plan & Credits Notice */}
        <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-indigo-50/60 to-purple-50/60 dark:from-slate-800/40 dark:to-indigo-950/20 border border-indigo-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Operação 100% Free
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Buscas via Overpass API & criação de sites via Gemini AI sem custos.
          </p>
        </div>

        {/* Bottom Profile Info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 gap-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-800 shrink-0">
              {userEmail ? userEmail.slice(0, 2).toUpperCase() : 'AG'}
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-28" title={userEmail}>
                {userEmail || 'Agência B2B'}
              </p>
              <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={onOpenOnboarding}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Ver Tutorial / Ajuda"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onSignOut}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        aria-label="Navegação móvel"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex items-center justify-around shadow-lg safe-area-pb"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative min-h-[46px] min-w-[54px] flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/60 dark:bg-indigo-950/40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
              {item.badge !== null && (
                <span className="absolute top-1 right-1.5 min-w-[16px] h-4 px-1 text-[9px] font-extrabold rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
