import { Search, Phone, Home, Wallet, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AgentClients() {
  const navigate = useNavigate();
  
  const clients = [
    {
      id: 1,
      name: 'Sarah Miller',
      property: 'Maple Heights - Unit 402',
      status: 'Paid',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4D-_zS_aE1oTP0WvNoLRqXxYR2xXRtEp9gaBrGgQ7VguPW8A3uqC0LRwutHtPcrnYNcPOX5cO8ZUY8lCVKQ-jMad0YVi0MhNB8JtKvxcuo7ztfunDpfujTvYfVtPptqISQFf8QI7Mzc2wnrL61p1mBnV50Fy-068mC4yDTGck4qau7LRlVYUfhoDXesLud-7XXpA8_qu0xsKjlQ9tiE9McEpqRLEINMHVd81DHQoqnrQ3qz4JupdRkGth9eGdmPiQoZKAfJ9NHAI'
    },
    {
      id: 2,
      name: 'Marcus Chen',
      property: 'Oak Ridge Apartments - #12B',
      status: 'Not Paid',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz3Ta3YYBPS1FRLSJQ_wH2tgTcu5fzcGgrXSOF1Jif-I9Dr-I8y0D2fbpMId33W_-cSOEUgGdGPZ3gCsGqaZBlZds5STY-MUD8jaTIBRwUWHvmPBVlfVbumKBJwy0-IIdn1bhUOhabX8ckwbD2c4KnuOsye6I_tIgMNAgWgOzwZLl_jkxKM72cjbWfXwbcfz5PCJmunZ7S_w92xc971LrHxZykI2Z8BKKtCeradQrokea3jhzWFzHbIvmgVHtmygpRXBqzNsvOgTc'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      property: 'Sunset Villas - Villa 7',
      status: 'Paid',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuh3xUkA3Psmjiyh-6QcO0tiQXgvBIlpKtIFg9kKn7L0M-4Qd_VuOXs4LqwYKHQBL36GgJ7rsAoiEegxELqw6bcUMu4TmkYxKNtY21X9MlbKLb7ACmJStWParqC-vgxFKWr9Oyyn9XANgZAJw8AWwOMfI_BV2j0PCTIAaRuiWirUBroaMtyFLQDYsfeZH-pcNKYCYZ_qmQ6_dD6pBYNGxuFSXRXsN8_DWa2CnbCSu4UDPo43WNuMXwpS_LEOCTSOuqFHZNZ4I9YzE'
    },
    {
      id: 4,
      name: 'Jordan Smith',
      property: 'Maple Heights - Unit 105',
      status: 'Paid',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnX2kCGcVvb6Su_JlsVFFu97IYDrHfQEr8MUk3L_gyS0txQ64Pan1Q25tOYHWvPf0HoW7Uo0gJdkMGOu_ncurh4-SVYnL55dROR6hZiCr9tOXH4zTid9Tj1H0eph3XkBD0gbM1PJm6Ug6PtznrX79f0u4SFbgoLR05HSBzI3vkhbXY1xUxHkdAXb27KjWETwYzfgXBjnk5PuEhLJeG3mHdahglMBXVUs7an1D-5smzS9jUvsatYYhIAH_Ea1m2Y28--r-LB2UaxWs'
    }
  ];

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
            />
          </div>
        </div>

        {/* Main Content: Client List */}
        <main className="flex-1 px-4 py-4">
          <div className="flex flex-col gap-3">
            {clients.map(client => (
              <div key={client.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-primary/5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-14 w-14 rounded-full bg-cover bg-center shadow-inner" 
                    style={{ backgroundImage: `url('${client.image}')` }}
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{client.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{client.property}</p>
                    <div className="mt-1">
                      {client.status === 'Paid' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5"></span>
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                          <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5"></span>
                          Not Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 active:scale-95 transition-all">
                  <Phone size={20} className="fill-white" />
                </button>
              </div>
            ))}
          </div>
        </main>

      </div>

      <nav className="md:hidden sticky bottom-0 w-full bg-white dark:bg-[#221610] border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-50">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9] transition-colors">
          <Home size={24} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => navigate('/agent-wallet')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9] transition-colors">
          <Wallet size={24} />
          <span className="text-[10px] font-bold">Wallet</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6d28d9]">
          <Users size={24} />
          <span className="text-[10px] font-bold">Clients</span>
        </button>
        <button onClick={() => navigate('/dashboard/agent/settings')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9] transition-colors">
          <Settings size={24} />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
}
