import React, { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';

export default function TenantOverviewList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy data strictly for UI scaffolding prior to backend wire-up
  const [tenants] = useState([
    { id: 'TNT-8891', name: 'John Doe', stage: 'Funded', latest_rent: 450000, repaid: 150000, smartphone: true, risk: 'low' },
    { id: 'TNT-1102', name: 'Mary N.', stage: 'Pending', latest_rent: 300000, repaid: 0, smartphone: false, risk: 'medium' },
    { id: 'TNT-3419', name: 'Samuel Kiga', stage: 'Defaulting', latest_rent: 600000, repaid: 200000, smartphone: true, risk: 'critical' },
  ]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500 font-inter">
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Global Tenant Index</h3>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tenant</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Active Contract</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Repayment Health</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary-faint,#f4f0ff)] text-[var(--color-primary)] flex items-center justify-center font-bold text-sm border border-[var(--color-primary-light)]">
                      {t.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors">{t.name}</div>
                      <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                        {t.id} {t.smartphone && <Smartphone size={12} className="text-slate-400" />}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">UGX {t.latest_rent.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Total Financed</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                      <div 
                        className={`h-full rounded-full ${t.risk === 'critical' ? 'bg-red-500' : 'bg-[var(--color-success)]'}`} 
                        style={{ width: `${(t.repaid/t.latest_rent)*100 || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-600 w-8">{Math.round((t.repaid/t.latest_rent)*100 || 0)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wide
                    ${t.stage === 'Funded' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                      t.stage === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                        'bg-red-50 text-red-700 border border-red-100'}`}>
                    {t.stage === 'Funded' && <CheckCircle2 size={12} />}
                    {t.stage === 'Defaulting' && <AlertCircle size={12} />}
                    {t.stage}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 bg-white text-slate-400 border border-slate-200 hover:text-[var(--color-primary)] hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-all shadow-sm">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
