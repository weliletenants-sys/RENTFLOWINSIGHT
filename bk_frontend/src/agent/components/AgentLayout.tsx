import { useState } from 'react';
import AgentSidebar from './AgentSidebar';
import AgentDashboardHeader from './AgentDashboardHeader';
import { useAuth } from '../../contexts/AuthContext';

interface AgentLayoutProps {
  children: React.ReactNode;
  activePage: string;
  pageTitle: string;
}

export default function AgentLayout({ children, activePage, pageTitle }: AgentLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : 'Joshua Wanda';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-[#121212] font-['Public_Sans']">
      <AgentSidebar 
        activePage={activePage} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <AgentDashboardHeader 
          user={{ fullName: displayName, role: 'agent' }} 
          pageTitle={pageTitle} 
          onMenuClick={() => setMobileMenuOpen(true)} 
        />
        
        <main className="flex-1 w-full max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
