import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, Receipt, 
  Wallet, FileText, Home, CalendarCheck, CloudOff,
  Edit, CheckCircle2, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAgentDashboardSummary, useAgentRentRequests } from './hooks/useAgentQueries';

export default function AgentDailyOps() {
  const navigate = useNavigate();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [timeframe, setTimeframe] = useState<'Today' | 'Yesterday' | 'Custom'>('Today');
  const { data: summaryData } = useAgentDashboardSummary();
  const summary = summaryData || {
    visits_today: 0,
    collections_count: 0,
    collections_amount: 0,
  };

  const { data: reqData } = useAgentRentRequests();
  const recentRequests = (reqData?.requests || []).slice(0, 3);

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetrySync = () => {
    if (navigator.onLine) {
       setIsOffline(false);
       toast.success('Successfully synced with server!');
    } else {
       toast.error('Still offline. Check connection.');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-[100dvh] font-['Inter'] flex flex-col text-slate-900 dark:text-slate-100">
       
       {/* Top Notification Banner for Offline */}
       {isOffline && (
        <div className="bg-orange-500 text-white px-4 md:px-6 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium z-50">
          <div className="flex items-center gap-2">
            <CloudOff size={18} />
            <span>Offline — data may be outdated. Reconnecting...</span>
          </div>
          <button onClick={handleRetrySync} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-xs font-bold transition-colors">
            Retry Now
          </button>
        </div>
       )}

       {/* Sticky Header */}
       <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#6c11d4]/10 hover:text-[#6c11d4] transition-colors -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Daily Operations</h1>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4">
            {/* Filter Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
              {(['Today', 'Yesterday', 'Custom'] as const).map(tf => (
                 <label key={tf} className="flex-1 md:flex-none cursor-pointer">
                    <input 
                      type="radio" 
                      name="timeframe" 
                      checked={timeframe === tf} 
                      onChange={() => setTimeframe(tf)} 
                      className="peer sr-only" 
                    />
                    <div className="text-center px-4 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:shadow-sm peer-checked:text-[#6c11d4] dark:peer-checked:text-white transition-all whitespace-nowrap">
                       {tf}
                    </div>
                 </label>
              ))}
            </div>
            
            <button className="hidden sm:flex p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow text-slate-600 dark:text-slate-300 shrink-0">
              <Calendar size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Scrollable Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
         
         {/* Summary Metrics Row (Clickable) */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div onClick={() => scrollToSection('visits')} className="cursor-pointer bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#6c11d4]/40 hover:shadow-md transition-all group">
               <div className="flex items-center justify-between mb-3 md:mb-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-[#6c11d4]/10 text-[#6c11d4]">
                    <CalendarCheck size={20} className="md:w-6 md:h-6" />
                 </div>
                 <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
               </div>
               <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">Visits</p>
               <p className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white group-hover:text-[#6c11d4] transition-colors">{summary.visits_today}</p>
            </div>

            <div onClick={() => scrollToSection('collections')} className="cursor-pointer bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all group">
               <div className="flex items-center justify-between mb-3 md:mb-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                    <Wallet size={20} className="md:w-6 md:h-6" />
                 </div>
                 <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue</span>
               </div>
               <p className="text-emerald-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">Collections</p>
               <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors tracking-tight">
                 {(summary.collections_amount || 0).toLocaleString()} <span className="text-xs sm:text-sm font-bold text-slate-400">UGX</span>
               </p>
            </div>

            <div onClick={() => scrollToSection('collections')} className="cursor-pointer bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all group">
               <div className="flex items-center justify-between mb-3 md:mb-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                    <Receipt size={20} className="md:w-6 md:h-6" />
                 </div>
                 <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-widest">Logs</span>
               </div>
               <p className="text-blue-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">Receipts</p>
               <p className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{summary.collections_count}</p>
            </div>

            <div className="cursor-pointer bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/40 hover:shadow-md transition-all group">
               <div className="flex items-center justify-between mb-3 md:mb-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                    <Home size={20} className="md:w-6 md:h-6" />
                 </div>
                 <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-widest">Support</span>
               </div>
               <p className="text-purple-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">Rent Requests</p>
               <p className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">5</p>
            </div>
         </div>

         {/* Grid Layout for Detailed Sections */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Left Column (Main Detailed Content) */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
               
               {/* Today's Visits */}
               <section id="visits" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm scroll-mt-24">
                 <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Scheduled Visits</h3>
                   <button className="text-[#6c11d4] hover:bg-[#6c11d4]/5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors">
                     View Map
                   </button>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[500px]">
                     <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                       <tr>
                         <th className="px-5 sm:px-6 py-4">Client / Tenant</th>
                         <th className="px-5 sm:px-6 py-4">Location & Time</th>
                         <th className="px-5 sm:px-6 py-4">Status</th>
                         <th className="px-5 sm:px-6 py-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-900 dark:text-white">
                         <td className="px-5 sm:px-6 py-4 sm:py-5 font-bold">John Musoke</td>
                         <td className="px-5 sm:px-6 py-4 sm:py-5">
                            <p className="text-sm font-medium">Kiwatule Rd, Apt 4B</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Clock size={12} /> 10:30 AM</p>
                         </td>
                         <td className="px-5 sm:px-6 py-4 sm:py-5">
                           <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 inline-flex items-center gap-1">
                             <CheckCircle2 size={10} /> Completed
                           </span>
                         </td>
                         <td className="px-5 sm:px-6 py-4 sm:py-5 text-right">
                           <button className="p-2 text-[#6c11d4] hover:bg-[#6c11d4]/10 rounded-lg transition-colors">
                             <Edit size={18} />
                           </button>
                         </td>
                       </tr>
                       <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-900 dark:text-white">
                         <td className="px-5 sm:px-6 py-4 sm:py-5 font-bold">Sarah Namuli</td>
                         <td className="px-5 sm:px-6 py-4 sm:py-5">
                            <p className="text-sm font-medium">Bukoto Heights, 2nd Floor</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Clock size={12} /> 02:00 PM</p>
                         </td>
                         <td className="px-5 sm:px-6 py-4 sm:py-5">
                           <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
                             Pending
                           </span>
                         </td>
                         <td className="px-5 sm:px-6 py-4 sm:py-5 text-right">
                           <button onClick={() => navigate('/agent-visit/sarah-namuli')} className="bg-[#6c11d4] hover:bg-[#5a1bb9] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-transform active:scale-95">
                             Start Visit
                           </button>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </section>

               {/* Recent Collections */}
               <section id="collections" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm scroll-mt-24">
                 <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                   <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Recent Collections</h3>
                 </div>
                 <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    
                    {/* Item 1 */}
                    <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <div className="flex items-center gap-3 sm:gap-4">
                         <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 shrink-0">
                           <Wallet size={20} className="sm:w-6 sm:h-6" />
                         </div>
                         <div>
                           <p className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">David Kato</p>
                           <p className="text-xs sm:text-sm text-slate-500 font-medium">Mobile Money • 09:15 AM</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                           120,000 <span className="text-[10px] sm:text-xs font-normal text-slate-500">UGX</span>
                         </p>
                         <p className="text-[10px] font-bold uppercase text-emerald-600 mt-0.5">Verified</p>
                       </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <div className="flex items-center gap-3 sm:gap-4">
                         <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 shrink-0">
                           <Wallet size={20} className="sm:w-6 sm:h-6" />
                         </div>
                         <div>
                           <p className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">Alice Birungi</p>
                           <p className="text-xs sm:text-sm text-slate-500 font-medium">Cash • 11:45 AM</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                           85,000 <span className="text-[10px] sm:text-xs font-normal text-slate-500">UGX</span>
                         </p>
                         <p className="text-[10px] font-bold uppercase text-emerald-600 mt-0.5">Verified</p>
                       </div>
                    </div>

                 </div>
               </section>
            </div>

            {/* Right Column (Sidebar Insights & Actions) */}
            <div className="space-y-6 md:space-y-8">
               
               {/* Quick Actions */}
               <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-3">
                     <button onClick={() => navigate('/agent-list-house')} className="flex items-center justify-center gap-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all">
                        <Home size={20} />
                        <span className="font-bold text-sm sm:text-base">List New House</span>
                     </button>
                     <button onClick={() => navigate('/agent-receipt')} className="flex items-center justify-center gap-3 bg-[#6c11d4] text-white p-4 sm:p-5 rounded-xl shadow-lg shadow-[#6c11d4]/30 hover:shadow-xl hover:shadow-[#6c11d4]/40 active:scale-95 transition-all">
                        <FileText size={20} />
                        <span className="font-bold text-sm sm:text-base">Generate Receipt</span>
                     </button>
                  </div>
               </section>

               {/* Performance Insights */}
               <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
                 <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Performance Insights</h3>
                 
                 <div className="space-y-6">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center text-sm mb-3">
                        <span className="text-slate-500 font-medium">Collections vs Target</span>
                        <span className="font-bold text-[#6c11d4] text-lg">75%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div className="bg-[#6c11d4] h-full rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-transparent cursor-help">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Conversion</p>
                        <p className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">62%</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-transparent cursor-help">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Unfinished</p>
                        <p className="text-xl sm:text-2xl font-black text-orange-500 tracking-tight">4</p>
                      </div>
                    </div>
                 </div>
               </section>

               {/* Requests Snapshot */}
               <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
                 <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">New Rent Requests</h3>
                 <div className="space-y-3">
                   {recentRequests.length === 0 ? (
                     <p className="text-sm text-center text-slate-500 py-2">No pending requests found.</p>
                   ) : (
                     recentRequests.map((req: any) => (
                       <div key={req.id} className="p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-[#6c11d4]/30 transition-colors">
                         <div>
                           <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{req.tenant_name || 'Anonymous Tenant'}</p>
                           <p className="text-xs text-slate-500 mt-0.5 max-w-[120px] truncate">UGX {req.amount.toLocaleString()}</p>
                         </div>
                         <span className="px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                           {req.status}
                         </span>
                       </div>
                     ))
                   )}
                   <button onClick={() => navigate('/agent-rent-requests')} className="w-full py-2.5 sm:py-3 text-sm font-bold text-[#6c11d4] hover:bg-[#6c11d4]/5 rounded-xl transition-colors">
                     View all requests
                   </button>
                 </div>
               </section>

            </div>
         </div>
      </main>
    </div>
  );
}
