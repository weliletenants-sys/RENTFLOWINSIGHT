import React from 'react';
import { Trophy, Share2 } from 'lucide-react';

export default function ShareableMilestoneCard() {
  return (
    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[1.5rem] p-6 shadow-xl relative overflow-hidden text-white mt-4">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-white shadow-2xl rounded-full flex items-center justify-center mb-3 border-4 border-amber-200">
          <Trophy size={36} className="text-orange-500 fill-amber-500" />
        </div>
        
        <div className="bg-orange-800/20 px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest mb-3">
          Milestone Unlocked
        </div>
        
        <h3 className="text-xl font-black mb-1">1M UGX Collected</h3>
        <p className="text-xs font-medium text-amber-50 leading-tight mb-5 px-4">
          I've safely secured 1 Million UGX in rent collections via Welile without leaving any loose ends.
        </p>

        <button className="bg-white/20 backdrop-blur-md border border-white/40 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2 text-sm w-full justify-center">
          <Share2 size={16} /> Export as Image
        </button>
      </div>
    </div>
  );
}
