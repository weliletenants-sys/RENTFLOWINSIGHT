import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import AdaptiveConsumerDashboard from './portals/consumer/AdaptiveConsumerDashboard';

// Dashboard sub-routes from HEAD
import SubAgents from './agent/SubAgents';
import AgentEarnings from './agent/AgentEarnings';
import AgentClients from './agent/AgentClients';
import StaffPortal from './portals/staff/StaffPortal';
import AgentSettings from './agent/AgentSettings';
import CfoDashboard from './admin/cfo/CfoDashboard';
import CrmDashboard from './admin/crm/CrmDashboard';
import CeoDashboard from './admin/ceo/CeoDashboard';
import CeoPerformance from './admin/ceo/CeoPerformance';
import CeoRevenue from './admin/ceo/CeoRevenue';
import CeoUsers from './admin/ceo/CeoUsers';
import CeoFinancials from './admin/ceo/CeoFinancials';
import TenantPayments from './tenant/TenantPayments';
import TenantProfile from './tenant/TenantProfile';

import AdminLogin from './pages/auth/AdminLogin';

// --- Role-based route groups ---
import { publicRoutes } from './routes/publicRoutes';
import { agentRoutes } from './routes/agentRoutes';
import { tenantRoutes } from './routes/tenantRoutes';
import { funderRoutes } from './routes/funderRoutes';
import { cooRoutes } from './routes/cooRoutes';
import { executiveRoutes } from './routes/executiveRoutes';
import { superAdminRoutes } from './routes/superAdminRoutes';

const queryClient = new QueryClient();

// Minimal full-screen spinner shown while a lazy chunk is downloading
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAFAFA',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '3px solid #E8DBFC',
        borderTopColor: '#6c11d4',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Check if the error is a Vite dynamic import failure (stale chunk cache)
    const errorMsg = error?.message || error?.toString() || '';
    const isChunkLoadError = /Failed to fetch dynamically imported module/i.test(errorMsg) || /Importing a module script failed/i.test(errorMsg);
    
    if (isChunkLoadError) {
      // Prevent infinite reload loops by setting a short-lived flag in sessionStorage
      const reloadKey = 'welile_chunk_retried';
      const hasRetried = sessionStorage.getItem(reloadKey);
      
      if (!hasRetried) {
        sessionStorage.setItem(reloadKey, 'true');
        console.warn('Stale build chunk detected. Initiating hard reload to fetch new bundles...');
        window.location.reload();
      } else {
        console.error('Hard reload failed to resolve the chunk missing issue. Check deployment status.');
      }
    }
  }
  render() {
    if (this.state.hasError) {
      const isChunkLoadError = /Failed to fetch dynamically imported module/i.test(this.state.error?.message || '');
      // If we are about to reload, show a friendly spinner instead of the red crash screen
      if (isChunkLoadError && sessionStorage.getItem('welile_chunk_retried')) {
        return (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', fontFamily: 'sans-serif' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E8DBFC', borderTopColor: '#6c11d4', animation: 'spin 0.7s linear infinite', marginBottom: 20 }} />
            <h2 style={{ color: '#170330', fontSize: '18px', fontWeight: 600 }}>Applying latest system updates...</h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>Please wait a moment while we load the new version.</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        );
      }

      return (
        <div style={{ padding: 40, background: '#fee2e2', color: '#991b1b', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Terminal Application Error</h2>
          <pre style={{ background: '#fef2f2', padding: '20px', borderRadius: '8px', border: '1px solid #fca5a5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Force Application Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#fff', borderRadius: '12px' } }} />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public / auth routes */}
                {publicRoutes}

                {/* Role-specific routes */}
                {agentRoutes}
                {tenantRoutes}
                {funderRoutes}
                {cooRoutes}

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Super Admin Control Panel */}
                {superAdminRoutes}

                {/* CEO Public Routes */}
                <Route path="/ceo/dashboard" element={<CeoDashboard />} />
                <Route path="/ceo/revenue" element={<CeoRevenue />} />
                <Route path="/ceo/users" element={<CeoUsers />} />
                <Route path="/ceo/financials" element={<CeoFinancials />} />
                <Route path="/ceo/performance" element={<CeoPerformance />} />

                {/* Protected: authenticated users only */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/staff/*" element={<StaffPortal />} />
                  <Route path="/dashboard/*" element={<AdaptiveConsumerDashboard />} />
                  <Route path="/dashboard/agent/sub-agents" element={<SubAgents />} />
                  <Route path="/dashboard/agent/earnings" element={<AgentEarnings />} />
                  <Route path="/dashboard/agent/clients" element={<AgentClients />} />
                  <Route path="/dashboard/agent/settings" element={<AgentSettings />} />
                  <Route path="/cfo" element={<CfoDashboard />} />
                  <Route path="/cfo/dashboard" element={<CfoDashboard />} />
                  <Route path="/crm/dashboard" element={<CrmDashboard />} />
                  <Route path="/dashboard/tenant/payments" element={<TenantPayments />} />
                  <Route path="/dashboard/tenant/profile" element={<TenantProfile />} />
                  
                  {/* Executive Hub (CEO, CTO, CMO, CRM, CFO...) */}
                  {executiveRoutes}
                </Route>

                {/* Fallback */}
                <Route path="*" element={
                  <div style={{ padding: '40px', background: '#000', color: '#ff4444', height: '100vh', width: '100vw' }}>
                    <h1 style={{ fontSize: '40px' }}>404 - ROUTER CRASH TRAP</h1>
                    <p style={{ fontSize: '20px' }}>
                      React Router explicitly failed to match the URL you requested. <br /><br />
                      If you arrived here, the Route mapping tree could not locate your path. Please take a screenshot of your URL bar so we know exactly what path was rejected!
                    </p>
                  </div>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
