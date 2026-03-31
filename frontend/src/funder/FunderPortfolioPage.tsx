import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  TrendingUp,
  DollarSign,
  Filter,
  ChevronLeft,
  Layers,
  ArrowRight,
  LayoutGrid,
  List,
  X,
  CheckCircle2,
  Loader2,
  Wallet
} from 'lucide-react';
import { getFunderPortfolios, fundRentPool, getFunderDashboardStats } from '../services/funderApi';

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
  investedAmount: number;
  totalEarned: number;
  expectedAmount: number;
  durationMonths: number;
  payoutType: string;
  roiPercent: number;
  roiMode: RoiMode;
  status: PortfolioStatus;
  nextRoiDate?: string;
  maturityDate: string;
  createdDate: string;
  virtualHouses: VirtualHouse[];
  assetName?: string;
  todayGrowth?: number;
}

/* ═══════════ STATUS CONFIG ═══════════ */

const statusConfig: Record<PortfolioStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-green-50', text: 'text-green-700' },
  pending: { label: 'Pending', bg: 'bg-orange-50', text: 'text-orange-700' },
  pending_approval: { label: 'Pending Approval', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600' },
};



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
export default function FunderPortfolioPage({ onAddPortfolio, walletBalance }: FunderPortfolioPageProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [portfolios, setPortfolios] = useState<PortfolioAccount[]>([]);
  const [liveWalletBalance, setLiveWalletBalance] = useState<number>(walletBalance || 0);
  const [isLoading, setIsLoading] = useState(true);

  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Sync live balance when the parent prop changes
    if (walletBalance !== undefined) {
      setLiveWalletBalance(walletBalance);
    }

    const fetchViewData = async () => {
      try {
        // Only fetch portfolios if nested in Dashboard (which fetches them globally)
        // Wait, to safely reduce calls, we still fetch portfolios here because the user
        // can create a new portfolio and we need to refresh the list independently.
        const portfolioData = await getFunderPortfolios();
        setPortfolios(portfolioData);

        // Only trigger the secondary Stats API call if this page is rendered 
        // completely standalone (where walletBalance prop is undefined).
        if (walletBalance === undefined) {
          const statsData = await getFunderDashboardStats();
          setLiveWalletBalance(statsData.availableLiquid || 0);
        }
      } catch (error) {
        console.error("Failed to load portfolio view data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchViewData();
  }, [walletBalance]);

  const filtered = filter === 'all' ? portfolios : portfolios.filter((p) => p.status === filter || p.status.toLowerCase() === filter);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedPortfolios = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, viewMode]);

  /* ── summary stats ── */
  const totalInvested = portfolios.reduce((s, p) => s + p.investedAmount, 0);
  const totalEarned = portfolios.reduce((s, p) => s + p.totalEarned, 0);
  const avgRoi = portfolios.length
    ? Math.round(portfolios.reduce((s, p) => s + p.roiPercent, 0) / portfolios.length)
    : 0;



  /* ══════════════  MAIN PORTFOLIO LIST VIEW  ══════════════ */
  return (
    <>
      <div className="flex-1 p-6 lg:p-8 pb-32 lg:pb-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              My Portfolio
              {isLoading && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Track and manage your investment accounts in the Rent Management Pool</p>
          </div>
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f
                  ? 'text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                  }`}
                style={filter === f ? { background: 'var(--color-primary)', boxShadow: '0 4px 12px var(--color-primary-shadow)' } : undefined}
              >
                {f === 'all' ? 'All' : f === 'pending_approval' ? 'Pending Approval' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button onClick={() => setViewMode('card')} className={`p-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                <List className="w-4 h-4" />
              </button>
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
          <div className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
            {paginatedPortfolios.map((p, idx) => {
              const sts = statusConfig[p.status];
              const currentValue = p.investedAmount + p.totalEarned;
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
                  className={`bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer group flex p-5 sm:p-6 lg:p-8 ${viewMode === 'list'
                      ? 'flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 lg:gap-8'
                      : 'flex-col items-start gap-4 justify-between h-full'
                    }`}
                >
                  {/* Header: Identity */}
                  <div className={`flex items-center gap-4 sm:gap-5 lg:gap-6 min-w-0 flex-1 ${viewMode === 'card' ? 'w-full' : ''}`}>
                    <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden flex-shrink-0 relative group-hover:shadow-md transition-shadow">
                      <img src={imgUrl} alt={p.assetName || 'Portfolio'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-slate-900 text-[13px] sm:text-[15px] lg:text-base group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-tight">
                        {p.assetName || `Portfolio ${p.portfolioCode}`}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 shrink-0">
                          {p.portfolioCode}
                        </span>
                        {parseInt(p.portfolioCode.replace(/\D/g, '') || '0') % 3 === 0 && parseInt(p.portfolioCode.replace(/\D/g, '') || '0') > 0 && (
                          <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md uppercase tracking-widest shrink-0 border border-purple-200">
                            ×{(parseInt(p.portfolioCode.replace(/\D/g, '')) % 2) + 2} Renewed
                          </span>
                        )}
                        <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-green-500' :
                            p.status === 'pending' ? 'bg-orange-500' :
                              p.status === 'pending_approval' ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`} />
                          <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest">{sts.label}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block shrink-0" />
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-400 hidden sm:block truncate">
                          Pool Contribution: UGX {p.investedAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Separator on mobile/card */}
                  <div className={`w-full h-px bg-slate-50 shrink-0 ${viewMode === 'card' ? 'my-2' : 'my-1 sm:hidden'}`} />

                  {/* Footer: Value & Performance */}
                  <div className={`flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 ${viewMode === 'card' ? 'w-full sm:flex-row sm:items-center sm:justify-between' : ''}`}>
                    <div className="text-left sm:text-right">
                      <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">Total Value</p>
                      <p className="font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 tracking-tight">
                        UGX {currentValue.toLocaleString()}
                      </p>
                    </div>

                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-sm font-bold shrink-0 ${isGrowthPositive
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
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white border border-slate-100 shadow-sm rounded-2xl p-4 mt-2 sm:col-span-1 md:col-span-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2.5 font-bold text-sm bg-slate-50 text-slate-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-sm font-bold text-slate-500 hidden sm:block">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2.5 font-bold text-sm bg-slate-50 text-[var(--color-primary)] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddPortfolioModal
          walletBalance={liveWalletBalance}
          onClose={() => setShowAddModal(false)}
          onSuccess={async () => {
            setShowAddModal(false);
            if (onAddPortfolio) onAddPortfolio();
            try {
              const [portfolioData, statsData] = await Promise.all([
                getFunderPortfolios(),
                getFunderDashboardStats()
              ]);
              setPortfolios(portfolioData);
              setLiveWalletBalance(statsData.availableLiquid || 0);
            } catch (e) { }
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

function AddPortfolioModal({ walletBalance, onClose, onSuccess }: AddPortfolioModalProps) {
  const [step, setStep] = useState<ModalStep>('details');
  const [portfolioName, setPortfolioName] = useState('');
  const [amount, setAmount] = useState('');
  const [roiMode, setRoiMode] = useState<RoiMode>('monthly_payout');
  const [duration, setDuration] = useState<12 | 18 | 24>(12);
  const [autoRenew, setAutoRenew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPhraseIdx, setLoadingPhraseIdx] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingPhraseIdx((prev) => (prev + 1) % 4);
      }, 1500);
    } else {
      setLoadingPhraseIdx(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const numAmount = parseInt(amount.replace(/,/g, ''), 10) || 0;
  const roiRate = 15; // Locked at 15% system-wide
  const isCompounding = roiMode === 'monthly_compounding';
  const expectedProfit = isCompounding
    ? (numAmount * Math.pow(1 + (roiRate / 100) / 12, duration)) - numAmount
    : numAmount * (roiRate / 100) * (duration / 12);
  const totalReturn = numAmount + expectedProfit;

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

  const handlePaymentSubmit = async () => {
    if (numAmount > walletBalance) return;

    setIsSubmitting(true);
    try {
      await fundRentPool({
        amount: numAmount,
        roi_mode: roiMode,
        duration_months: duration,
        auto_renew: autoRenew,
        account_name: portfolioName.trim() || undefined
      });
      setStep('success');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to fund the rent pool.');
    } finally {
      setIsSubmitting(false);
    }
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
                  className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${i <= currentStepIdx ? 'text-white' : 'bg-gray-100 text-gray-400'
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
                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${walletBalance - numAmount <= 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  <Wallet size={12} strokeWidth={2.5} />
                  Available Balance
                </span>
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
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${roiMode === opt.value
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
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${duration === d
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)] text-[var(--color-primary)] shadow-sm'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {d}M
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
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${!canProceedStep1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-white hover:shadow-lg cursor-pointer'
                  }`}
                style={canProceedStep1 ? { background: 'var(--color-primary)' } : undefined}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ════════ STEP 2: INVESTMENT PROJECTION ════════ */}
          {step === 'payment' && (
            <div className="flex flex-col h-full animate-fadeInUp">
              <button onClick={goBack} className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-6 hover:text-[var(--color-primary)] transition cursor-pointer w-fit p-1 rounded-md hover:bg-slate-50">
                <ChevronLeft className="w-4 h-4" /> Back to details
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">Investment Projection</h2>
                <p className="text-sm text-slate-500 font-medium">Review your projected returns before deploying your capital.</p>
              </div>

              {/* ── Clean Mathematical Projection Box ── */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Portfolio Name</span>
                    <span className="font-bold text-slate-900 text-sm max-w-[150px] sm:max-w-xs truncate text-right">
                      {portfolioName.trim() || `${duration}-Month ${String(roiMode).includes('compounding') ? 'Compounding' : 'Yield'}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Initial Capital</span>
                    <span className="font-bold text-slate-900 text-sm">UGX {numAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Annual ROI</span>
                    <span className="font-bold text-[var(--color-success)] text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> 15%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lock-in Period</span>
                    <span className="font-bold text-slate-900 text-sm">{duration} Months</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Yield Strategy</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {String(roiMode).includes('compounding') ? 'Compounding' : 'Standard Payout'}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 w-full" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expected Profit ({isCompounding ? 'Compound' : 'Simple'})</span>
                    <span className="font-bold text-[var(--color-success)] text-sm">
                      + UGX {Math.round(expectedProfit).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">
                    <span className="text-xs text-slate-800 font-black uppercase tracking-widest">Est. Total Return</span>
                    <span className="font-black text-[var(--color-primary)] text-lg">
                      UGX {Math.round(totalReturn).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {/* ── Minimal Wallet Check ── */}
                {numAmount > walletBalance ? (
                  <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold text-red-500 bg-red-50 py-3 rounded-xl border border-red-100 uppercase tracking-wide">
                    ⚠ Insufficient wallet balance (Available: UGX {walletBalance.toLocaleString()})
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 mb-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                    Wallet Balance: UGX {walletBalance.toLocaleString()}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handlePaymentSubmit}
                  disabled={isSubmitting || numAmount > walletBalance}
                  className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative overflow-hidden ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                    } ${numAmount > walletBalance ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-white shadow-md hover:shadow-lg hover:-translate-y-[1px]'}`}
                  style={!(numAmount > walletBalance) ? { background: 'var(--color-primary)' } : undefined}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin shrink-0 text-white" />
                      <span>{['Getting Ready...', 'Preparing Node...', 'Deploying Capital...', 'Almost there...'][loadingPhraseIdx]}</span>
                    </div>
                  ) : (
                    'Confirm & Deploy Capital'
                  )}
                </button>
              </div>
            </div>
          )}



          {/* ════════ SUCCESS ════════ */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-50">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight mb-1">
                Investment Confirmed!
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Portfolio <strong>#{portfolioCode}</strong> is now active. You are projected to earn a total profit of <strong>UGX {Math.round(expectedProfit).toLocaleString()}</strong> correctly scaled over the {duration}-month term.
              </p>
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-5">
                <p className="text-[11px] text-green-600 font-bold uppercase tracking-widest">
                  First payout in 30 days
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

