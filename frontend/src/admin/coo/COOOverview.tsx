import React, { useEffect, useState } from 'react';
import { Users, Briefcase, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, UserCheck, Wallet, PieChart, Activity, Loader2 } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Aggregating platform operations...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Dashboard</h3>
          <p className="text-sm">{error || 'Unknown rendering error'}</p>
        </div>
      </div>
    );
  }

  // Formatting helpers
  const formatMoney = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return '0';
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-inter">
      
      {/* 1. Financial Metrics Cards (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-sm font-bold">Total Investors</span>
            <div className="p-2 bg-[#EAE5FF] text-[#6c11d4] rounded-full">
              <Users size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{metrics.totalInvestors}</h3>
          <div className="inline-flex items-center text-green-600 text-xs font-bold">
            <ArrowUpRight size={14} className="mr-1" /> Active
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-sm font-bold">Total Investments</span>
            <div className="p-2 bg-[#EAE5FF] text-[#6c11d4] rounded-full">
              <Briefcase size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{formatMoney(metrics.totalInvestments)} <span className="text-sm text-slate-400 font-medium">UGX</span></h3>
          <div className="inline-flex items-center text-green-600 text-xs font-bold">
            <ArrowUpRight size={14} className="mr-1" /> Seeded Portfolios
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-sm font-bold">Daily Collections</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-full">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{formatMoney(metrics.dailyCollections)} <span className="text-sm text-slate-400 font-medium">UGX</span></h3>
          <div className="inline-flex items-center text-slate-500 text-xs font-bold">
            Platform Inflows
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-3xl border-2 border-red-100 shadow-sm relative overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors flex flex-col justify-between"
          onClick={() => navigate('/coo/withdrawals')}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-slate-600 text-sm font-bold">Pending Withdrawals</span>
            <div className="p-2 bg-red-100 text-red-600 rounded-full">
              <AlertTriangle size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-outfit text-red-600 mb-2 relative z-10">{formatMoney(metrics.pendingWithdrawalsAmount)} <span className="text-sm opacity-70 font-medium">UGX</span></h3>
          <div className="inline-flex items-center text-red-500 text-xs font-bold relative z-10">
            Requires Action ({metrics.pendingWithdrawalsCount} requests)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3. Agent Collections Context */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Operational Overview</h3>
              <button onClick={() => navigate('/coo/collections')} className="text-xs font-bold text-[#6c11d4] bg-[#EAE5FF] px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors">
                 Full Matrix
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl flex flex-col justify-center">
                <p className="text-sm text-slate-500 font-bold mb-1">Active Agents</p>
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-[#EAE5FF] flex items-center justify-center text-[#6c11d4]">
                     <UserCheck size={16} />
                   </div>
                   <p className="text-2xl font-bold text-slate-900">{metrics.activeAgents}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl flex flex-col justify-center">
                <p className="text-sm text-slate-500 font-bold mb-1">Total Users</p>
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-[#EAE5FF] flex items-center justify-center text-[#6c11d4]">
                     <Users size={16} />
                   </div>
                   <p className="text-2xl font-bold text-slate-900">{metrics.activeAccounts}</p>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-2xl flex flex-col justify-center">
                <p className="text-sm text-orange-700 font-bold mb-1">Missed Records</p>
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                     <ArrowDownRight size={16} />
                   </div>
                   <p className="text-xl font-bold text-orange-600">{metrics.missedPaymentsCount} <span className="text-sm font-medium">Tenants</span></p>
                </div>
              </div>
              <div className="p-4 bg-[#EAE5FF] rounded-2xl flex flex-col justify-center">
                <p className="text-sm text-[#6c11d4] font-bold mb-1">Today's Visits</p>
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#6c11d4]">
                     <Activity size={16} />
                   </div>
                   <p className="text-xl font-bold text-[#6c11d4]">{metrics.todaysVisits}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 & 5. Wallet Monitoring & Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/coo/wallets')}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#EAE5FF] text-[#6c11d4] rounded-full"><Wallet size={20} /></div>
                <h3 className="text-lg font-bold text-slate-800">Wallet Monitoring</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-bold text-slate-600">Main Operating Float</span>
                    <span className="font-bold text-green-600 px-2 py-0.5 bg-green-50 rounded-md">{formatMoney(metrics.walletMonitoring.mainFloat)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-bold text-slate-600">Agent Float Escrow</span>
                    <span className="font-bold text-orange-500 px-2 py-0.5 bg-orange-50 rounded-md">{formatMoney(metrics.walletMonitoring.agentEscrow)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/coo/analytics')}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#EAE5FF] text-[#6c11d4] rounded-full"><PieChart size={20} /></div>
                <h3 className="text-lg font-bold text-slate-800">Payment Modes</h3>
              </div>
              <div className="space-y-4">
                {/* Visual UI Demo pending backend tracking vectors */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                     <span className="w-3 h-3 rounded-full bg-[#6c11d4]"></span>
                     <span className="font-bold text-slate-600">Mobile Money</span>
                  </div>
                  <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">65%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                     <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                     <span className="font-bold text-slate-600">Bank Transfer</span>
                  </div>
                  <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">28%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                     <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                     <span className="font-bold text-slate-600">Cash (Agency)</span>
                  </div>
                  <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">7%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 7. Risk & Alerts (Right Column) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Risk & Alerts</h3>
            <button onClick={() => navigate('/coo/alerts')} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
               View Feed
            </button>
          </div>
          
          <div className="space-y-4 flex-1">
            <div 
              className="p-4 bg-white border border-red-100 rounded-2xl shadow-sm cursor-pointer hover:border-red-300 transition-all relative overflow-hidden"
              onClick={() => navigate('/coo/withdrawals')}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Pending Withdrawals</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{metrics.pendingWithdrawalsCount} requests totaling <strong className="text-slate-700">UGX {formatMoney(metrics.pendingWithdrawalsAmount)}</strong> waiting for COO approval before disbursement.</p>
            </div>
            
            <div className="p-4 bg-white border border-orange-100 rounded-2xl shadow-sm cursor-pointer hover:border-orange-300 transition-all relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400"></div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Delinquent Payments</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{metrics.missedPaymentsCount} tenants have unfulfilled structural profiles.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default COOOverview;
