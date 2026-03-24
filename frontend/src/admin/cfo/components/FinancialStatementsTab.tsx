// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Download, File as FileIcon } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper component for large numbers
const CompactCurrency = ({ value }: { value: number }) => {
  if (value >= 1000000) {
    return (
      <span title={`UGX ${value.toLocaleString()}`} className="cursor-help font-outfit">
        UGX {(value / 1000000).toFixed(1)}<span className="text-slate-400">M</span>
      </span>
    );
  } else if (value >= 1000) {
    return (
      <span title={`UGX ${value.toLocaleString()}`} className="cursor-help font-outfit">
        UGX {(value / 1000).toFixed(1)}<span className="text-slate-400">K</span>
      </span>
    );
  }
  return <span className="font-outfit">UGX {value.toLocaleString()}</span>;
};

export default function FinancialStatementsTab({ statementsData }: { statementsData?: any }) {
  const [activeStatement, setActiveStatement] = useState<'income' | 'balance' | 'cash'>('income');

  const statements = statementsData;

  const rev = statements?.incomeStatement?.revenue || 0;
  const exp = statements?.incomeStatement?.expenses || 0;
  const prof = statements?.incomeStatement?.profit || 0;
  
  const incomeStmt = [
    { type: 'revenue', item: 'Platform Fees & Direct Revenue', amount: rev },
    { type: 'expense', item: 'Operating & Admin Expenses', amount: exp }
  ];

  const ass = statements?.balanceSheet?.assets || 0;
  const liab = statements?.balanceSheet?.liabilities || 0;
  const eq = statements?.balanceSheet?.equity || 0;

  const balanceSheet = {
    assets: [{ item: 'Cash & Receivables', amount: ass }],
    liabilities: [{ item: 'Current Liabilities', amount: liab }],
    equity: [{ item: 'Retained Earnings', amount: eq }]
  };

  const cashFlowStmt = statements?.cashFlowStatement || { 
    operating: [{ item: 'Net Cash from Operations', amount: prof }], 
    investing: [{ item: 'System Investments', amount: 0 }], 
    financing: [{ item: 'Financing Flow', amount: 0 }] 
  };

  const netIncome = prof;

  const handleExportPDF = () => {
    const doc = new jsPDF('p', 'pt', 'letter');
    
    // Purple alternate row configuration
    const alternateRowStyle = (data: any) => {
      // Use Welile Purple #EAE5FF for odd rows (like the Uber template's light blue, but purple)
      if (data.row.section === 'body' && data.row.index % 2 !== 0) {
          doc.setFillColor(234, 229, 255);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
      }
    };
    
    // Page 1: Balance Sheet
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("WELILE TECHNOLOGIES, INC.", doc.internal.pageSize.width / 2, 40, { align: "center" });
    doc.setFontSize(10);
    doc.text("CONDENSED CONSOLIDATED BALANCE SHEETS", doc.internal.pageSize.width / 2, 55, { align: "center" });
    doc.setFontSize(9);
    doc.text("(In UGX)", doc.internal.pageSize.width / 2, 70, { align: "center" });
    doc.text("(Unaudited)", doc.internal.pageSize.width / 2, 85, { align: "center" });

    doc.setFontSize(9);
    doc.text("As of " + new Date().toLocaleDateString('en-GB'), doc.internal.pageSize.width - 40, 110, { align: "right" });
    
    const totalAssets = balanceSheet.assets.reduce((a, b) => a + b.amount, 0);
    const totalLiabs = balanceSheet.liabilities.reduce((a, b) => a + b.amount, 0);
    const totalEq = balanceSheet.equity.reduce((a, b) => a + b.amount, 0);

    autoTable(doc, {
      startY: 120,
      theme: 'plain',
      headStyles: { fontStyle: 'bold', fontSize: 9, textColor: 0 },
      bodyStyles: { fontSize: 8.5, textColor: 0 },
      columnStyles: {
        0: { cellWidth: 350 },
        1: { cellWidth: 'auto', halign: 'right' }
      },
      head: [['Assets', '']],
      body: [
        ...balanceSheet.assets.map(a => [a.item, a.amount.toLocaleString()]),
        [{ content: 'Total assets', styles: { fontStyle: 'bold' } }, { content: totalAssets.toLocaleString(), styles: { fontStyle: 'bold' } }]
      ],
      willDrawCell: alternateRowStyle
    });

    let finalY = (doc as any).lastAutoTable.finalY + 20;

    autoTable(doc, {
      startY: finalY,
      theme: 'plain',
      headStyles: { fontStyle: 'bold', fontSize: 9, textColor: 0 },
      bodyStyles: { fontSize: 8.5, textColor: 0 },
      columnStyles: {
        0: { cellWidth: 350 },
        1: { cellWidth: 'auto', halign: 'right' }
      },
      head: [[{ content: 'Liabilities and Equity', styles: { fontStyle: 'bold' } }, '']],
      body: [
        ...balanceSheet.liabilities.map(l => [l.item, l.amount.toLocaleString()]),
        [{ content: 'Total liabilities', styles: { fontStyle: 'bold' } }, totalLiabs.toLocaleString()],
        ...balanceSheet.equity.map(e => [e.item, e.amount.toLocaleString()]),
        [{ content: 'Total equities', styles: { fontStyle: 'bold' } }, totalEq.toLocaleString()],
        [{ content: 'Total liabilities and equity', styles: { fontStyle: 'bold' } }, { content: (totalLiabs + totalEq).toLocaleString(), styles: { fontStyle: 'bold' } }]
      ],
      willDrawCell: alternateRowStyle
    });
    
    // Double underline total liabilities and equity
    finalY = (doc as any).lastAutoTable.finalY;
    doc.setLineWidth(1);
    doc.line(390, finalY - 4, doc.internal.pageSize.width - 40, finalY - 4);
    doc.line(390, finalY - 2, doc.internal.pageSize.width - 40, finalY - 2);


    // Page 2: Income Statement
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("WELILE TECHNOLOGIES, INC.", doc.internal.pageSize.width / 2, 40, { align: "center" });
    doc.setFontSize(10);
    doc.text("CONDENSED CONSOLIDATED STATEMENTS OF OPERATIONS", doc.internal.pageSize.width / 2, 55, { align: "center" });
    doc.setFontSize(9);
    doc.text("(In UGX)", doc.internal.pageSize.width / 2, 70, { align: "center" });
    doc.text("(Unaudited)", doc.internal.pageSize.width / 2, 85, { align: "center" });

    autoTable(doc, {
      startY: 120,
      theme: 'plain',
      headStyles: { fontStyle: 'bold', fontSize: 9, textColor: 0 },
      bodyStyles: { fontSize: 8.5, textColor: 0 },
      columnStyles: {
        0: { cellWidth: 350 },
        1: { cellWidth: 'auto', halign: 'right' }
      },
      head: [[{ content: 'Revenue', styles: { fontStyle: 'bold' } }, '']],
      body: [
        ...incomeStmt.filter(i => i.type === 'revenue').map(i => [i.item, i.amount.toLocaleString()]),
        [{ content: 'Costs and expenses', styles: { fontStyle: 'bold' } }, ''],
        ...incomeStmt.filter(i => i.type === 'expense').map(i => [i.item, Math.abs(i.amount).toLocaleString()]),
        [{ content: 'Net income (loss)', styles: { fontStyle: 'bold' } }, { content: netIncome.toLocaleString(), styles: { fontStyle: 'bold' } }]
      ],
      willDrawCell: alternateRowStyle
    });
    
    finalY = (doc as any).lastAutoTable.finalY;
    doc.setLineWidth(1);
    doc.line(390, finalY - 4, doc.internal.pageSize.width - 40, finalY - 4);
    doc.line(390, finalY - 2, doc.internal.pageSize.width - 40, finalY - 2);


    // Page 3: Cash Flows
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("WELILE TECHNOLOGIES, INC.", doc.internal.pageSize.width / 2, 40, { align: "center" });
    doc.setFontSize(10);
    doc.text("CONDENSED CONSOLIDATED STATEMENTS OF CASH FLOWS", doc.internal.pageSize.width / 2, 55, { align: "center" });
    doc.setFontSize(9);
    doc.text("(In UGX)", doc.internal.pageSize.width / 2, 70, { align: "center" });
    doc.text("(Unaudited)", doc.internal.pageSize.width / 2, 85, { align: "center" });

    const opCash = cashFlowStmt.operating.reduce((a, b) => a + b.amount, 0);
    const invCash = cashFlowStmt.investing.reduce((a, b) => a + b.amount, 0);
    const finCash = cashFlowStmt.financing.reduce((a, b) => a + b.amount, 0);
    
    autoTable(doc, {
      startY: 120,
      theme: 'plain',
      headStyles: { fontStyle: 'bold', fontSize: 9, textColor: 0 },
      bodyStyles: { fontSize: 8.5, textColor: 0 },
      columnStyles: {
        0: { cellWidth: 350 },
        1: { cellWidth: 'auto', halign: 'right' }
      },
      head: [[{ content: 'Cash flows from operating activities', styles: { fontStyle: 'bold' } }, '']],
      body: [
        ...cashFlowStmt.operating.map(c => [c.item, c.amount.toLocaleString()]),
        [{ content: 'Net cash provided by operating activities', styles: { fontStyle: 'bold' } }, opCash.toLocaleString()],
        
        [{ content: 'Cash flows from investing activities', styles: { fontStyle: 'bold' } }, ''],
        ...cashFlowStmt.investing.map(c => [c.item, Math.abs(c.amount).toLocaleString()]),
        [{ content: 'Net cash used in investing activities', styles: { fontStyle: 'bold' } }, invCash.toLocaleString()],
        
        [{ content: 'Cash flows from financing activities', styles: { fontStyle: 'bold' } }, ''],
        ...cashFlowStmt.financing.map(c => [c.item, Math.abs(c.amount).toLocaleString()]),
        [{ content: 'Net cash used in financing activities', styles: { fontStyle: 'bold' } }, finCash.toLocaleString()],
        
        [{ content: 'Net increase in cash and cash equivalents', styles: { fontStyle: 'bold' } }, { content: (opCash + invCash + finCash).toLocaleString(), styles: { fontStyle: 'bold' } }],
      ],
      willDrawCell: alternateRowStyle
    });

    finalY = (doc as any).lastAutoTable.finalY;
    doc.setLineWidth(1);
    doc.line(390, finalY - 4, doc.internal.pageSize.width - 40, finalY - 4);
    doc.line(390, finalY - 2, doc.internal.pageSize.width - 40, finalY - 2);

    doc.save('welile-financial-statements.pdf');
  };

  return (
    <div className="space-y-6 font-inter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex bg-white rounded-full p-1 border border-slate-200 shadow-sm overflow-x-auto max-w-full">
          <button 
            onClick={() => setActiveStatement('income')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeStatement === 'income' ? 'bg-[#6c11d4] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Income Statement
          </button>
          <button 
            onClick={() => setActiveStatement('balance')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeStatement === 'balance' ? 'bg-[#6c11d4] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Balance Sheet
          </button>
          <button 
            onClick={() => setActiveStatement('cash')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeStatement === 'cash' ? 'bg-[#6c11d4] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Cash Flow
          </button>
        </div>
        
        <button onClick={handleExportPDF} className="flex items-center gap-2 text-sm font-bold text-[#6c11d4] bg-[#EAE5FF] px-4 py-2 rounded-full hover:bg-purple-100 transition-colors">
          <Download size={16} /> Export PDF
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header styling */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="p-2 bg-[#EAE5FF] text-[#6c11d4] rounded-full">
            <FileIcon size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-outfit text-slate-800">
              {activeStatement === 'income' ? 'Consolidated Income Statement' : 
               activeStatement === 'balance' ? 'Statement of Financial Position' :
               'Statement of Cash Flows'}
            </h3>
            <p className="text-sm text-slate-500 font-medium">As of {new Date().toLocaleDateString('en-GB')} (Unaudited)</p>
          </div>
        </div>

        <div className="p-0">
          {activeStatement === 'income' && (
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F9F9FB] text-slate-500 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Line Item</th>
                      <th className="px-6 py-4 text-right">Amount (UGX)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-[#EAE5FF]/30">
                      <td colSpan={2} className="px-6 py-3 font-bold text-[#6c11d4] text-xs uppercase tracking-widest">Revenue</td>
                    </tr>
                    {incomeStmt.filter(i => i.type === 'revenue').map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#EAE5FF]/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700">{item.item}</td>
                        <td className="px-6 py-4 text-right font-black text-slate-900"><CompactCurrency value={item.amount} /></td>
                      </tr>
                    ))}
                    
                    <tr className="bg-[#EAE5FF]/30 border-t-2 border-[#EAE5FF]">
                      <td colSpan={2} className="px-6 py-3 font-bold text-[#6c11d4] text-xs uppercase tracking-widest">Expenses</td>
                    </tr>
                    {incomeStmt.filter(i => i.type === 'expense').map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#EAE5FF]/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700">{item.item}</td>
                        <td className="px-6 py-4 text-right font-black text-slate-900"><CompactCurrency value={Math.abs(item.amount)} /></td>
                      </tr>
                    ))}
                    
                    <tr className="bg-[#EAE5FF] border-y-2 border-[#6c11d4]/30">
                      <td className="px-6 py-5 font-bold text-[#6c11d4] text-base uppercase">Net Income</td>
                      <td className={`px-6 py-5 text-right font-black font-outfit text-2xl ${netIncome >= 0 ? 'text-[#6c11d4]' : 'text-red-600'}`}>
                        {netIncome >= 0 ? '+' : '-'}<CompactCurrency value={Math.abs(netIncome)} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeStatement === 'balance' && (
            <div className="flex flex-col">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   {/* Assets */}
                   <thead className="bg-[#EAE5FF]/50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4 text-[#6c11d4]">Assets</th>
                       <th className="px-6 py-4 text-right text-[#6c11d4]">Amount (UGX)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#EAE5FF]/50 border-b-2 border-[#EAE5FF]">
                     {balanceSheet.assets.map((item, idx) => (
                       <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#EAE5FF]/30'} hover:bg-[#EAE5FF]/50 transition-colors`}>
                         <td className="px-6 py-4 font-medium text-slate-700">{item.item}</td>
                         <td className="px-6 py-4 text-right font-black text-slate-900"><CompactCurrency value={item.amount} /></td>
                       </tr>
                     ))}
                     <tr className="bg-[#EAE5FF] font-bold">
                       <td className="px-6 py-4 text-[#6c11d4] uppercase text-xs tracking-wider">Total Assets</td>
                       <td className="px-6 py-4 text-right text-[#6c11d4] font-black font-outfit text-xl">
                         <CompactCurrency value={balanceSheet.assets.reduce((a, b) => a + b.amount, 0)} />
                       </td>
                     </tr>
                   </tbody>

                   {/* Liabilities */}
                   <thead className="bg-[#EAE5FF]/40 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4 text-[#6c11d4]">Liabilities</th>
                       <th className="px-6 py-4"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#EAE5FF]/50 border-b-2 border-[#EAE5FF] bg-[#EAE5FF]/10">
                     {balanceSheet.liabilities.map((item, idx) => (
                       <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#EAE5FF]/30'} hover:bg-[#EAE5FF]/50 transition-colors`}>
                         <td className="px-6 py-4 font-medium text-slate-700">{item.item}</td>
                         <td className="px-6 py-4 text-right font-black text-slate-900"><CompactCurrency value={item.amount} /></td>
                       </tr>
                     ))}
                     <tr className="bg-[#EAE5FF] font-bold">
                       <td className="px-6 py-4 text-[#6c11d4] uppercase text-xs tracking-wider">Total Liabilities</td>
                       <td className="px-6 py-4 text-right text-[#6c11d4] font-black font-outfit text-lg">
                         <CompactCurrency value={balanceSheet.liabilities.reduce((a, b) => a + b.amount, 0)} />
                       </td>
                     </tr>
                   </tbody>

                   {/* Equity */}
                   <thead className="bg-[#EAE5FF]/30 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4 text-[#6c11d4]">Equity</th>
                       <th className="px-6 py-4"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#EAE5FF]/50 bg-[#EAE5FF]/10">
                     {balanceSheet.equity.map((item, idx) => (
                       <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#EAE5FF]/30'} hover:bg-[#EAE5FF]/50 transition-colors`}>
                         <td className="px-6 py-4 font-medium text-slate-700">{item.item}</td>
                         <td className="px-6 py-4 text-right font-black text-slate-900"><CompactCurrency value={item.amount} /></td>
                       </tr>
                     ))}
                     <tr className="bg-[#EAE5FF] font-bold border-y-2 border-[#6c11d4]/30">
                       <td className="px-6 py-5 text-[#6c11d4] uppercase text-xs tracking-wider">Total Liabilities & Equity</td>
                       <td className="px-6 py-5 text-right text-[#6c11d4] font-black font-outfit text-xl">
                         <CompactCurrency 
                           value={
                             balanceSheet.liabilities.reduce((a, b) => a + b.amount, 0) + 
                             balanceSheet.equity.reduce((a, b) => a + b.amount, 0)
                           } 
                         />
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeStatement === 'cash' && (
            <div className="flex flex-col">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   
                   <thead className="bg-[#F9F9FB] border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4 font-bold text-[#6c11d4]">Cash flows from operating activities</th>
                       <th className="px-6 py-4 text-right"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#EAE5FF]/50 border-b-2 border-[#EAE5FF]">
                     {cashFlowStmt.operating.map((item, idx) => (
                       <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#EAE5FF]/30' : 'bg-white'} hover:bg-[#EAE5FF]/50 transition-colors`}>
                         <td className="px-6 py-4 font-medium text-slate-700">{item.item}</td>
                         <td className="px-6 py-4 text-right font-black text-slate-900"><CompactCurrency value={item.amount} /></td>
                       </tr>
                     ))}
                     <tr className="bg-[#EAE5FF]/70 font-bold border-t border-[#6c11d4]/20">
                       <td className="px-6 py-4 text-[#6c11d4] text-xs tracking-wider font-bold">Net cash provided by operating activities</td>
                       <td className="px-6 py-4 text-right text-[#6c11d4] font-black">
                         <CompactCurrency value={cashFlowStmt.operating.reduce((a, b) => a + b.amount, 0)} />
                       </td>
                     </tr>
                   </tbody>

                   <thead className="bg-[#F9F9FB] border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4 font-bold text-[#6c11d4]">Cash flows from investing activities</th>
                       <th className="px-6 py-4 text-right"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#EAE5FF]/50 border-b-2 border-[#EAE5FF]">
                     {cashFlowStmt.investing.map((item, idx) => (
                       <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#EAE5FF]/30' : 'bg-white'} hover:bg-[#EAE5FF]/50 transition-colors`}>
                         <td className="px-6 py-4 font-medium text-slate-700">{item.item}</td>
                         <td className="px-6 py-4 text-right font-black text-slate-900"><CompactCurrency value={item.amount} /></td>
                       </tr>
                     ))}
                     <tr className="bg-[#EAE5FF]/70 font-bold border-t border-[#6c11d4]/20">
                       <td className="px-6 py-4 text-[#6c11d4] text-xs tracking-wider font-bold">Net cash used in investing activities</td>
                       <td className="px-6 py-4 text-right text-[#6c11d4] font-black">
                         <CompactCurrency value={cashFlowStmt.investing.reduce((a, b) => a + b.amount, 0)} />
                       </td>
                     </tr>
                   </tbody>

                   <thead className="bg-[#F9F9FB] border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4 font-bold text-[#6c11d4]">Cash flows from financing activities</th>
                       <th className="px-6 py-4 text-right"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#EAE5FF]/50 border-b-2 border-[#EAE5FF]">
                     {cashFlowStmt.financing.map((item, idx) => (
                       <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#EAE5FF]/30' : 'bg-white'} hover:bg-[#EAE5FF]/50 transition-colors`}>
                         <td className="px-6 py-4 font-medium text-slate-700">{item.item}</td>
                         <td className="px-6 py-4 text-right font-black text-slate-900"><CompactCurrency value={item.amount} /></td>
                       </tr>
                     ))}
                     <tr className="bg-[#EAE5FF]/70 font-bold border-t border-[#6c11d4]/20">
                       <td className="px-6 py-4 text-[#6c11d4] text-xs tracking-wider font-bold">Net cash used in financing activities</td>
                       <td className="px-6 py-4 text-right text-[#6c11d4] font-black">
                         <CompactCurrency value={cashFlowStmt.financing.reduce((a, b) => a + b.amount, 0)} />
                       </td>
                     </tr>
                   </tbody>
                   
                   <tfoot className="bg-[#EAE5FF] border-y-2 border-[#6c11d4]/30">
                     <tr>
                       <td className="px-6 py-5 font-bold text-[#6c11d4] text-base">Net increase in cash and cash equivalents</td>
                       <td className={`px-6 py-5 text-right font-black font-outfit text-2xl text-[#6c11d4]`}>
                         <CompactCurrency value={
                           cashFlowStmt.operating.reduce((a, b) => a + b.amount, 0) +
                           cashFlowStmt.investing.reduce((a, b) => a + b.amount, 0) +
                           cashFlowStmt.financing.reduce((a, b) => a + b.amount, 0)
                         } />
                       </td>
                     </tr>
                   </tfoot>

                 </table>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
