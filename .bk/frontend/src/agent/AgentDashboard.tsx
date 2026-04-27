import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgentDashboardSummary } from './hooks/useAgentQueries';
import { 
  Bell, 
  Menu, 
  Users, 
  User, 
  Fingerprint, 
  Award, 
  ChevronRight, 
  Calendar, 
  Star, 
  Home,
  CheckCircle2,
  Trophy,
  Wallet,
  MapPin,
  TrendingUp,
  Banknote
} from 'lucide-react';
import AgentRegisterDialog from './components/dialogs/AgentRegisterDialog';
import AgentTopUpTenantDialog from './components/dialogs/AgentTopUpTenantDialog';
import AgentMenuDrawer from './components/AgentMenuDrawer';
import { default as FullScreenWalletSheet } from '../tenant/components/FullScreenWalletSheet';
import VisitPaymentWizard from './components/VisitPaymentWizard';
import AgentSidebar from './components/AgentSidebar';
import AgentDashboardHeader from './components/AgentDashboardHeader';

export default function AgentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isVisitWizardOpen, setIsVisitWizardOpen] = useState(false);
  const { data: summaryData } = useAgentDashboardSummary();
  
  const summary = summaryData || {
    visits_today: 0,
    collections_count: 0,
    collections_amount: 0,
    float_limit: 0,
    collected_today: 0,
    wallet_balance: 0,
    commission_earned: 0,
    tenants_count: 0
  };

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "JOSHUA WANDA";
  const formattedBalance = `USh ${(summary.wallet_balance || 0).toLocaleString()}`;
  const formattedCommission = `USh${(summary.commission_earned || 2000).toLocaleString().replace(/,000$/, 'K')}`;

  return (
    <div className="flex h-screen overflow-hidden bg-white/50 font-['Public_Sans'] text-slate-900">
      
      {/* Sidebar for Desktop */}
      <AgentSidebar 
        activePage="Dashboard" 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={(page: string) => {
          if (page === 'Dashboard') setIsMenuOpen(false);
        }}
      />
      
      {/* Main Window */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <AgentDashboardHeader 
          user={{ fullName: userName, role: 'agent', isVerified: false }} 
          pageTitle="Dashboard" 
          onMenuClick={() => setIsMenuOpen(true)} 
        />
        
        {/* Adjusted padding to center layout similar to screenshot */}
        <div className="flex-1 p-4 lg:p-6 pb-24 max-w-lg mx-auto w-full space-y-4">
          
          {/* Profile Header section */}
          <div className="flex items-center justify-between mb-2 mt-4">
             <div className="flex items-center gap-3">
                <div className="size-12 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex-shrink-0">
                   <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                   <div className="flex items-center gap-1">
                      <h2 className="text-[15px] font-black uppercase tracking-tight text-slate-900">{userName}</h2>
                      {/* Checkmark icon equivalent */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   </div>
                   <p className="text-xs text-slate-500 font-medium">Welile Agent</p>
                </div>
             </div>
             
             <button 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-100" 
                onClick={() => navigate('/agent-edit-profile')}
             >
                <Fingerprint size={12} className="text-purple-600" />
                <span className="text-[10px] font-bold text-purple-600 tracking-wider">AI ID</span>
             </button>
          </div>

          {/* Unified Bold Wallet Card */}
          <div 
             className="bg-gradient-to-br from-[#8026db] to-[#610ebd] rounded-3xl p-5 text-white shadow-xl shadow-purple-900/20 relative overflow-hidden cursor-pointer"
             onClick={() => setIsWalletOpen(true)}
          >
             {/* Background flares */}
             <div className="absolute top-0 right-0 size-48 bg-purple-500/30 rounded-full blur-3xl rounded-tr-3xl pointer-events-none border-t border-r border-white/20"></div>
             
             <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                   <Wallet size={16} className="text-white/80" />
                   <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">Agent Wallet</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                   <div className="size-1.5 rounded-full bg-green-400"></div>
                   <span className="text-[9px] uppercase font-bold tracking-widest text-white/90">Active</span>
                </div>
             </div>
             
             <div className="relative z-10 mb-6 flex flex-col items-center text-center">
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/70 mb-1">Total Balance?</span>
                <h3 className="text-4xl font-extrabold tracking-tighter drop-shadow-sm mb-1">{formattedBalance}</h3>
                <p className="text-sm font-bold text-white/90">Withdrawable: {formattedCommission}</p>
             </div>
             
             <div className="grid grid-cols-3 gap-2 relative z-10 mb-2">
                <div className="bg-white/10 rounded-xl p-2.5 flex flex-col items-center justify-center border border-white/10 backdrop-blur-sm">
                   <Users size={16} className="text-white/80 mb-1" />
                   <span className="text-sm font-bold">{summary.tenants_count || 0}</span>
                   <span className="text-[8px] uppercase font-bold tracking-widest text-white/70 mt-0.5">Tenants</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 flex flex-col items-center justify-center border border-white/10 backdrop-blur-sm">
                   <Banknote size={16} className="text-white/80 mb-1" />
                   <span className="text-sm font-bold">{formattedCommission}</span>
                   <span className="text-[8px] uppercase font-bold tracking-widest text-white/70 mt-0.5">Earned</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 flex flex-col items-center justify-center border border-white/10 backdrop-blur-sm relative" onClick={(e) => { e.stopPropagation(); navigate('/agent-commission-benefits'); }}>
                   <Award size={16} className="text-white/80 mb-1" />
                   <span className="text-sm font-bold">{formattedCommission}</span>
                   <div className="flex items-center gap-0.5 mt-0.5">
                      <span className="text-[8px] uppercase font-bold tracking-widest text-white/70">Commission</span>
                      <ChevronRight size={10} className="text-white/70" />
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-1 text-white/60 pt-1 relative z-10">
                <MapPin size={10} />
                <span className="text-[9px] font-medium tracking-wide">Welile Agent</span>
             </div>
          </div>

          {/* Ranking & Milestones */}
          <div 
             className="bg-purple-50 rounded-2xl p-3.5 border border-purple-100 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
             onClick={() => navigate('/agent-kyc')}
          >
             <div className="flex items-center gap-3">
                <div className="text-purple-600">
                   <Trophy size={18} />
                </div>
                <div className="flex items-center gap-2">
                   <span className="font-bold text-sm text-purple-900 border-b border-purple-300">Rising Star</span>
                   <span className="text-[10px] text-purple-600/70 font-bold bg-white px-2 py-0.5 rounded-full">1/4 verified</span>
                </div>
             </div>
             <ChevronRight size={16} className="text-purple-400" />
          </div>

          {/* Daily Rent Expected */}
          <div 
             className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
             onClick={() => navigate('/agent-daily-ops')}
          >
             <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                   <Calendar size={20} strokeWidth={2} />
                </div>
                <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Daily Rent Expected</p>
                   <h3 className="text-base font-black text-slate-900 tracking-tight">USh 0</h3>
                </div>
             </div>
             <span className="text-[10px] text-slate-400 font-bold">/day</span>
          </div>

          {/* Success Box - All Clear */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
             <div className="bg-emerald-100 text-emerald-600 rounded-full p-1 border border-emerald-200 mt-0.5">
                <CheckCircle2 size={16} />
             </div>
             <div>
                <h4 className="font-bold text-sm text-emerald-800">All clear!</h4>
                <p className="text-xs text-emerald-600/80 mt-0.5">No outstanding collections today</p>
             </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-3 gap-2">
             <div onClick={() => setIsTopUpDialogOpen(true)} className="bg-purple-50/50 hover:bg-purple-50 rounded-2xl py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border border-purple-100/50">
                <Banknote size={22} className="text-purple-600" />
                <span className="text-[11px] font-bold text-purple-800 tracking-tight">Pay Rent</span>
             </div>
             <div onClick={() => setIsRegisterDialogOpen(true)} className="bg-purple-50/50 hover:bg-purple-50 rounded-2xl py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border border-purple-100/50">
                <Users size={22} className="text-purple-600" />
                <span className="text-[11px] font-bold text-purple-800 tracking-tight text-center leading-tight">Add Tenant</span>
             </div>
             <div onClick={() => navigate('/agent/clients')} className="bg-purple-50/50 hover:bg-purple-50 rounded-2xl py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border border-purple-100/50">
                <User size={22} className="text-purple-600" />
                <span className="text-[11px] font-bold text-purple-800 tracking-tight">Tenants</span>
             </div>
             <div onClick={() => navigate('/agent-list-house')} className="bg-purple-50/50 hover:bg-purple-50 rounded-2xl py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border border-purple-100/50">
                <Home size={22} className="text-purple-600" />
                <span className="text-[11px] font-bold text-purple-800 tracking-tight text-center leading-tight">List House</span>
             </div>
             <div onClick={() => navigate('/agent-advance-request')} className="bg-purple-50/50 hover:bg-purple-50 rounded-2xl py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border border-purple-100/50">
                <TrendingUp size={22} className="text-purple-600" />
                <span className="text-[11px] font-bold text-purple-800 tracking-tight">Credit</span>
             </div>
             <div onClick={() => setIsMenuOpen(true)} className="bg-white hover:bg-slate-50 rounded-2xl py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-200">
                <Menu size={22} className="text-slate-700" />
                <span className="text-[11px] font-bold text-slate-800 tracking-tight">Agent Hub</span>
             </div>
          </div>

          {/* Streak Section */}
          <div 
             className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mt-2 cursor-pointer"
             onClick={() => setIsVisitWizardOpen(true)}
          >
             <div className="flex items-start gap-3">
                <Star size={20} className="text-slate-400 mt-0.5" />
                <div>
                   <h3 className="font-bold text-sm text-slate-900">Start Collecting!</h3>
                   <p className="text-[10px] text-slate-500 font-bold mb-1.5">Best: 0 days</p>
                   <p className="text-[11px] text-slate-600 leading-snug">Collect from any tenant today to start your streak!</p>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Dialogs & Menus */}
      <AgentRegisterDialog isOpen={isRegisterDialogOpen} onClose={() => setIsRegisterDialogOpen(false)} />
      <AgentTopUpTenantDialog isOpen={isTopUpDialogOpen} onClose={() => setIsTopUpDialogOpen(false)} />
      <AgentMenuDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onOpenRegister={() => setIsRegisterDialogOpen(true)} 
        onOpenTopUp={() => setIsTopUpDialogOpen(true)} 
      />
      <FullScreenWalletSheet isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} balance={summary.wallet_balance || 0} />
      <VisitPaymentWizard isOpen={isVisitWizardOpen} onClose={() => setIsVisitWizardOpen(false)} />
    </div>
  );
}
