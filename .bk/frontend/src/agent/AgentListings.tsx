import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Calendar, Share2, PenSquare, Eye, Clock, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Vacant properties for active listing pipeline
const mockListings = [
  { 
     id: 'LST_892', 
     title: '2BHK Luxury Apartment', 
     neighborhood: 'Najjera', 
     askingRent: 850000, 
     daysOnMarket: 12,
     views: 45,
     status: 'Available', 
     coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'
  },
  { 
     id: 'LST_441', 
     title: '1BHK Studio Kyanja', 
     neighborhood: 'Kyanja', 
     askingRent: 400000, 
     daysOnMarket: 4,
     views: 128,
     status: 'Under Offer', 
     coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1c24226133?w=500' 
  },
  { 
     id: 'LST_190', 
     title: '3BHK Family Home', 
     neighborhood: 'Bukoto', 
     askingRent: 1500000, 
     daysOnMarket: 22,
     views: 15,
     status: 'Available', 
     coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500' 
  }
];

export default function AgentListings() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Available' | 'Under Offer'>('All');

  // Compute Pipeline KPIs
  const pipelineStats = useMemo(() => {
    let totalGrossRent = 0;
    
    mockListings.forEach(list => {
       if(list.status !== 'Leased') totalGrossRent += list.askingRent;
    });

    // Assume 10% leasing broker commission on first month
    const potentialCommission = totalGrossRent * 0.10; 

    return {
      total: mockListings.length,
      available: mockListings.filter(l => l.status === 'Available').length,
      potentialCommission
    };
  }, []);

  const filteredListings = mockListings.filter(l => 
     activeFilter === 'All' ? true : l.status === activeFilter
  );

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed top-[-5%] left-[5%] w-[40rem] h-[40rem] bg-[#9234eb]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <h1 className="text-xl font-black text-[#9234eb] leading-none mb-1">Leasing Pipeline</h1>
                 <p className="text-[10px] font-bold text-[#9234eb]/50 uppercase tracking-widest">My Active Listings</p>
             </div>
          </div>
          
          <button className="flex items-center justify-center gap-2 bg-[#9234eb] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#9234eb]/30 hover:bg-[#6c11d4] transition-colors w-full sm:w-auto">
             <PenSquare size={16} /> List New Property
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* Gross Potential Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-tr from-slate-900 to-slate-800 p-8 md:p-10 shadow-lg text-white border border-slate-700"
           >
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-8 -translate-y-8">
                 <LayoutGrid size={240} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                 <div className="flex flex-wrap items-center gap-3 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-emerald-400">
                       <Tag size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-bold leading-tight">Gross Potential Commission</h2>
                       <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mt-1">10% Broker Fee Pipeline</p>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                       <p className="text-[10px] font-bold tracking-widest text-emerald-400/80 uppercase mb-2">Estimated Yield upon 100% Occupancy</p>
                       <p className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-md text-white">
                          UGX {(pipelineStats.potentialCommission).toLocaleString()}
                       </p>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Vacancy Distribution */}
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 flex flex-col justify-center gap-6"
           >
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center border border-slate-300 shrink-0">
                    <LayoutGrid size={24} />
                 </div>
                 <div>
                    <p className="text-3xl font-black text-slate-800 leading-none">{pipelineStats.total}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Total Active Listings</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                 <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                    <Tag size={24} />
                 </div>
                 <div>
                    <p className="text-3xl font-black text-emerald-700 leading-none">{pipelineStats.available}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70 mt-1">Immediately Available</p>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-b border-slate-200 pb-4">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 px-2">Marketplace Live</h3>
           
           <div className="flex bg-slate-200/50 p-1 rounded-full border border-slate-200 shadow-inner">
              {['All', 'Available', 'Under Offer'].map(status => (
                 <button 
                    key={status}
                    onClick={() => setActiveFilter(status as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    {status}
                 </button>
              ))}
           </div>
        </div>

        {/* Listings Matrix */}
        <div className="grid grid-cols-1 gap-6">
          {filteredListings.length > 0 ? (
             filteredListings.map((list, index) => (
                <motion.div 
                   key={list.id} 
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }}
                   className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#9234eb]/10 hover:border-[#9234eb]/30 transition-all duration-300 group flex flex-col md:flex-row overflow-hidden"
                >
                   {/* Left Side: Photo Container */}
                   <div className="w-full md:w-2/5 lg:w-1/3 relative h-56 md:h-auto overflow-hidden shrink-0">
                      <img src={list.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={list.title} />
                      
                      {/* Dynamic Status Badge Overlay */}
                      <div className={`absolute top-4 left-4 backdrop-blur-md text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-full shadow-md ${list.status === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                         {list.status}
                      </div>

                      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                         <Clock size={12} /> {list.daysOnMarket} Days on Market
                      </div>
                   </div>

                   {/* Right Side: Data & Control Panel */}
                   <div className="p-6 md:p-8 flex flex-col flex-1 w-full relative">
                      
                      <div className="flex justify-between items-start gap-4 mb-4">
                         <div>
                            <h3 className="font-black text-2xl text-slate-900 leading-tight mb-2 group-hover:text-[#9234eb] transition-colors">{list.title}</h3>
                            <p className="text-sm font-semibold text-slate-500 flex items-center gap-1.5"><Tag size={14}/> {list.neighborhood}, Kampala</p>
                         </div>
                         <div className="text-right shrink-0 bg-slate-50 py-2 px-4 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9234eb]/60 mb-1">Asking Rent</p>
                            <p className="text-xl font-black text-[#9234eb] leading-none">UGX {list.askingRent.toLocaleString()}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-8 px-1">
                         <span className="flex items-center gap-1"><Eye size={16} /> {list.views} Marketplace Views</span>
                         <span className="w-1 h-1 bg-slate-300 rounded-full" />
                         <span className="flex items-center gap-1"><Calendar size={16} /> Listed {list.daysOnMarket} days ago</span>
                      </div>
                      
                      {/* Action Engine */}
                      <div className="mt-auto grid grid-cols-2 gap-3">
                         <button className="flex items-center justify-center gap-2 bg-[#f7f9fa] hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl transition-colors w-full">
                            <PenSquare size={16} /> Edit Specs
                         </button>
                         <button className="flex items-center justify-center gap-2 bg-[#9234eb]/10 hover:bg-[#9234eb] border border-[#9234eb]/20 text-[#9234eb] hover:text-white font-bold px-4 py-3 rounded-xl transition-all w-full">
                            <Share2 size={16} /> Share Link
                         </button>
                      </div>

                   </div>
                </motion.div>
             ))
          ) : (
             <div className="bg-white rounded-[2rem] border border-slate-200 py-24 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
                   <Tag size={32} />
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">Filters Exhausted</h4>
                <p className="text-sm font-semibold text-slate-500">No active listings match your current view configuration.</p>
             </div>
          )}
        </div>

      </main>
    </div>
  );
}
