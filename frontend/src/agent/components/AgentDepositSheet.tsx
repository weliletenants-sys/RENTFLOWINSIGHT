import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, WifiOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AgentDepositSheet({ isOpen, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState('');
  const [tid, setTid] = useState('');
  const [provider, setProvider] = useState<'MTN' | 'Airtel' | null>(null);
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

  // Auto-detect provider based on TID
  useEffect(() => {
    if (tid.length > 5) {
      if (tid.startsWith('1') || tid.startsWith('M')) setProvider('MTN');
      else if (tid.startsWith('2') || tid.startsWith('A')) setProvider('Airtel');
      else setProvider('MTN'); // Default fallback
    } else {
      setProvider(null);
    }
  }, [tid]);

  const numericAmount = parseFloat(amount) || 0;
  const isValid = numericAmount > 0 && tid.length >= 6;

  const handleConfirm = async () => {
    setIsLoading(true);
    const payload = {
      amount: numericAmount,
      method: 'mobile',
      provider: provider || 'unknown',
      reference: tid,
      timestamp: new Date().toISOString()
    };

    if (isOffline) {
      // Save locally
      const offlineQueue = JSON.parse(localStorage.getItem('offline_deposits') || '[]');
      offlineQueue.push(payload);
      localStorage.setItem('offline_deposits', JSON.stringify(offlineQueue));
      setTimeout(() => {
        setIsLoading(false);
        setStep('success');
        toast.success('Saved offline. Will sync when connected.');
      }, 600);
      return;
    }

    try {
      await axios.post('/api/agent/financials/deposit', payload);
      setStep('success');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Deposit failed');
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Deposit Funds</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {step === 'input' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Amount (UGX)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">UGX</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-16 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xl font-black text-slate-900 dark:text-white outline-none focus:border-[#6d28d9] focus:ring-1 focus:ring-[#6d28d9] transition-all"
                    />
                  </div>
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
                    {[50000, 100000, 250000].map(val => (
                      <button 
                        key={val} 
                        onClick={() => setAmount(val.toString())}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#6d28d9]/10 hover:text-[#6d28d9] text-sm font-bold rounded-lg whitespace-nowrap transition-colors"
                      >
                        {val / 1000}K
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Transaction ID (TID)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={tid}
                      onChange={(e) => setTid(e.target.value.toUpperCase())}
                      placeholder="e.g. 192384729"
                      className="w-full pl-4 pr-12 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-bold text-slate-900 dark:text-white outline-none focus:border-[#6d28d9] focus:ring-1 focus:ring-[#6d28d9] uppercase"
                    />
                    {tid.length >= 6 && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                    )}
                  </div>
                  {provider && (
                    <div className="flex items-center gap-2 mt-2">
                       {provider === 'MTN' && <img src="/mtn.png" alt="MTN" className="w-4 h-4 rounded-full object-cover" />}
                       {provider === 'Airtel' && <img src="/airtel.png" alt="Airtel" className="w-4 h-4 rounded-full object-cover" />}
                       <span className="text-xs font-bold text-slate-500">Auto-detected: {provider}</span>
                    </div>
                  )}
                </div>

                <button 
                  disabled={!isValid}
                  onClick={() => setStep('preview')}
                  className="w-full py-4 bg-[#6d28d9] hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-[#6d28d9]/20"
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
                    <span className="font-black text-xl">UGX {numericAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Provider</span>
                    <div className="flex items-center gap-2">
                       {provider === 'MTN' && <img src="/mtn.png" alt="MTN" className="w-5 h-5 rounded-full object-cover" />}
                       {provider === 'Airtel' && <img src="/airtel.png" alt="Airtel" className="w-5 h-5 rounded-full object-cover" />}
                       <span className="font-bold">{provider || 'Unknown'} Mobile Money</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">TID</span>
                    <span className="font-bold text-[#6d28d9]">{tid}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Date</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{new Date().toLocaleDateString()}</span>
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
                    className="flex-[2] py-4 flex items-center justify-center gap-2 bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#6d28d9]/20"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Deposit'}
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black mb-2">{isOffline ? 'Saved Offline' : 'Deposit Submitted'}</h3>
                <p className="text-slate-500 mb-8">UGX {numericAmount.toLocaleString()} has been added to your queue.</p>
                
                <div className="w-full space-y-3">
                  <button onClick={onClose} className="w-full py-4 bg-[#6d28d9] text-white font-bold rounded-xl">
                    Back to Wallet
                  </button>
                  <button onClick={() => { setAmount(''); setTid(''); setStep('input'); }} className="w-full py-4 text-[#6d28d9] font-bold rounded-xl">
                    Make Another Deposit
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
