import { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, ShieldAlert, AlertTriangle, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SuperAdminUserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [mfaToken, setMfaToken] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dummyUsers = [
    { id: 'usr_1', name: 'John Doe', email: 'john@example.com', role: 'TENANT', status: 'Active' },
    { id: 'usr_2', name: 'Jane Smith', email: 'jane@example.com', role: 'MANAGER', status: 'Active' },
    { id: 'usr_3', name: 'Mike Admin', email: 'mike@example.com', role: 'CEO', status: 'Frozen' },
  ];

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
    <div className="space-y-6">
      
      {/* Top Bar: Search */}
      <div className="relative w-full shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#111827] border-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 sm:text-sm transition-shadow outline-none"
          placeholder="Search by name, email, or user ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-[#111827] shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 overflow-visible">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50/50 dark:bg-gray-800/30">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#111827] divide-y divide-gray-100 dark:divide-gray-800/50">
            {dummyUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex flex-row items-center gap-1.5 text-sm font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-orange-500'}`}>
                    {user.status === 'Frozen' && <AlertTriangle size={14} />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button 
                    onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  {actionMenuOpen === user.id && (
                    <div ref={menuRef} className="absolute right-8 top-10 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-[#1f2937] ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-800 z-50 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200">
                      <div className="py-1">
                        <button onClick={() => { setSelectedUser(user); setShowRoleModal(true); setActionMenuOpen(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                          Assign Role
                        </button>
                        <button onClick={() => handleImpersonate(user)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                          Impersonate User
                        </button>
                      </div>
                      <div className="py-1">
                        <button onClick={() => { setSelectedUser(user); setShowDeleteModal(true); setActionMenuOpen(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Assign Role</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Modifying access for <strong>{selectedUser.name}</strong>. Provide MFA token to confirm.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Access Level</label>
                <select className="w-full p-2.5 bg-gray-50 dark:bg-[#1e2937] border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm">
                  <option>CEO</option>
                  <option>COO</option>
                  <option>CFO</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Admin PIN / MFA</label>
                <input 
                  type="password" 
                  value={mfaToken}
                  onChange={(e) => setMfaToken(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-[#1e2937] border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 font-mono tracking-widest text-lg text-center"
                  placeholder="• • • • • •"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowRoleModal(false)} className="flex-1 py-2.5 px-4 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button onClick={executeRoleAssign} disabled={!mfaToken} className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full p-8 shadow-2xl border border-red-500/20 animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <UserMinus className="w-8 h-8 text-red-600 dark:text-red-500" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Destroy Account</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
              This action cannot be undone. To definitively erase records for <strong>{selectedUser.name}</strong>, type <span className="font-mono bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-1 py-0.5 rounded font-bold">DELETE</span> below.
            </p>
            
            <input 
              type="text" 
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full p-3 bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 font-mono text-center text-red-600 uppercase mb-6"
              placeholder="TYPE DELETE"
            />

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 px-4 bg-white dark:bg-[#1e2937] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button onClick={executeDelete} disabled={deleteConfirm !== 'DELETE'} className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                Confirm Destruction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
