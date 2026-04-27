import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, Download, ShieldCheck, Landmark } from 'lucide-react';

export default function AgentAdvanceDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [advance, setAdvance] = useState<any>(null);

  useEffect(() => {
    // In a real implementation this would fetch from GET /api/v1/agent/advances/:id
    setLoading(true);
    setTimeout(() => {
        setAdvance({
            id: id || 'ADV_88192',
            amount: 500000,
            status: 'OUTSTANDING',
            disbursed_at: new Date(Date.now() - 432000000).toISOString(),
            due_by: new Date(Date.now() + 864000000).toISOString(),
            cleared_amount: 150000,
            remaining_balance: 350000,
            manager_approved_by: 'CFO_1102',
            ledger_deductions: [
                { date: new Date(Date.now() - 172800000).toISOString(), amount: 100000, type: 'AUTO_DEDUCTION' },
                { date: new Date(Date.now() - 86400000).toISOString(), amount: 50000, type: 'MANUAL_REPAYMENT' }
            ]
        });
        setLoading(false);
    }, 600);
  }, [id]);

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f6f6] dark:bg-[#221610]">
           <div className="w-8 h-8 border-4 border-[#6c11d4] border-t-transparent rounded-full animate-spin" />
        </div>
     );
  }

  if (!advance) return null;

  const progressPct = Math.min((advance.cleared_amount / advance.amount) * 100, 100);
  const balanceRatio = advance.remaining_balance / advance.amount;
  
  let riskColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
  let riskLabel = 'Healthy (≤ 1.0x)';
  if (balanceRatio > 3.0) {
    riskColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    riskLabel = 'Critical (> 3.0x)';
  } else if (balanceRatio > 1.5) {
    riskColor = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    riskLabel = 'Caution (> 1.5x)';
  } else if (balanceRatio > 1.0) {
    riskColor = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    riskLabel = 'Monitor (> 1.0x)';
  }

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 antialiased min-h-screen font-['Public_Sans'] pb-24 top-0 left-0 fixed w-full z-50 overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
               <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-xl font-bold font-outfit text-slate-900 dark:text-white leading-none mb-1">Advance Details</h1>
                <p className="text-xs font-medium text-slate-500 tracking-wider font-mono">{advance.id}</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1.5">
             <Clock size={14} /> {advance.status}
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-24 space-y-6">
        
        {/* Core Advance View */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
           
           <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
              <div>
                 <p className="text-xs font-bold uppercase tracking-widest text-[#6c11d4] mb-1">Original Principal</p>
                 <h2 className="text-3xl font-black font-outfit text-slate-900 dark:text-white">UGX {advance.amount.toLocaleString()}</h2>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Due By</p>
                 <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {new Date(advance.due_by).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                 </span>
              </div>
           </div>

           <div className="mb-6 flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Balance-to-Principal Ratio</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${riskColor}`}>
                 {riskLabel} ({balanceRatio.toFixed(2)}x)
              </span>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <div>
                    <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Cleared Amount</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">UGX {advance.cleared_amount.toLocaleString()}</span>
                 </div>
                 <div className="text-right">
                    <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Remaining Liability</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">UGX {advance.remaining_balance.toLocaleString()}</span>
                 </div>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 border border-slate-200 dark:border-slate-600">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }}></div>
              </div>
              <p className="text-[10px] text-center font-bold text-slate-400">{Math.round(progressPct)}% Recovered</p>
           </div>
        </div>

        {/* Ledger */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               <FileText size={16} className="text-[#6c11d4]" />
               Recovery Ledger
            </h3>
            
            {advance.ledger_deductions.length === 0 ? (
                <p className="text-sm text-center text-slate-500 py-4">No deductions recorded yet.</p>
            ) : (
                <div className="space-y-4">
                  {advance.ledger_deductions.map((deduction: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30">
                                 {deduction.type === 'AUTO_DEDUCTION' ? <Download size={18} /> : <Landmark size={18} />}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{deduction.type.replace(/_/g, ' ')}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {new Date(deduction.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                  </p>
                              </div>
                          </div>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              - UGX {deduction.amount.toLocaleString()}
                          </p>
                      </div>
                  ))}
                </div>
            )}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
            <ShieldCheck size={16} /> Securely tracked via Enterprise Financial Control
        </div>

      </main>
    </div>
  );
}
