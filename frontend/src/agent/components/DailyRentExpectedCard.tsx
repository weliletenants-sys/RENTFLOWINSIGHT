import React from 'react';
import { CalendarClock, ArrowUpRight } from 'lucide-react';

export default function DailyRentExpectedCard() {
  return (
    <div className="bg-white border text-gray-800 border-gray-100 rounded-[1.5rem] p-5 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <CalendarClock size={20} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Expected Today</h3>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-black text-gray-900 drop-shadow-sm">UGX 600,000</div>
          <div className="text-xs text-gray-500 font-medium mt-0.5">Expected sum from 5 active obligations</div>
        </div>
        <div className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-0.5">
          <ArrowUpRight size={14} /> +12%
        </div>
      </div>
    </div>
  );
}
