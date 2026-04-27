import { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, Target, Activity, Share2, Award, ArrowUpRight
} from 'lucide-react';
import executiveApi from '../../services/executiveApi';
import { useAuth } from '../../contexts/AuthContext';

interface GrowthMetrics {
  metrics: {
    dauCount: number;
    wauCount: number;
    mauCount: number;
    totalUsers: number;
  };
  conversions: {
    tenants: number;
    agents: number;
  };
  leaderboard: Array<{ name: string; count: number }>;
}

export default function CmoDashboard() {
  const [data, setData] = useState<GrowthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useAuth();

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 120000); // Polled every 2m
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await executiveApi.get('/cmo/metrics');
      if (response.data && response.data.data) {
          setData(response.data.data);
      }
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch Marketing metrics', err);
      if (err.response && err.response.data && err.response.data.detail) {
         setError(`Analytics Error: ${err.response.data.detail}`);
      } else {
         setError('Failed to securely tunnel into the Prisma telemetry server.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50 dark:bg-slate-900 rounded-3xl">
        <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-8 rounded-2xl border border-red-200 dark:border-red-800 shadow-sm max-w-4xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
           <Activity size={24} /> Engine Isolation Detected
        </h3>
        <p className="opacity-90 leading-relaxed font-medium">{error}</p>
      </div>
    );
  }

  const { metrics, conversions, leaderboard } = data!;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 font-['Public_Sans']">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
             <TrendingUp className="text-fuchsia-500" size={32} /> 
             Marketing Command Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-xl font-medium">
             Active tracking of platform growth pipelines, retention velocity, and organic funnel trajectories.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Daily Active Users" value={metrics.dauCount} icon={<Activity />} trend="+12% today" color="text-fuchsia-500" bg="bg-fuchsia-100 dark:bg-fuchsia-500/10" />
        <MetricCard label="Weekly Active Users" value={metrics.wauCount} icon={<Target />} trend="Solid Traction" color="text-blue-500" bg="bg-blue-100 dark:bg-blue-500/10" />
        <MetricCard label="Monthly Active Users" value={metrics.mauCount} icon={<Users />} trend="+4.3% this Mo" color="text-emerald-500" bg="bg-emerald-100 dark:bg-emerald-500/10" />
        <MetricCard label="Total Registered Profiles" value={metrics.totalUsers} icon={<Share2 />} color="text-purple-500" bg="bg-purple-100 dark:bg-purple-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Conversion Funnels */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
           <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4 flex justify-between items-center">
             Platform Conversions
           </h3>
           <div className="space-y-4">
               <ConversionBar label="Tenant Conversions" count={conversions.tenants} max={metrics.totalUsers} color="bg-blue-500" />
               <ConversionBar label="Agent Activations" count={conversions.agents} max={metrics.totalUsers} color="bg-emerald-500" />
           </div>
           <p className="text-xs text-slate-400 font-medium leading-relaxed mt-6">
               Note: Conversions mapping directly out of total authenticated users to active operational capabilities.
           </p>
        </div>

        {/* Global Leaderboard */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#170330] to-slate-900 rounded-3xl p-6 shadow-lg border border-purple-900/50">
           <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-3">
              <Award className="text-yellow-400" /> Top Platform Liquidity Drivers
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leaderboard.map((user, idx) => (
                 <div key={idx} className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="size-10 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner">
                          {idx + 1}
                       </div>
                       <div>
                          <p className="text-white font-bold">{user.name}</p>
                          <p className="text-xs text-fuchsia-200">Affiliate Driver</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-white">{user.count}</p>
                       <p className="text-[10px] text-fuchsia-300 font-semibold uppercase tracking-widest">Signups</p>
                    </div>
                 </div>
              ))}
              {leaderboard.length === 0 && (
                 <div className="col-span-1 md:col-span-2 p-6 text-center text-white/50 bg-white/5 rounded-2xl">
                    No active referral volume mapped in system yet.
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, trend, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${bg} ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
            <ArrowUpRight size={14} className="mr-1" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</h3>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

function ConversionBar({ label, count, max, color }: any) {
  const pct = Math.max(0, Math.min(100, (count / (max || 1)) * 100));
  return (
     <div>
        <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span>{label}</span>
            <span>{count.toLocaleString()}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{width: `${pct}%`}} />
        </div>
     </div>
  );
}
