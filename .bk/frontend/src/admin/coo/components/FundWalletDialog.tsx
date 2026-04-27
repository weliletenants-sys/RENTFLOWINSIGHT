import React, { useState } from 'react';
import { X, Loader2, AlertTriangle, Wallet } from 'lucide-react';
import { fundPartnerWallet } from '../../../services/cooApi';
import { toast } from 'react-hot-toast';

interface FundWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partner: any;
}

const FundWalletDialog: React.FC<FundWalletDialogProps> = ({ isOpen, onClose, onSuccess, partner }) => {
  const [form, setForm] = useState({
    amount: '',
    sourceReference: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !partner) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid funding amount.");
      return;
    }
    if (form.reason.trim().length < 10) {
      setError("Please provide a valid reason (min 10 characters) for auditing purposes.");
      return;
    }

    try {
      setLoading(true);
      await fundPartnerWallet(partner.id, {
        amount: Number(form.amount),
        sourceReference: form.sourceReference,
        reason: form.reason
      });
      toast.success("Wallet funded successfully");
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to fund wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden font-inter">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold font-outfit text-slate-800">Fund Wallet</h2>
            <p className="text-sm text-slate-500 mt-1">Inject capital into <strong className="text-[#6c11d4]">{partner.name}</strong>'s wallet</p>
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Funding Amount (UGX)</label>
            <div className="relative">
               <input
                 type="number"
                 required
                 value={form.amount}
                 onChange={(e) => setForm({...form, amount: e.target.value})}
                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl font-bold text-slate-800 outline-none transition-colors"
                 placeholder="e.g. 500000"
               />
               <Wallet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="flex gap-2 mt-2">
               {[50000, 100000, 500000, 1000000].map(amt => (
                  <button key={amt} type="button" onClick={() => setForm({...form, amount: amt.toString()})} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">
                     {amt / 1000}K
                  </button>
               ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Source Reference (Optional)</label>
            <input
              type="text"
              value={form.sourceReference}
              onChange={(e) => setForm({...form, sourceReference: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl text-sm font-medium text-slate-800 outline-none transition-colors"
              placeholder="e.g. Bank Transfer TX-9382"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Audit Reason <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({...form, reason: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl text-sm font-medium text-slate-800 outline-none transition-colors resize-none"
              placeholder="Why are you funding this wallet manually?"
            />
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Minimum 10 characters. This action will be securely logged.</p>
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
              disabled={loading || !form.amount || form.reason.length < 10}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#05a86b] hover:bg-[#04905a] transition-colors flex items-center justify-center min-w-[120px]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Funding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundWalletDialog;
