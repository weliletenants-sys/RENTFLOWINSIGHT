import React from 'react';
import { 
  BarChart3, FileText, ShieldAlert, Scale, BookOpen,
  Coins, ArrowDownToLine, HelpCircle, LogOut, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useDarkMode } from '../../../hooks/useDarkMode';

interface CFOSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const CFOSidebar: React.FC<CFOSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const [isDark, setIsDark] = useDarkMode();

  const primaryLinks = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'statements', name: 'Financial Statements', icon: <FileText size={20} /> },
    { id: 'solvency', name: 'Solvency & Buffer', icon: <ShieldAlert size={20} /> },
    { id: 'reconciliation', name: 'Reconciliation', icon: <Scale size={20} /> },
    { id: 'ledger', name: 'General Ledger', icon: <BookOpen size={20} /> },
  ];

  const secondaryLinks = [
    { id: 'commissions', name: 'Commission Payouts', icon: <Coins size={20} /> },
    { id: 'withdrawals', name: 'Withdrawals', icon: <ArrowDownToLine size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-100 h-full flex flex-col hidden md:flex font-outfit shadow-sm relative z-20 shrink-0">
      {/* Brand / Logo Area */}
      <div className="h-20 flex items-center px-6 mt-2">
        <div className="flex items-center space-x-2">
          <img src="/welile-colored.png" alt="Welile" className="h-8 object-contain" />
          <span className="font-bold text-slate-800 text-lg tracking-tight">CFO Console</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 space-y-8">
        
        <div>
          <nav className="space-y-1 font-inter px-3">
            {primaryLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-all font-semibold ${
                    isActive
                      ? 'bg-[#6c11d4] text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <span className="text-sm">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
           <nav className="space-y-1 font-inter px-3">
             {secondaryLinks.map((item) => {
               const isActive = activeTab === item.id;
               return (
                 <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-all font-semibold ${
                     isActive
                       ? 'bg-[#6c11d4] text-white shadow-md shadow-purple-500/20'
                       : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                   }`}
                 >
                   <div className="flex-shrink-0">{item.icon}</div>
                   <span className="text-sm">{item.name}</span>
                 </button>
               );
             })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 mx-6">
           <nav className="space-y-2 font-inter -mx-3">

              <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-all">
                <div className="flex-shrink-0"><HelpCircle size={20} /></div>
                <span className="text-sm">Help</span>
              </button>
              <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-all">
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
    </div>
  );
};

export default CFOSidebar;
