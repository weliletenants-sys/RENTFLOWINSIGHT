import React from 'react';
import { Smartphone, Info } from 'lucide-react';

export default function MobileMoneySettings() {
  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 tracking-wide">
          <Smartphone size={18} className="text-gray-400" /> MoMo Withdrawals
        </h3>
        <button className="text-[10px] text-[#512DA8] font-bold uppercase tracking-wider hover:underline">
          Edit
        </button>
      </div>

      <div className="p-3 border border-gray-200 rounded-xl flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center p-1.5 shrink-0 border border-yellow-500/20">
           <svg viewBox="0 0 100 100" className="w-full text-black fill-black"><circle cx="50" cy="50" r="40" /></svg>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Primary Number</p>
          <p className="text-sm font-bold text-gray-900 tracking-wide">077 *** 5543</p>
        </div>
      </div>

      <div className="flex items-start gap-2 mt-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          Cash-outs requested to this number will be processed by operations within 30 minutes during working hours.
        </p>
      </div>
    </div>
  );
}
