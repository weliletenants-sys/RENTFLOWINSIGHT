import { useState } from 'react';
import { ArrowUpRight, TrendingUp, Wallet, ArrowDownRight, Layers } from 'lucide-react';

export default function PartnerCapitalFlow() {
  const [timeline] = useState('30d');

  // Simulated Analytics State
  const [flows] = useState([
    { id: 'FL-001', type: 'inflow', partner: 'PT-9901', amount: 5000000, date: '2025-10-12', status: 'deployed' },
    { id: 'FL-002', type: 'maturity', partner: 'PT-3122', amount: 2000000, date: '2025-10-15', status: 'reinvesting' },
    { id: 'FL-003', type: 'outflow', partner: 'PT-1002', amount: 1500000, date: '2025-10-18', status: 'withdrawing' },
  ]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500 font-inter">
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div>
           <h3 className="text-lg font-bold text-slate-800 tracking-tight">Capital Velocity & Maturities</h3>
           <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Tracking {timeline} net flow</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button className={`px-4 py-1.5 text-xs font-bold rounded-lg ${timeline === '7d' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>7 Days</button>
           <button className={`px-4 py-1.5 text-xs font-bold rounded-lg ${timeline === '30d' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>30 Days</button>
           <button className={`px-4 py-1.5 text-xs font-bold rounded-lg ${timeline === '90d' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Quarterly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100 bg-white">
          <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Gross Inbound</span>
                  <div className="p-2 rounded-full bg-emerald-50 text-emerald-600"><ArrowUpRight size={16} /></div>
              </div>
              <p className="text-3xl font-black text-slate-800 font-outfit mb-1">UGX 8.5M</p>
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> +12% from last cycle</p>
          </div>
          <div className="p-6 bg-slate-50/30">
              <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Net Retention</span>
                  <div className="p-2 rounded-full bg-[#f4f0ff] text-[var(--color-primary)]"><Wallet size={16} /></div>
              </div>
              <p className="text-3xl font-black text-slate-800 font-outfit mb-1">94.2%</p>
              <p className="text-xs font-bold text-slate-500">Capital rolling over upon maturity</p>
          </div>
          <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Scheduled Outflows</span>
                  <div className="p-2 rounded-full bg-red-50 text-red-600"><ArrowDownRight size={16} /></div>
              </div>
              <p className="text-3xl font-black text-slate-800 font-outfit mb-1">UGX 1.5M</p>
              <p className="text-xs font-bold text-red-600">Locked in terminal state</p>
          </div>
      </div>

      <div className="p-6">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Layers size={18} className="text-slate-400"/> Forward Schedule Timeline</h4>
          <div className="space-y-4">
              {flows.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-all group">
                      <div className="flex gap-4 items-center">
                          <div className={`p-3 rounded-xl border ${
                              f.type === 'inflow' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                              f.type === 'maturity' ? 'bg-[var(--color-primary-faint)] border-[var(--color-primary-light)] text-[var(--color-primary)]' : 
                              'bg-red-50 border-red-100 text-red-600'
                          }`}>
                              {f.type === 'inflow' ? <ArrowUpRight size={20}/> : f.type === 'maturity' ? <Wallet size={20}/> : <ArrowDownRight size={20}/>}
                          </div>
                          <div>
                              <p className="font-bold text-slate-900 leading-tight">{f.type === 'maturity' ? 'Portfolio Maturity' : f.type === 'inflow' ? 'New Deployment' : 'Capital Call'}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase mt-1">{f.date} • {f.partner}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-bold text-lg font-outfit text-slate-800">UGX {f.amount.toLocaleString()}</p>
                          <p className="text-xs font-bold text-slate-500 uppercase mt-1 px-2 py-0.5 rounded-md bg-slate-100 inline-block">{f.status}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
