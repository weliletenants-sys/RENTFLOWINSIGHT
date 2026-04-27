import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function CreditVerificationButton() {
  return (
    <button className="w-full bg-[#512DA8] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#4527a0] transition-colors flex items-center justify-center gap-2 group active:scale-[0.98]">
      <ShieldCheck size={18} className="text-purple-300 group-hover:text-white transition-colors" />
      Run Credit Pre-Verification
    </button>
  );
}
