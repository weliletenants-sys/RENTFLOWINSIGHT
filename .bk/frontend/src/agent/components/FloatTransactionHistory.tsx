import React from 'react';
import { History, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function FloatTransactionHistory() {
  const transactions = [
    { date: '2026-04-06 14:20', type: 'collection', amount: 45000, balance: 845000, desc: 'Cash from Sarah N.' },
    { date: '2026-04-05 09:15', type: 'payout', amount: 800000, balance: 800000, desc: 'Landlord Payout (James O.)' },
    { date: '2026-04-04 16:40', type: 'collection', amount: 150000, balance: 1600000, desc: 'Cash from Brian K.' },
  ];

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <History size={18} className="text-gray-400" /> Float Ledger
        </h3>
        <button className="text-xs bg-gray-50 text-gray-600 font-bold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center gap-1">
          <Download size={14} /> CSV
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((tx, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                tx.type === 'collection' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {tx.type === 'collection' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{tx.desc}</p>
                <p className="text-[10px] text-gray-500 font-medium">{tx.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${tx.type === 'collection' ? 'text-green-600' : 'text-gray-900'}`}>
                {tx.type === 'collection' ? '+' : '-'} UGX {tx.amount.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">Bal: {tx.balance.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
