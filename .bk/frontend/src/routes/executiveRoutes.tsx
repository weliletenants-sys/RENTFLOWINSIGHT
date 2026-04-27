import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ExecutiveLayout from '../admin/ExecutiveLayout';
import { LayoutDashboard } from 'lucide-react';

// Lazy load the components later inside App.tsx or directly here
import { lazy, Suspense } from 'react';

const CeoWorkspaceLayout = lazy(() => import('../executive/CEOWorkspaceLayout'));
const CeoDashboard = lazy(() => import('../executive/CEODashboard'));
const CtoDashboard = lazy(() => import('../executive/CTODashboard'));
const CfoWorkspaceLayout = lazy(() => import('../cfo/CFODashboard'));
const CooDashboard = lazy(() => import('../coo/COODashboard'));
const CmoDashboard = lazy(() => import('../executive/CMODashboard'));
const CrmDashboard = lazy(() => import('../crm/CRMDashboard'));

// CFO Sub-Pages
const CfoOverviewPage = lazy(() => import('../cfo/CfoOverviewPage'));
const CfoStatementsPage = lazy(() => import('../cfo/CfoStatementsPage'));
const CfoSolvencyPage = lazy(() => import('../cfo/CfoSolvencyPage'));
const CfoReconciliationPage = lazy(() => import('../cfo/CfoReconciliationPage'));
const CfoLedgerPage = lazy(() => import('../cfo/CfoLedgerPage'));
const CfoCommissionsPage = lazy(() => import('../cfo/CfoCommissionsPage'));
const CfoWithdrawalsPage = lazy(() => import('../cfo/CfoWithdrawalsPage'));

// CEO Sub-Pages
const CeoRevenuePage = lazy(() => import('../executive/CeoRevenuePage'));
const CeoUsersPage = lazy(() => import('../executive/CeoUsersPage'));
const CeoHealthPage = lazy(() => import('../executive/CeoHealthPage'));
const CeoStaffPage = lazy(() => import('../executive/CeoStaffPage'));
const CeoAngelPoolPage = lazy(() => import('../executive/CeoAngelPoolPage'));

const CentralLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// RBAC Guard wrapper
function RequireRole({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user || (!user.role || !allowedRoles.includes(user.role)) && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    // If not authorized, bounce them back to the admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export const executiveRoutes = (
  <Route path="executive" key="executive">
    {/* CEO-Specific Custom Layout Domain Catch-All */}
    <Route 
      path="ceo" 
      element={
        <RequireRole allowedRoles={['CEO']}>
          <Suspense fallback={<CentralLoader />}>
            <CeoWorkspaceLayout />
          </Suspense>
        </RequireRole>
      } 
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Suspense fallback={<CentralLoader />}><CeoDashboard /></Suspense>} />
      <Route path="revenue" element={<Suspense fallback={<CentralLoader />}><CeoRevenuePage /></Suspense>} />
      <Route path="users" element={<Suspense fallback={<CentralLoader />}><CeoUsersPage /></Suspense>} />
      <Route path="health" element={<Suspense fallback={<CentralLoader />}><CeoHealthPage /></Suspense>} />
      <Route path="staff" element={<Suspense fallback={<CentralLoader />}><CeoStaffPage /></Suspense>} />
      <Route path="angel" element={<Suspense fallback={<CentralLoader />}><CeoAngelPoolPage /></Suspense>} />
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
             <LayoutDashboard size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Module in Development</h2>
          <p className="text-slate-500 max-w-md">This detailed view is currently being integrated with backend hooks. Please refer to the main overview dashboard in the meantime.</p>
        </div>
      } />
    </Route>

    {/* CFO-Specific Workspace Domain */}
    <Route 
      path="cfo" 
      element={
        <RequireRole allowedRoles={['CFO']}>
          <Suspense fallback={<CentralLoader />}>
            <CfoWorkspaceLayout />
          </Suspense>
        </RequireRole>
      } 
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Suspense fallback={<CentralLoader />}><CfoOverviewPage /></Suspense>} />
      <Route path="statements" element={<Suspense fallback={<CentralLoader />}><CfoStatementsPage /></Suspense>} />
      <Route path="solvency" element={<Suspense fallback={<CentralLoader />}><CfoSolvencyPage /></Suspense>} />
      <Route path="reconciliation" element={<Suspense fallback={<CentralLoader />}><CfoReconciliationPage /></Suspense>} />
      <Route path="ledger" element={<Suspense fallback={<CentralLoader />}><CfoLedgerPage /></Suspense>} />
      <Route path="commissions" element={<Suspense fallback={<CentralLoader />}><CfoCommissionsPage /></Suspense>} />
      <Route path="withdrawals" element={<Suspense fallback={<CentralLoader />}><CfoWithdrawalsPage /></Suspense>} />
      
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
             <LayoutDashboard size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">CFO Module in Development</h2>
          <p className="text-slate-500 max-w-md">This workflow is currently being mapped to the Three-Tier Architecture. Please use the primary tabs (Overview, Statements, Solvency) in the meantime.</p>
        </div>
      } />
    </Route>

    {/* Shared Executive Layout Domain (Dark Mode) */}
    <Route element={<ExecutiveLayout />}>
      <Route path="cto">
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route 
          path="dashboard" 
          element={
            <RequireRole allowedRoles={['CTO']}>
              <Suspense fallback={<CentralLoader />}><CtoDashboard /></Suspense>
            </RequireRole>
          } 
        />
      </Route>

      <Route path="cmo">
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route 
          path="dashboard" 
          element={
            <RequireRole allowedRoles={['CMO']}>
              <Suspense fallback={<CentralLoader />}><CmoDashboard /></Suspense>
            </RequireRole>
          } 
        />
      </Route>

      <Route path="crm">
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route 
          path="dashboard" 
          element={
            <RequireRole allowedRoles={['CRM']}>
              <Suspense fallback={<CentralLoader />}><CrmDashboard /></Suspense>
            </RequireRole>
          } 
        />
      </Route>

      <Route path="coo">
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route 
          path="dashboard" 
          element={
            <RequireRole allowedRoles={['COO']}>
              <Suspense fallback={<CentralLoader />}><CooDashboard /></Suspense>
            </RequireRole>
          } 
        />
      </Route>
    </Route>
  </Route>
);
