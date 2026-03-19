import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, CreditCard, Wallet, 
  BarChart2, FileText, AlertTriangle, Briefcase, Activity, 
  List, HelpCircle, LogOut, Sun, Moon, User
} from 'lucide-react';

const COOSidebar: React.FC = () => {
  const financialLinks = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/coo/overview' },
    { name: 'Transactions', icon: <List size={20} />, path: '/coo/transactions' },
    { name: 'Wallet', icon: <Wallet size={20} />, path: '/coo/wallets' },
    { name: 'Collections', icon: <Briefcase size={20} />, path: '/coo/collections' },
    { name: 'Analytics', icon: <BarChart2 size={20} />, path: '/coo/analytics' },
  ];

  const governanceLinks = [
    { name: 'Reports', icon: <FileText size={20} />, path: '/coo/reports' },
    { name: 'Alerts', icon: <AlertTriangle size={20} />, path: '/coo/alerts' },
    { name: 'Withdrawals', icon: <CreditCard size={20} />, path: '/coo/withdrawals' },
    { name: 'Partners', icon: <Users size={20} />, path: '/coo/partners' },
    { name: 'Tenants', icon: <User size={20} />, path: '/coo/tenants' },
    { name: 'Staff Performance', icon: <Activity size={20} />, path: '/coo/staff-performance' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-100 h-full flex flex-col hidden md:flex font-outfit">
      {/* Brand / Logo Area */}
      <div className="h-20 flex items-center px-6 mt-2">
        <div className="flex items-center space-x-2">
          <img src="/welile-colored.png" alt="Welile" className="h-8 object-contain" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 space-y-8">
        
        <div>
          <nav className="space-y-1 font-inter px-3">
            {financialLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-full transition-all font-semibold ${
                    isActive
                      ? 'bg-[#7B61FF] text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
           <nav className="space-y-1 font-inter px-3">
            {governanceLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-full transition-all font-semibold ${
                    isActive
                      ? 'bg-[#7B61FF] text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 mx-6">
           <nav className="space-y-1 font-inter -mx-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-all">
                <div className="flex-shrink-0"><HelpCircle size={20} /></div>
                <span className="text-sm">Help</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-all">
                <div className="flex-shrink-0"><LogOut size={20} /></div>
                <span className="text-sm">Log out</span>
              </button>
           </nav>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="p-6">
         <div className="w-full bg-slate-100 rounded-full p-1 flex relative">
            <div className="w-1/2 bg-[#7B61FF] rounded-full shadow flex items-center justify-center py-1.5 text-white z-10">
               <Sun size={16} />
            </div>
            <div className="w-1/2 flex items-center justify-center py-1.5 text-slate-400 z-10 transition-colors cursor-pointer hover:text-slate-600">
               <Moon size={16} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default COOSidebar;
