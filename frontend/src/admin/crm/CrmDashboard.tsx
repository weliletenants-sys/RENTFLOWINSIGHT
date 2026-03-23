import { useState, useMemo } from 'react';
import CRMSidebar from './components/CRMSidebar';
import CRMHeader from './components/CRMHeader';
import CrmKpiGrid from './components/CrmKpiGrid';
import CrmDataTable from './components/CrmDataTable';
import CrmSettings from './components/CrmSettings';
import type { NotificationItem } from './types';
import { useEffect } from 'react';
import axios from 'axios';
import { Filter } from 'lucide-react';

export default function CrmDashboard() {
  const [activeTab, setActiveTab] = useState('triage');
  const [liveNotifications, setLiveNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get('/api/crm/tickets');
        setLiveNotifications(data.tickets || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, []);
  
  // Dual Filters State
  const [filterType, setFilterType] = useState<string>('all'); // all, support, inquiry, alert, warning, info, security
  const [filterStatus, setFilterStatus] = useState<string>('all'); // all, read, unread

  // Memoized Filtered Data
  const filteredNotifications = useMemo(() => {
    return liveNotifications.filter((notif) => {
      const matchType = filterType === 'all' ? true : notif.type === filterType;
      
      let matchStatus = true;
      if (filterStatus === 'read') {
        matchStatus = notif.is_read;
      } else if (filterStatus === 'unread') {
        matchStatus = !notif.is_read;
      }

      return matchType && matchStatus;
    });
  }, [filterType, filterStatus]);

  return (
    <div className="flex h-screen bg-[#F9F9FB] text-slate-900 font-inter overflow-hidden">
      {/* Sidebar Layout matched with CFO/COO layout standard */}
      <CRMSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header matched with standard template */}
        <CRMHeader 
          pageTitle={activeTab === 'triage' ? 'Communication Triage' : 'CRM Settings'} 
          pageSubtitle={activeTab === 'triage' ? 'Consolidated customer issues, system alerts, and notifications view' : 'Global notification, triage routing, and alert preferences'} 
        />

        {/* Main Routing Area */}
        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
          {activeTab === 'triage' && (
            <div className="space-y-6">
              
              {/* KPI Statistics */}
              <CrmKpiGrid notifications={liveNotifications} />

              {/* Data Table Area */}
              <div className="flex flex-col space-y-4">
                
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold font-outfit text-slate-800">Customer Inquiries</h2>
                  
                  {/* Dual Filters */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      <Filter size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-600">Type:</span>
                      <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)}
                        className="text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-800 font-medium cursor-pointer"
                      >
                        <option value="all">All Types</option>
                        <option value="support">Support</option>
                        <option value="inquiry">Inquiries</option>
                        <option value="alert">Alerts</option>
                        <option value="warning">Warnings</option>
                        <option value="security">Security</option>
                        <option value="info">Info</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      <span className="text-sm font-bold text-slate-600">Status:</span>
                      <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-800 font-medium cursor-pointer"
                      >
                        <option value="all">All</option>
                        <option value="unread">Unread (Backlog)</option>
                        <option value="read">Read (Resolved)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Main Table component */}
                <CrmDataTable notifications={filteredNotifications} />
                
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <CrmSettings />
          )}
        </main>
      </div>
    </div>
  );
}
