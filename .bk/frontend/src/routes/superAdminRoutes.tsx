import { Navigate, Route, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lazy, Suspense } from 'react';

// Lazy loading Super Admin Components
const SuperAdminOverview = lazy(() => import('../admin/super/views/SystemOverview'));
const SuperAdminUsers = lazy(() => import('../admin/super/views/UserMatrix'));
const RoleIntelligence = lazy(() => import('../admin/super/views/RoleIntelligence'));
const SuperAdminAudit = lazy(() => import('../admin/super/views/AuditLogs'));
const SuperAdminConfig = lazy(() => import('../admin/super/views/GlobalConfig'));
const SuperAdminLedger = lazy(() => import('../admin/superadmin/SuperAdminLedger'));
const IdentityAccess = lazy(() => import('../admin/super/views/IdentityAccess'));

const CentralLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
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
          <Outlet />
        </Suspense>
      </RequireSuperAdmin>
    } 
    key="superadmin"
  >
    {/* By default redirect /admin to /admin/dashboard */}
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Suspense fallback={<CentralLoader />}><SuperAdminOverview /></Suspense>} />
    <Route path="users" element={<Suspense fallback={<CentralLoader />}><SuperAdminUsers /></Suspense>} />
    <Route path="intelligence" element={<Suspense fallback={<CentralLoader />}><RoleIntelligence /></Suspense>} />
    <Route path="audit" element={<Suspense fallback={<CentralLoader />}><SuperAdminAudit /></Suspense>} />
    <Route path="config" element={<Suspense fallback={<CentralLoader />}><SuperAdminConfig /></Suspense>} />
    <Route path="ledger" element={<Suspense fallback={<CentralLoader />}><SuperAdminLedger /></Suspense>} />
    <Route path="identity" element={<Suspense fallback={<CentralLoader />}><IdentityAccess /></Suspense>} />
  </Route>
);
