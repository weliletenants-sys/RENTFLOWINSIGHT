import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, Home, Briefcase, Building2, Handshake, 
  Wallet, CheckCircle2, UserCheck, Search, Bell, 
  Settings, Calendar, Download, MoreVertical, 
  ArrowUpRight, ArrowDownRight, PieChart, Activity,
  TrendingUp, HelpCircle, ShieldAlert, Landmark, Scale, PiggyBank
} from 'lucide-react';

export default function CeoFinancials() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
    <div className="bg-[var(--color-primary-faint)] min-h-screen font-inter text-slate-900 pb-12">
      
      {/* SideNavBar */}
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

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-20 bg-white/80 backdrop-blur-xl flex justify-between items-center px-10 z-40 border-b border-[var(--color-primary-light)]">
        <div className="flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search size={18} className="text-[var(--color-primary)] absolute left-4 top-1/2 -translate-y-1/2" />
            <input className="bg-[var(--color-primary-faint)] border border-[var(--color-primary-light)] rounded-full pl-11 pr-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-[var(--color-primary-light)] focus:bg-white transition-all outline-none" placeholder="Intelligence search..." type="text" />
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
              <p className="text-xs font-bold uppercase tracking-tight text-[var(--color-primary-darker)]">{profile?.full_name || 'Chief Executive'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">CEO</p>
            </div>
            <img alt="CEO Profile" className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary-light)]" src={profile?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDcIs4T8mIzNJqdWqABuqQuwVvr6_XXPjvrXNnQ-E3F3SeNfVMsgbO1lRsFHkoED8JI2CM1TBQtMdOmsFvGFTCvy8rt_o29mtoW6ocC-3W_Ri37A-U1gel2j1NdzjQnKThBr7IGCFtdrjxgO_JE0eHk29I0gYfda40aV4oeNWYoHazo_aLFDd_gAhjVSmSQjZAZWU1270VCAx8A9diNJ7S6xzzIZ3ICb43Ae9YKXBcE-suvbD8ScbypTWYhzVgw1-RKsgsZpoj5rPZk"} />
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="ml-64 pt-28 px-10 max-w-screen-2xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] font-inter">Institutional Status</span>
            <h2 className="text-4xl font-bold tracking-tight mt-2 text-slate-900 font-outfit">Financial Health</h2>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2.5 flex items-center gap-2 rounded-full text-xs font-bold text-slate-600 border border-[var(--color-primary-light)] shadow-sm">
              <Search size={16} className="text-[var(--color-primary)]" />
              Audited: Q3 2026
            </div>
          </div>
        </header>

        {/* Core Solvency Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Liquidity Buffer */}
          <div className="bg-[var(--color-primary-darker)] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <p className="text-[var(--color-primary-light)] text-sm font-bold uppercase tracking-widest mb-2">Liquidity Buffer Status</p>
                <h3 className="text-5xl font-bold font-outfit">$18.5M</h3>
              </div>
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm flex items-center justify-center rounded-2xl border border-white/20">
                <PiggyBank size={28} className="text-[var(--color-tertiary-fixed)]" />
              </div>
            </div>
            
            <div className="mt-8 relative z-10">
              <div className="flex justify-between text-sm font-bold mb-3 text-white">
                <span>Current Reserves vs Required</span>
                <span className="text-[var(--color-tertiary-fixed)]">142% Target Met</span>
              </div>
              <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="bg-[var(--color-tertiary-fixed)] h-full w-[100%] rounded-full relative">
                  <div className="absolute right-0 top-0 h-full w-[30%] bg-green-400 opacity-50"></div>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-xs font-bold text-white/70">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-tertiary-fixed)]"></span> Operational Requirement: $13M
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span> Surplus Coverage: $5.5M
                </div>
              </div>
            </div>
          </div>

          {/* Asset/Liabilty Ratio (Solvency) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest mb-2">Gearing / Solvency Ratio</p>
                <h3 className="text-5xl font-bold font-outfit text-slate-900">4.2x</h3>
              </div>
              <div className="w-14 h-14 bg-[var(--color-primary-faint)] flex items-center justify-center rounded-2xl border border-[var(--color-primary-light)] text-[var(--color-primary)]">
                <Scale size={28} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-[var(--color-primary-faint)] border border-[var(--color-primary-light)]">
                <p className="text-xs font-bold text-slate-500 mb-1">Total Assets</p>
                <p className="text-xl font-bold text-slate-900">$340.2M</p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs font-bold text-slate-500 mb-1">Total Liabilities</p>
                <p className="text-xl font-bold text-slate-900">$81.0M</p>
              </div>
            </div>
          </div>
          
        </section>

        {/* Risk Metrics */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <ShieldAlert size={20} className="text-[var(--color-warning)]" />
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Risk & Default Metrics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex justify-between text-sm font-bold mb-3">
                <span className="text-slate-600">Non-Performing Loans (NPL)</span>
                <span className="text-[var(--color-success)] bg-green-50 px-2 py-0.5 rounded-md">1.8%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[var(--color-success)] h-full w-[1.8%] rounded-full"></div>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-2">Target &lt; 3.0%</p>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-3">
                <span className="text-slate-600">Value at Risk (VaR 99%)</span>
                <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">$4.2M</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[var(--color-primary)] h-full w-[12%] rounded-full"></div>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-2">Max Expected Loss</p>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-3">
                <span className="text-slate-600">Capital Adequacy Ratio</span>
                <span className="text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-md">24.5%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[var(--color-primary)] h-full w-[24.5%] rounded-full"></div>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-2">Regulatory min 10%</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
