import React, { useState, useEffect } from 'react';
import { Search, Check, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { fetchPartners } from '../../services/cooApi';

const COOPartnersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');

  const [escalations, setEscalations] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await fetchPartners();
        setEscalations(data.escalations || []);
        setInvestors(data.investors || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, []);

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
                  <tr key={investor.id} className="hover:bg-slate-50/50 transition-colors group">
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
    </div>
  );
};

export default COOPartnersPage;
