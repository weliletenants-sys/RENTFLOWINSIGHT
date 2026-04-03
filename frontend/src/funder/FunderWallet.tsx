import { useState, useEffect, useMemo } from 'react';
import { 
  Download, Upload, ArrowRightLeft, Clock,
  CheckCircle, XCircle, AlertCircle, Plus, Loader2, Phone, Wallet, Users, Info, ChevronLeft, ChevronRight, PieChart
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import FunderSidebar from './components/FunderSidebar';
import FunderBottomNav from './components/FunderBottomNav';
import FunderDashboardHeader from './components/FunderDashboardHeader';
import { Link } from 'react-router-dom';
import { getFunderDashboardStats, getFunderActivities, fundRentPool, requestDeposit, requestWalletWithdrawal, getWalletOperations, getPayoutMethods, transferFunds, type PayoutMethodView } from '../services/funderApi';
import type { DashboardStatsResponse } from '../services/funderApi';

import { useAuth } from '../contexts/AuthContext';
import { useFunderWalletData, funderQueryKeys } from './hooks/useFunderQueries';
import { useQueryClient } from '@tanstack/react-query';

export default function FunderWallet() {
  const { user } = useAuth();
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Cash In' | 'Cash Out'>('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const { data, isLoading } = useFunderWalletData();
  const queryClient = useQueryClient();
  
  const stats = data?.stats || null;
  const payoutMethods = data?.payoutRes?.data?.payoutMethods || [];

  const transactions = useMemo(() => {
    if (!data) return [];
    
    const pendingOps = (data.opsData?.data?.operations || []).map((op: any) => ({
      id: op.id,
      date: new Date(op.created_at || Date.now()).toLocaleString(),
      rawDate: new Date(op.created_at || Date.now()).getTime(),
      type: op.direction === 'credit' ? 'Cash In' : 'Cash Out',
      category: op.category || 'pending_op',
      description: `Pending ${op.category}`,
      amount: op.amount || 0,
      status: op.status,
      ref: op.reference_id || 'PENDING-...'
    }));

    const mappedTx = (data.activities || []).map((tx: any) => {
      let niceDesc = tx.description || 'Transfer';
      if (tx.category === 'coo_manual_portfolio') niceDesc = 'Emergency Capital Injection';
      else if (tx.category === 'coo_wallet_fund') niceDesc = 'System Wallet Top-Up';
      else if (tx.category) niceDesc = String(tx.category).replace(/_/g, ' ').toUpperCase();
      
      return {
        id: tx.id || `tx-${Math.random()}`,
        date: new Date(tx.created_at || tx.transaction_date || Date.now()).toLocaleString(),
        rawDate: new Date(tx.created_at || tx.transaction_date || Date.now()).getTime(),
        type: tx.direction === 'cash_in' ? 'Cash In' : 'Cash Out',
        category: tx.category || 'general_transfer',
        description: niceDesc,
        amount: tx.amount || 0,
        status: 'completed',
        ref: tx.reference_id || (tx.id ? String(tx.id).slice(0, 8) : 'REF-N/A')
      };
    });

    return [...pendingOps, ...mappedTx].sort((a, b) => b.rawDate - a.rawDate);
  }, [data]);

  // Check if wallet is idle for >= 7 days AND has > 100,000 UGX
  const isWalletIdle = useMemo(() => {
    if (!stats || stats.availableLiquid < 100000) return false;
    
    if (!transactions || transactions.length === 0) return true;
    
    // Assuming transactions are sorted by date, newest first
    const latestTx = new Date(transactions[0].date).getTime();
    const daysIdle = (Date.now() - latestTx) / (1000 * 60 * 60 * 24);
    return daysIdle >= 7;
  }, [transactions, stats]);

  // Deposit State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedDepositPayoutId, setSelectedDepositPayoutId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositTid, setDepositTid] = useState('');
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPayoutId, setSelectedPayoutId] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethodView[]>([]);

  // Transfer State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<'internal' | 'p2p'>('internal');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSourceBucket, setTransferSourceBucket] = useState<'commission' | 'savings'>('commission');
  const [transferTargetIdentifier, setTransferTargetIdentifier] = useState('');
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);

  // Withdrawal Notice logic (mocked visually for now, or extracted from backend)
  const pendingWithdrawal: any = null; // To fully support this, we would pull `InvestmentWithdrawalRequests` from API.

  // Minimal pending withdrawal mockup logic for now
  const pendingWithdrawal: any = null;

  const handleDepositSubmit = async () => {
    if (!depositAmount || !depositTid || !selectedDepositPayoutId) {
      toast.error('Please fill in all fields and select a source account');
      return;
    }
    const amount = Number(depositAmount);
    if (amount < 100000) {
      toast.error('Minimum deposit is UGX 100,000');
      return;
    }
    
    setIsSubmittingDeposit(true);
    try {
      const selectedMethod = payoutMethods.find((m) => m.id === selectedDepositPayoutId);
      const providerString = selectedMethod ? `${selectedMethod.provider} - ${selectedMethod.account_number}` : 'Unknown';
      await requestDeposit({ amount, provider: providerString, external_tx_id: depositTid });
      toast.success('Deposit requested successfully! Awaiting verification.');
      setIsDepositModalOpen(false);
      setDepositAmount('');
      setDepositTid('');
      setSelectedDepositPayoutId('');
      queryClient.invalidateQueries({ queryKey: funderQueryKeys.wallet });
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Deposit submission failed');
    } finally {
      setIsSubmittingDeposit(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    if (!withdrawAmount || !selectedPayoutId) {
      toast.error('Please select a payout method and enter an amount');
      return;
    }
    const amount = Number(withdrawAmount);
    if (amount < 100000) {
      toast.error('Minimum withdrawal is UGX 100,000');
      return;
    }
    if (!stats || amount > stats.availableLiquid) {
      toast.error('Insufficient Liquid Available Balance for this withdrawal. Funds may be locked in Active Portfolios.');
      return;
    }

    setIsSubmittingWithdraw(true);
    try {
      await requestWalletWithdrawal(amount);
      toast.success('External withdrawal requested! Now awaiting rigorous Manager & CFO verification.');
      
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      setSelectedPayoutId('');
      queryClient.invalidateQueries({ queryKey: funderQueryKeys.wallet });
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Withdrawal failed');
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  const handleFundRentPool = async () => {
    try {
      setIsLoading(true);
      await fundRentPool({
        amount: 100000,
        roi_mode: 'monthly_compounding',
        duration_months: 12, // Default 12 months for quick invest
        auto_renew: false // Default to false for quick invest
      });
      toast.success("Successfully transferred 100,000 UGX into active Rent Pool!");
      queryClient.invalidateQueries({ queryKey: funderQueryKeys.wallet });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to allocate funds to rent pool.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferSubmit = async () => {
    const amount = Number(transferAmount);
    if (!amount || amount <= 0) return toast.error('Enter a valid amount');
    if (transferType === 'p2p' && !transferTargetIdentifier) return toast.error('Enter a valid recipient email or phone number');

    setIsSubmittingTransfer(true);
    try {
      await transferFunds({
        type: transferType,
        amount,
        sourceBucket: transferType === 'internal' ? transferSourceBucket : undefined,
        targetIdentifier: transferType === 'p2p' ? transferTargetIdentifier : undefined
      });
      toast.success(transferType === 'internal' ? 'Internal transfer successful!' : 'Funds sent successfully!');
      setIsTransferModalOpen(false);
      setTransferAmount('');
      setTransferTargetIdentifier('');
      queryClient.invalidateQueries({ queryKey: funderQueryKeys.wallet });
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Transfer failed');
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  const filteredTransactions = activeTab === 'All' 
    ? transactions 
    : transactions.filter(tx => tx.type === activeTab);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    if (filteredTransactions.length === 0) return toast.error('No transactions to export');
    
    const exportData = filteredTransactions.map(tx => ({
      'Date & Time': tx.date,
      'Reference ID': tx.ref,
      'Category': tx.category,
      'Description': tx.description,
      'Transaction Type': tx.type,
      'Amount (UGX)': tx.amount,
      'Status': tx.status
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Wallet_Transactions");
    XLSX.writeFile(wb, `RentFlowInsight_Wallet_Tx_${new Date().getTime()}.xlsx`);
    toast.success('Transaction history downloaded successfully!');
  };

  const formatStatus = (st: string) => {
    if (st.startsWith('pending')) return 'Pending';
    if (st.startsWith('approved')) return 'Approved';
    return st.replace(/_/g, ' ');
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'completed' || status.startsWith('approved')) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status.startsWith('pending')) return <Clock className="w-4 h-4 text-orange-500" />;
    if (status === 'failed' || status === 'rejected') return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-primary-faint)' }}>
      <div className="flex h-screen overflow-hidden">
        
        <FunderSidebar 
          activePage="Wallet" 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />

        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">
          <FunderDashboardHeader
            user={{ fullName: displayName, role: 'supporter', avatarUrl: '' }}
            pageTitle="Wallet"
            onMenuClick={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 px-4 sm:px-8 py-8 pb-32 lg:pb-12 max-w-5xl mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Wallet Management</h2>
            </div>

            {/* ──────────────── TOP ROW: BALANCE & WARNINGS ──────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-5">
              
              {/* Main Balance Card */}
              <div className={`${!isWalletIdle ? 'lg:col-span-3' : 'lg:col-span-2'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl pb-8 pt-8 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden transition-all duration-300 border border-slate-700/50`}>
                
                {/* Financial Security Micro-Stripes (Premium FinTech feel) */}
                <div 
                  className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" 
                  style={{ 
                    backgroundImage: 'repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 8px)'
                  }}
                />
                
                {/* Secondary Accent Diagonal */}
                <div 
                  className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.02] pointer-events-none" 
                  style={{ 
                    backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 2px, transparent 2px, transparent 24px)'
                  }}
                />

                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl text-sm" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Loading State Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-3xl">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                
                <h3 className="text-[11px] sm:text-sm font-bold text-slate-300 uppercase tracking-widest">Available Liquidity</h3>
                <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-bold text-slate-400">UGX</span>
                  <span className="text-3xl sm:text-5xl font-black tracking-tight truncate">{stats?.availableLiquid.toLocaleString() || '0'}</span>
                </div>

                <div className="mt-6 sm:mt-10 flex flex-row items-center gap-1.5 sm:gap-3 relative z-10 w-full pb-1">
                  <button 
                    onClick={() => setIsDepositModalOpen(true)}
                    className="flex-1 bg-[var(--color-primary)] hover:opacity-90 text-white px-2 sm:px-6 py-2 sm:py-3 rounded-xl text-[9px] sm:text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> Deposit
                  </button>
                  <button 
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-2 sm:px-6 py-2 sm:py-3 rounded-xl text-[9px] sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 border border-white/10 whitespace-nowrap"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" /> Withdraw
                  </button>
                  <button 
                    onClick={() => setIsTransferModalOpen(true)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-2 sm:px-6 py-2 sm:py-3 rounded-xl text-[9px] sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 border border-white/10 whitespace-nowrap"
                  >
                    <ArrowRightLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Transfer
                  </button>
                </div>
              </div>

              {/* Idle Cash / Promo Notice - Visible after 7 days idle */}
              {isWalletIdle && (
                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex flex-col justify-center items-center text-center animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-emerald-900 mb-2">Fund & Earn</h3>
                  <p className="text-xs font-semibold text-emerald-700 leading-relaxed mb-4">
                    Put your capital to work. Fund the Rent Pool today to earn up to <span className="font-bold underline">15% monthly</span>.
                  </p>
                  <button 
                    onClick={handleFundRentPool}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md"
                  >
                    Fund Rent Pool (min 100k)
                  </button>
                </div>
              )}
            </div>

            {/* ──────────────── 90-DAY WITHDRAWAL TRACKER ──────────────── */}
            {pendingWithdrawal && (
              <div className="bg-orange-50 rounded-3xl p-6 sm:p-8 border border-orange-200 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-orange-900">Active Withdrawal Request</h3>
                      <p className="text-sm font-semibold text-orange-700 mt-1">
                        Amount: <span className="font-bold">UGX {pendingWithdrawal.amount.toLocaleString()}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs font-bold text-orange-600 bg-orange-100 inline-flex px-2.5 py-1 rounded-md">
                        <AlertCircle className="w-3 h-3" />
                        Standard ROI rewards paused during notice period
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-orange-100 flex-1 max-w-sm">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                      <span>Requested: {pendingWithdrawal.requestDate}</span>
                      <span>{pendingWithdrawal.daysRemaining} days left</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-400 rounded-full" 
                        style={{ width: `${((90 - pendingWithdrawal.daysRemaining) / 90) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 text-right text-[10px] font-black uppercase text-orange-400 tracking-wider flex justify-between">
                      <span>Process Date</span>
                      <span>{pendingWithdrawal.earliestProcessDate}</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ──────────────── TRANSACTION LEDGER ──────────────── */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-black text-slate-900">Transaction History</h3>
                
                {/* Actions & Tabs */}
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-faint)] px-3 py-2 rounded-lg hover:shadow-sm transition-all border border-[var(--color-primary-border)] flex-1 sm:flex-none"
                  >
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <div className="flex bg-slate-50 p-1 rounded-xl overflow-x-auto hide-scrollbar flex-1 sm:flex-none w-full sm:w-auto">
                  {['All', 'Cash In', 'Cash Out'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex-1 sm:flex-none ${
                        activeTab === tab 
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  </div>
                </div>
              </div>

              <div className="w-full bg-slate-50/50 p-4 sm:p-6">
                <div className="flex flex-col gap-3">
                    {filteredTransactions.length === 0 ? (
                      <div className="py-12 bg-white rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17V7"/></svg>
                        </div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Nothing to Display</p>
                        <p className="text-xs font-semibold text-slate-400">No ledger entries exist for the selected filter.</p>
                      </div>
                    ) : (
                      paginatedTransactions.map((tx) => {
                        const cat = String(tx.category).toLowerCase();
                        const isRentFund = cat === 'supporter_rent_fund';
                        const isCashIn = tx.type === 'Cash In' || cat.includes('deposit') || cat.includes('top');
                        const isWithdraw = tx.type === 'Cash Out' || cat.includes('withdraw');
                        
                        let txColor = '#64748B'; // default
                        let txBg = '#F1F5F9'; // default bg
                        let txSymbol = '';
                        let TxIcon = <ArrowRightLeft className="w-5 h-5" strokeWidth={2.5} />;

                        if (isRentFund) {
                          txColor = '#580CAE';
                          txBg = '#580CAE1A';
                          txSymbol = '-';
                          TxIcon = <PieChart className="w-5 h-5 drop-shadow-sm" strokeWidth={2.5} />;
                        } else if (isCashIn) {
                          txColor = '#10B981';
                          txBg = '#10B9811A';
                          txSymbol = '+';
                          TxIcon = <Download className="w-5 h-5" strokeWidth={2.5} />;
                        } else if (isWithdraw) {
                          txColor = '#EF4444';
                          txBg = '#EF44441A';
                          txSymbol = '-';
                          TxIcon = <Upload className="w-5 h-5" strokeWidth={2.5} />;
                        } else {
                          // generic transfers
                          txSymbol = tx.type === 'Cash In' ? '+' : '-';
                          if (tx.type === 'Cash In') {
                            txColor = '#10B981';
                            txBg = '#10B9811A';
                          } else {
                            txColor = '#EF4444';
                            txBg = '#EF44441A';
                          }
                        }

                        return (
                          <div key={tx.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 sm:gap-4 shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                            
                            {/* Left Icon (Rounded) */}
                            <div className={`w-12 h-12 rounded-full flex flex-shrink-0 items-center justify-center`} style={{
                              backgroundColor: txBg,
                              color: txColor
                            }}>
                              {TxIcon}
                            </div>
                            
                            {/* Center Content (3 Lines) */}
                            <div className="flex flex-col flex-1 min-w-0 justify-center">
                              <h4 className="text-[13px] sm:text-[14px] font-semibold text-slate-800 truncate pr-2 capitalize">
                                {isRentFund ? 'Rent Fund' : String(tx.category) === 'coo_manual_portfolio' ? 'Capital Injection' : String(tx.category).replace(/_/g, ' ')}
                              </h4>
                              <p className="text-[11px] sm:text-[12px] text-slate-500 truncate mt-0.5 pr-2">
                                <span className="font-semibold" style={{ color: txColor }}>{txSymbol}{tx.amount.toLocaleString()} UGX</span> - <span className="capitalize">{tx.description}</span>
                              </p>
                              <p className="text-[10px] sm:text-[11px] font-normal text-slate-400 mt-1">
                                {tx.date} • <span className="uppercase font-mono text-[9px]">{tx.ref}</span>
                              </p>
                            </div>

                            {/* Far Right (Status Indicator matching the '...' placement) */}
                            <div className="flex flex-shrink-0 pl-2">
                              <div className={`p-1.5 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100`} style={{ color: txColor }} title={formatStatus(tx.status)}>
                                <StatusIcon status={tx.status} />
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 flex-wrap gap-4">
                  <p className="text-xs font-semibold text-slate-500">
                    Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-bold text-slate-900">{filteredTransactions.length}</span> entries
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-[11px] font-bold text-slate-700 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                      Page {currentPage} of {totalPages}
                    </div>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm bg-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>

      {/* Deposit Modal (Simple Simulation) */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-slate-900">Add Funds (Deposit)</h3>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Amount (UGX)</label>
                <input 
                  type="number" 
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder="Enter amount..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all" 
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Source Account (Depositing From)</label>
                {payoutMethods.length === 0 ? (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-orange-800 mb-2">No Verified Accounts Found</p>
                    <p className="text-[10px] text-orange-600 mb-3">You must add a verified mobile money or bank account to use for deposits.</p>
                    <Link to="/funder/account" className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg hover:bg-orange-700 transition">Go to Settings</Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {payoutMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedDepositPayoutId(method.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${selectedDepositPayoutId === method.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)]' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                      >
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 shrink-0 shadow-sm border border-slate-200 overflow-hidden">
                             {method.provider === 'MTN' || method.provider.toLowerCase().includes('mtn') ? (
                               <img src="/mtn.png" alt="MTN" className="w-full h-full object-cover" />
                             ) : method.provider === 'Airtel' || method.provider.toLowerCase().includes('airtel') ? (
                               <img src="/airtel.png" alt="Airtel" className="w-full h-full object-cover" />
                             ) : (
                               <Phone className="w-4 h-4" />
                             )}
                           </div>
                           <div className="text-left">
                             <p className="text-xs font-bold text-slate-900">{method.provider}</p>
                             <p className="text-[10px] font-semibold text-slate-500">{method.account_name} • {method.account_number}</p>
                           </div>
                         </div>
                         {method.is_primary && (
                           <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">Primary</span>
                         )}
                      </button>
                    ))}
                  </div>
                )}
                
                {selectedDepositPayoutId && payoutMethods.find((m) => m.id === selectedDepositPayoutId)?.provider === 'Bank' && (
                  <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-3 text-xs font-semibold text-purple-700 leading-relaxed">
                    <p className="font-black text-purple-900 mb-1">Bank Transfer Guidelines</p>
                    <p>Please initiate the transfer from your bank account ending in <span className="font-black">{payoutMethods.find((m) => m.id === selectedDepositPayoutId)?.account_number?.slice(-4)}</span> to our Welile Housing Ltd account and provide the reference ID below.</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  {selectedDepositPayoutId && payoutMethods.find((m) => m.id === selectedDepositPayoutId)?.provider === 'Bank' ? 'Bank Reference / Transaction ID' : 'Transaction ID (TID) *'}
                </label>
                <input 
                  type="text" 
                  value={depositTid}
                  onChange={e => setDepositTid(e.target.value)}
                  placeholder={selectedDepositPayoutId && payoutMethods.find((m) => m.id === selectedDepositPayoutId)?.provider === 'Bank' ? 'e.g. TRF20261803XXXX' : 'e.g. 153839202'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all" 
                />
                <p className="text-[10px] font-semibold text-slate-500 mt-2">Min deposit: UGX 100,000. Required for manager verification.</p>
              </div>

              <button 
                onClick={handleDepositSubmit}
                disabled={isSubmittingDeposit || payoutMethods.length === 0}
                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black transition-colors shadow-md mt-4 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmittingDeposit ? 'VERIFYING...' : 'SUBMIT FOR VERIFICATION'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-900">Withdraw Funds</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Avail: UGX {stats?.availableLiquid.toLocaleString() || '0'}</p>
              </div>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Amount (UGX)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 text-left py-3 font-bold text-slate-900 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all" 
                  />
                  <button 
                    onClick={() => setWithdrawAmount((stats?.availableLiquid || 0).toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-[var(--color-primary)] bg-[var(--color-primary-faint)] px-2 py-1 rounded-md hover:bg-purple-100"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Destination Payout Method</label>
                {payoutMethods.length === 0 ? (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-orange-800 mb-2">No Verified Methods Found</p>
                    <p className="text-[10px] text-orange-600 mb-3">You must add a verified mobile money or bank account before withdrawing.</p>
                    <Link to="/funder/account" className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg hover:bg-orange-700 transition">Go to Settings</Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {payoutMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayoutId(method.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${selectedPayoutId === method.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint)]' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                      >
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 shrink-0 shadow-sm border border-slate-200 overflow-hidden">
                             {method.provider === 'MTN' || method.provider.toLowerCase().includes('mtn') ? (
                               <img src="/mtn.png" alt="MTN" className="w-full h-full object-cover" />
                             ) : method.provider === 'Airtel' || method.provider.toLowerCase().includes('airtel') ? (
                               <img src="/airtel.png" alt="Airtel" className="w-full h-full object-cover" />
                             ) : (
                               <Phone className="w-4 h-4" />
                             )}
                           </div>
                           <div className="text-left">
                             <p className="text-xs font-bold text-slate-900">{method.provider}</p>
                             <p className="text-[10px] font-semibold text-slate-500">{method.account_name} • {method.account_number}</p>
                           </div>
                         </div>
                         {method.is_primary && (
                           <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">Primary</span>
                         )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={handleWithdrawSubmit}
                disabled={isSubmittingWithdraw || payoutMethods.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black transition-colors shadow-md mt-4 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isSubmittingWithdraw ? (
                  'PROCESSING...'
                ) : (
                  <>CONFIRM WITHDRAWAL <ArrowRightLeft className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Transfer Funds</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Move your capital securely</p>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Transfer Tabs */}
              <div className="flex bg-slate-50 p-1 rounded-xl mb-4 gap-1">
                <button
                  onClick={() => setTransferType('internal')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${transferType === 'internal' ? 'bg-white shadow-sm border border-slate-200 text-[var(--color-primary)]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Wallet className="w-4 h-4" /> Internal Wallet
                </button>
                <button
                  onClick={() => setTransferType('p2p')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${transferType === 'p2p' ? 'bg-white shadow-sm border border-slate-200 text-[var(--color-primary)]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Users className="w-4 h-4" /> Send to User
                </button>
              </div>

              {transferType === 'internal' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Source Wallet</label>
                  <select
                    value={transferSourceBucket}
                    onChange={(e) => setTransferSourceBucket(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all mb-4"
                  >
                    {stats?.verifiedPersonas?.map(p => p.toUpperCase()).includes('AGENT') && (
                      <option value="commission">Agent Commission (UGX {stats?.walletBuckets?.find(b => b.type === 'commission')?.balance?.toLocaleString() || 0})</option>
                    )}
                    <option value="savings">Savings Vault (UGX {stats?.walletBuckets?.find(b => b.type === 'savings')?.balance?.toLocaleString() || 0})</option>
                  </select>
                  <p className="text-[10px] text-slate-500 font-medium mb-4 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Funds will route directly into your <span className="text-slate-700 font-semibold">Available Liquidity</span> bucket.</span>
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Recipient Email or Phone</label>
                  <input
                    type="text"
                    value={transferTargetIdentifier}
                    onChange={(e) => setTransferTargetIdentifier(e.target.value)}
                    placeholder="Enter email or phone..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all mb-4"
                  />
                  <p className="text-[10px] text-slate-500 font-medium mb-4 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Instantly send money to any actively registered RentFlowInsight user.</span>
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Amount (UGX)</label>
                <input 
                  type="number" 
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Enter amount..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all" 
                />
              </div>

              <button 
                onClick={handleTransferSubmit}
                disabled={isSubmittingTransfer}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:opacity-90 text-white py-4 rounded-xl font-semibold transition-all shadow-md mt-6 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isSubmittingTransfer ? 'PROCESSING...' : 'Confirm Transfer Funds'}
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      <FunderBottomNav activePage="Wallet" />
    </div>
  );
}
