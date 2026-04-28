import { Shield, TrendingUp, Info } from 'lucide-react';


interface LandlordWelileHomesSectionProps {
  onOpenEnroll: () => void;
  welileSavings: number;
}

export default function LandlordWelileHomesSection({ onOpenEnroll, welileSavings = 0 }: LandlordWelileHomesSectionProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-900/30 rounded-[2rem] p-6 shadow-sm border border-emerald-100 dark:border-emerald-900 relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-200/50 dark:bg-emerald-800/20 rounded-full blur-3xl opacity-50" />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full text-emerald-700 dark:text-emerald-400 text-sm font-bold shadow-sm mb-4">
            <Shield size={16} />
            <span>Welile Homes Guaranteed Program</span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Turn their rent into their future home.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            When you enroll a tenant into the Welile Homes Savings program, we guarantee your rent in full. 10% of their rent payments are redirected to their savings to build towards property ownership.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl shadow-emerald-500/10 border border-emerald-100 dark:border-emerald-800 w-full md:w-auto flex-shrink-0">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tenant Wealth Generated</p>
            <Info size={16} className="text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <TrendingUp size={24} />
            UGX {(welileSavings).toLocaleString()}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onOpenEnroll}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl transition text-sm text-center"
            >
              Enroll a Tenant
            </button>
            <button className="flex-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-semibold py-2.5 px-6 rounded-xl transition border border-emerald-200 dark:border-emerald-700 text-sm text-center">
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
