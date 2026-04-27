import { useState } from 'react';
import { X, CreditCard, Phone, Copy, Receipt } from 'lucide-react';

interface TenantDepositDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TenantDepositDialog({ isOpen, onClose }: TenantDepositDialogProps) {
  const [amount, setAmount] = useState('');
  const [partner, setPartner] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#131b2f] rounded-[2rem] w-full max-w-[420px] overflow-hidden shadow-2xl shadow-purple-900/10 dark:shadow-purple-900/20 text-slate-900 dark:text-white animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        
        {/* Header Block */}
        <div className="flex justify-between items-center p-6 pb-2 relative">
          <h2 className="w-full text-center font-bold text-lg text-slate-900 dark:text-white">Top Up Wallet via Mobile Money</h2>
          <button onClick={onClose} className="absolute right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 pt-4">
          
          {/* Payment Partners Section Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard size={20} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Payment Partners</h3>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pay in 10 seconds using Mobile Money</p>
          </div>

          {/* Partner Cards Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            
            {/* MTN Card */}
            <div className="rounded-3xl border border-[#ffcc00] overflow-hidden flex flex-col pt-3 bg-gradient-to-b from-[#ffcc00] to-[#ffcc00] relative drop-shadow-sm">
               <div className="flex items-start gap-2 px-3 pb-3">
                 <div className="w-8 h-8 rounded-full bg-white shrink-0"></div>
                 <div>
                    <h4 className="font-black text-black text-xs leading-none">MTN Mo...</h4>
                    <span className="inline-block bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-sm">Pay Merchant</span>
                 </div>
               </div>
               
               <div className="bg-slate-50 dark:bg-[#1a233a] rounded-t-3xl rounded-b-3xl p-4 flex-1 flex flex-col items-center mt-[-2px]">
                 <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 mt-2 mb-2">Merchant ID</p>
                 <span className="font-bold tracking-[0.2em] text-slate-900 dark:text-white text-xl mb-4">090777</span>
                 
                 <a href="tel:*165*3#" className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 mb-3 shadow-sm">
                   <Phone size={14} /> Pay Now
                 </a>
                 
                 <button 
                   onClick={() => handleCopy('090777')}
                   className="w-full bg-transparent border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors mb-4"
                 >
                   <Copy size={12} /> {copiedId === '090777' ? 'Copied' : 'Copy ID'}
                 </button>
                 
                 <button className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">View Manual Step</button>
               </div>
            </div>

            {/* Airtel Card */}
            <div className="rounded-3xl border border-[#e50000] overflow-hidden flex flex-col pt-3 bg-gradient-to-b from-[#e50000] to-[#e50000] relative drop-shadow-sm">
               <div className="flex items-start gap-2 px-3 pb-3">
                 <div className="w-8 h-8 rounded-full bg-white shrink-0"></div>
                 <div>
                    <h4 className="font-black text-white text-xs leading-none">Airtel M...</h4>
                    <span className="inline-block bg-white text-[#e50000] text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-sm">Pay Merchant</span>
                 </div>
               </div>
               
               <div className="bg-slate-50 dark:bg-[#1a233a] rounded-t-3xl rounded-b-3xl p-4 flex-1 flex flex-col items-center mt-[-2px]">
                 <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 mt-2 mb-2">Merchant ID</p>
                 <span className="font-bold tracking-[0.2em] text-slate-900 dark:text-white text-xl mb-4">4380664</span>
                 
                 <a href="tel:*185*3#" className="w-full bg-[#e50000] hover:bg-[#cc0000] text-white font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 mb-3 shadow-sm">
                   <Phone size={14} /> Pay Now
                 </a>
                 
                 <button 
                   onClick={() => handleCopy('4380664')}
                   className="w-full bg-transparent border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors mb-4"
                 >
                   <Copy size={12} /> {copiedId === '4380664' ? 'Copied' : 'Copy ID'}
                 </button>
                 
                 <button className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">View Manual Step</button>
               </div>
            </div>

          </div>

          {/* Confirm Your Payment Section */}
          <div className="bg-slate-50 dark:bg-[#1a233a] rounded-3xl p-5 border border-slate-200 dark:border-slate-800">
             <div className="flex items-center gap-2 mb-4">
                <Receipt size={18} className="text-purple-600 dark:text-purple-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">Confirm Your Payment</h4>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Amount Paid (UGX) *</label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full overflow-hidden w-5 h-5 opacity-80 shadow-sm border border-slate-200">
                         <img src="https://flagcdn.com/w20/ug.png" alt="UGX" className="w-full h-full object-cover" />
                      </span>
                      <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full bg-white dark:bg-[#131b2f] border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-purple-500 shadow-sm"
                      />
                   </div>
                </div>

                <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Payment Partner *</label>
                   <select 
                     value={partner}
                     onChange={(e) => setPartner(e.target.value)}
                     className="w-full bg-white dark:bg-[#131b2f] border border-slate-300 dark:border-slate-700 rounded-xl py-[11px] px-3 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-purple-500 appearance-none shadow-sm"
                   >
                      <option value="">Select...</option>
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="airtel">Airtel Money</option>
                   </select>
                </div>
             </div>

             <button 
               onClick={handleConfirm}
               disabled={!amount || !partner || isProcessing}
               className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 dark:bg-[#7a28c4] dark:hover:bg-[#6b22a8] dark:disabled:bg-slate-800 dark:disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-colors mt-2 text-sm shadow-sm"
             >
               {isProcessing ? 'Verifying...' : 'Confirm Deposit'}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
