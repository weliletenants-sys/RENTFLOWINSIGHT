import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { formatCurrencyCompact } from '../../../utils/currency';
import { AlertOctagon, CheckCircle2, Search, Filter } from 'lucide-react';

export default function TenantRentStatus() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'overdue'>('all');

  const { data: response, isLoading } = useQuery({
    queryKey: ['manager_tenant_status', page, limit, filter],
    queryFn: () => managerApi.getTenantStatuses({ page, limit, filter })
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white border border-slate-200 shadow-sm rounded-2xl h-[500px]"></div>;
  }

  const tenants = response?.data || [];
  const meta = response?.meta || { has_next: false, has_previous: false, total_pages: 1, page_number: 1 };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden font-inter">
      {/* Search Header Tooling */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-800 tracking-tight">Rent Defaulter Ledger</h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated detection of rent arrears relying on wallet mappings.</p>
        </div>

        <div className="flex bg-white border border-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => { setFilter('all'); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >All</button>
          <button 
            onClick={() => { setFilter('overdue'); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${filter === 'overdue' ? 'bg-red-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          ><AlertOctagon size={12}/> Overdue</button>
          <button 
            onClick={() => { setFilter('compliant'); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${filter === 'compliant' ? 'bg-green-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          ><CheckCircle2 size={12}/> Compliant</button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Tenant Identity</th>
              <th className="px-6 py-4 text-center">Linked Properties</th>
              <th className="px-6 py-4 text-right">Ledger Liability</th>
              <th className="px-6 py-4 text-center">Compliance Map</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{t.full_name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{t.phone}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex mt-1 items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">{t.linked_properties || 1}</span>
                </td>
                <td className="px-6 py-4 flex flex-col items-end">
                   {t.balance < 0 ? (
                      <span className="text-sm font-bold font-mono text-red-600 relative flex items-center gap-2">
                        {Math.abs(t.balance).toLocaleString()} KSH ARREARS
                      </span>
                   ) : (
                      <span className="text-sm font-bold font-mono text-green-600">FULLY SETTLED</span>
                   )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full ${
                    t.compliance === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {t.compliance}
                  </span>
                </td>
              </tr>
            ))}
            
            {tenants.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No tenants matching the formal compliance filter parameters were found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Grid DB Paginator APIs */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
        <div>
          PAGE <span className="font-bold text-slate-800">{meta.page_number}</span> / {meta.total_pages}
        </div>
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <button 
            disabled={!meta.has_previous} 
            onClick={() => setPage(p => p - 1)}
            className="hover:text-red-500 disabled:opacity-30 uppercase"
          >
            Prev
          </button>
          <span>&middot;</span>
          <button 
            disabled={!meta.has_next} 
            onClick={() => setPage(p => p + 1)}
            className="hover:text-red-500 disabled:opacity-30 uppercase"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
