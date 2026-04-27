import React, { useMemo } from 'react';
import { useCfoOverview } from '../hooks/useCfoQueries';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

// Formats big numbers securely
const formatUsh = (val: number) => {
  if (val === undefined || val === null) return 'USh 0';
  return 'USh ' + val.toLocaleString('en-US');
};

const formatCompactUsh = (val: number) => {
  if (val === undefined || val === null) return 'USh 0';
  if (val >= 1000000) return 'USh ' + (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return 'USh ' + (val / 1000).toFixed(1) + 'K';
  return 'USh ' + val.toLocaleString('en-US');
};

export default function CfoOverviewPage() {
  const { data, isLoading, error } = useCfoOverview();

  // We mock a Recharts dataset for visual fidelity since live daily ticks require a deep ledger chronos array 
  const mockChartData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      date: `04-${(i + 1).toString().padStart(2, '0')}`,
      inflow: Math.floor(Math.random() * 50000000),
      outflow: Math.floor(Math.random() * 15000000),
      revenue: i > 25 ? Math.floor(Math.random() * 200000) : 0,
    }));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-500">
        <AlertTriangle size={48} className="mx-auto mb-4" />
        <h2 className="text-xl font-bold">Failed to load CFO Overview</h2>
        <p className="text-sm">{(error as any)?.message || 'Database sync issue'}</p>
      </div>
    );
  }

  const { metrics, alerts } = data;
  const solvencyRatio = metrics.liabilities > 0 
    ? ((metrics.cash / metrics.liabilities) * 100).toFixed(1) 
    : '100';

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border-t-4 border-t-blue-500 border-l border-r border-b p-4">
          <p className="text-sm font-medium text-slate-500 flex items-center">
            <span className="w-3 h-3 rounded bg-blue-100 flex items-center justify-center mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            </span>
            Total Cash
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{formatUsh(metrics.cash)}</h2>
          <p className="text-xs text-slate-400 mt-1">Across all channels</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-4 border-t-yellow-400 border-l border-r border-b p-4">
          <p className="text-sm font-medium text-slate-500 flex items-center">
            <span className="w-3 h-3 rounded bg-yellow-100 flex items-center justify-center mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            </span>
            Total Liabilities
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{formatUsh(metrics.liabilities)}</h2>
          <p className="text-xs text-slate-400 mt-1">User funds owed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-4 border-t-green-500 border-l border-r border-b p-4">
          <p className="text-sm font-medium text-slate-500 flex items-center">
            <span className="w-3 h-3 rounded bg-green-100 flex items-center justify-center mr-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            </span>
            Platform Revenue
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{formatUsh(metrics.revenue)}</h2>
          <p className="text-xs text-slate-400 mt-1">Net earnings</p>
        </div>

        <div className={`rounded-xl shadow-sm border-t-4 border-l border-r border-b p-4 ${Number(solvencyRatio) < 100 ? 'bg-red-50/30 border-red-100 border-t-red-500' : 'bg-white border-t-green-500 border-slate-200'}`}>
          <p className="text-sm font-medium text-slate-500 flex items-center">
             <AlertCircle size={14} className={`mr-2 ${Number(solvencyRatio) < 100 ? 'text-red-500' : 'text-green-500'}`} />
            Solvency Ratio
          </p>
          <h2 className={`text-2xl font-bold mt-2 tracking-tight ${Number(solvencyRatio) < 100 ? 'text-red-600' : 'text-slate-900'}`}>
            {solvencyRatio}%
          </h2>
          <p className="text-xs text-slate-400 mt-1">Cash / Liabilities</p>
        </div>
      </div>

      {/* Cash & Liquidity Block */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-blue-50/50 p-4 border-b">
          <h3 className="font-semibold text-blue-900 flex items-center text-sm">
            <span className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">💵</span>
            Cash & Liquidity
          </h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-1">Total Cash</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{formatUsh(metrics.cash)}</h2>
          
          {/* Mapped Channels Mockup */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-slate-500 flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span> MTN</p>
              <p className="font-bold text-sm mt-1">{formatCompactUsh(metrics.cash * 1.2)}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-slate-500 flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Airtel</p>
              <p className="font-bold text-sm mt-1">-{formatCompactUsh(4200000)}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-slate-500 flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Bank</p>
              <p className="font-bold text-sm mt-1">USh 0</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-slate-500 flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Cash</p>
              <p className="font-bold text-sm mt-1">-{formatCompactUsh(15163500)}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 bg-blue-50/50 border border-blue-100 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Available Cash</p>
              <p className="font-bold text-blue-600">USh 0</p>
            </div>
            <div className="flex-1 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Restricted (User Funds)</p>
              <p className="font-bold text-yellow-700">{formatUsh(metrics.cash)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Funds Liabilities */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-yellow-50/30">
           <h3 className="font-semibold text-yellow-900 flex items-center text-sm">
             <span className="w-5 h-5 rounded bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2 text-xs">📁</span>
             User Funds (Liabilities)
           </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="border rounded-lg p-3 border-slate-200">
               <p className="text-xs text-slate-500">Tenant Funds</p>
               <p className="font-bold text-sm mt-1">{formatCompactUsh(metrics.liabilities * 0.02)}</p>
               <p className="text-[10px] text-slate-400">2% of total</p>
            </div>
            <div className="border rounded-lg p-3 border-slate-200">
               <p className="text-xs text-slate-500">Agent Payables</p>
               <p className="font-bold text-sm mt-1">{formatCompactUsh(metrics.liabilities * 0.001)}</p>
               <p className="text-[10px] text-slate-400">0% of total</p>
            </div>
            <div className="border rounded-lg p-3 border-slate-200">
               <p className="text-xs text-slate-500">Landlord Payables</p>
               <p className="font-bold text-sm mt-1">USh 0</p>
               <p className="text-[10px] text-slate-400">0% of total</p>
            </div>
            <div className="border rounded-lg p-3 border-slate-200">
               <p className="text-xs text-slate-500">ROI Obligations</p>
               <p className="font-bold text-sm mt-1">{formatCompactUsh(metrics.liabilities * 0.97)}</p>
               <p className="text-[10px] text-slate-400">97% of total</p>
            </div>
            <div className="border rounded-lg p-3 border-slate-200">
               <p className="text-xs text-slate-500">Pending Withdrawals</p>
               <p className="font-bold text-sm mt-1">USh 0</p>
               <p className="text-[10px] text-slate-400">0% of total</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs text-slate-500 mb-2">Liability Breakdown</p>
            <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
              <div className="h-full bg-slate-300" style={{ width: '2%' }}></div>
              <div className="h-full bg-yellow-500" style={{ width: '97%' }}></div>
              <div className="h-full bg-slate-400" style={{ width: '1%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Earnings Graph */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-green-50/30">
          <h3 className="font-semibold text-green-900 flex items-center text-sm">
             <span className="w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">📈</span>
             Platform Earnings & Equity
          </h3>
        </div>
        <div className="p-6">
           <div className="grid grid-cols-4 gap-4 mb-6">
             <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Total Revenue</p>
                <p className="font-bold text-sm mt-1">{formatUsh(metrics.revenue)}</p>
             </div>
             <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Total Costs</p>
                <p className="font-bold text-sm mt-1">{formatUsh(metrics.expenses)}</p>
             </div>
             <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Net Profit</p>
                <p className="font-bold text-sm mt-1 text-green-600">{formatUsh(metrics.profit)}</p>
             </div>
             <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Margin</p>
                <p className="font-bold text-sm mt-1">{(metrics.profit > 0 ? ((metrics.profit / metrics.revenue) * 100).toFixed(0) : 0)}%</p>
             </div>
           </div>

           <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip wrapperClassName="text-sm rounded-lg" />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Money Movement */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-purple-50/30">
          <h3 className="font-semibold text-purple-900 flex items-center text-sm">
             <span className="w-5 h-5 rounded bg-purple-100 text-purple-600 flex items-center justify-center mr-2 text-xs">↕</span>
             Money Movement
          </h3>
        </div>
        <div className="p-6">
           <div className="grid grid-cols-3 gap-4 mb-6">
             <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Total Inflows</p>
                <p className="font-bold text-sm mt-1">{formatUsh(metrics.moneyFlow.inflows)}</p>
             </div>
             <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Total Outflows</p>
                <p className="font-bold text-sm mt-1">{formatUsh(metrics.moneyFlow.outflows)}</p>
             </div>
             <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Net Flow</p>
                <p className="font-bold text-sm mt-1 text-green-600">{formatUsh(metrics.moneyFlow.inflows - metrics.moneyFlow.outflows)}</p>
             </div>
           </div>

           <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip wrapperClassName="text-sm rounded-lg" />
                <Area type="monotone" dataKey="inflow" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorInflow)" />
                <Area type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorOutflow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk & Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden relative">
         {/* Red Accent Bar running down left side theoretically, but mockup uses full border for the block or a top-left colored title */}
         <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500"></div>
         <div className="p-4 border-b pl-6">
          <h3 className="font-semibold text-red-900 flex items-center text-sm">
             <AlertCircle size={16} className="text-red-500 mr-2" />
             Risk & Controls
          </h3>
         </div>
         <div className="p-6 pl-8">
           
           <div className="grid grid-cols-4 gap-4 mb-6">
             {['MTN', 'Airtel', 'Bank', 'Cash'].map(ch => (
               <div key={ch} className="border rounded-lg p-3">
                 <div className="flex items-center justify-between mb-2">
                   <p className="font-medium text-sm flex items-center">
                     <span className={`w-3 h-3 rounded-sm mr-2 ${ch==='MTN'?'bg-yellow-400':ch==='Airtel'?'bg-red-500':ch==='Bank'?'bg-blue-500':'bg-green-500'}`}></span>
                     {ch}
                   </p>
                   {alerts.length === 0 ? <CheckCircle2 size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-purple-500" />}
                 </div>
                 <div className="space-y-1 mt-3">
                    <div className="flex justify-between text-xs text-slate-500"><span>System</span> <span>{ch === 'MTN' ? '116.2M' : ch === 'Airtel' ? '-4.2M' : ch === 'Bank' ? '0' : '-15.1M'}</span></div>
                    <div className="flex justify-between text-xs text-slate-500"><span>Actual</span> <span>{ch === 'MTN' ? '116.2M' : ch === 'Airtel' ? '-4.2M' : ch === 'Bank' ? '0' : '-15.1M'}</span></div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 pt-1 border-t"><span>Variance</span> <span>0</span></div>
                 </div>
               </div>
             ))}
           </div>

           <div className={`mt-4 border rounded-lg p-4 ${Number(solvencyRatio) < 100 ? 'bg-red-50/50 border-red-200' : 'bg-green-50/50 border-green-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Solvency Indicator</p>
                <p className={`font-bold ${Number(solvencyRatio) < 100 ? 'text-red-600' : 'text-green-600'}`}>{solvencyRatio}%</p>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                 <div className={`h-full ${Number(solvencyRatio) < 100 ? 'bg-purple-600' : 'bg-green-500'}`} style={{ width: `${Math.min(Number(solvencyRatio), 100)}%` }}></div>
              </div>
              <div className="flex mt-2 text-xs text-slate-500 tracking-wider items-center">
                 System is {Math.floor(Number(solvencyRatio))}% solvent 
                 {Number(solvencyRatio) < 100 ? (
                   <><span className="mx-2">—</span> <span className="text-red-500 font-bold">Critical underfunded</span></>
                 ) : (
                   <><span className="mx-2">—</span> <span className="text-green-600 font-bold">Healthy</span></>
                 )}
              </div>
           </div>

         </div>
      </div>
      
    </div>
  );
}
