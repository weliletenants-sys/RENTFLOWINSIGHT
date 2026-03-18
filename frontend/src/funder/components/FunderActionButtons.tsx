import { TrendingUp, Wallet } from 'lucide-react';

interface FunderActionButtonsProps {
  portfolioValue?: number;
  roiPercent?: number;
}

export default function FunderActionButtons({ portfolioValue = 0, roiPercent = 0 }: FunderActionButtonsProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl px-5 py-4 sm:p-8 flex flex-col justify-center shadow-lg relative overflow-hidden w-full h-[150px] sm:h-[220px] transition-all hover:shadow-emerald-500/20">
      
      {/* Decorative large watermark icon */}
      <div className="absolute -right-8 -bottom-12 opacity-10 pointer-events-none transform -rotate-12">
        <Wallet className="w-56 h-56 text-white" />
      </div>

      <div className="relative z-10 flex flex-col gap-1 sm:gap-2">
        <p className="text-emerald-100 font-extrabold uppercase tracking-[0.2em] text-xs sm:text-sm drop-shadow-sm">
          Principal
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-1 sm:mt-2">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-none drop-shadow-md flex items-start">
            <sup className="text-xs sm:text-sm text-emerald-100 mr-1.5 font-bold tracking-widest mt-1">UGX</sup>
            {(portfolioValue / 1_000_000).toFixed(2)}M
          </h2>

          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-emerald-700">
            <TrendingUp className="w-3.5 h-3.5 stroke-[3]" />
            <span className="text-[10px] font-black tracking-tight">+{roiPercent}%</span>
          </div>
        </div>
      </div>

    </div>
  );
}
