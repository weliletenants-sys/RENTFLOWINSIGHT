import React, { useState } from 'react';
import { X, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { renewPortfolio } from '../../../services/cooApi';
import { toast } from 'react-hot-toast';

interface RenewPortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  portfolio: any;
}

const RenewPortfolioDialog: React.FC<RenewPortfolioDialogProps> = ({ isOpen, onClose, onSuccess, portfolio }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !portfolio) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await renewPortfolio(portfolio.id);
      toast.success("Portfolio maturity extended successfully");
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to renew portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden font-inter">
         <div className="p-6 border-b border-blue-50 bg-blue-50/30 flex justify-between items-start">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 mb-2">
               <RefreshCw size={24} />
            </div>
            <button onClick={onClose} disabled={loading} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer transition-colors">
               <X size={20} />
            </button>
         </div>

        <form onSubmit={handleSubmit} className="p-6 text-center space-y-4">
          <h2 className="text-xl font-bold font-outfit text-slate-800">Renew Portfolio</h2>
          
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
             You are about to extend the maturity of <strong className="text-slate-800 font-mono">PORT-{portfolio.id?.slice(0, 4) || '001'}</strong> by another 12 months.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-2 my-4">
             <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-widest">Current Capital</span>
                <span className="font-black text-slate-800">USh {(portfolio.investment_amount || 0).toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-widest">Rate</span>
                <span className="font-black text-[#6c11d4]">{portfolio.roi_percentage || 15}%</span>
             </div>
          </div>

          {error && (
             <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
               <AlertTriangle className="shrink-0" size={14} />
               <p className="text-left">{error}</p>
             </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Renewal'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Cancel Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewPortfolioDialog;
