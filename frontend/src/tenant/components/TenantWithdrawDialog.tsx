import { useState } from 'react';
import { X, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TenantWithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export default function TenantWithdrawDialog({ isOpen, onClose, balance }: TenantWithdrawDialogProps) {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 1500); // Simulate network request
  };

  const isInvalidAmount = Number(amount) > balance || Number(amount) <= 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-900/10">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Withdraw Funds</h3>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="bg-[#f7f9fc] dark:bg-slate-800 rounded-2xl p-4 mb-6 flex justify-between items-center border border-slate-100 dark:border-slate-700">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Valid Balance</span>
             <span className="text-lg font-black text-purple-600 dark:text-purple-400">{balance.toLocaleString()} UGX</span>
          </div>

          <label className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2 block">Withdraw Amount (UGX)</label>
          <div className="relative mb-6">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 20000"
              className={`w-full bg-white dark:bg-slate-950 border-2 ${amount && isInvalidAmount ? 'border-red-400 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-purple-500'} rounded-xl py-3 px-4 font-bold text-lg text-slate-900 dark:text-white focus:outline-none transition-colors`}
              autoFocus
            />
            {amount && isInvalidAmount && (
               <div className="absolute -bottom-5 flex items-center gap-1 text-[10px] font-bold text-red-500 translate-y-2">
                  <AlertTriangle size={12} /> Insufficient Wallet Balance
               </div>
            )}
          </div>

          <label className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2 block mt-8">Destination Mobile Money</label>
          <div className="relative mb-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+256</span>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="772 123 456"
              maxLength={9}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-16 pr-4 font-bold text-lg text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mb-8 pl-1">Standard network withdrawal fees will apply natively.</p>

          <button 
            onClick={handleWithdraw}
            disabled={!amount || !phone || isInvalidAmount || isProcessing}
            className="w-full bg-[#1e4b9c] hover:bg-[#0f3b7d] text-white font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
          >
            {isProcessing ? 'Processing Transfer...' : 'Initiate Withdrawal'}
            {!isProcessing && <ExternalLink size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
