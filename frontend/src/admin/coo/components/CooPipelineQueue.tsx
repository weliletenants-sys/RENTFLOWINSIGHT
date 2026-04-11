import { useState, useEffect } from 'react';
import { ShieldCheck, Clock, ArrowRight, Home, CreditCard, ChevronRight } from 'lucide-react';
import { formatMoney } from '../../../utils/currency';
import toast from 'react-hot-toast';

export default function CooPipelineQueue() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    // Mocking rent pipeline waiting on COO operational sign-off
    const mockData = [
      { id: 'RQ-8819', tenant: 'Alex Mugisha', property: 'Sunset View Apt 3B', amount: 850000, daysPending: 1 },
      { id: 'RQ-9012', tenant: 'David Kirabo', property: 'Kampala Heights #12', amount: 1200000, daysPending: 2 }
    ];
    setTimeout(() => {
      setRequests(mockData);
      setLoading(false);
    }, 800);
  }, []);

  const handleApprove = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      toast.success('Authorized securely. Escalated to CFO ledger.');
      setRequests(prev => prev.filter(req => req.id !== id));
      setProcessingId(null);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm animate-pulse h-64 flex flex-col p-6">
        <div className="h-6 w-48 bg-slate-200 rounded-full mb-8"></div>
        <div className="flex-1 space-y-4">
          <div className="h-16 w-full bg-slate-100 rounded-2xl"></div>
          <div className="h-16 w-full bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-[var(--color-primary-border)] overflow-hidden relative group transition-all duration-300 hover:shadow-[0_8px_40px_var(--color-primary-shadow)]">
      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)]"></div>
      
      <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 border-b border-[var(--color-primary-border)]">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
              <ShieldCheck size={18} className="text-indigo-600" />
            </div>
            Pipeline Queue
          </h2>
          <p className="text-[13px] font-semibold text-slate-500 mt-1.5 ml-11">Awaiting Operations Sign-off (Landlord Approved)</p>
        </div>
        <div className="px-4 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-xs font-bold flex items-center gap-2">
          <Clock size={14} className="animate-pulse" /> {requests.length} Priority Items
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-3">
        {requests.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ShieldCheck size={48} className="mx-auto text-emerald-400 mb-4 opacity-50" />
            <p className="text-sm font-bold tracking-widest uppercase">Pipeline Empty</p>
          </div>
        ) : (
          requests.map(req => (
            <div 
              key={req.id} 
              className="flex flex-col lg:flex-row items-center justify-between p-4 md:p-5 bg-white border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 rounded-2xl transition-all duration-300 gap-6 shadow-sm hover:shadow-md"
            >
              <div className="flex w-full lg:w-auto items-center gap-5 flex-1 cursor-default">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner">
                   <Home size={20} className="text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 rounded-sm">{req.id}</span>
                    {req.daysPending > 1 && (
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 rounded-sm border border-rose-100">Delayed</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{req.tenant}</h3>
                  <p className="text-[13px] font-medium text-slate-500 mt-0.5">{req.property}</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-6 w-full lg:w-auto justify-end">
                <div className="text-left lg:text-right w-full lg:w-auto border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Target Capital</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight flex items-center lg:justify-end gap-1.5">
                    <span className="text-sm text-slate-400 font-bold">UGX</span>
                    {formatMoney(req.amount)}
                  </p>
                </div>
                
                <button
                  onClick={() => handleApprove(req.id)}
                  disabled={processingId === req.id}
                  className="w-full lg:w-auto overflow-hidden relative group/btn h-12 flex items-center justify-center px-8 bg-slate-900 text-white rounded-xl font-semibold shadow-sm hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                >
                  <span className={`relative z-10 flex items-center gap-2 transition-transform duration-300 ${processingId === req.id ? 'translate-y-[-100%]' : 'translate-y-0'}`}>
                    Authorize <ChevronRight size={16} className="text-slate-400 group-hover/btn:text-white transition-colors" />
                  </span>
                  
                  {/* Processing State */}
                  <span className={`absolute inset-0 z-20 flex items-center justify-center gap-2 text-white bg-indigo-600 transition-all duration-300 ${processingId === req.id ? 'translate-y-0' : 'translate-y-[100%]'}`}>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     <span className="text-sm font-bold tracking-wider">SECURE</span>
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
         <button className="text-[11px] font-black tracking-widest text-[#6c11d4] uppercase hover:text-indigo-800 transition-colors flex items-center justify-center gap-1.5 w-full">
            Review Historical Logs <ArrowRight size={12} />
         </button>
      </div>
    </div>
  );
}
