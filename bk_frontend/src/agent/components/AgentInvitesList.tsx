import React from 'react';
import { Mail, CheckCircle, Clock } from 'lucide-react';

export default function AgentInvitesList() {
  const invites = [
    { name: 'Denis K.', phone: '077...123', status: 'pending', date: 'Yesterday' },
    { name: 'Mary A.', phone: '075...456', status: 'accepted', date: '3 days ago' }
  ];

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Mail size={18} className="text-blue-500" /> Pending Invites
        </h3>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{invites.length} Total</span>
      </div>

      <div className="space-y-3">
        {invites.map((invite, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 bg-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-900">{invite.name}</p>
              <p className="text-[10px] text-gray-500 font-medium">{invite.phone} • Sent {invite.date}</p>
            </div>
            {invite.status === 'pending' ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                <Clock size={12} /> Pending
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100">
                <CheckCircle size={12} /> Joined
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
