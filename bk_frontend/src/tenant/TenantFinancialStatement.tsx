import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSpreadsheet, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const mockTransactions = [
  { id: 'TRX-9982', date: '2026-03-01', description: 'Monthly Rent Payment', type: 'debit', amount: 850000, status: 'completed' },
  { id: 'TRX-9975', date: '2026-02-05', description: 'Welile Homes Deposit', type: 'debit', amount: 50000, status: 'completed' },
  { id: 'TRX-9961', date: '2026-02-01', description: 'Monthly Rent Payment', type: 'debit', amount: 850000, status: 'completed' },
  { id: 'TRX-9940', date: '2026-01-15', description: 'Shopping Receipt Bonus', type: 'credit', amount: 5000, status: 'completed' },
  { id: 'TRX-9932', date: '2026-01-01', description: 'Monthly Rent Payment', type: 'debit', amount: 850000, status: 'completed' },
];

export default function TenantFinancialStatement() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('2026');

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("RentFlow Tenant Financial Statement", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Period: ${dateRange}`, 14, 34);

    const tableColumn = ["Date", "Transaction ID", "Description", "Type", "Amount (UGX)", "Status"];
    const tableRows = mockTransactions.map(t => [
      t.date, 
      t.id, 
      t.description,
      t.type.toUpperCase(),
      t.amount.toLocaleString(),
      t.status.toUpperCase()
    ]);

    (doc as any).autoTable({
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] }
    });

    doc.save(`Financial_Statement_${dateRange}.pdf`);
  };

  const handleDownloadCSV = () => {
    const ws = XLSX.utils.json_to_sheet(mockTransactions.map(t => ({
      ...t,
      amount: t.type === 'debit' ? -t.amount : t.amount
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statement");
    XLSX.writeFile(wb, `Financial_Statement_${dateRange}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-purple-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] pt-6 pb-24 px-6 md:px-12 relative rounded-b-[2.5rem] shadow-xl shadow-purple-600/20 dark:shadow-none overflow-hidden transition-colors duration-300">
         <div className="absolute -top-10 -right-10 p-8 opacity-10">
            <FileSpreadsheet size={220} />
         </div>

         <div className="flex items-center gap-6 relative z-10">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-white tracking-wide">Financial Statement</h1>
         </div>

         <div className="relative z-10 mt-8">
            <h2 className="text-[32px] font-black text-white leading-[1.1] tracking-tight">Your RentFlow<br/>Ledger.</h2>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 -mt-14 relative z-10 flex flex-col gap-5">
         
         {/* Summary Cards Grid */}
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
               <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Total Paid (YTD)</p>
               <h3 className="text-2xl font-black text-slate-800 dark:text-white transition-colors">UGX 2.6M</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
               <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Current Balance</p>
               <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 transition-colors">UGX 0</h3>
            </div>
         </div>

         {/* Transactions Container */}
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700 mt-2 mb-8 transition-colors duration-300">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
               <div className="flex items-center gap-2">
                 <div className="bg-indigo-50 dark:bg-indigo-500/20 p-1.5 rounded-lg transition-colors">
                    <Calendar size={18} className="text-indigo-500 dark:text-indigo-400" />
                 </div>
                 <select 
                   value={dateRange}
                   onChange={e => setDateRange(e.target.value)}
                   className="bg-transparent text-[15px] font-bold text-slate-800 dark:text-white dark:bg-slate-800 focus:outline-none cursor-pointer transition-colors"
                 >
                    <option value="2026">Year 2026</option>
                    <option value="2025">Year 2025</option>
                    <option value="all">All Time</option>
                 </select>
               </div>
               
               <div className="flex items-center gap-2">
                 <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                   <Printer size={14}/> PDF
                 </button>
                 <button onClick={handleDownloadCSV} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                   <Download size={14}/> Excel
                 </button>
                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                   <Filter size={14}/> Filter
                 </button>
               </div>
            </div>
            
            {/* List */}
            <div className="space-y-4">
               {mockTransactions.map(trx => (
                 <div key={trx.id} className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${trx.type === 'credit' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                          {trx.type === 'credit' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                       </div>
                       <div>
                          <p className="text-[14px] font-bold text-slate-800 dark:text-white leading-tight transition-colors">{trx.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 transition-colors">{trx.date}</span>
                             <span className="text-[10px] text-slate-300 dark:text-slate-600 transition-colors">•</span>
                             <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 transition-colors">{trx.id}</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-[13.5px] font-black transition-colors ${trx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                         {trx.type === 'credit' ? '+' : '-'} UGX {trx.amount.toLocaleString()}
                       </p>
                       <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 transition-colors">{trx.status}</p>
                    </div>
                 </div>
               ))}
               
               {mockTransactions.length === 0 && (
                 <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm font-medium transition-colors">No transactions found for this period.</div>
               )}
            </div>
         </div>

      </div>
    </div>
  );
}
