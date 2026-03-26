import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { Server, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PartnerIntegrationHub() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['manager_partner_integrations'],
    queryFn: managerApi.getPartnerIntegrations,
    refetchInterval: 30000 // Polling every 30s to simulate live webhook checking
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white border border-slate-200 shadow-sm rounded-2xl h-80"></div>;
  }

  const hooks = response?.data || [];

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden font-inter">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Server className="text-indigo-600" size={18} />
          Enterprise Webhook Clusters
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Real-time connection statistics executing against external financial & data nodes.</p>
      </div>

      <div className="p-0 overflow-x-auto min-h-[300px]">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">API Provider</th>
              <th className="px-6 py-4">Tunnel Sector</th>
              <th className="px-6 py-4 text-center">Ping Latency</th>
              <th className="px-6 py-4 text-right">Node State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hooks.map((hook: any) => (
              <tr key={hook.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{hook.provider}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{hook.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                    {hook.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col items-center">
                     <span className={`font-bold font-mono text-sm ${hook.latency > 200 ? 'text-red-500' : 'text-slate-700'}`}>
                       {hook.latency}ms
                     </span>
                     <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">Last Byte</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {hook.status === 'OPERATIONAL' ? (
                    <span className="inline-flex items-center justify-end w-full gap-1.5 text-xs font-black uppercase text-green-600">
                      <CheckCircle2 size={14} /> Synced O.K.
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-end w-full gap-1.5 text-xs font-black uppercase text-amber-600">
                      <AlertTriangle size={14} /> Degraded Signal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
