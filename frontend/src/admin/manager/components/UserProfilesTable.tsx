import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { Search, ChevronLeft, ChevronRight, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserProfilesTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce logic for search query mapping
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset pagination on new search trap
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const { data: response, isLoading } = useQuery({
    queryKey: ['manager_users', page, limit, debouncedSearch],
    queryFn: () => managerApi.getAllUsers({ page, limit, search: debouncedSearch })
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => managerApi.updateUserRole(id, role),
    onSuccess: () => {
      toast.success('User clearance updated via API pipeline.');
      queryClient.invalidateQueries({ queryKey: ['manager_users'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to execute Role shift.');
    }
  });

  const availableRoles = ['tenant', 'landlord', 'agent', 'supporter', 'MANAGER', 'operations', 'employee'];

  if (isLoading) {
    return <div className="animate-pulse bg-white h-96 rounded-xl border border-gray-200"></div>;
  }

  const users = response?.data || [];
  const meta = response?.meta || { has_next: false, has_previous: false, total_pages: 1 };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-inter">
      {/* Table Header Toolkit Map */}
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserCog className="text-blue-600" />
          <h3 className="font-bold text-gray-900 tracking-tight">Access Control Matrix</h3>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Primary Users Matrix */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#f8fafc] border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Contact Logic</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Clearance Level (RBAC)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No profiles matched your specific query parameters.
                </td>
              </tr>
            ) : users.map((u: any) => (
              <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{u.full_name || 'Anonymous User'}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {u.id.substring(0, 8)}...</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-600 font-medium">{u.phone}</div>
                  {u.email && <div className="text-xs text-gray-500">{u.email}</div>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.status || 'ACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end">
                  {/* Inline Role Toggle Injection */}
                  <select
                    value={u.role || 'tenant'}
                    onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value })}
                    disabled={roleMutation.isPending && roleMutation.variables?.id === u.id}
                    className={`block w-40 text-sm font-bold border rounded-lg px-3 py-1.5 focus:outline-none transition-colors ${
                      u.role === 'SUPER_ADMIN' 
                        ? 'bg-slate-900 text-white border-transparent cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  >
                    {u.role === 'SUPER_ADMIN' ? (
                      <option value="SUPER_ADMIN">ROOT ADMIN</option>
                    ) : (
                      availableRoles.map(r => (
                        <option key={r} value={r}>{r.toUpperCase().replace('_', ' ')}</option>
                      ))
                    )}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Strip mapping directly to API.md meta format */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing page <span className="font-bold text-gray-900">{meta.page_number}</span> of <span className="font-bold text-gray-900">{meta.total_pages}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!meta.has_previous}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={!meta.has_next}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
