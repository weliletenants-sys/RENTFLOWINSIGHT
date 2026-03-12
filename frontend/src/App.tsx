import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootDashboard from './pages/dashboard/RootDashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import RoleSelection from './pages/auth/RoleSelection';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import WelcomePage from './pages/WelcomePage';
import TenantAgreement from './tenant/TenantAgreement';
import TenantOnboarding from './tenant/TenantOnboarding';
import ApplicationStatus from './tenant/ApplicationStatus';
import RentRequestForm from './pages/auth/RentRequestForm';
import AgentWelcome from './agent/AgentWelcome';
import AgentSignup from './agent/AgentSignup';
import AgentAgreement from './agent/AgentAgreement';
import AgentKYC from './agent/AgentKYC';
import AgentKYCReview from './agent/AgentKYCReview';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/agent-welcome" element={<AgentWelcome />} />
            <Route path="/agent-signup" element={<AgentSignup />} />
            <Route path="/agent-agreement" element={<AgentAgreement />} />
            <Route path="/agent-kyc" element={<AgentKYC />} />
            <Route path="/agent-kyc-review" element={<AgentKYCReview />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/tenant-agreement" element={<TenantAgreement />} />
            <Route path="/tenant-onboarding" element={<TenantOnboarding />} />
            <Route path="/application-status" element={<ApplicationStatus />} />
            <Route path="/rent-request" element={<RentRequestForm />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/*" element={<RootDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
