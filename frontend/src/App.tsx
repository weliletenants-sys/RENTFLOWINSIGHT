import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ProtectedRoute from './components/ProtectedRoute';
import RootDashboard from './pages/dashboard/RootDashboard';

// --- Role-based route groups ---
import { publicRoutes } from './routes/publicRoutes';
import { agentRoutes } from './routes/agentRoutes';
import { tenantRoutes } from './routes/tenantRoutes';
import { funderRoutes } from './routes/funderRoutes';

const queryClient = new QueryClient();

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
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
