import React, { useEffect, useState } from 'react';
import { Users2, Plus, Copy, Check, Trash2, Loader2, Power, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './Toast';
import { checkoutUrlProblem, randomSlug } from '../data/checkout';
import { AFFILIATE_PATH_PREFIX } from '../landing/affiliate';

interface Affiliate {
  id: string;
  slug: string;
  name: string;
  user_id: string | null;
  checkout_mensal: string | null;
  checkout_vitalicio: string | null;
  active: boolean;
  created_at: string;
}

export interface AffiliateUserOption {
  id: string;
  email: string;
}

interface AffiliatesPanelProps {
  /** Existing accounts, so an affiliate is picked rather than typed. */
  users?: AffiliateUserOption[];
}

const affiliateUrl = (slug: string) => `${window.location.origin}${AFFILIATE_PATH_PREFIX}${slug}`;

export const AffiliatesPanel: React.FC<AffiliatesPanelProps> = ({ users = [] }) => {
  const { showToast } = useToast();
  const [rows, setRows] = useState<Affiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [mensal, setMensal] = useState('');
  const [vitalicio, setVitalicio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [needsMigration, setNeedsMigration] = useState(false);

  const load = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      // Before the migration runs the table simply is not there. Say so in
      // place rather than firing an error toast on every visit to the panel.
      if (/does not exist|schema cache/i.test(error.message)) {
        setNeedsMigration(true);
      } else {
        showToast('Erro ao carregar afiliados', error.message, 'error');
      }
    } else {
      setNeedsMigration(false);
      setRows((data as Affiliate[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    // Picking an account names the affiliate; the free field covers people who
    // sell for you without having signed up.
    const selected = users.find((u) => u.id === userId);
    const trimmedName = (selected?.email || name).trim();
    if (!trimmedName) {
      showToast('Escolha um usuário ou escreva um nome', '', 'error');
      return;
    }

    // At least one link, and every link given has to be a real checkout URL.
    if (!mensal.trim() && !vitalicio.trim()) {
      showToast('Cole pelo menos um link de checkout', 'Mensal ou vitalício.', 'error');
      return;
    }
    for (const [label, value] of [['mensal', mensal], ['vitalício', vitalicio]] as const) {
      if (!value.trim()) continue;
      const problem = checkoutUrlProblem(value);
      if (problem) {
        showToast(`Link ${label} inválido`, problem, 'error');
        return;
      }
    }

    setIsSaving(true);
    // The slug is random, so a collision is possible in principle; the unique
    // index catches it and we simply try another.
    let lastError = '';
    for (let attempt = 0; attempt < 5; attempt++) {
      const { error } = await supabase.from('affiliates').insert({
        slug: randomSlug(),
        name: trimmedName,
        user_id: userId || null,
        checkout_mensal: mensal.trim() || null,
        checkout_vitalicio: vitalicio.trim() || null,
      });
      if (!error) {
        setUserId('');
        setName('');
        setMensal('');
        setVitalicio('');
        showToast('Afiliado criado!', 'Copie o link e envie para ele.');
        setIsSaving(false);
        load();
        return;
      }
      lastError = error.message;
      if (!/duplicate|unique/i.test(error.message)) break;
    }
    setIsSaving(false);
    showToast('Erro ao criar afiliado', lastError, 'error');
  };

  const handleToggle = async (row: Affiliate) => {
    setBusyId(row.id);
    const { error } = await supabase
      .from('affiliates')
      .update({ active: !row.active, updated_at: new Date().toISOString() })
      .eq('id', row.id);
    setBusyId(null);
    if (error) {
      showToast('Erro ao atualizar', error.message, 'error');
      return;
    }
    showToast(row.active ? 'Afiliado desativado' : 'Afiliado reativado', row.name);
    load();
  };

  const handleDelete = async (row: Affiliate) => {
    setBusyId(row.id);
    const { error } = await supabase.from('affiliates').delete().eq('id', row.id);
    setBusyId(null);
    if (error) {
      showToast('Erro ao remover', error.message, 'error');
      return;
    }
    showToast('Afiliado removido', row.name);
    load();
  };

  const handleCopy = async (row: Affiliate) => {
    try {
      await navigator.clipboard.writeText(affiliateUrl(row.slug));
      setCopiedId(row.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      showToast('Não consegui copiar', 'Copie manualmente da lista.', 'error');
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all';

  return (
    <div className="space-y-5">
      {/* Create */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-950/70 border border-indigo-900 flex items-center justify-center text-indigo-400">
            <Users2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Afiliados</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cada afiliado ganha uma landing igual à original, com os links de checkout dele. O
              endereço é aleatório, então o visitante não percebe que é link de afiliado.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="aff-user" className="block text-xs font-bold text-slate-300 mb-1.5">
              Usuário
            </label>
            <select
              id="aff-user"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                if (e.target.value) setName('');
              }}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">— Não é usuário do app (escrever nome) —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="text-xs text-slate-500 mt-1.5">
                Nenhum usuário carregado. Use "Atualizar" no topo do painel.
              </p>
            )}
          </div>

          {!userId && (
            <div className="sm:col-span-2">
              <label htmlFor="aff-name" className="block text-xs font-bold text-slate-300 mb-1.5">
                Nome do afiliado
              </label>
              <input
                id="aff-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Josué"
                className={inputClass}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Link do checkout mensal
            </label>
            <input
              value={mensal}
              onChange={(e) => setMensal(e.target.value)}
              placeholder="https://checkout..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Link do checkout vitalício
            </label>
            <input
              value={vitalicio}
              onChange={(e) => setVitalicio(e.target.value)}
              placeholder="https://checkout..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-start gap-1.5 text-xs text-slate-500 max-w-md">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Use o link que o afiliado gerou na Applyfy ou na Cakto — é ele que carrega o código de
            comissão. Deixe em branco o plano que ele não vende.
          </p>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8126C2] to-[#9436D9] hover:shadow-[0_0_20px_rgba(129,38,194,0.45)] transition-all disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Criar afiliado
          </button>
        </div>
      </div>

      {needsMigration && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div className="text-xs text-amber-200 leading-relaxed">
            <strong className="font-bold">Falta rodar a migration.</strong> Abra o SQL Editor do
            Supabase e execute{' '}
            <code className="px-1 py-0.5 rounded bg-black/40">
              supabase/migrations/20260921000000_affiliates.sql
            </code>
            . Até lá as landings de afiliado caem nos seus próprios links de checkout.
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center text-slate-400 text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando…
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Nenhum afiliado cadastrado ainda.
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="px-5 py-4 border-b border-slate-800/60 last:border-0 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate">{row.name}</span>
                  {!row.active && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      Desativado
                    </span>
                  )}
                </div>
                <code className="block text-xs text-[#B65AF0] mt-0.5 truncate">
                  {affiliateUrl(row.slug)}
                </code>
                <p className="text-xs text-slate-500 mt-0.5">
                  {row.checkout_mensal ? 'mensal ✓' : 'mensal —'} ·{' '}
                  {row.checkout_vitalicio ? 'vitalício ✓' : 'vitalício —'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(row)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  {copiedId === row.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar link
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(row)}
                  disabled={busyId === row.id}
                  title={row.active ? 'Desativar' : 'Reativar'}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(row)}
                  disabled={busyId === row.id}
                  title="Remover"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AffiliatesPanel;
