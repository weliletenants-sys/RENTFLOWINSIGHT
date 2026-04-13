import React, { type ReactNode } from 'react';
import COOSidebar from './COOSidebar';
import COOHeader from './COOHeader';
import COOBottomNav from './COOBottomNav';

interface COOLayoutProps {
  children: ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

const COOLayout: React.FC<COOLayoutProps> = ({ children, pageTitle, pageSubtitle = "Detailed overview of your operations" }) => {
  return (
    <div className="flex h-screen bg-[#F9F9FB] text-slate-900 font-inter">
      {/* Desktop Sidebar */}
      <COOSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <COOHeader pageTitle={pageTitle} pageSubtitle={pageSubtitle} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <COOBottomNav />
      </div>
    </div>
  );
};

export default COOLayout;
