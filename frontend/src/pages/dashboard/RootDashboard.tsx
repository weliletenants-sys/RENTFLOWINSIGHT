import { lazy } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DesktopSidebar from '../../layouts/DesktopSidebar';

// Each dashboard is a separate chunk — only the current user's role is loaded
const TenantDashboard   = lazy(() => import('../../tenant/TenantDashboard'));
const AgentDashboard    = lazy(() => import('../../agent/AgentDashboard'));
const LandlordDashboard = lazy(() => import('../../owner/LandlordDashboard'));
const FunderDashboard   = lazy(() => import('../../funder/FunderDashboard'));

export default function RootDashboard() {
  const { role } = useAuth();

  const renderDashboardContent = () => {
    switch (role) {
      case 'TENANT':
        return <TenantDashboard />;
      case 'AGENT':
        return <AgentDashboard />;
      case 'LANDLORD':
        return <LandlordDashboard />;
      case 'FUNDER':
        return <FunderDashboard />;
      default:
        return (
          <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="p-6 text-center">
              <h2 className="text-xl text-gray-800 font-semibold mb-2">Welcome to Welile</h2>
              <p className="text-sm text-gray-500">Please log in to continue.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f7f6f8]">
      <DesktopSidebar />
      <div className="flex-1 w-full lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        {renderDashboardContent()}
      </div>
    </div>
  );
}
