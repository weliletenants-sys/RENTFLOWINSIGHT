import React from 'react';
import { Briefcase, ArrowUpRight } from 'lucide-react';

export default function FunderPortfolioCard() {
  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex flex-col gap-3 group hover:border-indigo-200 transition-colors cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Portfolio Alpha</h3>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Managed Proxy</span>
          </div>
        </div>
        <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-green-100">
          <ArrowUpRight size={12} /> Active
        </span>
      </div>

      <div className="pt-2">
        <div className="text-2xl font-black text-gray-900">UGX 5,000,000</div>
        <p className="text-xs text-gray-500 font-medium mt-1">Generating 1.2% monthly yield</p>
      </div>
    </div>
  );
}
