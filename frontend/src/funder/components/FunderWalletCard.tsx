import { useState } from 'react';
import { Eye, EyeOff, Plus, ArrowUpRight, Briefcase } from 'lucide-react';

interface FunderWalletCardProps {
  totalBalance: number;
  availableLiquid: number;
  totalInvested: number;
  cardId?: string;
  onAddFunds?: () => void;
  onWithdraw?: () => void;
  onPortfolio?: () => void;
}

export default function FunderWalletCard({
  totalBalance,
  availableLiquid,
  totalInvested,
  cardId = 'WL-99201',
  onAddFunds,
  onWithdraw,
  onPortfolio,
}: FunderWalletCardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div
      className="relative overflow-hidden text-white w-full rounded-2xl flex flex-col min-h-[240px]"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        boxShadow: '0 16px 40px var(--color-primary-shadow)',
      }}
    >
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/15 rounded-full -ml-12 -mb-12 blur-2xl pointer-events-none" />

      {/* Edge decoration bubble */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full flex-1 justify-between gap-4">
        
        {/* Top Info row */}
        <div className="flex justify-between items-start">
          <div className="bg-white/10 border border-white/20 px-3 py-1 rounded text-[10px] font-mono tracking-wider mt-1">
            {cardId}
          </div>
          <img src="/welile-logo-white.png" alt="Welile Logo" className="h-12 object-contain" />
        </div>

        {/* Middle Section: Values */}
        <div className="flex flex-col gap-4 mb-2">
          {/* Main Focus: Wallet Balance */}
          <div>
            <p className="text-white/70 text-xs font-semibold mb-1 uppercase tracking-widest flex items-center gap-2">
              Total Funder Value
              <button
                onClick={() => setBalanceVisible((v) => !v)}
                className="opacity-60 hover:opacity-100 transition-opacity p-1"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {balanceVisible ? `UGX ${totalBalance.toLocaleString()}` : 'UGX ********'}
            </h2>
          </div>

          {/* Bucket Segregation UI */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4 mt-2">
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Liquid Balance
              </p>
              <p className="text-white font-bold text-sm sm:text-base">
                {balanceVisible ? `UGX ${availableLiquid.toLocaleString()}` : '********'}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Active Capital
              </p>
              <p className="text-white font-bold text-sm sm:text-base">
                {balanceVisible ? `UGX ${totalInvested.toLocaleString()}` : '********'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 pt-3 sm:pt-4 mt-auto overflow-x-auto pb-1 hide-scrollbar -mx-1 px-1">
          <button
            onClick={onAddFunds}
            className="flex items-center gap-1 sm:gap-1.5 bg-white text-[var(--color-primary)] hover:bg-white/90 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-extrabold text-[10px] sm:text-xs transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Add Funds
          </button>
          
          <button
            onClick={onWithdraw}
            className="flex items-center gap-1 sm:gap-1.5 bg-white/20 border border-white/30 hover:bg-white/30 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-extrabold text-[10px] sm:text-xs transition-colors backdrop-blur-md whitespace-nowrap cursor-pointer"
          >
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Withdraw
          </button>

          <button
            onClick={onPortfolio}
            className="flex items-center gap-1 sm:gap-1.5 bg-white/20 border border-white/30 hover:bg-white/30 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-extrabold text-[10px] sm:text-xs transition-colors backdrop-blur-md whitespace-nowrap cursor-pointer"
          >
            <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Portfolio
          </button>
        </div>

      </div>
    </div>
  );
}
