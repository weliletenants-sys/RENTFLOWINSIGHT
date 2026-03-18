import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Search, CheckCircle2, MapPin, Clock, User, Download, Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const MOCK_TENANTS = [
  { id: 't-101', name: 'Johnathan Mulema', phone: '+256 702 344 123', status: 'Active Tenant', outstanding: 450000, daily: 15000 },
  { id: 't-102', name: 'Grace Nakato', phone: '+256 772 987 654', status: 'Active Tenant', outstanding: 50000, daily: 20000 },
];

export default function AgentReceipt() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant] = useState<typeof MOCK_TENANTS[0] | null>(MOCK_TENANTS[0]); // Default to first for UI demo
  const [amountPaid, setAmountPaid] = useState('15000');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOMO' | 'BANK'>('CASH');
  const [paymentType, setPaymentType] = useState('Daily Repayment');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  // Calculations
  const numAmount = parseFloat(amountPaid) || 0;
  const newBalance = useMemo(() => {
    if (!selectedTenant) return 0;
    return Math.max(0, selectedTenant.outstanding - numAmount);
  }, [selectedTenant, numAmount]);

  const daysCovered = useMemo(() => {
    if (!selectedTenant || selectedTenant.daily === 0) return 0;
    return Math.floor(numAmount / selectedTenant.daily);
  }, [selectedTenant, numAmount]);

  const handleGenerateReceipt = async () => {
    if (!selectedTenant) return toast.error('Please select a tenant');
    if (numAmount <= 0) return toast.error('Please enter a valid amount');
    
    setIsSubmitting(true);
    try {
      // Simulate API call and offline logic
       await new Promise(resolve => setTimeout(resolve, 1500));
       
       if (!navigator.onLine) {
         toast.success('Saved locally. Will sync when online.');
       } else {
         toast.success('Receipt generated securely!');
       }
       setReceiptId(`RCPT-${Math.floor(100000 + Math.random() * 900000)}`);
       setIsSuccess(true);
    } catch (e) {
      toast.error('Failed to generate receipt');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#f8fafc] dark:bg-[#1e1e1e] min-h-screen flex justify-center font-['Inter'] pb-20">
        <main className="w-full max-w-md bg-white dark:bg-[#1e1e1e] min-h-screen relative flex flex-col p-4 animate-in fade-in slide-in-from-bottom-4">
           
           <div className="flex-1 flex flex-col items-center justify-center space-y-6 pt-10">
             <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-2">
               <CheckCircle2 size={40} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Recorded</h2>
             <p className="text-slate-500 text-center text-sm">Receipt {receiptId} has been securely logged to the system.</p>

             {/* Receipt Card */}
             <div className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden relative mt-4">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f8fafc] dark:bg-[#1e1e1e] rounded-full"></div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f8fafc] dark:bg-[#1e1e1e] rounded-full"></div>
                <div className="p-6 space-y-4">
                  <div className="text-center border-b border-dashed border-slate-200 dark:border-slate-700 pb-4">
                    <p className="text-[10px] font-bold text-[#6d28d9] tracking-[0.2em] uppercase mb-1">Welile Fintech</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">UGX {numAmount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{new Date(transactionDate).toLocaleDateString()} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Tenant</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedTenant?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Method</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{paymentMethod.toLowerCase()} Payment</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Type</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{paymentType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Agent</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Current Agent</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-700/50">
                      <span className="text-xs font-medium text-slate-900 dark:text-white">New Balance</span>
                      <span className="text-sm font-bold text-[#6d28d9]">UGX {newBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
             </div>

             <div className="flex flex-col gap-3 w-full pt-6">
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">
                  <Share2 size={18} /> Send via WhatsApp
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm">
                    <Download size={16} /> PDF
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300">
                    Done
                  </button>
                </div>
             </div>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-[#1e1e1e] min-h-screen flex justify-center font-['Inter']">
      <main className="w-full max-w-md bg-white dark:bg-[#1e1e1e] min-h-screen relative flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-700 dark:text-slate-300">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Record Payment</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${navigator.onLine ? 'bg-green-500' : 'bg-amber-500'}`}></span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{navigator.onLine ? 'Online' : 'Offline'}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-32">
          {/* Tenant Selection */}
          <section className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Search Tenant</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:ring-[#6d28d9] focus:border-[#6d28d9] text-sm transition-all" 
                  placeholder="Search by name or phone" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={20} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            {selectedTenant && (
              <div className="bg-[#f5f3ff] dark:bg-[#6d28d9]/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{selectedTenant.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedTenant.phone}</p>
                  </div>
                  <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-[#6d28d9] border border-purple-200 dark:border-purple-800 uppercase">{selectedTenant.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-purple-200/50 dark:border-purple-900/30">
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Outstanding</p>
                    <p className="text-sm font-bold text-red-600">UGX {selectedTenant.outstanding.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Daily Expected</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">UGX {selectedTenant.daily.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Payment Details */}
          <section className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount Paid (UGX)</label>
              <input 
                type="number" 
                className="w-full text-3xl font-bold tracking-tight py-4 px-0 border-0 border-b-2 border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:ring-0 focus:border-[#6d28d9] transition-all" 
                placeholder="0" 
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Method</p>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'CASH' ? 'border-[#6d28d9] bg-[#f5f3ff] dark:bg-[#6d28d9]/10 text-[#6d28d9]' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'}`}
                >
                  <span className="text-xs font-semibold">Cash</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('MOMO')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'MOMO' ? 'border-[#6d28d9] bg-[#f5f3ff] dark:bg-[#6d28d9]/10 text-[#6d28d9]' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'}`}
                >
                  <span className="text-xs font-semibold">Mobile Money</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('BANK')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'BANK' ? 'border-[#6d28d9] bg-[#f5f3ff] dark:bg-[#6d28d9]/10 text-[#6d28d9]' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'}`}
                >
                  <span className="text-xs font-semibold">Bank</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Type</p>
              <div className="grid grid-cols-1 gap-2">
                {['Daily Repayment', 'Rent Contribution', 'Advance Payment'].map((type) => (
                  <label key={type} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${paymentType === type ? 'border-[#6d28d9] bg-[#f5f3ff] dark:bg-[#6d28d9]/10' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                    <input 
                      type="radio" 
                      name="payment_type" 
                      checked={paymentType === type}
                      onChange={() => setPaymentType(type)}
                      className="text-[#6d28d9] focus:ring-[#6d28d9] h-4 w-4 border-slate-300"
                    />
                    <span className="ml-3 text-sm font-medium dark:text-slate-200">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Smart Calculation Box */}
          <section className="bg-slate-900 rounded-2xl p-5 text-white space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-500/20 rounded">
                <CheckCircle2 size={16} className="text-green-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Impact Summary</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] text-slate-400 mb-1">New Balance</p>
                <p className="text-sm font-bold">{newBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 mb-1">Remaining</p>
                <p className="text-sm font-bold">{newBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 mb-1">Days Covered</p>
                <p className="text-sm font-bold text-green-400">+{daysCovered} Day{daysCovered !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </section>

          {/* Date Selection */}
          <section className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-[#6d28d9] focus:border-[#6d28d9] text-sm dark:text-white" 
              />
            </div>
          </section>

          {/* Receipt Preview */}
          <section className="space-y-4 pt-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Review Receipt</h2>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden relative">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f8fafc] dark:bg-[#1e1e1e] rounded-full"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f8fafc] dark:bg-[#1e1e1e] rounded-full"></div>
              <div className="p-6 space-y-4">
                <div className="text-center border-b border-dashed border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-[10px] font-bold text-[#6d28d9] tracking-[0.2em] uppercase mb-1">Welile Fintech</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">UGX {numAmount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{new Date(transactionDate).toLocaleDateString()} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Tenant</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedTenant?.name || '---'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Method</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{paymentMethod.toLowerCase()} Payment</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Agent</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Current Agent</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-700/50">
                    <span className="text-xs font-medium text-slate-900 dark:text-white">New Balance</span>
                    <span className="text-sm font-bold text-[#6d28d9]">UGX {newBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Fraud Prevention Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-2 opacity-60 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span className="text-[10px] font-medium">Location Captured</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span className="text-[10px] font-medium">Timestamp Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={12} />
              <span className="text-[10px] font-medium">Agent Logged</span>
            </div>
          </div>
        </div>

        {/* Floating Action */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-[#1e1e1e] border-t border-slate-100 dark:border-slate-800 p-4 pb-6 z-50 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleGenerateReceipt}
            disabled={isSubmitting || !selectedTenant || numAmount <= 0}
            className="w-full bg-[#6d28d9] hover:bg-[#5a1bb9] text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isSubmitting ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Generate Receipt'
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
