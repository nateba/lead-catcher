import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  Users,
  Sparkles,
  CheckCircle2,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  ArrowUpRight,
  Calculator,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { SavedLead } from '../types';

interface MetricsDashboardProps {
  savedLeads: SavedLead[];
  totalSearchedCount: number;
}

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

function getDaysSince(dateString: string): number {
  if (!dateString) return 0;
  const d = new Date(dateString).getTime();
  if (isNaN(d)) return 0;
  return Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  savedLeads,
  totalSearchedCount,
}) => {
  const [avgTicketPrice, setAvgTicketPrice] = useState(1500);

  const stats = useMemo(() => {
    const totalSaved = savedLeads.length;
    const totalGenerated = savedLeads.filter(
      (l) => l.siteData && l.siteData.headline
    ).length;

    const readyContact = savedLeads.filter(
      (l) => l.status === 'PRONTO_CONTATO' || l.status === 'MENSAGEM_ENVIADA' || l.status === 'RESPONDEU' || l.status === 'NEGOCIACAO' || l.status === 'REUNIAO_MARCADA' || l.status === 'FECHADO'
    ).length;

    const sent = savedLeads.filter(
      (l) =>
        l.status === 'MENSAGEM_ENVIADA' ||
        l.status === 'RESPONDEU' ||
        l.status === 'NEGOCIACAO' ||
        l.status === 'REUNIAO_MARCADA' ||
        l.status === 'FECHADO'
    ).length;

    const replied = savedLeads.filter(
      (l) =>
        l.status === 'RESPONDEU' ||
        l.status === 'NEGOCIACAO' ||
        l.status === 'REUNIAO_MARCADA' ||
        l.status === 'FECHADO'
    ).length;

    const inNegotiation = savedLeads.filter(
      (l) => l.status === 'NEGOCIACAO' || l.status === 'REUNIAO_MARCADA' || l.status === 'FECHADO'
    ).length;

    const meetings = savedLeads.filter(
      (l) => l.status === 'REUNIAO_MARCADA' || l.status === 'FECHADO'
    ).length;

    const closedLeads = savedLeads.filter((l) => l.status === 'FECHADO');
    const closed = closedLeads.length;

    // Calculate actual real revenue from closed leads with fallback
    const totalRevenue = closedLeads.reduce((acc, curr) => {
      return acc + (curr.dealValue !== undefined ? curr.dealValue : avgTicketPrice);
    }, 0);

    // Leads parados sem atualização há mais de 5 dias
    const staleLeads = savedLeads.filter((l) => {
      const days = getDaysSince(l.updatedAt || l.generatedAt);
      return days >= 5 && l.status !== 'FECHADO' && l.status !== 'PERDIDO' && l.status !== 'RECUSADO';
    }).length;

    // Follow-ups atrasados
    const overdueFollowUps = savedLeads.filter((l) => {
      return (
        l.followUp &&
        !l.followUp.completed &&
        new Date(l.followUp.date).getTime() < new Date().setHours(0, 0, 0, 0)
      );
    }).length;

    const conversionRate =
      totalSaved > 0 ? ((closed / totalSaved) * 100).toFixed(1) : '0';
    const pipelinePotential =
      (totalSaved - closed) * avgTicketPrice * 0.2; // 20% estimated conversion

    // 8-Stage Sales Funnel Data
    const funnelData = [
      { stage: '1. Salvo', count: totalSaved, fill: '#64748b' },
      { stage: '2. Site Gerado', count: totalGenerated, fill: '#4f46e5' },
      { stage: '3. Pronto Contato', count: readyContact, fill: '#06b6d4' },
      { stage: '4. Msg Enviada', count: sent, fill: '#0284c7' },
      { stage: '5. Respondeu', count: replied, fill: '#f59e0b' },
      { stage: '6. Negociação', count: inNegotiation, fill: '#ea580c' },
      { stage: '7. Reunião', count: meetings, fill: '#9333ea' },
      { stage: '8. Fechado', count: closed, fill: '#10b981' },
    ];

    // Category Distribution
    const catMap: Record<string, number> = {};
    savedLeads.forEach((l) => {
      const cat = l.lead.categoryLabel || 'Outros';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const categoryData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // City Distribution Ranking
    const cityMap: Record<string, number> = {};
    savedLeads.forEach((l) => {
      const city = `${l.lead.city || 'Outra'} (${l.lead.state || 'UF'})`;
      cityMap[city] = (cityMap[city] || 0) + 1;
    });
    const cityRanking = Object.entries(cityMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Time series (by day of generation)
    const dateMap: Record<string, number> = {};
    savedLeads.forEach((l) => {
      const dateStr = l.generatedAt
        ? new Date(l.generatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        : 'Hoje';
      dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
    });

    const timeSeriesData = Object.entries(dateMap).map(([date, total]) => ({
      date,
      total,
    }));

    if (timeSeriesData.length === 0) {
      timeSeriesData.push({ date: 'Hoje', total: 0 });
    }

    return {
      totalSaved,
      totalGenerated,
      sent,
      replied,
      meetings,
      closed,
      staleLeads,
      overdueFollowUps,
      conversionRate,
      totalRevenue,
      pipelinePotential,
      funnelData,
      categoryData,
      cityRanking,
      timeSeriesData,
    };
  }, [savedLeads, avgTicketPrice]);

  return (
    <div id="metrics-dashboard-section" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Painel de Desempenho Comercial & ROI
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {stats.closed} vendas fechadas
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Métricas de prospecção, taxa de conversão do funil e projeção de receita do seu SaaS.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total de Leads Encontrados / Salvos */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Leads no CRM
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalSaved}
            </h3>
          </div>
        </div>

        {/* 2. Sites Gerados com IA */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Sites Gerados com IA
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalGenerated}
            </h3>
          </div>
        </div>

        {/* 3. Taxa de Conversão */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Taxa de Conversão
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.conversionRate}%
            </h3>
          </div>
        </div>

        {/* 4. Leads Parados ou Atrasados */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Parados / Atrasados
            </p>
            <h3 className={`text-2xl font-extrabold ${stats.staleLeads + stats.overdueFollowUps > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              {stats.staleLeads} <span className="text-xs font-normal text-slate-400">({stats.overdueFollowUps} follow-ups)</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Main Charts: Funnel & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funnel Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Funil Completo de Conversão Comercial (8 Etapas)
            </h3>
            <p className="text-xs text-slate-400">Etapas desde a descoberta no radar até o fechamento do contrato</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" stroke="#94a3b8" fontSize={9} interval={0} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-500" />
              Nichos Mais Prospectados
            </h3>
            <p className="text-xs text-slate-400">Distribuição por segmento de negócio</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {stats.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 italic">Sem dados suficientes no CRM</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: City Ranking & Time Series Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* City Ranking */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              Cidades Mais Prospectadas (Ranking)
            </h3>
            <p className="text-xs text-slate-400">Regiões com maior volume de negócios salvos</p>
          </div>

          <div className="space-y-3 pt-1">
            {stats.cityRanking.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-8 text-center">Nenhum lead com cidade salva ainda</p>
            ) : (
              stats.cityRanking.map((item, idx) => {
                const maxCount = stats.cityRanking[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);

                return (
                  <div key={item.city} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {item.city}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {item.count} {item.count === 1 ? 'lead' : 'leads'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Time Series Area Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Geração de Leads ao Longo do Tempo
            </h3>
            <p className="text-xs text-slate-400">Atividade diária de prospecção e sites gerados</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROI & Price Simulator Card */}
      <div className="p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Simulador de Faturamento da Agência</h3>
              <p className="text-xs text-indigo-200">
                Ajuste seu ticket médio por site criado para calcular o potencial financeiro.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
            <span className="text-xs text-indigo-200 font-medium">Ticket Médio por Projeto:</span>
            <span className="text-sm font-extrabold text-amber-300">
              R$ {avgTicketPrice.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="500"
            max="4000"
            step="100"
            value={avgTicketPrice}
            onChange={(e) => setAvgTicketPrice(Number(e.target.value))}
            className="w-full h-2 bg-indigo-950 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
          <div className="flex justify-between text-[11px] text-indigo-300">
            <span>R$ 500 (Básico)</span>
            <span>R$ 1.500 (Padrão de Mercado)</span>
            <span>R$ 4.000 (Site + Gestão Mensal)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-[11px] text-indigo-200">Faturamento Já Realizado ({stats.closed} vendas)</p>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
              R$ {stats.totalRevenue.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-[11px] text-indigo-200">Potencial Estimado em Pipeline</p>
            <p className="text-xl font-extrabold text-amber-300 mt-0.5">
              R$ {Math.round(stats.pipelinePotential).toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-[11px] text-indigo-200">Custo Operacional de API</p>
            <p className="text-xl font-extrabold text-white mt-0.5">
              R$ 0,00 (100% Gratuito)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
