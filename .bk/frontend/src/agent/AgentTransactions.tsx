import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, History, CheckCircle2, Clock, Wallet, ArrowDownRight, ArrowUpRight, Banknote, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Master Ledger Data
type TransStatus = 'Completed' | 'Pending' | 'Failed';
type TransType = 'Rent Collection' | 'Commission Payout' | 'Agent Top-Up';

interface MasterTransaction {
  id: string;
  type: TransType;
  entityName: string; // E.g., Tenant name, System, Bank
  amount: number;
  status: TransStatus;
  date: string;
  time: string;
  isCredit: boolean; // Does this hit the agent's wallet positively or negatively (if cash handover)
}

const mockLedger: MasterTransaction[] = [
  { id: 'TX-4091A', type: 'Rent Collection', entityName: 'John Doe - Najjera Apt 4', amount: 1500000, status: 'Completed', date: 'Oct 15, 2024', time: '14:23 EAT', isCredit: true },
  { id: 'TX-4088C', type: 'Commission Payout', entityName: 'Stanbic Bank Withdrawal', amount: 450000, status: 'Pending', date: 'Oct 14, 2024', time: '10:05 EAT', isCredit: false },
  { id: 'TX-4085T', type: 'Agent Top-Up', entityName: 'MTN MoMo Deposit', amount: 5000000, status: 'Completed', date: 'Oct 12, 2024', time: '16:45 EAT', isCredit: true },
  { id: 'TX-4081A', type: 'Rent Collection', entityName: 'Grace Wanjiku - Kololo B1', amount: 2200000, status: 'Completed', date: 'Oct 11, 2024', time: '09:12 EAT', isCredit: true },
  { id: 'TX-4077A', type: 'Rent Collection', entityName: 'David Ochieng - Ntinda', amount: 800000, status: 'Failed', date: 'Oct 10, 2024', time: '11:30 EAT', isCredit: true },
  { id: 'TX-4070C', type: 'Commission Payout', entityName: 'Airtel Money Withdrawal', amount: 200000, status: 'Completed', date: 'Oct 05, 2024', time: '13:00 EAT', isCredit: false },
  { id: 'TX-4065A', type: 'Rent Collection', entityName: 'Michael Kasule - Kyanja', amount: 950000, status: 'Completed', date: 'Oct 02, 2024', time: '15:20 EAT', isCredit: true },
];

export default function AgentTransactions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Rent Collection' | 'Commission Payout' | 'Agent Top-Up'>('All');

  // Compute Master Ledger KPIs
  const stats = useMemo(() => {
    let globalVolume = 0;
    let earnedCommissions = 0;
    
    mockLedger.forEach(tx => {
       if (tx.status === 'Completed') {
          globalVolume += tx.amount;
          if (tx.type === 'Commission Payout') {
             earnedCommissions += tx.amount;
          }
       }
    });

    return { globalVolume, earnedCommissions, txCount: mockLedger.length };
  }, []);

  const filteredLedger = useMemo(() => {
    let filtered = mockLedger;
    if (activeTab !== 'All') {
      filtered = filtered.filter(tx => tx.type === activeTab);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.entityName.toLowerCase().includes(q) || 
        tx.id.toLowerCase().includes(q) ||
        tx.type.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [searchQuery, activeTab]);

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed top-[-5%] left-[50%] w-[50rem] h-[50rem] bg-[#9234eb]/5 rounded-[100%] blur-[120px] pointer-events-none z-0 transform -translate-x-1/2"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <h1 className="text-xl font-black text-slate-800 leading-none mb-1">Transactions</h1>
                 <p className="text-[10px] font-bold text-[#9234eb]/70 uppercase tracking-widest">Master Financial Ledger</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-purple-100 shadow-sm w-full sm:w-auto">
             <Search size={18} className="text-[#9234eb]/40" />
             <input 
                type="text" 
                placeholder="Search Entity, ID, or Type..." 
                className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 w-full sm:w-64 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* Absolute KPI Hero Box */}
        <motion.div 
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
           className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#9234eb] to-[#6a15ba] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(146,52,235,0.3)] border border-white/10 text-white flex flex-col justify-center"
        >
           {/* Decorative Outline */}
           <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 pointer-events-none">
              <Banknote size={200} strokeWidth={1} />
           </div>

           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div>
                 <p className="text-[10px] font-bold tracking-widest uppercase text-purple-200 mb-2 flex items-center gap-2">
                    <History size={14} /> Global Transaction Volume
                 </p>
                 <p className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter drop-shadow-md">
                    UGX {(stats.globalVolume / 1000000).toFixed(1)}<span className="text-3xl text-white/50 ml-1">M</span>
                 </p>
              </div>
              
              <div className="flex gap-8 md:justify-end pb-1 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8">
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1 flex items-center gap-1.5"><ArrowDownRight size={12} /> Payouts Withdrawn</p>
                    <p className="text-2xl font-black text-emerald-100">UGX {stats.earnedCommissions.toLocaleString()}</p>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Dynamic State Filters */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner w-full sm:w-fit overflow-x-auto hide-scrollbar">
           {['All', 'Rent Collection', 'Commission Payout', 'Agent Top-Up'].map(tab => (
              <button 
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-5 py-2.5 rounded-[14px] text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-[#9234eb] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                 {tab === 'All' ? 'Master Ledger' : tab}s
              </button>
           ))}
        </div>

        {/* Matrix Data Logs */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
           {filteredLedger.length > 0 ? (
              <div className="flex flex-col">
                 <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-5 bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <div className="col-span-4">Entity & Type</div>
                    <div className="col-span-3">TX Serialization</div>
                    <div className="col-span-2">Transfer Status</div>
                    <div className="col-span-3 text-right">Settled Amount</div>
                 </div>

                 {filteredLedger.map((tx, idx) => (
                    <motion.div 
                       key={tx.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.3, delay: idx * 0.05 }}
                       className={`group flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4 px-6 lg:px-8 py-6 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-none`}
                    >
                       {/* Entity Col */}
                       <div className="col-span-4 flex items-start lg:items-center gap-4">
                          <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                              tx.type === 'Rent Collection' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                              tx.type === 'Commission Payout' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 
                              'bg-purple-50 border-purple-100 text-[#9234eb]'
                          }`}>
                             {tx.type === 'Commission Payout' || tx.type === 'Agent Top-Up' ? <Wallet size={20} /> : <Banknote size={20} />}
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-900 leading-tight mb-1">{tx.entityName}</h3>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{tx.type}</p>
                          </div>
                       </div>

                       {/* Serialization Col */}
                       <div className="col-span-3 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
                          <p className="text-sm font-black text-slate-700 font-mono tracking-wider">{tx.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{tx.date} • {tx.time}</p>
                       </div>

                       {/* Status Col */}
                       <div className="col-span-2 mt-1 lg:mt-0">
                          {tx.status === 'Completed' && (
                             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/50 px-2.5 py-1.5 rounded-lg border border-emerald-200/50 w-fit">
                                <CheckCircle2 size={12} /> Complete
                             </div>
                          )}
                          {tx.status === 'Pending' && (
                             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100/50 px-2.5 py-1.5 rounded-lg border border-amber-200/50 w-fit">
                                <Clock size={12} /> In Transit
                             </div>
                          )}
                          {tx.status === 'Failed' && (
                             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-700 bg-red-100/50 px-2.5 py-1.5 rounded-lg border border-red-200/50 w-fit">
                                <AlertCircle size={12} /> Failed
                             </div>
                          )}
                       </div>

                       {/* Amount Col */}
                       <div className="col-span-3 flex justify-between lg:justify-end items-center mt-3 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          <div className={`hidden lg:flex w-8 h-8 rounded-full border items-center justify-center mr-3 ${tx.isCredit ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
                             {tx.isCredit ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <p className={`text-xl lg:text-2xl font-black ${tx.isCredit ? 'text-slate-800' : 'text-slate-600'} leading-none flex items-center gap-2`}>
                             <span className="lg:hidden">{tx.isCredit ? <ArrowDownRight size={18} className="text-emerald-500" /> : <ArrowUpRight size={18} className="text-rose-500" />}</span>
                             UGX {tx.amount.toLocaleString()}
                          </p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center px-4">
                 <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center text-[#9234eb]/30 mb-6 border border-purple-100 shadow-inner">
                    <History size={40} />
                 </div>
                 <h4 className="text-2xl font-black text-slate-800 mb-2">No Transactions Yielded</h4>
                 <p className="text-sm font-semibold text-slate-500 max-w-sm">There are no internal or external volume transfers matching your current operational filters.</p>
              </div>
           )}
        </div>

      </main>
    </div>
  );
}
