import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFunderEventStream } from '../funder/hooks/useFunderEventStream';

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  // Establish SSE background connection for active funders
  useFunderEventStream();

  if (!user) {
    const isFunderRoute = location.pathname.startsWith('/funder');
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (isAdminRoute) return <Navigate to="/admin/login" replace />;
    if (isFunderRoute) return <Navigate to="/funder/login" replace />;
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
