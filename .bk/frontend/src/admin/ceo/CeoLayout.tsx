import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, Wallet, Activity, TrendingUp, PieChart,
  Settings, HelpCircle, Search, Bell
} from 'lucide-react';

export default function CeoLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || (location.pathname === '/ceo' && path === '/ceo/dashboard');

  const NavLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 ${isActive(to) ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold' : 'text-slate-500 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] font-medium'}`}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="bg-white min-h-screen font-inter text-slate-900 pb-12">
      <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-white border-r border-[var(--color-primary-light)] flex flex-col py-8 px-6 z-50">
        <div className="mb-10">
          <img src="/welile-colored.png" alt="Welile Logo" className="h-[40px] w-auto mb-1" />
        </div>
        <nav className="flex-1 space-y-2">
          <NavLink to="/ceo/dashboard" icon={PieChart} label="Overview" />
          <NavLink to="/ceo/revenue" icon={Wallet} label="Revenue" />
          <NavLink to="/ceo/users" icon={Users} label="Users" />
          <NavLink to="/ceo/financials" icon={Activity} label="Financials" />
          <NavLink to="/ceo/performance" icon={TrendingUp} label="Performance" />
        </nav>
        <div className="mt-auto pt-8 space-y-2">
          <select 
            className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-3 px-4 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-darker)] transition-all shadow-sm mb-6 appearance-none cursor-pointer text-center outline-none"
            onChange={(e) => {
               if (e.target.value) navigate(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>Switch Dashboard</option>
            <option value="/ceo/dashboard">CEO Dashboard</option>
            <option value="/coo/dashboard">COO Dashboard (View Only)</option>
            <option value="/cfo/dashboard">CFO Dashboard (View Only)</option>
          </select>
          <a className="flex items-center gap-3 py-2 px-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors" href="#">
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </a>
          <a className="flex items-center gap-3 py-2 px-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors" href="#">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Support</span>
          </a>
        </div>
      </aside>

      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-20 bg-white/80 backdrop-blur-xl flex justify-between items-center px-10 z-40 border-b border-[var(--color-primary-light)]">
        <div className="flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search size={18} className="text-[var(--color-primary)] absolute left-4 top-1/2 -translate-y-1/2" />
            <input className="bg-white border-2 border-[var(--color-primary-faint)] rounded-full pl-11 pr-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none" placeholder="Intelligence search..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-2 text-slate-400 hover:text-[var(--color-primary)] bg-[var(--color-primary-faint)] hover:bg-[var(--color-primary-light)] rounded-full relative transition-all">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-400 hover:text-[var(--color-primary)] bg-[var(--color-primary-faint)] hover:bg-[var(--color-primary-light)] rounded-full transition-all">
            <Settings size={20} />
          </button>
          
          <div className="h-8 w-px bg-[var(--color-primary-light)] mx-2"></div>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-tight text-[var(--color-primary-darker)]">
                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Chief Executive'}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">CEO</p>
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 pt-28 px-10 max-w-screen-2xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
