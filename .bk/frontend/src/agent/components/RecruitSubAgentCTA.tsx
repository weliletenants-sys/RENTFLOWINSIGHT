import React from 'react';
import { UserPlus, ChevronRight } from 'lucide-react';

export default function RecruitSubAgentCTA() {
  return (
    <button className="w-full bg-[#1A1A1A] text-white rounded-[1.5rem] p-5 shadow-lg relative overflow-hidden flex flex-col items-start group border border-[#333] hover:border-gray-600 transition-colors">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#512DA8] rounded-full blur-2xl pointer-events-none opacity-40 -mt-10 -mr-10 group-hover:opacity-60 transition-opacity"></div>
      
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="p-2 bg-white/10 rounded-xl text-white backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform">
          <UserPlus size={18} />
        </div>
        <h3 className="font-bold text-sm tracking-wide">Recruit Sub-Agents</h3>
      </div>
      
      <p className="text-xs text-gray-400 text-left leading-relaxed relative z-10 max-w-[220px]">
        Earn passive 2% commission on every rent facilitation completed by an agent you recruit.
      </p>
      
      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#512DA8] bg-white px-3 py-1.5 rounded-lg relative z-10 group-hover:bg-gray-100 transition-colors">
        Send Invite Link <ChevronRight size={14} />
      </div>
    </button>
  );
}
