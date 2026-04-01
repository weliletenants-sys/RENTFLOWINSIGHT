import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Handshake, Search, UserPlus, Users, MapPin, TrendingUp, CheckCircle2, Wallet, Link2, Copy, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Downline / Sub-Agent Data
type SubAgentStatus = 'Active Runner' | 'Suspended' | 'Pending Invite';

interface SubAgent {
  id: string;
  name: string;
  phone: string;
  territory: string;
  status: SubAgentStatus;
  commissionsEarnedForMe: number; // Volume of commission share kicked up from downline
  collectionsMasked: number;
}

const mockDownline: SubAgent[] = [
  { id: 'SA-9912', name: 'John Mugisha', phone: '+256 701 445566', territory: 'Najjera', status: 'Active Runner', commissionsEarnedForMe: 450000, collectionsMasked: 15 },
  { id: 'SA-9934', name: 'Betty Opolot', phone: '+256 772 889900', territory: 'Ntinda', status: 'Active Runner', commissionsEarnedForMe: 1250000, collectionsMasked: 42 },
  { id: 'SA-9955', name: 'Daniel Kasozi', phone: '+256 755 112233', territory: 'Kyanja', status: 'Pending Invite', commissionsEarnedForMe: 0, collectionsMasked: 0 },
  { id: 'SA-9901', name: 'Sarah Nampeera', phone: '+256 700 998877', territory: 'Kololo', status: 'Active Runner', commissionsEarnedForMe: 2100000, collectionsMasked: 105 },
];

export default function AgentRegisterSubAgent() {
  const navigate = useNavigate();
  
  // Registration Form State
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [territory, setTerritory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Downline KPIs
  const downlineStats = useMemo(() => {
    let totalOverride = 0;
    let activeRunners = 0;
    
    mockDownline.forEach(agent => {
       totalOverride += agent.commissionsEarnedForMe;
       if (agent.status === 'Active Runner') activeRunners++;
    });

    return { totalOverride, activeRunners, totalNetwork: mockDownline.length };
  }, []);

  const filteredDownline = useMemo(() => {
    if (searchQuery.trim() === '') return mockDownline;
    const q = searchQuery.toLowerCase();
    return mockDownline.filter(ag => 
       ag.name.toLowerCase().includes(q) || 
       ag.phone.includes(q) ||
       ag.territory.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name) return;
    
    setIsGenerating(true);
    // Simulate Backend Invite Provisioning
    setTimeout(() => {
       setInviteLink(`https://rentflow.io/join/ref-ax992-${Math.floor(Math.random() * 9999)}`);
       setIsGenerating(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite Link Copied!");
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-[#9234eb]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-8">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
           <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
              <ArrowLeft size={24} />
           </button>
           <div>
               <h1 className="text-xl font-black text-slate-800 leading-none mb-1">Downline Manager</h1>
               <p className="text-[10px] font-bold text-[#9234eb]/70 uppercase tracking-widest">Team Architecture</p>
           </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* Top Section: Form + KPI Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* Form Module */}
           <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-5 bg-white rounded-[2rem] p-8 shadow-sm border border-purple-100"
           >
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-[#9234eb] mb-6 border border-purple-100 shadow-inner">
                 <UserPlus size={28} />
              </div>
              
              <h2 className="text-2xl font-black text-slate-800 mb-1">Onboard Sub-Agent</h2>
              <p className="text-sm font-semibold text-slate-500 mb-8">Deploy a runner to a territory and earn an override commission on their rent collections.</p>

              <form onSubmit={handleGenerateInvite} className="space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#9234eb]/70 pl-1">Runner Name</label>
                    <input 
                       type="text" required
                       placeholder="e.g. John Kasozi"
                       value={name} onChange={e => setName(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-[#9234eb] focus:ring-2 focus:ring-[#9234eb]/20 transition-all placeholder:text-slate-400 placeholder:font-semibold"
                    />
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#9234eb]/70 pl-1">Mobile Number (WhatsApp)</label>
                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#9234eb] focus-within:ring-2 focus-within:ring-[#9234eb]/20 transition-all overflow-hidden relative">
                       <span className="flex items-center justify-center px-4 bg-slate-100/50 border-r border-slate-200 text-slate-500 font-bold text-sm shrink-0">
                          <Smartphone size={16} className="mr-1.5 text-slate-400" /> +256
                       </span>
                       <input 
                          type="tel" required
                          placeholder="772 123 456"
                          value={phone} onChange={e => setPhone(e.target.value)}
                          className="w-full bg-transparent text-slate-800 text-sm font-bold px-4 py-3 outline-none placeholder:text-slate-400 placeholder:font-semibold"
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#9234eb]/70 pl-1">Assigned Territory (Optional)</label>
                    <input 
                       type="text"
                       placeholder="e.g. Kololo Sector B"
                       value={territory} onChange={e => setTerritory(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-[#9234eb] focus:ring-2 focus:ring-[#9234eb]/20 transition-all placeholder:text-slate-400 placeholder:font-semibold"
                    />
                 </div>

                 {!inviteLink ? (
                    <button 
                       type="submit" 
                       disabled={isGenerating || !phone || !name}
                       className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-[#9234eb] hover:bg-[#7b2cbf] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-[#9234eb]/20"
                    >
                       {isGenerating ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Provisioning Link...</>
                       ) : (
                          <><Link2 size={18} /> Generate Invite Link</>
                       )}
                    </button>
                 ) : (
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                       className="mt-6 bg-purple-50 p-4 rounded-xl border border-purple-200 overflow-hidden"
                    >
                       <p className="text-[10px] font-black text-[#9234eb] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <CheckCircle2 size={12} /> Invite Link Ready
                       </p>
                       <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-purple-100 shadow-inner">
                          <input readOnly value={inviteLink} className="w-full bg-transparent outline-none text-xs font-bold text-slate-600 px-2" />
                          <button onClick={copyToClipboard} className="shrink-0 p-2 bg-[#9234eb] text-white rounded-md hover:bg-[#7b2cbf] transition-colors shadow-sm">
                             <Copy size={14} />
                          </button>
                       </div>
                    </motion.div>
                 )}
              </form>
           </motion.div>

           {/* KPI Metrics Dashboard */}
           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-7 flex flex-col gap-6"
           >
              {/* Massive Purple Hero KPI */}
              <div className="relative overflow-hidden flex-1 rounded-[2rem] bg-gradient-to-br from-[#9234eb] to-[#6a15ba] p-8 shadow-[0_20px_40px_-10px_rgba(146,52,235,0.3)] border border-white/10 text-white flex flex-col justify-center">
                 <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4">
                    <TrendingUp size={160} strokeWidth={1} />
                 </div>
                 
                 <div className="relative z-10 w-full mb-8">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-purple-200 mb-2 flex items-center gap-2">
                       <Wallet size={14} /> Downline Commission Overrides
                    </p>
                    <p className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter drop-shadow-md">
                       UGX {(downlineStats.totalOverride / 1000000).toFixed(2)}<span className="text-2xl text-white/50 ml-1">M</span>
                    </p>
                 </div>

                 <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
                    <div>
                       <p className="text-[10px] font-bold tracking-widest uppercase text-purple-200 mb-1">Active Runners</p>
                       <p className="text-3xl font-black">{downlineStats.activeRunners}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold tracking-widest uppercase text-purple-200 mb-1">Network Capacity</p>
                       <p className="text-3xl font-black">{downlineStats.totalNetwork} <span className="text-sm font-normal text-white/50">Total</span></p>
                    </div>
                 </div>
              </div>

              {/* Functional Search Block */}
              <div className="bg-white rounded-[2rem] p-4 flex items-center gap-3 border border-purple-100 shadow-sm shrink-0">
                 <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Search size={18} className="text-[#9234eb]/60" />
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search downline by Name or Number..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-semibold"
                 />
              </div>

           </motion.div>
        </div>

        {/* Existing Downline Roster */}
        <div>
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 px-2 mb-6 flex items-center gap-2">
              <Users size={16} className="text-[#9234eb]" /> Active Roster Ledger
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDownline.map((agent, index) => (
                 <motion.div 
                    key={agent.id}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#9234eb]/50 hover:shadow-md transition-all group"
                 >
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full border flex items-center justify-center bg-slate-50 text-slate-500 border-slate-200 shrink-0 group-hover:bg-purple-50 group-hover:text-[#9234eb] transition-colors`}>
                             <Handshake size={20} />
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-900 leading-tight">{agent.name}</h4>
                             <p className="text-xs font-semibold text-slate-500">{agent.phone}</p>
                          </div>
                       </div>
                       
                       <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest ${agent.status === 'Active Runner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {agent.status}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                       <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <MapPin size={14} className="text-[#9234eb]/70" /> {agent.territory}
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Override Earned</p>
                          <p className="text-sm font-black text-[#9234eb]">UGX {agent.commissionsEarnedForMe.toLocaleString()}</p>
                       </div>
                    </div>
                 </motion.div>
              ))}

              {filteredDownline.length === 0 && (
                 <div className="col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                    <Handshake size={32} className="text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-500">No downline sub-agents match your search query.</p>
                 </div>
              )}
           </div>

        </div>

      </main>
    </div>
  );
}
