import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Wallet, CheckCircle, Clock } from 'lucide-react';

export default function AgentCashPayouts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [commissionBalance, setCommissionBalance] = useState(0);

  useEffect(() => {
    // In a real implementation this would fetch from GET /api/v1/agent/payouts
    setLoading(true);
    setTimeout(() => {
        setCommissionBalance(275000);
        setPayouts([
            { id: 'pay_98xyz', amount: 50000, date: new Date().toISOString(), status: 'PENDING', reference: 'MM_01' },
            { id: 'pay_77aqv', amount: 150000, date: new Date(Date.now() - 86400000).toISOString(), status: 'COMPLETED', reference: 'MM_XAX1' },
            { id: 'pay_12bbb', amount: 25000, date: new Date(Date.now() - 172800000).toISOString(), status: 'COMPLETED', reference: 'MM_TRZ9' }
        ]);
        setLoading(false);
    }, 600);
  }, []);

  const handleRequestPayout = async () => {
    toast.success('Commission payout requested securely.');
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 antialiased min-h-screen font-['Public_Sans'] pb-24 top-0 left-0 fixed w-full z-50 overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
               <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-xl font-bold font-outfit text-slate-900 dark:text-white leading-none mb-1">Commission Payouts</h1>
                <p className="text-xs font-medium text-slate-500">Withdraw earned facilitator commissions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-24 space-y-6">
        
        {/* Commission Balance Hero */}
        <div className="bg-[#6c11d4] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet size={120} />
           </div>
           <div className="relative z-10 w-full mb-6">
              <p className="text-sm font-medium text-white/80 uppercase tracking-widest mb-1">Available Commissions</p>
              <h2 className="text-4xl font-extrabold tracking-tight mt-1">UGX {commissionBalance.toLocaleString()}</h2>
           </div>

           <button 
             onClick={handleRequestPayout}
             className="relative z-10 w-full py-4 rounded-xl bg-white text-[#6c11d4] text-sm font-bold shadow-sm hover:scale-[1.02] transition-transform"
           >
             Request Commission Sweep
           </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm">
           <strong>Note:</strong> Commission payouts are cleared independently from your standard daily operational Agent Float.
        </div>

        {/* Ledger */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Cash Outs</h3>
            
            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl w-full"></div>
                    <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl w-full"></div>
                </div>
            ) : payouts.length === 0 ? (
                <p className="text-sm text-center text-slate-500 py-4">No commission withdrawals yet.</p>
            ) : (
                <div className="space-y-4">
                  {payouts.map((pay) => (
                      <div key={pay.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className={`size-10 rounded-full flex items-center justify-center ${pay.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30'}`}>
                                 {pay.status === 'COMPLETED' ? <CheckCircle size={20} /> : <Clock size={20} />}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">{pay.status === 'COMPLETED' ? 'Transfer Cleared' : 'Processing'}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {new Date(pay.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                  </p>
                              </div>
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                              UGX {pay.amount.toLocaleString()}
                          </p>
                      </div>
                  ))}
                </div>
            )}
        </section>

      </main>
    </div>
  );
}
