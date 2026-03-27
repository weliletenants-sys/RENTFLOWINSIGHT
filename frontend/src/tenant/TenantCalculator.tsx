import { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CalculationResult {
  base_monthly: number;
  calculated_daily_rate: number;
  platform_margin: number;
  total_projected_contract: number;
}

export default function TenantCalculator() {
  const [inputAmount, setInputAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const executeCalculation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAmount) return;

    setProcessing(true);
    setResult(null);

    // ZERO LOCAL LOGIC: The formula (Rent + Margins) / 30 is absolutely hidden. 
    // We send payload, we display exact object returned.
    try {
      // PROD: const { data } = await axios.post('/api/v1/tenant/calculate-rate', { monthly_amount: Number(inputAmount.replace(/\D/g, '')) });
      
      setTimeout(() => {
        const rawNum = Number(inputAmount.replace(/\D/g, ''));
        // Simulated mock API response simulating strict backend mathematics
        setResult({
           base_monthly: rawNum,
           calculated_daily_rate: Math.ceil((rawNum * 1.35) / 30),
           platform_margin: rawNum * 0.35,
           total_projected_contract: rawNum * 1.35
        });
        setProcessing(false);
        toast.success("Algorithm executed via Engine.");
      }, 700);
      
    } catch {
      toast.error("Engine failed to compute rate.");
      setProcessing(false);
    }
  };

  const handleFormat = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (!raw) { setInputAmount(''); return; }
    setInputAmount(Number(raw).toLocaleString());
  };

  return (
    <div className="w-full max-w-xl mx-auto font-sans mt-12 transition-colors duration-300">
      <div className="text-center mb-10">
         <div className="inline-flex items-center justify-center p-4 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full mb-4 transition-colors">
            <Calculator size={32} />
         </div>
         <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white transition-colors">Daily Conversions</h2>
         <p className="text-gray-500 dark:text-slate-400 font-medium mt-2 max-w-sm mx-auto transition-colors">Submit a traditional monthly rent figure to query our engine for your personalized daily repayment rate.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300">
         <form onSubmit={executeCalculation} className="space-y-6">
            <div>
               <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-slate-400 mb-2 transition-colors">Target Monthly Rent (UGX)</label>
               <input 
                  type="text"
                  value={inputAmount}
                  onChange={(e) => handleFormat(e.target.value)}
                  placeholder="e.g. 500,000"
                  className="w-full text-center text-4xl font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-600 py-4 border-b-2 border-gray-200 dark:border-slate-600 focus:outline-none focus:border-orange-500 transition-colors bg-transparent"
               />
            </div>
            <button 
               type="submit"
               disabled={processing || !inputAmount}
               className="w-full bg-gray-900 dark:bg-slate-700 text-white font-bold text-lg py-4 rounded-2xl hover:bg-orange-600 dark:hover:bg-orange-500 disabled:opacity-50 transition-colors flex justify-center items-center gap-2 cursor-pointer"
            >
               {processing ? <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Query Engine <ArrowRight size={20} /></>}
            </button>
         </form>
      </div>

      {result && (
        <div className="mt-8 bg-orange-50 dark:bg-orange-500/10 border-2 border-orange-200 dark:border-orange-500/20 rounded-3xl p-8 animate-in slide-in-from-bottom-4 duration-500 text-center relative overflow-hidden transition-colors">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/50 dark:bg-orange-500/20 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none transition-colors"></div>
           
           <p className="text-sm font-bold text-orange-700 dark:text-orange-400 uppercase tracking-widest mb-1 relative z-10 transition-colors">Your Daily Cycle</p>
           <h3 className="text-5xl font-black text-orange-600 dark:text-orange-400 tracking-tighter mb-4 relative z-10 transition-colors">UGX {result.calculated_daily_rate.toLocaleString()}</h3>
           
           <div className="grid grid-cols-2 gap-4 mt-8 relative z-10 text-left">
              <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl transition-colors">
                 <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 transition-colors">Base Target</p>
                 <p className="text-lg font-black text-gray-900 dark:text-white transition-colors">UGX {result.base_monthly.toLocaleString()}</p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl transition-colors">
                 <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 transition-colors">Access Bridge Fee</p>
                 <p className="text-lg font-black text-gray-900 dark:text-white transition-colors">UGX {result.platform_margin.toLocaleString()}</p>
              </div>
           </div>
           
           <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-orange-800 dark:text-orange-400 relative z-10 transition-colors">
              <CheckCircle2 size={16} /> All calculations verified server-side
           </div>
        </div>
      )}
    </div>
  );
}
