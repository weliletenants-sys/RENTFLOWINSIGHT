import React from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import { useAgentLeaderboard } from '../hooks/useAgentQueries';

export default function AgentLeaderboard() {
  const { data, isLoading, isError } = useAgentLeaderboard();

  if (isLoading) {
    return (
      <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-red-100 flex items-center justify-center min-h-[300px]">
        <p className="text-red-500 font-bold text-sm">Failed to load leaderboard.</p>
      </div>
    );
  }

  // Combine top agents and inject my rank if it's not in the top 5
  const topAgents = data?.top_agents || [];
  const myRank = data?.my_rank;
  const myScore = data?.score;
  const isMeInTop = topAgents.some((a: any) => a.rank === myRank);
  
  const leadersToDisplay = [...topAgents];
  if (!isMeInTop && myRank) {
    leadersToDisplay.push({ rank: myRank, name: "You", score: myScore, isCurrent: true });
  }

  // Ensure "You" is highlighted if found in top
  const finalLeaders = leadersToDisplay.map((l: any) => ({
    ...l,
    isCurrent: l.isCurrent || l.rank === myRank
  }));

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Trophy size={18} className="text-yellow-500" /> Rank Leaderboard
        </h3>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">This Month</span>
      </div>

      <div className="space-y-3">
        {finalLeaders.map((leader) => (
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
                {leader.isCurrent && <p className="text-[10px] text-purple-600 font-medium">Currently Rank {leader.rank}</p>}
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
