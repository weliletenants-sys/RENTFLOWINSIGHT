import { CheckCircle } from 'lucide-react';

interface WalletCardProps {
  balance: number;
  onClick?: () => void;
}

export default function WalletCard({ balance, onClick }: WalletCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#482D98] p-6 rounded-[1.75rem] text-white shadow-xl shadow-purple-500/20 relative overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
    >
      <div className="relative z-10 flex justify-between items-center mb-8">
        <p className="text-purple-200/90 font-medium text-[15px]">Welile Wallet</p>
        <span className="bg-white/5 px-4 py-1.5 rounded-2xl text-[13px] font-bold border border-white/10 text-white shadow-sm flex items-center gap-1.5">
          <CheckCircle size={15} strokeWidth={2} className="text-white" /> Active
        </span>
      </div>
      
      <h2 className="relative z-10 flex items-baseline gap-2">
        <span className="text-xl font-bold opacity-80 tracking-wide">UGX</span>
        <span className="text-[40px] font-black tracking-tight leading-none">{balance.toLocaleString()}</span>
      </h2>
    </div>
  );
}
