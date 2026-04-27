import { useEffect, useState } from 'react';
import { 
  Activity, Users, Database, AlertTriangle, ShieldAlert,
  Clock, GitBranch, Server
} from 'lucide-react';
import executiveApi from '../../services/executiveApi';
import { useAuth } from '../../contexts/AuthContext';

interface CtoMetrics {
  timestamp: string;
  kpis: {
    dbResponseTimeMs: number;
    dbConnectionStatus: 'Healthy' | 'Slow' | 'Degraded';
    activeUsers7d: number;
    totalUsers: number;
    systemEventsCount: number;
    securityAlertsCount: number;
    totalDbRows: number;
    avgProcessingTimeHours: number;
  };
  pipeline: {
    total: number;
    pending: number;
    active: number;
    completed: number;
    failed: number;
  };
  tableSizes: { name: string; count: number }[];
}

export default function CtoDashboard() {
  const [data, setData] = useState<CtoMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useAuth(); // ensure context operates at mount

  useEffect(() => {
    fetchMetrics();
    // Refresh every 60 seconds as per workflow
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      // Assuming api wrapper handles Bearer token injection
      const response = await executiveApi.get('/cto/metrics');
      setData(response.data);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch CTO metrics', err);
      setError('Unable to load infrastructure telemetry. Check API connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-bold mb-2">System Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  const { kpis, pipeline, tableSizes, timestamp } = data!;

  const dbColor = 
    kpis.dbConnectionStatus === 'Healthy' ? 'text-green-500' : 
    kpis.dbConnectionStatus === 'Slow' ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            CTO Command Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time infrastructure and system health telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          <Activity size={16} className={dbColor} />
          <span>Last polled: {new Date(timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Grid (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">DB Latency</span>
            <Server size={18} className={dbColor} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.dbResponseTimeMs}</span>
            <span className="text-sm text-gray-500">ms</span>
          </div>
          <p className={`text-xs mt-2 font-medium ${dbColor}`}>
            Status: {kpis.dbConnectionStatus}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Users (7d)</span>
            <Activity size={18} className="text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.activeUsers7d.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Out of {kpis.totalUsers.toLocaleString()} total registered
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">System Events</span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.systemEventsCount.toLocaleString()}</span>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            Errors & Warnings Logged
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm flex flex-col relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${kpis.securityAlertsCount > 0 ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
          <div className="flex justify-between items-center mb-4 pl-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Security Alerts</span>
            <ShieldAlert size={18} className={kpis.securityAlertsCount > 0 ? "text-red-500" : "text-gray-400"} />
          </div>
          <div className="flex items-baseline gap-2 pl-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.securityAlertsCount.toLocaleString()}</span>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 pl-2 font-medium">
            Fraud/Freeze Incidents
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total DB Rows</span>
            <Database size={18} className="text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.totalDbRows.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Across 8 core tables
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg Processing Time</span>
            <Clock size={18} className="text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.avgProcessingTimeHours}</span>
            <span className="text-sm text-gray-500">hrs</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Deposit Request Approval ETA
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</span>
            <Users size={18} className="text-teal-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.totalUsers.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Registered accounts
          </p>
        </div>

      </div>

      {/* Rent Request Pipeline Health */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GitBranch size={20} className="text-indigo-500" />
            Lending Pipeline Health
          </h2>
        </div>
        
        <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-lg h-4 flex overflow-hidden mb-4">
          <div style={{ width: `${(pipeline.pending / pipeline.total) * 100}%` }} className="bg-yellow-400" title={`Pending: ${pipeline.pending}`}></div>
          <div style={{ width: `${(pipeline.active / pipeline.total) * 100}%` }} className="bg-purple-500" title={`Active: ${pipeline.active}`}></div>
          <div style={{ width: `${(pipeline.completed / pipeline.total) * 100}%` }} className="bg-green-500" title={`Completed: ${pipeline.completed}`}></div>
          <div style={{ width: `${(pipeline.failed / pipeline.total) * 100}%` }} className="bg-red-500" title={`Failed: ${pipeline.failed}`}></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{pipeline.total.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
            <p className="text-sm text-yellow-600 dark:text-yellow-500 mb-1">Pending</p>
            <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">{pipeline.pending.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/10">
            <p className="text-sm text-purple-600 dark:text-purple-500 mb-1">Active</p>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-400">{pipeline.active.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/10">
            <p className="text-sm text-green-600 dark:text-green-500 mb-1">Completed</p>
            <p className="text-xl font-bold text-green-700 dark:text-green-400">{pipeline.completed.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/10">
            <p className="text-sm text-red-600 dark:text-red-500 mb-1">Failed</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-400">{pipeline.failed.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Database Table Sizes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database size={20} className="text-blue-500" />
            Core Table Sizes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 uppercase">
              <tr>
                <th key="tableName" className="px-6 py-3">Table Name</th>
                <th key="rowCount" className="px-6 py-3 text-right">Row Count</th>
                <th key="distribution" className="px-6 py-3 w-1/3 text-right">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tableSizes.map((table, i) => (
                <tr key={`${table.name}-${i}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-mono text-gray-900 dark:text-gray-300">
                    {table.name}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                    {table.count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center">
                      <div className="w-full max-w-[120px] bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 ml-auto">
                        <div 
                          className="bg-indigo-500 h-1.5 rounded-full" 
                          style={{ width: `${(table.count / Math.max(kpis.totalDbRows, 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
