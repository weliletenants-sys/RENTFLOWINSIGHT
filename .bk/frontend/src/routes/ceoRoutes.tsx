import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lazy, Suspense } from 'react';

const CeoDashboard = lazy(() => import('../admin/ceo/CeoDashboard'));
const CeoLayout = lazy(() => import('../admin/ceo/CeoLayout'));
const CeoRevenue = lazy(() => import('../admin/ceo/CeoRevenue'));
const CeoUsers = lazy(() => import('../admin/ceo/CeoUsers'));
const CeoFinancials = lazy(() => import('../admin/ceo/CeoFinancials'));
const CeoPerformance = lazy(() => import('../admin/ceo/CeoPerformance'));

const CentralLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function RequireCEO({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user || user.role === null || !['CEO', 'SUPER_ADMIN'].includes(user.role as string)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export const ceoRoutes = (
  <Route 
    path="/ceo" 
    element={
      <RequireCEO>
        <Suspense fallback={<CentralLoader />}>
          <CeoLayout />
        </Suspense>
      </RequireCEO>
    } 
    key="ceo"
  >
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Suspense fallback={<CentralLoader />}><CeoDashboard /></Suspense>} />
    <Route path="revenue" element={<Suspense fallback={<CentralLoader />}><CeoRevenue /></Suspense>} />
    <Route path="users" element={<Suspense fallback={<CentralLoader />}><CeoUsers /></Suspense>} />
    <Route path="financials" element={<Suspense fallback={<CentralLoader />}><CeoFinancials /></Suspense>} />
    <Route path="performance" element={<Suspense fallback={<CentralLoader />}><CeoPerformance /></Suspense>} />
  </Route>
);
