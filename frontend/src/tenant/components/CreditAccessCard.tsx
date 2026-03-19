import { ShieldCheck, ChevronRight } from 'lucide-react';

interface CreditAccessCardProps {
  creditLimit: number;
}

export default function CreditAccessCard({ creditLimit }: CreditAccessCardProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-2xl p-4 flex items-center justify-between shadow-sm group cursor-pointer transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-emerald-100 text-emerald-600 group-hover:scale-105 transition-transform duration-300">
          <ShieldCheck size={24} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs text-emerald-700 font-bold tracking-wider mb-0.5 uppercase">Credit Access Limit</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-400">UGX</span>
            <span className="text-xl font-black text-gray-900 tracking-tight">{creditLimit.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm transition-transform group-hover:translate-x-1">
        <ChevronRight size={18} />
      </div>
    </div>
  );
}
