import React from 'react';
import { X, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface AgentMyRentRequestsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentMyRentRequestsSheet({ isOpen, onClose }: AgentMyRentRequestsSheetProps) {
  if (!isOpen) return null;

  // Mock data for display
  const requests = [
    { id: 'RR-1029', tenant: 'Sarah Namukasa', amount: 450000, status: 'pending', date: '2026-04-06' },
    { id: 'RR-1028', tenant: 'James Opolot', amount: 600000, status: 'approved', date: '2026-04-05' },
    { id: 'RR-1025', tenant: 'Brian Katusiime', amount: 350000, status: 'rejected', date: '2026-04-02' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-50 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-[#512DA8]">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">My Rent Requests</h2>
              <p className="text-xs text-gray-500">Track statuses of your clients</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{req.tenant}</h3>
                  <span className="text-xs text-gray-500 font-medium">Ref: {req.id} • {req.date}</span>
                </div>
                {req.status === 'pending' && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock size={12} /> Pending</span>}
                {req.status === 'approved' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Approved</span>}
                {req.status === 'rejected' && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle size={12} /> Rejected</span>}
              </div>
              
              <div className="flex justify-between items-end border-t border-gray-50 pt-3 mt-1">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Amount Facilitated</span>
                  <div className="font-bold text-[#512DA8]">UGX {req.amount.toLocaleString()}</div>
                </div>
                <button className="text-xs font-semibold text-[#512DA8] bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <FileText size={24} />
              </div>
              <h3 className="text-gray-800 font-bold mb-1">No requests yet</h3>
              <p className="text-sm text-gray-500 px-4">Submit a rent request for your tenants to see them tracked here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
