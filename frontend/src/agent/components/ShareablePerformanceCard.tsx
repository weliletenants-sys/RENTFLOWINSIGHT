import React from 'react';
import { Share2, Zap } from 'lucide-react';

export default function ShareablePerformanceCard() {
  return (
    <div className="bg-[#1A1A1A] rounded-[1.5rem] p-6 shadow-xl relative overflow-hidden text-white flex flex-col items-center text-center">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#512DA8] rounded-full blur-3xl pointer-events-none opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500 rounded-full blur-3xl pointer-events-none opacity-30"></div>

      <div className="relative z-10 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#512DA8] to-rose-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto transform -rotate-6 mb-3">
          <Zap size={28} className="text-white fill-white" />
        </div>
        <h3 className="text-2xl font-black tracking-tight leading-none mb-1">Top 5% Agent</h3>
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Welile Technologies</p>
      </div>

      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 w-full relative z-10 mb-4 backdrop-blur-sm">
        <div className="text-3xl font-black text-rose-400">24</div>
        <p className="text-xs font-bold text-gray-300">Tenants Successfully Housed</p>
      </div>

      <button className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl shadow-lg border border-transparent hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 relative z-10 group">
        <Share2 size={16} className="text-gray-400 group-hover:text-gray-900" />
        Share to WhatsApp
      </button>
    </div>
  );
}
