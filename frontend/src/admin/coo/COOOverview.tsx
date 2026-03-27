import React, { useEffect, useState } from 'react';
import { Users, Briefcase, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, UserCheck, Wallet, Activity, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchOverviewMetrics, type COOOverviewMetrics } from '../../services/cooApi';

const COOOverview: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<COOOverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOverviewMetrics();
        setMetrics(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
        <div 
          className="w-12 h-12 rounded-full border-4 animate-spin mb-4" 
          style={{ borderColor: 'var(--color-primary-light, #EAE5FF)', borderTopColor: 'var(--color-primary, #6c11d4)' }} 
        />
        <p className="text-slate-500 font-medium text-sm">Aggregating platform operations...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center shadow-sm max-w-2xl mt-8">
        <AlertTriangle className="w-8 h-8 mr-4 shrink-0" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Dashboard</h3>
          <p className="text-sm opacity-90">{error || 'Unknown rendering error'}</p>
        </div>
      </div>
    );
  }

  // Formatting helpers
  const formatMoney = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return '0';
    if (typeof amount !== 'number') return '0';
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toLocaleString();
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT / MAIN COLUMN ── */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Main KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[length:100%_100%] transition-all" style={{ backgroundColor: 'var(--color-primary, #6c11d4)' }}></div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wide">Total Investment</span>
                <div className="p-2 rounded-lg bg-slate-50 text-[var(--color-primary)]">
                  <Briefcase size={20} />
                </div>
              </div>
              <div>
                 <h3 className="text-3xl font-bold font-sans text-slate-900 mb-1 flex items-baseline gap-1">
                   {formatMoney(metrics.totalInvestments)} 
                   <span className="text-sm text-slate-400 font-medium">UGX</span>
                 </h3>
                 <div className="inline-flex items-center text-emerald-600 text-xs font-bold">
                   <ArrowUpRight size={14} className="mr-1" /> Active Capital
                 </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wide">Daily Collections</span>
                <div className="p-2 rounded-lg bg-slate-50 text-blue-600">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div>
                 <h3 className="text-3xl font-bold font-sans text-slate-900 mb-1 flex items-baseline gap-1">
                   {formatMoney(metrics.dailyCollections)} 
                   <span className="text-sm text-slate-400 font-medium">UGX</span>
                 </h3>
                 <div className="inline-flex items-center text-blue-600 text-xs font-bold mt-1">
                   Platform Inflows Today
                 </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wide">Active Investors</span>
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                  <Users size={20} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                 <h3 className="text-3xl font-bold font-sans text-slate-900 leading-none">{metrics.totalInvestors}</h3>
                 <div className="text-xs font-bold text-slate-500 uppercase">Seeded Portfolios</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wide">Field Agents</span>
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                  <UserCheck size={20} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                 <h3 className="text-3xl font-bold font-sans text-slate-900 leading-none">{metrics.activeAgents}</h3>
                 <div className="text-xs font-bold text-slate-500 uppercase">Currently Active</div>
              </div>
            </div>

          </div>

          {/* Wallet Monitoring Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-xl font-bold text-slate-900 mb-1">Treasury Reserves</h3>
                 <p className="text-sm text-slate-500">Live operational wallet float and escrow bounds</p>
              </div>
              <button 
                onClick={() => navigate('/coo/wallets')} 
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-lg transition-colors"
              >
                Manage Wallets <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 relative">
                  <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-2">
                        <Wallet size={18} className="text-emerald-600" />
                        <span className="font-bold text-slate-700">Main Float</span>
                     </div>
                     <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">Operational</span>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4 font-sans">
                    UGX {formatMoney(metrics.walletMonitoring?.mainFloat)}
                  </h4>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
               </div>

               <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 relative">
                  <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-2">
                        <Wallet size={18} className="text-amber-600" />
                        <span className="font-bold text-slate-700">Agent Escrow</span>
                     </div>
                     <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md">Locked</span>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4 font-sans">
                    UGX {formatMoney(metrics.walletMonitoring?.agentEscrow)}
                  </h4>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '22%' }}></div>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT PANEL ── */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Critical Alerts (Replacing Pending Withdrawals large card) */}
          <div className="bg-white rounded-xl border-t-4 border-t-red-500 border-x border-b border-slate-200 shadow-sm p-6">
             <div className="flex items-center space-x-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                 <AlertTriangle size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900">Requires Approval</h3>
                  <p className="text-xs font-semibold text-red-500">{metrics.pendingWithdrawalsCount} pending requests</p>
               </div>
             </div>
             <p className="text-sm text-slate-600 mb-6 leading-relaxed">
               You have <strong className="text-slate-800">UGX {formatMoney(metrics.pendingWithdrawalsAmount)}</strong> in pending withdrawal payouts awaiting your authorization before disbursement.
             </p>
             <button 
                onClick={() => navigate('/coo/withdrawals')}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
             >
                Review Requests <ChevronRight size={16} />
             </button>
          </div>

          {/* System Check / Operations */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Activity size={18} className="text-slate-500"/> Pulse
               </h3>
               <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Live Stats</span>
            </div>
            <div className="p-0">
               
               <div className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/coo/users')}>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <UserCheck size={14} />
                     </div>
                     <span className="text-sm font-semibold text-slate-700">Pending KYC Profiles</span>
                  </div>
                  <span className="text-sm font-bold text-amber-600">{metrics.pendingAccounts}</span>
               </div>

               <div className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <ArrowDownRight size={14} />
                     </div>
                     <span className="text-sm font-semibold text-slate-700">Missed Tenant Payments</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">{metrics.missedPaymentsCount}</span>
               </div>

               <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-[var(--color-primary-faint,#f4f0ff)] flex items-center justify-center text-[var(--color-primary)]">
                        <Calendar size={14} />
                     </div>
                     <span className="text-sm font-semibold text-slate-700">Today's Visits</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--color-primary)]">{metrics.todaysVisits}</span>
               </div>

            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default COOOverview;
