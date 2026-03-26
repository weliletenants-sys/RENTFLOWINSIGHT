import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FunderSidebar from './FunderSidebar';
import FunderDashboardHeader from './FunderDashboardHeader';
import FunderMobileHeader from './FunderMobileHeader';
import FunderBottomNav from './FunderBottomNav';

interface FunderLayoutProps {
  children: ReactNode;
  activePage?: string;
  pageTitle?: string;
}

export default function FunderLayout({ children, activePage = 'Dashboard', pageTitle = 'Dashboard' }: FunderLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-primary-faint)' }}>
      <div className="flex h-screen overflow-hidden">

        {/* ──────────── DESKTOP SIDEBAR ──────────── */}
        <FunderSidebar activePage={activePage} />

        {/* ──────────── MAIN CONTENT AREA ──────────── */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">

          {/* Desktop top navbar */}
          <FunderDashboardHeader
            user={{ fullName: displayName, role: 'supporter', avatarUrl: '' }}
            pageTitle={pageTitle}
          />

          {/* Mobile top header */}
          <FunderMobileHeader
            user={{ fullName: displayName }}
            onAvatarClick={() => navigate('/funder/account')}
          />

          {/* ──────────── PAGE BODY ──────────── */}
          {children}
        </div>
      </div>

      {/* ──────────── MOBILE BOTTOM NAV ──────────── */}
      <FunderBottomNav activePage={activePage} />
    </div>
  );
}
