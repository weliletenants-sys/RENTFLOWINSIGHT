import React from 'react';
import { Target, Users } from 'lucide-react';

export default function TeamGoalProgress() {
  const current = 12;
  const target = 20;
  const percentage = Math.min(100, (current / target) * 100);

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 tracking-wide flex items-center gap-2">
          <Target size={18} className="text-violet-500" /> Sub-Agent Target
        </h3>
        <span className="bg-violet-50 text-violet-700 text-[10px] font-bold px-2 py-1 rounded-md">
          {current} / {target} Repayments
        </span>
      </div>

      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden mb-3 border border-gray-200/50">
        <div 
          className="h-full bg-violet-500 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle shine effect on progress bar */}
          <div className="absolute top-0 left-0 right-0 h-full bg-white/20"></div>
        </div>
      </div>

      <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
        <Users size={14} className="text-gray-400" />
        Your team needs {target - current} more to hit the group bonus
      </p>
    </div>
  );
}
