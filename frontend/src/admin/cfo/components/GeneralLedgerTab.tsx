import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Search, Download, Filter } from 'lucide-react';

export default function GeneralLedgerTab() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [mockLedger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/cfo/ledger')
      .then(res => setLedger(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 font-inter">

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent">
          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search reference ID or detail..." 
                className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-full text-sm font-medium outline-none focus:border-[#6c11d4] focus:ring-1 focus:ring-[#6c11d4] bg-white w-full sm:w-80 shadow-sm transition-all" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
              <Filter size={16} /> Filters
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm font-bold text-[#6c11d4] bg-[#EAE5FF] px-5 py-2.5 rounded-full hover:bg-purple-100 transition-colors shadow-sm">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Filters Strip (mock) */}
        <div className="px-6 py-3 border-b border-slate-100 flex gap-2 overflow-x-auto bg-slate-50/30">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 shadow-sm">Date: Last 7 Days</span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 shadow-sm">Category: All</span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 shadow-sm">Direction: All</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F9F9FB] text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl tracking-wider">Ref ID</th>
                <th className="px-6 py-4 tracking-wider">Date</th>
                <th className="px-6 py-4 tracking-wider">Description</th>
                <th className="px-6 py-4 tracking-wider">Category</th>
                <th className="px-6 py-4 text-center tracking-wider">Direction</th>
                <th className="px-6 py-4 text-right tracking-wider">Amount</th>
                <th className="px-6 py-4 text-right rounded-tr-xl tracking-wider">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockLedger.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-slate-400 bg-slate-50/50">{tx.id}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{tx.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-widest border border-slate-200 shadow-sm">
                      {tx.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tx.direction === 'credit' ? (
                      <span className="text-green-700 font-bold bg-green-50 border border-green-100 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-sm">Credit</span>
                    ) : (
                      <span className="text-red-700 font-bold bg-red-50 border border-red-100 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-sm">Debit</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700">UGX {tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-black font-outfit text-slate-900 bg-slate-50/30">UGX {tx.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
