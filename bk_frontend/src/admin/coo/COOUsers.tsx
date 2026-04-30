import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getGlobalUsers, deleteGlobalUsers } from '../../services/cooApi';
import { Search, Filter, Mail, Phone, Calendar, ShieldCheck, ShieldAlert, Lock, Unlock, User, Trash2 } from 'lucide-react';

const COOUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const observerTarget = useRef<HTMLTableRowElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { 
    data, 
    isLoading, 
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error 
  } = useInfiniteQuery({
    queryKey: ['coo-global-users', searchTerm, roleFilter, statusFilter],
    queryFn: ({ pageParam }) => getGlobalUsers({ pageParam: pageParam as string | null, search: searchTerm, role: roleFilter, status: statusFilter }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: any) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  const users = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page: any) => page.users);
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: deleteGlobalUsers,
    onSuccess: () => {
      setSelectedUserIds([]);
      queryClient.invalidateQueries({ queryKey: ['coo-global-users'] });
    }
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(users.map((u: any) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedUserIds(prev => [...prev, id]);
    } else {
      setSelectedUserIds(prev => prev.filter(userId => userId !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUserIds.length} users? This cannot be undone.`)) {
      deleteMutation.mutate(selectedUserIds);
    }
  };

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && users.length === 0) {
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
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0 transition-all">
        {selectedUserIds.length > 0 ? (
          <div className="flex items-center space-x-4 w-full justify-between bg-red-50 p-4 rounded-xl border border-red-100">
            <div>
              <h2 className="text-xl font-bold text-red-700">{selectedUserIds.length} Users Selected</h2>
              <p className="text-red-500 text-sm mt-1">Ready for bulk modification or deletion.</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setSelectedUserIds([])}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSelected}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow disabled:opacity-50 hover:bg-red-700 flex items-center space-x-2 transition-colors"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Global Users</h2>
              <p className="text-slate-500 text-sm mt-1">Directory of all active registered identities across the RentFlow ecosystem.</p>
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

              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck size={16} className="text-slate-400" />
                 </div>
                 <select
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                   className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6c11d4]/20 appearance-none font-inter text-slate-700 cursor-pointer"
                 >
                   <option value="ALL">All Statuses</option>
                   <option value="VERIFIED">Verified</option>
                   <option value="PENDING">Unverified</option>
                 </select>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col min-h-0 relative">
        <div className="overflow-x-auto flex-1 h-full">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
              <tr>
                <th className="py-4 px-4 border-b border-slate-100 w-12">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-[#6c11d4] focus:ring-[#6c11d4]"
                    checked={users.length > 0 && selectedUserIds.length === users.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Identity</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Contact Trace</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Role Authority</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Registration</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Security Lock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user: any) => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedUserIds.includes(user.id) ? 'bg-[#6c11d4]/5' : ''}`}
                  onClick={() => navigate(`/coo/users/${user.id}`)}
                >
                  <td className="py-4 px-4 font-inter" onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-[#6c11d4] focus:ring-[#6c11d4]"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={(e) => handleSelectOne(e, user.id)}
                    />
                  </td>
                  <td className="py-4 px-4 font-inter">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                         <User size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.full_name || 'Anonymous User'}</div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          {user.verified ? <ShieldCheck size={12} className="text-emerald-500" /> : <ShieldAlert size={12} className="text-orange-400" />}
                          {user.verified ? 'Verified Account' : 'Unverified'}
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
              
              {/* Intersection Observer target div */}
              {hasNextPage && (
                <tr ref={observerTarget}>
                  <td colSpan={5} className="py-6 text-center">
                    {isFetchingNextPage ? (
                      <div className="inline-flex items-center justify-center space-x-2 text-slate-400">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-[#6c11d4] animate-spin" />
                        <span className="text-sm font-inter">Loading more identities...</span>
                      </div>
                    ) : (
                      <div className="h-6" /> // spacer
                    )}
                  </td>
                </tr>
              )}
              
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-inter">
                    No users matched your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default COOUsers;
