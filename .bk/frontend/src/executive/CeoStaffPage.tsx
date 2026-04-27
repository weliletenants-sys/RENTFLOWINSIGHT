import React from 'react';
import { useCeoStaffPerformance } from '../hooks/useExecutiveQueries';
import { Loader2, Zap, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CeoStaffPage() {
  const { data, isLoading } = useCeoStaffPerformance();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[50vh] text-slate-400">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={32} />
        <p className="font-medium">Aggregating SLA and performance metrics...</p>
      </div>
    );
  }

  const { activityHeatmap = [], slaCompliance = [] } = data || {};

  // Find peak hour safely
  const peakHour = [...activityHeatmap].sort((a, b) => b.volume - a.volume)[0]?.hour || '--:--';
  const totalActions = activityHeatmap.reduce((acc, curr) => acc + curr.volume, 0);

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">Staff Performance & SLAs</h1>
        <p className="text-slate-500 mt-1 text-[15px]">Internal operating compliance and platform activity heatmaps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Ops Peak Operating Hour</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{peakHour}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total System Actions (Today)</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{new Intl.NumberFormat().format(totalActions)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Zap size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">SLA Violation Rate</p>
            <h3 className="text-3xl font-bold text-red-600 mt-1">
               {slaCompliance.length ? Math.round((slaCompliance.filter(s => s.status === 'warning').length / slaCompliance.length) * 100) : 0}%
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <ShieldAlert size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Heatmap Simulation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Staff Operations Heatmap</h3>
          <div className="space-y-4">
            {activityHeatmap.map((hm, idx) => {
              const percentage = Math.round((hm.volume / Math.max(...activityHeatmap.map(h => h.volume))) * 100);
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-slate-500 font-medium text-right shrink-0">{hm.hour}</div>
                  <div className="flex-1 bg-slate-100 rounded-lg h-8 overflow-hidden group">
                    <div 
                      className="bg-purple-500 h-full rounded-lg transition-all duration-300 group-hover:bg-purple-600 flex items-center px-3"
                      style={{ width: `${Math.max(percentage, 5)}%`, opacity: Math.max(percentage / 100, 0.2) }}
                    >
                    </div>
                  </div>
                  <div className="w-10 text-xs font-bold text-slate-700 text-right shrink-0">{hm.volume}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLA Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 mb-6">SLA Compliance Breakdown</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="border-b border-slate-200 text-slate-500">
                 <tr>
                   <th className="pb-3 font-medium">Core Metric</th>
                   <th className="pb-3 font-medium">Target</th>
                   <th className="pb-3 font-medium">Actual</th>
                   <th className="pb-3 font-medium">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {slaCompliance.map((sla, idx) => (
                   <tr key={idx} className="hover:bg-slate-50 transition-colors">
                     <td className="py-4 text-slate-900 font-semibold">{sla.metric}</td>
                     <td className="py-4 text-slate-500">{sla.target}</td>
                     <td className="py-4 text-slate-900 font-bold">{sla.actual}</td>
                     <td className="py-4">
                        {sla.status === 'compliant' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                            <CheckCircle2 size={12} /> Compliant
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                            <ShieldAlert size={12} /> Warning
                          </span>
                        )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
}
