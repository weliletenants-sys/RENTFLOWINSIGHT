import { useState } from 'react';
import { X, MapPin, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VisitPaymentWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisitPaymentWizard({ isOpen, onClose }: VisitPaymentWizardProps) {
  const [step, setStep] = useState(1);
  const [tenant, setTenant] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLocationCheck = () => {
    setIsLocating(true);
    // Simulate browser GPS Geolocation lookup latency
    setTimeout(() => {
      setIsLocating(false);
      setLocationSuccess(true);
      setTimeout(() => setStep(3), 1000);
    }, 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  // MOCK DATA for agent's assigned tenants
  const myTenants = ['Sarah Mutoni', 'David Ochieng', 'Kevin Ndegwa'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full sm:w-[500px] h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-300">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-center border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Visit & Collect</h2>
            <p className="text-sm font-medium text-gray-500">Step {step} of 4</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Dynamic Wizard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-purple-100 text-[#512DA8] w-6 h-6 flex items-center justify-center rounded-full text-sm">1</span> 
                Select Tenant
              </h3>
              <div className="space-y-3">
                {myTenants.map((t) => (
                  <button 
                    key={t}
                    onClick={() => { setTenant(t); setStep(2); }}
                    className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-[#512DA8] hover:bg-purple-50 transition flex justify-between items-center group"
                  >
                    <span className="font-bold text-gray-800 group-hover:text-[#512DA8]">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center justify-center py-8">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="bg-purple-100 text-[#512DA8] w-6 h-6 flex items-center justify-center rounded-full text-sm">2</span> 
                GPS Check-In
              </h3>
              <p className="text-center text-sm text-gray-500 mb-8 max-w-[280px]">
                We need to verify your physical presence at {tenant}'s registered property.
              </p>

              {locationSuccess ? (
                <div className="flex flex-col items-center gap-4 text-[#00E676] animate-in zoom-in">
                  <ShieldCheck size={80} strokeWidth={1.5} />
                  <span className="font-bold tracking-wide">Location Verified</span>
                </div>
              ) : (
                <button 
                  onClick={handleLocationCheck}
                  disabled={isLocating}
                  className={`w-40 h-40 rounded-full flex flex-col justify-center items-center gap-3 text-white shadow-xl transition-all duration-300 ${isLocating ? 'bg-purple-400 scale-95 animate-pulse' : 'bg-[#512DA8] hover:scale-105 active:scale-95'}`}
                >
                  <MapPin size={40} className={isLocating ? 'animate-bounce' : ''} />
                  <span className="font-bold uppercase tracking-wider text-sm">{isLocating ? 'Locating...' : 'Check In'}</span>
                </button>
              )}
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handlePaymentSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-purple-100 text-[#512DA8] w-6 h-6 flex items-center justify-center rounded-full text-sm">3</span> 
                Record Payment
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount Collected (UGX)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Banknote size={20} /></div>
                    <input 
                      type="number" 
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 150000"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 text-lg focus:outline-none focus:border-[#512DA8] focus:ring-4 focus:ring-purple-500/10 transition"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Method</label>
                   <div className="grid grid-cols-3 gap-2">
                     {['Cash', 'MTN MoMo', 'Airtel'].map((m) => (
                       <button
                         key={m}
                         type="button"
                         onClick={() => setMethod(m)}
                         className={`py-3 rounded-xl text-sm font-bold border-2 transition ${method === m ? 'border-[#512DA8] bg-purple-50 text-[#512DA8]' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'}`}
                       >
                         {m}
                       </button>
                     ))}
                   </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={!amount || !method}
                  className="w-full mt-4 bg-[#512DA8] text-white py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 transition active:scale-[0.98]"
                >
                  Confirm & Sync to Ledger
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center py-10 text-center">
               <div className="w-24 h-24 bg-green-100 rounded-full flex justify-center items-center text-[#00E676] mb-6 shadow-inner">
                 <CheckCircle2 size={50} strokeWidth={2.5} />
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Collection Authorized</h2>
               <p className="text-gray-500 max-w-[250px] mx-auto text-sm mb-6">
                 UGX {Number(amount).toLocaleString()} collected from {tenant} has been synced securely.
               </p>
               
               <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 w-full mb-8">
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Blockchain REF ID</p>
                 <p className="font-mono text-lg font-bold text-[#512DA8] tracking-widest">WLL-8X91P3M</p>
               </div>

               <button 
                 onClick={onClose}
                 className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-lg transition active:scale-[0.98]"
               >
                 Done & Return to Dashboard
               </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
