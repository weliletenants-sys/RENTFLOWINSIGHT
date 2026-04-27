import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lightbulb, ShieldAlert, ArrowRight } from 'lucide-react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import FunderDashboardHeader from './components/FunderDashboardHeader';
import FunderSidebar from './components/FunderSidebar';
import FunderBottomNav from './components/FunderBottomNav';
import FunderWalletCard from './components/FunderWalletCard';
import FunderPortfolioList from './components/FunderPortfolioList';
import FunderRecentActivity from './components/FunderRecentActivity';
import FunderPortfolioHealth from './components/FunderPortfolioHealth';
import type { PortfolioItem, ActivityItem } from './types';
import FunderActionButtons from './components/FunderActionButtons';
import FunderPortfolioPage from './FunderPortfolioPage';
import FunderOpportunitiesPage from './FunderOpportunitiesPage';
import InvestmentCalculator from './components/InvestmentCalculator';
import { getFunderDashboardStats, getFunderPortfolios, getFunderActivities } from '../services/funderApi';
import type { DashboardStatsResponse } from '../services/funderApi';
import { useKycStatus } from './hooks/useKycStatus';

// ─────────────────────────── types ───────────────────────────

// ─────────────────────────── MOCK DATA ───────────────────────

  // Mock data completely extracted. Portfolios and Events mapped to live JSON telemetry.

// ─────────────────────────── COMPONENT ───────────────────────

export default function FunderDashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { status: kycStatus } = useKycStatus();

  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<string>('Dashboard');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [liveStats, livePortfolios, rawActivities] = await Promise.all([
          getFunderDashboardStats(),
          getFunderPortfolios(),
          getFunderActivities()
        ]);
        setStats(liveStats);
        setPortfolios(livePortfolios);

        const formattedActivities = rawActivities.map((item: any) => {
          let rawTitle = item.category ? item.category.replace(/_/g, ' ').toUpperCase() : 'TRANSACTION';
          if (item.category === 'coo_wallet_fund') rawTitle = 'SYSTEM WALLET TOP-UP';
          if (item.category === 'coo_portfolio_topup') rawTitle = 'PORTFOLIO CAPITAL TOP-UP';
          
          return {
            id: item.id,
            title: rawTitle,
            category: item.category?.includes('fund') ? 'investment' : item.category?.includes('topup') ? 'investment' : item.category?.includes('reward') ? 'reward' : 'withdrawal',
            status: 'COMPLETED',
            provider: item.reference_id || 'SYSTEM ADMIN',
            date: new Date(item.transaction_date).toLocaleDateString(),
            timestamp: new Date(item.transaction_date).toLocaleTimeString(),
            amount: Number(item.amount),
            isCredit: item.direction === 'cash_in' || item.direction === 'wallet_in'
          };
        });
        setActivities(formattedActivities);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [user, navigate]);

  // ──────────── ONBOARDING TOUR ────────────
  useEffect(() => {
    if (!isLoading && stats && activePage === 'Dashboard') {
      const hasSeenTour = localStorage.getItem('funder_tour_v1');
      if (!hasSeenTour) {
        const driverObj = driver({
          showProgress: true,
          animate: true,
          popoverClass: 'driverjs-theme',
          steps: [
            { popover: { title: 'Welcome to RentFlow', description: 'Let\'s take a complete tour of your new Funder Dashboard. We\'ll walk you through how to manage your capital and monitor your daily passive income.' } },
            { element: '#tour-wallet', popover: { title: 'Your Digital Wallet', description: 'This beautiful card is your central financial hub. It gives you a bird\'s-eye view of your entire RentFlow capital.', side: "bottom", align: 'start' } },
            { element: '#tour-wallet-liquid', popover: { title: 'Liquid Balance', description: 'This is your withdrawable cash. It includes your initial unsettled deposits, top-ups, and all unlocked daily ROI payouts.', side: "bottom", align: 'start' } },
            { element: '#tour-wallet-active', popover: { title: 'Active Capital Bucket', description: 'These indicators separate your idle cash from the funds currently locked inside rent pools generating high-yield returns.', side: "right", align: 'start' } },
            { element: '#tour-wallet-actions', popover: { title: 'Wallet Actions', description: 'Instantly add funds via Mobile Money or Bank Transfer, or seamlessly withdraw your liquid earnings directly to your phone from here.', side: "bottom", align: 'center' } },
            { element: '#tour-portfolio-health', popover: { title: 'Risk & Health Distribution', description: 'A real-time overview of your asset health. Ensure your investments are diversified and performing well within safe parameters.', side: "bottom", align: 'start' } },
            { element: '#tour-portfolio', popover: { title: 'Active Portfolios', description: 'Track the real-time performance of the specific rent pools you have funded. This list updates dynamically as your investments generate compounding payouts every day.', side: "top", align: 'start' } },
            { element: '#tour-recent-activity', popover: { title: 'Immutable Ledger', description: 'A transparent, secure log of all your deposits, withdrawals, and automated daily payouts. You are fully audited.', side: "left", align: 'center' } },
            { element: '#tour-calculator', popover: { title: 'Yield Projections', description: 'Experiment with different capital allocations to accurately predict your compound interest earnings over time.', side: "left", align: 'start' } },
            { element: '#tour-insights', popover: { title: 'Smart Insights', description: 'Our engine constantly analyzes your idle wallet balance and provides one-click personalized opportunities to maximize your yield.', side: "left", align: 'start' } }
          ],
          onDestroyStarted: () => {
            if (!driverObj.hasNextStep() || confirm("Are you sure you want to pause the tour?")) {
              localStorage.setItem('funder_tour_v1', 'true');
              driverObj.destroy();
            }
          },
        });
        
        setTimeout(() => {
          driverObj.drive();
        }, 800);
      }
    }
  }, [isLoading, stats, activePage]);


  const handleVerificationCheck = (actionFn: () => void) => {
    // TEMPORARY: disabled verification requirement
    // if (!user?.isVerified) {
    //   alert("Verification Required. Please complete your KYC profile to use this feature.");
    //   navigate('/funder/kyc');
    //   return;
    // }
    actionFn();
  };

  const displayName =
    user?.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : 'User';

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
          onNewsupport={() => navigate('/funder/portfolio')}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* ──────────── MAIN CONTENT AREA ──────────── */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">

          {/* Desktop top navbar */}
          <FunderDashboardHeader
            user={{ fullName: displayName, role: 'supporter', avatarUrl: '' }}
            pageTitle="Dashboard"
            onMenuClick={() => setMobileMenuOpen(true)}
          />

          {/* ──────────── POLICY OVERLAY DIALOG ──────────── */}
          {user?.has_accepted_platform_terms === false && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldAlert className="w-8 h-8 text-blue-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Platform Agreement</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  To access the Angel Pool and securely deploy capital on the platform, you must legally consent to the 90-day withdrawal rules and the Class B equity lock-up horizons.
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={async () => {
                      const btn = document.getElementById('accept-btn-dash');
                      if (btn) btn.innerHTML = 'Confirming Signature...';
                      try {
                        const resp = await fetch('/api/funder/policy/accept', {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            'Content-Type': 'application/json'
                          }
                        });
                        if (resp.ok) window.location.reload();
                      } catch {
                        alert("Network error.");
                        if (btn) btn.innerHTML = 'I Accept the Terms';
                      }
                    }}
                    id="accept-btn-dash"
                    className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-colors"
                  >
                    I Accept the Terms
                  </button>
                  <button 
                    onClick={() => navigate('/funder/policy')}
                    className="w-full bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Read Full Policy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──────────── VERIFICATION INTERCEPTOR ──────────── */}
          {(user?.has_accepted_platform_terms !== false) && !user?.isVerified && activePage !== 'Portfolio' && activePage !== 'Opportunities' && (() => {
            if (kycStatus === 'UNDER_REVIEW') {
              return (
                <div className="bg-blue-50 border-b border-blue-200 p-4 sm:p-6 flex items-start md:items-center gap-4 shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-blue-900 font-bold text-base">KYC Under Review</h3>
                    <p className="text-blue-700 text-sm mt-0.5">Your identity documents have been received and are being reviewed by our compliance team. This usually takes 24–48 hours.</p>
                  </div>
                </div>
              );
            }
            return (
              <div className="bg-amber-50 border-b border-amber-200 p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
                <div className="flex items-start md:items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-amber-900 font-bold text-base">Profile Verification Required</h3>
                    <p className="text-amber-700 text-sm mt-0.5">You must complete KYC onboarding before you can fund portfolios or withdraw earnings.</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/funder/kyc')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  Complete Profile <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })()}

          {/* ──────────── PAGE BODY ──────────── */}
          {activePage === 'Portfolio' ? (
            <FunderPortfolioPage onAddPortfolio={() => handleVerificationCheck(() => {})} walletBalance={stats?.availableLiquid || 0} />
          ) : activePage === 'Opportunities' ? (
            <FunderOpportunitiesPage walletBalance={stats?.availableLiquid || 0} />
          ) : (
            <div className="flex-1 p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ── LEFT / MAIN COLUMN ── */}
                <div className="lg:col-span-8 flex flex-col gap-8">

                  {/* Wealth Performance Card */}
                  <div id="tour-wallet">
                    <FunderWalletCard
                      totalBalance={stats?.totalBalance || 0}
                      availableLiquid={stats?.availableLiquid || 0}
                      totalInvested={stats?.totalInvested || 0}
                      cardId="WL-99201"
                      onAddFunds={() => navigate('/funder/wallet')}
                      onWithdraw={() => navigate('/funder/wallet')}
                      onPortfolio={() => navigate('/funder/portfolio')}
                    />
                  </div>


                  {/* Quick Actions — mobile only */}
                  <div className="lg:hidden relative">
                    <FunderActionButtons
                      portfolioValue={stats?.totalInvested || 0}
                      roiPercent={stats?.expectedYield || 15}
                    />
                  </div>
                  {/* Portfolio list */}
                  <div id="tour-portfolio">
                    <FunderPortfolioList
                      portfolios={portfolios.slice(0, 3)}
                      onViewAll={() => navigate('/funder/portfolio')}
                      onCardClick={(code) => handleVerificationCheck(() => navigate(`/funder/portfolio/${code}`))}
                      onAddAsset={() => handleVerificationCheck(() => navigate('/funder/portfolio'))}
                    />
                  </div>

                  {/* Portfolio Health Distribution (Replacing Recommended Opportunities) */}
                  <div className="relative w-full" id="tour-portfolio-health">
                    <FunderPortfolioHealth portfolios={portfolios} />
                  </div>

                  {/* Recent Activity — mobile only */}
                  <div className="lg:hidden pb-32">
                    <FunderRecentActivity
                      activities={activities.slice(0, 3)}
                      onViewAll={() => navigate('/funder/wallet')}
                    />
                  </div>
                </div>

                {/* ── RIGHT PANEL (desktop only) ── */}
                <aside className="hidden lg:flex lg:col-span-4 flex-col gap-8">
                  {/* Wallet Quick Actions */}
                  <div className="relative">
                    <FunderActionButtons
                      portfolioValue={stats?.totalInvested || 0}
                      roiPercent={stats?.expectedYield || 15}
                    />
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6" id="tour-recent-activity">
                    <FunderRecentActivity
                      activities={activities.slice(0, 3)}
                      onViewAll={() => navigate('/funder/wallet')}
                    />
                  </div>

                  {/* Interactive Financial Tools */}
                  <div className="relative w-full" id="tour-calculator">
                    <InvestmentCalculator />
                  </div>

                  {/* Investor Insights (Interactive Yield Projection) */}
                  <div
                    className="bg-white rounded-xl border p-6 flex items-start gap-4 shadow-sm"
                    style={{ borderColor: 'var(--color-primary-border)', borderLeft: '4px solid var(--color-primary)' }}
                    id="tour-insights"
                  >
                    <div className="p-2 rounded-full shrink-0 mt-1" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1.5">Smart Insight</h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {(stats?.availableLiquid || 0) > 0 ? (
                          <>
                            You currently have <strong>UGX {(stats?.availableLiquid || 0).toLocaleString()}</strong> resting idle in your wallet. 
                            If you lock this into a standard 12-month compounding pool today, it will instantly project a return of <strong style={{ color: 'var(--color-success)' }}>UGX {((stats?.availableLiquid || 0) * 1.15).toLocaleString()}</strong>!
                          </>
                        ) : (
                          <>
                            Your wallet is perfectly clear! Top up your balance today to start structurally compounding your real estate portfolio yields.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </div>
      </div>
      <FunderBottomNav activePage={activePage} />
    </div>
  );
}
