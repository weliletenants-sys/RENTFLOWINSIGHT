import React from 'react';
import { Navigate } from 'react-router-dom';

// The DashboardAccessPanel points /hr/dashboard to "Company Staff".
// Since we already built a massive HR Module at /hr/dashboard, 
// this is just an explicit wrapper or redirect to ensure routing integrity 
// if they navigate specifically here.
export default function CompanyStaffDashboard() {
  return <Navigate to="/hr/dashboard" replace />;
}
