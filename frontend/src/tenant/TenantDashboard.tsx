import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, ArrowLeft, Home, User, ShieldCheck, HeartHandshake, ArrowRight, Search, Fingerprint } from 'lucide-react';
import { getTenantWallet, getTenantRentProgress } from '../services/tenantApi';
import TenantMenuDrawer from './components/TenantMenuDrawer';
import FullScreenWalletSheet from './components/FullScreenWalletSheet';
import SubscriptionStatusCard from './components/SubscriptionStatusCard';
import CreditAccessCard from './components/CreditAccessCard';
import RentProgressCard from './components/RentProgressCard';
import RecentActivitiesCard from './components/RecentActivitiesCard';

export default function TenantDashboard() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0 });
  const [rentProgress, setRentProgress] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  useEffect(() => {
    getTenantWallet().then(res => setWallet({ balance: res.wallet?.balance || 0 })).catch(console.error);
    getTenantRentProgress().then(setRentProgress).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      
      {/* 1. Purple App Header - Scaled for Desktop */}
      <div className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] pt-6 pb-20 px-6 md:px-12 flex items-center justify-between relative rounded-b-[3rem] shadow-lg shadow-purple-600/20 dark:shadow-none transition-colors duration-300">
         <div className="flex items-center gap-6">
            <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors hidden md:block">
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white tracking-wide">Welile</h1>
         </div>
         

         <div className="flex items-center gap-4">
            <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors relative">
               <Bell size={24} />
               <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#8b5cf6] dark:border-[#6b45c2]"></span>
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2.5 rounded-2xl transition-colors border border-white/10"
            >
               <Menu size={20} />
            </button>
         </div>
      </div>

      {/* Main Content Area - Shifted up over the header curve */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

         {/* Left Column: Profile & AI ID */}
         <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* Profile + Wallet Hero Card */}
            <div 
              onClick={() => setIsWalletOpen(true)}
              className="w-full bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 flex flex-col gap-8 cursor-pointer hover:border-purple-200 dark:hover:border-purple-500/50 transition-colors duration-300"
            >
               
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0 transition-colors">
                        <User size={24} className="text-[#8b5cf6] dark:text-purple-400" />
                     </div>
                     <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Joshua Wanda</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Welile Tenant</p>
                     </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 px-4 py-2 rounded-2xl text-slate-600 dark:text-slate-300 text-sm font-bold shadow-sm transition-colors">
                     0/4
                  </div>
               </div>

               <div className="flex justify-between items-end">
                  <div>
                     <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">USh LOQO</p>
                     <h3 className="text-3xl font-black text-slate-900 dark:text-white">UGX {wallet.balance.toLocaleString()}</h3>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-500/20 transition-colors">
                     Good standing
                  </div>
               </div>
            </div>

            {/* Verification Checklist */}
            <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:border-purple-200 dark:hover:border-purple-500/50 transition-colors duration-300 cursor-pointer group">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={22} className="text-slate-400 dark:text-slate-500 group-hover:text-purple-500 transition-colors" />
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-slate-800 dark:text-white">Ordinary User</span>
                     <span className="text-sm text-slate-400 dark:text-slate-500">AI profile ready</span>
                  </div>
               </div>
               <button className="bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-500/30 transition-colors">
                  <Fingerprint size={16} /> AI ID
               </button>
            </div>

            {rentProgress ? (
              <SubscriptionStatusCard 
                activeRent={rentProgress.activeRent} 
                daysRemaining={rentProgress.daysLeft} 
                amountPaid={rentProgress.amountPaid} 
                totalRepayment={rentProgress.totalRent} 
              />
            ) : (
              <div className="bg-slate-100 dark:bg-slate-800 rounded-[1.75rem] p-6 animate-pulse h-48 w-full transition-colors"></div>
            )}

            <CreditAccessCard creditLimit={3000000} />

         </div>

         {/* Right Column: Actions & Housing */}
         <div className="md:col-span-7 flex flex-col gap-6">

            {/* Request Rent Assistance Card */}
            <div 
              onClick={() => navigate('/rent-request')}
              className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-between group cursor-pointer hover:shadow-[0_8px_30px_rgb(139,92,246,0.1)] dark:hover:border-purple-500/50 transition-all duration-300"
            >
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/30 transition-colors">
                     <HeartHandshake size={28} className="text-[#8b5cf6] dark:text-purple-400" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1 transition-colors">Request Rent Assistance</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm leading-snug transition-colors">Welile will guide and support your rent<br/>request natively.</p>
                  </div>
               </div>
               <ArrowRight size={24} className="text-[#8b5cf6] dark:text-purple-400 mr-2 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Find a House CTA */}
            <div className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] dark:from-[#6b45c2] dark:to-[#5a2e9d] rounded-3xl p-6 shadow-[0_15px_30px_rgb(139,92,246,0.25)] dark:shadow-[0_15px_30px_rgb(0,0,0,0.4)] flex items-center gap-5 cursor-pointer hover:-translate-y-1 transition-all duration-300 group">
               <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Search size={32} className="text-white group-hover:scale-110 transition-transform" />
               </div>
               <div>
                  <h3 className="font-bold text-white text-lg">Find a House Nearby</h3>
                  <p className="text-purple-200 text-sm">To move instantly, for daily rent</p>
               </div>
            </div>

            {rentProgress ? (
              <RentProgressCard 
                amountPaid={rentProgress.amountPaid} 
                totalRent={rentProgress.totalRent} 
                daysLeft={rentProgress.daysLeft} 
                remainingAmount={rentProgress.remainingAmount} 
                currentMonth={rentProgress.currentMonth}
              />
            ) : (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-5 animate-pulse h-32 w-full mt-4 transition-colors"></div>
            )}

            <RecentActivitiesCard />

            {/* Suggested For You Slider */}
            <div className="w-full mt-4">
               <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors">Suggested For You</h3>
                  <button className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors">View all</button>
               </div>
               
               <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                  {/* House Card 1 */}
                  <div className="bg-white dark:bg-slate-800 min-w-[300px] md:min-w-[340px] rounded-3xl p-4 border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none snap-center flex items-center gap-4 transition-colors duration-300">
                     <div className="w-20 h-20 bg-amber-200 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <Home size={28} className="text-amber-800 dark:text-amber-400" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-bold text-slate-800 dark:text-white transition-colors">single room</h4>
                           <span className="font-black text-emerald-500 dark:text-emerald-400 text-sm transition-colors">USh 470k</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-1 transition-colors">Muyenga, Kampala • Water incl.</p>
                        <button className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-sm transition-colors">
                           Chat with Agent
                        </button>
                     </div>
                  </div>
                  
                  {/* House Card 2 */}
                  <div className="bg-white dark:bg-slate-800 min-w-[300px] md:min-w-[340px] rounded-3xl p-4 border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none snap-center flex items-center gap-4 opacity-70 hover:opacity-100 transition-all duration-300">
                     <div className="w-20 h-20 bg-blue-200 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <Home size={28} className="text-blue-800 dark:text-blue-400" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-bold text-slate-800 dark:text-white transition-colors">1 Bedroom Apt</h4>
                           <span className="font-black text-emerald-500 dark:text-emerald-400 text-sm transition-colors">USh 800k</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-1 transition-colors">Ntinda, Kampala • Sec...</p>
                        <button className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-sm transition-colors">
                           Chat with Agent
                        </button>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

      <TenantMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <FullScreenWalletSheet isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} balance={wallet.balance} />
    </div>
  );
}
