import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';

export default function IdentityAccess() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('CEO');
  const [assigning, setAssigning] = useState(false); // New state for assigning

  const fetchUsers = async () => { // Renamed to fetchUsers for clarity, but the logic is from the snippet's useEffect
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const response = await axios.get((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/superadmin/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(response.data); // Changed res.data to response.data
    } catch (err) {
      console.error('Failed to fetch executives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAssignRole = async (e: React.FormEvent) => { // Renamed from handleCreateExec to handleAssignRole
    e.preventDefault(); // Added preventDefault
    const targetUser = users.find(u => u.email === formEmail);
    if (!targetUser) {
      alert('Error: Account with this email does not exist in the platform yet. They must register as a standard user first before promotion.');
      return;
    }
    try {
      setAssigning(true); // Set assigning state
      const token = localStorage.getItem('access_token') || localStorage.getItem('token'); // Updated token retrieval
      await axios.post((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/superadmin/assign-role', {
        targetUserId: targetUser.id,
        newRole: formRole,
        reason: 'Automated Executive Promotion via Identity Matrix'
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Success: ${targetUser.email} promoted to ${formRole}`);
      fetchUsers(); // Refresh the table
    } catch (err) {
      console.error('Failed to promote executive:', err);
      alert('Error: Promotion failed.');
    }
  };

  const executives = users.filter(u => ['CEO','CFO','COO','CTO','SUPER_ADMIN'].includes(u.role));

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        
        {/* Breadcrumbs & Title */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] font-label text-slate-500 uppercase tracking-widest">
            <span>Root</span>
            <span className="material-symbols-outlined text-[10px]" data-icon="chevron_right">chevron_right</span>
            <span className="text-[#9234eb]">Identity & Access</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Executive Provisioning</h2>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Section 1: Create Executive Account Form */}
          <section className="col-span-12 xl:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <span className="material-symbols-outlined text-6xl" data-icon="person_add">person_add</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9234eb] text-lg" data-icon="shield_person">shield_person</span>
                Initialize New Identity
              </h3>
              
              <form onSubmit={handleAssignRole} className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <label className="font-label text-[10px] uppercase text-slate-500 tracking-wider">Full Name</label>
                  <input 
                    className="w-full bg-slate-50 border-none ring-1 ring-[#4c4354]/20 focus:ring-[#dcb8ff] text-sm p-3 rounded-lg placeholder:text-[#353535] text-slate-900 transition-all outline-none" 
                    placeholder="e.g. Alexander Vance" 
                    type="text" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="font-label text-[10px] uppercase text-slate-500 tracking-wider">Executive Email</label>
                  <div className="relative">
                    <input 
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-slate-50 border-none ring-1 ring-[#4c4354]/20 focus:ring-[#dcb8ff] text-sm p-3 rounded-lg placeholder:text-[#353535] text-slate-900 transition-all outline-none" 
                      placeholder="cfo@welile.com" 
                      type="email" 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40 text-slate-500">
                      <span className="text-[10px] font-label uppercase">Auto-Suggest</span>
                      <span className="material-symbols-outlined text-xs" data-icon="magic_button">magic_button</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-label text-[10px] uppercase text-slate-500 tracking-wider">Access Hierarchy (Role)</label>
                  <select 
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-slate-50 border-none ring-1 ring-[#4c4354]/20 focus:ring-[#dcb8ff] text-sm p-3 rounded-lg text-slate-900 appearance-none transition-all outline-none cursor-pointer"
                  >
                    <option value="CEO">CEO - Chief Executive Officer</option>
                    <option value="CFO">CFO - Chief Financial Officer</option>
                    <option value="COO">COO - Chief Operating Officer</option>
                    <option value="CTO">CTO - Chief Technology Officer</option>
                    <option value="SUPER_ADMIN">SUPER ADMIN - Absolute Root</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                type="submit"
                disabled={assigning}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                  assigning 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#9234eb] text-white hover:brightness-110 focus:ring-[#dcb8ff] shadow-[0_10px_20px_rgba(146,52,235,0.2)]'
                }`}
              >
                {assigning ? 'Provisioning Executive...' : 'Complete Provisioning'}
              </button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-[#93000a]/10 border-l-4 border-[#ffb4ab] rounded-r-lg relative z-10">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-sm" data-icon="warning">warning</span>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-[#ffb4ab] uppercase">Security Protocol Warning</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Granting high-privilege system access. Actions are logged via Audit Intelligence Node 04.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: System Identities Table */}
          <section className="col-span-12 xl:col-span-8">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-2xl">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900">Active Executive Matrix</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-50 rounded text-slate-500 transition-colors">
                    <span className="material-symbols-outlined text-sm" data-icon="filter_list">filter_list</span>
                  </button>
                  <button className="p-2 hover:bg-slate-50 rounded text-slate-500 transition-colors">
                    <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50">
                    <tr className="font-label text-[10px] uppercase tracking-widest text-slate-500">
                      <th className="px-6 py-4 font-medium">Identity</th>
                      <th className="px-6 py-4 font-medium">Role Configuration</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Access Log</th>
                      <th className="px-6 py-4 font-medium text-right">Directives</th>
                    </tr>
                  </thead>
                  <tbody className="font-label text-xs divide-y divide-[#4c4354]/5">
                    
                    {loading ? (
                       <tr><td colSpan={5} className="px-6 py-6 text-center text-slate-500 uppercase">Loading Executives...</td></tr>
                    ) : executives.map((exec, i) => (
                      <tr key={exec.id} className={`group hover:bg-slate-50 transition-colors ${i % 2 === 1 ? 'bg-slate-50/10' : ''} ${exec.status === 'Frozen' ? 'bg-[#93000a]/5' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-bold">{exec.first_name ? `${exec.first_name} ${exec.last_name || ''}` : `Ex. ID: ${exec.id.substring(0,8)}`}</span>
                            <span className="text-[10px] text-slate-500">{exec.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded border font-bold ${
                            exec.role === 'SUPER_ADMIN' ? 'bg-[#9234eb]/10 text-[#9234eb] border-[#9234eb]/20' : 
                            'bg-[#8354b4]/20 text-[#9234eb] border-[#9234eb]/20'
                          }`}>
                            {exec.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${exec.status === 'Frozen' ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'} shadow-[0_0_8px_rgba(78,222,163,0.3)]`}></div>
                            <span className={`${exec.status === 'Frozen' ? 'text-[#ffb4ab]' : 'text-[#4edea3]'} uppercase text-[10px] font-bold`}>{exec.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-slate-900">Live Backend Object</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Verified DB Entity</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:text-[#9234eb] text-slate-500 transition-colors" title="Reset Access">
                              <span className="material-symbols-outlined text-lg" data-icon="key">key</span>
                            </button>
                            <button className="p-2 hover:text-[#ffb4ab] text-slate-500 transition-colors" title="Suspend">
                              <span className="material-symbols-outlined text-lg" data-icon="block">block</span>
                            </button>
                            <button className="p-2 hover:text-slate-900 text-slate-500 transition-colors" title="More">
                              <span className="material-symbols-outlined text-lg" data-icon="more_vert">more_vert</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between font-label text-[10px] uppercase tracking-wider text-slate-500">
                <span>Showing {executives.length} Executive Entitlements</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-white border border-[#4c4354]/20 rounded disabled:opacity-30" disabled>Previous</button>
                  <button className="px-3 py-1 bg-white border border-[#4c4354]/20 rounded hover:bg-slate-50 transition-colors text-slate-900">Next</button>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Dashboard Stats Layer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-lg group hover:border-[#4c4354]/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#9234eb]/10 flex items-center justify-center transition-colors group-hover:bg-[#9234eb]/10">
              <span className="material-symbols-outlined text-[#9234eb]" data-icon="verified_user">verified_user</span>
            </div>
            <div>
              <p className="text-[10px] font-label uppercase text-slate-500">Privileged Roles</p>
              <p className="text-xl font-black text-slate-900">04</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-lg group hover:border-[#4c4354]/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#00a572]/10 flex items-center justify-center transition-colors group-hover:bg-[#00a572]/20">
              <span className="material-symbols-outlined text-[#4edea3]" data-icon="security">security</span>
            </div>
            <div>
              <p className="text-[10px] font-label uppercase text-slate-500">Security Tier</p>
              <p className="text-xl font-black text-slate-900">L3-ALPHA</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-lg group hover:border-[#4c4354]/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#8354b4]/10 flex items-center justify-center transition-colors group-hover:bg-[#8354b4]/20">
              <span className="material-symbols-outlined text-[#9234eb]" data-icon="cloud_sync">cloud_sync</span>
            </div>
            <div>
              <p className="text-[10px] font-label uppercase text-slate-500">Matrix Sync</p>
              <p className="text-xl font-black text-slate-900">100% Verified</p>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
