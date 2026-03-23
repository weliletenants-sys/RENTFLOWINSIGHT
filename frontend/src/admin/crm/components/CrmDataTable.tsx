import React from 'react';
import type { NotificationItem } from '../data/mockNotifications';
import { CheckCircle2, XCircle, AlertCircle, Info, ShieldAlert, MessageCircle, HelpCircle } from 'lucide-react';

interface CrmDataTableProps {
  notifications: NotificationItem[];
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
  });
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'support': return { color: 'bg-blue-100 text-blue-700', icon: <HelpCircle size={14} /> };
    case 'inquiry': return { color: 'bg-teal-100 text-teal-700', icon: <MessageCircle size={14} /> };
    case 'alert': return { color: 'bg-amber-100 text-amber-700', icon: <AlertCircle size={14} /> };
    case 'warning': return { color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle size={14} /> };
    case 'security': return { color: 'bg-purple-100 text-purple-700', icon: <ShieldAlert size={14} /> };
    case 'info': default: return { color: 'bg-slate-100 text-slate-600', icon: <Info size={14} /> };
  }
};

const CrmDataTable: React.FC<CrmDataTableProps> = ({ notifications }) => {
  
  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
        <p className="text-slate-500 font-medium font-inter">No inquiries match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden font-inter">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Date / Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Message Preview</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {notifications.map((notif) => {
              const typeConfig = getTypeConfig(notif.type);
              const isUnread = !notif.is_read;

              return (
                <tr key={notif.id} className={`transition-colors hover:bg-slate-50 ${isUnread ? 'bg-slate-50/30' : ''}`}>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {formatTime(notif.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1.5">
                      {isUnread 
                        ? <><XCircle size={16} className="text-red-500" /><span className="text-xs font-bold text-red-600">Unread</span></>
                        : <><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-xs font-bold text-slate-500">Read</span></>
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${typeConfig.color}`}>
                      {typeConfig.icon}
                      <span>{notif.type}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`text-sm ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{notif.user_name}</p>
                      <p className="text-xs text-slate-400">{notif.user_id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{notif.subject}</p>
                  </td>
                  <td className="px-6 py-4 w-1/3">
                    <p className="text-sm text-slate-500 truncate max-w-xs">{notif.message}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-bold text-[#6c11d4] hover:text-[#5b21b6] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrmDataTable;
