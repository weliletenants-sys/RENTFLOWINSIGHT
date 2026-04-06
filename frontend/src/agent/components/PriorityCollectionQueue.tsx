import React from 'react';
import { User, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export default function PriorityCollectionQueue() {
  // Mock data for priority visits
  const queue = [
    { id: 1, name: 'Joshua K.', amount: 50000, risk: 'High', daysOverdue: 2 },
    { id: 2, name: 'Annet M.', amount: 120000, risk: 'Medium', daysOverdue: 1 },
    { id: 3, name: 'Elijah E.', amount: 30000, risk: 'Low', location: 'Ntinda' },
  ];

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 tracking-wide flex items-center gap-2">
          <ShieldAlert size={18} className="text-red-500" /> Waitlist / Priority
        </h3>
        <span className="text-xs font-bold text-[#512DA8] cursor-pointer hover:underline">View All</span>
      </div>

      <div className="space-y-3">
        {queue.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100/70 border border-gray-100 cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                task.risk === 'High' ? 'bg-red-500' : task.risk === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
              }`}>
                {task.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#512DA8] transition-colors">{task.name}</h4>
                <div className="text-[10px] text-gray-500 font-medium">
                  UGX {(task.amount).toLocaleString()} {task.daysOverdue ? `• ${task.daysOverdue} days late` : `• ${task.location}`}
                </div>
              </div>
            </div>
            
            <button className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 group-hover:border-[#512DA8] group-hover:text-[#512DA8] transition-all">
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
