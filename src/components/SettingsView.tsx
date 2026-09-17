import React, { useState } from 'react';
import {
  Settings,
  Server,
  Trash2,
  Download,
  Building,
  RotateCcw,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AppSettings, SavedLead } from '../types';
import { saveSettings, clearAllLocalData, exportLeadsToCsv } from '../services/storageService';
import { useToast } from './Toast';
import { useAuth } from '../contexts/AuthContext';

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
  const { updatePassword } = useAuth();
  const [overpassServer, setOverpassServer] = useState(settings.overpassServer || 'auto');
  const [agencyName, setAgencyName] = useState(settings.agencyName || 'Minha Agência Digital');
  const [userName, setUserName] = useState(settings.userName || 'Consultor Digital');
  const [customGeminiKey, setCustomGeminiKey] = useState(settings.customGeminiKey || '');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSave = async () => {
    const updated = await saveSettings({
      overpassServer,
      agencyName: agencyName.trim(),
      userName: userName.trim(),
      customGeminiKey: customGeminiKey.trim(),
    });
    onUpdateSettings(updated);
    showToast('Configurações salvas com sucesso!');
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      showToast('Senha muito curta', 'A nova senha precisa ter pelo menos 6 caracteres.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('As senhas não coincidem', 'Digite a mesma senha nos dois campos.', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await updatePassword(newPassword);
    setIsUpdatingPassword(false);

    if (error) {
      showToast('Erro ao atualizar senha', error, 'error');
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    showToast('Senha atualizada com sucesso!');
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
              Configurações do HypeLeads
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

      {/* 3.2. Personal Gemini API Key */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sua Chave do Gemini (opcional)
            </h3>
            <p className="text-xs text-slate-400">
              Use sua própria cota de IA para gerar os textos dos sites
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="gemini-key-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Chave da API
          </label>
          <div className="relative">
            <input
              id="gemini-key-input"
              type={showGeminiKey ? 'text' : 'password'}
              value={customGeminiKey}
              onChange={(e) => setCustomGeminiKey(e.target.value)}
              placeholder="AIza..."
              autoComplete="off"
              spellCheck={false}
              className="w-full pl-3.5 pr-10 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            />
            <button
              type="button"
              onClick={() => setShowGeminiKey((v) => !v)}
              aria-label={showGeminiKey ? 'Ocultar chave' : 'Mostrar chave'}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            Pegue a sua em{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-400 underline underline-offset-2"
            >
              Google AI Studio
            </a>
            . Deixando em branco, a geração usa a chave do servidor — e, se não houver
            nenhuma, cai no modelo de textos prontos por categoria.
          </p>

          <div className="mt-3 flex items-center gap-2 text-[11px]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                settings.customGeminiKey ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span className="text-slate-500 dark:text-slate-400">
              {settings.customGeminiKey
                ? 'Chave pessoal salva e em uso nas gerações.'
                : 'Nenhuma chave pessoal salva.'}
            </span>
          </div>
        </div>
      </div>

      {/* 3.5. Security / Change Password */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Segurança / Alterar Senha
            </h3>
            <p className="text-xs text-slate-400">
              Defina uma nova senha para acessar sua conta
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="new-password-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nova Senha
            </label>
            <input
              id="new-password-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label htmlFor="confirm-password-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirmar Nova Senha
            </label>
            <input
              id="confirm-password-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={isUpdatingPassword || !newPassword || !confirmPassword}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-indigo-500/25 transition-all"
          >
            {isUpdatingPassword ? 'Atualizando...' : 'Atualizar Senha'}
          </button>
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
