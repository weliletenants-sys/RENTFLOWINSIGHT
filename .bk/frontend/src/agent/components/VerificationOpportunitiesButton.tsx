import React from 'react';
import { Fingerprint, ArrowRight } from 'lucide-react';

export default function VerificationOpportunitiesButton() {
  return (
    <button className="w-full bg-white border border-gray-200 text-gray-800 font-bold py-3.5 rounded-xl shadow-sm hover:border-[#512DA8] hover:text-[#512DA8] transition-all flex items-center justify-between px-5 group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
          <Fingerprint size={16} className="text-gray-500 group-hover:text-[#512DA8] transition-colors" />
        </div>
        <span>View Verification Opportunities</span>
      </div>
      <ArrowRight size={16} className="text-gray-400 group-hover:text-[#512DA8] group-hover:translate-x-1 transition-all" />
    </button>
  );
}
