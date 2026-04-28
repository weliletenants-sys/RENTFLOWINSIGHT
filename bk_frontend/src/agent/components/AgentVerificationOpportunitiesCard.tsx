import React from 'react';
import { HandCoins, MapPin } from 'lucide-react';

export default function AgentVerificationOpportunitiesCard() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[1.5rem] p-5 border border-amber-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 rounded-full blur-2xl pointer-events-none -mt-10 -mr-10 opacity-50"></div>
      
      <div className="flex items-start justify-between relative z-10 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
            <HandCoins size={16} />
          </div>
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-widest">Extra Earnings</h3>
        </div>
        <span className="bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">2 Available</span>
      </div>

      <div className="relative z-10 text-sm font-bold text-amber-900 mb-4 max-w-[200px] leading-tight">
        Earn UGX 10k by verifying new landlord locations today.
      </div>

      <div className="space-y-2 relative z-10">
        <button className="w-full bg-white/60 hover:bg-white border border-amber-200 rounded-xl p-3 flex justify-between items-center transition-colors group">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-900">Verify Landlord in Bwaise</span>
          </div>
          <span className="text-[10px] font-bold text-amber-600 group-hover:text-amber-800">+UGX 5k</span>
        </button>
      </div>
    </div>
  );
}
