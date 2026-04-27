import React, { useState } from 'react';
import { X, MapPin, Banknote, MapPinned } from 'lucide-react';

interface RecordAgentCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function RecordAgentCollectionDialog({ isOpen, onClose, onSubmit }: RecordAgentCollectionDialogProps) {
  const [tenantName, setTenantName] = useState('');
  const [amount, setAmount] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [location, setLocation] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    // Simulate GPS fetch
    setTimeout(() => {
      setLocation('0.3476° N, 32.5825° E (Kampala)');
      setIsGettingLocation(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ tenantName, amount, location });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] w-full max-w-md overflow-hidden shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-amber-50">
          <div>
            <h2 className="text-lg font-bold text-amber-900">Record Field Collection</h2>
            <p className="text-xs text-amber-700/70 mt-1">Cash collected physically from tenant</p>
          </div>
          <button onClick={onClose} className="p-2 text-amber-900/50 hover:text-amber-900 hover:bg-amber-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tenant Details</label>
            <input
              type="text"
              required
              placeholder="Search tenant name or ID"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Amount Collected (UGX)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Banknote className="text-gray-400" size={18} />
              </div>
              <input
                type="number"
                required
                min="5000"
                step="5000"
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-bold text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">GPS Proof of Visit</label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isGettingLocation || location !== null}
              className={`w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl transition-all ${
                location 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-gray-50 border-gray-200 text-[#512DA8] hover:border-[#512DA8]/50 hover:bg-purple-50'
              }`}
            >
              {location ? (
                <>
                  <MapPinned size={18} />
                  <span className="font-bold text-sm">Location Verified: {location.split(' ')[0]}...</span>
                </>
              ) : (
                <>
                  <MapPin size={18} className={isGettingLocation ? "animate-bounce" : ""} />
                  <span className="font-bold text-sm">
                    {isGettingLocation ? 'Fetching GPS Data...' : 'Tap to pin current location'}
                  </span>
                </>
              )}
            </button>
            {!location && <p className="text-[10px] text-gray-400 text-center mt-1.5">Required to finalize physical collections safely</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!location}
              className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
            >
              Confirm Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
