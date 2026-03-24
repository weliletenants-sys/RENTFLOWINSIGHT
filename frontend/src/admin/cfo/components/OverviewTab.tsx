import React from 'react';
import { User, ShieldAlert, Home, Download, Activity, FileText } from 'lucide-react';

interface OverviewTabProps {
  overviewMetrics: any;
}

export default function OverviewTab({ overviewMetrics }: OverviewTabProps) {
  if (!overviewMetrics) {
    return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Loading overview...</div>;
  }

  // Formatting helpers
  const formatMoney = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return '0';
    if (typeof amount !== 'number') return '0';
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-inter">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Platform Revenue', value: `${formatMoney(overviewMetrics.metrics?.platformFees)}`, curr: 'UGX', icon: <Activity size={18} /> },
          { label: 'Total Capital Deployed', value: `${formatMoney(overviewMetrics.metrics?.capitalDeployed)}`, curr: 'UGX', icon: <FileText size={18} /> },
          { label: 'Outstanding Receivables', value: `${formatMoney(overviewMetrics.metrics?.outstandingReceivables)}`, curr: 'UGX', icon: <ShieldAlert size={18} /> },
          { label: 'Total Wallet Balances', value: `${formatMoney(overviewMetrics.metrics?.totalWalletBalance)}`, curr: 'UGX', icon: <Home size={18} /> }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-4">
               <span className="text-slate-500 text-sm font-bold">{stat.label}</span>
               <div className="p-2 bg-[#EAE5FF] text-[#6c11d4] rounded-full">
                 {stat.icon}
               </div>
            </div>
            <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{stat.value} <span className="text-sm text-slate-400 font-medium">{stat.curr}</span></h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', val: overviewMetrics.counts?.totalUsers ?? 0, icon: <User size={16} /> },
          { label: 'Agents', val: overviewMetrics.counts?.totalAgents ?? 0, icon: <ShieldAlert size={16} /> },
          { label: 'Tenants', val: overviewMetrics.counts?.totalTenants ?? 0, icon: <Home size={16} /> },
          { label: 'Supporters', val: overviewMetrics.counts?.totalSupporters ?? 0, icon: <Download size={16} /> }
        ].map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tight mb-1">{c.label}</p>
              <p className="text-2xl font-bold font-outfit text-slate-900">{(c.val || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-[#EAE5FF] rounded-full text-[#6c11d4] shadow-sm">
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 h-96 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 font-outfit">Financial Trends (Revenue & Cash Flow)</h3>
          <button className="text-xs font-bold text-[#6c11d4] bg-[#EAE5FF] px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors">Export CSV</button>
        </div>
        <div className="flex-1 border-t border-b border-l border-slate-100 relative w-full flex items-end justify-between px-4 pb-0 mt-4">
          {/* Dynamic real charts coming from backend trends */}
          {(overviewMetrics.trends || []).map((t: any, i: number) => (
            <div key={i} className="flex flex-col items-center gap-2 group w-1/5 h-full justify-end relative z-10">
              <div className="flex gap-2 items-end w-full justify-center">
                <div className="w-8 bg-[#EAE5FF] hover:bg-purple-200 transition-colors rounded-t-lg" style={{ height: `${Math.max((t.inflow / 1000), 5)}%`, minHeight: '10px' }} title={`Revenue: ${t.inflow}`}></div>
                <div className="w-8 bg-[#6c11d4] hover:bg-[#5b21b6] shadow-md transition-colors rounded-t-lg" style={{ height: `${Math.max((t.outflow / 1000), 5)}%`, minHeight: '10px' }} title={`Outflow: ${t.outflow}`}></div>
              </div>
              <span className="text-xs font-bold text-slate-500 mb-2">{t.date}</span>
            </div>
          ))}
          <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-slate-200 z-0"></div>
        </div>
      </div>
    </div>
  );
}
