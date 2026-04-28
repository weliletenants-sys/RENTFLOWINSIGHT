import { useState } from 'react';
import { ShieldAlert, Info, AlertTriangle, MessageCircle } from 'lucide-react';

export default function PartnerChurnAlerts() {
  const [alerts] = useState([
    { id: 'AL-100', partner: 'David T.', riskLevel: 'high', logic: 'Disabled auto-reinvest prior to UGX 5M maturity.', time: '2 hours ago' },
    { id: 'AL-102', partner: 'Sarah L.', riskLevel: 'medium', logic: 'Requested partial withdrawal of UGX 1M from platform wallet.', time: '1 day ago' },
    { id: 'AL-105', partner: 'Capital Org.', riskLevel: 'low', logic: 'Logged in but has not deployed idle UGX 3M in wallet for 15 days.', time: '3 days ago' },
  ]);

  return (
    <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden animate-in fade-in duration-500 font-inter">
      <div className="px-6 py-5 border-b border-red-100 flex gap-4 items-center bg-red-50/50">
        <div className="p-2 rounded-lg bg-red-100 text-red-600">
           <ShieldAlert size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-900 tracking-tight">VIP Churn Analytics</h3>
          <p className="text-sm font-medium text-red-700/80 mt-0.5">Automated algorithmic detection of flight risk patterns among aggregated capital providers.</p>
        </div>
        <div className="px-4 py-2 border border-red-200 bg-white rounded-xl shadow-sm text-center">
             <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">At Risk</span>
             <span className="text-xl font-black text-red-600 font-outfit">UGX 9.0M</span>
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex items-start gap-3 text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <Info size={18} className="text-[var(--color-primary)] shrink-0 mt-0.5"/>
              <p className="leading-relaxed">
                  <strong>How flags work:</strong> Our predictive model tracks behavioral deviations—such as sudden toggles of the <span className="font-mono bg-slate-100 text-xs px-1 py-0.5 rounded">auto_reinvest</span> switch, mounting idle balances in the `fund_wallet`, and increased querying of withdrawal rules. Escalations here require immediate white-glove retention outreach.
              </p>
          </div>
      </div>

      <div className="p-6">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">Detected EscalationsQueue</h4>
          <div className="space-y-4">
              {alerts.map(a => (
                  <div key={a.id} className="group relative border border-slate-100 rounded-xl bg-white hover:border-slate-300 transition-all p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                              <div className={`p-2.5 rounded-full ${
                                  a.riskLevel === 'high' ? 'bg-red-50 text-red-600 border border-red-100' :
                                  a.riskLevel === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  'bg-slate-50 text-slate-500 border border-slate-200'
                              }`}>
                                  {a.riskLevel === 'high' ? <AlertTriangle size={18} /> : <Info size={18} />}
                              </div>
                              <div>
                                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                      <h5 className="font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors">{a.partner}</h5>
                                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                                          a.riskLevel === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                                          a.riskLevel === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                          'bg-slate-50 text-slate-600 border-slate-200'
                                      }`}>
                                          {a.riskLevel} Risk
                                      </span>
                                      <span className="text-xs font-semibold text-slate-400">{a.time}</span>
                                  </div>
                                  <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">{a.logic}</p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
                          <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                              Dismiss Risk
                          </button>
                          <button className="px-4 py-2 bg-[var(--color-primary)] text-white shadow-sm shadow-[var(--color-primary)]/20 rounded-lg text-xs font-bold hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2">
                              <MessageCircle size={14}/> Dispatch Outreach
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
