import React, { useState } from 'react';
import { X, ShieldCheck, CheckSquare, FileText } from 'lucide-react';

interface AgentOpsFloatPayoutReviewProps {
  isOpen: boolean;
  onClose: () => void;
  payoutId: string;
}

export default function AgentOpsFloatPayoutReview({ isOpen, onClose, payoutId }: AgentOpsFloatPayoutReviewProps) {
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[1.5rem] w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#512DA8]" size={20} />
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Ops Review</h2>
              <p className="text-xs text-gray-500 font-medium">Ref: {payoutId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">UGX 800,000</h3>
              <p className="text-xs text-gray-600 font-medium mt-1">Requested by Agent Sarah N. for Landlord James O. physical delivery.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="w-4 h-4 text-[#512DA8] rounded border-gray-300 focus:ring-[#512DA8]" />
              <span className="text-sm font-medium text-gray-800">Verified agent float capacity is sufficient</span>
            </label>
            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="w-4 h-4 text-[#512DA8] rounded border-gray-300 focus:ring-[#512DA8]" />
              <span className="text-sm font-medium text-gray-800">Verified landlord is assigned to this agent</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Ops Remarks (Optional)</label>
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#512DA8] focus:border-transparent transition-all min-h-[80px]"
              placeholder="Add any internal notes here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-3.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">
              Reject
            </button>
            <button className="flex-[2] py-3.5 bg-[#512DA8] text-white font-bold rounded-xl hover:bg-[#4527a0] transition-colors flex items-center justify-center gap-2">
              <CheckSquare size={18} /> Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
