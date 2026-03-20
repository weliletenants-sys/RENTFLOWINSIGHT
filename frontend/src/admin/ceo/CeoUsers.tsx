import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, Home, Briefcase, Building2, Handshake, 
  Wallet, CheckCircle2, UserCheck, Search, Bell, 
  Settings, Calendar, Download, MoreVertical, 
  ArrowUpRight, ArrowDownRight, PieChart, Activity,
  TrendingUp, HelpCircle, Map, Target, ShieldCheck
} from 'lucide-react';

export default function CeoUsers() {
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
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] font-inter">Demographic Intel</span>
            <h2 className="text-4xl font-bold tracking-tight mt-2 text-slate-900 font-outfit">Users & Coverage</h2>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2.5 flex items-center gap-2 rounded-full text-xs font-bold text-slate-600 border border-[var(--color-primary-light)] shadow-sm">
              <Calendar size={16} className="text-slate-400" />
              Live Stats
            </div>
            <button className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-2.5 text-xs font-bold rounded-full hover:bg-[var(--color-primary-dark)] shadow-sm transition-all flex items-center gap-2 cursor-pointer">
              <Download size={16} />
              Export Roster
            </button>
          </div>
        </header>

        {/* Global User Base */}
        <section className="bg-[var(--color-primary)] rounded-3xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div>
              <p className="text-[var(--color-primary-light)] text-sm font-bold uppercase tracking-widest mb-2">Total Combined User Base</p>
              <h3 className="text-6xl font-bold font-outfit">1,240,892</h3>
              <div className="inline-flex items-center text-[var(--color-tertiary-fixed)] text-sm font-bold mt-4">
                <ArrowUpRight size={18} className="mr-1" /> Grew by 12,401 this week alone
              </div>
            </div>
            
            <div className="flex gap-6 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 flex-1 md:w-48">
                <Users size={24} className="text-[var(--color-primary-fixed)] mb-4" />
                <p className="text-white/70 text-sm font-bold mb-1">Tenants</p>
                <p className="text-3xl font-bold font-outfit">1.1M</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 flex-1 md:w-48">
                <Building2 size={24} className="text-[var(--color-tertiary-fixed)] mb-4" />
                <p className="text-white/70 text-sm font-bold mb-1">Landlords</p>
                <p className="text-3xl font-bold font-outfit">84.2K</p>
              </div>
            </div>
          </div>
        </section>

        {/* Demographics & Geographic Coverages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Active Agents & Staff */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-bold text-[var(--color-primary-darker)] font-outfit mb-6">Staffing & Field Reps</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[var(--color-primary-faint)] p-4 rounded-2xl border border-[var(--color-primary-light)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Internal Staff</h4>
                    <p className="text-xs font-bold text-slate-500">Corporate & Management</p>
                  </div>
                </div>
                <span className="text-2xl font-bold font-outfit">142</span>
              </div>

              <div className="flex justify-between items-center bg-[var(--color-primary-faint)] p-4 rounded-2xl border border-[var(--color-primary-light)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#c2410c] shadow-sm">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Field Agents</h4>
                    <p className="text-xs font-bold text-slate-500">Verification & Sales</p>
                  </div>
                </div>
                <span className="text-2xl font-bold font-outfit">5,201</span>
              </div>
              
              <div className="flex justify-between items-center bg-green-50 p-4 rounded-2xl border border-green-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[var(--color-success)] shadow-sm">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Agent Coverage Ratio</h4>
                    <p className="text-xs font-bold text-[var(--color-success)]">Optimum 1:210 spread</p>
                  </div>
                </div>
                <span className="text-2xl font-bold font-outfit text-[var(--color-success)]">94%</span>
              </div>
            </div>
          </div>

          {/* Map/Geographic Coverage Mock */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-primary-darker)] font-outfit">Geographic Penetration</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Tenant distribution by key operational zones</p>
              </div>
              <div className="p-2 bg-[var(--color-primary-faint)] text-[var(--color-primary)] rounded-xl border border-[var(--color-primary-light)]">
                <Map size={20} />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-900">Central Region</span>
                  <span className="text-[var(--color-primary)]">42% (521K)</span>
                </div>
                <div className="h-3 w-full bg-[var(--color-primary-faint)] rounded-full overflow-hidden border border-[var(--color-primary-light)]">
                  <div className="bg-[var(--color-primary)] h-full w-[42%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-900">Northern Zone</span>
                  <span className="text-[#0284c7]">28% (347K)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-[#0284c7] h-full w-[28%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-900">Western Dist.</span>
                  <span className="text-[var(--color-success)]">18% (223K)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-success)] h-full w-[18%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-900">Eastern Dist.</span>
                  <span className="text-amber-500">12% (149K)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[12%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
