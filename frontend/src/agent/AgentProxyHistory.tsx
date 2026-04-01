import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, History, CheckCircle2, Clock, Wallet, ArrowDownRight, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Proxy Transaction History
type TransactionStatus = 'Completed' | 'Processing' | 'Failed';

interface ProxyTransaction {
  id: string;
  partnerName: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  time: string;
}

const mockTransactions: ProxyTransaction[] = [
  { id: 'PRX-00192', partnerName: 'Dr. Sarah Namagembe', amount: 2500000, status: 'Completed', date: 'Oct 15, 2024', time: '14:23 EAT' },
  { id: 'PRX-00191', partnerName: 'Michael Kasule', amount: 800000, status: 'Processing', date: 'Oct 15, 2024', time: '10:05 EAT' },
  { id: 'PRX-00188', partnerName: 'Lwanga Estates Ltd', amount: 5000000, status: 'Completed', date: 'Oct 14, 2024', time: '16:45 EAT' },
  { id: 'PRX-00185', partnerName: 'Grace Wanjiku', amount: 1200000, status: 'Completed', date: 'Oct 12, 2024', time: '09:12 EAT' },
  { id: 'PRX-00180', partnerName: 'David Ochieng', amount: 450000, status: 'Failed', date: 'Oct 10, 2024', time: '11:30 EAT' },
  { id: 'PRX-00172', partnerName: 'Dr. Sarah Namagembe', amount: 1000000, status: 'Completed', date: 'Oct 05, 2024', time: '13:00 EAT' },
];

export default function AgentProxyHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Completed' | 'Processing'>('All');

  // Compute Proxy Portfolio KPIs
  const stats = useMemo(() => {
    let totalVolume = 0;
    let successCount = 0;
    
    mockTransactions.forEach(tx => {
       if (tx.status === 'Completed') {
          totalVolume += tx.amount;
          successCount++;
       }
    });

    return { totalVolume, successCount, totalAttempts: mockTransactions.length };
  }, []);

  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions;
    if (activeTab !== 'All') {
      filtered = filtered.filter(tx => tx.status === activeTab);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.partnerName.toLowerCase().includes(q) || 
        tx.id.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [searchQuery, activeTab]);

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed top-[-5%] left-[10%] w-[40rem] h-[40rem] bg-[#9234eb]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <h1 className="text-xl font-black text-slate-800 leading-none mb-1">Proxy Ledger</h1>
                 <p className="text-[10px] font-bold text-[#9234eb]/70 uppercase tracking-widest">Financial History</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-purple-100 shadow-sm w-full sm:w-auto">
             <Search size={18} className="text-[#9234eb]/40" />
             <input 
                type="text" 
                placeholder="Search partner or TX ID..." 
                className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 w-full sm:w-56 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#9234eb] to-[#6a15ba] p-8 shadow-[0_20px_40px_-10px_rgba(146,52,235,0.3)] border border-white/10 text-white flex flex-col justify-center"
           >
              {/* Decorative Outline */}
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                 <Wallet size={160} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                 <p className="text-[10px] font-bold tracking-widest uppercase text-purple-200 mb-2 flex items-center gap-2">
                    <History size={14} /> Total Proxy Volume Cleared
                 </p>
                 <p className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter drop-shadow-md">
                    UGX {stats.totalVolume.toLocaleString()}
                 </p>
                 
                 <div className="mt-8 pt-6 border-t border-white/20 flex gap-8">
                    <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1">Success Rate</p>
                       <p className="text-xl font-black">{Math.round((stats.successCount / stats.totalAttempts) * 100)}%</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1">Global TX Count</p>
                       <p className="text-xl font-black">{stats.successCount} <span className="text-sm font-normal text-white/60 text-purple-200">/ {stats.totalAttempts}</span></p>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Quick Action Card Layout Fill */}
           <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-purple-100 flex flex-col justify-center items-center text-center gap-4"
           >
              <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-[#9234eb] shadow-inner mb-2">
                 <ArrowDownRight size={32} />
              </div>
              <div>
                 <h3 className="font-black text-slate-800 text-lg leading-tight">New Proxy<br/>Investment</h3>
                 <p className="text-xs font-semibold text-slate-500 mt-2 max-w-[150px] mx-auto">Deposit funds rapidly on behalf of an offline partner.</p>
              </div>
              <button onClick={() => navigate('/agent-invest-partner')} className="w-full mt-2 py-2.5 bg-slate-900 border border-slate-800 hover:bg-[#9234eb] hover:border-[#9234eb] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors">
                 Initialize
              </button>
           </motion.div>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 shadow-inner w-full sm:w-fit overflow-x-auto hide-scrollbar">
           {['All', 'Completed', 'Processing'].map(tab => (
              <button 
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                 {tab === 'All' ? 'All Transactions' : tab}
              </button>
           ))}
        </div>

        {/* Ledger */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
           {filteredTransactions.length > 0 ? (
              <div className="flex flex-col">
                 <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="col-span-5">Partner & ID</div>
                    <div className="col-span-3">Principal Value</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Timestamp</div>
                 </div>

                 {filteredTransactions.map((tx, idx) => (
                    <motion.div 
                       key={tx.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.3, delay: idx * 0.05 }}
                       className={`group flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-none`}
                    >
                       {/* Profile Col */}
                       <div className="col-span-5 flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center shrink-0 bg-[#f7f9fa] text-slate-500 group-hover:bg-purple-50 group-hover:text-[#9234eb] group-hover:border-purple-200 transition-colors`}>
                             <User size={20} />
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-900 leading-tight">{tx.partnerName}</h3>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-[#9234eb]/60 mt-0.5">{tx.id}</p>
                          </div>
                       </div>

                       {/* Value Col */}
                       <div className="col-span-3 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                          <p className="text-lg font-black text-slate-800 leading-none">UGX {tx.amount.toLocaleString()}</p>
                       </div>

                       {/* Status Col */}
                       <div className="col-span-2 flex items-center mt-1 md:mt-0">
                          {tx.status === 'Completed' && (
                             <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 w-fit">
                                <CheckCircle2 size={12} /> Executed
                             </div>
                          )}
                          {tx.status === 'Processing' && (
                             <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 w-fit">
                                <Clock size={12} /> Pending
                             </div>
                          )}
                          {tx.status === 'Failed' && (
                             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 w-fit">
                                <AlertCircle size={12} /> Failed
                             </div>
                          )}
                       </div>

                       {/* Date Col */}
                       <div className="col-span-2 flex flex-row md:flex-col justify-between md:justify-center md:items-end md:text-right mt-2 md:mt-0">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tx.date}</span>
                          <span className="text-xs font-semibold text-slate-500">{tx.time}</span>
                       </div>
                    </motion.div>
                 ))}
              </div>
           ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-[#9234eb]/40 mb-4 border border-purple-100 shadow-inner">
                    <History size={32} />
                 </div>
                 <h4 className="text-xl font-black text-slate-800 mb-2">No Transactions Found</h4>
                 <p className="text-sm font-semibold text-slate-500 max-w-sm">There are no proxy investments matching your current filters or search query.</p>
              </div>
           )}
        </div>

      </main>
    </div>
  );
}
