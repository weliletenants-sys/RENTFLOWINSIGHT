import React from 'react';
import { MessagesSquare, Settings, HelpCircle, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useDarkMode } from '../../../hooks/useDarkMode';

interface CRMSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CRMSidebar: React.FC<CRMSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const [isDark, setIsDark] = useDarkMode();
  
  const links = [
    { id: 'triage', name: 'Triage Center', icon: <MessagesSquare size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-100 h-full flex flex-col hidden md:flex font-outfit shadow-sm relative z-20 shrink-0">
      <div className="h-20 flex items-center px-6 mt-2">
        <div className="flex items-center space-x-2">
          <img src="/welile-colored.png" alt="Welile" className="h-8 object-contain" />
          <span className="font-bold text-slate-800 text-lg tracking-tight">CRM Hub</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-8 mt-4">
        <div>
          <nav className="space-y-1 font-inter px-3">
            {links.map((item) => {
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

export default CRMSidebar;
