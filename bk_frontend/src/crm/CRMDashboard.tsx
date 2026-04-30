import React from 'react';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function CRMDashboard() {
  return (
    <ExecutiveDashboardLayout role="crm" title="CRM Dashboard">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Support & Disputes</h1>
          <p className="text-muted-foreground mt-1">Manage tenant escalations, landlord disputes, and operational tickets.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="h-32 bg-card border rounded-xl flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-bold text-destructive">14</span>
            <span className="text-muted-foreground text-sm font-medium mt-1">Critical Tickets</span>
          </div>
          <div className="h-32 bg-card border rounded-xl flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-bold text-amber-500">42</span>
            <span className="text-muted-foreground text-sm font-medium mt-1">Pending Disputes</span>
          </div>
          <div className="h-32 bg-card border rounded-xl flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-bold text-primary">128</span>
            <span className="text-muted-foreground text-sm font-medium mt-1">Resolved Today</span>
          </div>
        </div>
      </div>
    </ExecutiveDashboardLayout>
  );
}
