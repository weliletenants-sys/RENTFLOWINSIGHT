import React from 'react';
import { Search, Download, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

interface ReconciliationTabProps {
  reconciliationData: any;
}

export default function ReconciliationTab({ reconciliationData }: ReconciliationTabProps) {
  // STRICT PRISMA DATA ENFORCEMENT: Fallback to zeroes to prevent mock visual leaks
  const data = reconciliationData?.summary ? reconciliationData : {
    summary: { totalUsers: 0, matched: 0, mismatched: 0, totalGap: 0 },
    results: []
  };

  return (
    <div className="space-y-6 font-inter">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors">
          <p className="text-sm font-bold text-slate-500 mb-2">Users Evaluated</p>
          <h3 className="text-4xl font-black font-outfit text-slate-900">{data.summary.totalUsers}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:bg-green-50 transition-colors">
          <p className="text-sm font-bold text-green-600 mb-2">Matched Securely</p>
          <h3 className="text-4xl font-black font-outfit text-green-600">{data.summary.matched}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border-2 border-red-50 shadow-sm relative overflow-hidden hover:bg-red-50 transition-colors">
          <p className="text-sm font-bold text-red-500 mb-2">Mismatched Errors</p>
          <h3 className="text-4xl font-black font-outfit text-red-600 relative z-10">{data.summary.mismatched}</h3>
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full -mr-4 -mt-4 opacity-50 z-0"></div>
        </div>
        <div className="bg-[#EAE5FF] p-6 rounded-3xl shadow-sm border border-purple-100 hover:bg-[#d8cfff] transition-colors">
          <p className="text-sm font-bold text-[#6c11d4] mb-2">Total Gap Risk</p>
          <h3 className="text-3xl font-black font-outfit text-[#6c11d4]">UGX {data.summary.totalGap.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-transparent">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search users or phones" className="pl-11 pr-4 py-2 border border-slate-200 rounded-full text-sm font-medium outline-none focus:border-[#6c11d4] focus:ring-1 focus:ring-[#6c11d4] bg-white w-64 md:w-80 shadow-sm transition-all" />
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F9F9FB] text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl tracking-wider">User</th>
                <th className="px-6 py-4 tracking-wider">Phone</th>
                <th className="px-6 py-4 text-right tracking-wider">Wallet Balance</th>
                <th className="px-6 py-4 text-right tracking-wider">Ledger Balance</th>
                <th className="px-6 py-4 text-right rounded-tr-xl tracking-wider">Gap Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.results && data.results.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">No reconciliation data available.</td>
                </tr>
              )}
              {data.results?.map((r: any, idx: number) => {
                const isMatched = r.status === 'Matched';
                return (
                  <tr key={idx} className={`hover:bg-slate-50 transition-colors ${!isMatched ? 'bg-red-50/20' : ''}`}>
                    <td className="px-6 py-4 font-bold text-slate-900">{r.name}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{r.phone}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700">UGX {Number(r.wallet_balance || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700">UGX {Number(r.ledger_balance || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      {isMatched ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700">
                          <CheckCircle2 size={14} /> Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                          <AlertTriangle size={14} /> Gap: {r.gap}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
