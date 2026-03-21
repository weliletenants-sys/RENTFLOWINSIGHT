import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lazy, Suspense } from 'react';

// Lazy loading Super Admin Components
const SuperAdminLayout = lazy(() => import('../admin/superadmin/SuperAdminLayout'));
const SuperAdminOverview = lazy(() => import('../admin/superadmin/SuperAdminOverview'));
const SuperAdminUsers = lazy(() => import('../admin/superadmin/SuperAdminUserManagement'));
const SuperAdminAudit = lazy(() => import('../admin/superadmin/SuperAdminAuditLogs'));
const SuperAdminConfig = lazy(() => import('../admin/superadmin/SuperAdminSystemConfig'));
const SuperAdminLedger = lazy(() => import('../admin/superadmin/SuperAdminLedger'));
const SuperAdminSecurity = lazy(() => import('../admin/superadmin/SuperAdminSecurity'));

const CentralLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoading } = useAuth();
  
  if (isAuthLoading) return <CentralLoader />;
  
  if (!user || user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export const superAdminRoutes = (
  <Route 
    path="/admin" 
    element={
      <RequireSuperAdmin>
        <Suspense fallback={<CentralLoader />}>
          <SuperAdminLayout />
        </Suspense>
      </RequireSuperAdmin>
    } 
    key="superadmin"
  >
    {/* By default redirect /admin to /admin/dashboard */}
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Suspense fallback={<CentralLoader />}><SuperAdminOverview /></Suspense>} />
    <Route path="users" element={<Suspense fallback={<CentralLoader />}><SuperAdminUsers /></Suspense>} />
    <Route path="audit" element={<Suspense fallback={<CentralLoader />}><SuperAdminAudit /></Suspense>} />
    <Route path="config" element={<Suspense fallback={<CentralLoader />}><SuperAdminConfig /></Suspense>} />
    <Route path="ledger" element={<Suspense fallback={<CentralLoader />}><SuperAdminLedger /></Suspense>} />
    <Route path="security" element={<Suspense fallback={<CentralLoader />}><SuperAdminSecurity /></Suspense>} />
  </Route>
);
