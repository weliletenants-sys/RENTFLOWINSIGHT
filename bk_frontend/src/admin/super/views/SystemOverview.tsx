import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';

export default function SystemOverview() {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    activeSessions: 0,
    securityAlerts: 0,
    pendingKyc: 0,
    frozenAccounts: 0,
    totalWallets: 0,
    systemUptime: 0,
    apiLatency: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/superadmin/system-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
    
    // Simulate real-time pulsing
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        
        {/* Bento KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Platform Accounts */}
          <div className="bg-white p-4 rounded-xl flex flex-col justify-between h-32 border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase tracking-widest text-slate-500">Platform Accounts</span>
              <span className="material-symbols-outlined text-[#9234eb]/40 text-sm" data-icon="group">group</span>
            </div>
            <div>
              <div className="font-label text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[10px] text-[#4edea3]" data-icon="trending_up">trending_up</span>
                <span className="font-label text-[10px] text-[#4edea3]">Live Sync</span>
              </div>
            </div>
          </div>

          {/* Card 2: Active Sessions */}
          <div className="bg-white p-4 rounded-xl flex flex-col justify-between h-32 border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase tracking-widest text-slate-500">Active Sessions</span>
              <span className="material-symbols-outlined text-[#4edea3] text-sm" data-icon="sensors">sensors</span>
            </div>
            <div>
              <div className="font-label text-2xl font-bold">{stats.activeSessions.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4edea3] shadow-[0_0_12px_rgba(78,222,163,0.2)]"></div>
                <span className="font-label text-[10px] text-slate-500 uppercase tracking-tighter">Real-time active</span>
              </div>
            </div>
          </div>

          {/* Card 3: Security Alerts */}
          <div className="bg-white p-4 rounded-xl flex flex-col justify-between h-32 border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase tracking-widest text-slate-500">Security Alerts</span>
              <span className="material-symbols-outlined text-slate-500 text-sm" data-icon="gpp_maybe">gpp_maybe</span>
            </div>
            <div>
              <div className="font-label text-2xl font-bold text-slate-500">{stats.securityAlerts.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="font-label text-[10px] text-slate-500/40 italic">Global triggers</span>
              </div>
            </div>
          </div>

          {/* Card 4: Pending KYC */}
          <div className="bg-white p-4 rounded-xl flex flex-col justify-between h-32 border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#9234eb]">Pending KYC</span>
              <span className="material-symbols-outlined text-[#9234eb] text-sm" data-icon="rule">rule</span>
            </div>
            <div>
              <div className="font-label text-2xl font-bold">{stats.pendingKyc.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="font-label text-[10px] text-[#9234eb] underline underline-offset-2 cursor-pointer">Verification queue</span>
              </div>
            </div>
          </div>

          {/* Card 5: Frozen Accounts */}
          <div className="bg-white p-4 rounded-xl flex flex-col justify-between h-32 border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase tracking-widest text-slate-500">Frozen Accounts</span>
              <span className="material-symbols-outlined text-[#ffb4ab] text-sm" data-icon="lock">lock</span>
            </div>
            <div>
              <div className="font-label text-2xl font-bold text-[#ffb4ab]">{stats.frozenAccounts.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="font-label text-[10px] text-[#ffb4ab] uppercase tracking-tighter font-bold">Quarantine status</span>
              </div>
            </div>
          </div>

          {/* Card 6: Total Wallets */}
          <div className="bg-white p-4 rounded-xl flex flex-col justify-between h-32 border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase tracking-widest text-slate-500">Total Wallets</span>
              <span className="material-symbols-outlined text-[#4edea3] text-sm" data-icon="account_balance_wallet">account_balance_wallet</span>
            </div>
            <div>
              <div className="font-label text-2xl font-bold">{stats.totalWallets.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1 text-[#4edea3]">
                <span className="material-symbols-outlined text-[10px]" data-icon="check_circle">check_circle</span>
                <span className="font-label text-[10px] uppercase tracking-tighter">Synced ledger</span>
              </div>
            </div>
          </div>

          {/* Card 7: System Uptime */}
          <div className="bg-white p-4 rounded-xl flex flex-col justify-between h-32 border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase tracking-widest text-slate-500">System Uptime</span>
              <span className="material-symbols-outlined text-[#4edea3] text-sm" data-icon="bolt">bolt</span>
            </div>
            <div>
              <div className="font-label text-2xl font-bold">{stats.systemUptime}%</div>
              <div className="flex items-center gap-1 mt-1 text-[#4edea3]">
                <span className="material-symbols-outlined text-[10px]" data-icon="verified">verified</span>
                <span className="font-label text-[10px] uppercase tracking-tighter">Operational</span>
              </div>
            </div>
          </div>

          {/* Card 8: API Latency */}
          <div className="bg-white p-4 rounded-xl flex flex-col justify-between h-32 border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase tracking-widest text-slate-500">API Latency</span>
              <span className="material-symbols-outlined text-[#9234eb] text-sm" data-icon="speed">speed</span>
            </div>
            <div>
              <div className="font-label text-2xl font-bold">{stats.apiLatency}<span className="text-xs ml-1 opacity-50">ms</span></div>
              <div className="flex items-center gap-1 mt-1">
                <span className="font-label text-[10px] text-slate-500/60 uppercase">Optimal threshold</span>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Latency Chart Area */}
          <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-lg leading-none">API Latency Flux</h3>
                <p className="font-label text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Aggregate performance across global regions (24h)</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-slate-100 px-3 py-1 rounded text-[10px] font-label uppercase">Day</button>
                <button className="bg-[#9234eb] text-white px-3 py-1 rounded text-[10px] font-label uppercase">Week</button>
              </div>
            </div>

            <div className="h-64 bg-slate-50 rounded-lg flex items-end justify-between p-4 gap-1 overflow-hidden relative group">
              {/* Abstract Visual Chart bars */}
              {[40, 60, 30, 75, 80, 60, 40, 30, 60, 75, 80, 60, 40, 30, 60, 75, 80, 60, 40, 30, 60, 75, 80, 60].map((h, i) => (
                <div key={i} className="w-full bg-[#9234eb]/30 rounded-t-sm self-end transition-all hover:bg-[#9234eb]" style={{ height: `${h}%` }}></div>
              ))}
              
              {/* Tooltip Overlay */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#393939]/90 backdrop-blur px-3 py-2 rounded border border-[#9234eb]/20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-label text-[10px] block text-[#9234eb] font-bold uppercase">Peak Latency: 14:00</span>
                <span className="font-label text-lg">78ms</span>
              </div>
            </div>
          </div>

          {/* Stability Indicator Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Uptime Stability */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-sm uppercase tracking-tighter">Uptime Stability</h3>
                <span className="font-label text-[10px] text-[#4edea3]">ACTIVE</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="font-label text-[10px] text-slate-500 uppercase">Success Rate</span>
                  <span className="font-label text-xl font-bold text-[#4edea3]">100%</span>
                </div>
                
                {/* Status Blocks Sparkline */}
                <div className="flex gap-1 h-8">
                  {Array(15).fill(0).map((_, i) => (
                    <div key={i} className={`flex-1 bg-[#4edea3] rounded-sm ${i === 8 ? 'opacity-80' : 'opacity-100'}`}></div>
                  ))}
                </div>
                
                <div className="flex justify-between text-[8px] font-label text-slate-500 uppercase tracking-widest">
                  <span>30m ago</span>
                  <span>Now</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9234eb] shadow-[0_0_8px_rgba(146,52,235,0.4)]"></div>
                    <span className="font-label text-[10px] uppercase">Node Alpha</span>
                  </div>
                  <span className="font-label text-[10px] font-bold">STABLE</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9234eb] shadow-[0_0_8px_rgba(146,52,235,0.4)]"></div>
                    <span className="font-label text-[10px] uppercase">Node Bravo</span>
                  </div>
                  <span className="font-label text-[10px] font-bold">STABLE</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.4)]"></div>
                    <span className="font-label text-[10px] uppercase">Proxy West</span>
                  </div>
                  <span className="font-label text-[10px] font-bold">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Rapid Response Console */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-xs text-slate-500" data-icon="terminal">terminal</span>
                <span className="font-label text-[9px] uppercase tracking-[0.2em] text-slate-500">System Logs</span>
              </div>
              <div className="font-label text-[10px] space-y-2 text-slate-500/70 overflow-hidden">
                <p><span className="text-[#9234eb] mr-2">[14:02:11]</span> AUTH_SUCCESS: user_8829</p>
                <p><span className="text-[#9234eb] mr-2">[14:01:55]</span> SYNC_COMPLETE: vault_primary</p>
                <p><span className="text-[#4edea3] mr-2">[14:01:32]</span> HEALTH_CHECK: passed (42ms)</p>
                <p><span className="text-[#9234eb] mr-2">[14:01:10]</span> ROLE_UPDATED: sa_clearance_lvl_4</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
