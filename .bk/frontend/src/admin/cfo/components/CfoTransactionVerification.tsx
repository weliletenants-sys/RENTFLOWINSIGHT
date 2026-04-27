import { useState, useEffect, useRef } from 'react';
import { Lock, ShieldAlert, CheckCircle2, ChevronRight, Fingerprint } from 'lucide-react';
import toast from 'react-hot-toast';

interface EscalatedTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  user_name: string;
  amount: number;
  // Note: We DO NOT fetch the `tid` intentionally. Handled by backend.
  status: 'coo_approved';
  timestamp: string;
}

export default function CfoTransactionVerification() {
  const [transactions, setTransactions] = useState<EscalatedTransaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<EscalatedTransaction | null>(null);
  const [inputTid, setInputTid] = useState('');
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // In production, fetch `coo_approved` requests
    setTimeout(() => {
      setTransactions([
        {
          id: 'TX_10992', type: 'DEPOSIT', user_name: 'Alex Mugisha', amount: 500000, 
          status: 'coo_approved', timestamp: new Date().toISOString()
        }
      ]);
    }, 600);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTx || !inputTid.trim()) return;

    setProcessing(true);
    
    // VERY IMPORTANT LOGIC ENFORCEMENT
    // The Frontend passes the input blindly. TRUE logic lies in the backend API.
    try {
      // PROD: await axios.post(`/api/v1/admin/transactions/${selectedTx.id}/cfo-verify`, { input_tid: inputTid.trim() });
      
      // Simulate backend enforcing the match logic (Assume exact match "MTN_881920Z" for demo logic failure)
      setTimeout(() => {
          if (inputTid.trim().toUpperCase() === 'MTN_881920Z') {
             toast.success('TID Verified Server-Side. Ledger cleared!');
             setTransactions(transactions.filter(t => t.id !== selectedTx.id));
             setSelectedTx(null);
          } else {
             // Backend throws 400
             toast.error('SERVER REJECTION: TID Mismatch. Request Blocked.');
             // Typically we might also remove the TX if it auto-rejects completely
          }
          setProcessing(false);
          setInputTid('');
      }, 1000);

    } catch (err) {
      toast.error('TID Check Failed at API Layer.');
      setProcessing(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden relative">
       {/* High-security styling overlay */}
       <div className="absolute top-0 right-0 p-8 opacity-5 overflow-hidden pointer-events-none">
          <Fingerprint size={240} />
       </div>

       <div className="p-6 border-b border-gray-800 relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
             <Lock className="text-emerald-400" />
             Blind TID Authorization Gateway
          </h2>
          <p className="text-sm font-medium text-gray-400 mt-1 max-w-xl">
             Final atomic execution gate. Match the TID received on external company devices to verify systemic authenticity. Mismatches generate instant rejections.
          </p>
       </div>

       {selectedTx ? (
          <div className="p-6 md:p-10 relative z-10 bg-gray-950/50">
             <button 
                onClick={() => { setSelectedTx(null); setInputTid(''); }}
                className="text-gray-500 hover:text-white mb-6 text-sm font-bold flex items-center gap-1 transition-colors"
             >
                {'<-'} Back to Queue
             </button>

             <div className="max-w-md mx-auto">
                 <div className="text-center mb-8">
                     <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Transaction Scope</p>
                     <p className="text-4xl font-black text-white mix-blend-screen">UGX {selectedTx.amount.toLocaleString()}</p>
                     <p className="text-sm text-gray-400 mt-2">Target Payload: <span className="font-mono text-gray-300">{selectedTx.id}</span></p>
                     <p className="text-sm text-gray-400">Initiator: <span className="font-bold text-white max-w-[200px] truncate">{selectedTx.user_name}</span></p>
                 </div>

                 <form onSubmit={handleVerify} className="space-y-4 relative">
                     <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Enter Master Sequence (TID)</label>
                     <input
                        ref={inputRef}
                        type="text"
                        disabled={processing}
                        value={inputTid}
                        onChange={(e) => setInputTid(e.target.value)}
                        placeholder="e.g. 192837192"
                        className="w-full bg-gray-900 border-2 border-gray-700 text-white px-6 py-4 rounded-xl text-center font-mono text-2xl tracking-[0.2em] focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 transition-all uppercase"
                     />
                     <button
                        disabled={processing || inputTid.length < 5}
                        type="submit"
                        className="w-full bg-emerald-500 text-gray-950 font-black px-6 py-4 rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all text-lg flex items-center justify-center gap-2"
                     >
                        {processing ? (
                          <div className="size-6 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        ) : (
                           <>Execute Payload Match <ChevronRight /></>
                        )}
                     </button>
                 </form>

                 <div className="mt-8 bg-amber-900/20 border border-amber-900/50 rounded-xl p-4 flex gap-3 text-amber-500">
                    <ShieldAlert className="shrink-0" />
                    <p className="text-xs font-medium">All inputs are piped directly to the backend validator. Client has no knowledge of the correct verification token.</p>
                 </div>
             </div>
          </div>
       ) : (
         <div className="p-0 relative z-10 divide-y divide-gray-800">
            {transactions.map(tx => (
               <div key={tx.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 hover:bg-gray-800/50 transition-colors gap-4">
                  <div>
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold mb-2 ${tx.type === 'DEPOSIT' ? 'bg-emerald-900/30 border border-emerald-800 text-emerald-400' : 'bg-blue-900/30 border border-blue-800 text-blue-400'}`}>
                        {tx.type} • Stage 4 Cleared
                     </span>
                     <p className="text-white font-bold">{tx.user_name}</p>
                     <p className="text-sm font-mono text-gray-500 mt-1">{tx.id}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto">
                     <p className="text-2xl font-black text-white">UGX {tx.amount.toLocaleString()}</p>
                     <button
                       onClick={() => { setSelectedTx(tx); setTimeout(() => inputRef.current?.focus(), 100); }}
                       className="w-full sm:w-auto px-6 py-3 bg-white text-gray-900 hover:bg-gray-200 font-bold rounded-xl transition-colors shadow-sm"
                     >
                       Authorize
                     </button>
                  </div>
               </div>
            ))}
            {transactions.length === 0 && (
               <div className="p-12 text-center">
                  <CheckCircle2 size={48} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-400 font-medium tracking-wide">Ledger fully verified. No pending authorizations.</p>
               </div>
            )}
         </div>
       )}
    </div>
  );
}
