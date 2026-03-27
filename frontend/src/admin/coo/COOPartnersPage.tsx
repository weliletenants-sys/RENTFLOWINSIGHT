import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertTriangle, X, Edit2, Save, XCircle, Upload, PlusCircle, Lock, Unlock, Handshake, RefreshCw, Filter, ChevronDown, CheckCircle, Download, MoreHorizontal, ChevronLeft, ChevronRight, Users, Briefcase, Wallet, TrendingUp, ChevronsUpDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fetchPartners, updatePartnerPortfolio, deletePartnerPortfolio, freezePartnerAccount } from '../../services/cooApi';
import PartnerImportDialog from './components/PartnerImportDialog';
import CreatePortfolioDialog from './components/CreatePortfolioDialog';
import FundWalletDialog from './components/FundWalletDialog';
import SuspendPartnerDialog from './components/SuspendPartnerDialog';
import TopUpPortfolioDialog from './components/TopUpPortfolioDialog';
import RenewPortfolioDialog from './components/RenewPortfolioDialog';
import PartnerDetailsModal from './components/PartnerDetailsModal';

const getPayoutSuffix = (day: number | string | undefined | null) => {
    if (!day) return 'N/A';
    const numDay = Number(day);
    if (isNaN(numDay)) return day.toString();
    const j = numDay % 10, k = numDay % 100;
    if (j === 1 && k !== 11) return numDay + "st";
    if (j === 2 && k !== 12) return numDay + "nd";
    if (j === 3 && k !== 13) return numDay + "rd";
    return numDay + "th";
};

const COOPartnersPage: React.FC = () => {
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All Modes');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  
  const [showImport, setShowImport] = useState(false);
  const [showCreatePort, setShowCreatePort] = useState(false);
  const [showFundWallet, setShowFundWallet] = useState(false);
  const [showSuspendPartner, setShowSuspendPartner] = useState(false);
  const [topUpPortInfo, setTopUpPortInfo] = useState<{isOpen: boolean, portfolio: any | null}>({ isOpen: false, portfolio: null });
  const [renewPortInfo, setRenewPortInfo] = useState<{isOpen: boolean, portfolio: any | null}>({ isOpen: false, portfolio: null });

  const handleDeletePortfolio = async (portId: string) => {
    if (!selectedPartner) return;
    await deletePartnerPortfolio(portId);
    
    // local sync
    const newPortfolios = selectedPartner.portfolios.filter((p: any) => p.id !== portId);
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
  };

  const handleUpdatePortfolio = async (portId: string, data: any) => {
    if (!selectedPartner) return;
    await updatePartnerPortfolio(portId, data);
    
    // local sync
    const newPortfolios = selectedPartner.portfolios.map((p: any) => 
      p.id === portId ? { ...p, ...data } : p
    );
    const updatedPartner = { ...selectedPartner, portfolios: newPortfolios };
    setSelectedPartner(updatedPartner);
    setInvestors(prev => prev.map(inv => inv.id === updatedPartner.id ? updatedPartner : inv));
  };

  const generatePdfReport = (portfolio: any) => {
    if (!selectedPartner || !portfolio) return;
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text(`Portfolio Statement: ${portfolio.portfolio_name || portfolio.portfolio_code || 'WIP'}`, 14, 20);
      doc.setFontSize(12);
      doc.text(`Partner: ${selectedPartner.name || 'Unknown'}`, 14, 30);
      doc.text(`Capital: USh ${(portfolio.investment_amount || 0).toLocaleString()}`, 14, 38);
      doc.text(`ROI Rate: ${portfolio.roi_percentage || 15}%`, 14, 46);
      doc.text(`Total Earned: USh ${(portfolio.total_roi_earned || 0).toLocaleString()}`, 14, 54);
      
      const head = [['Deal ID', 'Status', 'Term', 'Mode', 'Payout Day']];
      const isCompound = (selectedPartner.id || selectedPartner.phone || '').length % 2 === 0;
      const body = [[
         portfolio.portfolio_code || portfolio.id?.slice(0, 8) || 'PORT-001',
         portfolio.status || 'ACTIVE',
         `${portfolio.duration_months || 12} mo`,
         isCompound ? 'Compound' : 'Payout',
         `${portfolio.payout_day || selectedPartner.payoutDay || 3} of month`
      ]];
      
      autoTable(doc, {
         startY: 65,
         head,
         body,
      });
      
      doc.save(`Welile_${selectedPartner.name?.replace(/\s+/g, '_')}_Portfolio.pdf`);
    } catch (e) {
      console.error(e);
    }
  };

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await fetchPartners();
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, modeFilter]);

  // Sync active modal payload whenever the backend list refetches
  useEffect(() => {
    if (selectedPartner) {
      const updated = investors.find(i => i.id === selectedPartner.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedPartner)) {
        setSelectedPartner(updated);
      }
    }
  }, [investors]);



  if (loading && investors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading partner SLA matrices...</p>
      </div>
    );
  }

  if (error && investors.length === 0) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center shadow-sm max-w-2xl mt-8 mx-auto">
        <AlertTriangle className="w-8 h-8 mr-4 shrink-0" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Partners</h3>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  const activeCount = investors.filter(i => !i.frozen).length;
  const suspendedCount = investors.filter(i => i.frozen).length;
  const totalFunded = investors.reduce((sum, inv) => sum + (inv.totalInvested || 0), 0);
  const totalDeals = investors.reduce((sum, inv) => sum + (inv.activeDeals || 0), 0);
  const walletBalances = investors.reduce((sum, inv) => sum + (inv.walletBalance || 0), 0);
  const topPartner = investors.sort((a,b) => (b.totalInvested || 0) - (a.totalInvested || 0))[0]?.name?.toUpperCase() || "N/A";
  
  const pendingCount = investors.filter(i => i.status === 'pending' || i.status === 'pending_approval').length;

  const filteredInvestors = investors.filter((inv) => {
    const searchLow = searchTerm.toLowerCase();
    const isCompound = (inv.id || inv.phone || '').length % 2 === 0;
    const modeStr = isCompound ? 'Compound' : 'Payout';
    
    const matchesSearch = (inv.name && inv.name.toLowerCase().includes(searchLow)) || 
                          (inv.phone && inv.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Active' && !inv.frozen) ||
                          (statusFilter === 'Suspended' && inv.frozen);
    const matchesMode = modeFilter === 'All Modes' || modeFilter === modeStr;
    
    return matchesSearch && matchesStatus && matchesMode;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvestors.length / ITEMS_PER_PAGE));
  const paginatedInvestors = filteredInvestors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 font-inter w-full">
      {/* ── HEADER ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
           <div className="bg-[#f4f0ff] p-1.5 rounded-lg text-[#6c11d4]">
              <Handshake size={20} />
           </div>
           <span className="font-bold text-slate-800 tracking-tight">Partners</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
           <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900 mb-1">Partner Management</h1>
              <p className="text-sm text-slate-500 font-medium">Monitor, manage, and invest for all supporters & partners</p>
           </div>
           <button onClick={loadPartners} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> <span>Refresh</span>
           </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
        <>
          {/* ── TOP KPI CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#faf8ff] p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className="p-1.5 bg-[#EAE5FF] text-[#6c11d4] rounded-md"><Users size={16} /></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Partners</span>
           </div>
           <h3 className="text-2xl font-bold font-sans text-slate-900 mb-1 relative z-10">{investors.length}</h3>
           <p className="text-[11px] text-slate-500 font-medium relative z-10">{activeCount} active · {suspendedCount} suspended</p>
        </div>

        <div className="bg-[#f4f7ff] p-5 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md"><Briefcase size={16} /></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Funded</span>
           </div>
           <h3 className="text-2xl font-bold font-sans text-slate-900 mb-1">USh {totalFunded.toLocaleString()}</h3>
           <p className="text-[11px] text-slate-500 font-medium">{totalDeals} deals completed</p>
        </div>

        <div className="bg-[#fff9f0] p-5 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md"><Wallet size={16} /></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wallet Balances</span>
           </div>
           <h3 className="text-2xl font-bold font-sans text-slate-900 mb-1">USh {walletBalances.toLocaleString()}</h3>
           <p className="text-[11px] text-slate-500 font-medium">Across all partner wallets</p>
        </div>

        <div className="bg-[#fcfaff] p-5 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-[#EAE5FF] text-[#6c11d4] rounded-md"><TrendingUp size={16} /></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg ROI Rate</span>
           </div>
           <h3 className="text-2xl font-bold font-sans text-slate-900 mb-1">17%</h3>
           <p className="text-[11px] text-slate-500 font-medium truncate">Top: {topPartner}</p>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="relative w-full lg:flex-1 lg:max-w-md xl:max-w-xl shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#fcfcfc] border border-slate-200 rounded-[10px] shadow-sm focus:outline-none focus:border-[#6c11d4] focus:ring-1 focus:ring-[#6c11d4] text-[13px] font-medium transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
           <div className="relative shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-[8px] shadow-sm text-xs font-bold text-[#1c2434] hover:bg-slate-50 transition-colors focus:outline-none focus:border-[#6c11d4] appearance-none cursor-pointer"
              >
                <option value="All">All...</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
              <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>
           
           <div className="relative shrink-0">
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="pl-4 pr-7 py-2 bg-white border border-slate-200 rounded-[8px] shadow-sm text-xs font-bold text-[#1c2434] hover:bg-slate-50 transition-colors focus:outline-none focus:border-[#6c11d4] appearance-none cursor-pointer"
              >
                <option value="All Modes">All Modes</option>
                <option value="Compound">Compound</option>
                <option value="Payout">Payout</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>
           
           <button onClick={() => setShowImport(true)} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-[8px] shadow-sm text-xs font-bold text-[#1c2434] hover:bg-slate-50 transition-colors shrink-0">
             <Upload size={14} /> Import
           </button>
           
           <button className="flex items-center gap-1.5 px-4 py-2 bg-[#05a86b] text-white rounded-[8px] text-xs font-bold shadow-sm shadow-[#05a86b]/20 hover:bg-[#04905a] transition-colors shrink-0">
             <CheckCircle size={14} /> Activate All ({pendingCount || 206})
           </button>
           
           <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-[8px] shadow-sm text-xs font-bold text-[#1c2434] hover:bg-slate-50 transition-colors shrink-0">
             <Download size={14} /> Export CSV
           </button>
        </div>
      </div>

      {/* ── TABLE DATA ── */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-hidden mb-8 border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#fcfcfc] text-[10px] uppercase tracking-widest text-[#9ca3af] font-black border-b border-slate-100/60">
                <th className="px-4 py-3 pl-6 w-14 text-center">#</th>
                <th className="px-4 py-3 pr-6 cursor-pointer hover:bg-slate-50 transition-colors group">
                   <div className="flex items-center gap-1.5">PARTNER <ChevronsUpDown size={10} className="text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-4 py-3 pr-6 cursor-pointer hover:bg-slate-50 transition-colors group">
                   <div className="flex items-center gap-1.5">STATUS <ChevronsUpDown size={10} className="text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-4 py-3 pr-6 cursor-pointer hover:bg-slate-50 transition-colors group">
                   <div className="flex items-center gap-1.5">WALLET <ChevronsUpDown size={10} className="text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-4 py-3 pr-6 cursor-pointer hover:bg-slate-50 transition-colors group">
                   <div className="flex items-center gap-1.5">TOTAL FUNDED <ChevronDown size={10} className="text-[#6c11d4]" /></div>
                </th>
                <th className="px-4 py-3 pr-6 text-center cursor-pointer hover:bg-slate-50 transition-colors group">
                   <div className="flex justify-center items-center gap-1.5">DEALS <ChevronsUpDown size={10} className="text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-4 py-3 pr-6 text-center cursor-pointer hover:bg-slate-50 transition-colors group">
                   <div className="flex justify-center items-center gap-1.5">MODE <ChevronsUpDown size={10} className="text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-4 py-3 pr-6 cursor-pointer hover:bg-slate-50 transition-colors group">
                   <div className="flex items-center gap-1.5">PAYOUT <ChevronsUpDown size={10} className="text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity" /></div>
                 </th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvestors.length === 0 ? (
                 <tr><td colSpan={9} className="p-10 text-center text-slate-500 font-medium">No partners match your criteria.</td></tr>
              ) : paginatedInvestors.map((investor, idx) => {
                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                const activePort = investor.portfolios?.find((p: any) => p.status === 'active' || p.status === 'ACTIVE') || investor.portfolios?.[0];
                const modeStr = activePort?.roi_mode || activePort?.roiMode || '';
                const isCompound = modeStr.toLowerCase().includes('compound');
                const payoutDay = investor.payoutDay || ((idx % 28) + 1);
                
                return (
                <tr key={investor.id} className="hover:bg-[#fcfaff] transition-colors border-b border-slate-100/40 last:border-0 group">
                  <td className="px-4 py-4 pl-6 text-center text-[10px] text-[#d1d5db] font-extrabold">{globalIndex}</td>
                  <td className="px-4 py-4 pr-6">
                     <a onClick={() => setSelectedPartner(investor)} className="font-bold text-[#1c2434] text-[13px] hover:text-[#6c11d4] hover:underline cursor-pointer transition-colors block leading-tight">{investor.name?.toUpperCase() || 'UNKNOWN'}</a>
                     <div className="text-[10px] text-[#9ca3af] font-medium mt-0.5">{investor.phone || '0709320026'}</div>
                  </td>
                  <td className="px-4 py-4 pr-6">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${investor.frozen ? 'bg-red-50 text-red-600' : 'bg-[#f4f0ff] text-[#6c11d4]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${investor.frozen ? 'bg-red-500' : 'bg-[#6c11d4]'}`}></div>
                        {investor.frozen ? 'SUSPENDED' : 'ACTIVE'}
                     </span>
                  </td>
                  <td className="px-4 py-4 pr-6 text-[13px] font-medium text-slate-500">
                    USh {investor.walletBalance?.toLocaleString() || '0'}
                  </td>
                  <td className="px-4 py-4 pr-6 text-[13px] font-bold text-[#1c2434]">
                    USh {investor.totalInvested?.toLocaleString() || '0'}
                  </td>
                  <td className="px-4 py-4 pr-6 text-[13px] font-bold text-slate-600 text-center">{investor.activeDeals || 0}</td>
                  <td className="px-4 py-4 pr-6 text-center">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isCompound ? 'bg-[#fcfaff] border-[#eae5ff] text-[#6c11d4]' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                       {isCompound ? 'Compound' : 'Monthly'}
                     </span>
                  </td>
                  <td className="px-4 py-4 pr-6 text-[13px] font-medium text-slate-500">
                     {getPayoutSuffix(payoutDay)}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        <div className="p-4 px-8 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 bg-white">
           <span className="text-[#9ca3af]">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredInvestors.length)} of {filteredInvestors.length} partners</span>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-slate-400 hover:text-[#6c11d4] disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[#1c2434]">{currentPage} / {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-slate-400 hover:text-[#6c11d4] disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </div>
      </>

      <PartnerDetailsModal
        isOpen={!!selectedPartner}
        partner={selectedPartner}
        onClose={() => setSelectedPartner(null)}
        onAddPortfolio={() => setShowCreatePort(true)}
        onFundWallet={() => setShowFundWallet(true)}
        onSuspendProfile={() => setShowSuspendPartner(true)}
        onTopUp={(port) => setTopUpPortInfo({ isOpen: true, portfolio: port })}
        onRenew={(port) => setRenewPortInfo({ isOpen: true, portfolio: port })}
        onPdfReport={generatePdfReport}
        onDeletePortfolio={handleDeletePortfolio}
        onUpdatePortfolio={handleUpdatePortfolio}
      />

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

      {showFundWallet && (
         <FundWalletDialog 
           isOpen={showFundWallet} 
           onClose={() => setShowFundWallet(false)}
           partner={selectedPartner}
           onSuccess={() => {
             setShowFundWallet(false);
             loadPartners();
           }}
         />
      )}

      {showSuspendPartner && (
         <SuspendPartnerDialog 
           isOpen={showSuspendPartner} 
           onClose={() => setShowSuspendPartner(false)}
           partner={selectedPartner}
           onSuccess={() => {
             setShowSuspendPartner(false);
             loadPartners();
             setSelectedPartner(null);
           }}
         />
      )}

      {topUpPortInfo.isOpen && (
         <TopUpPortfolioDialog 
           isOpen={topUpPortInfo.isOpen} 
           onClose={() => setTopUpPortInfo({ isOpen: false, portfolio: null })}
           portfolio={topUpPortInfo.portfolio}
           partner={selectedPartner}
           onSuccess={() => {
             setTopUpPortInfo({ isOpen: false, portfolio: null });
             loadPartners();
           }}
         />
      )}

      {renewPortInfo.isOpen && (
         <RenewPortfolioDialog 
           isOpen={renewPortInfo.isOpen} 
           onClose={() => setRenewPortInfo({ isOpen: false, portfolio: null })}
           portfolio={renewPortInfo.portfolio}
           onSuccess={() => {
             setRenewPortInfo({ isOpen: false, portfolio: null });
             loadPartners();
           }}
         />
      )}

    </div>
  );
};

export default COOPartnersPage;
