import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// We will build these shortly
import RootDashboard from './pages/dashboard/RootDashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import RoleSelection from './pages/auth/RoleSelection';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Entry point: Choose your path */}
            <Route path="/" element={<RoleSelection />} />
            
            {/* Gateway: Landing hero with Signup/Login choices */}
            <Route path="/welcome" element={<LandingPage />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes require User Auth */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/*" element={<RootDashboard />} />
            </Route>

            {/* Redirects */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
