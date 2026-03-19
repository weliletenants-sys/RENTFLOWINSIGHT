import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  LayoutGrid, 
  Banknote, 
  Wallet, 
  CircleDollarSign, 
  AlertTriangle, 
  Info, 
  Calendar, 
  FileText, 
  BarChart3, 
  Receipt, 
  CheckCircle, 
  ArrowRight, 
  CloudOff 
} from 'lucide-react';

const AgentRequestAdvance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [maxLimit, setMaxLimit] = useState(1000000);
  const [currentBalance] = useState(50000); // Mock/Fallback balance

  const [advanceType, setAdvanceType] = useState('Salary Advance');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineSaved, setOfflineSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/agent/advances');
        if (res.data.maxLimit) setMaxLimit(res.data.maxLimit);
      } catch (err) {
        console.warn("Failed to fetch advance limits dynamically, using defaults");
      }
    };
    fetchData();
  }, []);

  const numAmount = Number(amount) || 0;
  const isOverLimit = numAmount > maxLimit;
  const serviceFee = numAmount * 0.0125;
  const totalRepayment = numAmount + serviceFee;

  const handleSubmit = async () => {
    if (numAmount <= 0) return setError("Please enter a valid amount.");
    if (isOverLimit) return setError(`Cannot exceed your limit of ${maxLimit.toLocaleString()} UGX.`);

    setLoading(true);
    setError(null);

    const payload = {
      amount: numAmount,
      advance_type: advanceType,
      reason,
      expected_date: date
    };

    if (!navigator.onLine) {
      const offlineQueue = JSON.parse(localStorage.getItem('pending_advances') || '[]');
      offlineQueue.push({ ...payload, timestamp: Date.now() });
      localStorage.setItem('pending_advances', JSON.stringify(offlineQueue));
      setOfflineSaved(true);
      setSuccess(true);
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/agent/advances/request', payload);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-[#0f0a1a] text-slate-900 dark:text-slate-100 min-h-screen bg-[#fcfaff]" style={{
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(109, 40, 217, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(109, 40, 217, 0.05) 0px, transparent 50%)'
    }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f0a1a]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center justify-center w-11 h-11 rounded-2xl hover:bg-slate-100 dark:bg-transparent dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <ArrowLeft className="text-slate-700 dark:text-slate-300" size={24} />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Request Advance</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user ? `${user.firstName} ${user.lastName}` : 'Welile Agent'}</p>
              <p className="text-[10px] text-[#6d28d9] font-bold uppercase tracking-widest">ID: {user?.id?.substring(0,8).toUpperCase() || 'AG-00000'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#6d28d9]/10 border-2 border-[#6d28d9]/20 overflow-hidden">
               <div className="w-full h-full bg-[#6d28d9]/20" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#6d28d9]/10 flex items-center justify-center overflow-hidden border border-[#6d28d9]/20">
                    <ShieldCheck className="text-[#6d28d9]" size={36} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user ? `${user.firstName} ${user.lastName}` : 'Welile Agent'}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle2 className="text-green-500" size={14} />
                      <p className="text-[11px] text-slate-500 uppercase tracking-[0.1em] font-bold">Verified Professional</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-8 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Current Balance</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{currentBalance.toLocaleString()} <span className="text-xs">UGX</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Available Limit</p>
                    <p className="text-lg font-bold text-[#6d28d9] leading-none">{maxLimit.toLocaleString()} <span className="text-xs">UGX</span></p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <LayoutGrid className="text-[#6d28d9]" size={20} />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Advance Type</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="relative cursor-pointer group">
                  <input type="radio" checked={advanceType === 'Salary Advance'} onChange={() => setAdvanceType('Salary Advance')} className="peer sr-only" />
                  <div className={`p-6 rounded-3xl border-2 transition-all h-full bg-white dark:bg-slate-900 shadow-sm ${advanceType === 'Salary Advance' ? 'border-[#6d28d9] ring-4 ring-[#6d28d9]/5' : 'border-white dark:border-slate-900 group-hover:border-slate-200 dark:group-hover:border-slate-700'}`}>
                    <div className="w-12 h-12 rounded-2xl bg-[#6d28d9]/10 flex items-center justify-center mb-4 transition-colors">
                      <Banknote className="text-[#6d28d9]" size={24} />
                    </div>
                    <p className="text-base font-bold text-slate-900 dark:text-white">Salary Advance</p>
                    <p className="text-xs text-slate-500 mt-1">Deducted from your monthly payout</p>
                  </div>
                </label>
                
                <label className="relative cursor-pointer group">
                  <input type="radio" checked={advanceType === 'Float / Operational'} onChange={() => setAdvanceType('Float / Operational')} className="peer sr-only" />
                  <div className={`p-6 rounded-3xl border-2 transition-all h-full bg-white dark:bg-slate-900 shadow-sm ${advanceType === 'Float / Operational' ? 'border-[#6d28d9] ring-4 ring-[#6d28d9]/5' : 'border-white dark:border-slate-900 group-hover:border-slate-200 dark:group-hover:border-slate-700'}`}>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 transition-colors group-hover:bg-[#6d28d9]/10">
                      <Wallet className={advanceType === 'Float / Operational' ? 'text-[#6d28d9]' : 'text-slate-500 dark:text-slate-400 group-hover:text-[#6d28d9]'} size={24} />
                    </div>
                    <p className="text-base font-bold text-slate-900 dark:text-white">Float / Operational</p>
                    <p className="text-xs text-slate-500 mt-1">Short-term operational funding</p>
                  </div>
                </label>
              </div>
            </section>

            <section className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="text-[#6d28d9]" size={20} />
                    <label className="text-base font-bold text-slate-800 dark:text-slate-200">Requested Amount</label>
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">MAX {maxLimit.toLocaleString()} UGX</span>
                </div>
                <div className="relative group">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError(null);
                    }}
                    placeholder="0.00"
                    className={`w-full text-4xl font-black p-8 bg-white dark:bg-slate-900 border-2 rounded-3xl focus:border-[#6d28d9] focus:ring-4 focus:ring-[#6d28d9]/5 transition-all shadow-sm outline-none ${isOverLimit ? 'border-red-500 text-red-500' : 'border-white dark:border-slate-900'}`}
                  />
                  <div className={`absolute right-8 top-1/2 -translate-y-1/2 font-black text-2xl ${amount ? 'text-[#6d28d9]' : 'text-slate-300'}`}>UGX</div>
                </div>
                
                {isOverLimit && (
                   <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                     <AlertTriangle size={20} />
                     <p className="text-sm font-semibold leading-snug">Amount exceeds your currently authorized operational limit.</p>
                   </div>
                )}
                {!isOverLimit && numAmount >= 1000000 && (
                  <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <Info size={20} />
                    <p className="text-sm font-semibold leading-snug">Entering high-volume arrays will require explicit manual approval from the treasury team.</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-2 flex items-center gap-2">
                    <Calendar size={16} /> Disbursement Date
                  </label>
                  <input 
                     type="date"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-[#6d28d9] outline-none font-medium" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-2 flex items-center gap-2">
                    <FileText size={16} /> Reason (Optional)
                  </label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-[#6d28d9] resize-none text-sm font-medium" 
                    placeholder="Explain the context for this request..." rows={1} 
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column Checkout */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              
              <section className="bg-[#6d28d9]/5 dark:bg-[#6d28d9]/10 rounded-3xl p-8 border border-[#6d28d9]/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6d28d9]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6d28d9] mb-8 flex items-center gap-2">
                  <BarChart3 size={16} />
                  Repayment Breakdown
                </h3>
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center group">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Daily Deduction</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{Math.round(totalRepayment/30).toLocaleString()} UGX</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Duration</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">30 Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Fee (1.25%)</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{Math.round(serviceFee).toLocaleString()} UGX</span>
                  </div>
                  <div className="pt-6 border-t border-[#6d28d9]/10 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold text-[#6d28d9] uppercase tracking-widest">Total Repayment</span>
                      <p className="text-3xl font-black text-[#6d28d9] mt-1">{Math.round(totalRepayment).toLocaleString()} <span className="text-sm">UGX</span></p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`}}></div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-4">Request Confirmation</p>
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <Receipt className="text-white" size={32} />
                      </div>
                      <div>
                        <p className="text-sm font-medium opacity-70">You are requesting</p>
                        <p className="text-4xl font-black tracking-tight">{numAmount.toLocaleString()} <span className="text-base font-bold opacity-60">UGX</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-[#a78bfa] opacity-80" size={20} />
                      <p className="text-xs font-semibold">{advanceType} • Disbursement: {new Date(date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {error && <div className="p-3 rounded-xl bg-red-500/20 text-red-200 text-sm font-bold border border-red-500/30">{error}</div>}

                  <button 
                    onClick={handleSubmit}
                    disabled={loading || numAmount <= 0 || isOverLimit}
                    className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#6d28d9]/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg">{loading ? 'Processing...' : 'Submit Advance Request'}</span>
                    {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />}
                  </button>
                  <p className="text-center text-[10px] font-medium opacity-40">By clicking submit, you agree to the Terms of Service</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-12 text-center space-y-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto border-4 border-white dark:border-slate-800 shadow-xl">
              {offlineSaved ? <CloudOff className="text-green-500" size={48} /> : <CheckCircle className="text-green-500" size={48} />}
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                {offlineSaved ? 'Saved Offline!' : 'Request Successful!'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                 {offlineSaved 
                   ? "You have no internet connection. We securely cached the request into your device and will auto-sync it when connectivity returns."
                   : "Your advance request has been permanently logged and is currently heavily processed. You'll receive a notification on your native device shortly."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/agent/history')} className="flex-1 bg-[#6d28d9] text-white font-bold py-4 rounded-2xl shadow-lg transition-all">View History</button>
              <button onClick={() => navigate('/dashboard/agent')} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-2xl transition-all">Return Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentRequestAdvance;
