import React from 'react';
import { Flame, Trophy } from 'lucide-react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  multiplier: number;
  nextMilestone: number;
}

export default function CollectionStreakCard({ currentStreak = 12, longestStreak = 45, multiplier = 1.05, nextMilestone = 14 }: Partial<StreakData>) {
  const isHot = currentStreak > 7;
  const progressToNext = ((currentStreak % 7) / 7) * 100;

  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
      <div className="absolute -right-4 -top-4 opacity-20">
        <Flame size={120} />
      </div>
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame size={20} className={isHot ? 'animate-pulse text-yellow-300' : 'text-orange-200'} />
            <span className="text-sm font-bold uppercase tracking-wider text-orange-100">Collection Streak</span>
          </div>
          <h3 className="text-4xl font-black font-outfit leading-none">{currentStreak} <span className="text-lg text-orange-200 font-medium">Days</span></h3>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] uppercase font-bold text-orange-100">Bonus</p>
            <p className="font-bold text-lg leading-none">{multiplier.toFixed(2)}x</p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between text-xs font-medium text-orange-100 mb-2">
            <span>Next milestone at {nextMilestone} days</span>
            <span className="flex items-center gap-1"><Trophy size={12} /> MAX: {longestStreak}</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2.5 backdrop-blur-sm">
          <div 
            className="bg-yellow-400 h-2.5 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.6)]" 
            style={{ width: `${progressToNext}%` }}
          />
        </div>
        <p className="text-[11px] mt-3 text-orange-100/80 leading-tight">
           Keep collecting field rent daily to increase your streak multiplier! 1.20x max.
        </p>
      </div>
    </div>
  );
}
