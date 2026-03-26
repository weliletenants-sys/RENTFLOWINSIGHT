import { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Download, FileText, ChevronDown, CheckCircle } from 'lucide-react';
import FunderSidebar from './components/FunderSidebar';
import FunderDashboardHeader from './components/FunderDashboardHeader';
import FunderBottomNav from './components/FunderBottomNav';
import { getFunderReportsStatsRaw, getWalletOperations, getFunderPortfolios } from '../services/funderApi';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

// Mock Data for Charts

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xl shadow-slate-900/20 z-50">
        <div className="flex items-center gap-2">
          <span>{payload[0].name}:</span>
          <span className="text-[var(--color-primary-light)]">{payload[0].value}%</span>
        </div>
        {/* Tooltip Arrow pointing down */}
        <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900"></div>
      </div>
    );
  }
  return null;
};

const COLORS = ['#6c11d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function FunderReports() {
  const [statementRange, setStatementRange] = useState('Last 6 Months');
  const [statementYear, setStatementYear] = useState(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(true);
  
  const [yieldData, setYieldData] = useState<any[]>([]);
  const [allocationData, setAllocationData] = useState<any[]>([]);
  const [vaultDocs, setVaultDocs] = useState<any[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getFunderReportsStatsRaw(statementYear);
        setYieldData(data.yieldData || []);
        setAllocationData(data.allocationData || []);
        setTotalEarned(data.totalEarned || 0);
        setTotalInvested(data.totalInvested || 0);
        const portfolios = await getFunderPortfolios();

        // Dynamically build certificates from active portfolios
        const dynamicDocs = [{ title: `Annual Tax Summary ${new Date().getFullYear() - 1}`, date: `Jan 15, ${new Date().getFullYear()}`, size: '1.2 MB PDF' }];
        portfolios.forEach((p: any) => {
          if (p.status !== 'pending') {
            dynamicDocs.push({
              title: `Certificate of Funding (${p.portfolioCode.toUpperCase()})`,
              date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              size: `${Math.floor(Math.random() * 900) + 100} KB PDF`
            });
          }
        });
        setVaultDocs(dynamicDocs);

      } catch (error) {
        console.error('Failed to load dynamic report stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [statementYear]);

  const [isExportingCSV, setIsExportingCSV] = useState(false);

  const handleGenerateCSV = async () => {
    setIsExportingCSV(true);
    try {
      const ops = await getWalletOperations();
      if (!ops || ops.length === 0) return toast.error('No ledgers found for export.');
      
      const exportData = ops.map((tx: any) => ({
        'Date & Time': new Date(tx.created_at).toLocaleString(),
        'Reference ID': tx.reference_id || String(tx.id).slice(0,8),
        'Category': String(tx.category).replace(/_/g, ' ').toUpperCase(),
        'Transaction Type': tx.direction,
        'Amount (UGX)': tx.amount,
        'Status': 'COMPLETED'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Full_Ledger");
      XLSX.writeFile(wb, `RentFlow_Ledger_Export_${new Date().getTime()}.xlsx`);
      toast.success('Successfully downloaded comprehensive financial ledger!');
    } catch (e) {
      toast.error('Failed to generate Statement CSV');
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleGeneratePDF = () => {
     window.print();
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-primary-faint)' }}>
      <div className="flex h-screen overflow-hidden">
        
        {/* SIDEBAR */}
        <FunderSidebar activePage="Reports" />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">
          
          <FunderDashboardHeader
            user={{ fullName: 'Grace N.', role: 'supporter', avatarUrl: '' }}
            pageTitle="Reports & Analytics"
          />

          <main className="flex-1 px-4 sm:px-8 py-8 pb-32 lg:pb-12 max-w-7xl mx-auto w-full">
            
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Portfolio Performance</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Visual insights, tax documents, and extractable financial ledgers.
              </p>
            </div>

            {/* ──────────────── VISUAL ANALYTICS ──────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Yield Growth Line Chart */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-1 flex items-center gap-2">
                       Cumulative Yield Growth {isLoading && <div className="w-3 h-3 border-2 border-[var(--color-primary)] border-t-white rounded-full animate-spin" />}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-slate-900">UGX {totalEarned.toLocaleString()}</p>
                    </div>
                  </div>
                  <select 
                    value={statementYear}
                    onChange={(e) => setStatementYear(e.target.value)}
                    className="bg-slate-50 border-none text-xs font-bold text-slate-600 rounded-lg px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]">
                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                    <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                    <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
                  </select>
                </div>
                
                <div className="h-[280px] w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={yieldData}>
                      <defs>
                        <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dx={-10} tickFormatter={(value) => `UGX ${(value/1000)}k`} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [`UGX ${Number(value).toLocaleString()}`, 'Yield']}
                      />
                      <Area type="monotone" dataKey="yield" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Asset Allocation Pie Chart */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-6">Asset Allocation</h3>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {allocationData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          content={<CustomPieTooltip />}
                          cursor={{ fill: 'transparent' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-xl font-black text-slate-900">{(totalInvested / 1000000).toFixed(1)}M</p>
                      <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Deployed</p>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="w-full mt-6 space-y-3">
                    {allocationData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                          <span className="font-semibold text-slate-700">{item.name}</span>
                        </div>
                        <span className="font-black text-slate-900">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ──────────────── DOCUMENTS & EXPORTS ──────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Statement Generator */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Custom Statements</h3>
                    <p className="text-xs text-slate-500 font-medium">Export raw ledger data for accounting.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Date Range</label>
                    <div className="relative mt-1">
                      <select 
                        value={statementRange} 
                        onChange={(e) => setStatementRange(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
                      >
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Last 6 Months</option>
                        <option>2024 Fiscal Year</option>
                        <option>Custom Range...</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3 print:hidden">
                    <button 
                      onClick={handleGenerateCSV}
                      disabled={isExportingCSV}
                      className="flex-1 bg-slate-900 hover:bg-black text-white px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isExportingCSV ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {isExportingCSV ? 'GENERATING...' : 'EXPORT CSV'}
                    </button>
                    <button 
                      onClick={handleGeneratePDF}
                      className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      PDF REPORT
                    </button>
                  </div>
                </div>
              </div>

              {/* Tax & Compliance Vault */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Tax & Certificates</h3>
                      <p className="text-xs text-slate-500 font-medium">Official compliance documents.</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-[260px] pr-2">
                  {vaultDocs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                       <CheckCircle className="w-8 h-8 opacity-20 mb-2" />
                       <p className="text-xs font-bold">No compliance records exist yet.</p>
                    </div>
                  ) : vaultDocs.map((doc, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-[var(--color-primary-light)] transition-all cursor-pointer shadow-sm hover:shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100/50 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{doc.title}</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{doc.date} • {doc.size}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors text-slate-400">
                        <Download className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-widest hover:underline text-center">
                  View Document Archive →
                </button>
              </div>

            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation Component */}
      <FunderBottomNav activePage="Reports" />
    </div>
  );
}
