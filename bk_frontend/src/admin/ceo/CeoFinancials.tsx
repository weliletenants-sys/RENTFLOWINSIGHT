import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, Wallet, AlertTriangle, ShieldCheck, Download, PiggyBank, Activity 
} from 'lucide-react';

export default function CeoFinancials() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiquidity = async () => {
      try {
        const res = await axios.get('/api/v1/executive/ceo/liquidity-health');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load liquidity health metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiquidity();
  }, []);

  const formatCurrency = (val: number) => `UGX ${(val / 1000000).toFixed(2)}M`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] font-inter">Global Treasury</span>
          <h2 className="text-4xl font-bold tracking-tight mt-2 text-slate-900 font-outfit">Solvency & Capital Utility</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm">
            <Download size={16} />
            Export Statement
          </button>
        </div>
      </header>

      {loading ? (
        <div className="h-96 w-full flex items-center justify-center bg-white rounded-2xl border border-slate-100">
           <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Main Macro Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                     <Building2 size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Liquid</span>
               </div>
               <h3 className="text-3xl font-bold text-slate-900 font-outfit mb-1">
                 {data ? formatCurrency(data.totalSystemLiquidity) : '...'}
               </h3>
               <p className="text-sm font-medium text-slate-500">Total System Liquidity (All Wallets)</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                     <Wallet size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Portfolio</span>
               </div>
               <h3 className="text-3xl font-bold text-slate-900 font-outfit mb-1">
                 {data ? formatCurrency(data.totalCapitalDeployed) : '...'}
               </h3>
               <p className="text-sm font-medium text-slate-500">Active Supporter Capital Deployed</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <Activity size={80} />
               </div>
               <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="p-3 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-xl">
                     <PiggyBank size={24} />
                  </div>
                  <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">Buffer</span>
               </div>
               <h3 className="text-3xl font-bold text-[var(--color-primary)] font-outfit mb-1 relative z-10">
                 {data ? formatCurrency(data.reserveBuffer) : '...'}
               </h3>
               <p className="text-sm font-medium text-slate-500 relative z-10">Unallocated Reserve Buffer</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Ratios */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 font-outfit mb-6">Platform Health Ratios</h3>
               
               <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <div className="flex items-center gap-2">
                          <AlertTriangle size={18} className="text-amber-500" />
                          <span className="font-bold text-slate-700">System Default Rate</span>
                       </div>
                       <span className="text-2xl font-bold text-amber-500 font-outfit">{data?.defaultRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                       <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(Number(data?.defaultRate), 2)}%` }}></div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-2">Percentage of rent requests currently in hard default.</p>
                 </div>

                 <div className="pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                       <div className="flex items-center gap-2">
                          <ShieldCheck size={18} className="text-emerald-500" />
                          <span className="font-bold text-slate-700">Rent Success Threshold</span>
                       </div>
                       <span className="text-2xl font-bold text-emerald-500 font-outfit">{data?.successRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(Number(data?.successRate), 5)}%` }}></div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-2">Historical success rate for completed rent facilitation cycles.</p>
                 </div>
               </div>
            </div>

            {/* Capital Utilization Gauge */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden flex flex-col justify-center items-center text-center">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-slate-900 to-slate-900"></div>
               
               <h3 className="text-xl font-bold font-outfit text-slate-300 relative z-10 mb-2">Overall Capital Utilization</h3>
               <p className="text-sm font-medium text-slate-400 mb-8 max-w-sm relative z-10">Percentage of global system liquidity currently deployed in rent portfolios generating active ROI.</p>
               
               <div className="relative z-10 w-48 h-48 border-[12px] border-slate-800 rounded-full flex items-center justify-center mb-6">
                  {/* Fake SVG Stroke Dash array representation */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                     <circle cx="84" cy="84" r="84" className="stroke-indigo-500 fill-none" strokeWidth="12" strokeDasharray={`${Number(data?.capitalUtilizationPercentage) * 5.27} 999`} strokeLinecap="round" />
                  </svg>
                  <div className="text-center">
                     <span className="block text-5xl font-bold font-outfit tracking-tighter">{data?.capitalUtilizationPercentage}%</span>
                     <span className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">Utilized</span>
                  </div>
               </div>
               
            </div>
          </div>
        </>
      )}
    </div>
  );
}
