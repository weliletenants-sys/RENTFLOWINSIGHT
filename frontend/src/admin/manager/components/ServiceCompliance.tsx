import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { ShieldCheck, Crosshair, Fingerprint, AlertTriangle } from 'lucide-react';

export default function ServiceCompliance() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['manager_service_compliance'],
    queryFn: managerApi.getServiceCompliance
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="animate-pulse bg-white border border-slate-200 shadow-sm rounded-2xl h-32"></div>)}
      </div>
    );
  }

  const compliance = response?.data || { total_identities: 0, kyc_verified: 0, compliance_ratio: 0, active_flags: 0 };

  return (
    <div className="bg-white border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden font-inter relative">
      
      <div className="p-6 md:p-8 space-y-8 relative z-10">
        <div className="flex gap-4 items-start pb-4 border-b border-slate-100">
           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
             <ShieldCheck size={24} />
           </div>
           <div>
             <h3 className="font-bold text-slate-900 tracking-tight text-lg">Central Risk & SLA Matrix</h3>
             <p className="text-sm text-slate-500 mt-1 leading-relaxed">Aggregated operational risk analytics monitoring KYC boundaries, overall data compliance parameters, and auditing system flags.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col items-center text-center">
            <Fingerprint className="text-indigo-600 mb-2" size={32} />
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Fingerprints</h4>
            <span className="text-4xl font-black text-slate-900 mt-2 font-mono">{compliance.total_identities}</span>
            <span className="text-xs text-slate-400 mt-2">Active Profiles Modeled</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div className={`absolute bottom-0 left-0 h-1.5 w-full ${compliance.compliance_ratio < 95 ? 'bg-amber-500' : 'bg-green-500'}`} />
            <Crosshair className={`${compliance.compliance_ratio < 95 ? 'text-amber-500' : 'text-green-500'} mb-2`} size={32} />
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">KYC Coverage Vector</h4>
            <span className="text-4xl font-black text-slate-900 mt-2 font-mono">{compliance.compliance_ratio.toFixed(1)}%</span>
            <span className="text-xs text-slate-400 mt-2">Legal Identity Matches</span>
          </div>

          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex flex-col items-center text-center">
             <div className="absolute top-4 right-4 animate-ping w-2 h-2 rounded-full bg-red-500 opacity-75"></div>
             <AlertTriangle className="text-red-500 mb-2" size={32} />
             <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest">SLA Flags (Active)</h4>
             <span className="text-4xl font-black text-red-700 mt-2 font-mono">{compliance.active_flags}</span>
             <span className="text-xs text-red-400 mt-2">Critical Out-of-Bound States</span>
          </div>
        </div>
      </div>
    </div>
  );
}
