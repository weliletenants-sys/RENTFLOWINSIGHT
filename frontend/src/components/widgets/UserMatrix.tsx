import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function UserMatrixWidget() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [mfaToken, setMfaToken] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://localhost:3000/api/superadmin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch systems users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImpersonate = (user: any) => {
    toast(`Impersonating ${user.name}...`, { icon: '🎭' });
    setActionMenuOpen(null);
  };

  const executeRoleAssign = () => {
    if (!mfaToken) return;
    toast.success('Role assigned securely.');
    setShowRoleModal(false);
    setMfaToken('');
  };

  const executeDelete = () => {
    if (deleteConfirm !== 'DELETE') return;
    toast.success('Account destroyed.');
    setShowDeleteModal(false);
    setDeleteConfirm('');
  };

  return (
    <div className="col-span-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
      
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight mb-1">User Matrix</h2>
        <p className="text-on-surface-variant font-body text-sm">Manage global authorization, override roles, and audit access logs across all tiers.</p>
      </div>

      {/* Top Bar: Search */}
      <div className="relative w-full shadow-sm rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container-low transition-shadow focus-within:shadow-md focus-within:border-primary/30">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-3 bg-transparent border-none text-on-surface placeholder-on-surface-variant focus:ring-0 sm:text-sm outline-none font-medium"
          placeholder="Search identity by name, email, or system ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-xl border border-outline-variant/10 overflow-visible">
        <table className="min-w-full divide-y divide-outline-variant/10">
          <thead className="bg-surface-container-low">
            <tr>
              <th scope="col" className="px-6 py-4 text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Identity</th>
              <th scope="col" className="px-6 py-4 text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Access Level</th>
              <th scope="col" className="px-6 py-4 text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">System Status</th>
              <th scope="col" className="px-6 py-4 text-right font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Governance</th>
            </tr>
          </thead>
          <tbody className="bg-surface-container-lowest divide-y divide-outline-variant/10">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm font-medium text-on-surface-variant">
                  Authenticating and establishing link...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm font-medium text-on-surface-variant">
                  No identities found matching the query.
                </td>
              </tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-headline font-bold text-on-surface">{user.name}</span>
                    <span className="text-xs font-semibold text-on-surface-variant mt-0.5">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-primary-container/20 text-on-secondary-container">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-error-container text-on-error-container'}`}>
                    {user.status === 'Frozen' && <span className="material-symbols-outlined text-[14px]">ac_unit</span>}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button 
                    onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                    className="text-on-surface-variant hover:text-primary hover:bg-surface-container p-2 rounded-lg transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>

                  {/* Dropdown Menu */}
                  {actionMenuOpen === user.id && (
                    <div ref={menuRef} className="absolute right-8 top-10 mt-2 w-56 rounded-xl shadow-lg bg-surface-container-lowest border border-outline-variant/20 z-50 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200">
                      <div className="py-1">
                        <button onClick={() => { setSelectedUser(user); setShowRoleModal(true); setActionMenuOpen(null); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-3 transition-colors">
                          <span className="material-symbols-outlined text-lg text-primary">admin_panel_settings</span>
                          Assign Role
                        </button>
                        <button onClick={() => handleImpersonate(user)} className="w-full text-left px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-3 transition-colors">
                          <span className="material-symbols-outlined text-lg text-primary">gpp_bad</span>
                          Impersonate User
                        </button>
                      </div>
                      <div className="h-px bg-outline-variant/10 w-full" />
                      <div className="py-1 bg-error-container/5">
                        <button onClick={() => { setSelectedUser(user); setShowDeleteModal(true); setActionMenuOpen(null); }} className="w-full text-left px-4 py-3 text-sm font-bold text-error hover:bg-error-container/40 flex items-center gap-3 transition-colors">
                          <span className="material-symbols-outlined text-lg">dangerous</span>
                          Delete / Freeze
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Assignment Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-8 shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">admin_panel_settings</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface">Assign Role</h3>
            </div>
            <p className="text-sm font-medium text-on-surface-variant mb-8 leading-relaxed">
              Modifying root access for <strong className="text-on-surface">{selectedUser.name}</strong>. Provide your MFA token to confirm identity escalation.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">New Access Level</label>
                <div className="relative cursor-pointer">
                  <select className="appearance-none w-full p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl text-on-surface font-semibold focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer">
                    <option>CEO</option>
                    <option>COO</option>
                    <option>CFO</option>
                    <option>CTO</option>
                    <option>MANAGER</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Admin PIN / MFA</label>
                <input 
                  type="password" 
                  value={mfaToken}
                  onChange={(e) => setMfaToken(e.target.value)}
                  className="w-full p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary font-mono tracking-widest text-xl text-center text-on-surface transition-all placeholder:font-sans placeholder:text-sm placeholder:tracking-normal"
                  placeholder="Enter 6-digit MFA"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowRoleModal(false)} className="flex-1 py-4 px-4 bg-surface-container-low hover:bg-surface-container text-on-surface font-bold rounded-xl text-sm transition-colors active:scale-95">
                  Cancel
                </button>
                <button onClick={executeRoleAssign} disabled={!mfaToken} className="flex-1 py-4 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/20 active:scale-95 flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-error-container/10 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-error/30 animate-in zoom-in-95 duration-200 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-error" style={{fontVariationSettings: "'FILL' 1"}}>person_remove</span>
              </div>
              <h3 className="text-2xl font-headline font-extrabold text-error">Destroy Account</h3>
            </div>
            
            <p className="text-center text-sm font-medium text-on-error-container leading-relaxed mb-8">
              This action severs all database links. To definitively erase records for <strong className="text-white">{selectedUser.name}</strong>, type <span className="font-mono bg-error text-white px-2 py-1 rounded-md font-bold text-xs mx-1">DELETE</span> below.
            </p>
            
            <input 
              type="text" 
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full p-4 bg-black/40 border border-error/50 rounded-xl outline-none focus:ring-2 focus:ring-error font-mono text-center text-error uppercase mb-8 tracking-widest font-bold placeholder:text-error/30"
              placeholder="TYPE DELETE"
            />

            <div className="flex flex-col-reverse sm:flex-row gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors active:scale-95">
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                disabled={deleteConfirm !== 'DELETE'} 
                className="flex-1 py-4 px-4 bg-error hover:bg-error/90 disabled:opacity-40 disabled:hover:bg-error text-white font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">skull</span>
                Destroy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
