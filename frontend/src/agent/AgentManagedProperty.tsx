import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Users, Wallet, ChevronRight, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock active properties mapped to the agent
const mockProperties = [
  { 
     id: 'PR_1042', 
     name: 'Ntinda Commercial Plaza', 
     address: 'Plot 18, Ntinda Road, Kampala', 
     monthlyRent: 850000, 
     activeTenants: 14, 
     totalUnits: 15, 
     image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500'
  },
  { 
     id: 'PR_881', 
     name: 'Kololo Prestige Heights', 
     address: 'Avenue 4, Kololo, Kampala', 
     monthlyRent: 1200000, 
     activeTenants: 8, 
     totalUnits: 8, 
     image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500' 
  },
  { 
     id: 'PR_219', 
     name: 'Muyenga Executive Suites', 
     address: 'Tank Hill Road, Muyenga', 
     monthlyRent: 650000, 
     activeTenants: 5, 
     totalUnits: 6, 
     image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500' 
  }
];

export default function AgentManagedProperty() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // The 2% Engine Computation
  const portfolioStats = useMemo(() => {
    let totalRentVolume = 0;
    let totalTenants = 0;
    
    mockProperties.forEach(prop => {
      totalRentVolume += (prop.monthlyRent * prop.activeTenants);
      totalTenants += prop.activeTenants;
    });

    const recurringCommission = totalRentVolume * 0.02; // 2% Agent Cut

    return {
      volume: totalRentVolume,
      tenants: totalTenants,
      commission: recurringCommission
    };
  }, []);

  const filteredProperties = mockProperties.filter(prop => 
    prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed top-[-10%] right-[10%] w-[35rem] h-[35rem] bg-[#9234eb]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <h1 className="text-xl font-black text-[#9234eb] leading-none mb-1">Portfolio Manager</h1>
                 <p className="text-[10px] font-bold text-[#9234eb]/50 uppercase tracking-widest">Managed Properties</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 bg-[#f7f9fa] px-4 py-2.5 rounded-2xl border border-purple-100 shadow-sm w-full md:w-auto">
             <Search size={18} className="text-[#9234eb]/40" />
             <input 
                type="text" 
                placeholder="Search properties or locations..." 
                className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 w-full md:w-64 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* The 2% Commission Architecture Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#9234eb] to-[#6a15ba] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(146,52,235,0.3)] text-white border border-white/10"
           >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-12 -translate-y-12">
                 <Wallet size={200} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                       <Wallet size={24} className="text-white" />
                    </div>
                    <div>
                       <h2 className="text-xl font-bold leading-tight">Monthly Retained Yield</h2>
                       <p className="text-[10px] font-black tracking-widest uppercase text-white/60 mt-1">Agent 2% Commission Cut</p>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                       <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-2">Calculated Off Aggregate Volume</p>
                       <p className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-md">
                          UGX {(portfolioStats.commission).toLocaleString()}
                       </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 flex flex-col items-center justify-center shrink-0">
                       <p className="text-sm font-bold text-white/70 mb-1">Total Volume</p>
                       <p className="text-xl font-black">UGX {(portfolioStats.volume / 1000000).toFixed(1)}M</p>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Global Portfolio KPI Data */}
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-purple-100 flex flex-col justify-center gap-6"
           >
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f7f9fa] border border-slate-100">
                 <div className="w-12 h-12 rounded-full bg-purple-50 text-[#9234eb] flex items-center justify-center border border-purple-100 shrink-0">
                    <Building2 size={24} />
                 </div>
                 <div>
                    <p className="text-3xl font-black text-slate-800 leading-none">{mockProperties.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Managed Properties</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f7f9fa] border border-slate-100">
                 <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shrink-0">
                    <Users size={24} />
                 </div>
                 <div>
                    <p className="text-3xl font-black text-slate-800 leading-none">{portfolioStats.tenants}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Active Tenants</p>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Directory Title */}
        <div className="flex items-center justify-between pt-4 px-2">
           <h3 className="text-sm font-black uppercase tracking-widest text-[#9234eb]">Property Directory</h3>
           <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filteredProperties.length} Locations</span>
        </div>

        {/* Horizontal Property Listing Matrix */}
        <div className="flex flex-col gap-6">
          {filteredProperties.length > 0 ? (
             filteredProperties.map((prop, index) => (
                <motion.div 
                   key={prop.id} 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                   className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(146,52,235,0.15)] hover:border-[#9234eb]/30 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row overflow-hidden"
                >
                   {/* Image Container */}
                   <div className="w-full sm:w-2/5 md:w-1/3 relative overflow-hidden shrink-0">
                      <img src={prop.image} className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt={prop.name} />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[10px] uppercase tracking-widest font-black text-[#9234eb] px-4 py-2 rounded-full shadow-sm shadow-[#9234eb]/20">
                         {prop.activeTenants} / {prop.totalUnits} Units Filled
                      </div>
                   </div>

                   {/* Data Container */}
                   <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="mb-6">
                         <h3 className="font-black text-2xl text-slate-900 leading-tight mb-3 group-hover:text-[#9234eb] transition-colors">{prop.name}</h3>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 rounded-lg px-3 py-2 bg-slate-50 w-fit">
                            <MapPin size={12} className="text-slate-500" /> 
                            <span>{prop.address}</span>
                         </div>
                      </div>
                      
                      {/* Sub Data Panel */}
                      <div className="mt-auto bg-[#f7f9fa] border border-slate-100 rounded-[1.5rem] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                         <div className="grid grid-cols-2 gap-8">
                            <div>
                               <p className="text-[10px] font-bold uppercase tracking-widest text-[#9234eb]/60 mb-1">Base Monthly Rent</p>
                               <p className="text-xl font-black text-[#9234eb] leading-none">UGX {prop.monthlyRent.toLocaleString()}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold uppercase tracking-widest text-[#9234eb]/60 mb-1">Property ID</p>
                               <p className="text-sm font-black text-slate-700 mt-1">{prop.id}</p>
                            </div>
                         </div>
                         <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#9234eb] group-hover:bg-[#9234eb] group-hover:text-white transition-all transform group-hover:scale-110 shrink-0 self-end sm:self-auto">
                            <ChevronRight size={20} />
                         </div>
                      </div>
                   </div>
                </motion.div>
             ))
          ) : (
             <div className="bg-white rounded-[2rem] border border-purple-100 py-20 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-[#9234eb] mb-4">
                   <Building2 size={32} />
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">No Properties Found</h4>
                <p className="text-sm font-semibold text-slate-500">We couldn't locate any managed properties matching your search query.</p>
             </div>
          )}
        </div>

      </main>
    </div>
  );
}
