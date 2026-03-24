import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGlobalUsers } from '../../services/cooApi';
import { Search, Filter, Mail, Phone, Calendar, ShieldCheck, ShieldAlert, Lock, Unlock, User } from 'lucide-react';

const COOUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['coo-global-users'],
    queryFn: getGlobalUsers,
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((u: any) => {
      const matchSearch = (u.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (u.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#6c11d4] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center space-x-4">
        <ShieldAlert size={28} />
        <div>
          <h3 className="font-bold text-lg">Failed to Load User Directory</h3>
          <p className="text-sm opacity-90">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-outfit h-full flex flex-col">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Global Users</h2>
          <p className="text-slate-500 text-sm mt-1">Directory of all {users?.length.toLocaleString() || 0} registered identities across the RentFlow ecosystem.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
             </div>
             <input
               type="text"
               placeholder="Search name, email, phone..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6c11d4]/20 transition-all font-inter"
             />
          </div>
          
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-slate-400" />
             </div>
             <select
               value={roleFilter}
               onChange={(e) => setRoleFilter(e.target.value)}
               className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6c11d4]/20 appearance-none font-inter text-slate-700 cursor-pointer"
             >
               <option value="ALL">All Roles</option>
               <option value="TENANT">Tenants</option>
               <option value="FUNDER">Funders</option>
               <option value="AGENT">Agents</option>
               <option value="SUPPORT">Support Team</option>
               <option value="MANAGER">Managers</option>
               <option value="COO">Executives</option>
             </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 h-full">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
              <tr>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Identity</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Contact Trace</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Role Authority</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Registration</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Security Lock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.slice(0, 100).map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-inter">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                         <User size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.full_name || 'Anonymous User'}</div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          {user.verified ? <ShieldCheck size={12} className="text-emerald-500" /> : <ShieldAlert size={12} className="text-orange-400" />}
                          {user.verified ? 'KYC Verified' : 'Unverified'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-inter">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-slate-600 gap-2">
                        <Mail size={14} className="text-slate-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-slate-600 gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {user.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-inter">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'FUNDER' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'AGENT' ? 'bg-blue-100 text-blue-700' :
                      user.role === 'TENANT' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-inter text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-inter text-right">
                    {user.is_frozen ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">
                        <Lock size={12} />
                        Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold border border-emerald-100">
                        <Unlock size={12} />
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-inter">
                    No users matched your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length > 100 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-inter font-medium shrink-0">
            Showing top 100 results out of {filteredUsers.length.toLocaleString()}. Refine your search to view specific users.
          </div>
        )}
      </div>
    </div>
  );
};

export default COOUsers;
