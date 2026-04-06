import React from 'react';
import { CreditCard, Rocket, CheckCircle } from 'lucide-react';

export default function LoanManagement() {
  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 tracking-wide">Advance Capital</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Working Limit</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4 relative overflow-hidden group hover:border-indigo-200 transition-colors cursor-pointer">
        <div className="absolute right-0 bottom-0 text-gray-100 opacity-50 -mr-4 -mb-4 pointer-events-none group-hover:text-indigo-50 transition-colors">
          <Rocket size={80} />
        </div>
        
        <div className="relative z-10">
          <p className="text-xs text-gray-500 font-medium">Available to Request</p>
          <div className="text-2xl font-black text-gray-900 drop-shadow-sm mb-1">UGX 250,000</div>
          
          <div className="flex items-center gap-1 mt-3">
            <CheckCircle size={12} className="text-green-500" />
            <p className="text-[10px] text-gray-500 font-medium">Eligible based on past 30 days performance</p>
          </div>
        </div>
      </div>

      <button className="w-full py-3.5 bg-[#512DA8] text-white text-sm font-bold rounded-xl hover:bg-[#4527a0] transition-colors shadow-sm active:scale-[0.98]">
        Request Float Advance
      </button>
    </div>
  );
}
