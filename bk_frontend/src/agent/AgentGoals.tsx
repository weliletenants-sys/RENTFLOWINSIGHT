import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Trophy, Flame, Zap, TrendingUp, UserPlus, Building2, Wallet, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentGoals() {
  const navigate = useNavigate();

  // Mock Agent Performance Goals
  const primaryGoal = {
     title: "Monthly Commission Target",
     current: 8400000,
     target: 10000000,
     unit: "UGX",
     icon: <Trophy size={140} strokeWidth={1} />,
     isCurrency: true
  };

  const secondaryGoals = [
     { id: 1, title: "Tenants Onboarded", current: 18, target: 20, icon: <UserPlus size={20} />, unit: "Users" },
     { id: 2, title: "Landlords Registered", current: 5, target: 5, icon: <Building2 size={20} />, unit: "Partners" },
     { id: 3, title: "Daily Field Collections", current: 1200000, target: 2500000, icon: <Wallet size={20} />, unit: "UGX", isCurrency: true },
     { id: 4, title: "Sub-Agent Activation", current: 1, target: 3, icon: <Zap size={20} />, unit: "Runners" }
  ];

  // Helper to calculate percentage safely capped at 100%
  const getSimulatedProgress = (curr: number, targ: number) => {
     const raw = (curr / targ) * 100;
     return Math.min(raw, 100);
  };

  // Helper to color-code based on progress threshold
  const getProgressColor = (percent: number) => {
     if (percent >= 100) return "bg-emerald-500 shadow-emerald-500/40"; // Goal Crushed
     if (percent >= 25) return "bg-[#9234eb] shadow-[#9234eb]/40"; // On Track
     return "bg-amber-500 shadow-amber-500/40"; // Falling Behind
  };

  const primaryPct = getSimulatedProgress(primaryGoal.current, primaryGoal.target);

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-[#9234eb]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
           <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
              <ArrowLeft size={24} />
           </button>
           <div>
               <h1 className="text-xl font-black text-slate-800 leading-none mb-1">Performance Goals</h1>
               <p className="text-[10px] font-bold text-[#9234eb]/70 uppercase tracking-widest flex items-center gap-1.5"><Flame size={12} /> Active Targets</p>
           </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* Massive Hero Core Metric - Commission Target */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
           className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 md:p-10 shadow-2xl"
        >
           {/* Abstract Design Elements */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#9234eb]/20 to-transparent pointer-events-none" />
           <div className="absolute -top-10 -right-10 text-[#9234eb]/20 transform rotate-12 scale-110 pointer-events-none">
              {primaryGoal.icon}
           </div>
           
           <div className="relative z-10 w-full mb-10">
              <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                 <Target size={16} className="text-[#9234eb]" />
                 <span className="text-xs font-black uppercase tracking-widest text-[#9234eb]">{primaryGoal.title}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 leading-none">
                 <p className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                    UGX {(primaryGoal.current / 1000000).toFixed(1)}<span className="text-3xl text-white/50 ml-1">M</span>
                 </p>
                 <p className="text-sm md:text-xl font-bold text-slate-400 mb-1 md:mb-2 flex items-center gap-2">
                    <span className="opacity-50">/</span> UGX {(primaryGoal.target / 1000000).toFixed(1)}M
                 </p>
              </div>
           </div>

           {/* Grand Progress Bar */}
           <div className="relative z-10 w-full">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Progress Tracker</span>
                 <span className={`text-xl font-black ${primaryPct >= 100 ? 'text-emerald-400' : 'text-white'}`}>{primaryPct.toFixed(1)}%</span>
              </div>
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                 <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${primaryPct}%` }} transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                    className={`h-full rounded-full shadow-lg ${getProgressColor(primaryPct)}`}
                 />
              </div>
              {primaryPct >= 100 && (
                 <p className="mt-4 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Exceptional Output! Monthly Baseline Crushed.
                 </p>
              )}
           </div>
        </motion.div>

        {/* Secondary KPIs / Actionable Targets Loop */}
        <div className="space-y-4">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 px-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#9234eb]" /> Operational Objectives
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secondaryGoals.map((sg, i) => {
                 const pct = getSimulatedProgress(sg.current, sg.target);
                 const isCompleted = pct >= 100;
                 
                 return (
                    <motion.div 
                       key={sg.id}
                       initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}
                       className={`bg-white rounded-2xl p-5 border shadow-sm transition-all group ${isCompleted ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'}`}
                    >
                       <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${isCompleted ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-purple-50 text-[#9234eb] border-purple-100'}`}>
                                {sg.icon}
                             </div>
                             <h4 className="font-bold text-slate-800 leading-tight">{sg.title}</h4>
                          </div>
                          
                          {isCompleted ? (
                             <div className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                                Perfect Score
                             </div>
                          ) : (
                             <div className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                Trailing
                             </div>
                          )}
                       </div>

                       <div className="flex flex-col gap-3">
                          <div className="flex items-end justify-between leading-none">
                             <div className="text-xl font-black text-slate-900">
                                {sg.isCurrency ? `UGX ${(sg.current / 1000000).toFixed(1)}M` : sg.current}
                                <span className="text-xs font-bold text-slate-400 ml-1.5">{sg.unit}</span>
                             </div>
                             <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                Target: <span className="text-slate-700">{sg.isCurrency ? `UGX ${(sg.target / 1000000).toFixed(1)}M` : sg.target}</span>
                             </div>
                          </div>
                          
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                             <motion.div 
                                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.4 + (i * 0.1), ease: "easeOut" }}
                                className={`h-full rounded-full transition-colors ${getProgressColor(pct)}`}
                             />
                          </div>
                       </div>
                    </motion.div>
                 );
              })}
           </div>
        </div>

      </main>
    </div>
  );
}
