import { Trophy, TrendingUp } from 'lucide-react';

interface PaymentStreakCalendarProps {
  currentStreak?: number;
  totalDaysInCycle?: number;
  paidDays?: number[]; // Array of day indexes (0 to 29) that were paid
}

export default function PaymentStreakCalendar({
  currentStreak = 0,
  totalDaysInCycle = 30,
  paidDays = []
}: PaymentStreakCalendarProps) {

  // Generate 30 days blocks
  const days = Array.from({ length: totalDaysInCycle }, (_, i) => {
    return {
      dayIndex: i,
      isPaid: paidDays.includes(i)
    };
  });

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 lg:p-8 flex flex-col h-full w-full">
      
      <div className="flex justify-between items-start mb-6 w-full">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
             <Trophy className="w-5 h-5" />
           </div>
           <div>
             <h3 className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">Payment Streak</h3>
             <p className="text-xs font-medium text-slate-500 mt-1">Consistency builds higher credit limits</p>
           </div>
         </div>

         <div className="text-right">
           <p className="text-3xl font-black text-slate-900 leading-none flex items-center justify-end gap-1">
             {currentStreak} <span className="text-lg text-slate-400">🔥</span>
           </p>
           <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Days Active</p>
         </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
         {/* 30 Day Grid View */}
         <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {days.map((day) => (
              <div 
                 key={day.dayIndex}
                 title={`Day ${day.dayIndex + 1}`}
                 className={`aspect-square rounded-[4px] sm:rounded-md transition-colors duration-300 ${
                   day.isPaid 
                     ? 'bg-emerald-500 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]'
                     : 'bg-slate-100 hover:bg-slate-200 cursor-help'
                 }`}
              />
            ))}
         </div>

         <div className="mt-6 flex items-center justify-between">
           <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-100"></div> Pending</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div> Paid On-Time</div>
           </div>

           <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">
             <TrendingUp className="w-3.5 h-3.5" /> +2% Limit Boost
           </div>
         </div>
      </div>
      
    </div>
  );
}
