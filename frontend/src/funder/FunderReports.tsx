import { useState } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Download, FileText, ChevronDown, CheckCircle, TrendingUp } from 'lucide-react';
import FunderSidebar from './components/FunderSidebar';
import FunderDashboardHeader from './components/FunderDashboardHeader';
import FunderBottomNav from './components/FunderBottomNav';

// Mock Data for Charts
const yieldData = [
  { month: 'Jan', yield: 45000 },
  { month: 'Feb', yield: 52000 },
  { month: 'Mar', yield: 48000 },
  { month: 'Apr', yield: 61000 },
  { month: 'May', yield: 59000 },
  { month: 'Jun', yield: 75000 },
  { month: 'Jul', yield: 82000 },
  { month: 'Aug', yield: 86000 },
  { month: 'Sep', yield: 91000 },
  { month: 'Oct', yield: 94000 },
  { month: 'Nov', yield: 89000 },
  { month: 'Dec', yield: 105000 },
];

const allocationData = [
  { name: 'Commercial', value: 45 },
  { name: 'Residential', value: 35 },
  { name: 'Mixed-Use', value: 20 },
];

const COLORS = ['#9234EA', '#3b82f6', '#10b981'];

export default function FunderReports() {
  const [statementRange, setStatementRange] = useState('Last 6 Months');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStatement = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would trigger a file download
      alert(`Statement for ${statementRange} generated successfully!`);
    }, 1500);
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
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cumulative Yield Growth</h3>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-slate-900">UGX 887,000</p>
                      <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +14.2% YTD
                      </span>
                    </div>
                  </div>
                  <select className="bg-slate-50 border-none text-xs font-bold text-slate-600 rounded-lg px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]">
                    <option>2025</option>
                    <option>2024</option>
                    <option>All Time</option>
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
                          formatter={(value: any) => [`${value}%`, 'Allocation']}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-2xl font-black text-slate-900">100%</p>
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

                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={handleGenerateStatement}
                      disabled={isGenerating}
                      className="flex-1 bg-slate-900 hover:bg-black text-white px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {isGenerating ? 'GENERATING...' : 'EXPORT CSV'}
                    </button>
                    <button 
                      onClick={handleGenerateStatement}
                      disabled={isGenerating}
                      className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                <div className="flex-1 space-y-3">
                  {[
                    { title: 'Annual Tax Summary 2024', date: 'Jan 15, 2025', size: '1.2 MB PDF' },
                    { title: 'Certificate of Funding - Entebbe', date: 'Dec 02, 2024', size: '840 KB PDF' },
                    { title: 'Investment Agreement (Signed)', date: 'Nov 18, 2024', size: '2.4 MB PDF' }
                  ].map((doc, i) => (
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
