import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface RegisterLandlordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (landlord: any) => void;
}

export default function RegisterLandlordDialog({ isOpen, onClose, onSuccess }: RegisterLandlordDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    momo: '',
    lc1: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock simulation of API submit
    setTimeout(() => {
      onSuccess({
        name: formData.name,
        phone: formData.phone,
        location: formData.lc1,
        status: 'pending'
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="bg-white rounded-[24px] sm:rounded-2xl w-full max-w-md shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Register Landlord</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Submit details for verification</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 group"
          >
            <X className="w-5 h-5 group-hover:text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
           
           <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
             <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
             <p className="text-sm leading-snug font-medium">Adding a landlord independently requires manual calling by our support team to verify their payout methods.</p>
           </div>

           <div>
             <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Full Name</label>
             <input 
               type="text" required
               value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
               placeholder="e.g. John Kiggundu"
             />
           </div>

           <div>
             <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Phone Number</label>
             <input 
               type="tel" required
               value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
               placeholder="e.g. +256700000000"
             />
           </div>

           <div>
             <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">LC1 Details</label>
             <input 
               type="text" required
               value={formData.lc1} onChange={e => setFormData({...formData, lc1: e.target.value})}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
               placeholder="Village, Parish, Sub-county"
             />
           </div>

           <button 
             type="submit"
             disabled={isSubmitting || !formData.name || !formData.phone || !formData.lc1}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 mt-2 font-bold text-sm tracking-wide flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
           >
             {isSubmitting ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : (
               <>Submit for Verification <CheckCircle2 className="w-4 h-4 ml-1" /></>
             )}
           </button>
        </form>
      </div>
    </div>
  );
}
