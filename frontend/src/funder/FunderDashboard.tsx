import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lightbulb } from 'lucide-react';

// Components
import FunderDashboardHeader from './components/FunderDashboardHeader';
import FunderMobileHeader from './components/FunderMobileHeader';
import FunderSidebar from './components/FunderSidebar';
import FunderBottomNav from './components/FunderBottomNav';
import FunderWalletCard from './components/FunderWalletCard';
import FunderActionButtons from './components/FunderActionButtons';
import FunderPortfolioList from './components/FunderPortfolioList';
import FunderRecentActivity from './components/FunderRecentActivity';
import type { PortfolioItem, ActivityItem } from './types';
import FunderInvestCTA from './components/FunderInvestCTA';
import FunderInvestModal from './FunderInvestModal';

// ─────────────────────────── types ───────────────────────────

interface DashboardStats {
  walletBalance: number;
  principalInvested: number;
  monthlyReturn: number;
  roiPercent: number;
}

// ─────────────────────────── MOCK DATA ───────────────────────

const MOCK_STATS: DashboardStats = {
  walletBalance: 2_500_000,
  principalInvested: 45_000_000,
  monthlyReturn: 6_750_000,
  roiPercent: 15,
};

const MOCK_PORTFOLIOS: PortfolioItem[] = [
  {
    id: '1',
    portfolioCode: 'WEL-01',
    investedAmount: 2_500_000,
    totalEarned: 462_500,
    roiPercent: 15,
    nextPayoutDate: '24 Oct 2026',
    maturityDate: 'Oct 12, 2027',
    status: 'active',
  },
  {
    id: '2',
    portfolioCode: 'WEL-05',
    investedAmount: 5_000_000,
    totalEarned: 0,
    roiPercent: 15,
    nextPayoutDate: undefined,
    maturityDate: 'Jan 15, 2027',
    status: 'pending',
  },
  {
    id: '3',
    portfolioCode: 'WEL-09',
    investedAmount: 1_200_000,
    totalEarned: 0,
    roiPercent: 20,
    nextPayoutDate: undefined,
    maturityDate: 'May 20, 2027',
    status: 'pending_approval',
  },
];

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'Monthly Reward',
    category: 'reward',
    status: 'ACTIVE',
    provider: 'MTN MOMO',
    date: '12 Mar 2026',
    amount: 375_000,
    isCredit: true,
  },
  {
    id: '2',
    title: 'New Investment',
    category: 'investment',
    status: 'PENDING',
    provider: '#WEL-09',
    date: '10 Mar 2026',
    amount: 1_200_000,
    isCredit: false,
  },
  {
    id: '3',
    title: 'Withdrawal',
    category: 'withdrawal',
    status: 'COMPLETED',
    provider: 'BANK TRANSFER',
    date: '08 Mar 2026',
    amount: 250_000,
    isCredit: true,
  },
];

// ─────────────────────────── COMPONENT ───────────────────────

export default function FunderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(MOCK_PORTFOLIOS);
  const [activities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // DEV: Fake load — re-enable auth check before production
    // if (user && user.isVerified === false) { navigate('/funder-onboarding'); return; }
    try {
      setStats(MOCK_STATS);
      setPortfolios(MOCK_PORTFOLIOS);
    } catch (err) {
      console.error('Failed to load funder data', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate]);

  const handleInvestSuccess = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      principalInvested: prev.principalInvested + amount,
      monthlyReturn: prev.monthlyReturn + amount * 0.15,
    }));
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : 'Grace Nakato';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#6C11D4]/30 border-t-[#6C11D4] animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8FF] font-sans">
      <div className="flex h-screen overflow-hidden">

        {/* ──────────── DESKTOP SIDEBAR ──────────── */}
        <FunderSidebar
          activePage="Dashboard"
          onNewInvestment={() => setIsModalOpen(true)}
        />

        {/* ──────────── MAIN CONTENT AREA ──────────── */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">

          {/* Desktop top navbar */}
          <FunderDashboardHeader
            user={{ fullName: displayName, role: 'Investor', avatarUrl: '' }}
            pageTitle="Dashboard"
            onAvatarClick={() => navigate('/settings')}
          />

          {/* Mobile top header */}
          <FunderMobileHeader
            user={{ fullName: displayName }}
            notificationCount={3}
          />

          {/* ──────────── PAGE BODY ──────────── */}
          <div className="flex-1 p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* ── LEFT / MAIN COLUMN ── */}
              <div className="lg:col-span-8 flex flex-col gap-8">

                {/* Wallet Card */}
                <FunderWalletCard
                  balance={stats.walletBalance}
                  principal={stats.principalInvested}
                  expectedAmount={stats.monthlyReturn}
                  roiPercent={stats.roiPercent}
                  cardId="WL-99201"
                  payoutMode="Monthly Payout"
                />

                {/* Quick Actions — mobile only (desktop uses sidebar CTA + right panel) */}
                <div className="lg:hidden">
                  <FunderActionButtons
                    onDeposit={() => setIsModalOpen(true)}
                    onWithdraw={() => console.log('Withdraw')}
                    onPortfolio={() => console.log('Portfolio')}
                  />
                </div>

                {/* Portfolio list */}
                <FunderPortfolioList
                  portfolios={portfolios}
                  onViewAll={() => console.log('View all portfolios')}
                  onCashOut={(id) => console.log('Cash out', id)}
                  onAddAsset={() => setIsModalOpen(true)}
                />

                {/* Grow Your Wealth CTA */}
                <FunderInvestCTA onStartInvesting={() => setIsModalOpen(true)} />

                {/* Recent Activity — mobile only (desktop uses right panel) */}
                <div className="lg:hidden pb-32">
                  <FunderRecentActivity
                    activities={activities}
                    onViewAll={() => console.log('View all activity')}
                  />
                </div>
              </div>

              {/* ── RIGHT PANEL (desktop only) ── */}
              <aside className="hidden lg:flex lg:col-span-4 flex-col gap-8">

                {/* Desktop Wallet Actions */}
                <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--color-primary-border)' }}>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Wallet Actions</h3>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg transition-all text-left group"
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors text-lg font-bold"
                        style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-primary-light)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                      >
                        +
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Add Funds</p>
                        <p className="text-xs text-slate-500">Deposit capital to your wallet</p>
                      </div>
                    </button>
                    <button
                      className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg transition-all text-left group"
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors text-lg font-bold"
                        style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-primary-light)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                      >
                        ↑
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Withdraw</p>
                        <p className="text-xs text-slate-500">Transfer returns to your account</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                  <FunderRecentActivity
                    activities={activities}
                    onViewAll={() => console.log('View all activity')}
                  />
                </div>

                {/* Investor Tip */}
                <div
                  className="p-6 rounded-xl border"
                  style={{ background: 'var(--color-primary-faint)', borderColor: 'var(--color-primary-border)' }}
                >
                  <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--color-primary)' }}>
                    <Lightbulb className="w-4 h-4" />
                    <span className="font-bold text-sm">Investor Tip</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Diversifying across 3+ portfolios reduces exposure risk significantly.
                    Compounding your monthly rewards can grow your portfolio by up to{' '}
                    <strong>400% over 12 months</strong> at the standard 15% ROI.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────── MOBILE BOTTOM NAV ──────────── */}
      <FunderBottomNav activePage="Home" />

      {/* ──────────── INVEST MODAL ──────────── */}
      <FunderInvestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletBalance={stats.walletBalance}
        onSuccess={handleInvestSuccess}
      />
    </div>
  );
}
