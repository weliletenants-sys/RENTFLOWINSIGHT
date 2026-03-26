import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';

export default function RoleIntelligence() {
  const ROLES = ['TENANT', 'AGENT', 'FUNDER', 'LANDLORD', 'CEO', 'CFO', 'COO', 'SUPER_ADMIN'];
  const [selectedRole, setSelectedRole] = useState('TENANT');
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        const [usersRes, logsRes] = await Promise.all([
          axios.get((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/superadmin/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/superadmin/audit-logs?limit=500', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersRes.data || []);
        setLogs(logsRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch Role Intelligence data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
  }, []);

  const roleUsers = users.filter(u => u.role === selectedRole);
  const activeCount = roleUsers.filter(u => u.status !== 'Frozen').length;
  const frozenCount = roleUsers.filter(u => u.status === 'Frozen').length;
  
  // Try to find logs matching this role
  const roleLogs = logs.filter(l => l.actor_role === selectedRole || (users.find(u => u.id === l.user_id)?.role === selectedRole));

  return (
    <AdminLayout>
      <div className="p-8 flex-1 flex flex-col">
        
        {/* ROLE SELECTOR TABS */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center border-b border-slate-200 min-w-max">
            {ROLES.map(role => (
              <button 
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-6 py-3 border-b-2 font-label text-sm tracking-tight transition-all ${
                  selectedRole === role 
                    ? 'border-[#9234eb] text-[#9234eb] font-bold bg-[#9234eb]/5' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* DYNAMIC PANEL HEADER */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#6700b5] bg-[#6700b5]/10 px-1.5 py-0.5 rounded">READ-ONLY VIEW</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">{selectedRole} <span className="text-[#9234eb]/50">Intelligence</span></h1>
          </div>
          <div className="text-right">
            <p className="font-label text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total {selectedRole} Entities</p>
            <p className="font-label text-sm text-[#9234eb] font-medium tracking-tighter">{roleUsers.length} Recorded</p>
          </div>
        </div>

        {/* BENTO KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* KPI 1 */}
          <div className="bg-white border-l-4 border-[#9234eb] p-6 shadow-[0_0_12px_rgba(146,52,235,0.15)] relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl" data-icon="description">description</span>
            </div>
            <p className="font-label text-xs uppercase tracking-[0.15em] text-slate-500 mb-4">Total Accounts</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter text-slate-900">{roleUsers.length}</span>
              <span className="font-label text-xs text-[#9234eb] flex items-center gap-1">
                Active Profiles
              </span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white p-6 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl" data-icon="payments">payments</span>
            </div>
            <p className="font-label text-xs uppercase tracking-[0.15em] text-slate-500 mb-4">Operational Status</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter text-[#4edea3]">{activeCount}</span>
              <span className="font-label text-[10px] text-slate-500 uppercase">Live</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.3)]" style={{ width: `${roleUsers.length ? (activeCount/roleUsers.length)*100 : 0}%` }}></div>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white p-6 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl" data-icon="apartment">apartment</span>
            </div>
            <p className="font-label text-xs uppercase tracking-[0.15em] text-slate-500 mb-4">Frozen Quarantine</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter text-slate-900">{frozenCount}</span>
              <span className="font-label text-xs text-[#ffb4ab]">Locked Out</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-label italic">{frozenCount > 0 ? 'Action required.' : 'No compromised nodes.'}</p>
          </div>
        </div>

        {/* ACTIVITY TABLE SECTION */}
        <div className="grid grid-cols-12 gap-8 flex-1">
          
          {/* Main Table */}
          <div className="col-span-12 xl:col-span-8 bg-slate-50 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#9234eb]" data-icon="analytics">analytics</span>
                <h2 className="font-label text-sm font-bold uppercase tracking-widest text-slate-900">Recent Role Activity</h2>
              </div>
              <div className="flex gap-2">
                <button className="text-[10px] font-label uppercase bg-slate-100 text-slate-900 px-3 py-1 rounded hover:bg-[#9234eb]/10 transition-all">Filter</button>
                <button className="text-[10px] font-label uppercase bg-slate-100 text-slate-900 px-3 py-1 rounded hover:bg-[#9234eb]/10 transition-all">Export</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/50">
                  <tr>
                    <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-slate-500">Timestamp</th>
                    <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-slate-500">User Entity</th>
                    <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-slate-500">Action Type</th>
                    <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-slate-500">Value</th>
                    <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-slate-500 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4c4354]/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-label text-xs uppercase">LOADING CORE INTELLIGENCE...</td>
                    </tr>
                  ) : roleLogs.slice(0, 10).map((log, i) => (
                    <tr key={log.id} className={`hover:bg-slate-50/40 transition-colors ${i % 2 === 1 ? 'bg-slate-50/10' : ''}`}>
                      <td className="px-6 py-4 font-label text-xs text-slate-500 whitespace-nowrap">{new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 19)}</td>
                      <td className="px-6 py-4 font-label text-xs font-bold text-slate-900 whitespace-nowrap">{log.user_id.substring(0, 12)}</td>
                      <td className="px-6 py-4 font-label text-[11px] text-[#9234eb] uppercase font-bold">{log.action_type}</td>
                      <td className="px-6 py-4 font-label text-[11px] text-slate-500">{log.ip_address || 'Internal'}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#4edea3]/10 text-[#4edea3] text-[10px] font-bold uppercase tracking-tighter">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> Recorded
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {!loading && roleLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-label text-xs uppercase">No intelligence gathered for this role yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-white/50 border-t border-slate-200 flex justify-between items-center mt-auto">
              <p className="font-label text-[10px] text-slate-500 uppercase tracking-widest">Showing up to 10 recent instances</p>
              <div className="flex gap-4">
                <button className="material-symbols-outlined text-slate-500 hover:text-[#9234eb] transition-colors" data-icon="chevron_left">chevron_left</button>
                <button className="material-symbols-outlined text-slate-500 hover:text-[#9234eb] transition-colors" data-icon="chevron_right">chevron_right</button>
              </div>
            </div>
          </div>

          {/* System Logs / Side Panel */}
          <div className="col-span-12 xl:col-span-4 space-y-6 flex flex-col">
            <div className="bg-white p-6 border-t-2 border-[#9234eb] shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#9234eb] text-sm" data-icon="monitoring">monitoring</span>
                <h3 className="font-label text-[11px] font-bold text-slate-900 uppercase tracking-widest">Role Intelligence Core</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-label uppercase text-slate-500 mb-1.5">
                    <span>Sync Integrity</span>
                    <span className="text-[#4edea3]">99.9%</span>
                  </div>
                  <div className="h-1 bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#4edea3]" style={{ width: '99.9%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-label uppercase text-slate-500 mb-1.5">
                    <span>API Query Latency</span>
                    <span className="text-[#9234eb]">12ms</span>
                  </div>
                  <div className="h-1 bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#9234eb]" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 border border-slate-200 relative flex-1">
              <p className="font-label text-[10px] uppercase tracking-widest text-[#9234eb] mb-4">Neural Anomaly Detection</p>
              <div className="flex items-center gap-4 bg-[#ffb4ab]/5 p-4 border-l-2 border-[#ffb4ab]">
                <span className="material-symbols-outlined text-[#ffb4ab]" data-icon="warning">warning</span>
                <div>
                  <p className="text-[11px] font-bold text-slate-900">Unusual churn detected in Sector 7G</p>
                  <p className="text-[9px] text-slate-500 font-label uppercase mt-1">14:22 UTC • Tenant Withdrawal Spike</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-slate-100/20 rounded">
                <p className="text-[10px] leading-relaxed text-slate-500 font-label italic">
                  "The system predicts a 4.2% increase in vacancy for the next billing cycle based on current role interaction trends."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ASYMMETRIC LOG SECTION */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 h-24 bg-white flex items-center px-8 relative overflow-hidden rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-[#dcb8ff]/5 to-transparent"></div>
            <div className="z-10 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-label uppercase text-[#9234eb] tracking-widest">Global Heatmap</span>
                <span className="text-xl font-bold text-slate-900">Tenant Concentration Index</span>
              </div>
              <div className="h-10 w-px bg-[#4c4354]/30"></div>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-label text-slate-500">HIGH DENSITY</span>
                  <span className="text-sm font-bold text-[#4edea3]">Pretoria Central</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-label text-slate-500">EMERGING</span>
                  <span className="text-sm font-bold text-[#9234eb]">Sandton North</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-24 bg-slate-100 flex flex-col justify-center items-center group cursor-pointer hover:bg-[#9234eb] transition-all duration-300 rounded">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors" data-icon="map">map</span>
            <span className="font-label text-[10px] uppercase tracking-widest mt-2 group-hover:text-white transition-colors text-slate-500">Open GIS Layer</span>
          </div>
        </div>
      </div>

      {/* FOOTER / UTILITY DOCK */}
      <footer className="mt-auto h-10 bg-slate-50 border-t border-slate-100 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-label text-[9px] text-slate-500 uppercase tracking-widest">© 2026 Welile System Intelligence</span>
          <span className="w-1 h-1 rounded-full bg-[#4c4354]"></span>
          <span className="font-label text-[9px] text-slate-500 uppercase tracking-widest">Secure Node: 0x82...F29</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.3)]"></span>
            <span className="font-label text-[9px] text-slate-500 uppercase tracking-widest">Database Linked</span>
          </div>
        </div>
      </footer>

    </AdminLayout>
  );
}
