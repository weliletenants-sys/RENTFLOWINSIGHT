import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Wallet,
  ChevronDown,
  BarChart2,
  X
} from 'lucide-react';
import FunderSidebar from './components/FunderSidebar';
import FunderDashboardHeader from './components/FunderDashboardHeader';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────
type PayoutMode = 'monthly_compounding' | 'monthly_payout' | '';
interface Params {
  principal: string;
  durationPreset: string;
  customMonths: string;
  payoutMode: PayoutMode;
  targetApy: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  v === 0 ? 'UGX 0' : `UGX ${Math.round(v).toLocaleString()}`;

const fmtM = (v: number) =>
  v >= 1_000_000
    ? `UGX ${(v / 1_000_000).toFixed(1)}M`
    : `UGX ${(v / 1_000).toFixed(0)}K`;

// ─── Component ───────────────────────────────────────────────────────────────
export default function FunderProjectionsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [params, setParams] = useState<Params>({
    principal: '',
    durationPreset: '',
    customMonths: '',
    payoutMode: '',
    targetApy: '',
  });

  const [simulated, setSimulated] = useState<Params>({
    principal: '',
    durationPreset: '',
    customMonths: '',
    payoutMode: '',
    targetApy: '',
  });

  const [hasSimulated, setHasSimulated] = useState(false);

  const handleCalculate = () => {
    setSimulated({ ...params });
    setHasSimulated(true);
  };

  // ── Derived math ────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const p = simulated;
    let months =
      p.durationPreset === 'Custom'  ? Math.max(1, Number(p.customMonths) || 12)
      : p.durationPreset === '1 Year' ? 12
      : p.durationPreset === '2 Years' ? 24
      : p.durationPreset === '3 Years' ? 36
      : 12;

    const capital = Math.max(0, Number(p.principal) || 0);
    const rate    = (Number(p.targetApy) || 0) / 100;
    let   balance = capital;
    let   cumRewards = 0;

    const data = [{
      month: 'Start',
      Portfolio: capital,
      Principal: capital,
      Rewards:   0,
    }];

    for (let m = 1; m <= months; m++) {
      const reward = balance * rate;
      if (p.payoutMode === 'monthly_compounding') {
        balance += reward;
        cumRewards += reward;
        data.push({
          month: `Mo ${m}`,
          Portfolio: Math.round(balance),
          Principal: Math.round(capital),
          Rewards:   Math.round(cumRewards),
        });
      } else {
        // monthly_payout — principal stays flat
        cumRewards += reward;
        data.push({
          month: `Mo ${m}`,
          Portfolio: Math.round(capital),
          Principal: Math.round(capital),
          Rewards:   Math.round(cumRewards),
        });
      }
    }
    return data;
  }, [simulated]);

  const last          = chartData[chartData.length - 1];
  const totalYield    = simulated.payoutMode === 'monthly_compounding'
    ? last.Portfolio
    : last.Principal + last.Rewards;
  const inputPrincipal = Math.max(0, Number(simulated.principal) || 0);
  const totalRewards   = last.Rewards;

  const isCompounding = simulated.payoutMode === 'monthly_compounding';
  const isPayout      = simulated.payoutMode === 'monthly_payout';

  // ─── Custom Tooltip ────────────────────────────────────────────────────────
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: '#fff',
        border: '1px solid var(--color-primary-border)',
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: '0 10px 30px var(--color-primary-shadow)',
      }}>
        <p style={{ color: '#64748b', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8 }}>
          {label}
        </p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: entry.color }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{fmt(entry.value)}</span>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{entry.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-primary-faint)' }}>
      <div className="flex h-screen overflow-hidden">

        <FunderSidebar
          activePage="Projections"
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-y-auto">

          <FunderDashboardHeader
            user={{ fullName: 'Grace N.', role: 'supporter', avatarUrl: '' }}
            pageTitle="Projections"
            onMenuClick={() => setMobileMenuOpen(true)}
            onAvatarClick={() => {}}
          />

          <main className="flex-1 px-4 sm:px-6 py-8 space-y-6 max-w-7xl mx-auto w-full">

            {/* ── CALCULATOR BAR ───────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                 style={{ borderColor: 'var(--color-primary-border)' }}>

              {/* Header band */}
              <div className="px-6 py-4 flex items-center gap-3"
                   style={{ background: 'var(--color-primary-light)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                     style={{ background: 'var(--color-primary)' }}>
                  <BarChart2 className="w-4 h-4" style={{ color: 'var(--color-on-primary)' }} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight">Investment Projection Engine</h2>
                  <p className="text-[11px] text-slate-500">Configure your inputs and hit Calculate to see your trajectory.</p>
                </div>
              </div>

              {/* Inputs row */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

                {/* Principal */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                    Initial Principal (UGX)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    placeholder="e.g. 5,000,000"
                    value={params.principal}
                    onChange={e => setParams({ ...params, principal: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border outline-none transition-all"
                    style={{
                      borderColor: params.principal ? 'var(--color-primary)' : '#e2e8f0',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.currentTarget.style.borderColor = params.principal ? 'var(--color-primary)' : '#e2e8f0'}
                  />
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                    Investment Duration
                  </label>
                  {params.durationPreset === 'Custom' ? (
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        placeholder="Number of months..."
                        value={params.customMonths}
                        onChange={e => setParams({ ...params, customMonths: e.target.value })}
                        className="w-full rounded-xl px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border outline-none"
                        style={{ borderColor: 'var(--color-primary)' }}
                      />
                      <button
                        onClick={() => setParams({ ...params, durationPreset: '', customMonths: '' })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <X className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={params.durationPreset}
                        onChange={e => setParams({ ...params, durationPreset: e.target.value })}
                        className="w-full rounded-xl px-4 py-3 text-sm font-bold bg-slate-50 border appearance-none outline-none transition-all"
                        style={{
                          borderColor: params.durationPreset ? 'var(--color-primary)' : '#e2e8f0',
                          color: params.durationPreset ? '#1e293b' : '#94a3b8',
                        }}
                      >
                        <option value="" disabled>Select Duration...</option>
                        <option value="1 Year">1 Year (12 months)</option>
                        <option value="2 Years">2 Years (24 months)</option>
                        <option value="3 Years">3 Years (36 months)</option>
                        <option value="Custom">Custom...</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Payout Strategy */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                    Payout Strategy
                  </label>
                  <div className="relative">
                    <select
                      value={params.payoutMode}
                      onChange={e => setParams({ ...params, payoutMode: e.target.value as PayoutMode })}
                      className="w-full rounded-xl px-4 py-3 text-sm font-bold bg-slate-50 border appearance-none outline-none transition-all"
                      style={{
                        borderColor: params.payoutMode ? 'var(--color-primary)' : '#e2e8f0',
                        color: params.payoutMode ? '#1e293b' : '#94a3b8',
                      }}
                    >
                      <option value="" disabled>Select Strategy...</option>
                      <option value="monthly_compounding">Monthly Compounding</option>
                      <option value="monthly_payout">Monthly Cash Payout</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* ROI Plan */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                    ROI Plan
                  </label>
                  <div className="relative">
                    <select
                      value={params.targetApy}
                      onChange={e => setParams({ ...params, targetApy: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm font-bold bg-slate-50 border appearance-none outline-none transition-all"
                      style={{
                        borderColor: params.targetApy ? 'var(--color-primary)' : '#e2e8f0',
                        color: params.targetApy ? '#1e293b' : '#94a3b8',
                      }}
                    >
                      <option value="" disabled>Select Plan...</option>
                      <option value="15">Standard — 15% / month</option>
                      <option value="20">Premium — 20% / month</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* CALCULATE CTA */}
                <button
                  onClick={handleCalculate}
                  className="w-full rounded-xl py-3 px-6 text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    boxShadow: '0 4px 14px var(--color-primary-shadow)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-dark)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
                >
                  Calculate
                </button>

              </div>
            </div>

            {/* ── RESULTS SECTION ──────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border shadow-sm mb-6"
                 style={{ borderColor: 'var(--color-primary-border)' }}>

              {/* Chart header */}
              <div className="px-6 pt-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {!hasSimulated
                      ? 'Configure your inputs above and hit Calculate'
                      : isPayout
                      ? 'Extracted Cash Flow vs. Locked Principal'
                      : 'Compounding Portfolio Growth Trajectory'}
                  </h3>
                  {hasSimulated && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isPayout
                        ? 'Your principal stays locked in the pool earning steady returns each month.'
                        : 'Rewards are automatically reinvested, accelerating returns over time.'}
                    </p>
                  )}
                </div>
                {hasSimulated && (
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--color-success)' }} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Principal</span>
                    </div>
                    {isCompounding && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--color-primary)' }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Portfolio Value</span>
                      </div>
                    )}
                    {isPayout && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--color-primary)' }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Cumulative Rewards</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CHART — fixed pixel height so it always renders */}
              <div className="px-2 pb-2" style={{ height: 380 }}>
                {!hasSimulated ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 opacity-40">
                    <BarChart2 className="w-16 h-16 text-slate-300" />
                    <p className="text-sm font-bold text-slate-400">Your projection graph will appear here</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradPortfolio" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6C11D4" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#6C11D4" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gradRewards" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6C11D4" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#6C11D4" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                        tickFormatter={fmtM}
                        dx={-4}
                        width={72}
                      />
                      <Tooltip content={<CustomTooltip />} />

                      {/* Compounding Mode */}
                      {isCompounding && <>
                        <Area
                          type="monotone"
                          dataKey="Principal"
                          name="Principal"
                          stroke="#10B981"
                          strokeWidth={2}
                          strokeDasharray="6 3"
                          fill="url(#gradPrincipal)"
                          dot={false}
                          activeDot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Portfolio"
                          name="Portfolio Value"
                          stroke="#6C11D4"
                          strokeWidth={3}
                          fill="url(#gradPortfolio)"
                          dot={false}
                          activeDot={{ r: 5, fill: '#6C11D4', stroke: '#fff', strokeWidth: 2 }}
                        />
                      </>}

                      {/* Monthly Payout Mode */}
                      {isPayout && <>
                        <Area
                          type="monotone"
                          dataKey="Principal"
                          name="Locked Principal"
                          stroke="#10B981"
                          strokeWidth={3}
                          fill="url(#gradPrincipal)"
                          dot={false}
                          activeDot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Rewards"
                          name="Cumulative Rewards"
                          stroke="#6C11D4"
                          strokeWidth={3}
                          fill="url(#gradRewards)"
                          dot={false}
                          activeDot={{ r: 5, fill: '#6C11D4', stroke: '#fff', strokeWidth: 2 }}
                        />
                      </>}

                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* ── SMALL STAT CARDS (Inside Graph Section) ───────────────── */}
              <div className="px-6 pb-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Principal Card */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-slate-50" style={{ borderColor: 'var(--color-primary-light)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                         style={{ background: 'var(--color-primary-light)' }}>
                      <Wallet className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Input Principal</p>
                      <p className="text-lg font-black tracking-tight text-slate-900 leading-tight">{fmt(inputPrincipal)}</p>
                    </div>
                  </div>

                  {/* Estimated Rewards Card */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-slate-50" style={{ borderColor: '#D1FAE5' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                         style={{ background: '#ECFDF5' }}>
                      <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Est. Rewards Earned</p>
                      <p className="text-lg font-black tracking-tight leading-tight" style={{ color: 'var(--color-success-dark)' }}>{fmt(totalRewards)}</p>
                    </div>
                  </div>

                  {/* Total Future Value Card */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ background: 'var(--color-primary-faint)', borderColor: 'var(--color-primary-light)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                         style={{ background: 'var(--color-primary)' }}>
                      <BarChart2 className="w-5 h-5" style={{ color: 'var(--color-on-primary)' }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Future Yield</p>
                      <p className="text-lg font-black tracking-tight text-slate-900 leading-tight">{fmt(totalYield)}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footnote */}
              <div className="mx-6 mb-6 rounded-xl p-4 flex items-start gap-3"
                   style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                     style={{ background: 'var(--color-primary)' }}>
                  <span className="text-white font-black text-[10px]">i</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-primary-dark)' }}>
                  Projections are based on <strong>Welile's Standard (15%) or Premium (20%) monthly ROI plans</strong>. In <strong>compounding mode</strong>, rewards are reinvested each cycle — portfolio value grows exponentially. In <strong>monthly payout mode</strong>, your principal stays locked in the pool and rewards are credited to your wallet each month. All values are indicative; actual returns are subject to a 30-day settlement cycle.
                </p>
              </div>

            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
