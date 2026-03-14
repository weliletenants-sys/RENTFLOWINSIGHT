import { Route } from 'react-router-dom';
import TenantAgreement from '../tenant/TenantAgreement';
import TenantOnboarding from '../tenant/TenantOnboarding';
import ApplicationStatus from '../tenant/ApplicationStatus';
import RentRequestForm from '../pages/auth/RentRequestForm';

/**
 * Tenant role routes.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const tenantRoutes = [
  <Route key="tenant-agreement" path="/tenant-agreement" element={<TenantAgreement />} />,
  <Route key="tenant-onboarding" path="/tenant-onboarding" element={<TenantOnboarding />} />,
  <Route key="application-status" path="/application-status" element={<ApplicationStatus />} />,
  <Route key="rent-request" path="/rent-request" element={<RentRequestForm />} />,
];
