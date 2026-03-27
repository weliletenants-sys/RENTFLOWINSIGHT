import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, Home, Briefcase, Building2, Handshake, 
  Wallet, CheckCircle2, UserCheck, Search, Bell, 
  Settings, Calendar, Download, MoreVertical, 
  ArrowUpRight, ArrowDownRight, PieChart, Activity,
  TrendingUp, HelpCircle
} from 'lucide-react';

export default function CeoDashboard() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const location = useLocation();

  const [kpis, setKpis] = useState<any>(null);
  const [growth, setGrowth] = useState<any>(null);
  const [table, setTable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [kpiRes, growthRes, tableRes] = await Promise.all([
          axios.get('/api/v1/executive/ceo/kpis'),
          axios.get('/api/v1/executive/ceo/growth-metrics'),
          axios.get('/api/v1/executive/ceo/rent-requests')
        ]);
        setKpis(kpiRes.data);
        setGrowth(growthRes.data);
        setTable(tableRes.data || []);
      } catch (err) {
        console.error('Failed to fetch CEO telemetry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <>
        <header className="mb-8 flex justify-between items-end">
          <div>
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] font-inter">Global Overview</span>
            <h2 className="text-4xl font-bold tracking-tight mt-2 text-slate-900 font-outfit">Executive Terminal</h2>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2.5 flex items-center gap-2 rounded-full text-xs font-bold text-slate-600 border border-[var(--color-primary-light)] shadow-sm">
              <Calendar size={16} className="text-slate-400" />
              Live Telemetry
            </div>
            <button className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-2.5 text-xs font-bold rounded-full hover:bg-[var(--color-primary-dark)] shadow-sm transition-all flex items-center gap-2 cursor-pointer">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </header>

        {loading ? (
           <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div></div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-sm font-bold">Total Users</span>
                  <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full">
                    <Users size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{kpis?.totalUsers?.toLocaleString() || '12'}</h3>
                  <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                    <ArrowUpRight size={14} className="mr-1" /> Live Map
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-sm font-bold">Tenants Funded</span>
                  <div className="p-2 bg-[#e0f2fe] text-[#0284c7] rounded-full">
                    <Home size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{kpis?.tenantsFunded?.toLocaleString() || '0'}</h3>
                  <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                    <ArrowUpRight size={14} className="mr-1" /> Supported
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-sm font-bold">Rent Financed</span>
                  <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full">
                    <Briefcase size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2"><span className="text-xl text-slate-400 mr-1">UGX</span>{(kpis?.rentFinanced || 0).toLocaleString()}</h3>
                  <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                    <ArrowUpRight size={14} className="mr-1" /> Aggregate
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-sm font-bold">Total Landlords</span>
                  <div className="p-2 bg-[#ffedd5] text-[#c2410c] rounded-full">
                    <Building2 size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{kpis?.totalLandlords?.toLocaleString() || '0'}</h3>
                  <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                    <ArrowUpRight size={14} className="mr-1" /> Verified Properties
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-sm font-bold">Partners/Investors</span>
                  <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full">
                    <Handshake size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{kpis?.partnersInvestors?.toLocaleString() || '0'}</h3>
                  <div className="inline-flex items-center text-slate-600 text-xs font-bold bg-slate-100 px-2 py-1 rounded-md">
                    Active Capital
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-sm font-bold">Platform Revenue</span>
                  <div className="p-2 bg-green-50 text-[var(--color-success)] rounded-full">
                    <Wallet size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2"><span className="text-xl text-slate-400 mr-1">UGX</span>{(kpis?.platformRevenue || 0).toLocaleString()}</h3>
                  <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                    <ArrowUpRight size={14} className="mr-1" /> Recognized
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-sm font-bold">Rent Repaid</span>
                  <div className="p-2 bg-[#dcfce7] text-[var(--color-success)] rounded-full">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{kpis?.rentRepaidPercentage?.toFixed(1) || '0.0'}%</h3>
                  <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                    <ArrowUpRight size={14} className="mr-1" /> Success Goal
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-sm font-bold">Active Agents</span>
                  <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full">
                    <UserCheck size={18} />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">{kpis?.activeAgents?.toLocaleString() || '0'}</h3>
                  <div className="inline-flex items-center text-[var(--color-success)] text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                    <ArrowUpRight size={14} className="mr-1" /> Field Map
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <section className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm lg:col-span-1 flex flex-col">
                <h3 className="text-lg font-bold text-[var(--color-primary-darker)] mb-8 font-outfit">Growth Metrics</h3>
                <div className="space-y-8 flex-1">
                  <div className="flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-1">Active Users</p>
                      <p className="text-2xl font-bold font-outfit text-slate-900">{growth?.activeUsers?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-1">New Users today</p>
                      <p className="text-2xl font-bold font-outfit text-slate-900">{growth?.newUsers?.toLocaleString() || '0'}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-1">Retention</p>
                      <p className="text-2xl font-bold font-outfit text-slate-900">{growth?.retentionRate || 0}%</p>
                    </div>
                    <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden self-center">
                      <div className="bg-[var(--color-success)] h-full rounded-full" style={{ width: `${growth?.retentionRate || 0}%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-1">Daily Trans.</p>
                      <p className="text-xl font-bold font-outfit text-slate-900">{(growth?.dailyTransactions || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-bold text-[var(--color-primary)] mb-2">Tenant Growth</p>
                    <h4 className="text-3xl font-bold font-outfit text-slate-900">+18.5%</h4>
                  </div>
                  <div className="h-40 mt-8 flex items-end gap-2">
                    <div className="bg-[var(--color-primary-light)] w-full h-[30%] rounded-md hover:bg-[var(--color-primary)] transition-colors"></div>
                    <div className="bg-[var(--color-primary-light)] w-full h-[45%] rounded-md hover:bg-[var(--color-primary)] transition-colors"></div>
                    <div className="bg-[var(--color-primary-light)] w-full h-[40%] rounded-md hover:bg-[var(--color-primary)] transition-colors"></div>
                    <div className="bg-[var(--color-primary-light)] w-full h-[60%] rounded-md hover:bg-[var(--color-primary)] transition-colors"></div>
                    <div className="bg-[var(--color-primary-light)] w-full h-[80%] rounded-md hover:bg-[var(--color-primary)] transition-colors"></div>
                    <div className="bg-[var(--color-primary)] w-full h-[95%] rounded-md shadow-md"></div>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-bold text-[var(--color-primary)] mb-2">Rent Repayment</p>
                    <h4 className="text-3xl font-bold font-outfit text-slate-900">{kpis?.rentRepaidPercentage?.toFixed(1) || '0.0'}%</h4>
                  </div>
                  <div className="h-40 flex flex-col justify-end gap-6 mt-6">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                        <span>Target</span>
                        <span className="text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-md">99%</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--color-primary-faint)] rounded-full overflow-hidden border border-[var(--color-primary-light)]">
                        <div className="bg-[var(--color-primary)] h-full w-[99%] rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                        <span>Actual Metric</span>
                        <span className="text-[var(--color-success)] bg-green-50 px-2 py-0.5 rounded-md">{kpis?.rentRepaidPercentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--color-primary-faint)] rounded-full overflow-hidden border border-[var(--color-primary-light)]">
                        <div className="bg-[var(--color-success)] h-full rounded-full" style={{ width: `${kpis?.rentRepaidPercentage || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="bg-white border border-[var(--color-primary-light)] rounded-3xl shadow-sm overflow-hidden mb-12">
              <div className="px-8 py-6 flex justify-between items-center border-b border-[var(--color-primary-light)]">
                <h3 className="text-lg font-bold text-[var(--color-primary-darker)] font-outfit">Live Funding Requests</h3>
                <div className="flex gap-2 p-1 bg-[var(--color-primary-faint)] rounded-xl border border-[var(--color-primary-light)]">
                  <button className="px-4 py-1.5 text-xs font-bold text-[var(--color-primary-darker)] bg-white shadow-sm rounded-lg">All</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-primary-faint)] border-b border-[var(--color-primary-light)]">
                      <th className="px-8 py-4 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest whitespace-nowrap">Request Date</th>
                      <th className="px-8 py-4 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest whitespace-nowrap">Tenant</th>
                      <th className="px-8 py-4 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest whitespace-nowrap">Status</th>
                      <th className="px-8 py-4 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest text-right whitespace-nowrap">Amount</th>
                      <th className="px-8 py-4 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest text-right whitespace-nowrap">Repaid</th>
                      <th className="px-8 py-4 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest text-right whitespace-nowrap">Balance</th>
                      <th className="px-8 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-primary-light)]">
                    {table.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-6 text-slate-500">No active requests in DB</td></tr>
                    ) : (
                      table.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-[var(--color-primary-faint)] transition-colors">
                          <td className="px-8 py-5 text-sm font-medium text-slate-600">{new Date(row.created_at).toLocaleDateString()}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-slate-900">{row.tenant_name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary-darker)] text-xs font-bold capitalize">{row.status}</span>
                          </td>
                          <td className="px-8 py-5 text-right text-sm font-bold text-slate-900">{(row.amount || 0).toLocaleString()}</td>
                          <td className="px-8 py-5 text-right text-sm font-medium text-[var(--color-primary)]">{(row.amount_repaid || 0).toLocaleString()}</td>
                          <td className="px-8 py-5 text-right text-sm font-bold text-slate-900">{(row.remaining_balance || 0).toLocaleString()}</td>
                          <td className="px-8 py-5 text-right">
                            <button className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full transition-all">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
    </>
  );
}
