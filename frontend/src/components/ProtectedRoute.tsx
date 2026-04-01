import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  // DEV BYPASS: Allow immediate preview of all protected routes during frontend iteration
  return children ? <>{children}</> : <Outlet />;
}
