import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Lightbulb } from 'lucide-react';
import FunderDashboardHeader from './components/FunderDashboardHeader';
import FunderMobileHeader from './components/FunderMobileHeader';
import FunderSidebar from './components/FunderSidebar';
import FunderBottomNav from './components/FunderBottomNav';
import FunderWalletCard from './components/FunderWalletCard';
import FunderPortfolioList from './components/FunderPortfolioList';
import FunderRecentActivity from './components/FunderRecentActivity';
import type { PortfolioItem, ActivityItem } from './types';
import FunderInvestCTA from './components/FunderInvestCTA';
import FunderInvestModal from './FunderInvestModal';
import FunderActionButtons from './components/FunderActionButtons';
import FunderPortfolioPage from './FunderPortfolioPage';
import FunderOpportunitiesPage from './FunderOpportunitiesPage';

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
    assetName: 'Kampala Heights',
    investedAmount: 2_500_000,
    totalEarned: 462_500,
    roiPercent: 15,
    durationMonths: 12,
    payoutType: 'Monthly',
    nextPayoutDate: '24 Oct 2026',
    maturityDate: 'Oct 12, 2027',
    status: 'active',
  },
  {
    id: '2',
    portfolioCode: 'WEL-05',
    assetName: 'Entebbe Views',
    investedAmount: 5_000_000,
    totalEarned: 0,
    roiPercent: 18,
    durationMonths: 24,
    payoutType: 'Compounding',
    nextPayoutDate: undefined,
    maturityDate: 'Jan 15, 2027',
    status: 'pending',
  },
  {
    id: '3',
    portfolioCode: 'WEL-09',
    assetName: 'Jinja Retail Park',
    investedAmount: 1_200_000,
    totalEarned: 0,
    roiPercent: 20,
    durationMonths: 12,
    payoutType: 'Monthly',
    nextPayoutDate: undefined,
    maturityDate: 'May 20, 2027',
    status: 'pending_approval',
  },
];

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'Monthly Earnings',
    category: 'reward',
    status: 'COMPLETED',
    provider: 'Kampala Heights',
    date: '12 Mar 2026',
    timestamp: '2 hours ago',
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
    timestamp: '2 days ago',
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
    timestamp: '4 days ago',
    amount: 250_000,
    isCredit: false,
  },
];

// ─────────────────────────── COMPONENT ───────────────────────

export default function FunderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(MOCK_PORTFOLIOS);
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState<string>('Dashboard');

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` }, timeout: 2000 };
        
        const [statsRes, portfoliosRes, activitiesRes] = await Promise.all([
          axios.get('http://localhost:3000/api/supporter/dashboard', config),
          axios.get('http://localhost:3000/api/supporter/portfolios', config),
          axios.get('http://localhost:3000/api/supporter/activities', config)
        ]);

        if (isMounted) {
          setStats(statsRes.data);
          setPortfolios(portfoliosRes.data);
          setActivities(activitiesRes.data);
        }
      } catch (err) {
        console.error('Failed to load funder data', err);
        // Fallback to mocks if no local API is tethered
        if (isMounted) {
          setStats(MOCK_STATS);
          setPortfolios(MOCK_PORTFOLIOS);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-primary-faint)' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 animate-spin"
            style={{ borderColor: 'var(--color-primary-light)', borderTopColor: 'var(--color-primary)' }}
          />
          <p className="text-slate-500 text-sm font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-primary-faint)' }}>
      <div className="flex h-screen overflow-hidden">

        {/* ──────────── DESKTOP SIDEBAR ──────────── */}
        <FunderSidebar
          activePage={activePage}
          onNavigate={(page) => setActivePage(page)}
          onNewsupport={() => setIsModalOpen(true)}
        />

        {/* ──────────── MAIN CONTENT AREA ──────────── */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">

          {/* Desktop top navbar */}
          <FunderDashboardHeader
            user={{ fullName: displayName, role: 'supporter', avatarUrl: '' }}
            pageTitle="Dashboard"
          />

          {/* Mobile top header */}
          <FunderMobileHeader
            user={{ fullName: displayName }}
            onAvatarClick={() => navigate('/funder/account')}
          />

          {/* ──────────── PAGE BODY ──────────── */}
          {activePage === 'Portfolio' ? (
            <FunderPortfolioPage onAddPortfolio={() => setIsModalOpen(true)} walletBalance={stats.walletBalance} />
          ) : activePage === 'Opportunities' ? (
            <FunderOpportunitiesPage />
          ) : (
          <div className="flex-1 p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* ── LEFT / MAIN COLUMN ── */}
              <div className="lg:col-span-8 flex flex-col gap-8">

                {/* Wealth Performance Card */}
                <FunderWalletCard
                  walletBalance={stats.walletBalance}
                  cardId="WL-99201"
                  onAddFunds={() => setIsModalOpen(true)}
                  onWithdraw={() => console.log('Withdraw via card')}
                  onPortfolio={() => navigate('/funder/portfolio')}
                />

                                
                {/* Quick Actions — mobile only */}
                <div className="lg:hidden relative">
                  <FunderActionButtons
                    portfolioValue={stats.principalInvested}
                    roiPercent={stats.roiPercent}
                  />
                </div>
{/* Portfolio list */}
                <FunderPortfolioList
                  portfolios={portfolios}
                  onViewAll={() => navigate('/funder/portfolio')}
                  onCashOut={(id) => console.log('Cash out', id)}
                  onAddAsset={() => setIsModalOpen(true)}
                />

                {/* Grow Your Wealth CTA */}
                <FunderInvestCTA onStartsupporting={() => setIsModalOpen(true)} />

                {/* Recent Activity — mobile only */}
                <div className="lg:hidden pb-32">
                  <FunderRecentActivity
                    activities={activities}
                    onViewAll={() => console.log('View all activity')}
                  />
                </div>
              </div>

              {/* ── RIGHT PANEL (desktop only) ── */}
              <aside className="hidden lg:flex lg:col-span-4 flex-col gap-8">
                                {/* Wallet Quick Actions */}
                <div className="relative">
                  <FunderActionButtons
                    portfolioValue={stats.principalInvested}
                    roiPercent={stats.roiPercent}
                  />
                </div>
                
                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                  <FunderRecentActivity
                    activities={activities}
                    onViewAll={() => console.log('View all activity')}
                  />
                </div>

                {/* Investor Insights */}
                <div
                  className="bg-white rounded-xl border p-6 flex items-start gap-4 shadow-sm"
                  style={{ borderColor: 'var(--color-primary-border)', borderLeft: '4px solid var(--color-primary)' }}
                >
                  <div className="p-2 rounded-full" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Smart Insight</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      You have <strong>UGX 2,500,000</strong> idle in your wallet. Consider putting it into one of the recommended opportunities below to start compounding your earnings.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          )}
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
