import React from 'react';
import { Banknote, ArrowRight } from 'lucide-react';

export default function TodayCollectionsCard() {
  return (
    <div className="bg-[#512DA8] rounded-[1.5rem] p-5 shadow-lg relative overflow-hidden text-white">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full border border-white/10">
          <Banknote size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Today's Collections</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="relative z-10">
        <div className="text-3xl font-black tracking-tight drop-shadow-sm mb-1">
          UGX 450,000
        </div>
        <div className="text-xs text-purple-200 font-medium flex gap-2">
          <span>From 3 tenants</span> • <span>Updated just now</span>
        </div>
      </div>
      
      <div className="mt-5 relative z-10">
        <div className="w-full bg-black/20 rounded-full h-2 mb-2">
          <div className="bg-[#00E676] h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <p className="text-[10px] text-purple-200 font-medium">75% of Daily Target (UGX 600,000)</p>
      </div>
    </div>
  );
}
