import React, { useState, useEffect } from 'react';
import { Home, CalendarDays, Wallet, Trophy, Target, ShieldPlus, Gift, MapPin, Zap } from 'lucide-react';
import FullScreenWalletSheet from './components/FullScreenWalletSheet';
import { getTenantRentProgress, getTenantWallet } from '../services/tenantApi';

export default function TenantDashboard() {
  const [wallet, setWallet] = useState({ balance: 0 });
  const [activeRent, setActiveRent] = useState({
    amountPaid: 0,
    totalRent: 0,
    daysLeft: 0,
    remainingAmount: 0,
    currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  });

  const [isWalletOpen, setIsWalletOpen] = useState(false);

  useEffect(() => {
    getTenantWallet().then(res => setWallet({ balance: res.wallet?.balance || 0 })).catch(console.error);
    getTenantRentProgress().then(setActiveRent).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white w-full p-6 md:p-10 font-sans selection:bg-purple-200 text-slate-900">
      
      {/* 1. Header Array */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
         <div>
            <h1 className="text-4xl font-black text-purple-700 tracking-tight">
              Welcome back, Mock
            </h1>
            <p className="text-purple-400 font-semibold tracking-wide uppercase text-xs mt-2 flex items-center gap-2">
               <Zap size={14} className="fill-purple-400" /> All Systems Operational
            </p>
         </div>
         <button 
           onClick={() => setIsWalletOpen(true)}
           className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-purple-600/30 transition-all hover:-translate-y-1 flex items-center gap-3"
         >
           <Wallet size={20} />
           Open Universal Wallet
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto">

         {/* 2. Financial Status Array (Wallet & Rent) */}
         <div className="lg:col-span-2 bg-gradient-to-br from-purple-700 to-purple-900 rounded-[32px] p-8 text-white shadow-2xl shadow-purple-900/20 relative overflow-hidden group">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 blur-3xl rounded-full group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="flex justify-between items-end relative z-10">
               <div>
                  <p className="text-purple-200 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</p>
                  <h2 className="text-5xl font-black tracking-tighter">UGX {wallet.balance.toLocaleString()}</h2>
               </div>
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                  <Wallet size={32} className="text-white drop-shadow-md" />
               </div>
            </div>
            
            {/* Rent Progress Injected Natively Inside Prime Card */}
            <div className="mt-12 bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
               <div className="flex justify-between text-sm font-bold mb-3">
                  <span className="text-white flex items-center gap-2"><Home size={16} /> Paid (UGX {activeRent.amountPaid.toLocaleString()})</span>
                  <span className="text-purple-200">Total: UGX {activeRent.totalRent.toLocaleString()}</span>
               </div>
               <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-white rounded-full relative" style={{ width: `${Math.min((activeRent.amountPaid / (activeRent.totalRent || 1)) * 100, 100)}%` }}>
                     <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>
                  </div>
               </div>
               <div className="flex justify-between items-center mt-4">
                  <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest bg-emerald-900/30 px-3 py-1 rounded-full">{activeRent.daysLeft} Days Left</p>
                  <button className="text-xs font-bold text-white uppercase tracking-widest hover:text-purple-300 transition-colors">View Schedule →</button>
               </div>
            </div>
         </div>

         {/* 3. Engagement Array (Streaks & Badges) */}
         <div className="bg-white border-2 border-purple-100 rounded-[32px] p-8 shadow-xl shadow-purple-900/5 flex flex-col justify-between hover:border-purple-300 transition-colors">
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                 <Trophy size={24} className="fill-orange-600" />
               </div>
               <div>
                 <h3 className="font-bold text-slate-800">Streak Plaque</h3>
                 <p className="text-xs text-slate-500 font-medium mt-1">Consistency Tracker</p>
               </div>
            </div>
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-purple-200">
               <p className="text-5xl font-black text-purple-600 tracking-tighter drop-shadow-sm">12</p>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Days Paid Early</p>
            </div>
         </div>

         {/* 4. Credit Array (Access Limit) */}
         <div className="bg-white border-2 border-purple-100 rounded-[32px] p-8 shadow-xl shadow-purple-900/5 hover:border-purple-300 transition-colors">
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                 <ShieldPlus size={24} className="fill-emerald-600" />
               </div>
               <div>
                 <h3 className="font-bold text-slate-800">Trust Limit</h3>
                 <p className="text-xs text-slate-500 font-medium mt-1">Available Credit</p>
               </div>
            </div>
            <div>
               <p className="text-3xl font-black text-slate-800">UGX 50,000</p>
               <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full"></div>
               </div>
               <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">Limit derived from payment streaks and Verified Referrals.</p>
            </div>
         </div>

         {/* 5. Housing Configuration Array */}
         <div className="bg-white border-2 border-purple-100 rounded-[32px] p-8 shadow-xl shadow-purple-900/5 hover:border-purple-300 transition-colors lg:col-span-2 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-purple-50 to-transparent"></div>
            <div className="relative z-10 w-2/3">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <MapPin size={12} /> Housing Operations
               </div>
               <h3 className="text-2xl font-black text-slate-800 leading-tight">Searching for a new verified property?</h3>
               <p className="text-sm font-medium text-slate-500 mt-2">Access the agent-verified Daily Rent property catalog natively powered by Postgres spatial geometries.</p>
               <button className="mt-6 bg-slate-900 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                  Open Explorer
               </button>
            </div>
            <div className="relative z-10 p-6 bg-white shadow-xl shadow-purple-900/10 rounded-2xl border border-purple-100 rotate-3 group-hover:rotate-0 transition-transform">
               <Home size={48} className="text-purple-200" />
            </div>
         </div>

         {/* 6. Ecosystem Extensions */}
         <div className="bg-purple-600 text-white rounded-[32px] p-8 shadow-xl shadow-purple-900/20 relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
            <Gift size={32} className="text-purple-300 mb-6" />
            <h3 className="text-xl font-bold mb-2">Referral Engine</h3>
            <p className="text-sm text-purple-200 mb-6">Invite 3 friends to earn UGX 15,000 instantly.</p>
            <button className="w-full bg-white text-purple-700 px-4 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
               Copy Invite Link
            </button>
         </div>

         {/* Welile Homes Subscription Card */}
         <div className="bg-white border-2 border-slate-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
               <Target size={24} className="text-slate-400" />
             </div>
             <h3 className="font-bold text-slate-800">Welile Homes</h3>
             <p className="text-xs text-slate-500 mt-2">Connect your landlord to enable digital lease enforcement and property scores.</p>
             <button className="mt-4 text-purple-600 text-sm font-bold hover:underline">Setup Agreement</button>
         </div>

      </div>

      <FullScreenWalletSheet
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balance={wallet.balance}
      />
    </div>
  );
}
