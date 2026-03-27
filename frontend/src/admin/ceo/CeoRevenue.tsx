import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { ArrowUpRight, TrendingUp, Wallet, DollarSign, Download } from 'lucide-react';

export default function CeoRevenue() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get('/api/v1/executive/ceo/revenue-trajectory');
        setData(res.data.trajectory || []);
      } catch (err) {
        console.error('Failed to load revenue trajectory', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  const formatCurrency = (val: number) => `UGX ${(val / 1000000).toFixed(1)}M`;

  // Determine current MRR (last actual month before forecasts)
  const actuals = data.filter(d => !d.month.toString().includes('Forecast'));
  const currentMrr = actuals.length > 0 ? actuals[actuals.length - 1].total : 0;
  
  const forecasts = data.filter(d => d.month.toString().includes('Forecast'));
  const targetMrr = forecasts.length > 0 ? forecasts[forecasts.length - 1].total : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] font-inter">Global Treasury</span>
          <h2 className="text-4xl font-bold tracking-tight mt-2 text-slate-900 font-outfit">Revenue Trajectory</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm">
            <Download size={16} />
            Export Ledger
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Current MRR</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-slate-900 font-outfit">
              UGX {(currentMrr / 1000000).toFixed(2)}M
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
            <ArrowUpRight size={14} />
            <span>Actual</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-purple-600 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp size={80} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Target Q3 Forecast (MRR)</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-slate-900 font-outfit">
              UGX {(targetMrr / 1000000).toFixed(2)}M
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-purple-600 bg-purple-50 w-fit px-2 py-1 rounded-md">
            <ArrowUpRight size={14} />
            <span>+15.76% Projected</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-600 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <Wallet size={80} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Fee Distribution</p>
          <div className="flex flex-col gap-2 mt-2">
             <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div> Tenant Fees</span>
                <span>40%</span>
             </div>
             <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Service Income</span>
                <span>60%</span>
             </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 w-full flex items-center justify-center bg-white rounded-2xl border border-slate-100">
           <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 font-outfit">Revenue Growth & Projections</h3>
              <p className="text-sm text-slate-500 mt-1">Modeling historical MRR against algorithmic +5% MoM predictive forecasting.</p>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTenant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorService" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={formatCurrency} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => `UGX ${Number(value).toLocaleString()}`}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="tenant_fees" name="Tenant Fees" stackId="1" stroke="var(--color-primary)" strokeWidth={3} fill="url(#colorTenant)" />
                <Area type="monotone" dataKey="service_income" name="Service Income" stackId="1" stroke="#3b82f6" strokeWidth={3} fill="url(#colorService)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
