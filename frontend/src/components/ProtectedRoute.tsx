import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  // FRONTEND DEV OVERRIDE: Disabled all route guards so every page is accessible
  /*
  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, but no role is selected, force redirection to role selection.
  if (!user.role && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }
  */

  // Render children components or nested routes via React Router's Outlet
  return children ? <>{children}</> : <Outlet />;
}
