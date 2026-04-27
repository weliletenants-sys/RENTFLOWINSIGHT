import React, { useState } from 'react';
import { X, Loader2, AlertTriangle, TrendingUp, Wallet, Landmark } from 'lucide-react';
import { topUpPortfolio } from '../../../services/cooApi';
import { toast } from 'react-hot-toast';

interface TopUpPortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  portfolio: any;
  partner: any;
}

const TopUpPortfolioDialog: React.FC<TopUpPortfolioDialogProps> = ({ isOpen, onClose, onSuccess, portfolio, partner }) => {
  const [form, setForm] = useState({
    amount: '',
    source: 'wallet', // 'wallet' | 'external'
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !portfolio || !partner) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const topUpAmount = Number(form.amount);
    
    if (!form.amount || topUpAmount <= 0) {
      setError("Please enter a valid top-up amount.");
      return;
    }
    if (form.source === 'wallet' && topUpAmount > (partner.walletBalance || 0)) {
      setError(`Insufficient wallet balance. Available: USh ${(partner.walletBalance || 0).toLocaleString()}`);
      return;
    }
    if (form.reason.trim().length < 10) {
      setError("Please provide a valid reason (min 10 characters) for auditing purposes.");
      return;
    }

    try {
      setLoading(true);
      await topUpPortfolio(portfolio.id, {
        amount: topUpAmount,
        source: form.source,
        reason: form.reason
      });
      toast.success("Portfolio capital injected successfully");
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to top up portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden font-inter">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold font-outfit text-slate-800">Inject Capital</h2>
            <p className="text-sm text-slate-500 mt-1">Increasing active capital for PORT-{portfolio.id?.slice(0, 4) || '001'}</p>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
             <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 border border-red-100">
               <AlertTriangle className="shrink-0 mt-0.5" size={18} />
               <p className="text-sm font-medium">{error}</p>
             </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Funding Source</label>
            <div className="flex gap-2">
               <button 
                  type="button" 
                  onClick={() => setForm({...form, source: 'wallet'})}
                  className={`flex-1 py-3 px-2 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${form.source === 'wallet' ? 'bg-[#f4f0ff] border-[#6c11d4] text-[#6c11d4] ring-1 ring-[#6c11d4]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
               >
                  <Wallet size={16} /> Partner Wallet
               </button>
               <button 
                  type="button" 
                  onClick={() => setForm({...form, source: 'external'})}
                  className={`flex-1 py-3 px-2 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${form.source === 'external' ? 'bg-[#f4f0ff] border-[#6c11d4] text-[#6c11d4] ring-1 ring-[#6c11d4]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
               >
                  <Landmark size={16} /> External Bank
               </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount (UGX)</label>
            <div className="relative">
               <input
                 type="number"
                 required
                 value={form.amount}
                 onChange={(e) => setForm({...form, amount: e.target.value})}
                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl font-bold text-slate-800 outline-none transition-colors"
                 placeholder="e.g. 1000000"
               />
               <TrendingUp size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            
            {form.source === 'wallet' && (
               <div className="flex justify-between items-center mt-2 px-1">
                  <span className="text-[11px] font-bold text-slate-400">Available Balance:</span>
                  <span className={`text-[11px] font-bold ${Number(form.amount) > (partner.walletBalance || 0) ? 'text-red-500' : 'text-[#6c11d4]'}`}>
                     USh {(partner.walletBalance || 0).toLocaleString()}
                  </span>
               </div>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Audit Reason <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({...form, reason: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl text-sm font-medium text-slate-800 outline-none transition-colors resize-none"
              placeholder="Provide reason for this top-up..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
             <button 
               type="button"
               onClick={onClose}
               disabled={loading}
               className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
             >
               Cancel
             </button>
             <button 
               type="submit"
               disabled={loading || !form.amount || form.reason.trim().length < 10}
               className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#6c11d4] hover:bg-[#5b0eb3] transition-colors flex items-center justify-center min-w-[120px]"
             >
               {loading ? <Loader2 size={18} className="animate-spin" /> : 'Apply Top-Up'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopUpPortfolioDialog;
