import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, CreditCard, Wallet, 
  BarChart2, FileText, AlertTriangle, Briefcase, Activity, 
  HelpCircle, LogOut, Sun, Moon, User, X
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
    { name: 'Wallet', icon: <Wallet size={20} />, path: '/coo/wallets' },
    { name: 'Collections', icon: <Briefcase size={20} />, path: '/coo/collections' },
    { name: 'Analytics', icon: <BarChart2 size={20} />, path: '/coo/analytics' },
  ];

  const governanceLinks = [
    { name: 'Reports', icon: <FileText size={20} />, path: '/coo/reports' },
    { name: 'All Users', icon: <Users size={20} />, path: '/coo/users' },
    { name: 'Alerts', icon: <AlertTriangle size={20} />, path: '/coo/alerts' },
    { name: 'Withdrawals', icon: <CreditCard size={20} />, path: '/coo/withdrawals' },
    { name: 'Deposits', icon: <FileText size={20} />, path: '/coo/deposits' },
    { name: 'Partners', icon: <Users size={20} />, path: '/coo/partners' },
    { name: 'Tenants', icon: <User size={20} />, path: '/coo/tenants' },
    { name: 'Staff Performance', icon: <Activity size={20} />, path: '/coo/staff-performance' },
  ];

  const renderLinks = (links: typeof financialLinks) => {
    return links.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isActive ? '' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`
        }
        style={({ isActive }) =>
          isActive
            ? {
                background: 'var(--color-primary, #6c11d4)',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(108, 17, 212, 0.25)',
              }
            : undefined
        }
      >
        {({ isActive }) => (
          <>
            <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}>
              {item.icon}
            </div>
            <span className={isActive ? 'text-white' : 'text-slate-600'}>
              {item.name}
            </span>
          </>
        )}
      </NavLink>
    ));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col min-h-screen h-[100dvh] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center">
             <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-primary, #6c11d4)' }}>Welile</span>
             <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Ops</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:bg-slate-100 rounded-xl p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto sidebar-scroll py-6 flex flex-col justify-between">
          
          <div className="px-4 space-y-8 font-sans">
            
            {/* Main Navigation */}
            <nav className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-3 mb-3">Core Operations</div>
              {renderLinks(financialLinks)}
            </nav>

            {/* Governance Directory */}
            <nav className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-3 mb-3">Governance</div>
              {renderLinks(governanceLinks)}
            </nav>
          </div>

          <div className="px-4 mt-8 font-sans">
             <nav className="space-y-1">
                <button onClick={() => setIsOpen(false)} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
                  <div className="flex-shrink-0 text-slate-400"><HelpCircle size={20} /></div>
                  <span className="text-slate-600">Help</span>
                </button>
             </nav>
          </div>
        </div>

        {/* Extreme Bottom Section */}
        <div className="w-full mt-auto shrink-0 bg-slate-50 border-t border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4 px-2">
             <span className="text-xs font-bold text-slate-500 uppercase">Theme</span>
             <div className="w-24 bg-slate-200 rounded-full p-1 flex relative cursor-pointer" onClick={() => setIsDark(!isDark)}>
                <div className={`w-1/2 rounded-full flex items-center justify-center py-1 z-10 transition-all duration-300 ${!isDark ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>
                   <Sun size={14} />
                </div>
                <div className={`w-1/2 rounded-full flex items-center justify-center py-1 z-10 transition-all duration-300 ${isDark ? 'bg-slate-700 shadow-sm text-white' : 'text-slate-400'}`}>
                   <Moon size={14} />
                </div>
             </div>
          </div>
          <button onClick={() => { setIsOpen(false); logout(); }} className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default COOSidebar;
