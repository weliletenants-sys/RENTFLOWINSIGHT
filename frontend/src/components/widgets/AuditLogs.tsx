import { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AuditLogsWidget() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`http://localhost:3000/api/superadmin/audit-logs?page=${page}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.data);
      setTotal(res.data.total);
    } catch (err: any) {
      toast.error('Failed to fetch audit sequence');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-full space-y-6 flex flex-col bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm min-h-[500px]">
      <div className="mb-2">
        <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight mb-1">Global Audit Sequence</h2>
        <p className="text-on-surface-variant font-body text-sm">Immutable cryptographic event log across all staff tiers.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 shrink-0 justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Filter trace IDs..." 
              className="pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none w-48 focus:w-64 transition-all text-sm font-medium"
            />
          </div>

          <div className="h-6 w-px bg-outline-variant/20" />

          <button className="flex items-center gap-2 px-3 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-bold hover:bg-surface-container transition-colors shadow-sm">
            <Filter size={16} /> Timeline
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold shadow-md hover:bg-primary/90 transition-colors whitespace-nowrap">
          <Download size={16} /> Dump CSV
        </button>
      </div>

      <div className="bg-surface-container-lowest shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-xl border border-outline-variant/10 flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full text-left whitespace-nowrap">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                <th className="px-6 py-4">Timestamp Sequence</th>
                <th className="px-6 py-4">Actor Signature</th>
                <th className="px-6 py-4">Action Vector</th>
                <th className="px-6 py-4">Target Node</th>
                <th className="px-6 py-4 text-right">Context (IP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-on-surface-variant">Decrypting audit stream...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-on-surface-variant">No cryptographic traces found.</td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-surface-container-low/50 transition-colors text-sm group">
                  <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-on-surface block truncate max-w-[150px]">{log.user_id}</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary mt-0.5 inline-block">{log.actor_role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded ${
                      log.actor_role === 'SUPER_ADMIN' 
                      ? 'bg-error-container text-on-error-container' 
                      : 'bg-surface-container text-on-surface'
                    }`}>
                      {log.action_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-on-surface-variant max-w-[150px] truncate">
                    {log.target_id}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-[10px] font-mono font-semibold text-right max-w-[120px] truncate">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <div>Displaying {Math.min(1 + (page - 1) * 50, total)}–{Math.min(page * 50, total)} of {total} events</div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container disabled:opacity-50 transition-colors"
            >
              Previous Set
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page * 50 >= total}
              className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container disabled:opacity-50 transition-colors"
            >
              Next Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
