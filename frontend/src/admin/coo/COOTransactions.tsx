import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

const mockLedger = [
  { id: 'TXN-001', amount: '120,000', direction: 'IN', category: 'Rent Collection', sourceTable: 'payments', linkedParty: 'John Doe (Tenant)', date: '2026-03-19 10:30 AM' },
  { id: 'TXN-002', amount: '5,000,000', direction: 'OUT', category: 'Investor ROI', sourceTable: 'roi_payouts', linkedParty: 'Mbabazi K. (Investor)', date: '2026-03-18 14:15 PM' },
  { id: 'TXN-003', amount: '45,000', direction: 'OUT', category: 'Agent Commission', sourceTable: 'commissions', linkedParty: 'Peter O. (Agent)', date: '2026-03-18 09:00 AM' },
  { id: 'TXN-004', amount: '2,500,000', direction: 'IN', category: 'Capital Deposit', sourceTable: 'deposits', linkedParty: 'Kagimu D. (Investor)', date: '2026-03-17 11:45 AM' },
  { id: 'TXN-005', amount: '15,000', direction: 'OUT', category: 'System Fee', sourceTable: 'fees', linkedParty: 'MTN Mobile Money', date: '2026-03-17 10:32 AM' },
];

const COOTransactions: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filteredData = mockLedger.filter(txn => filter === 'All' || txn.direction === filter);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-800">General Ledger</h2>
          <p className="text-sm text-slate-500">Master record of all system financial movements</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg mr-2">
            {['All', 'IN', 'OUT'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === f 
                    ? 'bg-white shadow-sm text-[#7B61FF]' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center space-x-2 bg-[#EAE5FF] text-[#7B61FF] px-4 py-2 rounded-lg hover:bg-purple-100 transition text-sm font-bold">
            <Download size={16} /> <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by ID, party or category..."
              className="w-full pl-10 pr-4 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9234EA] focus:border-transparent text-sm"
            />
          </div>
          <button className="flex items-center space-x-2 text-slate-600 px-3 py-2 border border-slate-100 rounded-lg hover:bg-slate-50 text-sm font-medium bg-white">
            <Filter size={16} />
            <span className="hidden sm:inline">Advanced Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Transaction ID & Date</th>
                <th className="p-4 font-semibold">Direction & Amount</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Linked Party</th>
                <th className="p-4 font-semibold">Source Table</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DBFC]">
              {filteredData.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{txn.id}</p>
                    <p className="text-xs text-slate-500">{txn.date}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                       <div className={`p-1.5 rounded-full ${txn.direction === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                         {txn.direction === 'IN' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                       </div>
                       <div>
                         <p className={`font-bold ${txn.direction === 'IN' ? 'text-green-700' : 'text-slate-800'}`}>
                           {txn.direction === 'IN' ? '+' : '-'} UGX {txn.amount}
                         </p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {txn.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-800">{txn.linkedParty}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-500 font-mono">
                    {txn.sourceTable}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default COOTransactions;
