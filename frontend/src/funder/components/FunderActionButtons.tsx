import { PlusCircle, ArrowRightFromLine, PieChart } from 'lucide-react';

interface FunderActionButtonsProps {
  onDeposit: () => void;
  onWithdraw: () => void;
  onPortfolio?: () => void;
}

export default function FunderActionButtons({ onDeposit, onWithdraw, onPortfolio }: FunderActionButtonsProps) {
  const actions = [
    { label: 'Add Funds', icon: <PlusCircle className="w-6 h-6" />, onClick: onDeposit },
    { label: 'Withdraw',  icon: <ArrowRightFromLine className="w-6 h-6" />, onClick: onWithdraw },
    { label: 'Portfolio', icon: <PieChart className="w-6 h-6" />, onClick: onPortfolio },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="flex flex-col items-center gap-2 group"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'var(--color-primary)';
              (e.currentTarget as HTMLDivElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'var(--color-primary-light)';
              (e.currentTarget as HTMLDivElement).style.color = 'var(--color-primary)';
            }}
          >
            {action.icon}
          </div>
          <span className="text-xs font-semibold text-gray-700 group-hover:text-[var(--color-primary)] transition-colors">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
