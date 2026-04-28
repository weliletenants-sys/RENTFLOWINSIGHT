import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { formatMoney } from '../../../utils/currency';
import { Database, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ManagerBankingLedger() {
  const { data: records, isLoading } = useQuery({
    queryKey: ['manager_global_ledger'],
    queryFn: managerApi.getLedgerRecords
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white h-96 rounded-xl border border-gray-200"></div>;
  }

  if (!records || records.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No ledger records found globally.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-inter">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="text-slate-600" />
          <h3 className="font-bold text-gray-900 tracking-tight">Raw Banking Forensics Ledger</h3>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          LAST 100 RECORDS
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#f8fafc] border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Entity</th>
              <th className="px-6 py-4">Classification</th>
              <th className="px-6 py-4">Trace Logic</th>
              <th className="px-6 py-4 text-right">Value Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record: any) => {
              const isCredit = record.direction === 'credit';
              return (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-slate-500">
                    {new Date(record.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-bold text-slate-800">{record.profiles?.full_name || 'System Auto'}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">{record.profiles?.role || 'SYSTEM_LOGIC'}</div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">
                      {record.category}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-xs text-slate-600 truncate max-w-xs">{record.description}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">REF: {record.reference_id}</p>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className={`flex items-center justify-end gap-1.5 font-black text-sm tracking-tight ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isCredit ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                      {formatMoney(Number(record.amount))} UGX
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
