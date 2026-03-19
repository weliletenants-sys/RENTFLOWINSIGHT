import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

const reportTypes = [
  { id: 'daily-summary', name: 'Daily Financial Summary', desc: 'Aggregated collections, payouts, and system fees for the current business day.' },
  { id: 'monthly-recon', name: 'Monthly Reconciliation', desc: 'Full month end-to-end ledger balance match against external bank & mobile money statements.' },
  { id: 'investor-roi', name: 'Investor ROI Digest', desc: 'Breakdown of returns generated and disbursed to active investment portfolios.' },
  { id: 'agent-commissions', name: 'Agent Commissions Report', desc: 'Calculated commissions owed based on successful collection yields.' },
  { id: 'tax-export', name: 'Tax & Compliance Export', desc: 'Formatted ledger export suitable for tax filing and audits.' },
];

const COOReports: React.FC = () => {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (id: string, name: string) => {
    setGenerating(id);
    toast.loading(`Generating ${name}...`, { id: 'report-gen' });
    
    // Mock generation delay
    setTimeout(() => {
      setGenerating(null);
      toast.success(`${name} downloaded successfully!`, { id: 'report-gen' });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-800">Financial Reports</h2>
          <p className="text-sm text-slate-500">Generate and export system-wide financial digests</p>
        </div>
        <div className="flex items-center space-x-2">
           <button className="flex items-center space-x-2 text-slate-600 px-3 py-2 border border-slate-100 rounded-lg hover:bg-slate-50 text-sm font-medium bg-white">
             <Calendar size={16} /> <span>Custom Range</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           {reportTypes.map(report => (
             <div key={report.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#9234EA] transition-colors group">
               <div className="flex items-start space-x-4">
                 <div className="w-10 h-10 rounded-lg bg-[#EAE5FF] text-[#7B61FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#9234EA] group-hover:text-white transition-colors">
                   <FileText size={20} />
                 </div>
                 <div>
                   <h3 className="text-md font-bold text-slate-800">{report.name}</h3>
                   <p className="text-sm text-slate-500 mt-1">{report.desc}</p>
                 </div>
               </div>
               <button 
                 onClick={() => handleGenerate(report.id, report.name)}
                 disabled={generating !== null}
                 className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                   generating === report.id 
                     ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                     : 'bg-white border-2 border-slate-100 text-[#7B61FF] hover:bg-[#EAE5FF] hover:border-[#9234EA]'
                 }`}
               >
                 {generating === report.id ? (
                   <div className="w-4 h-4 border-2 border-[#9234EA] border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <Download size={16} />
                 )}
                 <span>{generating === report.id ? 'Generating...' : 'Generate'}</span>
               </button>
             </div>
           ))}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
           <div className="flex items-center space-x-2 mb-4">
             <FileSpreadsheet className="text-emerald-600" size={20} />
             <h3 className="text-lg font-bold font-outfit text-slate-800">Quick Export</h3>
           </div>
           <p className="text-sm text-slate-500 mb-6">Download the raw general ledger for a specific period.</p>
           
           <div className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Start Date</label>
               <input type="date" className="w-full px-3 py-2 border border-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-[#9234EA] focus:outline-none" />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">End Date</label>
               <input type="date" className="w-full px-3 py-2 border border-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-[#9234EA] focus:outline-none" />
             </div>
             
             <button className="w-full flex items-center justify-center space-x-2 bg-[#9234EA] text-white px-4 py-2.5 rounded-lg hover:bg-[#7a2bc4] transition text-sm font-bold mt-2">
                <Download size={16} /> <span>Download Raw CSV</span>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default COOReports;
