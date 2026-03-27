import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ArrowLeft, Home, TrendingUp, Flame, Trophy, Key, Target, Sparkles, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TenantWelileHomes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`/api/v1/welile-homes/tenant/${user.id}/dashboard`)
      .then(res => {
         setDashboardData(res.data);
         setLoading(false);
      })
      .catch(err => {
         console.error('Gamification mount failed:', err);
         setLoading(false);
      });
  }, [user]);

  if (loading || !dashboardData) {
     return (
       <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900 pb-20 flex flex-col items-center justify-center transition-colors">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Syncing Engine...</p>
       </div>
     );
  }

  const { target_goal, current_savings, payment_streak_months, next_milestone, trophies, historical_data } = dashboardData;
  const progressPercent = Math.round((current_savings / target_goal) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-purple-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="w-full bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] dark:from-[#0f0d24] dark:via-[#191742] dark:to-[#260e4c] pt-6 pb-28 px-6 md:px-12 relative rounded-b-[2.5rem] shadow-xl shadow-indigo-900/20 dark:shadow-none overflow-hidden transition-colors duration-300">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Home size={160} />
         </div>

         <div className="flex items-center gap-6 relative z-10">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
               <ArrowLeft size={24} />
            </button>
         </div>

         <div className="relative z-10 mt-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/30 text-indigo-100 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-3 backdrop-blur-sm border border-indigo-400/30 shadow-sm">
               <Sparkles size={13} strokeWidth={2.5} /> Rent-To-Own
            </div>
            <h2 className="text-[32px] font-black text-white leading-[1.1] tracking-tight">Your Path to <br/>Homeownership</h2>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-14 relative z-10 flex flex-col gap-5">
         
         {/* Main Savings Card */}
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div className="flex justify-between items-end mb-6">
               <div>
                 <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 transition-colors">Total Savings</p>
                 <h3 className="text-[32px] font-black text-slate-800 dark:text-white leading-none transition-colors">UGX {(current_savings/1e6).toFixed(1)}M</h3>
               </div>
               <div className="text-right pb-1">
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/20 px-2 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors"><TrendingUp size={14}/> +12% this month</p>
               </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 transition-colors">
               <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2.5 transition-colors">
                 <span className="text-indigo-600 dark:text-indigo-400 transition-colors">{progressPercent}% to Goal</span>
                 <span>Target: UGX {(target_goal/1e6).toFixed(0)}M</span>
               </div>
               <div className="w-full h-2.5 bg-slate-200/60 dark:bg-slate-600 rounded-full overflow-hidden transition-colors">
                 <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 rounded-full relative transition-colors" style={{width: `${progressPercent}%`}}>
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 animate-pulse"></div>
                 </div>
               </div>
            </div>

            {/* Recharts Graph */}
            <h3 className="text-[13px] font-bold text-slate-800 dark:text-white mb-4 px-1 transition-colors">Growth Projection</h3>
            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historical_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} dy={10} />
                  <YAxis tickFormatter={(val) => `${(val/1e6).toFixed(1)}M`} axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 600}} />
                  <Tooltip 
                    formatter={(value: any) => [`UGX ${Number(value).toLocaleString()}`, 'Amount']}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="projected" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
                  <Area type="monotone" dataKey="savings" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <button onClick={() => navigate('/pay-welile')} className="w-full mt-7 bg-[#4f46e5] dark:bg-[#4338ca] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/25 dark:shadow-none hover:bg-indigo-600 transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 text-[14px] cursor-pointer">
              <Target strokeWidth={2.5} size={18}/> Deposit to Savings
            </button>
         </div>

         {/* Streaks & Trophies Grid */}
         <div className="grid grid-cols-2 gap-4">
            {/* Streak Card */}
            <div className="bg-gradient-to-br from-[#f59e0b] to-[#ea580c] dark:from-[#b45309] dark:to-[#9a3412] rounded-3xl p-5 shadow-[0_8px_20px_rgb(245,158,11,0.2)] dark:shadow-none text-white relative overflow-hidden transition-colors duration-300">
               <Flame size={80} className="absolute -bottom-6 -right-4 opacity-20" />
               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10 shadow-sm">
                 <Flame size={20} className="text-white" />
               </div>
               <p className="text-white/80 text-[10px] font-extrabold uppercase tracking-widest mb-1.5 transition-colors">Payment Streak</p>
               <h3 className="text-2xl font-black transition-colors">{payment_streak_months} Months</h3>
               <p className="text-amber-100 dark:text-orange-200 text-[11px] mt-2 font-semibold bg-black/10 dark:bg-black/20 inline-block px-2 py-1 rounded-md transition-colors">Bonus yields active!</p>
            </div>

            {/* Key / Milestone Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer duration-300">
               <div className="absolute -bottom-6 -right-6 opacity-[0.03] dark:opacity-5">
                  <Key size={100} />
               </div>
               <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/40 transition-colors border border-indigo-100/50 dark:border-indigo-500/30 shadow-sm">
                 <Key size={18} className="text-indigo-600 dark:text-indigo-400 transition-colors" />
               </div>
               <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1.5 transition-colors">Next Milestone</p>
               <h3 className="text-[19px] font-black text-slate-800 dark:text-white leading-tight transition-colors">{next_milestone?.title || 'Unknown'}</h3>
               <div className="flex items-center text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-2.5 opacity-80 group-hover:opacity-100 transition-all">
                 View Property Options <ChevronRight strokeWidth={2.5} size={14} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
         </div>

         {/* Gamification / Trophies */}
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700 mb-8 overflow-hidden transition-colors duration-300">
            <div className="flex items-center gap-2 mb-5">
               <div className="bg-amber-50 dark:bg-amber-500/20 p-1.5 rounded-lg transition-colors">
                  <Trophy size={18} className="text-amber-500 dark:text-amber-400 transition-colors" />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white text-[15px] transition-colors">Your Trophies</h3>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 snap-x hide-scrollbar">
               {trophies.map((badge: any) => (
                 <div key={badge.id} className={`shrink-0 w-[105px] border rounded-2xl flex flex-col items-center justify-center text-center p-3.5 snap-center transition-all ${badge.unlocked ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 shadow-sm' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-600 grayscale opacity-60'}`}>
                    <span className="text-3xl mb-2.5 drop-shadow-sm">{badge.icon}</span>
                    <p className="text-[12px] font-bold text-slate-800 dark:text-white leading-tight transition-colors">{badge.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1.5 leading-tight transition-colors">{badge.desc}</p>
                 </div>
               ))}
            </div>
         </div>

      </div>
      
      {/* Required for hide-scrollbar style logic */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
