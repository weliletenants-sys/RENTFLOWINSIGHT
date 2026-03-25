import React, { useState, type ReactNode } from 'react';
import COOSidebar from './COOSidebar';
import COOHeader from './COOHeader';
import COOBottomNav from './COOBottomNav';

interface COOLayoutProps {
  children: ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

const COOLayout: React.FC<COOLayoutProps> = ({ children, pageTitle, pageSubtitle = "Detailed overview of your operations" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F9F9FB] text-slate-900 font-inter overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop / Mobile Sidebar */}
      <COOSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-64 transition-all duration-300">
        {/* Header */}
        <COOHeader pageTitle={pageTitle} pageSubtitle={pageSubtitle} onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <COOBottomNav />
      </div>
    </div>
  );
};

export default COOLayout;
