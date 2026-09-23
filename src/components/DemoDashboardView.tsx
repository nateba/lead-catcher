import React, { useEffect, useState } from 'react';
import { LayoutDashboard, DollarSign, TrendingUp, ShoppingBag, Layers, CheckCircle2, Activity } from 'lucide-react';
import { DEMO_DEFAULT_TICKET, DEMO_PERIODS, DEMO_PAYMENT_METHODS } from '../data/giftCourse';
import { ScrollReveal } from './ScrollReveal';

const STORAGE_KEY = 'hypeleads_demo_panel_v1';

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

export const DemoDashboardView: React.FC = () => {
  const [manual, setManual] = useState<Record<string, string>>({});
  const [ticketInput, setTicketInput] = useState('');
  const [period, setPeriod] = useState(DEMO_PERIODS[0].key);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setManual(parsed.manual || {});
        setTicketInput(parsed.ticket || '');
      }
    } catch {
      /* falls back to the reference figures */
    }
  }, []);

  const active = DEMO_PERIODS.find((p) => p.key === period) || DEMO_PERIODS[0];
  const manualValue = Number(manual[active.key]);
  const isManual = Number.isFinite(manualValue) && manualValue > 0;
  const revenue = isManual ? manualValue : active.auto;

  // The ticket is what gets configured; the quantity follows from it. Deriving
  // it this way keeps revenue, sales and unit price consistent at every period,
  // which is the first thing that gives a made-up dashboard away.
  const typedTicket = Number(ticketInput);
  const ticket = Number.isFinite(typedTicket) && typedTicket > 0 ? typedTicket : DEMO_DEFAULT_TICKET;
  const sales = Math.max(1, Math.round(revenue / ticket));
  const unitPrice = revenue / sales;

  return (
    <div id="demo-dashboard-container" className="max-w-6xl mx-auto space-y-5">
      <ScrollReveal direction="up" className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#B65AF0]">
            Resultados em tempo real
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1">Registre e acompanhe todas as suas vendas.</p>
        </div>
      </ScrollReveal>

      {/* Period filter */}
      <div className="inline-flex p-1 rounded-xl bg-slate-800/60 border border-slate-700 gap-1 flex-wrap">
        {DEMO_PERIODS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPeriod(p.key)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all ${period === p.key
              ? 'bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white shadow-[0_0_14px_rgba(129,38,194,0.4)]'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Revenue + side cards */}
      <ScrollReveal direction="up" delay={120} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
            <DollarSign className="w-3 h-3" /> Receita (pago)
          </p>
          <p className="text-4xl font-extrabold text-white mt-2">{brl(revenue)}</p>

          <div className="mt-5 h-32 flex items-end gap-1.5">
            {[38, 44, 40, 52, 47, 61, 56, 70, 66, 82, 74, 88, 80, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-[#8126C2]/30 to-[#B65AF0] transition-all"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[12px] text-slate-500 mt-2">
            <span>00h</span>
            <span>12h</span>
            <span>22h</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
              <TrendingUp className="w-3 h-3" /> Pendente
            </p>
            <p className="text-2xl font-extrabold text-white mt-1.5">{brl(0)}</p>
            <div className="mt-3 h-1 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-[#8126C2] to-[#B65AF0]" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
              <ShoppingBag className="w-3 h-3" /> Total de vendas
            </p>
            <p className="text-2xl font-extrabold text-white mt-1.5">{sales}</p>
            <div className="mt-3 flex items-end gap-1 h-8">
              {[40, 55, 48, 70, 62, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-[#8126C2]/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Payment methods */}
      <ScrollReveal direction="up" delay={240} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-3 px-5 py-3 border-b border-slate-800 text-[12px] font-bold uppercase tracking-wider text-slate-500">
          <span>Meios de pagamento</span>
          <span className="text-center">Conversão</span>
          <span className="text-right">Valor</span>
        </div>
        {DEMO_PAYMENT_METHODS.map((method) => (
          <div
            key={method.name}
            className="grid grid-cols-3 px-5 py-3 border-b border-slate-800/60 last:border-0 text-xs"
          >
            <span className="text-slate-300 font-medium">{method.name}</span>
            <span className="text-center text-slate-400">{method.share.toFixed(1)}%</span>
            <span className="text-right text-white font-bold">
              {brl((revenue * method.share) / 100)}
            </span>
          </div>
        ))}
      </ScrollReveal>

      {/* Bottom stats */}
      <ScrollReveal direction="up" delay={360} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          // Derived from the period too: a fixed 63 next to 362 sales reads as broken.
          { icon: Layers, value: String(sales + 2), label: 'Estruturas' },
          { icon: CheckCircle2, value: String(sales), label: 'Finalizadas' },
          { icon: Activity, value: '2', label: 'Em andamento' },
          { icon: DollarSign, value: brl(unitPrice), label: 'Preço unitário' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center mb-2.5">
                <Icon className="w-3.5 h-3.5 text-[#B65AF0]" />
              </div>
              <p className="text-xl font-extrabold text-white">{stat.value}</p>
              <p className="text-[12px] uppercase tracking-wider text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </ScrollReveal>
    </div>
  );
};
