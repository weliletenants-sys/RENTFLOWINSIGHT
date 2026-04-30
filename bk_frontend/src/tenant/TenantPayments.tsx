import { useState, useEffect } from 'react';
import { ChevronDown, CreditCard, History, User as UserIcon, Bell, Home as HomeIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTenantActivities } from '../services/tenantApi';

export default function TenantPayments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    getTenantActivities()
      .then(setActivities)
      .catch(console.error);
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark overflow-x-hidden shadow-xl">

        {/* Header */}
        <header className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-primary/10">
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20"
              style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6R5HPhJXZxRB0t26SKyTNV5tUjEB5ba_DKq-L_O39T1cdqIk7_VHMjJKMaXf8LhvJ54PyjOVWESWusSiqgRc_zQGWgOFh7GONkZ1r9MyG41JtG71_bUfTOhHL1QL47fH1yAHJAWZtroFTpz43fa6sb1XFKfLITqOkpApT1XtBs5x7f9ihCxIYP8RmS8zglODtpdBhdzmx25yw20hygTGWwrZy-XgNenRRGm0dScRb9SFL2jllxD1yars1yK0sn20W1g_R7XsW70k")` }}
            ></div>
            <div className="flex flex-col">
              <h2 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight tracking-tight">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Alex Johnson'}
              </h2>
              <p className="text-primary text-xs font-medium">Tenant</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button className="flex items-center justify-center rounded-full size-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Page Title & Filter */}
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your rent and transaction history</p>
        </div>

        {/* Monthly Filter */}
        <div className="flex gap-3 p-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-primary px-4 text-white shadow-sm">
            <span className="text-sm font-semibold">June 2024</span>
            <ChevronDown size={20} />
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 text-slate-700 dark:text-slate-300">
            <span className="text-sm font-medium">May 2024</span>
            <ChevronDown size={20} />
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 text-slate-700 dark:text-slate-300">
            <span className="text-sm font-medium">April 2024</span>
            <ChevronDown size={20} />
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 text-slate-700 dark:text-slate-300">
            <span className="text-sm font-medium">March 2024</span>
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Transactions List */}
        <div className="flex-1 px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold tracking-tight">Recent Transactions</h3>
            <button className="text-primary text-sm font-semibold">See All</button>
          </div>

          {/* Transaction Items */}
          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className={`flex items-center justify-center rounded-full shrink-0 size-12 ${act.type === 'payment' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-600'}`}>
                    {act.type === 'payment' ? <CreditCard size={24} /> : <History size={24} />}
                  </div>
                  <div className="flex flex-1 flex-col justify-center min-w-0">
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-bold truncate">{act.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wider">Completed</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">System generated</p>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-1 font-medium uppercase tracking-wide">
                      {new Date(act.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-base font-bold ${act.type === 'deposit' ? 'text-green-600' : 'text-slate-900 dark:text-slate-100'}`}>
                      {act.type === 'deposit' ? '+' : '-'}${Math.abs(act.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic p-4 text-center">No recent transactions to display.</p>
            )}
          </div>
        </div>

        {/* Spacer for nav */}
        <div className="h-20"></div>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex items-center justify-around border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-4 pb-6 pt-2 z-20">
          <button
            onClick={() => navigate('/dashboard/tenant')}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors \${location.pathname === '/dashboard/tenant' ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}
          >
            <HomeIcon size={24} />
            <p className="text-[10px] font-bold leading-normal uppercase tracking-widest">Home</p>
          </button>

          <button
            onClick={() => navigate('/dashboard/tenant/payments')}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors \${location.pathname.includes('/payments') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}
          >
            <div className="relative">
              <CreditCard size={24} />
              {location.pathname.includes('/payments') && (
                <span className="absolute -top-1 -right-1 size-1.5 bg-primary rounded-full"></span>
              )}
            </div>
            <p className="text-[10px] font-bold leading-normal uppercase tracking-widest">Payments</p>
          </button>

          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">
            <History size={24} />
            <p className="text-[10px] font-bold leading-normal uppercase tracking-widest">History</p>
          </button>

          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">
            <UserIcon size={24} />
            <p className="text-[10px] font-bold leading-normal uppercase tracking-widest">Profile</p>
          </button>
        </nav>
      </div>
    </div>
  );
}
