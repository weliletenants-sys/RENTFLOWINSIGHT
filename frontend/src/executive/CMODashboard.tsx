import React from 'react';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function CMODashboard() {
  return (
    <ExecutiveDashboardLayout role="cmo" title="CMO Dashboard">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing & Growth</h1>
          <p className="text-muted-foreground mt-1">Analyze agent acquisition funnels, digital ad conversion, and tenant onboarding.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="h-64 col-span-2 bg-card border rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-muted-foreground font-medium">Acquisition Funnel Analytics</span>
          </div>
          <div className="h-64 bg-card border rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-muted-foreground font-medium">Referral Campaign ROI</span>
          </div>
        </div>
      </div>
    </ExecutiveDashboardLayout>
  );
}
