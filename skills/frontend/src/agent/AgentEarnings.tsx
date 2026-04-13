import { Bell, MapPin, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AgentEarnings() {
  const { user } = useAuth();
  
  const transactions = [
    {
      id: 1,
      name: 'Sarah Miller',
      property: 'Maple Heights - Unit 402',
      amount: '+ 50,000 UGX',
      date: 'Oct 24, 2023'
    },
    {
      id: 2,
      name: 'David Chen',
      property: 'Oak Ridge Villas - B12',
      amount: '+ 75,000 UGX',
      date: 'Oct 22, 2023'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      property: 'Skyline Apartments - 15C',
      amount: '+ 45,000 UGX',
      date: 'Oct 20, 2023'
    },
    {
      id: 4,
      name: 'James Wilson',
      property: 'The Atrium - Unit 104',
      amount: '+ 60,000 UGX',
      date: 'Oct 18, 2023'
    },
    {
      id: 5,
      name: 'Amara Okafor',
      property: 'Riverview Lofts - A02',
      amount: '+ 55,000 UGX',
      date: 'Oct 15, 2023'
    }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <div className="relative flex min-h-screen w-full flex-col mx-auto overflow-x-hidden pb-24">
        
        {/* Header Section */}
        <header className="flex items-center justify-between p-4 pt-6 bg-white dark:bg-slate-900 border-b border-primary/10 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div 
              className="size-12 rounded-full bg-cover bg-center border-2 border-primary/20" 
              style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkaR8cAQopFMlRqleNiFix4BeuhKEpxvd5WYSQnz5T-qO3oq6U0hpd6Wyqj8hQA5PJo3W5C0ZtB951MGV9eJfJ2I3tFmVaVfCaBJ5vo3iobPf2wzR7AUIVMtdA4r0y630WaSx6rbHbn9N3CoXrUIZBlS_i7EAAyDxw4VC2fHxiy7Y5gzoPLFxhNm-9ru7fExpZdtBVnG5x0tsKsGlLiff-rd-h0twrBz28Q2Jeu9kDHEQMVq-_7j-1QajlVVuhNCWxUTisCNIKYSA")` }}
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight tracking-tight">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Alex Johnson'}
              </h1>
              <span className="text-xs font-bold text-primary tracking-widest uppercase">Agent</span>
            </div>
          </div>
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 text-slate-600 dark:text-slate-400 transition-colors">
            <Bell size={24} />
          </button>
        </header>

        {/* Earnings Card Section */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-white shadow-lg shadow-primary/20">
            {/* Abstract Pattern Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="absolute top-0 right-0 flex items-center gap-1 rounded-full bg-white/20 border border-white/10 px-3 py-1">
                <Star size={14} className="text-white fill-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-tight">Silver Agent</span>
              </div>
              
              <p className="text-primary-100 text-sm font-medium opacity-90">Total Earnings</p>
              <p className="text-[10px] text-white/70 font-medium uppercase tracking-wider mb-1">Since Oct 2023</p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight">2,500,000 UGX</h2>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between px-4 py-2 mt-2">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Commission Received</h3>
          <button className="text-sm font-semibold text-primary">View All</button>
        </div>

        {/* Commission List */}
        <div className="flex flex-col gap-px bg-slate-100 dark:bg-slate-800">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 border-b border-primary/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{tx.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tx.property}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{tx.amount}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-grow"></div>
      </div>
    </div>
  );
}
