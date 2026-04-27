import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface AgentTenantRentRequestsListProps {
  tenantId: string;
}

export default function AgentTenantRentRequestsList({ tenantId }: AgentTenantRentRequestsListProps) {
  // Mock data specifically geared toward a single tenant
  const requests = [
    { id: 'RR-1029', amount: 450000, status: 'pending', submitted: '2026-04-06', duration: '3 Months' },
    { id: 'RR-0844', amount: 400000, status: 'approved', submitted: '2025-11-20', duration: '3 Months' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Request History</h3>
      
      {requests.map(req => (
        <div key={req.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm group hover:border-[#512DA8]/30 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-bold text-gray-900 text-lg">UGX {req.amount.toLocaleString()}</div>
              <div className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                <Calendar size={12} /> {req.submitted} • {req.duration}
              </div>
            </div>
            {req.status === 'pending' ? (
              <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <Clock size={12} /> Review
              </span>
            ) : (
              <span className="bg-green-50 text-green-600 border border-green-200 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <CheckCircle size={12} /> Approved
              </span>
            )}
          </div>
          <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-[#512DA8] text-xs font-bold rounded-lg transition-colors">
            View Application Details
          </button>
        </div>
      ))}

      {requests.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <span className="text-sm text-gray-500 font-medium">No prior requests found.</span>
        </div>
      )}
    </div>
  );
}
