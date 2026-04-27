import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, TrendingUp, Users, MapPin, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentRankSystem() {
  const navigate = useNavigate();
  
  // Mock Data for the Rank Engine (Normally fetched from agentApi)
  // Weighted score ≥ top tier (Earnings 30%, Collections 25%, Referrals 25%, Visits 20%)
  const [metrics] = useState({
     earnings: { current: 1250000, target: 1500000, weight: 0.30 },
     collections: { current: 42, target: 50, weight: 0.25 },
     referrals: { current: 15, target: 20, weight: 0.25 },
     visits: { current: 80, target: 100, weight: 0.20 },
  });

  // Calculation Logic
  const calcProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);
  
  const earningsProgress = calcProgress(metrics.earnings.current, metrics.earnings.target);
  const collectionsProgress = calcProgress(metrics.collections.current, metrics.collections.target);
  const referralsProgress = calcProgress(metrics.referrals.current, metrics.referrals.target);
  const visitsProgress = calcProgress(metrics.visits.current, metrics.visits.target);
  
  // Weighted Total Score (out of 100)
  const totalScore = (
     (earningsProgress * metrics.earnings.weight) +
     (collectionsProgress * metrics.collections.weight) +
     (referralsProgress * metrics.referrals.weight) +
     (visitsProgress * metrics.visits.weight)
  );

  // Tier Logic matching WELILE_WORKFLOW.md
  let currentTier = 'Bronze';
  let tierColors = 'from-[#cd7f32] to-[#8c5722]';
  let nextTierThreshold = 60;
  
  if (totalScore >= 85) {
     currentTier = 'Gold';
     tierColors = 'from-[#fbbf24] to-[#d97706]';
     nextTierThreshold = 100;
  } else if (totalScore >= 60) {
     currentTier = 'Silver';
     tierColors = 'from-[#94a3b8] to-[#475569]';
     nextTierThreshold = 85;
  }

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] text-[#9234eb] font-sans relative overflow-hidden selection:bg-[#9234eb]/20 pb-24 top-0 left-0 fixed z-50 overflow-y-auto">
      
      {/* Background ambient light */}
      <div className="fixed top-[-10%] right-[10%] w-[35rem] h-[35rem] bg-[#9234eb]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <h1 className="text-xl font-black text-[#9234eb] leading-none mb-1">Rank & Goals</h1>
                 <p className="text-[10px] font-bold text-[#9234eb]/50 uppercase tracking-widest">Performance Engine</p>
             </div>
          </div>
          <div className="bg-purple-50 p-2 rounded-xl border border-purple-100 shadow-sm text-[#9234eb]">
             <Target size={20} />
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-28 space-y-6 relative z-10">
        
        {/* Tier Shield Hero Card */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_20px_40px_-10px_rgba(146,52,235,0.15)] border border-purple-100 flex flex-col items-center text-center"
        >
           {/* Ambient central glow */}
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-200 via-white to-white pointer-events-none z-0"></div>

           <p className="relative z-10 text-xs font-bold text-[#9234eb]/50 tracking-widest uppercase mb-4">Current Active Tier</p>
           
           <div className={`relative z-10 w-28 h-28 rounded-full bg-gradient-to-br ${tierColors} flex items-center justify-center p-1 shadow-2xl mb-5 ring-4 ring-white`}>
               <div className="w-full h-full rounded-full border-2 border-white/20 flex items-center justify-center bg-transparent backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 rotate-45 transform origin-top-left -translate-y-12 translate-x-3"></div>
                  <Trophy size={48} className="text-white drop-shadow-md" strokeWidth={1.5} />
               </div>
           </div>

           <h2 className={`relative z-10 text-4xl font-black tracking-tight mb-2 bg-gradient-to-r ${tierColors} bg-clip-text text-transparent`}>
              {currentTier} Agent
           </h2>

           <div className="relative z-10 w-full max-w-xs mt-4">
               <div className="flex justify-between text-xs font-bold text-[#9234eb]/60 uppercase tracking-widest mb-2">
                  <span>Score: {totalScore.toFixed(1)}</span>
                  {totalScore < 100 && <span>Next: {nextTierThreshold}</span>}
               </div>
               <div className="h-3 w-full bg-[#f7f9fa] border border-purple-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${totalScore}%` }}
                     transition={{ duration: 1, delay: 0.2 }}
                     className={`h-full bg-gradient-to-r ${tierColors}`}
                  />
               </div>
           </div>
        </motion.div>

        {/* Calculation Matrix Title */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.1 }}
           className="px-2 mt-8 mb-2 flex items-center justify-between"
        >
           <h3 className="text-sm font-black uppercase tracking-widest text-[#9234eb]">Monthly Targets</h3>
           <span className="text-xs font-bold text-[#9234eb]/50">30 Days Cycle</span>
        </motion.div>

        {/* Breakdown Matrix Cards */}
        <div className="space-y-4">
           {/* Earnings Goal */}
           <GoalCard 
              delay={0.2}
              title="Commission Earnings"
              icon={<TrendingUp size={20} />}
              current={`UGX ${(metrics.earnings.current / 1000).toFixed(0)}k`}
              target={`UGX ${(metrics.earnings.target / 1000).toFixed(0)}k`}
              progress={earningsProgress}
              weight="30% Weight"
           />
           
           {/* Collections Goal */}
           <GoalCard 
              delay={0.3}
              title="Rent Collections"
              icon={<Medal size={20} />}
              current={metrics.collections.current.toString()}
              target={metrics.collections.target.toString()}
              progress={collectionsProgress}
              weight="25% Weight"
           />

           {/* Referrals Goal */}
           <GoalCard 
              delay={0.4}
              title="Active Referrals"
              icon={<Users size={20} />}
              current={metrics.referrals.current.toString()}
              target={metrics.referrals.target.toString()}
              progress={referralsProgress}
              weight="25% Weight"
           />

           {/* Visits Goal */}
           <GoalCard 
              delay={0.5}
              title="Verified Field Visits"
              icon={<MapPin size={20} />}
              current={metrics.visits.current.toString()}
              target={metrics.visits.target.toString()}
              progress={visitsProgress}
              weight="20% Weight"
           />
        </div>

      </main>
    </div>
  );
}

// Subcomponent for Matrix Metric Rendering
function GoalCard({ delay, title, icon, current, target, progress, weight }: any) {
   return (
      <motion.div 
         initial={{ opacity: 0, x: -15 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ duration: 0.4, delay }}
         className="bg-white rounded-[1.2rem] p-5 shadow-sm border border-purple-100 flex flex-col gap-4 relative overflow-hidden group hover:border-[#9234eb]/30 hover:shadow-md transition-all"
      >
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="bg-purple-50 text-[#9234eb] w-10 h-10 rounded-full flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                  {icon}
               </div>
               <div>
                  <h4 className="font-bold text-[15px] text-[#9234eb] leading-none mb-1">{title}</h4>
                  <p className="text-[10px] font-black tracking-widest uppercase text-[#9234eb]/40">{weight}</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-lg font-black text-[#9234eb] leading-none mb-1">{current}</p>
               <p className="text-[10px] font-bold text-[#9234eb]/50 uppercase tracking-widest">/ {target}</p>
            </div>
         </div>
         
         <div className="h-2 w-full bg-[#f7f9fa] border border-purple-100 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 0.8, delay: delay + 0.2 }}
               className="h-full bg-gradient-to-r from-[#9234eb] to-[#b35ef5]"
            />
         </div>
      </motion.div>
   );
}
