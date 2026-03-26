import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lazy, Suspense } from 'react';

const ManagerDashboard = lazy(() => import('../admin/manager/ManagerDashboard'));
const ManagerLayout = lazy(() => import('../admin/manager/ManagerLayout'));
const FinancialOps = lazy(() => import('../admin/manager/FinancialOps'));
const CompanyStaff = lazy(() => import('../admin/manager/CompanyStaff'));
const AgentOps = lazy(() => import('../admin/manager/AgentOps'));
const TenantOps = lazy(() => import('../admin/manager/TenantOps'));
const LandlordOps = lazy(() => import('../admin/manager/LandlordOps'));
const PartnerOps = lazy(() => import('../admin/manager/PartnerOps'));

const CentralLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function RequireManager({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user || user.role === null || !['MANAGER', 'SUPER_ADMIN', 'CEO', 'COO', 'CFO'].includes(user.role as string)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export const managerRoutes = (
  <Route 
    path="/admin/manager" 
    element={
      <RequireManager>
        <Suspense fallback={<CentralLoader />}>
          <ManagerLayout />
        </Suspense>
      </RequireManager>
    } 
    key="manager"
  >
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Suspense fallback={<CentralLoader />}><ManagerDashboard /></Suspense>} />
    <Route path="financial-ops" element={<Suspense fallback={<CentralLoader />}><FinancialOps /></Suspense>} />
    <Route path="staff" element={<Suspense fallback={<CentralLoader />}><CompanyStaff /></Suspense>} />
    <Route path="agents" element={<Suspense fallback={<CentralLoader />}><AgentOps /></Suspense>} />
    <Route path="tenants" element={<Suspense fallback={<CentralLoader />}><TenantOps /></Suspense>} />
    <Route path="landlords" element={<Suspense fallback={<CentralLoader />}><LandlordOps /></Suspense>} />
    <Route path="partners" element={<Suspense fallback={<CentralLoader />}><PartnerOps /></Suspense>} />
  </Route>
);
