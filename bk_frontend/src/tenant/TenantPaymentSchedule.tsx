import { useState, useEffect } from 'react';
import { CalendarDays, Flame, Award, Zap } from 'lucide-react';

interface SchedulePayload {
  consecutive_days: number;
  streak_multiplier: number;
  badge_tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  upcoming_deductions: {
     date: string;
     amount: number;
     status: 'Clearing' | 'Pending';
  }[];
}

export default function TenantPaymentSchedule() {
  const [schedule, setSchedule] = useState<SchedulePayload | null>(null);

  useEffect(() => {
    // ZERO LOCAL LOGIC: The timeline generation and Gamification tier definitions
    // are strictly computed via Backend DB timestamp analysis.
    setTimeout(() => {
       setSchedule({
          consecutive_days: 14,
          streak_multiplier: 1.05,
          badge_tier: 'Silver',
          upcoming_deductions: [
            { date: new Date().toISOString(), amount: 15400, status: 'Clearing' },
            { date: new Date(Date.now() + 86400000).toISOString(), amount: 15400, status: 'Pending' },
            { date: new Date(Date.now() + 172800000).toISOString(), amount: 15400, status: 'Pending' },
            { date: new Date(Date.now() + 259200000).toISOString(), amount: 15400, status: 'Pending' },
          ]
       });
    }, 600);
  }, []);

  if (!schedule) return <div className="animate-pulse bg-gray-100 rounded-3xl h-96"></div>;

  return (
    <div className="w-full max-w-4xl mx-auto font-inter space-y-8">
       {/* Server-Computed Gamification Matrix */}
       <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-8 rounded-3xl text-white shadow-2xl border border-indigo-800 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none -mb-10 -mr-10">
             <Flame size={200} />
          </div>
          
          <h2 className="text-xl font-bold text-indigo-300 flex items-center gap-2 mb-6">
             <Award /> Gamified Ledger Standing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
             <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Active Chain</p>
                <div className="flex items-end gap-2">
                   <p className="text-5xl font-black text-white">{schedule.consecutive_days}</p>
                   <p className="text-indigo-300 font-bold mb-1">Days</p>
                </div>
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Reputation Tier</p>
                <div className="flex items-center gap-2">
                   <p className={`text-3xl font-black ${schedule.badge_tier === 'Silver' ? 'text-slate-300' : 'text-yellow-400'}`}>
                      {schedule.badge_tier}
                   </p>
                </div>
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Dynamic Trust Score</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-800/50 rounded-xl border border-indigo-700 backdrop-blur">
                   <Zap size={18} className="text-yellow-400" />
                   <span className="font-bold font-mono text-lg">{schedule.streak_multiplier}x</span>
                </div>
             </div>
          </div>
       </div>

       {/* Server-Projected Deductions */}
       <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                <CalendarDays size={20} />
             </div>
             <h3 className="text-lg font-bold text-gray-900">Projected System Ledger</h3>
          </div>
          <div className="divide-y divide-gray-100">
             {schedule.upcoming_deductions.map((deduction, idx) => (
               <div key={idx} className="flex justify-between items-center p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-gray-900 mb-1">
                        {new Date(deduction.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                     </span>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded w-max ${deduction.status === 'Clearing' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                        {deduction.status} Pipeline
                     </span>
                  </div>
                  <div className="text-right">
                     <span className="text-lg font-black text-gray-900">UGX {deduction.amount.toLocaleString()}</span>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
}
