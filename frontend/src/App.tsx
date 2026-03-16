import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ProtectedRoute from './components/ProtectedRoute';
import RootDashboard from './pages/dashboard/RootDashboard';

// Dashboard sub-routes from HEAD
import SubAgents from './agent/SubAgents';
import AgentEarnings from './agent/AgentEarnings';
import AgentClients from './agent/AgentClients';
import AgentSettings from './agent/AgentSettings';
import TenantPayments from './tenant/TenantPayments';
import TenantProfile from './tenant/TenantProfile';

// --- Role-based route groups ---
import { publicRoutes } from './routes/publicRoutes';
import { agentRoutes } from './routes/agentRoutes';
import { tenantRoutes } from './routes/tenantRoutes';
import { funderRoutes } from './routes/funderRoutes';

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
        borderTopColor: '#9234EA',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

class GlobalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: 'red', color: 'white', fontFamily: 'monospace' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.error?.stack}</pre>
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
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public / auth routes */}
                {publicRoutes}

                {/* Role-specific routes */}
                {agentRoutes}
                {tenantRoutes}
                {funderRoutes}

                {/* Protected: authenticated users only */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard/*" element={<RootDashboard />} />
                  <Route path="/dashboard/agent/sub-agents" element={<SubAgents />} />
                  <Route path="/dashboard/agent/earnings" element={<AgentEarnings />} />
                  <Route path="/dashboard/agent/clients" element={<AgentClients />} />
                  <Route path="/dashboard/agent/settings" element={<AgentSettings />} />
                  <Route path="/dashboard/tenant/payments" element={<TenantPayments />} />
                  <Route path="/dashboard/tenant/profile" element={<TenantProfile />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
