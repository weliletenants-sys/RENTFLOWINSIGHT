import React from 'react';
import { PiggyBank, Sparkles } from 'lucide-react';

export default function RecruitTenantWelileHomes() {
  return (
    <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-[1.5rem] p-5 shadow-lg relative overflow-hidden flex flex-col items-start group border border-transparent">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="p-2 bg-white/20 rounded-xl text-white backdrop-blur-sm shadow-sm flex items-center justify-center">
          <PiggyBank size={18} />
        </div>
        <h3 className="font-bold text-sm tracking-wide flex items-center gap-1">
          Pitch Welile Homes <Sparkles size={14} className="text-yellow-300" />
        </h3>
      </div>
      
      <p className="text-xs text-emerald-50 text-left leading-relaxed relative z-10 pr-4">
        Help your tenants save daily for future rent. You earn a bonus for every tenant who reaches their savings goal.
      </p>
      
    </button>
  );
}
