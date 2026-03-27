import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface COOHeaderProps {
  pageTitle: string;
  pageSubtitle?: string;
  onMenuClick: () => void;
}

const COOHeader: React.FC<COOHeaderProps> = ({ pageTitle, pageSubtitle, onMenuClick }) => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center">
         <button onClick={onMenuClick} className="lg:hidden mr-4 p-2 -ml-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-colors">
           <Menu size={24} />
         </button>
         <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{pageTitle}</h2>
            {pageSubtitle && <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{pageSubtitle}</p>}
         </div>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Circle Actions */}
        <div className="flex items-center space-x-2">
           <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 transition-colors flex items-center justify-center">
             <Search size={18} />
           </button>
           <button className="relative w-10 h-10 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 transition-colors flex items-center justify-center">
             <Bell size={18} />
             <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
           </button>
        </div>
        
        {/* Profile Details */}
        <div className="flex items-center pl-4 border-l border-slate-200">
          <div className="hidden sm:flex flex-col text-right mr-3">
            <span className="text-sm font-bold text-slate-800">
              {user?.role === 'CEO' ? `${user.firstName || 'Chief'} ${user.lastName || 'Executive'}` : 'Chief Officer'}
            </span>
            <span className="text-xs text-slate-500 font-medium font-sans">
              {user?.role === 'CEO' ? 'Executive Terminal' : 'Operations'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-[var(--color-primary)] font-bold text-lg shadow-sm">
            {user?.role === 'CEO' ? user?.firstName?.charAt(0) || 'C' : 'C'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default COOHeader;
