import React from 'react';
import { PhoneOff, Map, Clock } from 'lucide-react';

export default function NoSmartphoneScheduleManager() {
  return (
    <div className="bg-amber-50 rounded-[1.5rem] p-5 shadow-sm border border-amber-100 relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-full blur-xl pointer-events-none -mt-4 -mr-4"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold text-amber-900 uppercase tracking-widest flex items-center gap-2">
          <PhoneOff size={16} /> Offline Routine
        </h3>
      </div>
      
      <p className="text-xs text-amber-800/80 mb-4 font-medium leading-relaxed max-w-[280px]">
        You have 4 tenants scheduled for physical cash collections today since they lack digital smartphone access.
      </p>
      
      <div className="bg-white/60 rounded-xl p-3 border border-amber-200/50 space-y-2 relative z-10">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-900">
            <Clock size={14} className="text-amber-600" /> Morning Run
          </div>
          <span className="text-gray-500 font-medium">Bwaise Area (2 tenants)</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-900">
            <Clock size={14} className="text-amber-600" /> Afternoon Run
          </div>
          <span className="text-gray-500 font-medium">Kalerwe (2 tenants)</span>
        </div>
      </div>
      
      <button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-sm flex items-center justify-center gap-2 relative z-10">
        <Map size={18} /> View Optimized Route Map
      </button>
    </div>
  );
}
