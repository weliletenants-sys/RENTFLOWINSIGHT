import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, UserCheck, ArrowRight } from 'lucide-react';

interface AgentTopUpTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentTopUpTenantDialog({ isOpen, onClose }: AgentTopUpTenantDialogProps) {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tenantFound, setTenantFound] = useState<{name: string, phone: string} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = () => {
    if (phoneNumber.length >= 8) {
      setIsSearching(true);
      // Simulate backend search delay
      setTimeout(() => {
        setTenantFound({ name: "Sarah Mutoni (Tenant)", phone: phoneNumber });
        setIsSearching(false);
      }, 600);
    }
  };

  const handleProceed = () => {
    onClose();
    // In production, you would pass state: { tenantId: tenantFound }
    navigate('/pay-welile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-0 transition-opacity">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-300 border border-slate-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 sticky top-0">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white tracking-wide">Find Tenant</h2>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1">Select the tenant you are paying rent for</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95 shrink-0">
            <X size={20} className="dark:text-slate-400" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Search via Phone Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500">
                   <Search size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type="tel" 
                  autoFocus
                  placeholder="e.g. 0770 000 000"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (tenantFound) setTenantFound(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-[1.25rem] pl-11 pr-24 py-4 text-[15px] font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                <button 
                  type="button"
                  onClick={handleSearch}
                  disabled={phoneNumber.length < 8 || isSearching}
                  className="absolute right-2 px-4 py-2 bg-slate-900 dark:bg-purple-600 text-white text-[12px] font-bold rounded-xl transition-all disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-slate-700 active:scale-95 disabled:text-slate-400"
                >
                  {isSearching ? '...' : 'Find'}
                </button>
              </div>
            </div>
            
            {/* Search Match Result Layer */}
            <div className={`transition-all duration-500 transform ${tenantFound ? 'opacity-100 translate-y-0 scale-100 flex flex-col gap-2' : 'opacity-0 translate-y-4 scale-95 pointer-events-none absolute'}`}>
              {tenantFound && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-[1.25rem] p-4 flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                   <div className="w-12 h-12 bg-white dark:bg-emerald-400/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
                      <UserCheck size={22} strokeWidth={2.5} />
                   </div>
                   <div className="flex-1">
                      <p className="text-[11px] font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider mb-0.5">Verified Tenant</p>
                      <p className="text-[16px] font-extrabold text-emerald-900 dark:text-emerald-100 leading-tight">{tenantFound.name}</p>
                   </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Action Area */}
        <div className="p-6 pt-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
          <button 
            onClick={handleProceed}
            disabled={!tenantFound}
            className="w-full bg-gradient-to-r from-purple-600 to-[#5a2e9d] hover:from-purple-500 hover:to-[#482283] dark:from-purple-500 dark:to-[#482283] disabled:opacity-50 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white font-bold py-4 rounded-[1.25rem] shadow-[0_8px_20px_rgb(147,51,234,0.2)] dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 group text-[15px]"
          >
            Select & Proceed to Payment
            <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
