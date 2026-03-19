import React, { useState } from 'react';
import { Search, Filter, MoreVertical, User, MapPin, Phone, ShieldCheck, UserCheck } from 'lucide-react';

const mockTenants = [
  { id: 'TNT-001', name: 'John Doe', property: 'Sunrise Apartments', unit: 'Unit 4B', phone: '+256 701 234567', agentName: 'Sarah Jenkins', agentAvatar: 'S', status: 'Paid', amount: 'UGX 850,000' },
  { id: 'TNT-002', name: 'Alice Smith', property: 'Lakeside Villas', unit: 'Villa 12', phone: '+256 772 987654', agentName: 'Michael Opio', agentAvatar: 'M', status: 'Pending', amount: 'UGX 1,200,000' },
  { id: 'TNT-003', name: 'Robert Kiyemba', property: 'Downtown Heights', unit: 'Apt 204C', phone: '+256 754 112233', agentName: 'Sarah Jenkins', agentAvatar: 'S', status: 'Overdue', amount: 'UGX 600,000' },
  { id: 'TNT-004', name: 'Diana Namukwaya', property: 'Pearl Residences', unit: 'Block A, 14', phone: '+256 788 554433', agentName: 'David Kintu', agentAvatar: 'D', status: 'Paid', amount: 'UGX 950,000' },
  { id: 'TNT-005', name: 'Emmanuel Okello', property: 'Sunrise Apartments', unit: 'Unit 1A', phone: '+256 700 998877', agentName: 'Sarah Jenkins', agentAvatar: 'S', status: 'Paid', amount: 'UGX 850,000' },
  { id: 'TNT-006', name: 'Faith Babirye', property: 'Lakeside Villas', unit: 'Villa 04', phone: '+256 779 665544', agentName: 'Michael Opio', agentAvatar: 'M', status: 'Overdue', amount: 'UGX 1,500,000' },
  { id: 'TNT-007', name: 'Geoffrey Mukasa', property: 'Acacia Plaza', unit: 'Store 4', phone: '+256 755 332211', agentName: 'David Kintu', agentAvatar: 'D', status: 'Pending', amount: 'UGX 2,000,000' }
];

const COOTenants: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF] transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <span className="px-3 py-1 bg-[#EAE5FF] text-[#7B61FF] text-xs font-bold rounded-full whitespace-nowrap cursor-pointer hover:bg-purple-100">All Tenants</span>
            <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full whitespace-nowrap cursor-pointer hover:bg-slate-50">Overdue (2)</span>
            <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full whitespace-nowrap cursor-pointer hover:bg-slate-50">Pending</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6">Tenant Info</th>
                <th className="p-4">Property / Unit</th>
                <th className="p-4">Assigned Agent</th>
                <th className="p-4">Rent Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{tenant.name}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5"><Phone size={10} className="mr-1" /> {tenant.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-700">{tenant.property}</p>
                    <p className="text-xs text-slate-500 flex items-center mt-0.5"><MapPin size={10} className="mr-1" /> {tenant.unit}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                       <div className="w-6 h-6 rounded-full bg-[#EAE5FF] text-[#7B61FF] flex items-center justify-center text-[10px] font-bold">
                         {tenant.agentAvatar}
                       </div>
                       <span className="text-sm font-medium text-slate-600">{tenant.agentName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex flex-col items-start space-y-1">
                        <span className="text-sm font-bold text-slate-800">{tenant.amount}</span>
                        {tenant.status === 'Paid' && <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-md flex items-center"><ShieldCheck size={10} className="mr-1"/> Paid</span>}
                        {tenant.status === 'Pending' && <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-md flex items-center"><UserCheck size={10} className="mr-1"/> Pending</span>}
                        {tenant.status === 'Overdue' && <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-md">Overdue</span>}
                     </div>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button className="p-2 text-slate-400 hover:text-[#7B61FF] hover:bg-[#EAE5FF] rounded-full transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Mock */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <span>Showing 1 to 7 of 1,245 tenants</span>
          <div className="flex space-x-1">
             <button className="px-3 py-1 border border-slate-200 rounded-md bg-white text-slate-400 cursor-not-allowed">Prev</button>
             <button className="px-3 py-1 border border-[#7B61FF] rounded-md bg-[#7B61FF] text-white font-bold">1</button>
             <button className="px-3 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50">2</button>
             <button className="px-3 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50">...</button>
             <button className="px-3 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default COOTenants;
