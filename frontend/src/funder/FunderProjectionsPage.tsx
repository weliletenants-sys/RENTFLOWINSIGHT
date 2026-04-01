import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Wallet,
  ChevronDown,
  BarChart2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import FunderSidebar from './components/FunderSidebar';
import FunderDashboardHeader from './components/FunderDashboardHeader';
import FunderBottomNav from './components/FunderBottomNav';
import { getFunderDashboardStats, fundRentPool } from '../services/funderApi';
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

// ─── Custom Dropdown Component ───────────────────────────────────────────────
interface SelectOption {
  value: string;
  label: string;
}

// Custom select using a simulated blur delay to allow clicks to register
const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder,
  hasError = false
}: { 
  value: string, 
  onChange: (val: string) => void, 
  options: SelectOption[], 
  placeholder: string,
  hasError?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedObj = options.find((o) => o.value === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        onBlur={() => setIsOpen(false)}
        className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold bg-slate-50 border outline-none transition-all"
        style={{
          borderColor: hasError ? '#ef4444' : value ? 'var(--color-primary)' : '#e2e8f0',
          color: value ? '#1e293b' : hasError ? '#ef4444' : '#94a3b8',
        }}
      >
        <span>{selectedObj ? selectedObj.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${hasError && !value ? 'text-red-400' : 'text-slate-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full z-[9999] bg-white border rounded-xl shadow-xl overflow-y-auto max-h-60"
             style={{ borderColor: 'var(--color-primary-border)' }}>
          <div className="p-1.5 flex flex-col gap-1">
            {options.map((opt) => (
              <div
                key={opt.value}
                onMouseDown={(e) => { 
                  e.preventDefault(); 
                  onChange(opt.value); 
                  setIsOpen(false); 
                }}
                className="px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 cursor-pointer transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FunderProjectionsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const fetchWalletBalance = useCallback(async () => {
    try {
      const stats = await getFunderDashboardStats();
      setWalletBalance(stats.availableLiquid || 0);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      toast.error('Unable to verify wallet balance');
    }
  }, []);

  useEffect(() => {
    // Simple debounce to prevent rapid double-fetches
    const timeoutId = setTimeout(() => {
      fetchWalletBalance();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchWalletBalance]);

  const [params, setParams] = useState<Params>({
    principal: '',
    durationPreset: '',
    customMonths: '',
    payoutMode: '',
    targetApy: '',
  });

  const [simulated, setSimulated] = useState<Params>({ ...params });
  const [hasSimulated, setHasSimulated] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');

  // If user edits parameters, invalidate the previous simulation
  const handleSetParam = (key: keyof Params, val: string) => {
    setParams(prev => ({ ...prev, [key]: val }));
    if (hasSimulated) setHasSimulated(false);
    if (showErrors) setShowErrors(false);
  };

  const handleMainAction = () => {
    if (!hasSimulated) {
      // Validate inputs
      const isDurationValid = params.durationPreset === 'Custom' ? !!params.customMonths : !!params.durationPreset;
      if (!params.principal || !isDurationValid || !params.payoutMode || !params.targetApy) {
        setShowErrors(true);
        return;
      }
      
      setShowErrors(false);
      setSimulated({ ...params });
      setHasSimulated(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const loadingTexts = [
    "Getting ready...",
    "Adding to pool...",
    "Allocating capital...",
    "Almost done..."
  ];

  const simulateDeployment = async () => {
    if (!hasSufficientFunds || !portfolioName.trim()) return;

    setIsDeploying(true);
    setLoadingStep(0);

    const textInterval = setInterval(() => {
      setLoadingStep(prev => prev < loadingTexts.length - 1 ? prev + 1 : prev);
    }, 800);

    try {
      await fundRentPool({
        amount: inputPrincipal,
        duration_months: simulated.durationPreset === 'Custom' ? Number(simulated.customMonths) : parseInt(simulated.durationPreset),
        roi_mode: simulated.payoutMode,
        auto_renew: false,
        account_name: portfolioName.trim()
      });

      clearInterval(textInterval);
      setLoadingStep(loadingTexts.length - 1);
      
      setTimeout(() => {
        setIsDeploying(false);
        setIsSuccess(true);
        fetchWalletBalance();
      }, 500);

    } catch (error: any) {
      clearInterval(textInterval);
      setIsDeploying(false);
      closeModal();
      toast.error(error?.response?.data?.message || 'Failed to deploy capital. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      setPortfolioName('');
    }, 300); // Reset after closing animation
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
  const inputPrincipal = Math.max(0, Number(simulated.principal) || 0);
  const totalRewards   = last?.Rewards || 0;
  const totalYield    = simulated.payoutMode === 'monthly_compounding'
    ? (last?.Portfolio || 0)
    : (last?.Principal || 0) + (last?.Rewards || 0);

  const isCompounding = simulated.payoutMode === 'monthly_compounding';
  const isPayout      = simulated.payoutMode === 'monthly_payout';
  const hasSufficientFunds = walletBalance >= inputPrincipal;

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
      
      {/* ─── MODAL OVERLAY ──────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden relative" style={{ border: '1px solid var(--color-primary-border)' }}>
              
              {!isSuccess ? (
                <>
                  <div className="p-6 pb-0 flex items-center justify-between border-b border-slate-100 pb-4">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Confirm Deployment</h3>
                     <button onClick={closeModal} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <X className="w-4 h-4 text-slate-500" />
                     </button>
                  </div>

                  <div className="p-6 flex flex-col gap-6">
                     <div className="flex items-center justify-between gap-4 p-4 rounded-xl border" style={{ background: 'var(--color-primary-faint)', borderColor: 'var(--color-primary-light)' }}>
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Capital Output</span>
                            <span className="text-xl font-black text-slate-900">{fmt(inputPrincipal)}</span>
                         </div>
                         <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary-light)' }}>
                            <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                         </div>
                     </div>

                     <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5 mb-2">
                           <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Name Your Portfolio</label>
                           <input 
                              type="text" 
                              value={portfolioName}
                              onChange={(e) => setPortfolioName(e.target.value)}
                              placeholder="e.g. Retirement Goal 2026"
                              className="w-full rounded-xl px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border outline-none transition-all"
                              style={{ borderColor: portfolioName.trim() ? 'var(--color-primary)' : '#e2e8f0' }}
                              onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                              onBlur={e => e.currentTarget.style.borderColor = portfolioName.trim() ? 'var(--color-primary)' : '#e2e8f0'}
                           />
                        </div>

                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-slate-500">Duration</span>
                           <span className="text-xs font-black text-slate-900">{simulated.durationPreset === 'Custom' ? `${simulated.customMonths} Months` : simulated.durationPreset}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-slate-500">Target Strategy</span>
                           <span className="text-xs font-black text-slate-900">{simulated.targetApy}% / month</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-slate-500">Mode</span>
                           <span className="text-xs font-black text-slate-900">{isCompounding ? 'Compounding' : 'Liquid Payout'}</span>
                        </div>
                     </div>

                     {/* Wallet Balance Verification */}
                     <div className={`p-4 rounded-xl border flex flex-col gap-2 ${hasSufficientFunds ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-1.5">
                              {hasSufficientFunds ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                              <span className={`text-[11px] font-bold uppercase tracking-widest ${hasSufficientFunds ? 'text-emerald-700' : 'text-red-700'}`}>
                                 Wallet Balance
                              </span>
                           </div>
                           <span className={`text-sm font-black ${hasSufficientFunds ? 'text-emerald-900' : 'text-red-900'}`}>
                             {fmt(walletBalance)}
                           </span>
                        </div>
                        {!hasSufficientFunds && (
                           <p className="text-[10px] font-bold text-red-600 mt-1">
                              Insufficient funds to deploy this projection. Please deposit capital into your wallet first.
                           </p>
                        )}
                     </div>

                     <button 
                        onClick={simulateDeployment}
                        disabled={!hasSufficientFunds || isDeploying || !portfolioName.trim()}
                        className={`w-full h-[52px] rounded-xl text-xs uppercase font-black tracking-widest transition-all overflow-hidden flex items-center justify-center ${
                          !hasSufficientFunds || !portfolioName.trim()
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : isDeploying 
                            ? 'opacity-80 cursor-wait'
                            : 'hover:shadow-lg hover:scale-[0.98]'
                        }`}
                        style={hasSufficientFunds && portfolioName.trim() ? { background: 'var(--color-primary)', color: 'var(--color-on-primary)' } : {}}
                     >
                        {isDeploying ? (
                          <div className="flex items-center gap-2">
                             <Loader2 className="w-4 h-4 animate-spin" />
                             <div className="relative h-4 w-32 overflow-hidden flex flex-col justify-center">
                               <AnimatePresence mode="popLayout">
                                 <motion.span
                                    key={loadingStep}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute left-0 top-0 bottom-0 flex items-center"
                                 >
                                   {loadingTexts[loadingStep]}
                                 </motion.span>
                               </AnimatePresence>
                             </div>
                          </div>
                        ) : !portfolioName.trim() && hasSufficientFunds ? 'Enter Portfolio Name' : hasSufficientFunds ? 'Confirm Deployment' : 'Deposit First'}
                     </button>
                  </div>
                </>
              ) : (
                <div className="p-10 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
                   <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 mb-2">Capital Deployed</h3>
                   <p className="text-xs font-bold text-slate-500 mb-8 leading-relaxed">
                      Your projection of {fmt(inputPrincipal)} has been successfully deployed onto the Rent Management Pool.
                   </p>
                   <button 
                      onClick={closeModal}
                      className="w-full py-3 rounded-xl text-xs uppercase font-black tracking-widest bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                   >
                     Done
                   </button>
                </div>
              )}

           </div>
        </div>
      )}

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
            <div className="bg-white rounded-2xl border shadow-sm relative z-40"
                 style={{ borderColor: 'var(--color-primary-border)' }}>

              <div className="px-6 py-4 flex items-center gap-3 rounded-t-2xl"
                   style={{ background: 'var(--color-primary-light)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                     style={{ background: 'var(--color-primary)' }}>
                  <BarChart2 className="w-4 h-4" style={{ color: 'var(--color-on-primary)' }} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight">Investment Projection Engine</h2>
                  <p className="text-[11px] text-slate-500">Configure your inputs and lock your trajectory.</p>
                </div>
              </div>

              {/* Inputs row */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

                {/* Principal */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: showErrors && !params.principal ? '#ef4444' : 'var(--color-primary)' }}>
                    Initial Principal (UGX)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    placeholder="e.g. 5,000,000"
                    value={params.principal}
                    onChange={e => handleSetParam('principal', e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border outline-none transition-all"
                    style={{ borderColor: showErrors && !params.principal ? '#ef4444' : params.principal ? 'var(--color-primary)' : '#e2e8f0' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.currentTarget.style.borderColor = showErrors && !params.principal ? '#ef4444' : params.principal ? 'var(--color-primary)' : '#e2e8f0'}
                  />
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-1.5 relative z-30">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${showErrors && (!params.durationPreset && !params.customMonths) ? 'text-red-500' : ''}`} style={{ color: showErrors && (!params.durationPreset && !params.customMonths) ? '#ef4444' : 'var(--color-primary)' }}>
                    Investment Duration
                  </label>
                  {params.durationPreset === 'Custom' ? (
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        placeholder="# of months"
                        value={params.customMonths}
                        onChange={e => handleSetParam('customMonths', e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border outline-none"
                        style={{ borderColor: showErrors && !params.customMonths ? '#ef4444' : 'var(--color-primary)' }}
                      />
                      <button
                        onClick={() => { handleSetParam('durationPreset', ''); handleSetParam('customMonths', ''); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <X className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  ) : (
                    <CustomSelect 
                      value={params.durationPreset} 
                      onChange={(val) => handleSetParam('durationPreset', val)}
                      placeholder="Select Duration..."
                      hasError={showErrors && !params.durationPreset}
                      options={[
                        { value: '1 Year', label: '1 Year (12 months)' },
                        { value: '2 Years', label: '2 Years (24 months)' },
                        { value: '3 Years', label: '3 Years (36 months)' },
                        { value: 'Custom', label: 'Custom Length...' }
                      ]}
                    />
                  )}
                </div>

                {/* Payout Strategy */}
                <div className="flex flex-col gap-1.5 relative z-20">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${showErrors && !params.payoutMode ? 'text-red-500' : ''}`} style={{ color: showErrors && !params.payoutMode ? '#ef4444' : 'var(--color-primary)' }}>
                    Payout Strategy
                  </label>
                  <CustomSelect 
                      value={params.payoutMode} 
                      onChange={(val) => handleSetParam('payoutMode', val as any)}
                      placeholder="Select Strategy..."
                      hasError={showErrors && !params.payoutMode}
                      options={[
                        { value: 'monthly_compounding', label: 'Monthly Compounding' },
                        { value: 'monthly_payout', label: 'Monthly Cash Payout' },
                      ]}
                  />
                </div>

                {/* ROI Plan */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                    ROI Plan
                  </label>
                  <CustomSelect 
                      value={params.targetApy} 
                      onChange={(val) => handleSetParam('targetApy', val)}
                      placeholder="Select Plan..."
                      options={[
                        { value: '15', label: 'Standard — 15% / month' },
                        { value: '20', label: 'Premium — 20% / month' }
                      ]}
                  />
                </div>

                {/* DYNAMIC CTA BUTTON */}
                <button
                  onClick={handleMainAction}
                  className="w-full rounded-xl py-3 px-6 text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                  style={
                    !hasSimulated 
                      ? { background: 'var(--color-primary)', color: 'var(--color-on-primary)', boxShadow: '0 4px 14px var(--color-primary-shadow)' }
                      : { background: 'var(--color-success)', color: 'white', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }
                  }
                >
                  {hasSimulated && <CheckCircle2 className="w-4 h-4" />}
                  {!hasSimulated ? 'Calculate' : 'Deploy Capital'}
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
      <FunderBottomNav activePage="Projections" />
    </div>
  );
}
