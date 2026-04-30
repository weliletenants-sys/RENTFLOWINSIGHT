import React, { useState } from 'react';
import { X, Loader2, AlertTriangle, Lock, Unlock } from 'lucide-react';
import { suspendPartnerAccount, freezePartnerAccount } from '../../../services/cooApi';
import { toast } from 'react-hot-toast';

interface SuspendPartnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partner: any;
}

const SuspendPartnerDialog: React.FC<SuspendPartnerDialogProps> = ({ isOpen, onClose, onSuccess, partner }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !partner) return null;

  const isReactivating = partner.frozen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Reason is only required when suspending
    if (!isReactivating && reason.trim().length < 10) {
      setError("Please provide a valid reason (min 10 characters) for auditing purposes.");
      return;
    }

    try {
      setLoading(true);
      if (isReactivating) {
         // Use the simpler endpoint if just reactivating (no strict audit reason needed usually)
         await freezePartnerAccount(partner.id, false);
         toast.success("Partner reactivated successfully");
      } else {
         await suspendPartnerAccount(partner.id, reason);
         toast.success("Partner suspended successfully");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || `Failed to ${isReactivating ? 'reactivate' : 'suspend'} partner`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden font-inter">
        <div className={`p-6 border-b flex justify-between items-center ${isReactivating ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
          <div>
            <h2 className={`text-xl font-bold font-outfit ${isReactivating ? 'text-emerald-800' : 'text-red-800'}`}>
               {isReactivating ? 'Reactivate Profile' : 'Suspend Profile'}
            </h2>
            <p className={`text-sm mt-1 ${isReactivating ? 'text-emerald-600/70' : 'text-red-600/70'}`}>
               Target: <strong className="font-bold">{partner.name}</strong>
            </p>
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
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
             {isReactivating ? (
                <p>This will restore access and normal operations for <strong className="text-slate-800">{partner.name}</strong>. Their portfolios and wallet balance will resume active standing.</p>
             ) : (
                <p>This action will immediately restrict <strong className="text-slate-800">{partner.name}</strong> from platform access. Their portfolios and wallet operations will be halted pending review.</p>
             )}
          </div>

          {!isReactivating && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Audit Reason <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-red-400 focus:ring-1 focus:ring-red-400 rounded-2xl text-sm font-medium text-slate-800 outline-none transition-all resize-none"
                placeholder="Detail the infraction or protocol reason for this action."
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Minimum 10 characters. This action will be securely logged.</p>
            </div>
          )}

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
              disabled={loading || (!isReactivating && reason.trim().length < 10)}
              className={`px-6 py-2.5 rounded-xl font-bold text-white transition-colors flex items-center justify-center min-w-[140px] ${isReactivating ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                 <>{isReactivating ? <Unlock size={16} className="mr-2" /> : <Lock size={16} className="mr-2" />} {isReactivating ? 'Reactivate' : 'Suspend'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuspendPartnerDialog;
