import React from 'react';
import { AgentDashboardLayout } from '../components/layout/AgentDashboardLayout';

export default function LandlordOpsDashboard() {
  return (
    <AgentDashboardLayout title="Landlord Operations">
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold">Landlord Operations Hub</h1>
          <p className="text-muted-foreground mt-1 text-sm">Property verifications, Welile Homes listing pipeline, and disputes.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="aspect-square bg-card border rounded-xl flex flex-col items-center justify-center p-4 text-center hover:shadow-md cursor-pointer transition-shadow active:scale-95 touch-manipulation relative">
             <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">8</span>
             <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl mb-3">🏡</div>
             <span className="font-semibold text-sm">Listing Approvals</span>
          </div>
          
          <div className="aspect-square bg-card border rounded-xl flex flex-col items-center justify-center p-4 text-center hover:shadow-md cursor-pointer transition-shadow active:scale-95 touch-manipulation">
             <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl mb-3">🤝</div>
             <span className="font-semibold text-sm">Stage 3 Verification</span>
          </div>

          <div className="aspect-square bg-card border rounded-xl flex flex-col items-center justify-center p-4 text-center hover:shadow-md cursor-pointer transition-shadow active:scale-95 touch-manipulation">
             <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl mb-3">📜</div>
             <span className="font-semibold text-sm">Contracts</span>
          </div>

          <div className="aspect-square bg-card border rounded-xl flex flex-col items-center justify-center p-4 text-center hover:shadow-md cursor-pointer transition-shadow active:scale-95 touch-manipulation">
             <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl mb-3">⚖️</div>
             <span className="font-semibold text-sm">Disputes</span>
          </div>
        </div>
      </div>
    </AgentDashboardLayout>
  );
}
