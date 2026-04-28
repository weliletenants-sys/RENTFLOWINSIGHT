import React from 'react';
import { useCeoAngelPool } from '../hooks/useExecutiveQueries';
import { Briefcase, Map, Target, ShieldCheck, ArrowRight, Wallet, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatCurrency = (val: number): string => {
  if (!val) return '0';
  if (val >= 1000000000) return `${(val / 1000000000).toFixed(2)}B`;
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toString();
};

export default function CeoAngelPoolPage() {
  const { data, isLoading } = useCeoAngelPool();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[50vh] text-slate-400">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={32} />
        <p className="font-medium">Aggregating global investor metrics...</p>
      </div>
    );
  }
  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">Global Angel Pool</h1>
        <p className="text-slate-500 mt-1 text-[15px]">Investor deployment tracking, portfolio velocity, and cohort engagements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tier 1 Angels (Institutional)</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{data?.tier1Count || 0}</h3>
          <p className="text-xs text-indigo-600 font-semibold mt-2 flex items-center gap-1">
            <Target size={12} /> Target: 20
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tier 2 Angels (Retail)</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{new Intl.NumberFormat().format(data?.tier2Count || 0)}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <Target size={12} /> Target: 1500
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Average Portfolio Size</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">UGX {formatCurrency(data?.averagePortfolioSize || 0)}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Global Geographies</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{data?.globalRegions || 0} Regions</h3>
          <p className="text-xs text-blue-600 font-semibold mt-2 flex items-center gap-1">
            <Map size={12} /> View Map
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-bold text-slate-900">Liquidity Velocity (Deployment Speed)</h3>
           <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
             <Wallet size={18} />
           </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.liquidityVelocity || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="velocityCol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={val => `${val}x`} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="velocity" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#velocityCol)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl flex items-center justify-between">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
             <ShieldCheck size={24} className="text-amber-500" />
           </div>
           <div>
             <h4 className="font-bold text-slate-900">Deep Analytics Now Actively Integrated</h4>
             <p className="text-sm text-slate-500 max-w-xl">
               The Angel Pool sector metrics are now piped directly from the `InvestorPortfolios` aggregation layer in real-time.
             </p>
           </div>
         </div>
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
            Review Funder Specs <ArrowRight size={16} />
         </button>
      </div>
    </div>
  );
}
