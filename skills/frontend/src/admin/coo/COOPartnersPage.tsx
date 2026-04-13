import React, { useState } from 'react';
import { Search, UploadCloud, PlusCircle, Lock, Unlock, Check, X, FileText, User, CreditCard, Hash, Calendar, File, Download } from 'lucide-react';

const mockInvestors = [
  { id: 1, name: 'Mbabazi K.', totalInvested: '120,000,000', returnsPaid: '18,000,000', activeDeals: 4, frozen: false },
  { id: 2, name: 'Ssematimba R.', totalInvested: '90,000,000', returnsPaid: '13,500,000', activeDeals: 3, frozen: false },
  { id: 3, name: 'Kagimu D.', totalInvested: '60,000,000', returnsPaid: '9,000,000', activeDeals: 2, frozen: true },
  { id: 4, name: 'Namuli G.', totalInvested: '25,000,000', returnsPaid: '2,500,000', activeDeals: 1, frozen: false },
];

const mockRequests = [
  { 
    id: 101, name: 'Grace N.', contact: 'grace.n@example.com', proposedAmount: '50,000,000', date: 'Oct 24, 2026', status: 'Pending Review',
    paymentMethod: 'Bank Transfer (Stanbic)', transactionId: 'TXN-STAN-89234R',
    documents: ['National_ID_Front.jpg', 'Proof_Of_Address.pdf', 'Source_Of_Funds.pdf']
  },
  { 
    id: 102, name: 'Peter L.', contact: 'peter.l@example.com', proposedAmount: '12,500,000', date: 'Oct 26, 2026', status: 'Pending Review',
    paymentMethod: 'Mobile Money (MTN)', transactionId: 'TXN-MTN-44912J',
    documents: ['Passport_Scan.png', 'Mobile_Money_Statement.pdf']
  },
];

const COOPartnersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  return (
    <div className="space-y-6 font-inter relative">
      {/* Overview Cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-[#6c11d4]">Investors Overview</h2>
          <p className="text-sm text-slate-500">Track portfolio performance and funder capital</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#EAE5FF] p-3 rounded-lg text-center">
            <p className="text-xs text-[#6c11d4] font-semibold uppercase">Total Capital</p>
            <p className="text-lg font-bold text-slate-800">UGX 4.2B</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
            <p className="text-xs text-green-700 font-semibold uppercase">Avg ROI</p>
            <p className="text-lg font-bold text-green-700">15% /mo</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          className={`pb-3 px-6 text-sm font-bold transition-colors ${activeTab === 'active' ? 'text-[#6c11d4] border-b-2 border-[#6c11d4]' : 'text-slate-400 hover:text-slate-600'}`}
          onClick={() => setActiveTab('active')}
        >
          Active Partners
        </button>
        <button 
          className={`pb-3 px-6 text-sm font-bold transition-colors flex items-center space-x-2 ${activeTab === 'pending' ? 'text-[#6c11d4] border-b-2 border-[#6c11d4]' : 'text-slate-400 hover:text-slate-600'}`}
          onClick={() => setActiveTab('pending')}
        >
          <span>Pending Requests</span>
          <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full">2</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder={activeTab === 'active' ? "Search investors..." : "Search requests..."}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#6c11d4] focus:border-[#6c11d4] text-sm transition-all"
            />
          </div>
          {activeTab === 'active' && (
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <button className="flex-shrink-0 flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full hover:bg-slate-50 transition text-sm font-bold shadow-sm">
                <UploadCloud size={16} className="text-slate-400" /> Import (CSV)
              </button>
              <button className="flex-shrink-0 flex items-center gap-2 bg-[#EAE5FF] text-[#6c11d4] px-4 py-2 rounded-full hover:bg-purple-100 transition text-sm font-bold">
                <PlusCircle size={16} /> Proxy Invest
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="overflow-x-auto">
          {activeTab === 'active' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6 font-bold">Investor Name</th>
                  <th className="p-4 font-bold">Total Invested</th>
                  <th className="p-4 font-bold">Returns Paid</th>
                  <th className="p-4 font-bold">Active Deals</th>
                  <th className="p-4 font-bold text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockInvestors.map((investor) => (
                  <tr key={investor.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-slate-800">{investor.name}</td>
                    <td className="p-4 font-bold text-[#6c11d4]">UGX {investor.totalInvested}</td>
                    <td className="p-4 font-bold text-green-600 flex items-center"><Check size={14} className="mr-1" /> UGX {investor.returnsPaid}</td>
                    <td className="p-4 font-bold text-slate-600">{investor.activeDeals} Deals</td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-3 text-sm">
                        <button className="text-[#6c11d4] hover:text-[#5f48ce] font-bold underline text-xs">
                          History
                        </button>
                        <button className={`flex items-center justify-center p-2 rounded-full border transition ${investor.frozen ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600'}`} title={investor.frozen ? "Unfreeze Account" : "Freeze Account"}>
                          {investor.frozen ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6 font-bold">Applicant Name</th>
                  <th className="p-4 font-bold">Contact Info</th>
                  <th className="p-4 font-bold">Proposed Capital</th>
                  <th className="p-4 font-bold">Application Date</th>
                  <th className="p-4 font-bold text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-slate-800">{req.name}</td>
                    <td className="p-4 text-sm font-medium text-slate-500">{req.contact}</td>
                    <td className="p-4 font-bold text-[#6c11d4]">UGX {req.proposedAmount}</td>
                    <td className="p-4 pb-3">
                       <span className="text-sm font-medium text-slate-600 block">{req.date}</span>
                       <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-md mt-1 inline-block">{req.status}</span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                           onClick={() => setSelectedRequest(req)}
                           className="flex items-center gap-1 text-xs font-bold text-[#6c11d4] bg-[#EAE5FF] px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors"
                        >
                           <FileText size={12} /> View Docs
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve Request">
                           <Check size={16} />
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reject Request">
                           <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <span>Showing {activeTab === 'active' ? mockInvestors.length : mockRequests.length} records</span>
          <div className="flex space-x-1">
             <button className="px-3 py-1 border border-slate-200 rounded-md bg-white text-slate-400 cursor-not-allowed">Prev</button>
             <button className="px-3 py-1 border border-[#6c11d4] rounded-md bg-[#6c11d4] text-white font-bold">1</button>
             <button className="px-3 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {/* Slide-Over / Drawer for Viewing Request Details */}
      {selectedRequest && (
        <>
           {/* Backdrop */}
           <div 
             className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" 
             onClick={() => setSelectedRequest(null)}
           />
           
           {/* Drawer */}
           <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-[#F9F9FB] shadow-2xl z-50 transform transition-transform duration-300 translate-x-0 flex flex-col font-inter">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
                 <h2 className="text-xl font-bold font-outfit text-slate-800">Application Details</h2>
                 <button 
                   onClick={() => setSelectedRequest(null)}
                   className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                 >
                    <X size={20} />
                 </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 
                 {/* Profile Block */}
                 <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-[#EAE5FF] flex items-center justify-center text-[#6c11d4] text-2xl font-bold shadow-sm border border-purple-100">
                       {selectedRequest.name.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-800">{selectedRequest.name}</h3>
                       <p className="text-sm text-slate-500 flex items-center mt-1">
                         <User size={14} className="mr-1" /> {selectedRequest.contact}
                       </p>
                    </div>
                 </div>

                 {/* Transaction Info Block */}
                 <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Deposit Information</h4>
                    
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                       <span className="text-sm text-slate-500 flex items-center"><Hash size={16} className="mr-2 text-slate-400" /> Proposed Amount</span>
                       <span className="font-bold text-lg text-[#6c11d4]">UGX {selectedRequest.proposedAmount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                       <span className="text-sm text-slate-500 flex items-center"><CreditCard size={16} className="mr-2 text-slate-400" /> Payment Method</span>
                       <span className="font-medium text-slate-800">{selectedRequest.paymentMethod}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                       <span className="text-sm text-slate-500 flex items-center"><FileText size={16} className="mr-2 text-slate-400" /> Transaction / Ref ID</span>
                       <span className="font-mono text-sm font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded">{selectedRequest.transactionId}</span>
                    </div>

                    <div className="flex items-center justify-between">
                       <span className="text-sm text-slate-500 flex items-center"><Calendar size={16} className="mr-2 text-slate-400" /> Date Submitted</span>
                       <span className="font-medium text-slate-800">{selectedRequest.date}</span>
                    </div>
                 </div>

                 {/* Documents Block */}
                 <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Attached Documents</h4>
                    
                    <div className="space-y-3">
                       {selectedRequest.documents.map((doc: string, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-[#6c11d4] transition-colors cursor-pointer group bg-slate-50/50">
                             <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 text-[#6c11d4] shadow-sm">
                                   <File size={16} />
                                </div>
                                <span className="text-sm font-medium text-slate-700 truncate max-wxs">{doc}</span>
                             </div>
                             <div className="p-2 text-slate-400 group-hover:text-[#6c11d4] transition-colors">
                                <Download size={16} />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
                 
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 bg-white border-t border-slate-100 flex gap-4">
                 <button 
                  className="flex-1 py-3 border border-red-200 text-red-600 rounded-full font-bold hover:bg-red-50 transition-colors bg-white shadow-sm"
                  onClick={() => setSelectedRequest(null)}
                 >
                    Reject Application
                 </button>
                 <button 
                  className="flex-1 py-3 bg-[#6c11d4] text-white rounded-full font-bold hover:bg-[#6c51e8] transition-colors shadow-sm shadow-purple-500/20"
                  onClick={() => setSelectedRequest(null)}
                 >
                    Approve Request
                 </button>
              </div>
           </div>
        </>
      )}

    </div>
  );
};

export default COOPartnersPage;
