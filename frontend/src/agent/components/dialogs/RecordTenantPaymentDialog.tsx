import React, { useState } from 'react';
import { X, Smartphone, CheckCircle2 } from 'lucide-react';

interface RecordTenantPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function RecordTenantPaymentDialog({ isOpen, onClose, onSubmit }: RecordTenantPaymentDialogProps) {
  const [tenantName, setTenantName] = useState('');
  const [tid, setTid] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ tenantName, tid });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] w-full max-w-md overflow-hidden shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#512DA8]">
          <div>
            <h2 className="text-lg font-bold text-white">Record Digital Payment</h2>
            <p className="text-xs text-purple-200 mt-1">Tenant paid directly via Mobile Money</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-purple-50 rounded-xl p-3 flex items-start gap-3 border border-purple-100 mb-2">
            <Smartphone className="text-[#512DA8] shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-xs text-[#512DA8] font-medium leading-relaxed">
                Use this form if a tenant made an independent deposit to Welile platforms and you need to link that payment to their scheduled rent.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tenant Details</label>
            <input
              type="text"
              required
              placeholder="Search tenant name or ID"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#512DA8] focus:border-transparent transition-all"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Transaction ID (TID)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircle2 className="text-green-500" size={18} />
              </div>
              <input
                type="text"
                required
                placeholder="Enter MTN/Airtel TID e.g. 14392811..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 tracking-wide font-mono focus:outline-none focus:ring-2 focus:ring-[#512DA8] focus:border-transparent transition-all"
                value={tid}
                onChange={(e) => setTid(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#512DA8] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#4527a0] transition-colors active:scale-[0.98]"
            >
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
