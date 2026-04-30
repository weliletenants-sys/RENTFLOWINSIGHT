import { useState } from 'react';
import { ChevronDown, MapPin, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AgentRentPaymentGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm mt-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <CheckCircle2 size={16} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">How to Track & Collect</h3>
        </div>
        <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 bg-white dark:bg-slate-800 animate-in slide-in-from-top-2 duration-200">
          {[
            { step: 1, icon: MapPin, title: 'Visit Tenant', desc: 'Go to the property and tap Visit Tenant.' },
            { step: 2, icon: ShieldCheck, title: 'Check In', desc: 'Secure GPS check-in verifies your location.' },
            { step: 3, icon: Banknote, title: 'Record Payment', desc: 'Enter cash or MoMo info.' },
            { step: 4, icon: CheckCircle2, title: 'Sync Ledger', desc: 'Instant updates to wallet.' }
          ].map((s) => (
            <div key={s.step} className="flex gap-3 items-start relative">
               <div className="flex flex-col items-center">
                  <div className="w-6 h-6 z-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </div>
                  {s.step !== 4 && <div className="w-0.5 h-full absolute top-6 bg-slate-100 dark:bg-slate-700" />}
               </div>
               <div className="pt-0.5 pb-2">
                 <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.title}</h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
