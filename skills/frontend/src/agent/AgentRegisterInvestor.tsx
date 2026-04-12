import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, User, Phone, 
  DollarSign, Calendar, TrendingUp, ShieldCheck, 
  AlertCircle, ChevronRight, Lock, Wallet
} from 'lucide-react';
import PurpleBubbles from '../components/PurpleBubbles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AgentRegisterInvestor() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Mock Agent Wallet Data
  const AGENT_WALLET_BALANCE = 1450000;

  const [formData, setFormData] = useState({
    // Step 1: Partner ID
    partnerName: '',
    partnerId: '',
    
    // Step 2: Investment Details
    amount: '',
    agreedRate: '15', // Default starting rate
    sourceOfFunds: 'agent_wallet',
    startDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    
    // Step 4: Security
    pin: ['', '', '', ''],
  });

  const [expectedReturn, setExpectedReturn] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const TRANSACTION_FEE = 1500;

  // Calculate expected returns & deductions whenever amount/plan changes
  useEffect(() => {
    const principal = parseInt(formData.amount) || 0;
    const rate = parseFloat(formData.agreedRate) || 0;
    
    setTotalDeduction(principal > 0 ? principal + TRANSACTION_FEE : 0);

    // Monthly return calculation (Principal * Rate / 100)
    setExpectedReturn(Math.round(principal * (rate / 100)));
  }, [formData.amount, formData.agreedRate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers
    const newPin = [...formData.pin];
    newPin[index] = value;
    setFormData(prev => ({ ...prev, pin: newPin }));

    // Auto-advance focus
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !formData.pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleNext = async () => {
    setValidationError(null);
    
    if (step === 1) {
      if (!formData.partnerName || !formData.partnerId) {
        setValidationError("Both Partner Name and ID/Phone are required.");
        return;
      }

      setIsValidating(true);
      await new Promise(r => setTimeout(r, 1200)); // Mock API delay
      
      // Mock validation rule: if Phone ends in 000, they don't exist
      if (formData.partnerId === '0000') {
        setValidationError("Partner not found in the system. Please verify the ID/Phone Number.");
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    if (step === 2) {
      const amt = parseInt(formData.amount) || 0;
      if (amt <= 0) {
        setValidationError("Please enter a valid investment amount.");
        return;
      }
      if (totalDeduction > AGENT_WALLET_BALANCE) {
        setValidationError(`Insufficient wallet balance. You need UGX ${totalDeduction.toLocaleString()}.`);
        return;
      }
    }

    if (step === 4) {
      if (formData.pin.join('').length < 4) {
        setValidationError("Please enter your full 4-digit PIN.");
        return;
      }
      setIsValidating(true);
      try {
        await axios.post('/api/agent/users/investor', {
          account_name: formData.partnerName,
          investment_amount: formData.amount,
          duration_months: 6,
          roi_percentage: formData.agreedRate,
          roi_mode: 'monthly_payout',
        });
        setIsSuccess(true);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to authorize investment.');
      } finally {
        setIsValidating(false);
      }
      return;
    }

    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    setValidationError(null);
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] min-h-screen relative font-['Public_Sans'] text-slate-900 dark:text-slate-100 antialiased overflow-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <PurpleBubbles />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-x border-slate-100 dark:border-slate-800 shadow-2xl">
        
        {/* Header */}
        <header className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 z-50">
          <button 
            onClick={() => step > 1 && !isSuccess ? handlePrev() : navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
             <h1 className="text-lg font-bold">Invest for Partner</h1>
             {!isSuccess && <p className="text-[10px] font-bold text-[#6c11d4] uppercase tracking-widest">Step {step} of 4</p>}
          </div>
          <div className="w-9" />
        </header>

        {/* Progress Bar */}
        {!isSuccess && (
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
            <div 
              className="bg-[#6c11d4] h-1 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        <main className="flex-1 overflow-y-auto w-full flex flex-col pb-24">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex-1 p-6"
              >
                
                {validationError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-red-800 dark:text-red-400 text-sm">Action Required</h4>
                      <p className="text-xs text-red-600 dark:text-red-300 mt-1">{validationError}</p>
                    </div>
                  </div>
                )}

                {/* Step 1: Partner Identification */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-1">Partner Verification</h2>
                      <p className="text-xs text-slate-500">Provide the details of the partner you are investing for to link the transaction.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Partner Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6c11d4]" size={18} />
                        <input name="partnerName" value={formData.partnerName} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6c11d4]/20" placeholder="e.g. Jane Doe" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Partner ID / Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6c11d4]" size={18} />
                        <input name="partnerId" value={formData.partnerId} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6c11d4]/20" placeholder="e.g. 0770000000" />
                      </div>
                      <p className="text-[10px] text-slate-400 ml-1">Type "0000" to simulate a verification error.</p>
                    </div>

                  </div>
                )}

                {/* Step 2: Investment Details */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-1">Investment Details</h2>
                      <p className="text-xs text-slate-500">Specify the funding amount and selected portfolio plan.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Investment Amount (UGX)</label>
                      <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6c11d4]" size={18} />
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full pl-11 pr-4 py-4 text-lg font-bold bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6c11d4]/20" placeholder="0" />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="space-y-1.5 flex-[1.5]">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Agreed Monthly Rate (%)</label>
                        <div className="relative group">
                          <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6c11d4]" size={16} />
                          <input 
                            type="number" 
                            name="agreedRate" 
                            value={formData.agreedRate} 
                            onChange={handleChange} 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6c11d4]/20 font-medium text-sm" 
                            placeholder="15" 
                            step="0.1"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Start Date</label>
                        <div className="relative group">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6c11d4]" size={16} />
                          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full py-3 pr-2 pl-9 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6c11d4]/20 font-medium text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Source of Funds</label>
                        <div className="relative group">
                          <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6c11d4]" size={18} />
                          <select name="sourceOfFunds" value={formData.sourceOfFunds} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-[#6c11d4]/5 border border-[#6c11d4]/20 text-[#6c11d4] rounded-xl outline-none focus:ring-2 focus:ring-[#6c11d4]/40 appearance-none font-bold">
                            <option value="agent_wallet">Agent Wallet (UGX {AGENT_WALLET_BALANCE.toLocaleString()})</option>
                          </select>
                        </div>
                    </div>

                    {expectedReturn > 0 && (
                      <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                             <TrendingUp size={16}/>
                           </div>
                           <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">Est. Monthly Return</span>
                         </div>
                         <span className="text-lg font-bold text-emerald-600">UGX {expectedReturn.toLocaleString()}</span>
                      </div>
                    )}

                  </div>
                )}

                {/* Step 3: Fees & Confirmation */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-1">Confirmation Summary</h2>
                      <p className="text-xs text-slate-500">Review the details and total deductions before authorizing.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                      
                      <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="size-10 bg-[#6c11d4]/10 text-[#6c11d4] rounded-full flex items-center justify-center font-bold">
                          {formData.partnerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Investing on behalf of</p>
                          <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{formData.partnerName}</h4>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Agreed Return Rate</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white max-w-[150px] text-right truncate">{formData.agreedRate}% Monthly</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Start Date</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{new Date(formData.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Principal Amount</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">UGX {parseInt(formData.amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Processing Fee</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">UGX {TRANSACTION_FEE.toLocaleString()}</span>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-300">Total Deduction</span>
                          <span className="text-xl font-black text-[#6c11d4]">UGX {totalDeduction.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-slate-500">Source</span>
                          <span className="text-xs font-semibold text-slate-600 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-right">Agent Wallet</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Step 4: Authorization */}
                {step === 4 && (
                  <div className="space-y-6 flex flex-col items-center justify-center pt-8">
                    
                    <div className="size-16 bg-[#6c11d4]/10 text-[#6c11d4] rounded-full flex items-center justify-center mb-2">
                       <Lock size={32} />
                    </div>

                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold mb-2">Authorize Protocol</h2>
                      <p className="text-sm text-slate-500 max-w-[280px]">
                        Enter your 4-digit Agent PIN to authorize the deduction of <span className="font-bold text-slate-900 dark:text-white">UGX {totalDeduction.toLocaleString()}</span>.
                      </p>
                    </div>

                    <div className="flex justify-center gap-4 w-full px-4">
                      {[0, 1, 2, 3].map((index) => (
                        <input
                          key={index}
                          id={`pin-${index}`}
                          type="password"
                          maxLength={1}
                          value={formData.pin[index]}
                          onChange={(e) => handlePinChange(index, e.target.value)}
                          onKeyDown={(e) => handlePinKeyDown(index, e)}
                          className="w-14 h-16 text-center text-3xl font-black bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-[#6c11d4] focus:ring-4 focus:ring-[#6c11d4]/20 transition-all shadow-sm"
                        />
                      ))}
                    </div>

                    <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-xl flex items-start gap-3 w-full">
                      <ShieldCheck className="text-orange-500 mt-0.5 flex-shrink-0" size={20} />
                      <p className="text-xs text-orange-800 dark:text-orange-400 font-medium leading-relaxed">
                        By authorizing this, you confirm that you have received consent from the partner to invest these funds on their behalf.
                      </p>
                    </div>

                  </div>
                )}
              </motion.div>

            ) : (
              // Success Screen
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="size-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Investment Authorized!</h2>
                
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[300px] leading-relaxed">
                  You have successfully initiated a <span className="font-bold text-slate-800 dark:text-slate-200">UGX {parseInt(formData.amount).toLocaleString()}</span> investment on behalf of <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.partnerName}</span>.
                </p>

                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={() => navigate('/agent-clients')}
                    className="w-full bg-[#6c11d4] hover:bg-[#5b21b6] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#6c11d4]/25"
                  >
                    View Partner Portfolio
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-4 px-6 rounded-xl transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="fixed sm:absolute bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
            {step < 4 ? (
              <button 
                onClick={handleNext}
                disabled={isValidating}
                className="w-full flex items-center justify-center gap-2 bg-[#6c11d4] disabled:bg-[#6c11d4]/50 hover:bg-[#5b21b6] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#6c11d4]/25 transition-all outline-none"
              >
                {isValidating ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    <span>Verifying Partner...</span>
                  </>
                ) : (
                  <>
                    <span>{step === 3 ? 'Proceed to Authorize' : 'Next Step'}</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={handleNext} // The logic inside handleNext actually submits step 4
                disabled={isValidating}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 disabled:bg-emerald-600/50 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/25 transition-all outline-none"
              >
                {isValidating ? (
                   <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                ) : (
                   <CheckCircle2 size={20} />
                )}
                <span>{isValidating ? 'Authorizing...' : 'Confirm & Invest'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
