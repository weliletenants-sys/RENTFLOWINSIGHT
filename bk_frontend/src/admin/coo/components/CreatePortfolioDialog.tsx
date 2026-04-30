import React, { useState } from 'react';
import { X, Loader2, AlertTriangle, PlusCircle } from 'lucide-react';
import { createPartnerPortfolio } from '../../../services/cooApi';

interface CreatePortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partnerId: string;
  partnerName: string;
}

const CreatePortfolioDialog: React.FC<CreatePortfolioDialogProps> = ({ isOpen, onClose, onSuccess, partnerId, partnerName }) => {
  const [form, setForm] = useState({
    amount: '',
    roi: '15',
    duration: '12',
    date: new Date().toISOString().split('T')[0],
    roiMode: 'monthly_compounding'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid investment amount.");
      return;
    }

    try {
      setLoading(true);
      await createPartnerPortfolio(partnerId, {
        amount: Number(form.amount),
        roi: Number(form.roi),
        duration: Number(form.duration),
        date: form.date,
        roiMode: form.roiMode
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden font-inter">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold font-outfit text-slate-800">Manual Investment</h2>
            <p className="text-sm text-slate-500 mt-1">Registering offline capital for <strong className="text-slate-700">{partnerName}</strong></p>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer">
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Capital Injection (UGX)</label>
            <input
              type="number"
              required
              value={form.amount}
              onChange={(e) => setForm({...form, amount: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl font-bold text-slate-800 outline-none transition-colors"
              placeholder="e.g. 5000000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected ROI (%)</label>
              <input
                type="number"
                required
                value={form.roi}
                onChange={(e) => setForm({...form, roi: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl font-bold text-slate-800 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (Months)</label>
              <input
                type="number"
                required
                value={form.duration}
                onChange={(e) => setForm({...form, duration: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl font-bold text-slate-800 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contribution Date</label>
               <input
                 type="date"
                 required
                 value={form.date}
                 onChange={(e) => setForm({...form, date: e.target.value})}
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl font-bold text-slate-800 outline-none transition-colors"
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ROI Mode</label>
               <select
                 value={form.roiMode}
                 onChange={(e) => setForm({...form, roiMode: e.target.value})}
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-2xl font-bold text-slate-800 outline-none transition-colors"
               >
                 <option value="monthly_compounding">Monthly Compounding</option>
                 <option value="monthly_payout">Monthly Payout</option>
               </select>
             </div>
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
              disabled={loading || !form.amount}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#6c11d4] hover:bg-[#5b0eb3] transition-colors flex items-center justify-center min-w-[120px]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><PlusCircle size={18} className="mr-2" /> Inject Capital</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePortfolioDialog;
