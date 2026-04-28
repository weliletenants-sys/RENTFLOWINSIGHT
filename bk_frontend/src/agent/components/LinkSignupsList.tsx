import React from 'react';
import { Link2 } from 'lucide-react';

export default function LinkSignupsList() {
  const signups = [
    { name: 'Unknown User #441', date: 'Today at 08:30AM', source: 'WhatsApp Web' },
    { name: 'John S.', date: 'Yesterday', source: 'Facebook Lead' }
  ];

  return (
    <div className="space-y-2 mt-3">
      {signups.map((s, idx) => (
        <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <Link2 size={14} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{s.name}</p>
              <p className="text-[10px] text-gray-400 font-medium">via {s.source}</p>
            </div>
          </div>
          <span className="text-[10px] bg-white border border-gray-200 text-gray-500 font-bold px-2 py-1 rounded">
            {s.date}
          </span>
        </div>
      ))}
    </div>
  );
}
