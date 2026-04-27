import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, ChevronRight } from 'lucide-react';
import AgentRentRequestDialog from './dialogs/AgentRentRequestDialog';
import AgentMyRentRequestsSheet from './AgentMyRentRequestsSheet';

export default function AgentRentRequestsManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText size={20} className="text-[#512DA8]" />
            Rent Requests
          </h2>
          <p className="text-xs text-gray-500">Manage client rent facilitation</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsSheetOpen(true)}
            className="p-2 bg-purple-50 text-[#512DA8] rounded-xl hover:bg-purple-100 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          <button 
            onClick={() => setIsRequestDialogOpen(true)}
            className="p-2 bg-[#512DA8] text-white rounded-xl hover:bg-[#4527a0] shadow-sm transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={16} />
        </div>
        <input
          type="text"
          placeholder="Search by tenant name or ID..."
          className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#512DA8] focus:border-transparent transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#512DA8] transition-colors">
          <Filter size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300 mb-3">
          <Search size={24} />
        </div>
        <p className="text-sm font-semibold text-gray-700">No active searches</p>
        <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Use the search bar above to look up specific client requests.</p>
      </div>

      <AgentRentRequestDialog 
        isOpen={isRequestDialogOpen} 
        onClose={() => setIsRequestDialogOpen(false)} 
        onSubmit={(data) => console.log(data)}
      />

      <AgentMyRentRequestsSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}
