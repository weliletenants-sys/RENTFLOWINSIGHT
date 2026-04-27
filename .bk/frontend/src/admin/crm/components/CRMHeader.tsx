import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface CRMHeaderProps {
  pageTitle: string;
  pageSubtitle: string;
}

const CRMHeader: React.FC<CRMHeaderProps> = ({ pageTitle, pageSubtitle }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-sm">
      <div className="flex items-center">
        <button className="md:hidden mr-4 p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-outfit">{pageTitle}</h1>
          <p className="text-xs md:text-sm text-slate-500 hidden md:block">{pageSubtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6c11d4] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tickets, IDs..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6c11d4]/20 focus:border-[#6c11d4] transition-all w-64"
          />
        </div>

        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center space-x-3 pl-2 md:pl-6 border-l border-slate-200">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-700 leading-none">{(user as any)?.user_metadata?.first_name || 'CRM'} {(user as any)?.user_metadata?.last_name || 'Admin'}</p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role || 'Customer Relations'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            <span className="text-purple-700 font-bold text-sm">
              {(user as any)?.user_metadata?.first_name?.[0] || 'CR'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CRMHeader;
