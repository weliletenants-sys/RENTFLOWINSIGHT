import { useState, useEffect } from 'react';
import { Home, Users, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import MyPropertiesSheet from './MyPropertiesSheet';
import RegisterPropertyDialog from './RegisterPropertyDialog';
import MyTenantsSection from './MyTenantsSection';
import LandlordAddTenantDialog from './LandlordAddTenantDialog';
import TenantRating from './TenantRating';
import EncouragementMessageDialog from './EncouragementMessageDialog';
import LandlordPaymentHistory from './LandlordPaymentHistory';
import LandlordWelileHomesSection from './LandlordWelileHomesSection';
import EnrollTenantWelileHomesDialog from './EnrollTenantWelileHomesDialog';

import { 
  useLandlordOverview, 
  useLandlordProperties, 
  useLandlordTenants, 
  useLandlordHistory 
} from './hooks/useLandlordQueries';

export default function LandlordDashboard() {
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isRegisterPropOpen, setIsRegisterPropOpen] = useState(false);
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [ratingTenantId, setRatingTenantId] = useState<string | null>(null);
  const [encourageTenantId, setEncourageTenantId] = useState<string | null>(null);
  const [isEnrollWelileOpen, setIsEnrollWelileOpen] = useState(false);

  const { data: overview, isLoading: isOverviewLoading } = useLandlordOverview();
  const { data: properties = [], isLoading: isPropertiesLoading } = useLandlordProperties();
  const { data: tenants = [], isLoading: isTenantsLoading } = useLandlordTenants();
  const { data: history = [], isLoading: isHistoryLoading } = useLandlordHistory();

  const isLoading = isOverviewLoading || isPropertiesLoading || isTenantsLoading || isHistoryLoading;

  useEffect(() => {
    let toastId: string;
    if (isLoading) {
      toastId = toast.loading('Loading dashboard...', { position: 'top-center' });
    }
    return () => {
      if (toastId) toast.dismiss(toastId);
    };
  }, [isLoading]);

  if (isLoading) {
    return <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 border-gray-100 dark:bg-slate-950 p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Landlord Overview
          </h1>
          <p className="text-slate-500 mt-1 dark:text-slate-400">
            Monitor your property performance and tenant engagements.
          </p>
        </div>
        <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm flex items-center gap-2 text-slate-700 dark:text-slate-200">
          Download Statement
        </button>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <p className="text-purple-100 font-medium mb-4">Total Expected Monthly Rent</p>
          <h2 className="text-4xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl opacity-80">UGX</span> 
            {overview?.totalExpectedRent?.toLocaleString() || '0'}
          </h2>
          <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center text-sm">
            <span>{overview?.totalProperties || 0} Properties</span>
            <span className="bg-white/20 px-2 py-1 rounded-full">{overview?.totalTenants || 0} Tenants</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-purple-200 transition group cursor-pointer" onClick={() => setIsAddTenantOpen(true)}>
          <div>
            <div className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Tenant Growth</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">Add New Tenant</h3>
          </div>
          <div className="flex items-center text-purple-600 text-sm font-semibold mt-4 group-hover:translate-x-2 transition-transform">
            Invite to platform <ChevronRight size={16} className="ml-1" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-200 transition group cursor-pointer" onClick={() => setIsPropertiesOpen(true)}>
          <div>
            <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Home size={24} />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Property Portfolio</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">Manage Properties</h3>
          </div>
          <div className="flex items-center text-indigo-600 text-sm font-semibold mt-4 group-hover:translate-x-2 transition-transform">
            View details <ChevronRight size={16} className="ml-1" />
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="space-y-8">
        <MyTenantsSection 
          tenants={tenants}
          onOpenAddTenant={() => setIsAddTenantOpen(true)}
          onOpenRating={(id) => setRatingTenantId(id)}
          onOpenEncourage={(id) => setEncourageTenantId(id)}
        />

        <LandlordWelileHomesSection 
          welileSavings={overview?.totalWelileSavingsGenerated || 0}
          onOpenEnroll={() => setIsEnrollWelileOpen(true)}
        />

        <LandlordPaymentHistory payments={history} />
      </div>

      {/* Render Dialogs & Sheets */}
      <MyPropertiesSheet 
        isOpen={isPropertiesOpen} 
        properties={properties}
        onClose={() => setIsPropertiesOpen(false)} 
        onOpenRegister={() => setIsRegisterPropOpen(true)} 
      />
      
      <RegisterPropertyDialog 
        isOpen={isRegisterPropOpen} 
        onClose={() => setIsRegisterPropOpen(false)} 
      />
      
      <LandlordAddTenantDialog 
        isOpen={isAddTenantOpen} 
        properties={properties}
        onClose={() => setIsAddTenantOpen(false)} 
      />
      
      <TenantRating 
        isOpen={!!ratingTenantId} 
        tenantId={ratingTenantId} 
        onClose={() => setRatingTenantId(null)} 
      />
      
      <EncouragementMessageDialog 
        isOpen={!!encourageTenantId} 
        tenantId={encourageTenantId} 
        onClose={() => setEncourageTenantId(null)} 
      />
      
      <EnrollTenantWelileHomesDialog 
        isOpen={isEnrollWelileOpen} 
        tenants={tenants}
        onClose={() => setIsEnrollWelileOpen(false)} 
      />
      
    </div>
  );
}
