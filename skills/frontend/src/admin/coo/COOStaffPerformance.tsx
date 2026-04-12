import React, { useState } from 'react';
import { Search, MapPin, Users, Briefcase, Award, Shield } from 'lucide-react';

const mockStaff = [
  { id: 'STF-01', name: 'Okwalinga Peter', role: 'Field Agent', dept: 'Central Region', metricTitle: 'MTD Collections', metricValue: 'UGX 45M', status: 'Active' },
  { id: 'STF-02', name: 'Nassali Sarah', role: 'Support Rep', dept: 'Customer Service', metricTitle: 'Tickets Resolved', metricValue: '142', status: 'Active' },
  { id: 'STF-03', name: 'Lule Francis', role: 'Field Agent', dept: 'Central Region', metricTitle: 'MTD Collections', metricValue: 'UGX 28M', status: 'Active' },
  { id: 'STF-04', name: 'Kato Paul', role: 'Finance Analyst', dept: 'Accounting', metricTitle: 'Reconciliations', metricValue: '100% Match', status: 'Active' },
  { id: 'STF-05', name: 'Nansubuga Mary', role: 'Field Manager', dept: 'Eastern Region', metricTitle: 'Region Yield', metricValue: 'UGX 105M', status: 'Inactive' },
];

const COOStaffPerformance: React.FC = () => {
  const [filter, setFilter] = useState('All Roles');

  const filteredStaff = mockStaff.filter(s => filter === 'All Roles' || s.role.includes(filter) || (filter === 'Management' && s.role.includes('Manager')));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-[#6c11d4]">Staff Performance Oversight</h2>
          <p className="text-sm text-slate-500">Cross-functional workforce productivity metrics</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
            <p className="text-xs text-blue-700 font-semibold uppercase">Total Staff</p>
            <p className="text-lg font-bold text-blue-700">145</p>
          </div>
          <div className="bg-[#EAE5FF] p-3 rounded-lg text-center border border-slate-100">
            <p className="text-xs text-[#6c11d4] font-semibold uppercase">Top Performers</p>
            <p className="text-lg font-bold text-[#6c11d4]">12</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search staff by name or ID..."
              className="w-full pl-10 pr-4 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c11d4] focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
            {['All Roles', 'Field Agent', 'Support', 'Management'].map(role => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  filter === role 
                    ? 'bg-[#6c11d4] shadow-sm text-white' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Staff Member</th>
                <th className="p-4 font-semibold">Role & Dept</th>
                <th className="p-4 font-semibold">Primary Metric</th>
                <th className="p-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DBFC]">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{staff.name}</p>
                    <p className="text-xs text-slate-500">{staff.id}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 mb-1">
                      {staff.role.includes('Agent') ? <MapPin size={14} className="text-[#6c11d4]" /> : 
                       staff.role.includes('Manager') ? <Shield size={14} className="text-orange-500" /> :
                       <Briefcase size={14} className="text-blue-500" />}
                      <span className="text-sm font-bold text-slate-700">{staff.role}</span>
                    </div>
                    <span className="text-xs text-slate-500">{staff.dept}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-slate-500 uppercase font-bold">{staff.metricTitle}</p>
                    <p className="text-sm font-bold text-[#6c11d4]">{staff.metricValue}</p>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                      ${staff.status === 'Active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`
                    }>
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No staff members match the selected role filter.
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

export default COOStaffPerformance;
