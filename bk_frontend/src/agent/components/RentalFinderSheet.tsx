import React from 'react';
import { X, Search, Home as HomeIcon } from 'lucide-react';

interface RentalFinderSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RentalFinderSheet({ isOpen, onClose }: RentalFinderSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-50 w-full max-w-sm h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
        <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Search size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Find Rentals</h2>
              <p className="text-xs text-gray-500">Search system network</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 bg-white border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by area e.g., Ntinda, Bwaise..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300 mb-3 border border-gray-100">
            <HomeIcon size={24} />
          </div>
          <h3 className="text-gray-800 font-bold mb-1">Explore Rentals</h3>
          <p className="text-sm text-gray-500 max-w-[200px]">Agent network listings will appear here after a search.</p>
        </div>
      </div>
    </div>
  );
}
