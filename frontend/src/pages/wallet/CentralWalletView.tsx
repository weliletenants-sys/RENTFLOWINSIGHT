import { useState, useEffect } from 'react';
import { Plus, CreditCard, Download, Navigation, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getWalletBalance, requestTransfer } from '../../services/agentApi';
import { motion, AnimatePresence } from 'framer-motion';

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
  const navigate = useNavigate();
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
      const data = await getWalletBalance();
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
      await requestTransfer({
        amount: Number(transferAmount.replace(/\D/g, '')),
        recipientId
      });
      
      toast.success("Atomic Transfer Executed.");
      setTransferMode(false);
      setTransferAmount('');
      setRecipientId('');
      fetchLedger(); 
    } catch {
      toast.error("Transfer rejected by core engine.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !wallet) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse flex flex-col gap-8 h-[80vh] justify-center items-center">
         <div className="w-16 h-16 border-4 border-purple-100 border-t-[#9234eb] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Helper date formatter for "Nov 14" format
  const formatShortDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] text-[#9234eb] font-sans relative overflow-hidden selection:bg-[#9234eb]/20 py-16">
      
      {/* Background ambient light representing top right glow */}
      <div className="fixed top-[-10%] right-[10%] w-[35rem] h-[35rem] bg-[#9234eb]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-16 xl:gap-24 items-start justify-center">
        
        {/* Left Column: Premium Wallet Card */}
        <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-6 pt-4">
           
           <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[1/1.05] max-w-[420px] mx-auto"
           >
              {/* Soft purple shadow blur behind the card (since background is white) */}
              <div className="absolute inset-x-0 inset-y-2 bg-[#9234eb] rounded-[2rem] blur-2xl opacity-20"></div>
              
              {/* Premium Purple Solid Card (so text is readable in white) */}
              <div className="absolute inset-x-2 inset-y-2 bg-gradient-to-br from-[#9234eb] to-[#6a15ba] shadow-[0_20px_40px_-10px_rgba(146,52,235,0.4)] rounded-[1.8rem] p-8 flex flex-col justify-between overflow-hidden ring-1 ring-inset ring-white/10">

                 {/* Top Row */}
                 <div className="flex justify-between items-start z-10 text-white">
                    <CreditCard size={32} className="text-white/80" strokeWidth={1.5} />
                    <span className="uppercase text-white/90 font-bold tracking-[0.08em] text-[13px] mt-1 mr-1">UGX Wallet</span>
                 </div>

                 {/* Middle Row (Balance) */}
                 <div className="z-10 mt-auto mb-10 text-white">
                    <p className="text-white/80 font-medium text-xl mb-1 tracking-wide">Balance</p>
                    <h2 className="text-[2.85rem] leading-none font-black tracking-tight drop-shadow-sm">UGX {wallet.balance.toLocaleString()}</h2>
                 </div>

                 {/* Bottom Row (Buttons) */}
                 <div className="grid grid-cols-2 gap-4 z-10">
                    <button onClick={() => setTransferMode(true)} className="bg-white hover:bg-slate-50 text-[#9234eb] font-bold py-[14px] rounded-[0.9rem] transition hover:scale-[1.03] active:scale-95 flex justify-center items-center gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                       <Navigation size={18} strokeWidth={2.5} className="-rotate-45 mb-[2px] ml-1" /> Send
                    </button>
                    <button onClick={() => navigate('/agent-deposit')} className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-[14px] rounded-[0.9rem] transition hover:scale-[1.03] active:scale-95 flex justify-center items-center gap-2 shadow-[0_4px_15px_rgba(249,115,22,0.3)]">
                       <Plus size={20} strokeWidth={2.5} /> Top Up
                    </button>
                 </div>
              </div>
           </motion.div>

           {/* Transfer Form mapped beneath the card */}
           <AnimatePresence>
             {transferMode && (
                <motion.div 
                   key="transfer-form"
                   initial={{ opacity: 0, height: 0, scale: 0.95 }}
                   animate={{ opacity: 1, height: 'auto', scale: 1 }}
                   exit={{ opacity: 0, height: 0, scale: 0.95 }}
                   transition={{ duration: 0.3 }}
                   className="bg-white rounded-3xl p-7 border border-purple-100 shadow-[0_15px_40px_-15px_rgba(146,52,235,0.15)] overflow-hidden relative mx-2"
                >
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-[#9234eb] text-base">Send Transfer</h3>
                      <button onClick={() => setTransferMode(false)} className="text-[#9234eb]/50 hover:text-[#9234eb] transition font-medium text-xs bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100">Cancel</button>
                   </div>
                   <form onSubmit={handleTransfer} className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-[#9234eb]/60 uppercase tracking-widest mb-1.5">Recipient ID</label>
                         <input type="text" value={recipientId} onChange={e => setRecipientId(e.target.value)} required className="w-full bg-[#f7f9fa] border border-purple-100 rounded-xl px-4 py-3.5 font-medium text-[#9234eb] focus:outline-none focus:border-[#9234eb] focus:ring-1 focus:ring-[#9234eb] transition-all placeholder:text-[#9234eb]/30" placeholder="UUID or Phone" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-[#9234eb]/60 uppercase tracking-widest mb-1.5">Amount (UGX)</label>
                         <input type="text" value={transferAmount} onChange={e => setTransferAmount(Number(e.target.value.replace(/\D/g, '') || 0).toLocaleString())} required className="w-full bg-[#f7f9fa] border border-purple-100 rounded-xl px-4 py-3.5 font-black text-[#9234eb] text-xl focus:outline-none focus:border-[#9234eb] focus:ring-1 focus:ring-[#9234eb] transition-all placeholder:text-[#9234eb]/20" placeholder="0" />
                      </div>
                      <button type="submit" disabled={processing} className="w-full bg-[#9234eb] text-white hover:bg-[#7823c6] font-bold py-3.5 rounded-xl mt-4 transition-all hover:scale-[1.02] active:scale-95 disabled:hover:scale-100 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-[#9234eb]/20">
                         {processing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         ) : (
                            "Execute Shift"
                         )}
                      </button>
                   </form>
                </motion.div>
             )}
           </AnimatePresence>

        </div>

        {/* Right Column: Transaction History */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
           className="w-full lg:max-w-[450px]"
        >
           <div className="flex justify-between items-center mb-6 pl-1 pr-2">
               <h3 className="text-[1.7rem] font-black text-[#9234eb] tracking-wide">Transaction History</h3>
               <button onClick={fetchLedger} className="text-[#9234eb]/40 hover:text-[#9234eb] transition active:scale-90 bg-white shadow-sm border border-purple-100 p-2 rounded-full">
                  <RefreshCcw size={16} />
               </button>
           </div>
           
           <div className="space-y-3">
              {wallet.ledger && wallet.ledger.length > 0 ? (
                 wallet.ledger.map((entry, index) => {
                    const isCredit = entry.type === 'CREDIT';
                    
                    // Specific icon logic referencing the mockup layout
                    let Icon = Navigation; 
                    let iconColor = "text-[#9234eb]";
                    let iconRotation = "rotate-45";
                    
                    if (isCredit) {
                       Icon = Plus;
                       iconColor = "text-emerald-500";
                       iconRotation = "";
                    } else if (entry.description.toLowerCase().includes('subscription') || entry.description.toLowerCase().includes('payment')) {
                       Icon = Download;
                       iconRotation = "";
                    }

                    return (
                    <motion.div 
                       initial={{ opacity: 0, y: 15 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
                       key={entry.id} 
                       className="bg-white rounded-[1.2rem] p-4 border border-purple-100 flex items-center justify-between hover:border-[#9234eb]/30 hover:shadow-md transition-all group cursor-default shadow-sm"
                    >
                       <div className="flex items-center gap-4">
                          {/* Circular Icon Container */}
                          <div className={`h-[45px] w-[45px] shrink-0 rounded-full flex items-center justify-center border border-purple-100 bg-purple-50 group-hover:scale-110 transition-transform`}>
                             <Icon size={18} className={`${iconColor} ${iconRotation}`} strokeWidth={2} />
                          </div>
                          
                          {/* Main Text Content */}
                          <div className="flex flex-col gap-[2px]">
                             <p className="font-bold text-[#9234eb] text-[15px]">{entry.description}</p>
                             <p className={`text-[14px] font-black tracking-tight ${isCredit ? 'text-emerald-500' : 'text-[#9234eb]/60'}`}>
                                {isCredit ? '+' : '-'}UGX {entry.amount.toLocaleString()}
                             </p>
                          </div>
                       </div>
                       
                       {/* Right-aligned Date/Status */}
                       <div className="flex flex-col items-end gap-[3px] pr-1">
                          <p className="text-[13px] font-bold text-[#9234eb]/40 tracking-wide uppercase">{formatShortDate(entry.created_at)}</p>
                          <p className="text-[12px] font-bold text-[#9234eb]/40">{capitalize(entry.status)}</p>
                       </div>
                    </motion.div>
                 )})
              ) : (
                 <div className="py-20 flex flex-col items-center justify-center opacity-70">
                    <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4 border border-purple-100 shadow-sm">
                       <CreditCard size={24} className="text-[#9234eb]" />
                    </div>
                    <p className="text-[#9234eb] font-bold tracking-wide">No transactions</p>
                 </div>
              )}
           </div>

        </motion.div>
      </div>
    </div>
  );
}
