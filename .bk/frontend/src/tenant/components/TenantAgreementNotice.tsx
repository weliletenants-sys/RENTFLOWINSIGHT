import { AlertTriangle, ChevronRight } from 'lucide-react';

export default function TenantAgreementNotice({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="w-full bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 mb-6 shadow-sm flex items-start gap-4 cursor-pointer hover:bg-[#fef3c7] transition-colors group"
    >
      <div className="bg-[#fef3c7] p-2 rounded-lg text-[#d97706] shrink-0">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-[#92400e]">Platform Terms Acceptance Required</h4>
        <p className="text-xs font-semibold text-[#b45309] mt-0.5 leading-relaxed">
          You must review and accept the Welile Tenant Agreement to unlock rent requests, wallet withdrawals, and loan progression features.
        </p>
      </div>
      <div className="shrink-0 flex items-center h-full pt-1">
         <ChevronRight className="w-5 h-5 text-[#d97706] group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
