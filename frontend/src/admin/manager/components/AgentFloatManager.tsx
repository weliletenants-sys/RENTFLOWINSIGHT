import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { formatMoney } from '../../../utils/currency';
import { ShieldCheck, ArrowUpCircle, AlertTriangle } from 'lucide-react';

export default function AgentFloatManager() {
  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  const { data: response, isLoading } = useQuery({
    queryKey: ['manager_agent_floats', page, limit],
    queryFn: () => managerApi.getAgentFloats({ page, limit })
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white border border-slate-200 shadow-sm rounded-2xl h-80"></div>;
  }

  const agents = response?.data || [];
  const meta = response?.meta || { has_next: false, has_previous: false, total_pages: 1 };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden font-inter">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-purple-600" size={18} />
            Field Float Exposure
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Global audit of liquid capital deployed across active field agents.</p>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Field Operator</th>
              <th className="px-6 py-4 text-right">Current Float / Liquidity</th>
              <th className="px-6 py-4 text-right">Maximum Limit</th>
              <th className="px-6 py-4 text-center">Exposure Ratio</th>
              <th className="px-6 py-4 text-center">Overrides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {agents.map((agent: any) => {
              const ratio = Math.min((agent.working_capital / agent.float_limit) * 100, 100);
              const isOverexposed = ratio > 90;

              return (
                <tr key={agent.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{agent.full_name}</div>
                    <div className="text-xs text-slate-500">{agent.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-sm text-slate-800">
                    {formatMoney(agent.working_capital)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-sm text-slate-500">
                    {formatMoney(agent.float_limit)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isOverexposed ? 'bg-red-500' : 'bg-purple-500'}`} 
                          style={{ width: `${ratio}%` }} 
                        />
                      </div>
                      <span className={`text-[10px] font-black ${isOverexposed ? 'text-red-500' : 'text-slate-400'}`}>
                        {ratio.toFixed(1)}% UTILIZED
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-100 transition-colors">
                      <ArrowUpCircle size={18} />
                    </button>
                    {isOverexposed && (
                      <button className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 ml-2" title="Critical Exposure">
                        <AlertTriangle size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            
            {agents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No active field agents found matching your query scope.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Grid DB Paginator */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
        <div>
          PAGE <span className="font-bold text-slate-800">{meta.page_number}</span> / {meta.total_pages}
        </div>
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <button 
            disabled={!meta.has_previous} 
            onClick={() => setPage(p => p - 1)}
            className="hover:text-purple-600 disabled:opacity-30 uppercase"
          >
            Prev
          </button>
          <span>&middot;</span>
          <button 
            disabled={!meta.has_next} 
            onClick={() => setPage(p => p + 1)}
            className="hover:text-purple-600 disabled:opacity-30 uppercase"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
