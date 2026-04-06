import React from 'react';
import { RefreshCcw, CheckCircle, Clock } from 'lucide-react';

export default function FloatPayoutStatusTracker() {
  const payouts = [
    { id: 'FP-8812', target: 'Landlord: Sarah N.', amount: 950000, status: 'approved' },
    { id: 'FP-8814', target: 'Self (MTN)', amount: 120000, status: 'pending' },
  ];

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 tracking-wide flex items-center gap-2">
          <RefreshCcw size={16} className="text-blue-500" /> Pending Payouts
        </h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold">{payouts.length} Active</span>
      </div>

      <div className="space-y-3">
        {payouts.map(p => (
          <div key={p.id} className="p-3 border border-gray-100 rounded-xl flex justify-between items-center bg-gray-50">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{p.target}</p>
              <p className="font-extrabold text-gray-900 mt-1">UGX {p.amount.toLocaleString()}</p>
            </div>
            {p.status === 'pending' ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
                <Clock size={14} /> Ops Review
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
                <CheckCircle size={14} /> Ready
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
