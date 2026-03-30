import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState(5000000);
  const [months, setMonths] = useState(12);

  const baseYield = 0.145; // 14.5% annual
  const durationBonus = months >= 12 ? 0.02 : 0; // 2% bonus for >= 12 mo
  const totalYield = baseYield + durationBonus;
  
  const estimatedProfit = amount * totalYield * (months / 12);
  const totalReturn = amount + estimatedProfit;

  return (
    <div className="bg-white rounded-2xl p-5 text-slate-900 relative overflow-hidden shadow-sm border border-slate-200">
      {/* Subtle Logo Watermark - Reduced size */}
      <div className="absolute top-2 right-2 opacity-[0.03] pointer-events-none grayscale mix-blend-multiply">
        <img src="/welile-colored.png" alt="Welile Logo" className="w-32 h-auto" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
             <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[var(--color-primary)] border border-purple-100 relative z-10">
               <Calculator className="w-4 h-4" />
             </div>
             {/* Small Creative Logo placement */}
             <img src="/welile-colored.png" alt="Welile" className="h-[12px] absolute -bottom-1 -right-2 z-20 opacity-90 drop-shadow-sm bg-white rounded flex items-center justify-center" />
          </div>
          <div className="ml-1">
            <h3 className="font-bold text-base tracking-tight text-slate-900 leading-tight">Project Your ROI</h3>
            <p className="text-slate-500 text-[10px] font-medium">Visualize capital growth</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Amount Slider */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Investment</label>
              <span className="font-black text-sm text-emerald-600">UGX {(amount / 1000000).toFixed(1)}M</span>
            </div>
            <input 
              type="range" 
              min="500000" 
              max="100000000" 
              step="500000"
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lock-in</label>
              <span className="font-black text-sm text-blue-600">{months} Months</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="24" 
              step="1"
              value={months} 
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Total Return</p>
            <p className="text-xl font-black tracking-tighter text-slate-900 leading-none">UGX {(totalReturn / 1000000).toFixed(2)}M</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Est. Profit</p>
            <p className="text-lg font-black tracking-tighter text-emerald-600 flex items-center justify-end gap-1 leading-none">
              +{(estimatedProfit / 1000000).toFixed(2)}M
              <TrendingUp className="w-3.5 h-3.5 bg-emerald-100 rounded-full p-0.5 text-emerald-600" />
            </p>
          </div>
        </div>

        <button 
           className="w-full mt-4 bg-slate-900 hover:bg-[var(--color-primary)] text-white font-bold text-xs uppercase tracking-widest py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          Start Investing
        </button>
      </div>
    </div>
  );
}
