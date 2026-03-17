import { useState } from 'react';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

interface FunderWalletCardProps {
  balance: number;
  portfolioValue: number;
  monthlyEarnings: number; // Keeping for compatibility, though we show total returns if available
  earningsGrowthPercent: number;
  cardId?: string;
}

export default function FunderWalletCard({
  balance,
  portfolioValue,
  monthlyEarnings,
  earningsGrowthPercent,
  cardId = 'WL-99201',
}: FunderWalletCardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);

  // We'll use monthlyEarnings as the primary "returns" figure for this display,
  // or a derived total returns if that was passed instead.
  return (
    <div
      className="relative overflow-hidden text-white w-full rounded-2xl flex flex-col"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        boxShadow: '0 16px 40px var(--color-primary-shadow)',
      }}
    >
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/15 rounded-full -ml-12 -mb-12 blur-2xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col">
        {/* Top Info row */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white/10 border border-white/20 px-3 py-1 rounded text-[10px] font-mono tracking-wider">
            {cardId}
          </div>
          <img src="/welile-logo-white.png" alt="Welile Logo" className="h-12 object-contain -my-3" />
        </div>

        {/* Main Vertical Layout */}
        <div className="flex flex-col gap-6">
          {/* Top Focus: Portfolio Value */}
          <div>
            <p className="text-white/80 text-sm font-semibold mb-1 uppercase tracking-widest flex items-center gap-2">
              Total Portfolio Value
              <button
                onClick={() => setBalanceVisible((v) => !v)}
                className="opacity-60 hover:opacity-100 transition-opacity p-1"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
              {balanceVisible ? `UGX ${(portfolioValue / 1_000_000).toFixed(2)}M` : 'UGX ********'}
            </h2>
            
            {/* Secondary Metric: Returns */}
            <div className="flex items-center gap-1.5 text-[var(--color-success)] bg-white/10 w-fit px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-bold text-white">
                {balanceVisible ? `+UGX ${(monthlyEarnings / 1_000_000).toFixed(2)}M returns (+${earningsGrowthPercent}%)` : '+UGX ******** returns (+**%)'}
              </span>
            </div>
          </div>

          {/* Low Emphasis: Wallet Balance */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/70">
              <p className="text-[10px] font-semibold uppercase tracking-wider">Wallet Balance:</p>
              <p className="font-semibold text-sm">
                {balanceVisible ? `UGX ${balance.toLocaleString()}` : '********'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
