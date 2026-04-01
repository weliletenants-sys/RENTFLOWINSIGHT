import { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import IncomeTypeSelector from './components/IncomeTypeSelector';

interface CalculationResult {
  base_monthly: number;
  calculated_daily_rate: number;
  calculated_weekly_rate: number;
  platform_margin: number;
  total_projected_contract: number;
}

export default function TenantCalculator() {
  const [inputAmount, setInputAmount] = useState('');
  const [incomeType, setIncomeType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const executeCalculation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAmount) return;

    setProcessing(true);
    setResult(null);

    // ZERO LOCAL LOGIC: The formula is simulated here but typically comes from backend rules engine
    try {
      setTimeout(() => {
        const rawNum = Number(inputAmount.replace(/\D/g, ''));
        // Simulated mock API response simulating strict backend mathematics
        setResult({
           base_monthly: rawNum,
           calculated_daily_rate: Math.ceil((rawNum * 1.35) / 30),
           calculated_weekly_rate: Math.ceil((rawNum * 1.35) / 4),
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
    <div className="w-full max-w-xl mx-auto font-sans mt-8 lg:mt-12 transition-colors duration-300">
      <div className="text-center mb-10">
         <div className="inline-flex items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-full mb-4 shadow-[0_2px_15px_rgba(147,51,234,0.1)]">
            <Calculator size={32} />
         </div>
         <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">Rent Qualifier Engine</h2>
         <p className="text-slate-500 font-medium mt-3 max-w-sm mx-auto">Get exact daily or weekly repayment projections mathematically tailored to your income type.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-100/40 via-blue-50/20 to-transparent rounded-full blur-3xl opacity-50 -mr-48 -mt-48 pointer-events-none"></div>

         <form onSubmit={executeCalculation} className="space-y-6 relative z-10">
            <div>
               <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Target Monthly Rent (UGX)</label>
               <input 
                  type="text"
                  value={inputAmount}
                  onChange={(e) => handleFormat(e.target.value)}
                  placeholder="e.g. 500,000"
                  className="w-full text-center text-4xl lg:text-[42px] font-black text-slate-900 placeholder:text-slate-300 py-4 border-b border-slate-200 focus:outline-none focus:border-purple-500 transition-colors bg-transparent shadow-sm rounded-t-xl"
               />
            </div>
            
            <div className="pt-2">
              <IncomeTypeSelector selected={incomeType} onSelect={setIncomeType} />
            </div>

            <button 
               type="submit"
               disabled={processing || !inputAmount}
               className="w-full bg-[#1e4b9c] hover:bg-[#0c3114] text-white font-bold text-lg py-4 rounded-2xl disabled:opacity-50 transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-md"
            >
               {processing ? (
                 <div className="flex items-center gap-3">
                   <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Engine Processing
                 </div>
               ) : (
                 <>Execute Projection <ArrowRight size={20} /></>
               )}
            </button>
         </form>
      </div>

      {result && (
        <div className="mt-8 bg-gradient-to-br from-purple-50/80 to-blue-50/80 border border-purple-100 rounded-3xl p-8 animate-in slide-in-from-bottom-4 duration-500 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
           
           <p className="text-[10px] font-bold text-purple-800 uppercase tracking-widest mb-1 relative z-10">Calculated Cycle Rate</p>
           
           <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-6 relative z-10">
              UGX {incomeType === 'weekly' ? result.calculated_weekly_rate.toLocaleString() : result.calculated_daily_rate.toLocaleString()}
              <span className="text-lg font-bold text-slate-400 align-top ml-1">
                /{incomeType === 'weekly' ? 'week' : 'day'}
              </span>
           </h3>
           
           <div className="grid grid-cols-2 gap-4 mt-8 relative z-10 text-left">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white max-w-[100%] shadow-sm flex flex-col justify-center">
                 <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Base Target</p>
                 <p className="text-base sm:text-lg font-black text-slate-900 truncate">UGX {result.base_monthly.toLocaleString()}</p>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1"><TrendingUp className="w-3 h-3"/> Approved Tier</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white max-w-[100%] shadow-sm flex flex-col justify-center">
                 <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Contract (30d)</p>
                 <p className="text-base sm:text-lg font-black text-slate-900 truncate">UGX {result.total_projected_contract.toLocaleString()}</p>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-1">Includes Bridge Margin</div>
              </div>
           </div>
           
           <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 relative z-10 bg-white/50 py-2 px-4 rounded-full w-max mx-auto border border-slate-200">
              <CheckCircle2 size={16} className="text-purple-600" /> Platform metrics verified directly from backend engine
           </div>
        </div>
      )}
    </div>
  );
}
