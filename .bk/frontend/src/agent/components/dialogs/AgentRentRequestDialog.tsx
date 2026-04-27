import React, { useState } from 'react';
import { X, Building, Calendar, Banknote } from 'lucide-react';

interface AgentRentRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function AgentRentRequestDialog({ isOpen, onClose, onSubmit }: AgentRentRequestDialogProps) {
  const [tenantName, setTenantName] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [duration, setDuration] = useState('1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ tenantName, rentAmount, duration });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] w-full max-w-md overflow-hidden shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Submit Rent Request</h2>
            <p className="text-xs text-gray-500 mt-1">Facilitate rent on behalf of a tenant</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tenant Name or Phone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. John Doe or 077..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#512DA8] focus:border-transparent transition-all"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Rent Amount (UGX)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Banknote className="text-gray-400" size={18} />
              </div>
              <input
                type="number"
                required
                min="50000"
                step="10000"
                placeholder="Enter amount"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#512DA8] focus:border-transparent transition-all"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Duration (Months)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="text-gray-400" size={18} />
              </div>
              <select
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#512DA8] focus:border-transparent transition-all appearance-none"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#512DA8] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#4527a0] transition-colors active:scale-[0.98]"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
