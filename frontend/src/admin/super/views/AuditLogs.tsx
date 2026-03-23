import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(50); // Using constant default limit
  const [selectedSeverity] = useState(''); // Using constant default severity empty filter

  const fetchLogs = async (currentPage: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/api/superadmin/audit-logs?page=${currentPage}&limit=${limit}&severity=${selectedSeverity}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const getSeverity = (actionType: string) => {
    const type = actionType.toUpperCase();
    if (type.includes('DELETE') || type.includes('FREEZE') || type.includes('CRITICAL')) return 'Critical';
    if (type.includes('ROLE') || type.includes('CONFIG') || type.includes('WARNING')) return 'Warning';
    return 'Info';
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        
        {/* Filters & Actions */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8 flex flex-wrap items-end gap-4">
            
            {/* Date Range */}
            <div className="space-y-1.5">
              <label className="font-label text-[10px] text-slate-400 uppercase tracking-wider ml-1">Timeframe</label>
              <div className="flex items-center bg-slate-50 border border-[#4c4354]/20 rounded h-10 px-3 gap-3">
                <span className="material-symbols-outlined text-xs text-slate-400" data-icon="calendar_today">calendar_today</span>
                <span className="text-xs font-label text-slate-900">2023.10.24 — 2023.10.25</span>
                <span className="material-symbols-outlined text-xs text-slate-400" data-icon="expand_more">expand_more</span>
              </div>
            </div>

            {/* Action Type Dropdown */}
            <div className="space-y-1.5">
              <label className="font-label text-[10px] text-slate-400 uppercase tracking-wider ml-1">Action Registry</label>
              <div className="flex items-center bg-slate-50 border border-[#4c4354]/20 rounded h-10 px-4 min-w-[200px] justify-between group cursor-pointer hover:border-[#9234eb]/50 transition-colors">
                <span className="text-xs font-label text-slate-900">ALL_SYSTEM_EVENTS</span>
                <span className="material-symbols-outlined text-xs text-slate-400 group-hover:text-[#9234eb]" data-icon="filter_list">filter_list</span>
              </div>
            </div>

            {/* Severity Chips */}
            <div className="space-y-1.5">
              <label className="font-label text-[10px] text-slate-400 uppercase tracking-wider ml-1">Severity Filter</label>
              <div className="flex gap-2">
                <button className="h-10 px-4 rounded border border-[#4edea3]/30 bg-[#4edea3]/5 text-[#4edea3] text-xs font-label flex items-center gap-2 hover:bg-[#4edea3]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> INFO
                </button>
                <button className="h-10 px-4 rounded border border-[#8354b4]/30 bg-[#8354b4]/5 text-[#8354b4] text-xs font-label flex items-center gap-2 hover:bg-[#8354b4]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8354b4]"></span> WARNING
                </button>
                <button className="h-10 px-4 rounded border border-[#ffb4ab]/50 bg-[#ffb4ab]/10 text-[#ffb4ab] text-xs font-label flex items-center gap-2 hover:bg-[#ffb4ab]/20 ring-1 ring-[#ffb4ab]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] shadow-[0_0_5px_#ffb4ab]"></span> CRITICAL
                </button>
              </div>
            </div>
          </div>

          {/* Search & Export */}
          <div className="col-span-12 xl:col-span-4 flex items-end justify-end gap-3">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm" data-icon="search">search</span>
              <input 
                className="w-full bg-slate-50 border border-[#4c4354]/20 rounded h-10 pl-10 pr-4 text-xs font-label text-slate-900 focus:ring-1 focus:ring-[#dcb8ff] focus:border-[#9234eb] transition-all outline-none" 
                placeholder="Query PID or UID..." 
                type="text"
              />
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded bg-slate-50 border border-[#4c4354]/30 hover:bg-[#393939] transition-colors">
              <span className="material-symbols-outlined text-slate-500" data-icon="download">download</span>
            </button>
            <button 
              onClick={() => fetchLogs(page)}
              className="h-10 px-6 bg-gradient-to-br from-[#9234eb] to-[#dcb8ff] text-[#480081] font-bold text-xs uppercase tracking-widest rounded shadow-[0_4px_14px_rgba(146,52,235,0.2)] hover:opacity-90 transition-opacity">
              REFRESH
            </button>
          </div>
        </section>

        {/* Audit Table */}
        <section className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-white border-b border-[#4c4354]/20">
                <tr>
                  <th className="px-6 py-4 font-label text-[10px] text-slate-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-6 py-4 font-label text-[10px] text-slate-400 uppercase tracking-widest">User Identity</th>
                  <th className="px-6 py-4 font-label text-[10px] text-slate-400 uppercase tracking-widest">Action Vector</th>
                  <th className="px-6 py-4 font-label text-[10px] text-slate-400 uppercase tracking-widest">Network Source</th>
                  <th className="px-6 py-4 font-label text-[10px] text-slate-400 uppercase tracking-widest">Environment</th>
                  <th className="px-6 py-4 font-label text-[10px] text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4c4354]/5">
                
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-label text-xs uppercase">
                      LOADING AUDIT TRAIL...
                    </td>
                  </tr>
                ) : logs.map((log) => {
                  const severity = getSeverity(log.action_type);
                  
                  // Style logic based on severity
                  const isCrit = severity === 'Critical';
                  const isWarn = severity === 'Warning';
                  
                  return (
                    <tr key={log.id} className={`hover:bg-slate-50/50 transition-colors group ${isCrit ? 'bg-[#ffb4ab]/5' : 'bg-slate-50'}`}>
                      <td className={`px-6 py-3 font-label text-[11px] ${isCrit ? 'text-[#ffb4ab] font-bold' : 'text-slate-500'}`}>
                        {new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 23)}
                      </td>
                      <td className="px-6 py-3 font-label text-[11px] text-slate-900 tracking-tight">{log.user_id.substring(0, 12)}</td>
                      <td className={`px-6 py-3 font-label text-[11px] tracking-wider ${isCrit ? 'font-bold text-[#ffb4ab]' : (isWarn ? 'text-[#9234eb]' : 'text-slate-900')}`}>
                        {log.action_type}
                      </td>
                      <td className="px-6 py-3 font-label text-[11px] text-slate-500 break-all max-w-[120px]">
                        {log.ip_address || '::1'}
                      </td>
                      <td className="px-6 py-3 font-label text-[11px] text-slate-400 truncate max-w-[180px]" title={log.user_agent}>
                        {log.user_agent || 'Unknown Runtime'}
                      </td>
                      <td className="px-6 py-3">
                        {isCrit && <span className="px-2 py-0.5 rounded-full bg-[#ffb4ab] text-[#690005] font-label text-[9px] font-bold uppercase ring-4 ring-[#ffb4ab]/10 shadow-[0_0_8px_rgba(255,180,171,0.4)]">Critical</span>}
                        {isWarn && <span className="px-2 py-0.5 rounded-full bg-[#8354b4] text-[#f6e7ff] font-label text-[9px] font-bold uppercase">Warning</span>}
                        {!isCrit && !isWarn && <span className="px-2 py-0.5 rounded-full bg-[#00a572] text-[#00311f] font-label text-[9px] font-bold uppercase">Info</span>}
                      </td>
                    </tr>
                  );
                })}

                {logs.length === 0 && !loading && (
                   <tr>
                     <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-label text-xs uppercase">
                       NO SYSTEM LOGS RECORDED.
                     </td>
                   </tr>
                )}
                
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <footer className="px-6 py-4 flex items-center justify-between border-t border-slate-200">
            <span className="font-label text-[10px] text-slate-400 uppercase tracking-wider">Rows {((page-1)*50)+1}-{Math.min(page*50, total)} of {total} results</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-[#4c4354]/30 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
              </button>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#9234eb] text-[#f6e7ff] text-xs font-bold font-label">{page}</button>
              </div>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * 50 >= total}
                className="w-8 h-8 flex items-center justify-center rounded border border-[#4c4354]/30 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
              </button>
            </div>
          </footer>
        </section>

        {/* Bottom Insight Panel (Asymmetric) */}
        <section className="grid grid-cols-12 gap-6">
          
          {/* Activity Heatmap Mockup */}
          <div className="col-span-12 lg:col-span-9 bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-slate-900 font-bold text-sm">System Event Density (24h)</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-[#4edea3]/20 border border-[#4edea3]/40"></span>
                  <span className="text-[9px] font-label text-slate-400 uppercase">Idle</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-gradient-to-br from-[#9234eb] to-[#dcb8ff]"></span>
                  <span className="text-[9px] font-label text-slate-400 uppercase">Peak Activity</span>
                </div>
              </div>
            </div>
            <div className="h-16 flex items-end gap-1 px-1">
              {[
                {h: 20, t: 'sec', o: 10}, {h: 30, t: 'sec', o: 20}, {h: 25, t: 'sec', o: 15},
                {h: 40, t: 'pri', o: 20}, {h: 60, t: 'pri', o: 40}, {h: 80, t: 'pri', o: 60},
                {h: 100, t: 'grad', o: 100}, {h: 90, t: 'pri', o: 70}, {h: 55, t: 'pri', o: 40},
                {h: 30, t: 'sec', o: 20}, {h: 20, t: 'sec', o: 10}, {h: 10, t: 'sec', o: 5},
                {h: 22, t: 'sec', o: 10}, {h: 35, t: 'sec', o: 20}, {h: 50, t: 'pri', o: 30},
                {h: 75, t: 'pri', o: 50}, {h: 95, t: 'pri', o: 80}, {h: 65, t: 'pri', o: 50},
                {h: 45, t: 'pri', o: 30}, {h: 28, t: 'sec', o: 15}, {h: 18, t: 'sec', o: 10},
                {h: 20, t: 'sec', o: 10}, {h: 35, t: 'sec', o: 25}, {h: 25, t: 'sec', o: 15}
              ].map((bar, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm ${
                    bar.t === 'grad' ? 'bg-gradient-to-br from-[#9234eb] to-[#dcb8ff] border-x border-t border-[#9234eb]/40' : 
                    bar.t === 'pri' ? `bg-[#9234eb]/[${bar.o}%]` : `bg-[#4edea3]/[${bar.o}%]`
                  }`} 
                  style={{ 
                    height: `${bar.h}%`, 
                    backgroundColor: bar.t !== 'grad' ? (bar.t === 'pri' ? `rgba(220, 184, 255, ${bar.o/100})` : `rgba(78, 222, 163, ${bar.o/100})`) : undefined 
                  }}>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] font-label text-slate-400 uppercase tracking-widest">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00 (Peak)</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>

          {/* Summary Side Card */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-slate-900 text-4xl" data-icon="security">security</span>
              </div>
              <h4 className="font-label text-[10px] text-slate-400 uppercase tracking-widest mb-4">Integrity Check</h4>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-900">Log Verification</span>
                  <span className="text-xs font-bold text-[#4edea3]">VALIDATED</span>
                </div>
                <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#4edea3] h-full w-[100%] shadow-[0_0_8px_rgba(78,222,163,0.3)]"></div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  SHA-256 Chain is intact. No tampering detected in current session buffer.
                </p>
                <button className="w-full py-2 bg-slate-100 text-slate-900 border border-[#4c4354]/20 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#393939] transition-colors">
                  View Chain Metadata
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}
