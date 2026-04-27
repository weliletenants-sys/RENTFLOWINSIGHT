import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function AgentActionInsights() {
  const insights = [
    "Tenant Sarah N. is likely to upgrade to a 3-month cycle. We recommend pitching the Welile Homes savings option to her.",
    "You have a 4-day collection streak. Complete 3 more visits today to earn the Velocity Badge and a UGX 10k bonus."
  ];

  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-[#512DA8] rounded-[1.5rem] p-5 overflow-hidden text-white shadow-md">
      {/* Visual flair */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl -ml-5 -mb-5 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-white/20 rounded-lg drop-shadow-sm backdrop-blur-sm">
            <Sparkles size={18} className="text-yellow-300" />
          </div>
          <h3 className="font-bold text-sm tracking-wide">Welile Brain Insights</h3>
        </div>

        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-white/10 rounded-xl p-3 border border-white/5 backdrop-blur-md relative group">
              <p className="text-xs text-purple-100 leading-relaxed pr-6">{insight}</p>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
