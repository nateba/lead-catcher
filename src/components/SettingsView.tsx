import React, { useState } from 'react';
import {
  Settings,
  Server,
  Trash2,
  Download,
  Building,
  RotateCcw,
} from 'lucide-react';
import { AppSettings, SavedLead } from '../types';
import { saveSettings, clearAllLocalData, exportLeadsToCsv } from '../services/storageService';
import { useToast } from './Toast';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  savedLeads: SavedLead[];
  onRefreshLeads: () => void;
  onOpenOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  savedLeads,
  onRefreshLeads,
  onOpenOnboarding,
}) => {
  const { showToast } = useToast();
  const [overpassServer, setOverpassServer] = useState(settings.overpassServer || 'auto');
  const [agencyName, setAgencyName] = useState(settings.agencyName || 'Minha Agência Digital');
  const [userName, setUserName] = useState(settings.userName || 'Consultor Digital');

  const handleSave = async () => {
    const updated = await saveSettings({
      overpassServer,
      agencyName: agencyName.trim(),
      userName: userName.trim(),
    });
    onUpdateSettings(updated);
    showToast('Configurações salvas com sucesso!');
  };

  const handleClearData = async () => {
    if (
      confirm(
        'Tem certeza que deseja apagar todos os leads salvos e configurações locais? Esta ação não pode ser desfeita.'
      )
    ) {
      await clearAllLocalData();
      onRefreshLeads();
      showToast('Todos os dados locais foram apagados.');
    }
  };

  return (
    <div id="settings-container" className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Configurações do LeadSite AI
            </h2>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Gerencie os servidores de busca do OpenStreetMap e seus dados salvos.
          </p>
        </div>
      </div>

      {/* 2. OpenStreetMap / Overpass Mirror Selection */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Servidor OpenStreetMap (Overpass API)
            </h3>
            <p className="text-xs text-slate-400">
              Escolha o servidor espelho padrão para consultas geográficas
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="overpass-server-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Espelho Overpass
          </label>
          <select
            id="overpass-server-select"
            value={overpassServer}
            onChange={(e) => setOverpassServer(e.target.value as AppSettings['overpassServer'])}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="auto">Automático (Multi-server com failover)</option>
            <option value="https://overpass-api.de/api/interpreter">
              overpass-api.de (Principal Alemanha)
            </option>
            <option value="https://overpass.kumi.systems/api/interpreter">
              overpass.kumi.systems (Espelho Rápido)
            </option>
            <option value="https://maps.mail.ru/osm/tools/overpass/api/interpreter">
              maps.mail.ru (Espelho Alternativo)
            </option>
          </select>
        </div>
      </div>

      {/* 3. Agency Profile Customization */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Perfil da Sua Agência / Consultoria
            </h3>
            <p className="text-xs text-slate-400">
              Personalize o nome para os roteiros de abordagem comercial
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="agency-name-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nome da Agência
            </label>
            <input
              id="agency-name-input"
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label htmlFor="consultant-name-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Seu Nome / Consultor
            </label>
            <input
              id="consultant-name-input"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Save Settings Action Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all"
        >
          Salvar Todas as Configurações
        </button>
      </div>

      {/* 4. Data Management & Danger Zone */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Gerenciamento de Dados Locais
        </h3>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => exportLeadsToCsv(savedLeads)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Todos os Leads ({savedLeads.length})
          </button>

          <button
            type="button"
            onClick={onOpenOnboarding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <RotateCcw className="w-4 h-4" />
            Rever Tutorial de Boas-Vindas
          </button>

          <button
            type="button"
            onClick={handleClearData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar Todos os Dados
          </button>
        </div>
      </div>
    </div>
  );
};
