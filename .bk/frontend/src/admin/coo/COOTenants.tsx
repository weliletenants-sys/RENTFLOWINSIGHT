import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, User, MapPin, Phone, ShieldCheck, UserCheck, Loader2, AlertTriangle } from 'lucide-react';
import { fetchTenants } from '../../services/cooApi';

interface SubscriptionCharge {
  id: string;
  user_id: string;
  tenantName: string;
  tenantPhone: string;
  amount: number;
  status: string;
  created_at: string;
}

const COOTenants: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState<SubscriptionCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const data = await fetchTenants();
        setTenants(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTenants();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading property and tenant metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Tenants</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-inter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm text-slate-500">Monitor tenant payments, property assignments, and field agent mapping.</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
           <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex-1 sm:flex-none justify-center">
              <Filter size={16} className="text-slate-400" />
              <span>Filters</span>
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tenants by name, unit, or property..." 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-[#6c11d4] focus:ring-1 focus:ring-[#6c11d4] transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <span className="px-3 py-1 bg-[#EAE5FF] text-[#6c11d4] text-xs font-bold rounded-full whitespace-nowrap cursor-pointer hover:bg-purple-100">All Charges</span>
            <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full whitespace-nowrap cursor-pointer hover:bg-slate-50">Overdue ({tenants.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6">Tenant Name</th>
                <th className="p-4">Charge / Property ID</th>
                <th className="p-4">Assigned Agent</th>
                <th className="p-4">Rent Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((charge) => (
                <tr key={charge.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 uppercase text-xs">{charge.tenantName}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5"><Phone size={10} className="mr-1" /> {charge.tenantPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-[10px] font-mono text-slate-700 uppercase">{charge.id.split('-')[0]}</p>
                    <p className="text-xs text-slate-500 flex items-center mt-0.5"><MapPin size={10} className="mr-1" /> Unassigned</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                       <div className="w-6 h-6 rounded-full bg-[#EAE5FF] text-[#6c11d4] flex items-center justify-center text-[10px] font-bold">
                         A
                       </div>
                       <span className="text-sm font-medium text-slate-600">Auto-Billed</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex flex-col items-start space-y-1">
                        <span className="text-sm font-bold text-slate-800">UGX {charge.amount.toLocaleString()}</span>
                        {charge.status === 'PAID' && <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-md flex items-center"><ShieldCheck size={10} className="mr-1"/> Paid</span>}
                        {charge.status === 'PENDING' && <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-md flex items-center"><UserCheck size={10} className="mr-1"/> Pending</span>}
                        {charge.status === 'FAILED' && <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-md flex items-center">Overdue</span>}
                     </div>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button className="p-2 text-slate-400 hover:text-[#6c11d4] hover:bg-[#EAE5FF] rounded-full transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {tenants.length === 0 && (
                <tr>
                   <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No tenants or charges match the filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default COOTenants;
