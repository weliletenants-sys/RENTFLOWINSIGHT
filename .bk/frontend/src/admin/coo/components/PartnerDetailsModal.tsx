import React from 'react';
import { X, Calendar, Phone, Plus, Edit2, TrendingUp, Wallet, CheckCircle, Download, Trash2, FileText, ChevronRight, Briefcase, Lock, Unlock, MoreHorizontal, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PartnerDetailsModalProps {
  isOpen: boolean;
  partner: any;
  onClose: () => void;
  onAddPortfolio: () => void;
  onFundWallet: () => void;
  onSuspendProfile: () => void;
  onTopUp: (portfolio: any) => void;
  onRenew: (portfolio: any) => void;
  onPdfReport: (portfolio: any) => void;
  onDeletePortfolio: (portId: string) => Promise<void>;
  onUpdatePortfolio: (portId: string, data: any) => Promise<void>;
}

const getPayoutSuffix = (day: number | string | undefined | null) => {
    if (!day) return 'N/A';
    const numDay = Number(day);
    if (numDay >= 11 && numDay <= 13) return `${numDay}th`;
    switch (numDay % 10) {
        case 1: return `${numDay}st`;
        case 2: return `${numDay}nd`;
        case 3: return `${numDay}rd`;
        default: return `${numDay}th`;
    }
};

const PartnerDetailsModal: React.FC<PartnerDetailsModalProps> = ({ 
  isOpen, partner, onClose, onAddPortfolio, onFundWallet, onSuspendProfile, onTopUp, onRenew, onPdfReport, onDeletePortfolio, onUpdatePortfolio 
}) => {
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({ name: '', payoutDay: '' });
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  if (!isOpen || !partner) return null;

  const totalPortfolios = partner.portfolios?.length || 0;
  // Calculate total ROI earned correctly if available
  const totalRoiEarned = partner.portfolios?.reduce((sum: number, p: any) => sum + (p.total_roi_earned || 0), 0) || 0;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] flex justify-end p-2 sm:p-4">
      {/* Slide in from right panel instead of fixed center for better UX on tall content, but design shows a floating modal. */}
      {/* We will make it a floating modal that takes max-w-5xl, centered. */}
      <div className="bg-white w-full max-w-[1000px] h-full sm:h-auto sm:max-h-[96vh] rounded-[24px] shadow-2xl flex flex-col mx-auto my-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
        
        {/* HEADER AREA */}
        <div className="bg-[#fcfaff] px-6 sm:px-8 py-6 border-b border-slate-100 flex-shrink-0 relative">
           <button onClick={onClose} className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
              <X size={20} />
           </button>
           
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#EAE5FF] text-[#6c11d4] flex items-center justify-center text-2xl font-black shrink-0">
                 {partner.name?.charAt(0)?.toUpperCase() || 'P'}
              </div>
              <div className="pt-1">
                 <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">{partner.name || 'UNKNOWN PARTNER'}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase ${partner.frozen ? 'bg-red-500 text-white' : 'bg-[#6c11d4] text-white'}`}>
                       {partner.frozen ? 'SUSPENDED' : 'ACTIVE'}
                    </span>
                 </div>
                 <div className="flex items-center gap-4 text-[13px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5"><Phone size={14} /> {partner.phone || '0709320026'}</div>
                    <div className="flex items-center gap-1.5"><Calendar size={14} /> Joined {partner.created_at ? new Date(partner.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '18 Mar 2026'}</div>
                 </div>
              </div>
           </div>

           {/* 4 SUMMARY CARDS */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-[#EAE5FF] transition-colors shadow-sm">
                 <Wallet size={16} className="text-[#9ca3af] mb-1.5" />
                 <h3 className="font-black text-slate-900 text-lg sm:text-lg tracking-tight">USh {(partner.walletBalance || 0).toLocaleString()}</h3>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Wallet Balance</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-[#EAE5FF] transition-colors shadow-sm">
                 <div className="text-[#9ca3af] mb-1.5"><Wallet size={16} /></div>
                 <h3 className="font-black text-slate-900 text-lg sm:text-lg tracking-tight">USh {(partner.totalInvested || 0).toLocaleString()}</h3>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Total Invested</p>
              </div>
              <div className="bg-[#fffdf8] border border-amber-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-amber-200 transition-colors shadow-sm">
                 <TrendingUp size={16} className="text-amber-300 mb-1.5" />
                 <h3 className="font-black text-slate-900 text-lg sm:text-lg tracking-tight">USh {totalRoiEarned.toLocaleString()}</h3>
                 <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mt-0.5">ROI Earned</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-[#EAE5FF] transition-colors shadow-sm">
                 <Briefcase size={16} className="text-[#9ca3af] mb-1.5" />
                 <h3 className="font-black text-slate-900 text-lg sm:text-lg tracking-tight">{totalPortfolios}</h3>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Portfolios</p>
              </div>
           </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-[#fafafc] p-6 sm:p-8 custom-scrollbar">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-sm font-black text-slate-500 tracking-widest uppercase">Investment Portfolios</h3>
              <div className="flex flex-wrap items-center gap-2">
                 <button onClick={onSuspendProfile} className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-colors ${partner.frozen ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                    {partner.frozen ? <><Unlock size={14} /> Reactivate</> : <><Lock size={14} /> Suspend</>}
                 </button>
                 <button onClick={onFundWallet} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-xs font-bold transition-colors shadow-sm">
                    <Wallet size={14} /> Fund Wallet
                 </button>
                 <button onClick={onAddPortfolio} className="flex items-center gap-1.5 bg-[#6c11d4] hover:bg-[#580eb0] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm shadow-[#6c11d4]/20">
                    <Plus size={14} /> Add Portfolio
                 </button>
              </div>
           </div>

           <div className="space-y-5">
              {(!partner.portfolios || totalPortfolios === 0) ? (
                 <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 font-bold text-sm">No active portfolios found.</p>
                 </div>
              ) : partner.portfolios.map((port: any, idx: number) => {
                 const modeStr = port.roi_mode || port.roiMode || '';
                 const isCompound = modeStr.toLowerCase().includes('compound');
                 const roiRate = port.roi_percentage || 15;
                 const investment = port.investment_amount || port.investmentAmount || 0;
                 const monthlyRoi = (investment * (roiRate / 100)) / 12;
                 const createdDate = port.created_at ? new Date(port.created_at) : new Date();
                 const payoutDate = new Date(createdDate);
                 payoutDate.setMonth(payoutDate.getMonth() + 1);
                 
                 return (
                 <div key={port.id || idx} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
                    <div className="p-6">
                       {/* Portfolio Header */}
                       <div className="flex items-start gap-4 mb-3">
                          <div className="bg-[#f4f0ff] text-[#6c11d4] font-black text-xs px-2.5 py-1.5 rounded-lg tracking-widest shrink-0">
                             #{idx + 1}
                          </div>
                          <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className="font-black text-slate-900 tracking-tight text-[15px]">{port.portfolio_code || `WIP260${idx}171622`}</h4>
                                 <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${port.status === 'ACTIVE' ? 'bg-[#f4f0ff] text-[#6c11d4]' : 'bg-slate-100 text-slate-500'}`}>
                                    {port.status || 'ACTIVE'}
                                 </span>
                              </div>
                              {editId === port.id ? (
                                 <input 
                                    type="text" 
                                    value={editForm.name} 
                                    onChange={e => setEditForm({...editForm, name: e.target.value})} 
                                    className="text-[12px] font-medium text-slate-600 border border-[#6c11d4] shadow-sm shadow-[#6c11d4]/10 rounded px-2 py-1 outline-none w-full max-w-[200px]" 
                                    placeholder="Portfolio Name" 
                                    autoFocus 
                                 />
                              ) : (
                                 <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500">
                                    <Briefcase size={12} className="text-slate-400" /> {port.portfolio_name || "Main Investment"}
                                    <button onClick={() => { setEditId(port.id); setEditForm({ name: port.portfolio_name || '', payoutDay: port.payout_day?.toString() || partner.payoutDay?.toString() || '3' }); }} className="text-slate-300 hover:text-[#6c11d4] transition-colors"><Edit2 size={12} /></button>
                                 </div>
                              )}
                           </div>
                        </div>
                       
                       <p className="text-[11px] text-slate-400 font-medium mb-1">25d ago · {port.duration_months || 12}mo term</p>
                       <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
                          USh {investment.toLocaleString()}
                       </h2>

                       {/* Data Grid */}
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                          <div>
                             <p className="text-[11px] font-medium text-slate-500 mb-1">ROI Rate</p>
                             <p className="font-bold text-[#6c11d4] text-[13px]">{roiRate}%</p>
                          </div>
                          <div>
                             <p className="text-[11px] font-medium text-slate-500 mb-1">Monthly ROI</p>
                             <p className="font-bold text-slate-900 text-[13px]">USh {monthlyRoi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          </div>
                           <div>
                              <p className="text-[11px] font-medium text-slate-500 mb-1">Mode</p>
                              <p className="font-bold text-slate-900 text-[13px] flex items-center gap-1.5">
                                 <TrendingUp size={12} className="text-slate-400" /> {isCompound ? 'Compound' : 'Monthly'}
                              </p>
                           </div>
                          <div>
                             <p className="text-[11px] font-medium text-slate-500 mb-1">Total Earned</p>
                             <p className="font-bold text-[#6c11d4] text-[13px]">USh {(port.total_roi_earned || 0).toLocaleString()}</p>
                          </div>

                          <div>
                             <p className="text-[11px] font-medium text-slate-500 mb-1">Invested On</p>
                             <p className="font-bold text-slate-900 text-[13px]">{createdDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div>
                             <p className="text-[11px] font-medium text-slate-500 mb-1">Duration</p>
                             <p className="font-bold text-slate-900 text-[13px]">{port.duration_months || 12} months</p>
                          </div>
                          <div>
                             <p className="text-[11px] font-medium text-slate-500 mb-1">Payout Date</p>
                             <p className="font-bold text-slate-900 text-[13px]">{payoutDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div>
                             <p className="text-[11px] font-medium text-slate-500 mb-1">Payout Status</p>
                             <p className="font-bold text-[#05a86b] text-[13px] flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#05a86b] to-[#10e599] shadow-sm shadow-[#05a86b]/40"></div> Active
                             </p>
                          </div>
                       </div>
                    </div>

                    {/* Footer Area */}
                    <div className="bg-[#fafafc] border-t border-slate-100 p-5 px-6">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                           <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-slate-400" />
                              <span className="text-[12px] font-medium text-slate-500">Payout Day:</span>
                              <span className="font-bold text-slate-900 text-[13px] flex items-center gap-1.5 ml-1">
                                 {editId === port.id ? (
                                    <input 
                                       type="number" min="1" max="28" 
                                       value={editForm.payoutDay} 
                                       onChange={e => setEditForm({...editForm, payoutDay: e.target.value})} 
                                       className="w-14 text-center border border-[#6c11d4] shadow-sm shadow-[#6c11d4]/10 rounded px-1 py-0.5 outline-none" 
                                    />
                                 ) : (
                                    <>{getPayoutSuffix(port.payout_day || partner.payoutDay || 3)} of month</>
                                 )}
                              </span>
                           </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                             <span className="flex items-center justify-center w-3 h-3 rounded-full border border-slate-300 opacity-70">
                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                             </span>
                             Next: {payoutDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                       </div>

                       <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-slate-200/60 justify-center sm:justify-start">
                          {editId === port.id ? (
                             <button disabled={isSaving} onClick={async () => {
                                 setIsSaving(true);
                                 await onUpdatePortfolio(port.id, { portfolio_name: editForm.name, payout_day: Number(editForm.payoutDay) });
                                 setIsSaving(false);
                                 setEditId(null);
                             }} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6c11d4] hover:opacity-80 transition-opacity">
                                <Save size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
                             </button>
                          ) : (
                             <button onClick={() => { setEditId(port.id); setEditForm({ name: port.portfolio_name || '', payoutDay: port.payout_day?.toString() || partner.payoutDay?.toString() || '3' }); }} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6c11d4] hover:opacity-80 transition-opacity">
                                <Edit2 size={14} /> Edit
                             </button>
                          )}
                          <button onClick={() => onTopUp(port)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#05a86b] hover:opacity-80 transition-opacity">
                             <TrendingUp size={14} /> Top Up
                          </button>
                          <button onClick={() => onRenew(port)} className="flex items-center gap-1.5 text-[12px] font-bold text-amber-500 hover:opacity-80 transition-opacity">
                             <Calendar size={14} className="scale-x-[-1]" /> Renew
                          </button>
                          <button disabled={isDeleting === port.id} onClick={async () => {
                              if (!window.confirm("Are you sure you want to delete this portfolio? This cannot be undone.")) return;
                              setIsDeleting(port.id);
                              await onDeletePortfolio(port.id);
                              setIsDeleting(null);
                          }} className="flex items-center gap-1.5 text-[12px] font-bold text-red-500 hover:opacity-80 transition-opacity">
                             <Trash2 size={14} /> {isDeleting === port.id ? 'Deleting...' : 'Delete'}
                          </button>
                          <button onClick={() => onPdfReport(port)} className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700 hover:opacity-80 transition-opacity sm:ml-auto">
                             <FileText size={14} /> PDF
                          </button>
                       </div>
                    </div>
                 </div>
              )})}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailsModal;
