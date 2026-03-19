import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  Landmark,
  CheckCircle2,
  ArrowRight,
  Banknote,
  Loader2,
  CheckCircle,
  X,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BALANCE = 1_250_000;
const QUICK_AMOUNTS = [10_000, 50_000, 100_000];

export default function AgentWithdraw() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'mobile' | 'bank'>('mobile');
  const [mobileProvider, setMobileProvider] = useState<'airtel' | 'mtn' | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txRef] = useState(() => 'WF-' + Math.random().toString(36).slice(2, 10).toUpperCase());

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/agent/financials/withdrawal', {
        amount: numericAmount,
        method: method,
        recipient_number: phoneNumber,
        provider: mobileProvider,
        reference: txRef
      });
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to process withdrawal.');
    } finally {
      setIsLoading(false);
    }
  };

  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const remaining = BALANCE - numericAmount;

  const fmt = (n: number) =>
    n.toLocaleString('en-UG', { minimumFractionDigits: 0 });

  const handleQuick = (val: number) => setAmount(String(val));
  const handleMax = () => setAmount(String(BALANCE));

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-['Public_Sans']">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3 md:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-700 dark:text-slate-200" />
            </button>
            <h2 className="text-xl font-bold leading-tight tracking-tight">Withdraw</h2>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#6d28d9]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Secure Transfer</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl px-4 py-6 md:px-10 flex flex-col gap-6">

          {/* Balance card */}
          <section>
            <div className="bg-[#6d28d9]/5 dark:bg-[#6d28d9]/10 border border-[#6d28d9]/20 rounded-xl p-6">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-[#6d28d9]">UGX {fmt(BALANCE)}</p>
            </div>
          </section>

          {/* Amount input */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Withdrawal Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">UGX</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-16 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-2xl font-bold focus:outline-none focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Quick pick */}
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuick(q)}
                  className="flex-1 min-w-[80px] py-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#6d28d9]/10 hover:text-[#6d28d9] dark:hover:bg-[#6d28d9]/20 border border-transparent hover:border-[#6d28d9]/30 transition-all text-sm font-bold text-slate-700 dark:text-slate-300"
                >
                  {fmt(q)}
                </button>
              ))}
              <button
                onClick={handleMax}
                className="flex-1 min-w-[80px] py-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#6d28d9]/10 hover:text-[#6d28d9] dark:hover:bg-[#6d28d9]/20 border border-transparent hover:border-[#6d28d9]/30 transition-all text-sm font-bold text-slate-700 dark:text-slate-300">
                Max
              </button>
            </div>
          </section>

          {/* Withdrawal Method */}
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Withdrawal Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Mobile Money */}
              <div
                onClick={() => setMethod('mobile')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${method === 'mobile' ? 'border-[#6d28d9] bg-[#6d28d9]/5 dark:bg-[#6d28d9]/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
              >
                <div className="h-10 w-10 rounded-full bg-[#6d28d9] flex items-center justify-center text-white shrink-0">
                  <Smartphone size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Mobile Money</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Instant transfer to your wallet</p>
                </div>
                {method === 'mobile' && <CheckCircle2 size={20} className="text-[#6d28d9] shrink-0" />}
              </div>

              {/* Bank Transfer */}
              <div
                onClick={() => setMethod('bank')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${method === 'bank' ? 'border-[#6d28d9] bg-[#6d28d9]/5 dark:bg-[#6d28d9]/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-70'}`}
              >
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                  <Landmark size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Bank Transfer</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">1–3 business days</p>
                </div>
                {method === 'bank' && <CheckCircle2 size={20} className="text-[#6d28d9] shrink-0" />}
              </div>
            </div>

            {/* Mobile Money Details */}
            {method === 'mobile' && (
              <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Provider selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mobile Network</label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Airtel */}
                    <button
                      type="button"
                      onClick={() => setMobileProvider('airtel')}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        mobileProvider === 'airtel'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-red-300'
                      }`}
                    >
                      <img src="/airtel.png" alt="Airtel" className="h-9 w-9 rounded-full object-cover shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Airtel</p>
                        <p className="text-[10px] text-slate-500">Airtel Money</p>
                      </div>
                      {mobileProvider === 'airtel' && <CheckCircle2 size={16} className="text-red-500 ml-auto shrink-0" />}
                    </button>

                    {/* MTN */}
                    <button
                      type="button"
                      onClick={() => setMobileProvider('mtn')}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        mobileProvider === 'mtn'
                          ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-yellow-300'
                      }`}
                    >
                      <img src="/mtn.png" alt="MTN" className="h-9 w-9 rounded-full object-cover shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">MTN</p>
                        <p className="text-[10px] text-slate-500">MTN Mobile Money</p>
                      </div>
                      {mobileProvider === 'mtn' && <CheckCircle2 size={16} className="text-yellow-500 ml-auto shrink-0" />}
                    </button>
                  </div>
                </div>

                {/* Phone number input */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recipient Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">+256</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder="7X XXX XXXX"
                      className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-base font-semibold focus:outline-none focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>
                  <p className="text-xs text-slate-400 ml-1">Enter the number where funds should be sent.</p>
                </div>
              </div>
            )}
          </section>

          {/* Transaction Summary */}
          <section>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Transaction Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Withdrawal Amount</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">UGX {fmt(numericAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Processing Fee</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Total Deduction</span>
                  <span className="text-lg font-bold text-[#6d28d9]">UGX {fmt(numericAmount)}</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 uppercase font-medium">Remaining Balance</span>
                  <span className={`font-bold ${remaining < 0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    UGX {fmt(Math.max(remaining, 0))}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-10">
            <button
              onClick={handleWithdraw}
              disabled={isLoading || numericAmount <= 0 || numericAmount > BALANCE}
              className="w-full bg-[#6d28d9] hover:bg-[#6d28d9]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#6d28d9]/25 transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Banknote size={20} />
                  <span>Withdraw Funds</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
            <p className="mt-4 text-center text-xs text-slate-400 px-6">
              By proceeding, you agree to Welile's terms of service and transaction policies. Fund availability depends on the chosen provider's network.
            </p>
          </section>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5 relative">
            <button
              onClick={() => { setShowSuccess(false); navigate(-1); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Animated checkmark */}
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="text-green-500" size={48} strokeWidth={1.5} />
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Withdrawal Successful!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Your funds are on the way.</p>
            </div>

            {/* Summary */}
            <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Sent</span>
                <span className="font-bold text-slate-900 dark:text-white">UGX {fmt(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize">
                  {method === 'mobile' ? `${mobileProvider.toUpperCase()} Mobile Money` : 'Bank Transfer'}
                </span>
              </div>
              {method === 'mobile' && phoneNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Recipient</span>
                  <span className="font-bold text-slate-900 dark:text-white">+256 {phoneNumber}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Reference</span>
                <span className="font-mono font-bold text-[#6d28d9]">{txRef}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">New Balance</span>
                <span className="font-bold text-slate-900 dark:text-white">UGX {fmt(remaining)}</span>
              </div>
            </div>

            <button
              onClick={() => { setShowSuccess(false); navigate(-1); }}
              className="w-full bg-[#6d28d9] hover:bg-[#6d28d9]/90 text-white font-bold py-3 rounded-xl transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-8 px-4">
        <div className="mx-auto max-w-3xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#6d28d9] rounded-lg flex items-center justify-center text-white">
              <Banknote size={16} />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Welile Finance</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a className="hover:text-[#6d28d9] transition-colors" href="#">Support</a>
            <a className="hover:text-[#6d28d9] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[#6d28d9] transition-colors" href="#">Security</a>
          </div>
          <div className="text-xs text-slate-400">
            © 2024 Welile Fintech Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
