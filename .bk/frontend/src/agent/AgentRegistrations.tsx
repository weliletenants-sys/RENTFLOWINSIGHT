import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, UserPlus, CheckCircle2, Clock, Phone, Building2, User } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Onboarding History
type RegistrationRole = 'Tenant' | 'Landlord' | 'Sub-Agent';
type RegistrationStatus = 'Verified' | 'Pending Verification';

interface RegistrationRecord {
  id: string;
  name: string;
  phone: string;
  role: RegistrationRole;
  status: RegistrationStatus;
  date: string;
}

const mockRegistrations: RegistrationRecord[] = [
  { id: 'REG_092', name: 'Michael Kasule', phone: '+256 772 123456', role: 'Tenant', status: 'Verified', date: 'Oct 14, 2024' },
  { id: 'REG_091', name: 'Sarah Namagembe', phone: '+256 701 987654', role: 'Landlord', status: 'Verified', date: 'Oct 12, 2024' },
  { id: 'REG_090', name: 'David Ochieng', phone: '+256 752 345678', role: 'Sub-Agent', status: 'Pending Verification', date: 'Oct 11, 2024' },
  { id: 'REG_089', name: 'Grace Wanjiku', phone: '+256 788 567890', role: 'Tenant', status: 'Verified', date: 'Oct 09, 2024' },
  { id: 'REG_088', name: 'Peter Lwanga', phone: '+256 706 112233', role: 'Tenant', status: 'Pending Verification', date: 'Oct 08, 2024' },
  { id: 'REG_087', name: 'Estate Properties Ltd', phone: '+256 799 445566', role: 'Landlord', status: 'Verified', date: 'Oct 05, 2024' },
];

export default function AgentRegistrations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | RegistrationRole>('All');

  // Compute Onboarding KPIs
  const stats = useMemo(() => {
    return {
      total: mockRegistrations.length,
      tenants: mockRegistrations.filter(r => r.role === 'Tenant').length,
      landlords: mockRegistrations.filter(r => r.role === 'Landlord').length,
    };
  }, []);

  const filteredRegistrations = useMemo(() => {
    let filtered = mockRegistrations;
    if (activeTab !== 'All') {
      filtered = filtered.filter(r => r.role === activeTab);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.phone.includes(q) || 
        r.id.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [searchQuery, activeTab]);

  const getRoleIcon = (role: RegistrationRole) => {
    switch(role) {
      case 'Tenant': return <User size={18} />;
      case 'Landlord': return <Building2 size={18} />;
      case 'Sub-Agent': return <Users size={18} />;
    }
  };

  const getRoleColor = (role: RegistrationRole) => {
    switch(role) {
      case 'Tenant': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Landlord': return 'bg-purple-50 text-[#9234eb] border-purple-200';
      case 'Sub-Agent': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed top-[-5%] left-[5%] w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-indigo-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-indigo-500/50 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <h1 className="text-xl font-black text-indigo-900 leading-none mb-1">Historical Ledger</h1>
                 <p className="text-[10px] font-bold text-indigo-500/70 uppercase tracking-widest">My Registrations</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-indigo-100 shadow-sm w-full sm:w-auto">
             <Search size={18} className="text-indigo-400" />
             <input 
                type="text" 
                placeholder="Search names or phone..." 
                className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 w-full sm:w-48 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           {/* Total KPI */}
           <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200 flex items-center justify-between"
           >
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Onboarded</p>
                 <p className="text-3xl font-black text-slate-800 leading-none">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200">
                 <Users size={24} />
              </div>
           </motion.div>

           {/* Tenants KPI */}
           <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[1.5rem] p-6 shadow-md shadow-blue-500/20 text-white flex items-center justify-between"
           >
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mb-1">Tenant Volume</p>
                 <p className="text-3xl font-black text-white leading-none">{stats.tenants}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center">
                 <UserPlus size={24} />
              </div>
           </motion.div>

           {/* Landlords KPI */}
           <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-br from-[#9234eb] to-[#6a15ba] rounded-[1.5rem] p-6 shadow-md shadow-[#9234eb]/20 text-white flex items-center justify-between"
           >
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1">Landlord Reach</p>
                 <p className="text-3xl font-black text-white leading-none">{stats.landlords}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center">
                 <Building2 size={24} />
              </div>
           </motion.div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 shadow-inner w-full sm:w-fit overflow-x-auto hide-scrollbar">
           {['All', 'Tenant', 'Landlord', 'Sub-Agent'].map(tab => (
              <button 
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                 {tab === 'All' ? 'All Records' : tab + 's'}
              </button>
           ))}
        </div>

        {/* Data List (Vertical Ledger) */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
           {filteredRegistrations.length > 0 ? (
              <div className="flex flex-col">
                 {/* Internal Headers */}
                 <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="col-span-4">User Profile</div>
                    <div className="col-span-3">Role & Contact</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-2 text-right">Date Applied</div>
                 </div>

                 {filteredRegistrations.map((record, idx) => (
                    <motion.div 
                       key={record.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.3, delay: idx * 0.05 }}
                       className={`group flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-none`}
                    >
                       {/* Mobile Left / Desktop Col 1: Profile */}
                       <div className="col-span-4 flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${getRoleColor(record.role)}`}>
                             {getRoleIcon(record.role)}
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-900 leading-tight">{record.name}</h3>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{record.id}</p>
                          </div>
                       </div>

                       {/* Mobile Mid / Desktop Col 2: Role & Phone */}
                       <div className="col-span-3 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-1 inline-block ${getRoleColor(record.role)}`}>
                             {record.role}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                             <Phone size={12} /> {record.phone}
                          </span>
                       </div>

                       {/* Quality / Status Col */}
                       <div className="col-span-3 flex items-center">
                          {record.status === 'Verified' ? (
                             <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full outline outline-1 outline-emerald-200">
                                <CheckCircle2 size={14} /> Verified
                             </div>
                          ) : (
                             <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full outline outline-1 outline-amber-200">
                                <Clock size={14} /> Pending Auth
                             </div>
                          )}
                       </div>

                       {/* Date Col */}
                       <div className="col-span-2 flex justify-between md:justify-end items-center">
                          <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-widest">Joined</span>
                          <span className="text-sm font-semibold text-slate-600">{record.date}</span>
                       </div>
                    </motion.div>
                 ))}
              </div>
           ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-100 shadow-inner">
                    <Search size={32} />
                 </div>
                 <h4 className="text-xl font-black text-slate-800 mb-2">No Registrations Found</h4>
                 <p className="text-sm font-semibold text-slate-500 max-w-sm">We couldn't locate any user onboarding records matching your current filter or search criteria.</p>
              </div>
           )}
        </div>

      </main>
    </div>
  );
}
