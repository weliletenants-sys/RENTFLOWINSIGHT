import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  TrendingUp,
  DollarSign,
  Target,
  Filter,
  ChevronLeft,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
  CheckCircle2,
} from 'lucide-react';

/* ═══════════ TYPES ═══════════ */

type PortfolioStatus = 'active' | 'pending' | 'pending_approval' | 'cancelled';
type RoiMode = 'monthly_payout' | 'monthly_compounding';
type PaymentHealth = 'green' | 'yellow' | 'red';

interface VirtualHouse {
  id: string;
  rentAmount: number;
  fundingDate: string;
  portfolioCode: string;
  paymentHealth: PaymentHealth;
}

interface PortfolioAccount {
  id: string;
  portfolioCode: string;
  investmentAmount: number;
  roiPercentage: number;
  roiMode: RoiMode;
  durationMonths: number;
  status: PortfolioStatus;
  nextRoiDate?: string;
  maturityDate: string;
  totalRoiEarned: number;
  createdDate: string;
  expectedAmount: number;
  virtualHouses: VirtualHouse[];
  portfolioName?: string;
  todayGrowth?: number;
}

/* ═══════════ STATUS CONFIG ═══════════ */

const statusConfig: Record<PortfolioStatus, { label: string; bg: string; text: string }> = {
  active:           { label: 'Active',           bg: 'bg-green-50',  text: 'text-green-700' },
  pending:          { label: 'Pending',          bg: 'bg-orange-50', text: 'text-orange-700' },
  pending_approval: { label: 'Pending Approval', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  cancelled:        { label: 'Cancelled',        bg: 'bg-red-50',    text: 'text-red-600' },
};



/* ═══════════ MOCK DATA ═══════════ */

const MOCK_PORTFOLIOS: PortfolioAccount[] = [
  {
    id: '1',
    portfolioCode: 'WPF-7291',
    portfolioName: 'Retirement Wealth Build',
    todayGrowth: 45000,
    investmentAmount: 2_500_000,
    roiPercentage: 15,
    roiMode: 'monthly_payout',
    durationMonths: 12,
    status: 'active',
    nextRoiDate: '11 Apr 2026',
    maturityDate: 'Mar 12, 2027',
    totalRoiEarned: 462_500,
    createdDate: 'Mar 12, 2026',
    expectedAmount: 2_962_500,
    virtualHouses: [
      { id: 'vh1', rentAmount: 500_000, fundingDate: 'Mar 14, 2026', portfolioCode: 'WPF-7291', paymentHealth: 'green' },
      { id: 'vh2', rentAmount: 800_000, fundingDate: 'Mar 16, 2026', portfolioCode: 'WPF-7291', paymentHealth: 'green' },
      { id: 'vh3', rentAmount: 350_000, fundingDate: 'Mar 18, 2026', portfolioCode: 'WPF-7291', paymentHealth: 'yellow' },
    ],
  },
  {
    id: '2',
    portfolioCode: 'WPF-4103',
    portfolioName: 'Kids University Fund',
    todayGrowth: 12000,
    investmentAmount: 5_000_000,
    roiPercentage: 20,
    roiMode: 'monthly_compounding',
    durationMonths: 24,
    status: 'active',
    nextRoiDate: '20 Apr 2026',
    maturityDate: 'Feb 20, 2028',
    totalRoiEarned: 1_000_000,
    createdDate: 'Feb 20, 2026',
    expectedAmount: 6_000_000,
    virtualHouses: [
      { id: 'vh4', rentAmount: 1_200_000, fundingDate: 'Feb 22, 2026', portfolioCode: 'WPF-4103', paymentHealth: 'green' },
      { id: 'vh5', rentAmount: 400_000, fundingDate: 'Feb 25, 2026', portfolioCode: 'WPF-4103', paymentHealth: 'red' },
      { id: 'vh6', rentAmount: 600_000, fundingDate: 'Mar 01, 2026', portfolioCode: 'WPF-4103', paymentHealth: 'green' },
      { id: 'vh7', rentAmount: 900_000, fundingDate: 'Mar 05, 2026', portfolioCode: 'WPF-4103', paymentHealth: 'green' },
    ],
  },
  {
    id: '3',
    portfolioCode: 'WPF-8856',
    portfolioName: 'High Yield Income',
    todayGrowth: 0,
    investmentAmount: 1_200_000,
    roiPercentage: 15,
    roiMode: 'monthly_payout',
    durationMonths: 12,
    status: 'pending_approval',
    nextRoiDate: undefined,
    maturityDate: 'Mar 10, 2027',
    totalRoiEarned: 0,
    createdDate: 'Mar 10, 2026',
    expectedAmount: 1_200_000,
    virtualHouses: [],
  },
  {
    id: '4',
    portfolioCode: 'WPF-3312',
    portfolioName: 'Secondary Income Stream',
    todayGrowth: -15000,
    investmentAmount: 3_800_000,
    roiPercentage: 20,
    roiMode: 'monthly_payout',
    durationMonths: 18,
    status: 'active',
    nextRoiDate: '01 Apr 2026',
    maturityDate: 'Jun 01, 2027',
    totalRoiEarned: 760_000,
    createdDate: 'Dec 01, 2025',
    expectedAmount: 4_560_000,
    virtualHouses: [
      { id: 'vh8', rentAmount: 700_000, fundingDate: 'Dec 05, 2025', portfolioCode: 'WPF-3312', paymentHealth: 'green' },
      { id: 'vh9', rentAmount: 450_000, fundingDate: 'Dec 10, 2025', portfolioCode: 'WPF-3312', paymentHealth: 'yellow' },
    ],
  },
  {
    id: '5',
    portfolioCode: 'WPF-9901',
    portfolioName: 'Passive Yield Vault',
    todayGrowth: 0,
    investmentAmount: 1_500_000,
    roiPercentage: 15,
    roiMode: 'monthly_compounding',
    durationMonths: 12,
    status: 'cancelled',
    nextRoiDate: undefined,
    maturityDate: 'Dec 30, 2027',
    totalRoiEarned: 0,
    createdDate: 'Mar 05, 2026',
    expectedAmount: 1_500_000,
    virtualHouses: [],
  },
];

/* ═══════════ FILTER TYPE ═══════════ */
type FilterStatus = 'all' | PortfolioStatus;

/* ═══════════ PROPS ═══════════ */
interface FunderPortfolioPageProps {
  onAddPortfolio?: () => void;
  walletBalance?: number;
}

/* ═══════════════════════════════════════════════════════ */
/*               MAIN COMPONENT                           */
/* ═══════════════════════════════════════════════════════ */
export default function FunderPortfolioPage({ onAddPortfolio, walletBalance = 2_500_000 }: FunderPortfolioPageProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const portfolios = MOCK_PORTFOLIOS;
  const filtered = filter === 'all' ? portfolios : portfolios.filter((p) => p.status === filter);

  /* ── summary stats ── */
  const totalInvested = portfolios.reduce((s, p) => s + p.investmentAmount, 0);
  const totalEarned   = portfolios.reduce((s, p) => s + p.totalRoiEarned, 0);
  const avgRoi        = portfolios.length
    ? Math.round(portfolios.reduce((s, p) => s + p.roiPercentage, 0) / portfolios.length)
    : 0;



  /* ══════════════  MAIN PORTFOLIO LIST VIEW  ══════════════ */
  return (
    <>
    <div className="flex-1 p-6 lg:p-8 pb-32 lg:pb-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Portfolio</h1>
        <p className="text-sm text-slate-500 mt-1">Track and manage your investment accounts in the Rent Management Pool</p>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 space-y-4">
        {/* ROW 1: PRIMARY - Current Portfolio Value */}
        <div className="bg-gradient-to-br from-[#1E144B] to-[#451C81] rounded-[24px] p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-50" style={{ background: 'var(--color-primary)' }} />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-30" />
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2">Current Portfolio Value</p>
              <div className="flex items-end gap-3 flex-wrap">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight">UGX {(totalInvested + totalEarned).toLocaleString()}</h2>
                {avgRoi > 0 && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 mb-1.5 lg:mb-2">
                    <TrendingUp className="w-3.5 h-3.5" /> +{avgRoi}% ROI
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-white/50 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Updated in real-time
            </div>
          </div>
        </div>

        {/* ROW 2: SECONDARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] border border-slate-100 p-5 lg:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Invested</p>
            <p className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">UGX {totalInvested.toLocaleString()}</p>
          </div>
          
          <div className="bg-emerald-50 rounded-[24px] border border-emerald-100 p-5 lg:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Profit Earned</p>
            <p className="text-xl lg:text-2xl font-black text-emerald-700 tracking-tight">UGX {totalEarned.toLocaleString()}</p>
          </div>
        </div>


      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {(['all', 'active', 'pending', 'pending_approval', 'cancelled'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
              style={filter === f ? { background: 'var(--color-primary)', boxShadow: '0 4px 12px var(--color-primary-shadow)' } : undefined}
            >
              {f === 'all' ? 'All' : f === 'pending_approval' ? 'Pending Approval' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:shadow-lg active:scale-[0.97]"
          style={{ background: 'var(--color-primary)', boxShadow: '0 4px 12px var(--color-primary-shadow)' }}
        >
          <Plus className="w-4 h-4" />
          Add New Portfolio
        </button>
      </div>

      {/* Portfolio Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-500 mb-2">No portfolios found</h3>
          <p className="text-sm text-slate-400 mb-6">No portfolios match the selected filter.</p>
          <button onClick={() => setFilter('all')} className="px-6 py-2 rounded-xl text-sm font-bold border-2 transition-all hover:shadow-md" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
            Show All
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((p, idx) => {
            const sts = statusConfig[p.status];
            const currentValue = p.investmentAmount + p.totalRoiEarned;
            const growth = p.todayGrowth || 0;
            const isGrowthPositive = growth > 0;
            const isGrowthNegative = growth < 0;

            const MOCK_IMAGES = [
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400&h=400', // Modern Architecture
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400&h=400', // House
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400&h=400', // Mansion
              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400&h=400', // Corporate Building
              'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=400&h=400', // Real Estate
            ];
            const imgUrl = MOCK_IMAGES[idx % MOCK_IMAGES.length];

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/funder/portfolio/${p.portfolioCode}`)}
                className="bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer group flex flex-col p-5 sm:flex-row sm:items-center justify-between sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8"
              >
                {/* Header: Identity */}
                <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 min-w-0 flex-1">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden flex-shrink-0 relative group-hover:shadow-md transition-shadow">
                    <img src={imgUrl} alt={p.portfolioName || 'Portfolio'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-slate-900 text-base sm:text-xl lg:text-2xl group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-tight">
                      {p.portfolioName || `Portfolio ${p.portfolioCode}`}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 shrink-0">
                        {p.portfolioCode}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.status === 'active' ? 'bg-green-500' :
                          p.status === 'pending' ? 'bg-orange-500' :
                          p.status === 'pending_approval' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest">{sts.label}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block shrink-0" />
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-400 hidden sm:block truncate">
                        Pool Contribution: UGX {p.investmentAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Separator on mobile */}
                <div className="w-full h-px bg-slate-50 my-1 sm:hidden shrink-0" />

                {/* Footer: Value & Performance */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">Total Value</p>
                    <p className="font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 tracking-tight">
                      UGX {currentValue.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-sm font-bold shrink-0 ${
                    isGrowthPositive
                      ? 'bg-emerald-50 text-emerald-600'
                      : isGrowthNegative
                      ? 'bg-red-50 text-red-600'
                      : 'bg-slate-50 text-slate-500'
                  }`}>
                    {isGrowthPositive ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : isGrowthNegative ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" style={{ transform: 'scaleY(-1)' }} />
                    ) : (
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-400 mx-1" />
                    )}
                    {isGrowthPositive ? '+' : isGrowthNegative ? '-' : ''}UGX {Math.abs(growth).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Portfolio Card */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4 text-left hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-faint)] transition-all group cursor-pointer"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 flex-shrink-0"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-base text-slate-700 group-hover:text-[var(--color-primary)] transition-colors">
                Add New Portfolio
              </p>
              <p className="text-xs text-slate-400 mt-0.5 border-none">
                Fund a new rent pool to start generating passive income.
              </p>
            </div>
          </button>
        </div>
      )}
    </div>

      {showAddModal && (
        <AddPortfolioModal
          walletBalance={walletBalance}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            onAddPortfolio?.();
          }}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*      ADD PORTFOLIO MODAL — Multi-Step Flow             */
/* ═══════════════════════════════════════════════════════ */

interface AddPortfolioModalProps {
  walletBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

type ModalStep = 'details' | 'payment' | 'success';
type PaymentMethod = 'wallet' | 'mobile_money' | 'bank';

function AddPortfolioModal({ walletBalance, onClose, onSuccess }: AddPortfolioModalProps) {
  const [step, setStep] = useState<ModalStep>('details');
  const [portfolioName, setPortfolioName] = useState('');
  const [amount, setAmount] = useState('');
  const [roiMode, setRoiMode] = useState<RoiMode>('monthly_payout');
  const [duration, setDuration] = useState<12 | 18 | 24>(12);
  const [autoRenew, setAutoRenew] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numAmount = parseInt(amount.replace(/,/g, ''), 10) || 0;
  const roiRate = duration >= 18 ? 20 : 15;
  const monthlyReturn = numAmount * (roiRate / 100);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val) {
      let num = parseInt(val, 10);
      if (num > walletBalance) {
        num = walletBalance;
      }
      setAmount(num.toLocaleString());
    } else {
      setAmount('');
    }
  };

  const portfolioCode = `WPF-${Math.floor(1000 + Math.random() * 9000)}`;

  const canProceedStep1 = portfolioName.trim().length > 0 && numAmount > 0;

  // No auto-matching houses as all funds go directly to the central Rent Management Pool

  const handlePaymentSubmit = () => {
    if (paymentMethod === 'wallet' && numAmount > walletBalance) return;
    if (paymentMethod === 'mobile_money' && !transactionId.trim()) return;
    if (paymentMethod === 'bank' && !bankRef.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1500);
  };

  /* Back handler */
  const goBack = () => {
    if (step === 'payment') setStep('details');
  };

  const visibleSteps: ModalStep[] = ['details', 'payment', 'success'];

  const currentStepIdx = visibleSteps.indexOf(step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            {visibleSteps.filter(s => s !== 'success').map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    i <= currentStepIdx ? 'text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                  style={i <= currentStepIdx ? { background: 'var(--color-primary)' } : undefined}
                >
                  {i + 1}
                </div>
                {i < visibleSteps.filter(s2 => s2 !== 'success').length - 1 && (
                  <div className={`w-5 h-0.5 rounded ${i < currentStepIdx ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition cursor-pointer">
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">

          {/* ════════ STEP 1: DETAILS ════════ */}
          {step === 'details' && (
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight mb-0.5">Portfolio Details</h2>
              <p className="text-xs text-gray-400 mb-5">Enter your investment information</p>

              {/* Portfolio Name */}
              <div className="mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Portfolio Name</label>
                <input
                  type="text"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="e.g. My Growth Fund"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>

              {/* Wallet Balance */}
              <div className={`mb-4 p-3 rounded-xl border flex justify-between items-center transition-colors ${walletBalance - numAmount <= 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${walletBalance - numAmount <= 0 ? 'text-red-400' : 'text-gray-400'}`}>Available Balance</span>
                <span className={`font-bold text-sm ${walletBalance - numAmount <= 0 ? 'text-red-600' : 'text-gray-900'}`}>UGX {Math.max(0, walletBalance - numAmount).toLocaleString()}</span>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Investment Amount (UGX)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-gray-900 font-bold text-base focus:outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>

              {/* Reward Mode */}
              <div className="mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Reward Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'monthly_payout' as RoiMode, label: 'Monthly Payout', desc: 'Paid to wallet' },
                    { value: 'monthly_compounding' as RoiMode, label: 'Compounding', desc: 'Reinvested' },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRoiMode(opt.value)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        roiMode === opt.value
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)] shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className={`text-xs font-bold ${roiMode === opt.value ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>{opt.label}</p>
                      <p className="text-[9px] text-gray-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Duration</label>
                <div className="flex gap-2">
                  {([12, 18, 24] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        duration === d
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)] text-[var(--color-primary)] shadow-sm'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {d}M
                      {d >= 18 && <span className="block text-[8px] text-green-600 font-bold">20% ROI</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Renew */}
              <div className="mb-5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Auto-Renew</label>
                <div 
                  onClick={() => setAutoRenew(!autoRenew)}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer transition-all hover:bg-gray-50 bg-white"
                >
                  <div className="pr-4">
                    <p className="text-xs font-bold text-gray-900">Reinvest Principal at Maturity</p>
                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed">Automatically rollover your pool contribution at the end of the term to continue building wealth passively.</p>
                  </div>
                  <div className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors shrink-0 ${autoRenew ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${autoRenew ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => canProceedStep1 && setStep('payment')}
                disabled={!canProceedStep1}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                  !canProceedStep1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-white hover:shadow-lg cursor-pointer'
                }`}
                style={canProceedStep1 ? { background: 'var(--color-primary)' } : undefined}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ════════ STEP 2: PAYMENT ════════ */}
          {step === 'payment' && (
            <div>
              <button onClick={goBack} className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-4 hover:text-gray-600 transition cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <h2 className="text-lg font-black text-gray-900 tracking-tight mb-0.5">Payment</h2>
              <p className="text-xs text-gray-400 mb-5">Select how to fund UGX {numAmount.toLocaleString()}</p>

              {/* Payment Method Selector */}
              <div className="flex gap-2 mb-5">
                {([
                  { value: 'wallet' as PaymentMethod, label: 'Wallet', icon: <DollarSign className="w-4 h-4" /> },
                  { value: 'mobile_money' as PaymentMethod, label: 'Mobile Money', icon: <Target className="w-4 h-4" /> },
                  { value: 'bank' as PaymentMethod, label: 'Bank', icon: <ShieldCheck className="w-4 h-4" /> },
                ]).map((pm) => (
                  <button
                    key={pm.value}
                    onClick={() => setPaymentMethod(pm.value)}
                    className={`flex-1 p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                      paymentMethod === pm.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`mx-auto mb-1 ${paymentMethod === pm.value ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                      {pm.icon}
                    </div>
                    <p className={`text-[10px] font-bold ${paymentMethod === pm.value ? 'text-[var(--color-primary)]' : 'text-gray-500'}`}>{pm.label}</p>
                  </button>
                ))}
              </div>

              {/* ── Wallet ── */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Wallet Balance</span>
                    <span className="font-bold text-gray-900 text-sm">UGX {walletBalance.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Amount to Deduct</span>
                    <span className="font-bold text-gray-900 text-sm">UGX {numAmount.toLocaleString()}</span>
                  </div>
                  {numAmount > walletBalance ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                      <p className="text-xs text-red-600 font-bold">⚠ Insufficient wallet balance. Please deposit funds or reduce the amount.</p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                      <p className="text-xs text-green-600 font-bold">✓ Wallet balance is sufficient. Remaining after deduction: UGX {(walletBalance - numAmount).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Mobile Money ── */}
              {paymentMethod === 'mobile_money' && (
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                    <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider mb-2">Send to Merchant</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">MTN MoMo</span>
                        <span className="font-mono font-bold text-sm text-gray-900">*165*3*123456#</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Airtel Money</span>
                        <span className="font-mono font-bold text-sm text-gray-900">*185*9*654321#</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Amount</span>
                    <span className="font-bold text-gray-900 text-sm">UGX {numAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Transaction ID</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. TXN1234567890"
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[var(--color-primary)] transition"
                    />
                  </div>
                </div>
              )}

              {/* ── Bank ── */}
              {paymentMethod === 'bank' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mb-2">Bank Details</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-bold text-gray-900">Stanbic Bank Uganda</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Account Name</span><span className="font-bold text-gray-900">Welile Technologies Ltd</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Account No.</span><span className="font-mono font-bold text-gray-900">9030 0051 2345 67</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Branch</span><span className="font-bold text-gray-900">Kampala Main</span></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Amount</span>
                    <span className="font-bold text-gray-900 text-sm">UGX {numAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Reference Number</label>
                    <input
                      type="text"
                      value={bankRef}
                      onChange={(e) => setBankRef(e.target.value)}
                      placeholder="e.g. REF20260318001"
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[var(--color-primary)] transition"
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              {paymentMethod && (
                <button
                  onClick={handlePaymentSubmit}
                  disabled={
                    isSubmitting ||
                    (paymentMethod === 'wallet' && numAmount > walletBalance) ||
                    (paymentMethod === 'mobile_money' && !transactionId.trim()) ||
                    (paymentMethod === 'bank' && !bankRef.trim())
                  }
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition mt-5 ${
                    isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                  } ${
                    (paymentMethod === 'wallet' && numAmount > walletBalance) ||
                    (paymentMethod === 'mobile_money' && !transactionId.trim()) ||
                    (paymentMethod === 'bank' && !bankRef.trim())
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'text-white hover:shadow-lg'
                  }`}
                  style={
                    !((paymentMethod === 'wallet' && numAmount > walletBalance) ||
                      (paymentMethod === 'mobile_money' && !transactionId.trim()) ||
                      (paymentMethod === 'bank' && !bankRef.trim()))
                      ? { background: 'var(--color-primary)' }
                      : undefined
                  }
                >
                  {isSubmitting ? 'Submitting...' : paymentMethod === 'wallet' ? 'Confirm & Pay' : 'Submit for Approval'}
                </button>
              )}
            </div>
          )}



          {/* ════════ SUCCESS ════════ */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-50">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight mb-1">
                {paymentMethod === 'wallet' ? 'Investment Confirmed!' : 'Submitted for Approval'}
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                {paymentMethod === 'wallet' ? (
                  <>Portfolio <strong>#{portfolioCode}</strong> is now active. You'll earn <strong>UGX {Math.round(monthlyReturn).toLocaleString()}</strong>/month at {roiRate}% ROI.</>
                ) : (
                  <>Your payment for portfolio <strong>{portfolioName}</strong> has been submitted. It will be activated once the payment is verified by our team.</>
                )}
              </p>
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-5">
                <p className="text-[11px] text-green-600 font-bold">
                  {paymentMethod === 'wallet'
                    ? '🎉 First payout in 30 days'
                    : '📋 You will be notified once your payment is confirmed'}
                </p>
              </div>
              <button
                onClick={onSuccess}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition"
                style={{ background: 'var(--color-primary)' }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

