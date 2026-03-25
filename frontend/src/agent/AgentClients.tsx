import { Search, Phone, Home, Wallet, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAssignedTenants } from '../services/agentApi';
import toast from 'react-hot-toast';

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
    c.property_address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <div className="relative flex min-h-screen w-full flex-col mx-auto overflow-x-hidden pb-24">
        
        {/* Header Section */}
        <header className="px-4 py-6 border-b border-primary/10">
          <h1 className="text-2xl font-bold">Your Clients</h1>
        </header>

        {/* Search Bar Section */}
        <div className="px-4 py-4 sticky top-[73px] bg-white dark:bg-background-dark z-10 border-b border-primary/5">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              className="w-full h-12 pl-10 pr-4 rounded-xl border-none bg-primary/5 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400" 
              placeholder="Find clients" 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Main Content: Client List */}
        <main className="flex-1 px-4 py-4">
          <div className="flex flex-col gap-3">
            {isLoading ? (
               <div className="p-8 text-center text-sm text-slate-500">Loading clients...</div>
            ) : filteredClients.length === 0 ? (
               <div className="p-8 text-center text-sm text-slate-500">No clients found.</div>
            ) : filteredClients.map((client: any) => (
              <div key={client.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-primary/5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-14 w-14 rounded-full bg-cover bg-center bg-slate-200 dark:bg-slate-700 shadow-inner" 
                    style={{ backgroundImage: `url('${client.profile_picture_url || 'https://via.placeholder.com/150'}')` }}
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{client.name || 'Unknown'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[180px]">{client.property_address || 'No property assigned'}</p>
                    <div className="mt-1">
                      {client.kyc_status === 'verified' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5"></span>
                          Verified KYC
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                          <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5"></span>
                          Pending Check
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => client.phone_number ? window.open(`tel:${client.phone_number}`) : toast.error('No phone number')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 active:scale-95 transition-all"
                >
                  <Phone size={20} className="fill-white" />
                </button>
              </div>
            ))}
          </div>
        </main>

      </div>

      <nav className="md:hidden sticky bottom-0 w-full bg-white dark:bg-[#221610] border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-50">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6c11d4] transition-colors">
          <Home size={24} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => navigate('/agent-wallet')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6c11d4] transition-colors">
          <Wallet size={24} />
          <span className="text-[10px] font-bold">Wallet</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6c11d4]">
          <Users size={24} />
          <span className="text-[10px] font-bold">Clients</span>
        </button>
        <button onClick={() => navigate('/dashboard/agent/settings')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6c11d4] transition-colors">
          <Settings size={24} />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
}
