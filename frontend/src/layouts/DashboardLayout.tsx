import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings, BarChart2, LayoutDashboard, Target, User } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#8155FF] sm:p-4 flex justify-center items-center relative overflow-hidden">
      {/* Decorative background lines/curves can go here if needed */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center items-center">
        {/* SVG background curves mock matching the image backdrop */}
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-[150vw] h-[150vh]">
           <path d="M0,500 Q250,300 500,500 T1000,500" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,700 Q250,500 500,700 T1000,700" stroke="white" strokeWidth="2" fill="none"/>
           <circle cx="200" cy="800" r="10" fill="white" />
           <circle cx="800" cy="200" r="10" fill="white" />
        </svg>
      </div>

      {/* Mobile Frame Wrapper */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[880px] max-h-screen bg-[#F8F9FA] relative flex flex-col sm:rounded-[40px] shadow-2xl overflow-hidden z-10 border-[12px] border-gray-900 sm:border-[14px]">
        
        {/* Fake iPhone Notch (for desktop preview realism) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-3xl z-50"></div>

        {/* Top Header */}
        <header className="px-6 pt-12 pb-4 flex justify-between items-center bg-transparent z-10 shrink-0">
          <div>
            <h1 className="text-2xl text-gray-800 tracking-tight flex items-center gap-1.5">
              <span className="font-normal">Hi,</span>
              <span className="font-bold">{user?.firstName}!</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-200 shadow-sm border border-white">
              <img 
                src={"https://api.dicebear.com/7.x/avataaars/svg?seed=Paul"} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="p-2 bg-transparent rounded-full hover:bg-gray-200 transition text-gray-800">
              <Settings size={22} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto px-6 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-10">
          {children}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute inset-x-0 bottom-0 h-[88px] bg-[#51319E] flex justify-around items-center text-purple-300 z-20 sm:rounded-b-[24px]">
          <button className="flex flex-col items-center gap-1 hover:text-white transition group relative px-4">
            <BarChart2 size={24} strokeWidth={2} className="text-white" />
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-white transition px-4 text-purple-300">
            <LayoutDashboard size={24} strokeWidth={2} />
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-white transition px-4 text-purple-300">
            <Target size={24} strokeWidth={2} />
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-white transition px-4 text-purple-300">
            <User size={24} strokeWidth={2} />
          </button>
        </nav>
      </div>
    </div>
  );
}
