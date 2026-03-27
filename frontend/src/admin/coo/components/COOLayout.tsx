import React, { useState, type ReactNode } from 'react';
import COOSidebar from './COOSidebar';
import COOHeader from './COOHeader';

interface COOLayoutProps {
  children: ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

const COOLayout: React.FC<COOLayoutProps> = ({ children, pageTitle, pageSubtitle = "Detailed overview of your operations" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-primary-faint, #F9F9FB)' }}>
      <div className="flex h-screen overflow-hidden">
        
        {/* Desktop / Mobile Sidebar */}
        <COOSidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          {/* Header */}
          <COOHeader 
            pageTitle={pageTitle} 
            pageSubtitle={pageSubtitle} 
            onMenuClick={() => setIsSidebarOpen(true)} 
          />

          {/* Page Body */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default COOLayout;
