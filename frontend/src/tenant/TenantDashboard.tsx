import { useState, useEffect } from 'react';
import { ArrowRight, MoreHorizontal, TrendingUp } from 'lucide-react';
import { getTenantWallet, getTenantRentProgress, getAiIdProfile, getTenantAgreementStatus } from '../services/tenantApi';
import TenantSidebar from './components/TenantSidebar';
import TenantDashboardHeader from './components/TenantDashboardHeader';
import FullScreenWalletSheet from './components/FullScreenWalletSheet';
import { useAuth } from '../contexts/AuthContext';

// New Architecture Components
import TenantAgreementNotice from './components/TenantAgreementNotice';
import VerificationChecklist from './components/VerificationChecklist';
import SubscriptionStatusCard from './components/SubscriptionStatusCard';
import RentRequestCTA from './components/RentRequestCTA';
import HouseDiscoveryPreview from './components/HouseDiscoveryPreview';
import TenantAgreementModal from './components/TenantAgreementModal';

export default function TenantDashboard() {

  const { user } = useAuth();
  const [wallet, setWallet] = useState({ balance: 0 });
  const [rentProgress, setRentProgress] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [activePage, setActivePage] = useState<string>('Dashboard');
  const [aiProfile, setAiProfile] = useState<any>(null);

  // Simulated validation states for new modules
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(null);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [isVerified] = useState(false);

  useEffect(() => {
    getTenantWallet().then(res => setWallet({ balance: res.wallet?.balance || 0 })).catch(console.error);
    getTenantRentProgress().then(setRentProgress).catch(console.error);
    getAiIdProfile().then(setAiProfile).catch(console.error);
    getTenantAgreementStatus().then(res => setHasAcceptedTerms(res.hasAcceptedTerms)).catch(() => setHasAcceptedTerms(false));
  }, []);

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : 'Joshua Wanda';

  const amountPaid = rentProgress?.amountPaid || 0;
  const totalRent = rentProgress?.totalRent || 1; // Prevent division by 0
  const remainingRent = Math.max(0, totalRent - amountPaid);
  const percentPaid = Math.min(100, Math.round((amountPaid / totalRent) * 100));

  const chartStyle = {
    background: `conic-gradient(from 0deg, #0f4cac 0%, #0f4cac ${percentPaid}%, #e2e8f0 ${percentPaid}%, #e2e8f0 100%)`
  };

  return (
    <div className="min-h-screen font-sans bg-[#f7f9fc] text-slate-800">
      <div className="flex h-screen overflow-hidden">
        
        <TenantSidebar
          activePage={activePage}
          onNavigate={(page) => setActivePage(page)}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          <TenantDashboardHeader
            user={{ fullName: displayName, role: 'tenant', avatarUrl: '' }}
            onMenuClick={() => setMobileMenuOpen(true)}
          />

          <div className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col gap-8">

              {/* Top Banner Area */}
              {hasAcceptedTerms === false && <TenantAgreementNotice onClick={() => setShowAgreementModal(true)} />}

              {/* ────────────────── TOP HERO PANEL ────────────────── */}
              <div 
                onClick={() => setIsWalletOpen(true)}
                className="w-full rounded-2xl p-8 lg:p-10 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-center"
                style={{ background: '#9234eb' }}
              >
                <div className="flex justify-between items-start lg:items-center w-full z-10 flex-col lg:flex-row gap-6">
                   <div>
                     <p className="text-blue-200/80 text-[11px] font-bold tracking-widest uppercase mb-1">Tenant Wallet Balance</p>
                     <div className="flex items-baseline gap-3">
                       <h2 className="text-4xl lg:text-[56px] font-black text-white tracking-tight leading-none">
                         {wallet.balance.toLocaleString()}
                       </h2>
                       <span className="text-blue-200 text-lg font-medium">UGX</span>
                     </div>
                     <div className="mt-4 flex items-center gap-3">
                       <span className="bg-[#4ade80] text-emerald-950 px-3 py-1 rounded-full text-xs font-bold leading-none tracking-wide">
                         +8.4%
                       </span>
                       <span className="text-blue-300 text-[10px] font-semibold tracking-wider uppercase">UPDATED 2 MINUTES AGO</span>
                     </div>
                   </div>
                   
                   <button className="text-white text-sm font-semibold hover:text-blue-200 transition-colors flex items-center gap-2 group self-start lg:self-center mt-[-10px] lg:mt-0">
                     View your E-Statement <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>


              {/* ────────────────── MIDDLE TIER ────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                 
                 {/* Middle Left: Rent Distribution & Specs */}
                 <div className="lg:col-span-8 flex flex-col">
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-8 flex flex-col">
                      <div className="flex justify-between items-start w-full mb-8">
                         <div>
                           <h3 className="text-xl font-bold text-slate-900 tracking-tight">Rent Distribution</h3>
                           <p className="text-sm font-medium text-slate-500 mt-1">Rent Paid vs. Remaining Balance</p>
                         </div>
                         <button className="text-slate-400 hover:text-slate-600">
                           <MoreHorizontal className="w-5 h-5" />
                         </button>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 flex-1">
                         
                         {/* Pure CSS Donut Chart */}
                         <div className="relative w-48 h-48 rounded-full flex items-center justify-center shrink-0" style={chartStyle}>
                            <div className="absolute inset-0 m-4 bg-white rounded-full flex flex-col items-center justify-center">
                               <span className="text-3xl font-black text-slate-900">{percentPaid}%</span>
                               <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Paid</span>
                            </div>
                         </div>

                         {/* Stats Blocks */}
                         <div className="flex items-center gap-4 flex-1 w-full justify-center md:justify-start">
                            <div className="bg-[#f7f9fc] rounded-2xl p-6 flex-1 min-w-[140px]">
                              <p className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-2">Rent Paid</p>
                              <p className="text-2xl font-bold text-slate-900 mb-1">{amountPaid.toLocaleString()}</p>
                              <p className="text-xs text-slate-500 leading-tight">Current active cycle partial completion</p>
                            </div>
                            
                            <div className="bg-[#f7f9fc] rounded-2xl p-6 flex-1 min-w-[140px]">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-[#84cc16]"></span>
                                <p className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">Remaining</p>
                              </div>
                              <p className="text-2xl font-bold text-slate-900 mb-1">{remainingRent.toLocaleString()}</p>
                              <p className="text-xs font-bold text-emerald-600 mb-1">Active Debt</p>
                              <p className="text-[10px] text-slate-800 font-bold uppercase tracking-wider">{rentProgress?.daysLeft || 0} Days left</p>
                            </div>
                         </div>
                      </div>
                    </div>
                    
                    {/* Integrated Specification Components */}
                    <SubscriptionStatusCard />
                    <VerificationChecklist isVerified={isVerified} />
                 </div>

                 {/* Middle Right: Actions & Forecasts */}
                 <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
                    
                    {/* Primary Tenant CTA replacing simple Last Transaction block */}
                    <RentRequestCTA />

                    {/* AI ID Profile Snapshot */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 flex flex-col flex-1 relative overflow-hidden">
                       <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${aiProfile ? 'bg-[#7e22ce]' : 'bg-[#0c3114]'}`}></div>

                       <div className="flex justify-between items-center mb-6 pl-2">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${aiProfile ? 'bg-[#f3e8ff] text-[#7e22ce]' : 'bg-[#f0f9f1] text-[#16a34a]'}`}>
                           <TrendingUp className="w-5 h-5" />
                         </div>
                         <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Credit Access Limit</span>
                       </div>
                       
                       <p className="text-sm font-semibold text-slate-600 mb-2 pl-2">Estimated Borrowing Limit</p>
                       <div className="flex items-baseline gap-2 mb-4 pl-2">
                         <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">
                           {aiProfile ? `UGX ${aiProfile.estimated_borrowing_limit.toLocaleString()}` : 'Calculating...'}
                         </h3>
                       </div>

                       {aiProfile && (
                         <div className="flex justify-between items-center pl-2 mt-2">
                            <span className="text-xs font-semibold text-slate-500">Risk Score: {aiProfile.risk_score}/100</span>
                            <span className="text-xs font-bold text-purple-600">Level: {aiProfile.risk_level}</span>
                         </div>
                       )}

                       <div className="w-full h-2 rounded-full bg-slate-100 mt-auto ml-2 overflow-hidden flex">
                          <div className={`h-full transition-all duration-1000 ${aiProfile ? 'bg-[#9333ea]' : 'bg-[#20502a]'}`} style={{ width: `${aiProfile ? Math.min(aiProfile.risk_score, 100) : 0}%` }} />
                       </div>
                    </div>

                 </div>

              </div>


              {/* ────────────────── BOTTOM TIER ────────────────── */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-4 lg:-mt-4 relative z-20">
                 
                 {/* Replaced old Retirement Projection with the Discovery Market component */}
                 <HouseDiscoveryPreview />

              </div>

            </div>
          </div>
        </div>
      </div>
      
      <FullScreenWalletSheet isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} balance={wallet.balance} />
      
      <TenantAgreementModal 
        isOpen={showAgreementModal} 
        onClose={() => setShowAgreementModal(false)} 
        onSuccess={() => {
          setHasAcceptedTerms(true);
          setShowAgreementModal(false);
        }} 
      />
    </div>
  );
}
