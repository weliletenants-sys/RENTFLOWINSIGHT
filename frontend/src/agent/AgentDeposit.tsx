import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Wallet,
  Smartphone,
  Store,
  CheckCircle2,
  Info,
  Clock,
  Lock,
  HelpCircle,
  Loader2,
  CheckCircle,
  X,
} from 'lucide-react';
import { getWalletBalance, requestDeposit } from '../services/agentApi';
import toast from 'react-hot-toast';

const QUICK_AMOUNTS = [10_000, 50_000, 100_000];

export default function AgentDeposit() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'mobile' | 'agent'>('mobile');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txRef] = useState(() => 'WF-' + Math.random().toString(36).slice(2, 10).toUpperCase());
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await getWalletBalance();
        setCurrentBalance(data.balance || 0);
      } catch (err: any) {
        toast.error(err.isProblemDetail ? err.detail : 'Failed to fetch wallet');
      }
    };
    fetchBalance();
  }, []);

  const numericAmount = parseFloat(amount) || 0;

  const fmt = (n: number) => n.toLocaleString('en-UG', { minimumFractionDigits: 0 });

  const handleDeposit = async () => {
    setIsLoading(true);
    try {
      await requestDeposit({
        amount: numericAmount,
        method: method,
        reference: txRef
      });
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err.isProblemDetail ? err.detail : 'Failed to process deposit.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 font-['Public_Sans']">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Deposit</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ───── Left column ───── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Current Balance */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Balance</p>
                <p className="text-2xl font-bold mt-1">UGX {fmt(currentBalance)}</p>
              </div>
              <div className="size-12 rounded-full bg-[#6c11d4]/10 flex items-center justify-center">
                <Wallet size={24} className="text-[#6c11d4]" />
              </div>
            </div>

            {/* Amount Input */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Amount to deposit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">UGX</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-16 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-[#6c11d4] focus:ring-2 focus:ring-[#6c11d4]/20 rounded-xl text-xl font-bold transition-all placeholder:text-slate-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className="px-4 py-2 rounded-lg bg-[#6c11d4]/5 hover:bg-[#6c11d4]/10 border border-[#6c11d4]/20 text-[#6c11d4] text-sm font-semibold transition-colors"
                  >
                    {fmt(q)}
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Method */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Deposit Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile Money */}
                <div
                  onClick={() => setMethod('mobile')}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${method === 'mobile' ? 'border-[#6c11d4] bg-[#6c11d4]/5 dark:bg-[#6c11d4]/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                >
                  <div className={`size-10 rounded-lg flex items-center justify-center ${method === 'mobile' ? 'bg-[#6c11d4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    <Smartphone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100">Mobile Money</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Instant deposit</p>
                  </div>
                  {method === 'mobile' && <CheckCircle2 size={20} className="text-[#6c11d4] shrink-0" />}
                </div>

                {/* Agent Deposit */}
                <div
                  onClick={() => setMethod('agent')}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${method === 'agent' ? 'border-[#6c11d4] bg-[#6c11d4]/5 dark:bg-[#6c11d4]/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                >
                  <div className={`size-10 rounded-lg flex items-center justify-center ${method === 'agent' ? 'bg-[#6c11d4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    <Store size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100">Agent Deposit</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">At physical branch</p>
                  </div>
                  {method === 'agent' && <CheckCircle2 size={20} className="text-[#6c11d4] shrink-0" />}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Info size={18} className="text-[#6c11d4]" />
                Deposit Instructions
              </h4>
              {method === 'mobile' ? (
                <div className="space-y-3">
                  {[
                    'Dial the USSD code (*165# for MTN, *185# for Airtel).',
                    <>Enter the Welile Merchant Code: <span className="font-black text-yellow-600">MTN (090777)</span> or <span className="font-black text-red-600">Airtel (4380664)</span></>,
                    'Enter the amount you wish to deposit.',
                    <>Enter your account reference number: <span className="font-bold text-slate-900 dark:text-slate-100">W-9023</span></>,
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="flex-shrink-0 size-6 rounded-full bg-[#6c11d4]/10 text-[#6c11d4] text-xs font-bold flex items-center justify-center border border-[#6c11d4]/20">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{step}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  Please visit any authorized Welile agent station near you. Provide your account number and the cash amount to the agent to complete your deposit.
                </p>
              )}
            </div>
          </div>

          {/* ───── Right column ───── */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-[#6c11d4]/5 border border-slate-100 dark:border-slate-800 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Deposit amount</span>
                  <span className="font-bold">UGX {fmt(numericAmount)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Selected method</span>
                  <span className="font-medium text-[#6c11d4]">{method === 'mobile' ? 'Mobile Money' : 'Agent Deposit'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Transaction fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50 mb-8">
                <div className="flex gap-3">
                  <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200 leading-tight">
                    Funds will reflect in your account balance immediately after confirmation from the service provider.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDeposit}
                disabled={isLoading || numericAmount <= 0}
                className="w-full bg-[#6c11d4] hover:bg-[#6c11d4]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#6c11d4]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Confirm Deposit'
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2">
                <Lock size={12} className="text-slate-400" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Secure Encrypted Transaction</span>
              </div>
            </div>

            {/* Support card */}
            <div className="mt-6 bg-slate-100 dark:bg-slate-800/50 p-6 rounded-xl flex items-center gap-4">
              <div className="size-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                <HelpCircle size={20} className="text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Need help?</p>
                <p className="text-xs text-slate-500">Our support is available 24/7</p>
              </div>
              <a className="ml-auto text-[#6c11d4] text-sm font-bold hover:underline" href="#">Chat now</a>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-600">© 2024 Welile Fintech Solutions. All rights reserved.</p>
        </div>
      </footer>

      {/* ───── Success Modal ───── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5 relative">
            <button
              onClick={() => { setShowSuccess(false); navigate(-1); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="text-green-500" size={48} strokeWidth={1.5} />
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Deposit Successful!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Your balance has been updated.</p>
            </div>

            <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Deposited</span>
                <span className="font-bold text-slate-900 dark:text-white">UGX {fmt(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method</span>
                <span className="font-bold text-slate-900 dark:text-white">{method === 'mobile' ? 'Mobile Money' : 'Agent Deposit'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Reference</span>
                <span className="font-mono font-bold text-[#6c11d4]">{txRef}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">New Balance</span>
                <span className="font-bold text-green-600">UGX {fmt(currentBalance + numericAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => { setShowSuccess(false); navigate(-1); }}
              className="w-full bg-[#6c11d4] hover:bg-[#6c11d4]/90 text-white font-bold py-3 rounded-xl transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
