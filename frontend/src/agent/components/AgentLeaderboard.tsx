import React from 'react';
import { Trophy, Medal, ArrowUp } from 'lucide-react';

export default function AgentLeaderboard() {
  const leaders = [
    { rank: 1, name: 'Sarah Namukasa', score: 2840 },
    { rank: 2, name: 'You', score: 2450, isCurrent: true },
    { rank: 3, name: 'Joshua Kasozi', score: 2120 },
    { rank: 4, name: 'Brian M.', score: 1890 },
  ];

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Trophy size={18} className="text-yellow-500" /> Rank Leaderboard
        </h3>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">This Month</span>
      </div>

      <div className="space-y-3">
        {leaders.map((leader) => (
          <div 
            key={leader.rank} 
            className={`flex justify-between items-center p-3 rounded-xl border ${
              leader.isCurrent 
                ? 'bg-purple-50 border-purple-200' 
                : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`font-black text-sm flex items-center justify-center w-6 h-6 rounded-full ${
                leader.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                leader.rank === 2 ? 'bg-gray-100 text-gray-600' :
                leader.rank === 3 ? 'bg-amber-100 text-amber-700' : 'text-gray-400'
              }`}>
                {leader.rank}
              </div>
              <div>
                <p className={`font-bold text-sm ${leader.isCurrent ? 'text-[#512DA8]' : 'text-gray-900'}`}>
                  {leader.name}
                </p>
                {leader.isCurrent && <p className="text-[10px] text-purple-600 font-medium">Currently Rank 2</p>}
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-gray-900">{leader.score.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-end gap-0.5">
                Pts
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
