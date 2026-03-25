import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, CreditCard, Wallet, 
  BarChart2, FileText, AlertTriangle, Briefcase, Activity, 
  List, HelpCircle, LogOut, Sun, Moon, User, X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useDarkMode } from '../../../hooks/useDarkMode';

interface COOSidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const COOSidebar: React.FC<COOSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const [isDark, setIsDark] = useDarkMode();

  const financialLinks = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/coo/overview' },
    { name: 'Transactions', icon: <List size={20} />, path: '/coo/transactions' },
    { name: 'Wallet', icon: <Wallet size={20} />, path: '/coo/wallets' },
    { name: 'Collections', icon: <Briefcase size={20} />, path: '/coo/collections' },
    { name: 'Analytics', icon: <BarChart2 size={20} />, path: '/coo/analytics' },
  ];

  const governanceLinks = [
    { name: 'Reports', icon: <FileText size={20} />, path: '/coo/reports' },
    { name: 'All Users', icon: <Users size={20} />, path: '/coo/users' },
    { name: 'Alerts', icon: <AlertTriangle size={20} />, path: '/coo/alerts' },
    { name: 'Withdrawals', icon: <CreditCard size={20} />, path: '/coo/withdrawals' },
    { name: 'Partners', icon: <Users size={20} />, path: '/coo/partners' },
    { name: 'Tenants', icon: <User size={20} />, path: '/coo/tenants' },
    { name: 'Opportunities', icon: <Home size={20} />, path: '/coo/opportunities' },
    { name: 'Staff Performance', icon: <Activity size={20} />, path: '/coo/staff-performance' },
  ];

  return (
    <aside className={`w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed inset-y-0 left-0 shadow-xl lg:shadow-sm z-50 font-outfit transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100 shrink-0">
         <span className="text-2xl font-bold text-[#6c11d4] tracking-tight">Welile</span>
         <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600 p-1">
           <X size={24} />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scroll py-6 flex flex-col justify-between">
        
        <div className="px-6 space-y-8">
          
          {/* Main Navigation */}
          <nav className="space-y-1.5 font-inter">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 mb-3">Core Operations</div>
            {financialLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-full transition-all ${
                    isActive 
                      ? 'bg-[#6c11d4] text-white font-semibold shadow-md shadow-purple-500/20' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                  }`
                }
              >
                <div className={`flex-shrink-0 ${item.name === 'Overview' && 'active-icon'}`}>{item.icon}</div>
                <span className="text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Governance Directory */}
          <nav className="space-y-1.5 font-inter">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 mb-3">Governance</div>
            {governanceLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-full transition-all ${
                    isActive 
                      ? 'bg-[#6c11d4] text-white font-semibold shadow-md shadow-purple-500/20' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                  }`
                }
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="px-6 mt-8">
           <nav className="space-y-1.5 font-inter">
              <button onClick={() => setIsOpen(false)} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-all">
                <div className="flex-shrink-0"><HelpCircle size={20} /></div>
                <span className="text-sm">Help</span>
              </button>
              <button onClick={() => { setIsOpen(false); logout(); }} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-all">
                <div className="flex-shrink-0"><LogOut size={20} /></div>
                <span className="text-sm">Log out</span>
              </button>
           </nav>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="p-6 shrink-0">
         <div className="w-full bg-slate-100 rounded-full p-1 flex relative cursor-pointer" onClick={() => setIsDark(!isDark)}>
            <div 
              className={`w-1/2 rounded-full flex items-center justify-center py-1.5 z-10 transition-all duration-300 ${!isDark ? 'bg-[#6c11d4] text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}
            >
               <Sun size={16} />
            </div>
            <div 
              className={`w-1/2 rounded-full flex items-center justify-center py-1.5 z-10 transition-all duration-300 ${isDark ? 'bg-[#6c11d4] text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}
            >
               <Moon size={16} />
            </div>
         </div>
      </div>
    </aside>
  );
};

export default COOSidebar;
