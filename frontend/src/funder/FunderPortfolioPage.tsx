import { useState } from 'react';
import {
  Plus,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,

  Filter,
  Eye,
  ChevronLeft,
  Layers,
  Home,
  Calendar,
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
}

/* ═══════════ STATUS CONFIG ═══════════ */

const statusConfig: Record<PortfolioStatus, { label: string; bg: string; text: string }> = {
  active:           { label: 'Active',           bg: 'bg-green-50',  text: 'text-green-700' },
  pending:          { label: 'Pending',          bg: 'bg-orange-50', text: 'text-orange-700' },
  pending_approval: { label: 'Pending Approval', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  cancelled:        { label: 'Cancelled',        bg: 'bg-red-50',    text: 'text-red-600' },
};

const healthConfig: Record<PaymentHealth, { label: string; color: string; bg: string }> = {
  green:  { label: 'On Time',  color: '#16a34a', bg: '#f0fdf4' },
  yellow: { label: '1-7 Days', color: '#ca8a04', bg: '#fefce8' },
  red:    { label: '8+ Days',  color: '#dc2626', bg: '#fef2f2' },
};

/* ═══════════ MOCK DATA ═══════════ */

const MOCK_PORTFOLIOS: PortfolioAccount[] = [
  {
    id: '1',
    portfolioCode: 'WPF-7291',
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
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioAccount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const portfolios = MOCK_PORTFOLIOS;
  const filtered = filter === 'all' ? portfolios : portfolios.filter((p) => p.status === filter);

  /* ── summary stats ── */
  const totalInvested = portfolios.reduce((s, p) => s + p.investmentAmount, 0);
  const totalEarned   = portfolios.reduce((s, p) => s + p.totalRoiEarned, 0);
  const totalExpected = portfolios.reduce((s, p) => s + p.expectedAmount, 0);
  const avgRoi        = portfolios.length
    ? Math.round(portfolios.reduce((s, p) => s + p.roiPercentage, 0) / portfolios.length)
    : 0;



  /* ══════════════  VIRTUAL HOUSES (PROPERTY) DETAIL VIEW  ══════════════ */
  if (selectedPortfolio) {
    const monthlyReward = selectedPortfolio.investmentAmount * (selectedPortfolio.roiPercentage / 100);
    return (
      <div className="flex-1 p-6 lg:p-8 pb-32 lg:pb-8">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPortfolio(null)}
          className="flex items-center gap-2 text-sm font-bold mb-6 px-4 py-2 rounded-xl hover:bg-white transition-all"
          style={{ color: 'var(--color-primary)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Portfolio
        </button>

        {/* Portfolio Header Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--color-primary)', boxShadow: '0 4px 12px var(--color-primary-shadow)' }}
              >
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  #{selectedPortfolio.portfolioCode}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">
                    {selectedPortfolio.roiMode === 'monthly_compounding' ? 'Compounding' : 'Monthly Payout'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-400">{selectedPortfolio.durationMonths} months</span>
                </div>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${statusConfig[selectedPortfolio.status].bg} ${statusConfig[selectedPortfolio.status].text}`}>
              {statusConfig[selectedPortfolio.status].label}
            </span>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: 'Principal', value: `UGX ${selectedPortfolio.investmentAmount.toLocaleString()}`, color: 'var(--color-primary)' },
              { label: 'Expected Amt', value: `UGX ${selectedPortfolio.expectedAmount.toLocaleString()}`, color: '#2563eb' },
              { label: 'Total Earned', value: `UGX ${selectedPortfolio.totalRoiEarned.toLocaleString()}`, color: '#16a34a' },
              { label: 'Monthly Return', value: `UGX ${monthlyReward.toLocaleString()}`, color: '#7c3aed' },
              { label: 'ROI', value: `${selectedPortfolio.roiPercentage}%`, color: '#ea580c' },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">{s.label}</p>
                <p className="font-black text-sm tracking-tight" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-6 mt-5 text-xs text-slate-400">
            <span><span className="font-bold">Created:</span> {selectedPortfolio.createdDate}</span>
            <span><span className="font-bold">Maturity:</span> {selectedPortfolio.maturityDate}</span>
            {selectedPortfolio.nextRoiDate && (
              <span><span className="font-bold">Next Payout:</span> {selectedPortfolio.nextRoiDate}</span>
            )}
          </div>
        </div>

        {/* Virtual Houses Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Funded Properties
            <span className="text-sm font-normal text-slate-400 ml-2">
              ({selectedPortfolio.virtualHouses.length} virtual {selectedPortfolio.virtualHouses.length === 1 ? 'house' : 'houses'})
            </span>
          </h2>
        </div>

        {/* Virtual Houses Grid */}
        {selectedPortfolio.virtualHouses.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
            <Home className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-500 mb-1">No properties yet</h3>
            <p className="text-sm text-slate-400">
              {selectedPortfolio.status === 'pending_approval'
                ? 'Properties will be assigned once this portfolio is approved.'
                : 'No rent deals have been funded from this portfolio yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {selectedPortfolio.virtualHouses.map((house) => {
              const health = healthConfig[house.paymentHealth];
              return (
                <div
                  key={house.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: health.bg }}>
                        <Home className="w-5 h-5" style={{ color: health.color }} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Virtual House</p>
                        <span className="font-mono text-[10px] text-slate-400">#{house.portfolioCode}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest" style={{ background: health.bg, color: health.color }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: health.color }} />
                      {health.label}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Rent Amount</p>
                      <p className="font-black text-slate-900 text-base">UGX {house.rentAmount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-bold">Funded: {house.fundingDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ══════════════  MAIN PORTFOLIO LIST VIEW  ══════════════ */
  return (
    <div className="flex-1 p-6 lg:p-8 pb-32 lg:pb-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Portfolio</h1>
        <p className="text-sm text-slate-500 mt-1">Track and manage your investment accounts in the Rent Management Pool</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Invested',   value: `UGX ${totalInvested.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
          { label: 'Total Earned',     value: `UGX ${totalEarned.toLocaleString()}`,    icon: <TrendingUp className="w-5 h-5" />,  color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Expected Returns', value: `UGX ${totalExpected.toLocaleString()}`,  icon: <Target className="w-5 h-5" />,      color: '#2563eb', bg: '#eff6ff' },
          { label: 'Avg. ROI',         value: `${avgRoi}%`,                              icon: <PieChart className="w-5 h-5" />,    color: '#ea580c', bg: '#fff7ed' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-lg font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const sts = statusConfig[p.status];

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group"
              >
                {/* Header */}
                <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-100">
                      <Layers className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm truncate">#{p.portfolioCode}</h3>
                      <span className="text-[10px] text-slate-400">
                        {p.roiMode === 'monthly_compounding' ? 'Compounding' : 'Payout'} • {p.durationMonths}M
                      </span>
                    </div>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0 ${sts.bg} ${sts.text}`}>
                    {sts.label}
                  </span>
                </div>

                {/* Metrics — simple rows */}
                <div className="px-4 pb-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">Principal</span>
                    <span className="text-[13px] font-bold text-slate-900">UGX {p.investmentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">Expected</span>
                    <span className="text-[13px] font-bold text-slate-900">UGX {p.expectedAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">Earned</span>
                    <span className={`text-[13px] font-bold ${p.totalRoiEarned > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                      {p.totalRoiEarned > 0 ? '+' : ''}UGX {p.totalRoiEarned.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">ROI</span>
                    <span className="text-[13px] font-bold" style={{ color: 'var(--color-primary)' }}>{p.roiPercentage}%</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-50 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {p.nextRoiDate ? `Next: ${p.nextRoiDate}` : p.maturityDate}
                  </span>
                  <button
                    onClick={() => setSelectedPortfolio(p)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-100"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Portfolio Card */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center gap-2 text-center hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-faint)] transition-all group cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              <Plus className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-slate-500 group-hover:text-[var(--color-primary)] transition-colors">
              Fund Rent Pool
            </p>
          </button>
        </div>
      )}

      {/* ══════════════  ADD PORTFOLIO MODAL  ══════════════ */}
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
    </div>
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

type ModalStep = 'details' | 'choose' | 'payment' | 'houses' | 'houses_payment' | 'success';
type InvestType = 'fund_pool' | 'direct_support';
type PaymentMethod = 'wallet' | 'mobile_money' | 'bank';

interface AvailableHouse {
  id: string;
  label: string;
  rentAmount: number;
  location: string;
}

const MOCK_AVAILABLE_HOUSES: AvailableHouse[] = [
  { id: 'ah1', label: 'House A-12', rentAmount: 350_000, location: 'Kampala, Makindye' },
  { id: 'ah2', label: 'House B-07', rentAmount: 500_000, location: 'Entebbe, Kitoro' },
  { id: 'ah3', label: 'House C-19', rentAmount: 280_000, location: 'Kampala, Ntinda' },
  { id: 'ah4', label: 'House D-03', rentAmount: 450_000, location: 'Kampala, Kololo' },
  { id: 'ah5', label: 'House E-25', rentAmount: 600_000, location: 'Mukono Town' },
  { id: 'ah6', label: 'House F-11', rentAmount: 200_000, location: 'Kampala, Bwaise' },
  { id: 'ah7', label: 'House G-08', rentAmount: 750_000, location: 'Kampala, Naguru' },
  { id: 'ah8', label: 'House H-14', rentAmount: 320_000, location: 'Wakiso, Nansana' },
];

function AddPortfolioModal({ walletBalance, onClose, onSuccess }: AddPortfolioModalProps) {
  const [step, setStep] = useState<ModalStep>('details');
  const [portfolioName, setPortfolioName] = useState('');
  const [amount, setAmount] = useState('');
  const [roiMode, setRoiMode] = useState<RoiMode>('monthly_payout');
  const [duration, setDuration] = useState<12 | 18 | 24>(12);
  const [investType, setInvestType] = useState<InvestType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchedHouses, setMatchedHouses] = useState<AvailableHouse[]>([]);

  const numAmount = parseInt(amount.replace(/,/g, ''), 10) || 0;
  const roiRate = duration >= 18 ? 20 : 15;
  const monthlyReturn = numAmount * (roiRate / 100);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setAmount(val ? parseInt(val, 10).toLocaleString() : '');
  };

  const portfolioCode = `WPF-${Math.floor(1000 + Math.random() * 9000)}`;

  const canProceedStep1 = portfolioName.trim().length > 0 && numAmount > 0;

  /* Auto-match houses to investment amount */
  const autoMatchHouses = () => {
    let remaining = numAmount;
    const selected: AvailableHouse[] = [];
    const sorted = [...MOCK_AVAILABLE_HOUSES].sort((a, b) => b.rentAmount - a.rentAmount);
    for (const h of sorted) {
      if (remaining <= 0) break;
      if (h.rentAmount <= remaining) {
        selected.push(h);
        remaining -= h.rentAmount;
      }
    }
    setMatchedHouses(selected);
  };

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
    if (step === 'choose') setStep('details');
    else if (step === 'payment') setStep('choose');
    else if (step === 'houses') setStep('choose');
    else if (step === 'houses_payment') setStep('houses');
  };


  const visibleSteps: ModalStep[] =
    investType === 'direct_support'
      ? ['details', 'choose', 'houses', 'houses_payment', 'success']
      : ['details', 'choose', 'payment', 'success'];

  const currentStepIdx = visibleSteps.indexOf(step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
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
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition">
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
              <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Wallet Balance</span>
                <span className="font-bold text-gray-900 text-sm">UGX {walletBalance.toLocaleString()}</span>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Investment Amount (UGX)</label>
                <input
                  type="text"
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
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        roiMode === opt.value
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)]'
                          : 'border-gray-200 hover:border-gray-300'
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
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        duration === d
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)] text-[var(--color-primary)]'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {d}M
                      {d >= 18 && <span className="block text-[8px] text-green-600 font-bold">20% ROI</span>}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => canProceedStep1 && setStep('choose')}
                disabled={!canProceedStep1}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                  !canProceedStep1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-white hover:shadow-lg'
                }`}
                style={canProceedStep1 ? { background: 'var(--color-primary)' } : undefined}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ════════ STEP 2: CHOOSE TYPE ════════ */}
          {step === 'choose' && (
            <div>
              <button onClick={goBack} className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-4 hover:text-gray-600 transition">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <h2 className="text-lg font-black text-gray-900 tracking-tight mb-0.5">Investment Type</h2>
              <p className="text-xs text-gray-400 mb-5">How would you like to invest your UGX {numAmount.toLocaleString()}?</p>

              <div className="space-y-3">
                {/* Fund Pool */}
                <button
                  onClick={() => { setInvestType('fund_pool'); setPaymentMethod(null); setStep('payment'); }}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-faint)] text-left transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm group-hover:text-[var(--color-primary)]">Fund Rent Pool</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                        Contribute to the Rent Management Pool. Your funds will be deployed across verified rent deals.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Direct Support */}
                <button
                  onClick={() => {
                    setInvestType('direct_support');
                    autoMatchHouses();
                    setStep('houses');
                  }}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-faint)] text-left transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50 text-green-600 shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm group-hover:text-[var(--color-primary)]">Direct Support</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                        Directly fund specific rent deals matching your investment amount.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ════════ STEP 3a: PAYMENT (Fund Pool) ════════ */}
          {step === 'payment' && (
            <div>
              <button onClick={goBack} className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-4 hover:text-gray-600 transition">
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
                    className={`flex-1 p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === pm.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)]'
                        : 'border-gray-200 hover:border-gray-300'
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

          {/* ════════ STEP 3b: MATCHED HOUSES (Direct Support) ════════ */}
          {step === 'houses' && (
            <div>
              <button onClick={goBack} className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-4 hover:text-gray-600 transition">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <h2 className="text-lg font-black text-gray-900 tracking-tight mb-0.5">Available Houses</h2>
              <p className="text-xs text-gray-400 mb-1">
                {matchedHouses.length} {matchedHouses.length === 1 ? 'house matches' : 'houses match'} your UGX {numAmount.toLocaleString()} budget
              </p>
              <p className="text-[10px] text-gray-300 mb-4">
                Total: UGX {matchedHouses.reduce((s, h) => s + h.rentAmount, 0).toLocaleString()}
              </p>

              {matchedHouses.length === 0 ? (
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 text-center">
                  <Home className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-bold">No matching houses</p>
                  <p className="text-xs text-gray-400 mt-1">Try increasing your investment amount.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                  {matchedHouses.map((h) => (
                    <div key={h.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                          <Home className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{h.label}</p>
                          <p className="text-[10px] text-gray-400">{h.location}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">UGX {h.rentAmount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedHouses.length > 0 && (
                <button
                  onClick={() => { setPaymentMethod(null); setStep('houses_payment'); }}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition mt-4 hover:shadow-lg"
                  style={{ background: 'var(--color-primary)' }}
                >
                  Proceed to Payment <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}

          {/* ════════ STEP 4: PAYMENT (Direct Support) ════════ */}
          {step === 'houses_payment' && (
            <div>
              <button onClick={goBack} className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-4 hover:text-gray-600 transition">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <h2 className="text-lg font-black text-gray-900 tracking-tight mb-0.5">Payment</h2>
              <p className="text-xs text-gray-400 mb-5">
                Pay for {matchedHouses.length} {matchedHouses.length === 1 ? 'house' : 'houses'} — UGX {matchedHouses.reduce((s, h) => s + h.rentAmount, 0).toLocaleString()}
              </p>

              {/* Payment Method Selector (same as fund pool) */}
              <div className="flex gap-2 mb-5">
                {([
                  { value: 'wallet' as PaymentMethod, label: 'Wallet', icon: <DollarSign className="w-4 h-4" /> },
                  { value: 'mobile_money' as PaymentMethod, label: 'Mobile Money', icon: <Target className="w-4 h-4" /> },
                  { value: 'bank' as PaymentMethod, label: 'Bank', icon: <ShieldCheck className="w-4 h-4" /> },
                ]).map((pm) => (
                  <button
                    key={pm.value}
                    onClick={() => setPaymentMethod(pm.value)}
                    className={`flex-1 p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === pm.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`mx-auto mb-1 ${paymentMethod === pm.value ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                      {pm.icon}
                    </div>
                    <p className={`text-[10px] font-bold ${paymentMethod === pm.value ? 'text-[var(--color-primary)]' : 'text-gray-500'}`}>{pm.label}</p>
                  </button>
                ))}
              </div>

              {/* Wallet */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Wallet Balance</span>
                    <span className="font-bold text-gray-900 text-sm">UGX {walletBalance.toLocaleString()}</span>
                  </div>
                  {numAmount > walletBalance ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                      <p className="text-xs text-red-600 font-bold">⚠ Insufficient balance</p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                      <p className="text-xs text-green-600 font-bold">✓ Balance sufficient</p>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Money */}
              {paymentMethod === 'mobile_money' && (
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                    <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider mb-2">Send to Merchant</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">MTN MoMo</span>
                        <span className="font-mono font-bold text-gray-900">*165*3*123456#</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Airtel Money</span>
                        <span className="font-mono font-bold text-gray-900">*185*9*654321#</span>
                      </div>
                    </div>
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

              {/* Bank */}
              {paymentMethod === 'bank' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mb-2">Bank Details</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-bold text-gray-900">Stanbic Bank Uganda</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Account</span><span className="font-bold text-gray-900">Welile Technologies Ltd</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">No.</span><span className="font-mono font-bold text-gray-900">9030 0051 2345 67</span></div>
                    </div>
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

