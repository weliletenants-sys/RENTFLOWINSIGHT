import { Search, Phone, Users, UserPlus, MapPin, MoreVertical, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAssignedTenants } from '../services/agentApi';
import toast from 'react-hot-toast';
import AgentLayout from './components/AgentLayout';

export default function AgentClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAssignedTenants();
        setClients(data || []);
      } catch (err) {
        toast.error('Failed to load clients');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.property_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone_number?.includes(searchQuery)
  );

  return (
    <AgentLayout activePage="My Tenants" pageTitle="My Tenants">
      <div className="p-4 lg:p-8 w-full max-w-6xl mx-auto space-y-8 pb-32">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Your Tenants</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your assigned portfolio</p>
          </div>
          
          <button onClick={() => navigate('/agent-register-tenant')} className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_8px_30px_rgb(139,92,246,0.3)] active:scale-95">
             <UserPlus size={18} />
             Add New Tenant
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10 flex items-center justify-between mb-2">
                 <div className="text-purple-600 dark:text-purple-400"><Users size={24} /></div>
                 <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
              </div>
              <p className="relative z-10 text-3xl font-black text-slate-900 dark:text-white">{clients.length}</p>
              <p className="relative z-10 text-[10px] font-bold text-slate-500 tracking-[0.15em] uppercase mt-1">Total Assigned</p>
           </div>
           
           <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10 flex items-center justify-between mb-2">
                 <div className="text-emerald-500 dark:text-emerald-400"><MapPin size={24} /></div>
              </div>
              <p className="relative z-10 text-3xl font-black text-slate-900 dark:text-white">{new Set(clients.map(c => c.property_address).filter(Boolean)).size}</p>
              <p className="relative z-10 text-[10px] font-bold text-slate-500 tracking-[0.15em] uppercase mt-1">Unique Properties</p>
           </div>
        </div>

        {/* Search Bar Section */}
        <div className="relative max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#8b5cf6] transition-colors" size={20} />
          <input 
            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e1e1e] focus:ring-2 focus:ring-[#8b5cf6]/30 focus:border-[#8b5cf6] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm transition-all text-sm font-medium" 
            placeholder="Search by name, address, or phone..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Client Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-[32px] h-64 border border-slate-200 dark:border-slate-800"></div>
             ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-[32px] p-12 text-center border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
            <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-400 mb-6 border-8 border-white dark:border-[#121212] shadow-sm relative z-10">
               <Users size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Tenants Found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">We couldn't find any tenants matching your query in the current portfolio. Check your filters or add a new tenant.</p>
            {searchQuery && (
               <button onClick={() => setSearchQuery('')} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Clear Search Filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClients.map((client: any) => (
              <div key={client.id} className="group bg-white dark:bg-[#1e1e1e] rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
                 
                 <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                       <img 
                         src={client.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name || 'Tenant'}&backgroundColor=e2e8f0`}
                         alt={client.name}
                         className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-[#121212] shadow-sm bg-slate-100 dark:bg-slate-800"
                       />
                       <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#1e1e1e] ${client.kyc_status === 'verified' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 bg-slate-50 dark:bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                       <MoreVertical size={16} />
                    </button>
                 </div>

                 <div className="mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-[#8b5cf6] transition-colors">{client.name || 'Unknown'}</h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                       <span className={`w-1.5 h-1.5 rounded-full ${client.kyc_status === 'verified' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                       {client.kyc_status === 'verified' ? 'Verified Profile' : 'Pending Review'}
                    </p>
                 </div>

                 <div className="bg-slate-50 dark:bg-[#121212] rounded-[20px] p-4 mb-6 mt-auto border border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-start gap-3">
                       <MapPin size={16} className="text-[#8b5cf6] shrink-0 mt-0.5" />
                       <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">{client.property_address || 'Unassigned Property Location'}</p>
                    </div>
                 </div>

                 <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex items-center justify-between mt-auto">
                    <button 
                      onClick={() => client.phone_number ? window.open(`tel:${client.phone_number}`) : toast.error('No phone number')}
                      className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all active:scale-95"
                    >
                      <Phone size={18} />
                    </button>
                    
                    <button onClick={() => navigate(`/dashboard/agent/clients/${client.id}`)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                       View Details <ArrowRight size={16} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AgentLayout>
  );
}
