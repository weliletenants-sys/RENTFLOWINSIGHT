import { ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreditAccessCardProps {
  creditLimit: number;
}

export default function CreditAccessCard({ creditLimit }: CreditAccessCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/my-loans')}
      className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100/50 dark:border-emerald-800/30 rounded-2xl p-4 flex items-center justify-between shadow-sm group cursor-pointer transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white dark:bg-emerald-900/50 rounded-full flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-700/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300">
          <ShieldCheck size={24} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold tracking-wider mb-0.5 uppercase transition-colors">Credit Access Limit</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-400 dark:text-slate-500 transition-colors">UGX</span>
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">{creditLimit.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="w-8 h-8 rounded-full bg-white dark:bg-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm transition-transform group-hover:translate-x-1 border border-transparent dark:border-emerald-700/30">
        <ChevronRight size={18} />
      </div>
    </div>
  );
}
