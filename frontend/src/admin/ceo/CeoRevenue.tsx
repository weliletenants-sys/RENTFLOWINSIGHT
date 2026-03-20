import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, Home, Briefcase, Building2, Handshake, 
  Wallet, CheckCircle2, UserCheck, Search, Bell, 
  Settings, Calendar, Download, MoreVertical, 
  ArrowUpRight, ArrowDownRight, PieChart, Activity,
  TrendingUp, HelpCircle, BarChart3, LineChart, DollarSign
} from 'lucide-react';

export default function CeoRevenue() {
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
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] font-inter">Financial Intel</span>
            <h2 className="text-4xl font-bold tracking-tight mt-2 text-slate-900 font-outfit">Revenue & Growth</h2>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2.5 flex items-center gap-2 rounded-full text-xs font-bold text-slate-600 border border-[var(--color-primary-light)] shadow-sm">
              <Calendar size={16} className="text-slate-400" />
              YTD 2026
            </div>
          </div>
        </header>

        {/* Top KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-sm font-bold">Total Platform Revenue</span>
              <div className="p-2 bg-green-50 text-[var(--color-success)] rounded-full">
                <Wallet size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-bold font-outfit text-slate-900 mb-2"><span className="text-2xl text-slate-400 mr-1">$</span>42.8M</h3>
            <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
              <ArrowUpRight size={14} className="mr-1" /> +18.4% vs last year
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-sm font-bold">Total Capital Raised</span>
              <div className="p-2 bg-[#e0f2fe] text-[#0284c7] rounded-full">
                <DollarSign size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-bold font-outfit text-slate-900 mb-2"><span className="text-2xl text-slate-400 mr-1">$</span>156.2M</h3>
            <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
              <ArrowUpRight size={14} className="mr-1" /> +32.1% vs last year
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-sm font-bold">Av. Monthly MRR</span>
              <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full">
                <LineChart size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-bold font-outfit text-slate-900 mb-2"><span className="text-2xl text-slate-400 mr-1">$</span>3.56M</h3>
            <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
              <ArrowUpRight size={14} className="mr-1" /> +4.2% MoM
            </div>
          </div>
        </section>

        {/* Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trends Area Chart Mock */}
          <section className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-primary-darker)] font-outfit">Revenue Trajectory</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">6-month trailing platform fee credits</p>
              </div>
              <div className="p-2 bg-[var(--color-primary-faint)] text-[var(--color-primary)] rounded-xl border border-[var(--color-primary-light)]">
                <BarChart3 size={20} />
              </div>
            </div>
            <div className="h-64 flex items-end gap-3 w-full border-b border-slate-100 pb-2 relative">
              {/* Fake grid lines */}
              <div className="absolute w-full h-full flex flex-col justify-between opacity-10 pointer-events-none">
                <div className="border-b border-slate-900 w-full h-0"></div>
                <div className="border-b border-slate-900 w-full h-0"></div>
                <div className="border-b border-slate-900 w-full h-0"></div>
                <div className="border-b border-slate-900 w-full h-0"></div>
              </div>
              
              <div className="w-full h-[40%] bg-[var(--color-primary-light)] rounded-t-lg relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$2.1M</div>
              </div>
              <div className="w-full h-[45%] bg-[var(--color-primary-light)] rounded-t-lg relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$2.3M</div>
              </div>
              <div className="w-full h-[55%] bg-[var(--color-primary-light)] rounded-t-lg relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$2.8M</div>
              </div>
              <div className="w-full h-[60%] bg-[var(--color-primary-light)] rounded-t-lg relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$3.1M</div>
              </div>
              <div className="w-full h-[85%] bg-[var(--color-primary)] rounded-t-lg relative group shadow-md text-center">
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-bold text-xs">$4.4M</div>
              </div>
              <div className="w-full h-[70%] bg-[var(--color-primary-light)] rounded-t-lg relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$3.6M</div>
              </div>
            </div>
            <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span className="text-[var(--color-primary)]">Sep</span>
              <span>Oct</span>
            </div>
          </section>

          {/* Capital Raised & Repayments */}
          <section className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-primary-darker)] font-outfit">Capital Efficiency</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Funds deployment vs Repayment</p>
              </div>
              <div className="p-2 bg-green-50 text-[var(--color-success)] rounded-xl border border-green-100">
                <Activity size={20} />
              </div>
            </div>
            
            <div className="flex-1 space-y-8 mt-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-3">
                  <span className="text-slate-600">Total Invested (Deployments)</span>
                  <span className="text-slate-900">$312.4M</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-[#0284c7] h-full w-[100%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-3">
                  <span className="text-slate-600">Total Repaid (Principal & Interest)</span>
                  <span className="text-[var(--color-success)]">$301.2M</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-success)] h-full w-[96.4%] rounded-full"></div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-[var(--color-primary-light)]">
                <div className="flex justify-between text-sm font-bold mb-3">
                  <span className="text-slate-600">Expected Yield Output</span>
                  <span className="text-[var(--color-primary)]">14.2%</span>
                </div>
                <div className="h-4 w-full bg-[var(--color-primary-light)] rounded-full overflow-hidden">
                  <div className="bg-[var(--color-primary)] h-full w-[14.2%] rounded-full"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
