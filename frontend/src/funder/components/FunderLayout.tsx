import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FunderSidebar from './FunderSidebar';
import FunderDashboardHeader from './FunderDashboardHeader';

interface FunderLayoutProps {
  children: ReactNode;
  activePage?: string;
  pageTitle?: string;
}

export default function FunderLayout({ children, activePage = 'Dashboard', pageTitle = 'Dashboard' }: FunderLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/funder/login');
    }
  }, [user, navigate]);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || (user as any)?.name || 'Rentflow Funder';

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      <div className="flex h-screen overflow-hidden">

        {/* ──────────── DESKTOP SIDEBAR ──────────── */}
        <FunderSidebar 
          activePage={activePage} 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />

        {/* ──────────── MAIN CONTENT AREA ──────────── */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">

          {/* Desktop top navbar */}
          <FunderDashboardHeader
            user={{ fullName: displayName, role: 'supporter', avatarUrl: '' }}
            pageTitle={pageTitle}
            onMenuClick={() => setMobileMenuOpen(true)}
          />

          {/* ──────────── PAGE BODY ──────────── */}
          {children}
        </div>
      </div>
    </div>
  );
}
