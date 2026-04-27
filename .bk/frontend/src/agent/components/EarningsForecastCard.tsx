import React from 'react';
import { Sparkles, TrendingUp, CalendarDays } from 'lucide-react';

interface ForecastData {
  currentMonthlyEarnings: number;
  aiPredictedEndOfMonth: number;
  daysRemaining: number;
  percentageGrowth: number;
}

export default function EarningsForecastCard({ 
  currentMonthlyEarnings = 145000, 
  aiPredictedEndOfMonth = 280000, 
  daysRemaining = 12,
  percentageGrowth = 18
}: Partial<ForecastData>) {
  
  const isOnTrack = aiPredictedEndOfMonth > currentMonthlyEarnings * 1.5;

  return (
    <div className="bg-gradient-to-br from-[#7214c9] to-indigo-800 rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
        <TrendingUp size={140} />
      </div>
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={16} className="text-purple-300" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200">AI Monthly Forecast</span>
          </div>
          <h3 className="text-3xl font-black font-outfit text-white leading-tight">
            <span className="text-lg opacity-80 mr-1 font-medium font-sans">UGX</span>
            {aiPredictedEndOfMonth.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-purple-200 flex items-center gap-1">
               <CalendarDays size={12} /> {daysRemaining} days left
            </span>
            <span className={`text-xs font-bold ${isOnTrack ? 'text-emerald-300' : 'text-amber-300'}`}>
               +{percentageGrowth}% vs last mo
            </span>
        </div>
        <div className="flex items-end justify-between mt-3 border-t border-white/10 pt-2">
            <div>
               <p className="text-[10px] text-purple-300 uppercase tracking-wide">Current Earned</p>
               <p className="font-bold text-sm">UGX {currentMonthlyEarnings.toLocaleString()}</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-purple-300 uppercase tracking-wide">AI Target Gap</p>
               <p className="font-bold text-sm text-purple-200 border-b border-dashed border-purple-200/50">
                  {((aiPredictedEndOfMonth - currentMonthlyEarnings) / 1000).toFixed(0)}k to go
               </p>
            </div>
        </div>
      </div>
    </div>
  );
}
