import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, WifiOff, Loader2, AlertCircle, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableBalance: number;
}

const WITHDRAW_FEE_PERCENTAGE = 0.00; // Currently Free
const DAILY_LIMIT = 5000000;

export default function AgentWithdrawSheet({ isOpen, onClose, onSuccess, availableBalance }: Props) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(user?.phone || '07XXXXXXXX');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [step, setStep] = useState<'input' | 'preview' | 'success'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const numericAmount = parseFloat(amount) || 0;
  const fees = numericAmount * WITHDRAW_FEE_PERCENTAGE;
  const totalDeduction = numericAmount + fees;
  const netReceived = numericAmount;

  // Smart Warnings priority
  let warningMessage = null;
  let isBlocker = false;
  if (totalDeduction > availableBalance) {
    warningMessage = `Exceeds available balance (UGX ${availableBalance.toLocaleString()})`;
    isBlocker = true;
  } else if (numericAmount > DAILY_LIMIT) {
    warningMessage = `Exceeds daily limit of UGX ${DAILY_LIMIT.toLocaleString()}`;
    isBlocker = true;
  } else if (numericAmount > 2000000) {
    warningMessage = 'Amounts over 2M require Manager approval and may take longer.';
    isBlocker = false;
  }

  const isValid = numericAmount > 0 && phone.length >= 10 && !isBlocker;

  const handleWithdrawAll = () => {
    // Ensure we don't exceed what is possible after fees (if fees > 0)
    // If fee = 0, we can withdraw exactly availableBalance
    const maxPoss = availableBalance / (1 + WITHDRAW_FEE_PERCENTAGE);
    setAmount(Math.floor(maxPoss).toString());
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    const payload = {
      amount: numericAmount,
      method: 'mobile_money',
      recipient_number: phone,
      provider: phone.startsWith('077') || phone.startsWith('078') ? 'MTN' : 'Airtel',
      reference: 'WD-' + Date.now().toString().slice(-6)
    };

    if (isOffline) {
      const offlineQueue = JSON.parse(localStorage.getItem('offline_withdrawals') || '[]');
      offlineQueue.push({ ...payload, timestamp: new Date().toISOString() });
      localStorage.setItem('offline_withdrawals', JSON.stringify(offlineQueue));
      setTimeout(() => {
        setIsLoading(false);
        setStep('success');
        toast.success('Saved offline. Will sync when connected.');
      }, 600);
      return;
    }

    try {
      await axios.post('/api/agent/financials/withdrawal', payload);
      setStep('success');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white dark:bg-[#221610] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {isOffline && (
            <div className="bg-amber-100 text-amber-800 text-xs font-bold py-2 text-center flex items-center justify-center gap-2 rounded-t-3xl sm:rounded-t-3xl">
              <WifiOff size={14} /> Offline — will sync when connected
            </div>
          )}

          <div className="flex items-center justify-between p-6 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Withdraw Funds</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {step === 'input' && (
              <div className="space-y-6">
                
                {/* Balance Context */}
                <div className="flex justify-between items-center p-4 bg-[#6c11d4]/5 dark:bg-[#6c11d4]/10 rounded-xl border border-[#6c11d4]/10">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Available to Withdraw</p>
                    <p className="text-2xl font-black text-[#6c11d4] tracking-tight">UGX {availableBalance.toLocaleString()}</p>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Destination Mobile</label>
                    {!isEditingPhone && (
                      <button onClick={() => setIsEditingPhone(true)} className="flex items-center gap-1 text-xs font-bold text-[#6c11d4] hover:underline">
                        <Edit2 size={12} /> Change
                      </button>
                    )}
                  </div>
                  {isEditingPhone ? (
                     <input 
                       type="tel" 
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       autoFocus
                       onBlur={() => setIsEditingPhone(false)}
                       className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-[#6c11d4] rounded-xl text-base font-bold outline-none"
                     />
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="font-bold tracking-wide">{phone}</span>
                      <span className="text-xs font-bold px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">Mobile Money</span>
                    </div>
                  )}
                </div>

                {/* Amount Input */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Amount (UGX)</label>
                    <button onClick={handleWithdrawAll} className="text-xs font-bold text-[#6c11d4] bg-[#6c11d4]/10 px-3 py-1 rounded-full hover:bg-[#6c11d4]/20 transition-colors">
                      Withdraw All
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">UGX</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-16 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xl font-black text-slate-900 dark:text-white outline-none focus:border-[#6c11d4] focus:ring-1 focus:ring-[#6c11d4] transition-all"
                    />
                  </div>
                  
                  {/* Dynamic Calculation */}
                  {numericAmount > 0 && !isBlocker && (
                    <div className="flex justify-between text-xs mt-3 px-1">
                      <span className="text-slate-500 font-medium">Net Received: <span className="font-bold text-green-600">UGX {netReceived.toLocaleString()}</span></span>
                      <span className="text-slate-500 font-medium">Fee: {fees === 0 ? 'Free' : `UGX ${fees.toLocaleString()}`}</span>
                    </div>
                  )}
                </div>

                {/* Warnings */}
                {warningMessage && (
                  <div className={`p-4 rounded-xl flex gap-3 items-start ${isBlocker ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20'}`}>
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p className="text-sm font-bold leading-tight">{warningMessage}</p>
                  </div>
                )}

                <button 
                  disabled={!isValid}
                  onClick={() => setStep('preview')}
                  className="w-full py-4 bg-[#6c11d4] hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-[#6c11d4]/20"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 'preview' && (
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Amount</span>
                    <span className="font-bold">UGX {numericAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Fees</span>
                    <span className="font-bold text-green-600">{fees === 0 ? 'Free' : `UGX ${fees.toLocaleString()}`}</span>
                  </div>
                  <div className="h-px w-full bg-slate-200 dark:bg-slate-700 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-900 dark:text-white font-bold">Net Received</span>
                    <span className="font-black text-xl text-[#6c11d4]">UGX {netReceived.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 text-sm">Destination</span>
                    <div className="flex items-center gap-2">
                      {(phone.startsWith('077') || phone.startsWith('078') || phone.startsWith('076')) ? 
                        <img src="/mtn.png" alt="MTN" className="w-5 h-5 rounded-full object-cover" /> :
                        <img src="/airtel.png" alt="Airtel" className="w-5 h-5 rounded-full object-cover" />
                      }
                      <span className="font-bold">{phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep('input')}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex-[2] py-4 flex items-center justify-center gap-2 bg-[#6c11d4] hover:bg-[#5b21b6] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#6c11d4]/20"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Withdrawal'}
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center py-2">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-1">{isOffline ? 'Saved Offline' : 'Withdrawal Requested'}</h3>
                  <p className="text-slate-500 text-sm">UGX {numericAmount.toLocaleString()} to {phone}</p>
                </div>
                
                {/* Tracker */}
                {!isOffline && (
                  <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 mb-8">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-wider">Processing Status</h4>
                    <div className="relative border-l-2 border-[#6c11d4]/20 ml-3 pl-6 space-y-6">
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-[#221610] bg-[#6c11d4]" />
                        <p className="font-bold text-sm text-[#6c11d4]">Requested</p>
                        <p className="text-xs text-slate-500">Just now</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-[#221610] bg-slate-300 dark:bg-slate-600" />
                        <p className="font-bold text-sm text-slate-500">Manager Approval</p>
                        <p className="text-xs text-slate-400">Pending</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-[#221610] bg-slate-300 dark:bg-slate-600" />
                        <p className="font-bold text-sm text-slate-500">Finance Release</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="w-full space-y-3">
                  <button onClick={onClose} className="w-full py-4 bg-[#6c11d4] hover:bg-[#5b21b6] text-white font-bold rounded-xl shadow-lg shadow-[#6c11d4]/20">
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
