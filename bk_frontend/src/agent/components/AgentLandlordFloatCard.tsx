import React from 'react';
import { Home, TrendingUp } from 'lucide-react';

export default function AgentLandlordFloatCard() {
  return (
    <div className="bg-blue-50 rounded-[1.5rem] p-5 shadow-sm border border-blue-100 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-blue-600">
          <Home size={20} />
        </div>
        <span className="bg-white text-blue-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
          Landlord Liability
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-xs text-blue-800/80 font-medium tracking-wide mb-1">Total Float Belonging to Landlords</p>
        <div className="text-3xl font-black text-blue-900 drop-shadow-sm">UGX 1,450,000</div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200/50 flex justify-between items-center relative z-10">
        <div className="text-xs font-semibold text-blue-800">Across 3 properties</div>
        <button className="text-xs font-bold text-blue-700 flex items-center gap-1 hover:text-blue-900 transition-colors">
          View Breakdown <TrendingUp size={14} />
        </button>
      </div>
    </div>
  );
}
