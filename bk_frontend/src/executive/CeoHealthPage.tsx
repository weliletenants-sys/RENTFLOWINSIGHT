import React from 'react';
import { useCeoLiquidityHealth } from '../hooks/useExecutiveQueries';
import { Loader2, ShieldCheck, Banknote, Landmark, Percent } from 'lucide-react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const formatCurrency = (val: number): string => {
  if (val >= 1000000000) return `${(val / 1000000000).toFixed(2)}B`;
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toString();
};

export default function CeoHealthPage() {
  const { data, isLoading } = useCeoLiquidityHealth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[50vh] text-slate-400">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={32} />
        <p className="font-medium">Assessing platform liquidity...</p>
      </div>
    );
  }

  const radialData = [
    { name: 'Utilization', value: Number(data?.capitalUtilizationPercentage || 0), fill: '#8b5cf6' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">Financial Health</h1>
        <p className="text-slate-500 mt-1 text-[15px]">Capital utilization, system liquidity, and risk reserves.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Landmark size={20} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">System Liquidity</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 uppercase">
            UGX {formatCurrency(data?.totalSystemLiquidity || 0)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Banknote size={20} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Capital Deployed</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 uppercase">
            UGX {formatCurrency(data?.totalCapitalDeployed || 0)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Reserve Buffer</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 uppercase">
            UGX {formatCurrency(data?.reserveBuffer || 0)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Percent size={20} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Portfolio Success Rate</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {data?.successRate}%
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Capital Utilization</h3>
            <p className="text-sm text-slate-500">Percentage of held liquidity successfully deployed into the rent pool.</p>
          </div>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="70%" 
                outerRadius="100%" 
                barSize={20} 
                data={radialData} 
                startAngle={180} 
                endAngle={0}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-12">
              <span className="text-4xl font-extrabold text-slate-800">{data?.capitalUtilizationPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Risk Triggers</h3>
          <p className="text-sm text-slate-500 mb-8">System-wide risk alerts based on rent default events and capital starvation.</p>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Platform Default Rate</span>
                <span className="text-sm font-bold text-red-600">{data?.defaultRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${Math.min(Number(data?.defaultRate || 0), 100)}%` }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Critical threshold: 12%</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Starvation Index</span>
                <span className="text-sm font-bold text-orange-500">Safe</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Buffer capital is healthy relative to average daily request volume.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
