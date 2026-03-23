import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ExecutiveLayout from '../admin/ExecutiveLayout';

// Lazy load the components later inside App.tsx or directly here
import { lazy, Suspense } from 'react';

const CeoDashboard = lazy(() => import('../admin/ceo/CeoDashboard'));
const CfoDashboard = lazy(() => import('../admin/cfo/CfoDashboard'));
const CooDashboard = lazy(() => import('../admin/coo/COOOverview'));
// We will build these two next
const CtoDashboard = lazy(() => import('../admin/cto/CtoDashboard'));

const CentralLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// RBAC Guard wrapper
function RequireRole({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user || (!user.role || !allowedRoles.includes(user.role)) && user.role !== 'SUPER_ADMIN') {
    // If not authorized, bounce them back to the root dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export const executiveRoutes = (
  <Route path="/executive" element={<ExecutiveLayout />} key="executive">
    <Route 
      path="ceo" 
      element={
        <RequireRole allowedRoles={['CEO']}>
          <Suspense fallback={<CentralLoader />}><CeoDashboard /></Suspense>
        </RequireRole>
      } 
    />
    <Route 
      path="cto" 
      element={
        <RequireRole allowedRoles={['CTO']}>
          <Suspense fallback={<CentralLoader />}><CtoDashboard /></Suspense>
        </RequireRole>
      } 
    />
    <Route 
      path="cmo" 
      element={
        <RequireRole allowedRoles={['CMO']}>
          <Suspense fallback={<CentralLoader />}>{/* Upcoming CMO Dashboard */}</Suspense>
        </RequireRole>
      } 
    />

    <Route 
      path="cfo" 
      element={
        <RequireRole allowedRoles={['CFO']}>
          <Suspense fallback={<CentralLoader />}><CfoDashboard /></Suspense>
        </RequireRole>
      } 
    />
    <Route 
      path="coo" 
      element={
        <RequireRole allowedRoles={['COO']}>
          <Suspense fallback={<CentralLoader />}><CooDashboard /></Suspense>
        </RequireRole>
      } 
    />
  </Route>
);
