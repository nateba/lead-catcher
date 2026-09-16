import React, { useEffect, useState } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, XCircle, Crown, UserPlus } from 'lucide-react';
import { authHeaders } from '../lib/apiAuth';
import { useToast } from './Toast';

interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
  subscriptionStatus: 'active' | 'canceled' | 'refunded' | null;
  plan: 'mensal' | 'vitalicio' | null;
  provider: string | null;
}

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  active: { label: 'Ativo', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' },
  canceled: { label: 'Cancelado', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  refunded: { label: 'Reembolsado', className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' },
};

export const AdminPanel: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<'mensal' | 'vitalicio'>('vitalicio');
  const [isAddingUser, setIsAddingUser] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users', { headers: await authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao carregar usuários.');
      setUsers(data.users);
    } catch (err: any) {
      showToast('Erro ao carregar usuários', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetSubscription = async (
    userId: string,
    status: 'active' | 'canceled',
    plan?: 'mensal' | 'vitalicio'
  ) => {
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/set-subscription', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ userId, status, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao atualizar assinatura.');
      showToast(status === 'active' ? 'Acesso liberado!' : 'Acesso revogado.');
      await loadUsers();
    } catch (err: any) {
      showToast('Erro ao atualizar', err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddUser = async () => {
    const trimmed = newEmail.trim();
    if (!trimmed || !trimmed.includes('@')) {
      showToast('E-mail inválido', 'Digite um e-mail válido.', 'error');
      return;
    }

    setIsAddingUser(true);
    try {
      const res = await fetch('/api/admin/add-user', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ email: trimmed, plan: newPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao adicionar usuário.');
      showToast(
        data.created ? 'Conta criada e acesso liberado!' : 'Acesso liberado para conta existente!',
        data.created ? `Senha padrão: hypeleads123` : undefined
      );
      setNewEmail('');
      await loadUsers();
    } catch (err: any) {
      showToast('Erro ao adicionar usuário', err.message, 'error');
    } finally {
      setIsAddingUser(false);
    }
  };

  return (
    <div id="admin-panel-container" className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Painel Admin</h2>
            <p className="text-xs text-slate-400">Gerencie manualmente o acesso dos usuários</p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserPlus className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Adicionar Usuário por E-mail</h3>
            <p className="text-xs text-slate-400">
              Se a conta não existir, é criada com a senha padrão (hypeleads123)
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <select
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value as 'mensal' | 'vitalicio')}
            className="px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="vitalicio">Vitalício</option>
            <option value="mensal">Mensal</option>
          </select>
          <button
            type="button"
            onClick={handleAddUser}
            disabled={isAddingUser || !newEmail.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-emerald-500/25 transition-all whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {isAddingUser ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-bold">Usuário</th>
                <th className="px-4 py-3 font-bold">Plano</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Cadastro</th>
                <th className="px-4 py-3 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => {
                const statusInfo = u.subscriptionStatus ? STATUS_LABEL[u.subscriptionStatus] : null;
                const isBusy = updatingId === u.id;
                return (
                  <tr key={u.id} className="text-slate-700 dark:text-slate-300">
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-1.5">
                        {u.email}
                        {u.isAdmin && <Crown className="w-3.5 h-3.5 text-amber-500" aria-label="Admin" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{u.plan || '—'}</td>
                    <td className="px-4 py-3">
                      {statusInfo ? (
                        <span className={`px-2 py-0.5 rounded-full font-bold ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Sem assinatura
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.subscriptionStatus !== 'active' && (
                          <>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleSetSubscription(u.id, 'active', 'vitalicio')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 transition-colors disabled:opacity-50"
                              title="Liberar acesso vitalício"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Vitalício
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleSetSubscription(u.id, 'active', 'mensal')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 transition-colors disabled:opacity-50"
                              title="Liberar acesso mensal"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Mensal
                            </button>
                          </>
                        )}
                        {u.subscriptionStatus === 'active' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleSetSubscription(u.id, 'canceled')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 transition-colors disabled:opacity-50"
                            title="Revogar acesso"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Revogar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
