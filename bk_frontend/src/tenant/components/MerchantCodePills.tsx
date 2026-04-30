import { Zap } from 'lucide-react';

export default function MerchantCodePills() {
  return (
    <div className="flex flex-row items-center justify-center w-full gap-1 sm:gap-2 lg:gap-3 mt-8 pt-6 border-t border-purple-400/20">
      <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-900/40 hover:bg-blue-800/60 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-full cursor-pointer group whitespace-nowrap">
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#ffcc00] flex items-center justify-center text-[10px] sm:text-xs font-black text-black">M</div>
        <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-blue-100">MTN *165*...</span>
        <Zap className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-900/40 hover:bg-blue-800/60 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-full cursor-pointer group whitespace-nowrap">
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#ff0000] flex items-center justify-center text-[10px] sm:text-xs font-black text-white">A</div>
        <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-blue-100">Airtel *185*...</span>
        <Zap className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
      </div>
    </div>
  );
}
