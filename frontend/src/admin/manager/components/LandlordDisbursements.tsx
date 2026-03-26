import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { formatMoney } from '../../../utils/currency';
import { CheckCircle2, History, SendToBack } from 'lucide-react';

export default function LandlordDisbursements() {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);

  const { data: response, isLoading } = useQuery({
    queryKey: ['manager_landlord_disbursements', page, limit],
    queryFn: () => managerApi.getLandlordDisbursements({ page, limit })
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white border border-slate-200 shadow-sm rounded-2xl h-96"></div>;
  }

  const landlords = response?.data || [];
  const meta = response?.meta || { has_next: false, has_previous: false, total_pages: 1 };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden font-inter">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <History className="text-emerald-600" size={18} />
          Live Owner Equity & Disbursements
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Aggregates cleared rent arrays queued natively for outbound wire transfer.</p>
      </div>

      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Beneficiary Name</th>
              <th className="px-6 py-4">Internal Tracking</th>
              <th className="px-6 py-4 text-right">Pending Ready Transfer</th>
              <th className="px-6 py-4 text-right">Historically Disbursed</th>
              <th className="px-6 py-4 text-center">Status Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {landlords.map((ll: any) => (
              <tr key={ll.id} className="hover:bg-emerald-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{ll.full_name}</div>
                  <div className="text-xs text-slate-400">{ll.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded select-all">{ll.id.split('-')[0].toUpperCase()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  {ll.pending_payout > 0 ? (
                    <div className="font-bold font-mono text-emerald-600 border border-emerald-200 bg-emerald-50 px-2.5 py-1 rounded inline-flex shadow-sm">
                      {formatMoney(ll.pending_payout)}
                    </div>
                  ) : (
                    <span className="font-bold font-mono text-slate-400">0 KSH</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-bold text-sm text-slate-800">
                  {formatMoney(ll.historical_transfers)}
                </td>
                <td className="px-6 py-4 flex justify-center">
                   {ll.pending_payout > 0 ? (
                     <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-transform active:scale-95 shadow-sm">
                       <SendToBack size={12} /> Excute Wire
                     </button>
                   ) : (
                     <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-400 text-xs font-bold rounded-lg border border-slate-100 select-none">
                       <CheckCircle2 size={12} /> Settled
                     </span>
                   )}
                </td>
              </tr>
            ))}
            
            {landlords.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-500 text-sm italic">
                  No active landlord profiles discovered spanning the local network queries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
        <div>
          PAGE <span className="font-bold text-slate-800">{meta.page_number}</span> / {meta.total_pages}
        </div>
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <button 
            disabled={!meta.has_previous} 
            onClick={() => setPage(p => p - 1)}
            className="hover:text-emerald-600 disabled:opacity-30 uppercase"
          >Prev</button>
          <span>&middot;</span>
          <button 
            disabled={!meta.has_next} 
            onClick={() => setPage(p => p + 1)}
            className="hover:text-emerald-600 disabled:opacity-30 uppercase"
          >Next</button>
        </div>
      </div>
    </div>
  );
}
