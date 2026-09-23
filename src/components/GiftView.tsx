import React, { useEffect, useMemo, useState } from 'react';
import {
  Gift,
  Bell,
  LayoutDashboard,
  SlidersHorizontal,
  Play,
  Plus,
  Trash2,
  Save,
  Eraser,
  RefreshCw,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Info,
  Lock,
} from 'lucide-react';
import { DEMO_DEFAULT_TICKET, DEMO_PERIODS } from '../data/giftCourse';
import { SalesNotificationStack, type SaleNotification } from './SalesNotificationStack';
import { useToast } from './Toast';

const STORAGE_KEY = 'hypeleads_demo_panel_v1';

interface DemoConfig {
  manual: Record<string, string>;
  sales: SaleNotification[];
  /** Ticket médio; a quantidade de vendas da dashboard é derivada dele. */
  ticket?: string;
}

const emptySale = (): SaleNotification => ({
  id: `sale_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  client: '',
  product: 'Nova Venda Detectada',
  value: 300,
  siteUrl: '',
  delaySeconds: 4,
  durationSeconds: 6,
});

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

const UNLOCK_DAYS = 6;

/**
 * Days left before the gift opens, or 0 once it is available.
 *
 * Reads the stored unlock moment rather than adding a fixed period to the grant
 * date: an admin grant opens immediately while a purchase waits six days, so
 * the two cannot be derived from the same timestamp.
 */
function daysUntilUnlock(unlocksAt: string | null): number {
  if (!unlocksAt) return UNLOCK_DAYS;
  const remainingMs = new Date(unlocksAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
}

interface GiftViewProps {
  giftUnlocksAt?: string | null;
  /** Demo mode: skip the countdown so the panel can actually be used. */
  previewUnlocked?: boolean;
}

export const GiftView: React.FC<GiftViewProps> = ({ giftUnlocksAt = null, previewUnlocked = false }) => {
  const { showToast } = useToast();
  const daysLeft = daysUntilUnlock(giftUnlocksAt);
  const isLocked = !previewUnlocked && daysLeft > 0;
  const [config, setConfig] = useState<DemoConfig>({ manual: {}, sales: [emptySale()], ticket: '' });
  const [queue, setQueue] = useState<SaleNotification[]>([]);

  // Demo settings are per-device preview state, so localStorage is enough.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConfig(JSON.parse(raw));
    } catch {
      /* preview starts from defaults */
    }
  }, []);

  const persist = (next: DemoConfig) => {
    setConfig(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota/private-mode errors */
    }
  };

  const valueFor = (key: string, auto: number) => {
    const manual = Number(config.manual[key]);
    return Number.isFinite(manual) && manual > 0 ? manual : auto;
  };

  const ticket = (() => {
    const typed = Number(config.ticket);
    return Number.isFinite(typed) && typed > 0 ? typed : DEMO_DEFAULT_TICKET;
  })();

  /** Same maths the dashboard runs, so the preview cannot disagree with it. */
  const salesFor = (key: string, auto: number) =>
    Math.max(1, Math.round(valueFor(key, auto) / ticket));

  const totals = useMemo(() => {
    const count = config.sales.length;
    const sum = config.sales.reduce((acc, s) => acc + (Number(s.value) || 0), 0);
    return { count, sum };
  }, [config.sales]);

  const dailyValue = valueFor('diario', DEMO_PERIODS[0].auto);

  const updateSale = (id: string, patch: Partial<SaleNotification>) =>
    setConfig((prev) => ({
      ...prev,
      sales: prev.sales.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));

  return (
    <div id="gift-container" className="relative max-w-5xl mx-auto">
      <SalesNotificationStack queue={queue} onFinished={() => setQueue([])} />

      <div
        className={`space-y-6 transition-all ${isLocked ? 'blur-[7px] select-none pointer-events-none' : ''}`}
        aria-hidden={isLocked}
      >


      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1C0D2A]/80 to-[#0d0813]/60 border border-[#25123A]">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-[#1C0D2A] border border-[#8126C2]/50 flex items-center justify-center">
            <Gift className="w-5 h-5 text-[#B65AF0]" />
          </div>
          <div>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#B65AF0]">
              Cortesia HypeLeads
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">Seu Presente</h2>
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
              Um curso completo para você sair do zero e fazer suas primeiras vendas no digital,
              sem custo nenhum.
            </p>
          </div>
        </div>
      </div>

      {/* Mockup control panel */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1C0D2A]/70 to-[#0d0813]/50 border border-[#25123A]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#1C0D2A] border border-[#8126C2]/50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#B65AF0]" />
            </div>
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#B65AF0]">
                Central de demonstração
              </span>
              <h3 className="text-lg font-extrabold text-white mt-0.5">
                Painel de notificações e valores
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                Monte as vendas de exemplo, veja o visual na hora e ajuste os números que aparecem na
                aba Dashboard.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setQueue(config.sales.map((s) => ({ ...s })))}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white hover:brightness-110 shadow-[0_0_18px_rgba(129,38,194,0.35)] transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            Testar fluxo
          </button>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-slate-500">
          <Info className="w-3 h-3 shrink-0" />
          Valores de exemplo, salvos só neste navegador. Seus dados reais ficam em Métricas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: dashboard values */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-[#B65AF0]" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">Dashboard de exemplo</h3>
                  <p className="text-[13px] text-slate-400">Veja como os números ficam antes de salvar.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => persist({ ...config, manual: {} })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Gerar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {DEMO_PERIODS.map((period) => {
                const isManual = Boolean(config.manual[period.key]);
                return (
                  <div key={period.key} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
                      {period.label}
                    </p>
                    <p className="text-lg font-extrabold text-white mt-1">
                      {brl(valueFor(period.key, period.auto))}
                    </p>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      {salesFor(period.key, period.auto)} vendas
                    </p>
                    <p className={`text-[12px] font-bold mt-0.5 ${isManual ? 'text-[#B65AF0]' : 'text-emerald-400'}`}>
                      {isManual ? 'Manual' : 'Automático'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5 mb-1">
              <SlidersHorizontal className="w-4 h-4 text-[#B65AF0]" />
              <h3 className="text-sm font-extrabold text-white">Valores manuais</h3>
            </div>
            <p className="text-[13px] text-slate-400 mb-3.5">
              Preencha só o período que quiser travar. Campo vazio usa o automático.
            </p>

            <div className="mb-4">
              <label
                htmlFor="demo-ticket"
                className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Ticket médio (R$)
              </label>
              <input
                id="demo-ticket"
                type="number"
                value={config.ticket || ''}
                onChange={(e) => setConfig((prev) => ({ ...prev, ticket: e.target.value }))}
                placeholder={String(DEMO_DEFAULT_TICKET)}
                className="w-full px-3 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <p className="text-[12px] text-slate-500 mt-1.5">
                A quantidade de vendas de cada período é calculada a partir dele: faturamento ÷
                ticket. Vazio usa {brl(DEMO_DEFAULT_TICKET)}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {DEMO_PERIODS.map((period) => (
                <div key={period.key}>
                  <label
                    htmlFor={`manual-${period.key}`}
                    className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"
                  >
                    {period.label}
                  </label>
                  <input
                    id={`manual-${period.key}`}
                    type="number"
                    value={config.manual[period.key] || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        manual: { ...prev.manual, [period.key]: e.target.value },
                      }))
                    }
                    placeholder="auto"
                    className="w-full px-3 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  persist(config);
                  showToast('Dashboard de exemplo salva!', 'Os valores ficam só neste navegador.');
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white hover:brightness-110 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                Salvar dashboard
              </button>
              <button
                type="button"
                onClick={() => persist({ ...config, manual: {} })}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Eraser className="w-3.5 h-3.5" />
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Right: notifications */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Bell className="w-4 h-4 text-[#B65AF0] mt-0.5" />
              <div>
                <h3 className="text-sm font-extrabold text-white">Notificações de exemplo</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  Cada card vira uma notificação empilhada, com fechamento automático.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-center">
                <p className="text-sm font-extrabold text-white leading-none">{totals.count}</p>
                <p className="text-[12px] uppercase tracking-wider text-slate-500 mt-0.5">Vendas</p>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-center">
                <p className="text-sm font-extrabold text-emerald-400 leading-none">{brl(totals.sum)}</p>
                <p className="text-[12px] uppercase tracking-wider text-slate-500 mt-0.5">Total</p>
              </div>
            </div>
          </div>

          {config.sales.map((sale, index) => (
            <div key={sale.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#B65AF0]">
                    Venda #{String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="text-[13px] text-slate-400">
                    {brl(Number(sale.value) || 0)} · atraso {sale.delaySeconds}s · dura {sale.durationSeconds || 6}s
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQueue([{ ...sale, delaySeconds: 0 }])}
                    title="Ver só esta"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-[#B65AF0] transition-colors"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      persist({ ...config, sales: config.sales.filter((s) => s.id !== sale.id) })
                    }
                    title="Remover"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1">Cliente</label>
                  <input
                    value={sale.client}
                    onChange={(e) => updateSale(sale.id, { client: e.target.value })}
                    placeholder="Ex: João Silva"
                    className="w-full px-2.5 py-1.5 text-[13px] bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1">Produto</label>
                  <input
                    value={sale.product}
                    onChange={(e) => updateSale(sale.id, { product: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-[13px] bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1">Valor</label>
                  <input
                    type="number"
                    value={sale.value}
                    onChange={(e) => updateSale(sale.id, { value: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-[13px] bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1">Atraso (segundos)</label>
                  <input
                    type="number"
                    min={0}
                    value={sale.delaySeconds}
                    onChange={(e) => updateSale(sale.id, { delaySeconds: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-[13px] bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1">
                    Fica na tela (segundos)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={sale.durationSeconds ?? 6}
                    onChange={(e) => updateSale(sale.id, { durationSeconds: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-[13px] bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] text-slate-500 mb-1">Link do site (opcional)</label>
                <input
                  value={sale.siteUrl}
                  onChange={(e) => updateSale(sale.id, { siteUrl: e.target.value })}
                  placeholder="https://exemplo.lovable.app/"
                  className="w-full px-2.5 py-1.5 text-[13px] bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => persist({ ...config, sales: [...config.sales, emptySale()] })}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-[#8126C2] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar notificação
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                persist(config);
                showToast('Notificações de exemplo salvas!');
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white hover:brightness-110 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar notificações
            </button>
            <button
              type="button"
              onClick={() => setQueue(config.sales.map((s) => ({ ...s })))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Prévia
            </button>
          </div>
        </div>
      </div>

      </div>

      {/* Lock overlay: sits above the whole blurred tab until the unlock date */}
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 py-10 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#1C0D2A] border border-[#8126C2]/60 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-[#B65AF0]" />
          </div>
          <p className="text-xl font-extrabold text-white">
            Seu presente abre em {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}
          </p>
          <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
            Estamos preparando um curso completo para você sair do zero e fazer suas primeiras
            vendas no digital. Continue prospectando — quando o contador zerar, ele aparece aqui
            liberado, sem custo nenhum.
          </p>
        </div>
      )}

    </div>
  );
};
