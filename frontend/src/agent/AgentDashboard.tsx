import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummary } from '../services/agentApi';
import toast from 'react-hot-toast';
import { 
  Bell, 
  Menu, 
  Users, 
  ChevronDown, 
  User, 
  Fingerprint, 
  Wallet, 
  Award, 
  ChevronRight, 
  Calendar, 
  Star, 
  Target, 
  AlertTriangle, 
  Landmark, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  History, 
  Banknote, 
  FileText, 
  Home, 
  WalletCards, 
  Building2 
} from 'lucide-react';
import AgentRegisterDialog from './components/dialogs/AgentRegisterDialog';
import AgentTopUpTenantDialog from './components/dialogs/AgentTopUpTenantDialog';
import AgentMenuDrawer from './components/AgentMenuDrawer';
import { default as FullScreenWalletSheet } from '../tenant/components/FullScreenWalletSheet';

export default function AgentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [summary, setSummary] = useState<any>({
    visits_today: 0,
    collections_count: 0,
    collections_amount: 0,
    float_limit: 0,
    collected_today: 0,
    wallet_balance: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
         const data = await getDashboardSummary();
         setSummary(data);
      } catch (err: any) {
         console.error('Failed to fetch stats', err);
      }
    };
    fetchSummary();
  }, []);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Joshua Wanda";

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#121212] min-h-screen text-slate-900 dark:text-slate-100 pb-24 font-['Public_Sans']">
      
      {/* 1. Header (Fixed Purple Bar) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#8b5cf6] dark:bg-[#6d28d9] px-4 py-4 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Logo */}
          <h1 className="text-white text-xl font-bold tracking-wide">Welile</h1>
          
          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer">
              <Bell size={22} className="text-white" />
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border border-[#8b5cf6]"></div>
            </div>
            <div 
              onClick={() => setIsMenuOpen(true)}
              className="p-1.5 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
            >
              <Menu size={20} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 px-4 max-w-md mx-auto space-y-4">
        
        {/* Consolidated Profile & Wallet Card */}
        <div className="bg-gradient-to-br from-[#9333ea] to-[#6d28d9] rounded-[28px] p-6 shadow-[0_8px_30px_rgb(147,51,234,0.3)] text-white relative overflow-hidden cursor-pointer active:scale-95 transition-transform" onClick={() => setIsWalletOpen(true)}>
          {/* Decorative background glow */}
          <div className="absolute -right-8 -top-8 size-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-8 -bottom-8 size-32 bg-purple-400/20 rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                <User size={20} className="fill-white/80" />
              </div>
              <div className="text-left">
                <p className="text-[11px] text-white/70 font-medium tracking-wide">Welcome back,</p>
                <h2 className="text-base font-bold leading-tight shadow-sm">{userName}</h2>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); /* AI ID trigger logic here */ }}>
              <Fingerprint size={14} className="text-white shadow-sm" />
              <span className="text-xs font-bold text-white tracking-wide shadow-sm">AI ID</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10 items-end">
            <div>
               <p className="text-[9px] text-white/70 font-bold uppercase tracking-[0.15em] mb-1.5">Withdrawable</p>
               <h3 className="text-3xl font-black tracking-tighter drop-shadow-sm">UGX {(summary.wallet_balance || 0).toLocaleString()}</h3>
            </div>
            <div className="pl-4 border-l border-white/20">
               <p className="text-[9px] text-white/70 font-bold uppercase tracking-[0.15em] mb-1.5">Commission Earned</p>
               <h3 className="text-xl font-bold tracking-tight drop-shadow-sm">UGX {(summary.commission_earned || 0).toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* 9. Action Map Grids */}
        <div className="grid grid-cols-3 gap-y-8 gap-x-2 py-6 px-2">
           {/* Row 1 */}
           <div onClick={() => setIsTopUpDialogOpen(true)} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="text-[#8b5cf6] dark:text-[#a78bfa] group-hover:scale-110 transition-transform">
                 <Banknote size={26} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-[#8b5cf6] dark:text-[#a78bfa]">Pay Rent</span>
           </div>
           <div onClick={() => navigate('/agent-rent-requests')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                 <FileText size={26} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400">Post Request</span>
           </div>
           <div onClick={() => navigate('/dashboard/agent/clients')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="text-[#8b5cf6] dark:text-[#a78bfa] group-hover:scale-110 transition-transform">
                 <Users size={26} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-[#8b5cf6] dark:text-[#a78bfa]">Tenants</span>
           </div>

           {/* Row 2 */}
           <div onClick={() => navigate('/agent-list-house')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
                 <Home size={26} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-orange-500 dark:text-orange-400">List House</span>
           </div>
           <div onClick={() => navigate('/agent-advance-request')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
                 <TrendingUp size={26} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-orange-500 dark:text-orange-400">Credit</span>
           </div>
           <div onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform">
                 <Menu size={26} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300">Agent Hub</span>
           </div>
        </div>

        {/* 4. Verification Progress Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
             <Award size={20} className="text-slate-400 dark:text-slate-500" />
             <span className="font-bold text-sm text-slate-900 dark:text-white">Ordinary User</span>
             <span className="text-sm text-slate-500 dark:text-slate-400">0/4 verified</span>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </div>

        {/* 5. Daily Rent Expected */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
           <div className="size-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-400">
              <Calendar size={24} strokeWidth={1.5} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Daily Rent Expected</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">USh 0</h3>
                 <span className="text-xs text-slate-500 dark:text-slate-400">/day</span>
              </div>
           </div>
        </div>

        {/* 6. Streak Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 space-y-2 relative overflow-hidden">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Star size={20} className="text-slate-400 dark:text-slate-500" />
                 <h3 className="font-bold text-sm text-slate-900 dark:text-white">Start Collecting!</h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">7 days to go</span>
           </div>
           <p className="text-xs text-slate-400 dark:text-slate-500">Best: 0 days</p>
           <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">Collect from any tenant today to start your streak!</p>
        </div>

        {/* 7. Priority Collections Widget */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-100 dark:border-red-900/50 flex items-center justify-between cursor-pointer" onClick={() => navigate('/agent-daily-ops')}>
           <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-500">
                 <Target size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-sm text-slate-900 dark:text-white">Priority Collections</h4>
                 <p className="text-xs text-red-500 dark:text-red-400">Tap to see who needs collection first</p>
              </div>
           </div>
           <AlertTriangle size={20} className="text-red-500" />
        </div>

        {/* 8. Landlord Float Widget */}
        <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/40 overflow-hidden mt-6">
           <div className="p-4 relative">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 relative z-10">Landlord Float</p>
              <div className="flex items-start gap-3 relative z-10">
                 <div className="size-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex justify-center items-center text-orange-500 shrink-0 mt-1">
                    <Landmark size={20} />
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pay Landlord via MoMo</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">Withdraw from float → Pay landlord → Upload receipt + GPS</p>
                 </div>
                 <button className="flex items-center gap-1 text-orange-500 font-bold text-sm mt-1">
                    Pay <ArrowRight size={16} />
                 </button>
              </div>
           </div>
           
           <div className="grid grid-cols-3 divide-x divide-orange-100 dark:divide-orange-900/40 border-t border-orange-100 dark:border-orange-900/40">
              <button className="py-3 flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                 <TrendingUp size={14} /> Recovery
              </button>
              <button className="py-3 flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                 <ShieldCheck size={14} /> Status
              </button>
              <button className="py-3 flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                 <History size={14} /> History
              </button>
           </div>
        </div>


      </main>

      {/* 10. Floating 'Verify & Earn' Button */}
      <div className="fixed bottom-24 right-4 z-40">
         <button className="bg-gradient-to-r from-[#9333ea] to-[#7e22ce] text-white rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(147,51,234,0.3)] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all outline-none">
            <ShieldCheck size={20} className="fill-white/20" />
            <span className="text-sm font-bold tracking-wide">Verify & Earn</span>
            <div className="size-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold ml-1">
               0
            </div>
         </button>
      </div>

      {/* 11. Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1e1e1e] border-t border-slate-100 dark:border-slate-800 px-6 py-2 pb-safe">
         <div className="flex items-center justify-between max-w-md mx-auto">
            {/* Tenant Tab */}
            <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1.5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
               <Home size={22} />
               <span className="text-[10px] font-medium">Tenant</span>
            </button>
            
            {/* Agent Tab (Active) */}
            <button className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/30 px-6 py-2 rounded-2xl">
               <div className="relative">
                  <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8b5cf6]"></span>
                  </span>
                  <Users size={22} className="text-[#8b5cf6] dark:text-purple-400" />
               </div>
               <div className="w-5 h-1 bg-[#8b5cf6] rounded-full mt-2"></div>
            </button>

            {/* Funder Tab */}
            <button className="flex flex-col items-center gap-1.5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
               <WalletCards size={22} />
               <span className="text-[10px] font-medium">Funder</span>
            </button>

            {/* Owner Tab */}
            <button className="flex flex-col items-center gap-1.5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
               <Building2 size={22} />
               <span className="text-[10px] font-medium">Owner</span>
            </button>
         </div>
      </nav>

      <AgentRegisterDialog 
        isOpen={isRegisterDialogOpen} 
        onClose={() => setIsRegisterDialogOpen(false)} 
      />

      <AgentTopUpTenantDialog
        isOpen={isTopUpDialogOpen}
        onClose={() => setIsTopUpDialogOpen(false)}
      />

      <AgentMenuDrawer 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenRegister={() => setIsRegisterDialogOpen(true)}
      />

      <FullScreenWalletSheet 
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balance={summary.wallet_balance || 0}
      />
    </div>
  );
}
