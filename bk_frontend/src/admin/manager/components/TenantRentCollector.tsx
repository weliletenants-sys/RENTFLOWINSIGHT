import React, { useState } from 'react';
import { AlertCircle, Wallet, ShieldCheck, DollarSign, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TenantRentCollector() {
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<'tenant_wallet' | 'agent_wallet'>('tenant_wallet');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.length < 10) {
      toast.error('Reason must be at least 10 characters for audit logs.');
      return;
    }
    
    setLoading(true);
    // Simulate API call for "manual-collect-rent" edge function
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success('Funds successfully drained and pushed to ledger.');
    }, 1500);
  };

  if (success) {
      return (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm border border-emerald-200">
                  <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">Collection Authorized</h3>
              <p className="text-emerald-700 font-medium max-w-sm">UGX {parseInt(amount||'0').toLocaleString()} was successfully debited and logged to the central ledger for {tenantId}.</p>
              <button onClick={() => {setSuccess(false); setTenantId(''); setAmount(''); setReason('');}} className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors">
                  Process Another
              </button>
          </div>
      );
  }

  return (
    <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden animate-in fade-in duration-500 font-inter">
      <div className="px-6 py-5 border-b border-red-100 flex gap-4 items-center bg-red-50/30">
        <div className="p-2 rounded-lg bg-red-100 text-red-600">
           <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-900 tracking-tight">Manual Force-Collection Engine</h3>
          <p className="text-sm font-medium text-red-700/80 mt-0.5">Overrides standard deduction cycles. Leaves immutable audit trail.</p>
        </div>
      </div>

      <form onSubmit={handleDrain} className="p-6 md:p-8 space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Tenant ID</label>
                 <input 
                    required
                    type="text" 
                    value={tenantId}
                    onChange={e => setTenantId(e.target.value)}
                    placeholder="e.g. TNT-9921" 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none font-bold text-slate-800 bg-slate-50"
                 />
             </div>
             <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Collection Amount (UGX)</label>
                 <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        required
                        type="number" 
                        min="1000"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0" 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none font-bold text-slate-800 bg-slate-50"
                    />
                 </div>
             </div>
         </div>

         <div className="space-y-4 pt-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deduction Source Target</label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div 
                    onClick={() => setSource('tenant_wallet')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${source === 'tenant_wallet' ? 'border-red-500 bg-red-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                 >
                     <div className={`p-2 rounded-full ${source === 'tenant_wallet' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                         <Wallet size={20} />
                     </div>
                     <div>
                         <h4 className={`font-bold ${source === 'tenant_wallet' ? 'text-red-900' : 'text-slate-700'}`}>Tenant Direct Wallet</h4>
                         <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Deduct directly from the tenant's deposit balance.</p>
                     </div>
                 </div>

                 <div 
                    onClick={() => setSource('agent_wallet')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${source === 'agent_wallet' ? 'border-red-500 bg-red-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                 >
                     <div className={`p-2 rounded-full ${source === 'agent_wallet' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                         <ShieldCheck size={20} />
                     </div>
                     <div>
                         <h4 className={`font-bold ${source === 'agent_wallet' ? 'text-red-900' : 'text-slate-700'}`}>Agent Float Guarantee</h4>
                         <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Execute deduction from assigned agent's operational float.</p>
                     </div>
                 </div>
             </div>
         </div>

         <div className="space-y-2 pt-2 border-t border-slate-100">
             <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mandatory Audit Reason</label>
                <span className={`text-xs font-bold ${reason.length < 10 ? 'text-red-500' : 'text-emerald-500'}`}>{reason.length}/10 min chars</span>
             </div>
             <textarea 
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Explain why standard auto-deduction was bypassed..." 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none font-medium text-slate-800 bg-slate-50 min-h-[100px] resize-none"
             ></textarea>
         </div>

         <button 
            type="submit" 
            disabled={loading || reason.length < 10}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                loading || reason.length < 10 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20'
            }`}
         >
             {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
             ) : (
                <>Force Execute Deduction Now</>
             )}
         </button>
      </form>
    </div>
  );
}
