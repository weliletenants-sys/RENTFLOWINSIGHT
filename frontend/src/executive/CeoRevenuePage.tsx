import React from 'react';
import { useCeoRevenue } from '../hooks/useExecutiveQueries';
import { Loader2, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatCurrency = (val: number): string => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toString();
};

export default function CeoRevenuePage() {
  const { data, isLoading } = useCeoRevenue();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[50vh] text-slate-400">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={32} />
        <p className="font-medium">Aggregating revenue trajectories...</p>
      </div>
    );
  }

  const trajectory = data?.trajectory || [];
  const currentMonthIdx = trajectory.findIndex(t => t.month.startsWith('Forecast +1M')) - 1;
  const currentTotal = trajectory[currentMonthIdx]?.total || 0;
  const nextTotal = trajectory[currentMonthIdx + 1]?.total || 0;
  
  const momGrowth = currentTotal > 0 ? (((nextTotal - currentTotal) / currentTotal) * 100).toFixed(1) : '0';

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">Revenue & Growth</h1>
        <p className="text-slate-500 mt-1 text-[15px]">Historical service income tracking and projected forecasting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Current MRR</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(currentTotal)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <DollarSign size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Projected MRR (+1M)</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(nextTotal)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Projected MoM Growth</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">+{momGrowth}%</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <ArrowUpRight size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trajectory Breakdown (UGX)</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trajectory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000000}M`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => new Intl.NumberFormat('en-UG').format(value || 0)}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="tenant_fees" name="Tenant Service Fees" stackId="a" fill="#8b5cf6" radius={[0, 0, 4, 4]} />
              <Bar dataKey="service_income" name="Landlord Commission" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
