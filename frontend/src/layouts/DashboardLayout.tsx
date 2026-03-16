import { useState, type ReactNode } from 'react';
import DesktopSidebar from './DesktopSidebar';
import { Menu, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string; // Optional title override
  hideHeader?: boolean; // Hides the top header
  fullWidth?: boolean; // Removes the horizontal padding from the main scroll container
}

export default function DashboardLayout({ children, title, hideHeader, fullWidth }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 flex overflow-hidden">
      
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden lg:block z-40">
        <DesktopSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <DesktopSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-64">
        
        {/* Top Navbar */}
        {!hideHeader && (
          <header className="h-16 shrink-0 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
            
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button 
                className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              {/* Page Title */}
              <h1 className="text-xl font-bold tracking-tight hidden sm:block">
                {title || 'Dashboard'}
              </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 lg:gap-5">
              
              <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-[#1f2937] focus:border-purple-500 rounded-full text-sm outline-none transition-all w-48 focus:w-64"
                />
              </div>

              <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111827]"></span>
              </button>

              <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

              <button 
                onClick={() => navigate('/dashboard/profile')}
                className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
                  {user?.firstName?.charAt(0) || <User size={16} />}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold leading-none mb-1">{user?.firstName || 'User'}</p>
                  <p className="text-xs text-gray-500 leading-none">{user?.role || 'Guest'}</p>
                </div>
              </button>
            </div>
          </header>
        )}

        {/* Scrollable Main Area */}
        <main className={`flex-1 overflow-y-auto no-scrollbar scroll-smooth ${fullWidth ? '' : 'p-4 lg:p-8'}`}>
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
