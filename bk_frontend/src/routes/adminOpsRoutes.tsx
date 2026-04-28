import { lazy, Suspense } from 'react';
import { Route, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import FinancialOpsCommandCenter from '../admin/finops/FinancialOpsCommandCenter';
import TenantOpsDashboard from '../ops/TenantOpsDashboard';
import AgentOpsDashboard from '../ops/AgentOpsDashboard';
import LandlordOpsDashboard from '../ops/LandlordOpsDashboard';
import PartnerOpsDashboard from '../ops/PartnerOpsDashboard';
import CompanyStaffDashboard from '../hr/CompanyStaffDashboard';

// HROverview from earlier session
import HROverview from '../hr/HROverview';
import HRLeaveManagement from '../hr/HRLeaveManagement';
import HREmployeeDirectory from '../hr/HREmployeeDirectory';
import HRPayroll from '../hr/HRPayroll';

const CentralLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// We assume these ops personnel might have generic 'ADMIN' role plus specific department flags,
// or we can allow 'SUPER_ADMIN' to view all.
function RequireOpsRole({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user || (!['ADMIN', 'SUPER_ADMIN'].includes(user.role || ''))) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}

export const adminOpsRoutes = (
  <Route path="ops" key="ops">
    <Route 
      path="finops" 
      element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><FinancialOpsCommandCenter /></Suspense></RequireOpsRole>} 
    />
    <Route 
      path="tenant" 
      element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><TenantOpsDashboard /></Suspense></RequireOpsRole>} 
    />
    <Route 
      path="agent" 
      element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><AgentOpsDashboard /></Suspense></RequireOpsRole>} 
    />
    <Route 
      path="landlord" 
      element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><LandlordOpsDashboard /></Suspense></RequireOpsRole>} 
    />
    <Route 
      path="partner" 
      element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><PartnerOpsDashboard /></Suspense></RequireOpsRole>} 
    />
  </Route>
);

export const hrRoutes = (
  <Route path="hr" element={<Outlet />} key="hr">
    <Route path="dashboard" element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><CompanyStaffDashboard /></Suspense></RequireOpsRole>} />
    <Route path="overview" element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><HROverview /></Suspense></RequireOpsRole>} />
    <Route path="leave" element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><HRLeaveManagement /></Suspense></RequireOpsRole>} />
    <Route path="directory" element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><HREmployeeDirectory /></Suspense></RequireOpsRole>} />
    <Route path="payroll" element={<RequireOpsRole><Suspense fallback={<CentralLoader />}><HRPayroll /></Suspense></RequireOpsRole>} />
  </Route>
);
