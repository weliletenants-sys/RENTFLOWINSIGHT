import React, { useState, useEffect } from 'react';
import { Search, Check, Loader2, AlertTriangle, ShieldAlert, X, Edit2, Save, XCircle, Upload, PlusCircle, Lock, Unlock } from 'lucide-react';
import { fetchPartners, updatePartnerPortfolio, freezePartnerAccount } from '../../services/cooApi';
import PartnerImportDialog from './components/PartnerImportDialog';
import CreatePortfolioDialog from './components/CreatePortfolioDialog';

const COOPartnersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');

  const [escalations, setEscalations] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ capital: number, roi: number, status: string }>({ capital: 0, roi: 0, status: 'ACTIVE' });
  const [isSaving, setIsSaving] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showCreatePort, setShowCreatePort] = useState(false);
  const [isFreezing, setIsFreezing] = useState(false);

  const startEditing = (port: any) => {
    setEditingDealId(port.id);
    setEditForm({
      capital: port.investment_amount || 0,
      roi: port.total_roi_earned || 0,
      status: port.status || 'ACTIVE'
    });
  };

  const handleSavePortfolio = async (portId: string) => {
    if (!selectedPartner) return;
    try {
      setIsSaving(true);
      await updatePartnerPortfolio(portId, {
        investment_amount: editForm.capital,
        total_roi_earned: editForm.roi,
        status: editForm.status
      });

      // Optimistic Local Sync to avoid re-fetching all partners
      const newPortfolios = selectedPartner.portfolios.map((p: any) => 
        p.id === portId ? { ...p, investment_amount: editForm.capital, total_roi_earned: editForm.roi, status: editForm.status } : p
      );

      const newTotalInvested = newPortfolios.reduce((sum: number, p: any) => sum + (p.investment_amount || 0), 0);
      const newReturnsPaid = newPortfolios.reduce((sum: number, p: any) => sum + (p.total_roi_earned || 0), 0);
      
      const updatedPartner = {
        ...selectedPartner,
        portfolios: newPortfolios,
        totalInvested: newTotalInvested,
        returnsPaid: newReturnsPaid
      };
      
      setSelectedPartner(updatedPartner);
      setInvestors(prev => prev.map(inv => inv.id === updatedPartner.id ? updatedPartner : inv));
      setEditingDealId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update portfolio');
    } finally {
      setIsSaving(false);
    }
  };

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await fetchPartners();
      setEscalations(data.escalations || []);
      setInvestors(data.investors || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleFreezeToggle = async () => {
    if (!selectedPartner) return;
    const action = selectedPartner.frozen ? 'Unfreeze' : 'Freeze';
    if (!window.confirm(`Are you sure you want to ${action} the account for ${selectedPartner.name}?`)) return;

    try {
      setIsFreezing(true);
      await freezePartnerAccount(selectedPartner.id, !selectedPartner.frozen);
      const updated = { ...selectedPartner, frozen: !selectedPartner.frozen };
      setSelectedPartner(updated);
      setInvestors(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
    } catch (err: any) {
      alert(err.message || `Failed to ${action} account`);
    } finally {
      setIsFreezing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading partner SLA matrices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Partners</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // To combine existing Partner UI with the backend partnerEscalations, we just map them into escalations Tab for pending
  return (
    <div className="space-y-6 font-inter relative">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-[#6c11d4]">Partners & Escalations</h2>
          <p className="text-sm text-slate-500">Track portfolio performance and backend SLAs</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowImport(true)}
            className="hidden sm:flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            <Upload size={18} className="mr-2" /> Import Partners
          </button>
          <div className="bg-[#EAE5FF] p-3 rounded-lg text-center">
            <p className="text-xs text-[#6c11d4] font-semibold uppercase">Total Issues</p>
            <p className="text-lg font-bold text-slate-800">{escalations.length}</p>
          </div>
        </div>
      </div>

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
          <span>System Escalations</span>
          <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full">{escalations.length}</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#6c11d4] focus:border-[#6c11d4] text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'active' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6 font-bold">Partner Name</th>
                  <th className="p-4 font-bold">Total Capital</th>
                  <th className="p-4 font-bold">Returns Paid</th>
                  <th className="p-4 font-bold">Active Deals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {investors.length === 0 ? (
                   <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-medium">No live organizational partners.</td></tr>
                ) : investors.map((investor) => (
                  <tr key={investor.id} onClick={() => setSelectedPartner(investor)} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                    <td className="p-4 pl-6 font-bold text-slate-800 flex items-center gap-2">
                       {investor.name}
                       {investor.frozen && <ShieldAlert size={14} className="text-red-500" />}
                    </td>
                    <td className="p-4 font-bold text-[#6c11d4]">UGX {investor.totalInvested.toLocaleString()}</td>
                    <td className="p-4 font-bold text-green-600 flex items-center"><Check size={14} className="mr-1" /> UGX {investor.returnsPaid.toLocaleString()}</td>
                    <td className="p-4 font-bold text-slate-600">{investor.activeDeals} Deals</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6 font-bold">Issue ID</th>
                  <th className="p-4 font-bold">Partner ID</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Priority</th>
                  <th className="p-4 font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {escalations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No partner escalations active.</td>
                  </tr>
                ) : escalations.map((req: any) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-slate-800">{req.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-500">{req.partner_id}</td>
                    <td className="p-4 font-bold text-slate-700">{req.issue_type}</td>
                    <td className="p-4 font-bold text-[#6c11d4]">{req.priority_level}</td>
                    <td className="p-4 pb-3">
                       <span className="text-sm font-medium text-slate-600">{req.description}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Portfolio Inspection Drawer */}
      {selectedPartner && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setSelectedPartner(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col font-inter">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
               <div className="flex-1">
                  <div className="flex items-center gap-2">
                     <h3 className="font-bold text-lg text-slate-800 tracking-tight">{selectedPartner.name}</h3>
                     {selectedPartner.frozen && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">FROZEN</span>}
                  </div>
                  <p className="text-sm font-medium text-slate-500">Investment Portfolio</p>
               </div>
               <button onClick={() => setSelectedPartner(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500 cursor-pointer">
                  <X size={20} />
               </button>
            </div>
            <div className="p-4 bg-white border-b border-slate-100 flex gap-3 shadow-sm z-10">
               <button 
                  onClick={handleFreezeToggle}
                  disabled={isFreezing}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center transition-colors ${selectedPartner.frozen ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
               >
                  {isFreezing ? <Loader2 size={16} className="animate-spin" /> : selectedPartner.frozen ? <><Unlock size={16} className="mr-2" /> Unfreeze Account</> : <><Lock size={16} className="mr-2" /> Freeze Account</>}
               </button>
               <button 
                  onClick={() => setShowCreatePort(true)}
                  className="flex-1 py-2.5 bg-[#6c11d4]/10 text-[#6c11d4] hover:bg-[#6c11d4]/20 rounded-xl font-bold text-xs flex items-center justify-center transition-colors"
               >
                  <PlusCircle size={16} className="mr-2" /> Register Capital
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
               {(!selectedPartner.portfolios || selectedPartner.portfolios.length === 0) ? (
                  <div className="text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm mt-4">
                     <p className="text-slate-500 font-bold text-sm">No active investments found in ledger.</p>
                  </div>
               ) : (
                  <div className="space-y-4 shadow-inner p-2 bg-slate-100/50 rounded-3xl">
                     {selectedPartner.portfolios.map((port: any, idx: number) => {
                        const isEditing = editingDealId === port.id;
                        
                        return (
                        <div key={idx} className={`bg-white p-6 rounded-2xl border ${isEditing ? 'border-[#6c11d4] shadow-md ring-4 ring-[#6c11d4]/5' : 'border-slate-200 shadow-sm hover:border-[#6c11d4]/30 hover:shadow-md'} transition-all group`}>
                           <div className="flex justify-between items-start mb-4">
                              <h4 className="font-bold text-slate-800 text-xs tracking-widest uppercase mt-1">Deal ID: {port.id?.slice(0, 8) || 'N/A'}</h4>
                              
                              <div className="flex flex-wrap justify-end gap-2 items-center">
                                {isEditing ? (
                                   <select 
                                      value={editForm.status}
                                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                      className="px-2 py-1 text-[10px] uppercase font-bold rounded-lg border border-slate-300 bg-white text-slate-700 outline-none focus:border-[#6c11d4]"
                                   >
                                      <option value="ACTIVE">ACTIVE</option>
                                      <option value="COMPLETED">COMPLETED</option>
                                      <option value="PENDING">PENDING</option>
                                   </select>
                                ) : (
                                   <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-black rounded-full ${port.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-500/20' : 'bg-slate-100 text-slate-500'}`}>
                                      {port.status || 'PENDING'}
                                   </span>
                                )}

                                {!isEditing ? (
                                   <button onClick={() => startEditing(port)} className="p-1.5 text-slate-400 hover:text-[#6c11d4] hover:bg-[#6c11d4]/10 rounded-lg transition-colors ml-1" title="Edit Deal">
                                      <Edit2 size={14} />
                                   </button>
                                ) : (
                                   <div className="flex gap-1 ml-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                                      <button disabled={isSaving} onClick={() => handleSavePortfolio(port.id)} className={`p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors ${isSaving ? 'opacity-50' : ''}`} title="Save Changes">
                                         {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                      </button>
                                      <button disabled={isSaving} onClick={() => setEditingDealId(null)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors" title="Cancel">
                                         <XCircle size={14} />
                                      </button>
                                   </div>
                                )}
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#6c11d4]"></div> Capital</p>
                                 {isEditing ? (
                                    <input 
                                       type="number"
                                       value={editForm.capital}
                                       onChange={(e) => setEditForm({...editForm, capital: Number(e.target.value)})}
                                       className="w-full px-2 py-1 bg-slate-50 border border-slate-300 focus:border-[#6c11d4] rounded-lg font-bold text-[#6c11d4] text-sm focus:outline-none transition-colors"
                                    />
                                 ) : (
                                    <p className="font-black text-[#6c11d4] tracking-tight">UGX {(port.investment_amount || 0).toLocaleString()}</p>
                                 )}
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> ROI Paid</p>
                                 {isEditing ? (
                                    <input 
                                       type="number"
                                       value={editForm.roi}
                                       onChange={(e) => setEditForm({...editForm, roi: Number(e.target.value)})}
                                       className="w-full px-2 py-1 bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg font-bold text-emerald-600 text-sm focus:outline-none transition-colors"
                                    />
                                 ) : (
                                    <p className="font-black text-emerald-600 tracking-tight">UGX {(port.total_roi_earned || 0).toLocaleString()}</p>
                                 )}
                              </div>
                           </div>
                           {port.created_at && (
                              <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between">
                                 <p className="text-[11px] font-bold text-slate-400 tracking-wide">
                                    Invested on {new Date(port.created_at).toLocaleDateString()}
                                 </p>
                              </div>
                           )}
                        </div>
                        );
                     })}
                  </div>
               )}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-4 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
               <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Capital</p>
                  <p className="font-black text-[#6c11d4] text-lg tracking-tight truncate">UGX {selectedPartner.totalInvested.toLocaleString()}</p>
               </div>
               <div className="bg-emerald-50/50 p-4 rounded-2xl ring-1 ring-emerald-500/10">
                  <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mb-1">Total Returns</p>
                  <p className="font-black text-emerald-600 text-lg tracking-tight truncate">UGX {selectedPartner.returnsPaid.toLocaleString()}</p>
               </div>
            </div>
          </div>
        </>
      )}

      <PartnerImportDialog 
        isOpen={showImport} 
        onClose={() => setShowImport(false)} 
        onSuccess={() => {
          setShowImport(false);
          loadPartners();
        }} 
      />

      <CreatePortfolioDialog 
        isOpen={showCreatePort} 
        onClose={() => setShowCreatePort(false)}
        partnerId={selectedPartner?.id}
        partnerName={selectedPartner?.name}
        onSuccess={() => {
          setShowCreatePort(false);
          loadPartners();
        }}
      />

    </div>
  );
};

export default COOPartnersPage;
