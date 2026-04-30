import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';

export default function UserMatrix() {
  const [isFreezeModalOpen, setFreezeModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        const res = await axios.get((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/superadmin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openFreezeModal = (id: string) => {
    setTargetUserId(id);
    setFreezeModalOpen(true);
  };

  const handleFreezeConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/superadmin/freeze-account', { targetUserId, reason: 'Manual Admin Action' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFreezeModalOpen(false);
      // Optimistic update
      setUsers(users.map(u => u.id === targetUserId ? { ...u, status: 'Frozen' } : u));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Toolbar: Search & Filters */}
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-4">
            
            {/* Dense Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-500 text-sm" data-icon="manage_search">manage_search</span>
              </div>
              <input 
                className="block w-full bg-slate-50 border-none focus:ring-1 focus:ring-[#dcb8ff] rounded text-xs py-3 pl-10 font-label text-slate-900 placeholder:text-[#4c4354] transition-all" 
                placeholder="SEARCH BY EMAIL, PHONE, OR SYSTEM_ID..." 
                type="text"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-slate-50 rounded text-[9px] font-label text-slate-400 uppercase border border-[#4c4354]/20">⌘ K</span>
              </div>
            </div>
            
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-label text-[10px] uppercase text-[#4c4354] mr-2">Quick Filters:</span>
              <button className="px-3 py-1.5 rounded-full bg-[#9234eb] text-white text-[10px] font-bold font-label uppercase flex items-center gap-2">
                Role: All <span className="material-symbols-outlined text-[14px]" data-icon="expand_more">expand_more</span>
              </button>
              <button className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold font-label uppercase hover:bg-[#393939] transition-colors">
                Status: Active
              </button>
              <button className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold font-label uppercase hover:bg-[#393939] transition-colors">
                Wallet: &gt;0
              </button>
              <button className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold font-label uppercase hover:bg-[#393939] transition-colors">
                Region: EMEA
              </button>
              <div className="h-4 w-[1px] bg-[#4c4354] mx-1"></div>
              <button className="text-[10px] font-label text-[#9234eb] hover:underline uppercase">Clear All</button>
            </div>
          </div>
          
          {/* Bulk Actions */}
          <div className="col-span-12 xl:col-span-4 flex justify-start xl:justify-end items-start gap-3">
            <button className="flex items-center gap-2 bg-slate-50 hover:bg-[#393939] px-4 py-2.5 rounded text-xs font-bold transition-all border border-slate-200 text-slate-500">
              <span className="material-symbols-outlined text-sm" data-icon="cloud_download">cloud_download</span>
              EXPORT CSV
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-br from-[#9234eb] to-[#dcb8ff] px-4 py-2.5 rounded text-xs font-bold text-white shadow-lg glow-primary transition-all">
              <span className="material-symbols-outlined text-sm" data-icon="campaign">campaign</span>
              MASS NOTIFY
            </button>
          </div>
        </section>

        {/* Data Table Container */}
        <section className="bg-slate-50 rounded-xl overflow-hidden shadow-2xl relative">
          
          {/* Table Header Metadata */}
          <div className="px-4 py-3 bg-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-label text-[11px] text-slate-500 uppercase">Results: <span className="text-[#4edea3]">{users.length} Users</span></span>
              <span className="font-label text-[11px] text-[#4c4354] uppercase">Updated: Just now</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-50 text-slate-500 transition-colors"><span className="material-symbols-outlined text-lg" data-icon="refresh">refresh</span></button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-50 text-slate-500 transition-colors"><span className="material-symbols-outlined text-lg" data-icon="more_vert">more_vert</span></button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-500 border-b border-slate-200">
                  <th className="px-4 py-3 font-label text-[10px] uppercase tracking-wider">User ID</th>
                  <th className="px-4 py-3 font-label text-[10px] uppercase tracking-wider">Identity</th>
                  <th className="px-4 py-3 font-label text-[10px] uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 font-label text-[10px] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-label text-[10px] uppercase tracking-wider">Wallet Cnt</th>
                  <th className="px-4 py-3 font-label text-[10px] uppercase tracking-wider">Last Sync</th>
                  <th className="px-4 py-3 font-label text-[10px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-label text-xs">LOADING PROFILES...</td>
                  </tr>
                ) : users.map(user => (
                  <tr key={user.id} className={`hover:bg-slate-50 transition-colors group ${user.status === 'Frozen' ? 'bg-[#93000a]/5' : ''}`}>
                    <td className="px-4 py-3 font-label text-xs text-[#9234eb] font-medium tracking-tight">WL-{user.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-900">{user.email || 'N/A'}</span>
                        <span className="text-[10px] text-slate-500">{user.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-label uppercase border ${
                        user.role === 'SUPER_ADMIN' ? 'bg-[#9234eb]/10 text-[#9234eb] border-[#9234eb]/20' :
                        user.role === 'LANDLORD' ? 'bg-[#5d2e8c]/10 text-[#5d2e8c] border-[#5d2e8c]/20' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Frozen' ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'} shadow-[0_0_8px_rgba(78,222,163,0.3)]`}></div>
                        <span className={`text-[10px] font-bold font-label uppercase ${user.status === 'Frozen' ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>{user.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-label text-xs text-slate-900">1</td>
                    <td className="px-4 py-3 font-label text-[10px] text-slate-500 uppercase">LIVE</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-slate-500 hover:text-[#9234eb] transition-colors" onClick={() => openFreezeModal(user.id)}>
                        <span className="material-symbols-outlined" data-icon="more_horiz">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer Pagination */}
          <div className="px-4 py-3 bg-white border-t border-slate-200 flex justify-between items-center">
            <div className="flex gap-2">
              <button className="p-1 px-3 bg-slate-50 rounded text-[10px] font-bold font-label opacity-50 cursor-not-allowed text-slate-900">PREV</button>
              <button className="p-1 px-3 bg-slate-50 rounded text-[10px] font-bold font-label text-[#9234eb]">1</button>
              <button className="p-1 px-3 hover:bg-slate-50 rounded text-[10px] font-bold font-label transition-colors text-slate-900">2</button>
              <button className="p-1 px-3 hover:bg-slate-50 rounded text-[10px] font-bold font-label transition-colors text-slate-900">3</button>
              <button className="p-1 px-3 hover:bg-slate-50 rounded text-[10px] font-bold font-label transition-colors text-slate-900">NEXT</button>
            </div>
            <div className="text-[10px] font-label text-[#4c4354] uppercase">
              Page 1 of 61 — Displaying 15 per page
            </div>
          </div>
        </section>

        {/* Bottom Intelligence Grid */}
        <section className="grid grid-cols-12 gap-6">
          {/* User Growth Mini Chart Area */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Account Velocity</h3>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9234eb]"></span>
                <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              </div>
            </div>
            <div className="h-24 flex items-end gap-1">
              {[40, 65, 50, 85, 30, 45, 60, 75, 90, 55, 40, 25].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm ${h >= 85 ? 'bg-[#9234eb] shadow-[0_0_12px_rgba(146,52,235,0.2)]' : 'bg-[#9234eb]/10'}`} 
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <span className="text-[9px] font-label text-[#4c4354] uppercase tracking-tighter">00:00 UTC</span>
              <span className="text-[9px] font-label text-[#4c4354] uppercase tracking-tighter">12:00 UTC</span>
              <span className="text-[9px] font-label text-[#4c4354] uppercase tracking-tighter">NOW</span>
            </div>
          </div>

          {/* Recent Audit Snippet */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-5 border border-[#9234eb]/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Security Stream</h3>
            <div className="space-y-4">
              <div className="flex gap-3 text-slate-900">
                <span className="material-symbols-outlined text-xs text-[#4edea3]" data-icon="policy">policy</span>
                <div className="flex flex-col">
                  <p className="text-[11px] font-medium leading-tight">IP_RESTRICTION_BYPASS_TRY</p>
                  <p className="text-[9px] text-[#4c4354] font-label uppercase">WL-4402 • 1m ago</p>
                </div>
              </div>
              <div className="flex gap-3 text-slate-900">
                <span className="material-symbols-outlined text-xs text-[#9234eb]" data-icon="key">key</span>
                <div className="flex flex-col">
                  <p className="text-[11px] font-medium leading-tight">PASS_ROTATION_SUCCESS</p>
                  <p className="text-[9px] text-[#4c4354] font-label uppercase">WL-1129 • 14m ago</p>
                </div>
              </div>
              <div className="flex gap-3 text-slate-900">
                <span className="material-symbols-outlined text-xs text-[#ffb4ab]" data-icon="gpp_bad">gpp_bad</span>
                <div className="flex flex-col">
                  <p className="text-[11px] font-medium leading-tight">3X_AUTH_FAILURE</p>
                  <p className="text-[9px] text-[#4c4354] font-label uppercase">WL-0098 • 22m ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Confirmation Overlay: Freeze Account */}
      {isFreezeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-[#ffb4ab]/20 overflow-hidden transform scale-100">
            <div className="bg-[#ffb4ab]/10 p-4 border-b border-[#ffb4ab]/20 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ffb4ab]" data-icon="warning">warning</span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#ffb4ab]">System Lockdown Protocol</h2>
            </div>
            <div className="p-6">
              <p className="text-xs mb-4 text-slate-900 leading-relaxed">
                You are about to initiate a <span className="text-[#ffb4ab] font-bold">TOTAL FREEZE</span> on account <code className="bg-slate-50 px-1 py-0.5 rounded text-[#9234eb] font-label">WL-{targetUserId?.substring(0,8).toUpperCase()}</code>.
              </p>
              <div className="space-y-3 bg-slate-50 p-4 rounded mb-6">
                <label className="font-label text-[10px] text-[#4c4354] uppercase">Reason for action</label>
                <select className="w-full bg-white border border-[#4c4354]/30 text-slate-900 text-xs rounded px-2 py-2 focus:ring-[#dcb8ff] focus:border-[#9234eb]">
                  <option>Suspected Fraudulent Activity</option>
                  <option>Compliance Violation (KYC)</option>
                  <option>Owner Request</option>
                  <option>Legal Hold (Court Order)</option>
                </select>
                <div className="flex items-center gap-2 mt-2">
                  <input className="rounded bg-white border-[#4c4354]/30 text-[#9234eb] focus:ring-[#dcb8ff]" type="checkbox" />
                  <span className="text-[10px] text-slate-500 font-label uppercase">Revoke all active sessions immediately</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setFreezeModalOpen(false)}
                  className="flex-1 py-2.5 rounded text-xs font-bold bg-slate-50 hover:bg-[#393939] text-slate-900 transition-colors uppercase"
                >
                  Abort
                </button>
                <button 
                  onClick={handleFreezeConfirm}
                  className="flex-1 py-2.5 rounded text-xs font-bold bg-[#ffb4ab] text-[#690005] shadow-[0_0_8px_rgba(255,180,171,0.3)] transition-all uppercase"
                >
                  Confirm Freeze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
