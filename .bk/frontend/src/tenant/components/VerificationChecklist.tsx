import { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import TenantKYCDialog from './TenantKYCDialog';

interface VerificationChecklistProps {
  isVerified?: boolean;
}

export default function VerificationChecklist({ isVerified = false }: VerificationChecklistProps) {
  const [internalVerified, setInternalVerified] = useState(isVerified);
  const [isKYCOpen, setIsKYCOpen] = useState(false);

  if (internalVerified) {
     return (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-xl mt-6">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-6 h-6 text-emerald-600" />
             <div>
               <h4 className="text-sm font-bold text-emerald-900">Fully Verified Tenant</h4>
               <p className="text-[11px] font-semibold text-emerald-700 tracking-wide">All compliance checks passed</p>
             </div>
          </div>
          <span className="text-3xl">🎉</span>
        </div>
     );
  }

  return (
    <div className="flex flex-col gap-3 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm mt-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
         <ShieldCheck className="w-6 h-6 text-[#1a56db]" />
         <div>
           <h4 className="text-[15px] font-bold text-slate-900">Verification Steps</h4>
           <p className="text-xs font-medium text-slate-500">Complete AI profiling to unlock loans</p>
         </div>
         <div className="ml-auto bg-[#eef2fd] px-3 py-1 rounded-full text-xs font-bold text-[#1a56db]">1 / 3</div>
      </div>
      
      <div className="space-y-3 mt-2">
         <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-slate-700">Phone Verification</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
            <span className="text-sm font-semibold text-slate-500">National ID Scan</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
            <span className="text-sm font-semibold text-slate-500">Facial Recognition (KYC)</span>
         </div>
      </div>

      <button 
        onClick={() => setIsKYCOpen(true)}
        className="w-full mt-4 bg-[#f4f7fa] hover:bg-[#1a56db] text-[#1a56db] hover:text-white font-bold text-sm py-2.5 rounded-xl transition-colors"
      >
        Continue Verification
      </button>

      <TenantKYCDialog 
         isOpen={isKYCOpen} 
         onClose={() => setIsKYCOpen(false)} 
         onVerificationComplete={() => setInternalVerified(true)} 
      />
    </div>
  );
}
