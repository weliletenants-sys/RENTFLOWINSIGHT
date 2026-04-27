import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { Rocket, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IssueAdvanceSheet() {
  const queryClient = useQueryClient();
  const [agentId, setAgentId] = useState('');
  const [principal, setPrincipal] = useState('');
  const [note, setNote] = useState('');

  const executeAdvance = useMutation({
    mutationFn: () => managerApi.issueAgentAdvance(agentId, { 
      principal: Number(principal), 
      note, 
      cycle_days: 14, 
      daily_rate: 500 
    }),
    onSuccess: () => {
      toast.success('Advance injection sequence completed! Ledger updated.');
      setPrincipal('');
      setNote('');
      setAgentId('');
      queryClient.invalidateQueries({ queryKey: ['manager_agent_floats'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || 'Advance compilation failed.';
      toast.error(msg);
    }
  });

  return (
    <div className="max-w-2xl font-inter">
      <div className="bg-white border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden relative">
        
        {/* Decorative Grid SVG Banner */}
        <div className="absolute top-0 inset-x-0 h-32 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          <div className="relative p-6 pt-8 flex items-center justify-between text-white">
             <div>
               <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
                 <Rocket size={20} className="text-purple-400" />
                 Advance Execution
               </h2>
               <p className="text-xs font-mono text-purple-200 mt-1 opacity-80">SECURE TERMINAL &middot; LIQUIDITY INJECTION</p>
             </div>
          </div>
        </div>

        <div className="pt-32 p-6 md:p-8 space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-4 rounded-xl font-medium leading-relaxed">
            <span className="font-bold flex items-center gap-2 mb-1"><FileText size={14}/> Warning: Immutable Transaction</span>
            All advances issued from this terminal are instantly bound to the `general_ledger` and immediately unlock the agent's digital wallet boundaries. Ensure authorization parameters are signed off.
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); executeAdvance.mutate(); }}
            className="space-y-5 flex flex-col"
          >
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Agent UUID / Identity Hash</label>
              <input 
                required
                type="text" 
                placeholder="Ex. 12920f01-..." 
                value={agentId}
                onChange={e => setAgentId(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Capital Principal (Ksh)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">Ksh</span>
                <input 
                  required
                  type="number" 
                  min="1000"
                  step="500"
                  value={principal}
                  onChange={e => setPrincipal(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-14 pr-4 py-3 text-lg font-black text-slate-900 placeholder:font-medium placeholder:text-slate-300 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                  placeholder="50,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Internal Execution Note (Audit Log)</label>
              <textarea 
                required
                rows={2}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Reason for cash injection..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={executeAdvance.isPending || !agentId || !principal || !note}
              className="mt-4 w-full bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest shadow-lg shadow-black/20 text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {executeAdvance.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Authorize & Issue Capital
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
