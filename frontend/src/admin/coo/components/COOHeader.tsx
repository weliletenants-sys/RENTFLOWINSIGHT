import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface COOHeaderProps {
  pageTitle: string;
  pageSubtitle: string;
}

const COOHeader: React.FC<COOHeaderProps> = ({ pageTitle, pageSubtitle }) => {
  const { user } = useAuth();
  
  return (
    <header className="pt-8 pb-4 bg-transparent flex items-center justify-between px-4 sm:px-6 md:px-8 z-10">
      <div>
         <h2 className="text-3xl font-bold font-outfit text-slate-900 mb-1">{pageTitle}</h2>
         <p className="text-sm text-slate-400 font-medium font-inter">{pageSubtitle}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Circle Actions */}
        <div className="flex items-center space-x-2">
           <button className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center">
             <Search size={18} />
           </button>
           <button className="relative w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center">
             <Bell size={18} />
             <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
           </button>
        </div>
        
        {/* Profile Pill */}
        <div className="hidden md:flex items-center space-x-3 bg-white border border-slate-200 rounded-full pl-2 pr-4 py-1.5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#EAE5FF] overflow-hidden flex items-center justify-center text-[#6c11d4] font-bold">
            {user?.role === 'CEO' ? user?.firstName?.charAt(0) || 'C' : 'C'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 leading-tight">
              {user?.role === 'CEO' ? `${user.firstName || 'Chief'} ${user.lastName || 'Executive'}` : 'Chief Officer'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {user?.role === 'CEO' ? 'Executive Terminal' : 'Operations'}
            </span>
          </div>
        </div>

        {/* Mobile Profile Avatar */}
        <div className="md:hidden w-10 h-10 rounded-full border border-slate-200 bg-white text-[#6c11d4] flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
};

export default COOHeader;
