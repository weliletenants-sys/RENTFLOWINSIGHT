import React from 'react';
import { Search, MapPin, TrendingUp, Smartphone, CreditCard, Banknote } from 'lucide-react';

const mockCollections = [
  { id: 1, agent: 'Okwalinga Peter', collected: '1,250,000', visits: 45, floatBefore: '100,000', floatAfter: '1,350,000', methods: { mobile: 70, cash: 30, bank: 0 } },
  { id: 2, agent: 'Ainembabazi J.', collected: '890,000', visits: 62, floatBefore: '500,000', floatAfter: '1,390,000', methods: { mobile: 85, cash: 15, bank: 0 } },
  { id: 3, agent: 'Lule Francis', collected: '2,100,000', visits: 38, floatBefore: '50,000', floatAfter: '2,150,000', methods: { mobile: 40, cash: 10, bank: 50 } },
  { id: 4, agent: 'Kato Paul', collected: '450,000', visits: 12, floatBefore: '20,000', floatAfter: '470,000', methods: { mobile: 100, cash: 0, bank: 0 } },
];

const COOCollections: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-800">Agent Collections</h2>
          <p className="text-sm text-slate-500">Daily reconciliation and performance tracking</p>
        </div>
        <div className="flex space-x-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 font-bold uppercase">Total Today</p>
            <p className="text-xl font-bold text-[#7B61FF]">UGX 4.69M</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9234EA] focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Agent</th>
                <th className="p-4 font-semibold">Amount Collected</th>
                <th className="p-4 font-semibold">Payment Methods</th>
                <th className="p-4 font-semibold">Float Status (Escrow)</th>
                <th className="p-4 font-semibold">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DBFC]">
              {mockCollections.map((col) => (
                <tr key={col.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{col.agent}</p>
                    <p className="text-xs text-slate-500 flex items-center mt-1">
                      <MapPin size={12} className="mr-1" /> Field Operation
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#7B61FF] text-lg">UGX {col.collected}</p>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {col.methods.mobile > 0 && (
                         <div className="flex items-center text-xs text-slate-600">
                           <Smartphone size={12} className="mr-2 text-yellow-500" /> {col.methods.mobile}% Mobile
                         </div>
                      )}
                      {col.methods.cash > 0 && (
                         <div className="flex items-center text-xs text-slate-600">
                           <Banknote size={12} className="mr-2 text-green-500" /> {col.methods.cash}% Cash
                         </div>
                      )}
                      {col.methods.bank > 0 && (
                         <div className="flex items-center text-xs text-slate-600">
                           <CreditCard size={12} className="mr-2 text-blue-500" /> {col.methods.bank}% Bank
                         </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 text-[10px] uppercase font-bold">Start</span>
                        <span className="text-slate-700 font-medium">{col.floatBefore}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-[#7B61FF] text-[10px] uppercase font-bold">Current</span>
                        <span className="text-slate-800 font-bold">{col.floatAfter}</span>
                     </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{col.visits} Visits</span>
                      <span className="text-xs text-green-600 flex items-center mt-1 font-medium">
                        <TrendingUp size={12} className="mr-1" /> High Yield
                      </span>
                    </div>
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

export default COOCollections;
