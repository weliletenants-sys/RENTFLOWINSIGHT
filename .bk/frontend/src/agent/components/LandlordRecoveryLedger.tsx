import React from 'react';
import { Download, Share2, ClipboardList } from 'lucide-react';

export default function LandlordRecoveryLedger() {
  const ledgerEntries = [
    { date: '2026-04-05', narration: 'Rent Recovery: T-882 (Jan)', type: 'credit', amount: 350000 },
    { date: '2026-04-01', narration: 'Payout to Landlord Wallet', type: 'debit', amount: 800000 },
    { date: '2026-03-25', narration: 'Rent Recovery: T-711 (Dec)', type: 'credit', amount: 450000 },
  ];

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 mt-4">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList size={18} className="text-emerald-600" /> Recovery Ledger
        </h3>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Share2 size={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {ledgerEntries.map((entry, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">{entry.date}</p>
              <p className="text-sm font-bold text-gray-800">{entry.narration}</p>
            </div>
            <div className={`font-bold ${entry.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
              {entry.type === 'credit' ? '+' : '-'} UGX {entry.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
