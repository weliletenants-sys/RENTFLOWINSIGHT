import React from 'react';
import type { NotificationItem } from '../types';

interface CrmKpiGridProps {
  notifications: NotificationItem[];
}

const CrmKpiGrid: React.FC<CrmKpiGridProps> = ({ notifications }) => {
  const totalInquiries = notifications.length;
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  const uniqueUsers = new Set(notifications.map(n => n.user_id)).size;
  const supportTickets = notifications.filter(n => ['support', 'inquiry'].includes(n.type)).length;
  const warningAlerts = notifications.filter(n => n.type === 'warning').length;

  const readRate = totalInquiries === 0 
    ? 0 
    : Math.round((notifications.filter(n => n.is_read).length / totalInquiries) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      
      {/* Total Inquiries */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Inquiries</p>
        <h3 className="text-3xl font-black font-outfit text-slate-800">{totalInquiries}</h3>
      </div>

      {/* Unread */}
      <div className={`p-5 rounded-3xl border shadow-sm transition-all ${
        unreadCount > 0 ? 'bg-red-50/50 border-red-100 hover:bg-red-50' : 'bg-white border-slate-100 hover:shadow-md'
      }`}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${unreadCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>Unread / Backlog</p>
        <div className="flex items-center space-x-2">
          <h3 className={`text-3xl font-black font-outfit ${unreadCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
            {unreadCount}
          </h3>
          {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">URGENT</span>}
        </div>
      </div>

      {/* Unique Users */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Unique Users</p>
        <h3 className="text-3xl font-black font-outfit text-slate-800">{uniqueUsers}</h3>
      </div>

      {/* Support Tickets */}
      <div className="bg-[#f0fbfa] p-5 rounded-3xl border border-teal-100 shadow-sm hover:bg-teal-50 transition-all">
        <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Support Tickets</p>
        <h3 className="text-3xl font-black font-outfit text-teal-700">{supportTickets}</h3>
      </div>

      {/* Warning Alerts */}
      <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-100 shadow-sm hover:bg-amber-50 transition-all">
        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Warning Alerts</p>
        <h3 className="text-3xl font-black font-outfit text-amber-700">{warningAlerts}</h3>
      </div>

      {/* Read Rate */}
      <div className="bg-[#EAE5FF] p-5 rounded-3xl border border-purple-100 shadow-sm hover:bg-[#d8cfff] transition-all">
        <p className="text-xs font-bold text-[#6c11d4]/70 uppercase tracking-wider mb-2">Read Rate</p>
        <h3 className="text-3xl font-black font-outfit text-[#6c11d4]">{readRate}%</h3>
      </div>

    </div>
  );
};

export default CrmKpiGrid;
