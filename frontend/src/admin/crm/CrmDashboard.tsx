import { useEffect, useState } from 'react';
import { 
  Users, MessageSquare, AlertCircle, HelpCircle, MailCheck, BellPlus, CheckCircle
} from 'lucide-react';
import executiveApi from '../../services/executiveApi';

interface CrmMetrics {
  kpis: {
    totalInquiries: number;
    unreadCount: number;
    uniqueUsers: number;
    supportTickets: number;
    warningAlerts: number;
    readRate: number;
  };
  inquiries: {
    id: string;
    createdAt: string;
    subject: string;
    type: string;
    isRead: boolean;
    messagePreview: string;
    user: string;
  }[];
}

export default function CrmDashboard() {
  const [data, setData] = useState<CrmMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Table filtering state
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await executiveApi.get('/crm/metrics');
      setData(response.data);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch CRM metrics', err);
      setError('Unable to load customer engagement data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
        <h3 className="text-lg font-bold mb-2">System Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  const { kpis, inquiries } = data!;

  const filteredInquiries = inquiries.filter(i => {
    if (filterType !== 'all' && i.type !== filterType) return false;
    if (filterStatus === 'unread' && i.isRead) return false;
    if (filterStatus === 'read' && !i.isRead) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          CRM Hub
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Customer communications, engagement, and support ticket flow.
        </p>
      </div>

      {/* KPI Grid (6 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Comm</span>
            <MessageSquare size={18} className="text-blue-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.totalInquiries.toLocaleString()}</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border-l-4 border-l-orange-500 border-y border-r border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Unread</span>
            <BellPlus size={18} className="text-orange-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.unreadCount.toLocaleString()}</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Unique Engaged Users</span>
            <Users size={18} className="text-teal-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.uniqueUsers.toLocaleString()}</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Support Tickets</span>
            <HelpCircle size={18} className="text-indigo-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.supportTickets.toLocaleString()}</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-red-200 dark:border-red-900 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-red-500 dark:text-red-400 text-sm font-medium">Warning Alerts</span>
            <AlertCircle size={18} className="text-red-500" />
          </div>
          <span className="text-3xl font-bold text-red-600 dark:text-red-400">{kpis.warningAlerts.toLocaleString()}</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Read Rate</span>
            <MailCheck size={18} className="text-green-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.readRate}</span>
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>

      </div>

      {/* Customer Inquiries Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-indigo-500" />
            Recent Communications Log
          </h2>
          <div className="flex gap-2">
            <select
              title="Filter by Type"
              className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="support">Support</option>
              <option value="inquiry">Inquiries</option>
              <option value="warning">Warnings</option>
              <option value="security">Security</option>
              <option value="alert">Alerts</option>
              <option value="info">Info</option>
            </select>
            <select
              title="Filter by Status"
              className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 sticky top-0 uppercase">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Subject / Message</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No inquiries found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!item.isRead ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-300">
                      {item.user}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                        ${item.type === 'warning' ? 'bg-red-100 text-red-800' : 
                          item.type === 'support' || item.type === 'inquiry' ? 'bg-indigo-100 text-indigo-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{item.subject}</div>
                      <div className="text-gray-500 text-xs truncate max-w-md">{item.messagePreview}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.isRead ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle size={14} /> Read</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-600 text-xs font-medium"><AlertCircle size={14} /> Unread</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
