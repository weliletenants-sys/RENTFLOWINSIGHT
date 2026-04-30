import React from 'react';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function CTODashboard() {
  return (
    <ExecutiveDashboardLayout role="cto" title="CTO Dashboard">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Infrastructure & Engineering</h1>
          <p className="text-muted-foreground mt-1">Monitor 99.99% uptime, API latencies, and edge function metrics.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="h-48 bg-card border rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-muted-foreground font-medium">Prisma Query Latency</span>
          </div>
          <div className="h-48 bg-card border rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-muted-foreground font-medium">Supabase Edge Invokes</span>
          </div>
        </div>
      </div>
    </ExecutiveDashboardLayout>
  );
}
