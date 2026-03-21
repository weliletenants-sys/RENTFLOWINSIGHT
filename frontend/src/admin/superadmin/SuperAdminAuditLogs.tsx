import { Search, Filter, Download } from 'lucide-react';

export default function SuperAdminAuditLogs() {
  const dummyLogs = [
    { id: '1', timestamp: 'Mar 20, 14:32:00', actor: 'Mike Admin', role: 'CEO', action: 'UPDATE_CONFIG', target: 'GLOBAL_SETTINGS', ip: '192.168.1.1' },
    { id: '2', timestamp: 'Mar 20, 12:15:22', actor: 'Sarah Ops', role: 'COO', action: 'APPROVE_WITHDRAWAL', target: 'WR-8921', ip: '10.0.0.5' },
    { id: '3', timestamp: 'Mar 19, 09:05:11', actor: 'Root Super', role: 'SUPER_ADMIN', action: 'ASSIGN_ROLE', target: 'USR-882', ip: 'VPN Gateway' },
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 shrink-0 justify-between">
        
        {/* Filters Combo */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500/50 outline-none w-48 focus:w-64 transition-all text-sm shadow-sm"
            />
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm">
            <Filter size={16} className="text-gray-500" /> Date Range
          </button>
          
          <select className="px-3 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm outline-none cursor-pointer">
            <option>All Roles</option>
            <option>SUPER_ADMIN</option>
            <option>CEO</option>
          </select>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm whitespace-nowrap">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Audit Table */}
      <div className="bg-white dark:bg-[#111827] shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="sticky top-0 bg-gray-50/90 dark:bg-[#1e2937]/90 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-gray-800 shadow-sm">
              <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Target</th>
                <th className="px-6 py-3 text-right">Context (IP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {dummyLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors text-sm group">
                  <td className="px-6 py-3.5 text-gray-400 font-mono text-xs">{log.timestamp}</td>
                  <td className="px-6 py-3.5">
                    <span className="font-medium text-gray-900 dark:text-gray-200 block">{log.actor}</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-purple-600 dark:text-purple-400">{log.role}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded border ${
                      log.role === 'SUPER_ADMIN' 
                      ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-xs text-gray-500">{log.target}</td>
                  <td className="px-6 py-3.5 text-gray-400 text-xs font-mono text-right">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1e2937]/50 flex items-center justify-between text-xs font-medium text-gray-500">
          <div>1–50 of 12,401 events</div>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 rounded-md bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 shadow-sm text-gray-900 dark:text-white">1</button>
            <button className="px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">2</button>
            <button className="px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
