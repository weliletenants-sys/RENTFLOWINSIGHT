import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, Zap, RefreshCcw, Landmark, Clock, FileText, SendHorizontal } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface LedgerEntry {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  created_at: string;
  balance_before: number | null;
  balance_after: number | null;
  status: string;
}

interface WalletState {
  wallet_id: string;
  balance: number;
  ledger: LedgerEntry[];
}

export default function CentralWalletView() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [loading, setLoading] = useState(true);

  // Transfer State
  const [transferMode, setTransferMode] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      // Role Authentication occurs transparently via JWT bearer.
      // Backend controller determines user_id and binds strict boundaries automatically.
      const { data } = await axios.get('/api/wallets/my-wallet');
      setWallet(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync mathematical ledger.");
      setLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAmount || !recipientId) return;

    setProcessing(true);
    try {
      await axios.post('/api/wallets/transfers', {
        amount: Number(transferAmount.replace(/\D/g, '')),
        recipientId
      });
      
      toast.success("Atomic Transfer Executed.");
      setTransferMode(false);
      setTransferAmount('');
      setRecipientId('');
      fetchLedger(); // Refresh mathematical history natively from DB
    } catch {
      toast.error("Transfer rejected by core engine.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !wallet) return <div className="animate-pulse bg-gray-100 rounded-3xl h-96 w-full"></div>;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-inter animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
         <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Universal Wallet</h1>
            <p className="text-gray-500 font-medium mt-1">Role-authenticated ledger interface securely synchronized with the core banking engine.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Primary Mathematical State */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-30 -mr-20 -mt-20 pointer-events-none"></div>
               
               <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">Available Base Liquidity</p>
               <h2 className="text-4xl font-black tracking-tighter mb-8">UGX {wallet.balance.toLocaleString()}</h2>
               
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setTransferMode(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2">
                     <SendHorizontal size={18} /> Send
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2">
                     <Landmark size={18} /> Top Up
                  </button>
               </div>
            </div>

            {/* Transfer Interface */}
            {transferMode && (
               <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl animate-in slide-in-from-top-4">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-gray-900">Peer-to-Peer Transfer</h3>
                     <button onClick={() => setTransferMode(false)} className="text-gray-400 hover:text-gray-900">Cancel</button>
                  </div>
                  <form onSubmit={handleTransfer} className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recipient ID</label>
                        <input type="text" value={recipientId} onChange={e => setRecipientId(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition" placeholder="UUID or Phone" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Amount (UGX)</label>
                        <input type="text" value={transferAmount} onChange={e => setTransferAmount(Number(e.target.value.replace(/\D/g, '') || 0).toLocaleString())} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-black text-gray-900 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition" placeholder="0" />
                     </div>
                     <button type="submit" disabled={processing} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl mt-2 disabled:opacity-50">
                        {processing ? 'Processing...' : 'Execute Shift'}
                     </button>
                  </form>
               </div>
            )}
         </div>

         {/* Right Column: Triple-State Ledger */}
         <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden h-full">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl"><FileText size={20} /></div>
                     <h3 className="text-lg font-bold text-gray-900">Triple-State Ledger Array</h3>
                  </div>
                  <button onClick={fetchLedger} className="text-gray-400 hover:text-indigo-600 flex items-center gap-2 text-sm font-bold bg-gray-50 px-3 py-1.5 rounded-lg transition"><RefreshCcw size={14} /> Sync</button>
               </div>
               
               <div className="divide-y divide-gray-100 overflow-y-auto max-h-[600px]">
                  {wallet.ledger && wallet.ledger.length > 0 ? wallet.ledger.map(entry => (
                     <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                           <div className={`mt-1 h-10 w-10 shrink-0 rounded-full flex items-center justify-center border-2 shadow-sm ${entry.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                              {entry.type === 'CREDIT' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                           </div>
                           <div>
                              <p className="font-bold text-gray-900 text-base">{entry.description}</p>
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 font-medium">
                                 <span className="flex items-center gap-1"><Clock size={12} /> {new Date(entry.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                 <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-gray-600"><Zap size={10} /> {entry.status}</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-6">
                           <p className={`text-xl font-black ${entry.type === 'CREDIT' ? 'text-emerald-600' : 'text-gray-900'}`}>
                              {entry.type === 'CREDIT' ? '+' : '-'} UGX {entry.amount.toLocaleString()}
                           </p>
                           {entry.balance_after !== null && (
                              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Post: UGX {entry.balance_after.toLocaleString()}</p>
                           )}
                        </div>
                     </div>
                  )) : (
                     <div className="p-12 text-center text-gray-400">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-bold">Ledger Array Empty</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
