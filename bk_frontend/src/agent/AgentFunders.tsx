import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, Phone, MessageSquare, ArrowRightCircle, HandCoins, Building2, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Agent-Assigned Funders
type FunderStatus = 'Active Portfolio' | 'Evaluating Pledge' | 'Paused';

interface AssignedFunder {
  id: string;
  name: string;
  type: 'Individual' | 'Corporate';
  status: FunderStatus;
  totalDeployed: number;
  propertiesBacked: number;
  phone: string;
  lastContact: string;
}

const mockFunders: AssignedFunder[] = [
  { id: 'FND-8821', name: 'Dr. Sarah Namagembe', type: 'Individual', status: 'Active Portfolio', totalDeployed: 125000000, propertiesBacked: 3, phone: '+256 772 110099', lastContact: '2 Days Ago' },
  { id: 'FND-7742', name: 'Lwanga Estates Ltd', type: 'Corporate', status: 'Active Portfolio', totalDeployed: 450000000, propertiesBacked: 12, phone: '+256 312 445566', lastContact: 'Today' },
  { id: 'FND-9102', name: 'Emmanuel Kintu', type: 'Individual', status: 'Evaluating Pledge', totalDeployed: 0, propertiesBacked: 0, phone: '+256 754 223344', lastContact: '1 Week Ago' },
  { id: 'FND-6601', name: 'Grace Wanjiku', type: 'Individual', status: 'Active Portfolio', totalDeployed: 45000000, propertiesBacked: 1, phone: '+256 700 889911', lastContact: '3 Weeks Ago' },
  { id: 'FND-5544', name: 'Kampala Syndicates', type: 'Corporate', status: 'Paused', totalDeployed: 200000000, propertiesBacked: 5, phone: '+256 414 778899', lastContact: '1 Month Ago' },
];

export default function AgentFunders() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Active Portfolio' | 'Evaluating Pledge'>('All');

  // Compute Volume Metrics
  const dashboardStats = useMemo(() => {
    let aggregateCapital = 0;
    let activeVips = 0;
    
    mockFunders.forEach(funder => {
       aggregateCapital += funder.totalDeployed;
       if (funder.status === 'Active Portfolio') activeVips++;
    });

    return { aggregateCapital, activeVips, totalFunders: mockFunders.length };
  }, []);

  const filteredFunders = useMemo(() => {
    let filtered = mockFunders;
    if (activeTab !== 'All') {
      filtered = filtered.filter(f => f.status === activeTab);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.id.toLowerCase().includes(q) ||
        f.phone.includes(q)
      );
    }
    return filtered;
  }, [searchQuery, activeTab]);

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed top-[-10%] right-[-5%] w-[50rem] h-[50rem] bg-[#9234eb]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <h1 className="text-xl font-black text-slate-800 leading-none mb-1">My Funders</h1>
                 <p className="text-[10px] font-bold text-[#9234eb]/70 uppercase tracking-widest">Investor Rolodex</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-purple-100 shadow-sm w-full sm:w-auto">
             <Search size={18} className="text-[#9234eb]/40" />
             <input 
                type="text" 
                placeholder="Search VIPs or ID..." 
                className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 w-full sm:w-64 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* KPI Dashboard */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#9234eb] to-[#6a15ba] p-8 shadow-[0_20px_40px_-10px_rgba(146,52,235,0.3)] border border-white/10 text-white">
           <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4">
              <HandCoins size={180} strokeWidth={1} />
           </div>

           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div>
                 <p className="text-[10px] font-bold tracking-widest uppercase text-purple-200 mb-2 flex items-center gap-2">
                    <HandCoins size={14} /> Aggregate Managed Capital
                 </p>
                 <p className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter drop-shadow-md">
                    UGX {(dashboardStats.aggregateCapital / 1000000).toFixed(1)}<span className="text-2xl text-white/50 ml-1">M</span>
                 </p>
              </div>
              
              <div className="flex gap-8 md:justify-end pb-1 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8">
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1">Active VIPs</p>
                    <p className="text-3xl font-black">{dashboardStats.activeVips} <span className="text-xl font-normal text-white/50">/ {dashboardStats.totalFunders}</span></p>
                 </div>
              </div>
           </div>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 shadow-inner w-full sm:w-fit overflow-x-auto hide-scrollbar">
           {['All', 'Active Portfolio', 'Evaluating Pledge'].map(tab => (
              <button 
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-[#9234eb] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                 {tab === 'All' ? 'Complete Rolodex' : tab}
              </button>
           ))}
        </div>

        {/* Funder Rolodex Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {filteredFunders.length > 0 ? (
              filteredFunders.map((funder, idx) => (
                 <motion.div 
                    key={funder.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white rounded-[2rem] border border-purple-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
                 >
                    {/* Funder Header */}
                    <div className="flex justify-between items-start mb-6 border-b border-purple-50 pb-5">
                       <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-full border flex items-center justify-center shrink-0 ${funder.type === 'Corporate' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-purple-50 border-purple-100 text-[#9234eb]'}`}>
                             {funder.type === 'Corporate' ? <Building2 size={24} /> : <Users size={24} />}
                          </div>
                          <div>
                             <h3 className="font-black text-slate-800 text-lg leading-tight mb-0.5">{funder.name}</h3>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{funder.id} • {funder.type}</p>
                          </div>
                       </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Deployed Capital</p>
                          <p className="text-lg font-black text-slate-800 leading-none">
                             {funder.totalDeployed > 0 ? `UGX ${(funder.totalDeployed / 1000000).toFixed(1)}M` : 'UGX 0'}
                          </p>
                       </div>
                       <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Portfolio Status</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             {funder.status === 'Active Portfolio' && <CheckCircle2 size={14} className="text-emerald-500" />}
                             {funder.status === 'Evaluating Pledge' && <Clock size={14} className="text-amber-500" />}
                             {(funder.status === 'Paused') && <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />}
                             <span className={`text-xs font-bold ${funder.status === 'Active Portfolio' ? 'text-emerald-600' : funder.status === 'Evaluating Pledge' ? 'text-amber-600' : 'text-slate-500'}`}>
                                {funder.status}
                             </span>
                          </div>
                       </div>
                    </div>

                    {/* Quick Action Modules */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                       <div className="flex gap-2 w-full">
                          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-600 border border-slate-200 hover:border-green-200 rounded-xl text-xs font-bold transition-colors">
                             <Phone size={14} /> Call
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-bold transition-colors">
                             <MessageSquare size={14} /> SMS
                          </button>
                       </div>
                       
                       <button onClick={() => navigate('/agent-invest-partner')} className="w-12 h-12 shrink-0 bg-[#9234eb] text-white rounded-xl flex items-center justify-center shadow-md hover:bg-[#7b2cbf] transition-colors border border-purple-600 group-hover:scale-105 duration-300">
                           <ArrowRightCircle size={20} />
                       </button>
                    </div>

                 </motion.div>
              ))
           ) : (
              <div className="col-span-1 md:col-span-2 py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border border-slate-200">
                 <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-[#9234eb]/40 mb-4 border border-purple-100 shadow-inner">
                    <Users size={32} />
                 </div>
                 <h4 className="text-xl font-black text-slate-800 mb-2">No VIP Funders Found</h4>
                 <p className="text-sm font-semibold text-slate-500 max-w-sm">No investors match your current Rolodex filter criteria.</p>
              </div>
           )}
        </div>

      </main>
    </div>
  );
}
