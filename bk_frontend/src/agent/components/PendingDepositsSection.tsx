import React from 'react';
import { Wallet, Info, Clock } from 'lucide-react';

export default function PendingDepositsSection() {
  const pendingDeposits = [
    { id: 'DEP-9892', amount: 50000, provider: 'MTN MoMo', time: '10:45 AM', status: 'Verifying' },
    { id: 'DEP-9884', amount: 120000, provider: 'Airtel Money', time: '09:12 AM', status: 'Verifying' }
  ];

  if (pendingDeposits.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Clock size={16} className="text-amber-500" />
        <h3 className="text-sm font-bold text-gray-800">Pending Deposits</h3>
        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
          {pendingDeposits.length}
        </span>
      </div>

      <div className="space-y-3">
        {pendingDeposits.map((dep, idx) => (
          <div key={idx} className="bg-white border border-amber-100 rounded-[1rem] p-3 shadow-sm flex justify-between items-center relative overflow-hidden">
            {/* Soft background color highlight indicating pending state */}
            <div className="absolute inset-y-0 left-0 w-1 bg-amber-400"></div>
            
            <div className="pl-2">
              <div className="text-amber-700 font-bold text-sm">UGX {dep.amount.toLocaleString()}</div>
              <div className="text-[11px] text-gray-500 font-medium tracking-wide mt-0.5">
                {dep.provider} • {dep.time}
              </div>
            </div>
            
            <button className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors">
              <Info size={16} />
            </button>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-2 px-1 text-center font-medium">
        Deposits typically verify within 5-15 minutes.
      </p>
    </div>
  );
}
