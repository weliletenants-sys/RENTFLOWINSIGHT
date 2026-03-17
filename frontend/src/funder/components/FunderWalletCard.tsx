import { useState } from 'react';
import { Eye, EyeOff, Calendar } from 'lucide-react';

interface FunderWalletCardProps {
  balance: number;
  principal: number;
  expectedAmount: number;
  roiPercent?: number;
  cardId?: string;
  payoutMode?: string;
}

export default function FunderWalletCard({
  balance,
  principal,
  cardId = 'WL-99201',
  payoutMode = 'Monthly Payout',
}: FunderWalletCardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div
      className="relative overflow-hidden text-white w-full min-h-[220px] flex flex-col justify-between"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-darker) 100%)',
        borderRadius: '8px',
        boxShadow: '0 12px 40px var(--color-primary-shadow)',
      }}
    >
      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-8 -mb-8 blur-2xl pointer-events-none" />

      {/* Edge decoration bubble */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />

      <div className="relative z-10 p-5 flex flex-col flex-1">
        {/* Top row: card ID + brand */}
        <div className="flex justify-between items-start mb-5">
          <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mt-2">
            {cardId}
          </span>
          <img src="/welile-logo-white.png" alt="Welile Logo" className="h-12 object-contain" />
        </div>

        {/* Balance */}
        <div className="mb-5">
          <p className="text-white/70 text-xs font-medium mb-1">Total Balance</p>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">
              {balanceVisible ? `UGX ${balance.toLocaleString()}` : 'UGX ********'}
            </h2>
            <button
              onClick={() => setBalanceVisible((v) => !v)}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom row: payout mode + total invested */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-4 border-t border-white/20 mt-auto">
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{payoutMode}</span>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-[10px]">Total Invested</p>
            <p className="text-white font-semibold text-sm">
              UGX {(principal / 1_000_000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
