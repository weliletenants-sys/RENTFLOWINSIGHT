import { ShieldCheck } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function PrimaryVisitTenantCTA({ onClick }: Props) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
       <button 
         onClick={onClick}
         className="w-full bg-gradient-to-r from-[#9333ea] to-[#7e22ce] text-white rounded-[20px] px-6 py-4 shadow-[0_8px_30px_rgb(147,51,234,0.3)] flex flex-col items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all outline-none border border-white/10"
       >
          <div className="flex items-center gap-2">
            <ShieldCheck size={28} className="fill-white/20 text-white" />
            <span className="text-xl font-black tracking-wide">Visit Tenant</span>
          </div>
          <span className="text-xs font-medium text-white/80 tracking-widest uppercase">GPS Check-in & Collect</span>
       </button>
    </div>
  );
}
