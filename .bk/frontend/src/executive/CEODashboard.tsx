import React from 'react';
import { 
  Users, Home, CreditCard, UserCheck, Briefcase, 
  DollarSign, TrendingUp, Shield, Activity, UserPlus, 
  RefreshCcw, Share2, List, Search, Download, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  useCeoKpis, 
  useCeoGrowthMetrics, 
  useCeoCharts, 
  useCeoRentRequestsTable 
} from '../hooks/useExecutiveQueries';

// --- HELPERS ---
const formatCompact = (val: number): string => {
  if (!val) return '0';
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toString();
};

const formatCurrency = (val: number): string => {
  if (!val) return '0';
  return new Intl.NumberFormat('en-UG').format(val);
};

const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = 'bg-slate-100 text-slate-600';
  const s = status.toLowerCase();
  if (s === 'funded') colorClass = 'bg-emerald-50 text-emerald-600 font-bold';
  if (s === 'rejected' || s === 'defaulted') colorClass = 'bg-red-50 text-red-600';
  if (s.includes('approved')) colorClass = 'bg-blue-50 text-blue-600';
  
  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider ${colorClass}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default function CEODashboard() {
  const { data: kpis, isLoading: kpisLoading } = useCeoKpis();
  const { data: growth, isLoading: growthLoading } = useCeoGrowthMetrics();
  const { data: charts, isLoading: chartsLoading } = useCeoCharts();
  const { data: rentRequests, isLoading: tableLoading } = useCeoRentRequestsTable();

  const isGlobalLoading = kpisLoading || growthLoading || chartsLoading || tableLoading;

  if (isGlobalLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[50vh] text-slate-400">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={32} />
        <p className="font-medium">Aggregating platform metrics...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Block */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">Platform Strategy & Overview</h1>
          <p className="text-slate-500 mt-1 text-[15px]">High-level visibility over RentFlowInsight's growth and scale limits.</p>
        </div>
        
        {/* TOP KPI GRID (4x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={<Users className="text-purple-600" size={20}/>} title="Total Users" value={formatCompact(kpis?.totalUsers || 0).replace('.0', '')} color="bg-purple-100" />
          <KpiCard icon={<Home className="text-emerald-600" size={20}/>} title="Tenants Funded" value={formatCompact(kpis?.tenantsFunded || 0).replace('.0', '')} color="bg-emerald-100" />
          <KpiCard icon={<CreditCard className="text-blue-600" size={20}/>} title="Rent Financed" value={formatCompact(kpis?.rentFinanced || 0)} color="bg-blue-100" />
          <KpiCard icon={<UserCheck className="text-orange-600" size={20}/>} title="Total Landlords" value={formatCompact(kpis?.totalLandlords || 0).replace('.0', '')} color="bg-orange-100" />
          
          <KpiCard icon={<Briefcase className="text-indigo-600" size={20}/>} title="Partners/Investors" value={formatCompact(kpis?.partnersInvestors || 0).replace('.0', '')} color="bg-indigo-100" />
          <KpiCard icon={<DollarSign className="text-green-600" size={20}/>} title="Platform Revenue" value={formatCompact(kpis?.platformRevenue || 0)} color="bg-green-100" />
          <KpiCard icon={<TrendingUp className="text-teal-600" size={20}/>} title="Rent Repaid" value={`${formatCompact((kpis?.rentFinanced || 0) * ((kpis?.rentRepaidPercentage || 0) / 100))}`} color="bg-teal-100" />
          <KpiCard icon={<Shield className="text-rose-600" size={20}/>} title="Active Agents" value={formatCompact(kpis?.activeAgents || 0).replace('.0', '')} color="bg-rose-100" />
        </div>

        {/* GROWTH METRICS */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">Growth Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
             <KpiCard icon={<Activity className="text-purple-600" size={18}/>} title="Active Users" value={formatCompact(growth?.activeUsers || 0).replace('.0', '')} color="bg-purple-100" compact />
             <KpiCard icon={<UserPlus className="text-emerald-600" size={18}/>} title="New Users Today" value={formatCompact(growth?.newUsers || 0).replace('.0', '')} color="bg-emerald-100" compact />
             <KpiCard icon={<RefreshCcw className="text-blue-600" size={18}/>} title="Retention" value={`${growth?.retentionRate || 0}%`} color="bg-blue-100" compact />
             <KpiCard icon={<Share2 className="text-indigo-600" size={18}/>} title="Referrals" value={`${growth?.referralRate || 0}%`} color="bg-indigo-100" compact />
             <KpiCard icon={<List className="text-orange-600" size={18}/>} title="Daily Transactions" value={formatCompact(growth?.dailyTransactions || 0).replace('.0', '')} color="bg-orange-100" compact />
          </div>
        </div>

        {/* CHARTS GRID (3 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard title="Tenant Growth">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={charts?.tenantGrowth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} tickFormatter={(val) => { const d = new Date(val); return isNaN(d.getTime()) ? val.substring(0,3) : d.toLocaleString('en-US', {month: 'short'}); }} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="new_tenants" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Capital Raised">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts?.capitalRaised || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000000}M`} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Rent Repayment">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={charts?.rentRepayment || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000000}M`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="repaid" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorRent)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* RECENT DATA TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-slate-800">Recent Rent Requests</h3>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none w-48 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                />
              </div>
              
              <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1.5 outline-none text-slate-600 focus:border-purple-400 focus:ring-1 focus:ring-purple-400">
                <option>All Status</option>
                <option>Funded</option>
                <option>Rejected</option>
              </select>

              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                 <Download size={14} /> CSV
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                 <Download size={14} /> PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 font-medium">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Amount (UGX)</th>
                  <th className="px-6 py-3 font-medium">Repaid (UGX)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(rentRequests || []).map((req: any, idx: number) => (
                  <tr key={req.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 text-slate-900 font-medium text-[13px]">
                      {new Date(req.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-6 py-3.5"><StatusBadge status={req.status} /></td>
                    <td className="px-6 py-3.5 text-slate-600 text-[13px]">{formatCurrency(req.amount)}</td>
                    <td className="px-6 py-3.5 text-slate-600 text-[13px]">{formatCurrency(req.amount_repaid)}</td>
                  </tr>
                ))}
                {(!rentRequests || rentRequests.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No recent rent requests localized to the platform.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Showing {Math.min(rentRequests?.length || 0, 50)} records
          </div>
        </div>

      </div>
    </>
  );
}

// --- SUBCOMPONENTS ---

function KpiCard({ icon, title, value, color, compact = false }: { icon: any, title: string, value: string, color: string, compact?: boolean }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className={`text-slate-500 font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{title}</p>
        <p className={`font-bold text-slate-900 ${compact ? 'text-xl' : 'text-2xl'} leading-tight`}>{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200">
      <h3 className="text-sm font-bold text-slate-900 mb-6">{title}</h3>
      {children}
    </div>
  );
}
