import React from 'react';
import { X, Briefcase, TrendingUp } from 'lucide-react';

interface AgentPartnerDashboardSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentPartnerDashboardSheet({ isOpen, onClose }: AgentPartnerDashboardSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-50 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Partner Dashboard</h2>
              <p className="text-xs text-gray-500">Manage proxy investments</p>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
            <p className="text-xs font-medium text-indigo-200 mb-1">Total Managed Capital</p>
            <div className="text-3xl font-black mb-4">UGX 15,400,000</div>
            <div className="flex justify-between items-center text-xs font-bold bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
              <span className="flex items-center gap-1"><TrendingUp size={14} className="text-green-300" /> Active ROI</span>
              <span>Across 4 Portfolios</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              Invest for Partner
            </button>
            <button className="flex-1 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
