import { useState, useEffect } from 'react';
import {
  BarChart3, FileText, ShieldAlert, Scale, BookOpen,
  Coins, ArrowDownToLine, Bell, Calendar, Search,
  Download, CheckCircle2, AlertTriangle, Home, User
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

type TabType = 'overview' | 'statements' | 'solvency' | 'reconciliation' | 'ledger' | 'commissions' | 'withdrawals';

export default function CfoDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [dateFilter, setDateFilter] = useState('30d');

  // Data States
  const [overviewMetrics, setOverviewMetrics] = useState<any>(null);
  const [reconciliation, setReconciliation] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  const fetchOverview = async () => {
    try {
      const { data } = await axios.get('/api/cfo/overview');
      setOverviewMetrics(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReconciliation = async () => {
    try {
      const { data } = await axios.get('/api/cfo/reconciliation');
      setReconciliation(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const { data } = await axios.get('/api/cfo/approvals/withdrawals');
      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchOverview();
    if (activeTab === 'reconciliation') fetchReconciliation();
    if (activeTab === 'withdrawals') fetchWithdrawals();
  }, [activeTab]);

  const handleApprove = async (id: string) => {
    try {
      await axios.post(`/api/cfo/approvals/withdrawals/${id}/approve`);
      toast.success('Approved successfully');
      fetchWithdrawals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason:');
    if (!reason) {
      toast.error('Rejection reason is required');
      return;
    }
    try {
      await axios.post(`/api/cfo/approvals/withdrawals/${id}/reject`, { reason });
      toast.success('Rejected with reason');
      fetchWithdrawals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'statements', label: 'Financial Statements', icon: FileText },
    { id: 'solvency', label: 'Solvency & Buffer', icon: ShieldAlert },
    { id: 'reconciliation', label: 'Reconciliation', icon: Scale },
    { id: 'ledger', label: 'General Ledger', icon: BookOpen },
    { id: 'commissions', label: 'Commission Payouts', icon: Coins },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowDownToLine },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f8f6f6] text-slate-900 font-['Public_Sans'] overflow-hidden">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#6c11d4] rounded-lg flex items-center justify-center font-black text-white">W</div>
          <span className="font-black text-lg tracking-tight">CFO Console</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive
                    ? 'bg-[#6c11d4]/10 text-[#6c11d4]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon size={18} className={isActive ? 'text-[#6c11d4]' : 'text-slate-400'} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 capitalize">
            {activeTab.replace('_', ' ')}
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              {['Today', '7d', '30d', 'Month', 'Year'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setDateFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${dateFilter === filter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {filter}
                </button>
              ))}
              <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 flex flex-row items-center gap-1 border-l border-slate-200 ml-1 pl-3">
                <Calendar size={14} /> Custom
              </button>
            </div>

            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <button className="text-slate-400 hover:text-[#6c11d4] transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {user?.firstName?.charAt(0) || 'C'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-slate-900 leading-tight">{user?.firstName || 'Chief'} {user?.lastName || 'Financial Officer'}</p>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">Executive</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto pb-12">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && overviewMetrics && (
              <div className="space-y-8">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Wallet Balances', value: `UGX ${(overviewMetrics.metrics.totalWalletBalance / 1000000).toFixed(1)}M`, color: 'bg-indigo-50 text-indigo-700' },
                    { label: 'Total Deposits', value: `UGX ${(overviewMetrics.metrics.deposits / 1000000).toFixed(1)}M`, color: 'bg-green-50 text-green-700' },
                    { label: 'Total Withdrawals', value: `UGX ${(overviewMetrics.metrics.withdrawals / 1000000).toFixed(1)}M`, color: 'bg-orange-50 text-orange-700' },
                    { label: 'Platform Fees', value: `UGX ${(overviewMetrics.metrics.platformFees / 1000).toFixed(1)}K`, color: 'bg-purple-50 text-purple-700' },
                    { label: 'Pending Repayments', value: `UGX ${(overviewMetrics.metrics.pendingRepayments / 1000000).toFixed(1)}M`, color: 'bg-rose-50 text-rose-700' },
                    { label: 'Transfers', value: 'UGX 8.2M', color: 'bg-blue-50 text-blue-700' }, // mock
                    { label: 'Agent Earnings', value: 'UGX 1.4M', color: 'bg-slate-50 text-slate-700' }, // mock
                    { label: 'Commissions', value: 'UGX 450K', color: 'bg-amber-50 text-amber-700' } // mock
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 hover:shadow-md transition-shadow">
                      <p className="text-sm font-bold text-slate-500 tracking-tight mb-2">{stat.label}</p>
                      <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', val: overviewMetrics.counts.totalUsers, icon: User },
                    { label: 'Agents', val: overviewMetrics.counts.totalAgents, icon: ShieldAlert },
                    { label: 'Tenants', val: overviewMetrics.counts.totalTenants, icon: Home },
                    { label: 'Supporters', val: overviewMetrics.counts.totalSupporters, icon: Download }
                  ].map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">{c.label}</p>
                          <p className="text-xl font-black text-slate-900">{c.val}</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                          <Icon size={18} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Charts Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-96 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Financial Trends</h3>
                    <button className="text-xs font-bold text-[#6c11d4] bg-[#6c11d4]/10 px-3 py-1.5 rounded-lg">Export CSV</button>
                  </div>
                  <div className="flex-1 border-t border-l border-slate-100 relative w-full flex items-end justify-between px-4 pb-4">
                    {/* Very simplistic mock chart render using css bars */}
                    {overviewMetrics.trends.map((t: any, i: number) => (
                      <div key={i} className="flex flex-col items-center gap-2 group w-1/4">
                        <div className="relative w-8 bg-indigo-100 rounded-t-sm" style={{ height: `${t.inflow / 1000}px` }}>
                          <div className="absolute bottom-0 w-full bg-[#6c11d4] rounded-t-sm" style={{ height: `${t.outflow / 1000}px` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{t.date}</span>
                      </div>
                    ))}
                    <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-slate-200"></div>
                  </div>
                </div>
              </div>
            )}

            {/* RECONCILIATION TAB */}
            {activeTab === 'reconciliation' && reconciliation && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm font-bold text-slate-500">Total Users Processed</p>
                    <h3 className="text-3xl font-black text-slate-800">{reconciliation.summary.totalUsers}</h3>
                  </div>
                  <div className="bg-green-50 border border-green-100 p-5 rounded-2xl">
                    <p className="text-sm font-bold text-green-700">Matched</p>
                    <h3 className="text-3xl font-black text-green-700">{reconciliation.summary.matched}</h3>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
                    <p className="text-sm font-bold text-red-700">Mismatched</p>
                    <h3 className="text-3xl font-black text-red-700">{reconciliation.summary.mismatched}</h3>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm font-bold text-slate-500">Total Gap Risk</p>
                    <h3 className="text-3xl font-black text-[#6c11d4]">UGX {reconciliation.summary.totalGap.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="Search users or phones" className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#6c11d4] bg-white w-64" />
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <Download size={16} /> Export
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Phone</th>
                          <th className="px-6 py-4 text-right">Wallet Balance</th>
                          <th className="px-6 py-4 text-right">Ledger Balance</th>
                          <th className="px-6 py-4 text-right">Gap Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {reconciliation.results.map((r: any, idx: number) => {
                          const isMatched = r.status === 'Matched';
                          return (
                            <tr key={idx} className={`hover:bg-slate-50 transition-colors ${!isMatched ? 'bg-red-50/30' : ''}`}>
                              <td className="px-6 py-4 font-bold text-slate-900">{r.name}</td>
                              <td className="px-6 py-4 text-slate-500">{r.phone}</td>
                              <td className="px-6 py-4 text-right font-medium">UGX {r.wallet_balance.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right font-medium">UGX {r.ledger_balance.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right">
                                {isMatched ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700">
                                    <CheckCircle2 size={14} /> Matched
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                    <AlertTriangle size={14} /> Gap: {r.gap}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* WITHDRAWALS TAB */}
            {activeTab === 'withdrawals' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">CFO Approval Gate</h3>
                  <div className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <ShieldAlert size={14} /> Filtering: Manager Approved
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {withdrawals.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 font-bold bg-white border border-dashed border-slate-200 rounded-2xl">
                      No pending withdrawals requiring CFO approval.
                    </div>
                  ) : withdrawals.map(w => (
                    <div key={w.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                            {w.user_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{w.user_name}</p>
                            <p className="text-xs text-slate-500">{w.user_phone}</p>
                          </div>
                        </div>
                        {w.provider === 'MTN' ? (
                          <span className="text-[10px] font-black uppercase px-2 py-1 bg-yellow-100 text-yellow-800 rounded">MTN</span>
                        ) : (
                          <span className="text-[10px] font-black uppercase px-2 py-1 bg-red-100 text-red-800 rounded">Airtel</span>
                        )}
                      </div>

                      <div className="my-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Requested Amount</p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">UGX {w.amount.toLocaleString()}</h2>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl mb-6 text-xs text-slate-600 font-medium">
                        <p className="flex justify-between mb-1"><span className="text-slate-400">Mobile Money:</span> <strong className="text-slate-800">{w.recipient_number || w.user_phone}</strong></p>
                        <p className="flex justify-between"><span className="text-slate-400">Time:</span> <span>Manager approved X ago</span></p>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3">
                        <button onClick={() => handleReject(w.id)} className="py-2.5 font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-red-600 rounded-xl transition-colors">
                          Reject
                        </button>
                        <button onClick={() => handleApprove(w.id)} className="py-2.5 font-bold text-white bg-[#6c11d4] hover:bg-[#5b21b6] shadow-lg shadow-[#6c11d4]/20 rounded-xl transition-all flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} /> Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PLACEHOLDERS FOR REMAINING TABS */}
            {['statements', 'solvency', 'ledger', 'commissions'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <ShieldAlert size={48} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2 capitalize">{activeTab.replace('_', ' ')} Tab</h3>
                <p className="text-slate-500 text-sm max-w-sm text-center">This module is part of Phase 2 logic architecture and will feature deep integrations soon.</p>
              </div>
            )}

          </div>
        </div>
      </main>

    </div>
  );
}
