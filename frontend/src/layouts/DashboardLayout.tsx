import type { ReactNode } from 'react';
import SharedHeader from '../components/layout/SharedHeader';
import BottomNavigation from '../components/layout/BottomNavigation';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string; // Optional title override
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#8155FF] sm:p-4 flex justify-center items-center relative overflow-hidden">
      {/* Decorative background lines/curves */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center items-center">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-[150vw] h-[150vh]">
           <path d="M0,500 Q250,300 500,500 T1000,500" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,700 Q250,500 500,700 T1000,700" stroke="white" strokeWidth="2" fill="none"/>
           <circle cx="200" cy="800" r="10" fill="white" />
           <circle cx="800" cy="200" r="10" fill="white" />
        </svg>
      </div>

      {/* Mobile Frame Wrapper */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[880px] max-h-screen bg-[#F8F9FA] relative flex flex-col sm:rounded-[40px] shadow-2xl overflow-hidden z-10 border-[12px] border-gray-900 sm:border-[14px]">
        
        {/* Fake iPhone Notch */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-3xl z-50"></div>

        {/* Universal Top Header */}
        <header className="px-6 pt-12 pb-2 bg-transparent z-10 shrink-0">
          <SharedHeader title={title} />
        </header>

        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto px-6 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-10">
          {children}
        </main>

        {/* Universal Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
}
