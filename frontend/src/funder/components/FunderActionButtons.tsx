import { PlusCircle, ArrowRightFromLine, PieChart } from 'lucide-react';

interface FunderActionButtonsProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  onPortfolio?: () => void;
}

export default function FunderActionButtons({ balance, onDeposit, onWithdraw, onPortfolio }: FunderActionButtonsProps) {
  const actions = [
    { label: 'Add Funds', icon: <PlusCircle className="w-6 h-6" />, onClick: onDeposit },
    { label: 'Withdraw',  icon: <ArrowRightFromLine className="w-6 h-6" />, onClick: onWithdraw },
    { label: 'Portfolio', icon: <PieChart className="w-6 h-6" />, onClick: onPortfolio },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Wallet Balance Display */}
      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Available Balance
        </p>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          <span className="text-xl text-slate-400 mr-1 font-bold">UGX</span>
          {balance.toLocaleString()}
        </h2>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-[var(--color-primary-light)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white shadow-sm"
            >
              {action.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-600 group-hover:text-[var(--color-primary)] transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
