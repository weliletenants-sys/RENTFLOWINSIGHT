import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { Gavel, AlertTriangle, Scale } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EvictionPipeline() {
  const queryClient = useQueryClient();
  const [tenantId, setTenantId] = useState('');
  const [reason, setReason] = useState('');
  const [confirm, setConfirm] = useState(false);

  const issueEviction = useMutation({
    mutationFn: () => managerApi.triggerTenantEviction(tenantId, reason),
    onSuccess: () => {
      toast.success('Eviction protocols have been permanently logged onto the user profile!');
      setTenantId('');
      setReason('');
      setConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['manager_tenant_status'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || 'Eviction pipeline compilation failed.';
      toast.error(msg);
    }
  });

  return (
    <div className="max-w-2xl font-inter">
      <div className="bg-white border-2 border-red-100 shadow-sm rounded-2xl overflow-hidden relative">
        
        {/* Aggressive Decorative Banner */}
        <div className="absolute top-0 inset-x-0 h-32 bg-red-600 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }} />
          <div className="relative p-6 pt-8 flex items-center justify-between text-white">
             <div>
               <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
                 <Scale size={20} className="text-red-200" />
                 Escalate: Legal Eviction
               </h2>
               <p className="text-xs font-bold text-red-200 mt-1 opacity-90">NON-REVERSIBLE &middot; COLLECTIONS DEPARTURE</p>
             </div>
             <Gavel size={48} className="text-red-800/40" />
          </div>
        </div>

        <div className="pt-32 p-6 md:p-8 space-y-6 bg-red-50/10">
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-xl leading-relaxed">
            <span className="font-bold flex items-center gap-2 mb-1 uppercase tracking-wider text-xs border-b border-red-200 pb-2"><AlertTriangle size={14}/> Severe Consequence Notice</span>
            <p className="mt-2 text-xs font-medium">Executing an eviction strips the tenant profile of its active lease metrics, drops them into the <span className="font-mono bg-red-100 px-1 py-0.5 rounded text-[10px] text-red-800">EVICTION_PENDING</span> state, and alerts external agency collections.</p>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); issueEviction.mutate(); }}
            className="space-y-5 flex flex-col"
          >
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest mb-1.5">Tenant System UUID</label>
              <input 
                required
                type="text" 
                placeholder="Ex. 12920f01-..." 
                value={tenantId}
                onChange={e => setTenantId(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-800 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest mb-1.5">Official Eviction Rationale</label>
              <textarea 
                required
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g., Willful default exceeding 180 days with multiple written warnings ignored..."
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="confirm" checked={confirm} onChange={e => setConfirm(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-600 cursor-pointer" />
              <label htmlFor="confirm" className="text-xs font-bold text-slate-600 uppercase tracking-wide cursor-pointer select-none">
                I authorize this tenant's permanent termination pipeline
              </label>
            </div>

            <button
              type="submit"
              disabled={issueEviction.isPending || !tenantId || !reason || !confirm}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest shadow-lg shadow-red-600/20 text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {issueEviction.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Gavel size={18} />
                  Initiate Eviction Sequence
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
