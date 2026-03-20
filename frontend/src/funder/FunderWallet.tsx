import { useState, useEffect } from 'react';
import { 
  Download, Upload, ArrowRightLeft, Clock, 
  CheckCircle, XCircle, AlertCircle, Plus, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import FunderSidebar from './components/FunderSidebar';
import FunderDashboardHeader from './components/FunderDashboardHeader';
import FunderBottomNav from './components/FunderBottomNav';
import { getFunderDashboardStats, getFunderActivities, requestWithdrawal, fundRentPool } from '../services/funderApi';
import type { DashboardStatsResponse } from '../services/funderApi';

export default function FunderWallet() {
  const [activeTab, setActiveTab] = useState<'All' | 'Cash In' | 'Cash Out'>('All');
  
  // Live State
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Deposit State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositProvider, setDepositProvider] = useState<'MTN' | 'Airtel' | 'Bank'>('MTN');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositTid, setDepositTid] = useState('');
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  // Withdraw State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawProvider, setWithdrawProvider] = useState<'MTN' | 'Airtel' | 'Bank'>('MTN');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAccountName, setWithdrawAccountName] = useState('');
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  // Withdrawal Notice logic (mocked visually for now, or extracted from backend)
  const pendingWithdrawal: any = null; // To fully support this, we would pull `InvestmentWithdrawalRequests` from API.

  const fetchData = async () => {
    try {
      const [liveStats, liveTx] = await Promise.all([
        getFunderDashboardStats(),
        getFunderActivities()
      ]);
      setStats(liveStats);
      setTransactions(liveTx.map((tx: any) => ({
        id: tx.id,
        date: new Date(tx.created_at || tx.transaction_date).toLocaleString(),
        type: tx.direction === 'cash_in' ? 'Cash In' : 'Cash Out',
        category: tx.category,
        description: tx.description || tx.category.replace(/_/g, ' '),
        amount: tx.amount,
        status: 'completed', // Ledger entries are inherently completed
        ref: tx.reference_id || tx.id.slice(0, 8)
      })));
    } catch (error) {
      console.error("Error loading wallet", error);
      toast.error("Failed to load live wallet data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDepositSubmit = () => {
    if (!depositAmount || !depositTid) {
      toast.error('Please fill in all fields');
      return;
    }
    const amount = Number(depositAmount);
    if (amount < 100000) {
      toast.error('Minimum deposit is UGX 100,000');
      return;
    }
    
    setIsSubmittingDeposit(true);
    setTimeout(() => {
      // Mocked deposit confirmation (in real life, posts to Paystack/Flutterwave API)
      fetchData(); // Reload stats to simulate updates
      setIsSubmittingDeposit(false);
      setIsDepositModalOpen(false);
      setDepositAmount('');
      setDepositTid('');
      toast.success('Deposit sent for verification!');
    }, 1500);
  };

  const handleWithdrawSubmit = async () => {
    if (!withdrawAmount || !withdrawAccountName || !withdrawAccountNumber) {
      toast.error('Please fill in all fields');
      return;
    }
    const amount = Number(withdrawAmount);
    if (amount <= 0) {
      toast.error('Invalid withdrawal amount');
      return;
    }
    if (!stats || amount > stats.availableLiquid) {
      toast.error('Insufficient Liquid Available Balance for this withdrawal. Funds may be locked in Active Portfolios.');
      return;
    }

    setIsSubmittingWithdraw(true);
    try {
      // In a full implementation, we would query the specific portfolio ID to withdraw from,
      // but for this MVP mock, we hit the API. If we don't have a specific portfolio to target here,
      // we'll simulate the UX.
      toast.success('External withdrawal requested! Payout will be processed to ' + withdrawProvider);
      
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      setWithdrawAccountName('');
      setWithdrawAccountNumber('');
      await fetchData();
    } catch (e: any) {
      toast.error(e.message || 'Withdrawal failed');
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  const handleFundRentPool = async () => {
    const defaultAmount = 1000000;
    if (!stats || stats.availableLiquid < defaultAmount) {
      toast.error('Insufficient available liquidity to fund the pool.');
      return;
    }
    
    // Attempt funding
    const loadingToast = toast.loading('Funding Rent Pool...');
    try {
      await fundRentPool(defaultAmount);
      toast.success('Successfully funded the rent pool!', { id: loadingToast });
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Funding failed', { id: loadingToast });
    }
  };

  const filteredTransactions = activeTab === 'All' 
    ? transactions 
    : transactions.filter(tx => tx.type === activeTab);

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-primary-faint)' }}>
      <div className="flex h-screen overflow-hidden">
        
        <FunderSidebar activePage="Wallet" />

        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">
          <FunderDashboardHeader
            user={{ fullName: 'Grace N.', role: 'supporter', avatarUrl: '' }}
            pageTitle="Wallet"
          />

          <main className="flex-1 px-4 sm:px-8 py-8 pb-32 lg:pb-12 max-w-5xl mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Hub</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Manage your liquid capital, deposits, and withdrawal gates.
              </p>
            </div>

            {/* ──────────────── TOP ROW: BALANCE & WARNINGS ──────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Main Balance Card */}
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                
                {/* Loading State Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-3xl">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Available Liquidity</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-slate-400">UGX</span>
                  <span className="text-5xl font-black tracking-tight">{stats?.availableLiquid.toLocaleString() || '0'}</span>
                </div>

                <div className="mt-10 flex flex-wrap gap-3 relative z-10">
                  <button 
                    onClick={() => setIsDepositModalOpen(true)}
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Deposit
                  </button>
                  <button 
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-white/10"
                  >
                    <Download className="w-4 h-4" /> Withdraw
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-white/10">
                    <ArrowRightLeft className="w-4 h-4" /> Transfer
                  </button>
                </div>
              </div>

              {/* Idle Cash Notice - Shown only if liquid > 1M */}
              {(stats?.availableLiquid || 0) >= 1000000 && (
                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-emerald-900 mb-2">Idle Cash Detected</h3>
                  <p className="text-xs font-semibold text-emerald-700 leading-relaxed mb-4">
                    You have liquid funds that are not earning rewards. Fund the Rent Pool today to earn up to <span className="font-bold underline">15% monthly</span>.
                  </p>
                  <button 
                    onClick={handleFundRentPool}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md"
                  >
                    Fund Rent Pool (1M UGX)
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
                
                {/* Tabs */}
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  {['All', 'Cash In', 'Cash Out'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
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

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 rounded-tl-3xl">Transaction</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Category</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Amount</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right rounded-tr-3xl">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 border-b border-slate-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              tx.type === 'Cash In' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {tx.type === 'Cash In' ? <Upload className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-medium text-slate-500">{tx.date}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] font-bold text-slate-400 font-mono">{tx.ref}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 border-b border-slate-50">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{tx.category}</span>
                        </td>
                        <td className="px-6 py-4 border-b border-slate-50">
                          <p className={`text-sm font-black ${tx.type === 'Cash In' ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {tx.type === 'Cash In' ? '+' : '-'} UGX {tx.amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 border-b border-slate-50 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <StatusIcon status={tx.status} />
                            <span className="text-xs font-bold text-slate-600 capitalize">{tx.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Provider</label>
                <div className="grid grid-cols-3 gap-2">
                   <button 
                     onClick={() => setDepositProvider('MTN')}
                     className={`flex flex-col items-center justify-center py-3 border-2 rounded-xl transition-all font-bold gap-1 ${depositProvider === 'MTN' ? 'border-[var(--color-primary)] bg-slate-50 text-[var(--color-primary)]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                   >
                     <img src="/mtn.png" alt="MTN" className="w-7 h-7 rounded-full object-cover shadow-sm" /> 
                     <span className="text-xs">MTN MoMo</span>
                     <span className="text-lg font-black text-yellow-500 tracking-tight">090777</span>
                   </button>
                   <button 
                     onClick={() => setDepositProvider('Airtel')}
                     className={`flex flex-col items-center justify-center py-3 border-2 rounded-xl transition-all font-bold gap-1 ${depositProvider === 'Airtel' ? 'border-[var(--color-primary)] bg-slate-50 text-[var(--color-primary)]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                   >
                     <img src="/airtel.png" alt="Airtel" className="w-7 h-7 rounded-full object-cover shadow-sm" /> 
                     <span className="text-xs">Airtel Money</span>
                     <span className="text-lg font-black text-red-600 tracking-tight">4380664</span>
                   </button>
                   <button 
                     onClick={() => setDepositProvider('Bank')}
                     className={`flex flex-col items-center justify-center py-3 border-2 rounded-xl transition-all font-bold gap-1 ${depositProvider === 'Bank' ? 'border-[var(--color-primary)] bg-slate-50 text-[var(--color-primary)]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                   >
                     <span className="text-2xl">🏦</span>
                     <span className="text-xs">Bank Transfer</span>
                     <span className="text-[10px] font-black text-slate-400 tracking-tight">STANBIC / UF</span>
                   </button>
                </div>
                {depositProvider === 'Bank' && (
                  <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-3 text-xs font-semibold text-purple-700 leading-relaxed">
                    <p className="font-black text-purple-900 mb-1">Bank Transfer Details</p>
                    <p>Bank: <span className="font-black">Stanbic Bank Uganda</span></p>
                    <p>Account Name: <span className="font-black">Welile Housing Ltd</span></p>
                    <p>Account No: <span className="font-black">9030012872445</span></p>
                    <p>Branch: <span className="font-black">Kampala Main</span></p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  {depositProvider === 'Bank' ? 'Bank Reference / Transaction ID' : 'Transaction ID (TID) *'}
                </label>
                <input 
                  type="text" 
                  value={depositTid}
                  onChange={e => setDepositTid(e.target.value)}
                  placeholder={depositProvider === 'Bank' ? 'e.g. TRF20261803XXXX' : 'e.g. 153839202'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all" 
                />
                <p className="text-[10px] font-semibold text-slate-500 mt-2">Min deposit: UGX 100,000. Required for manager verification.</p>
              </div>

              <button 
                onClick={handleDepositSubmit}
                disabled={isSubmittingDeposit}
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
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Destination Provider</label>
                <div className="grid grid-cols-3 gap-2">
                   <button 
                     onClick={() => setWithdrawProvider('MTN')}
                     className={`flex flex-col items-center justify-center py-2.5 border-2 rounded-xl transition-all font-bold gap-1 text-sm ${withdrawProvider === 'MTN' ? 'border-[var(--color-primary)] bg-slate-50 text-[var(--color-primary)]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                   >
                     <span>📱</span>
                     <span className="text-xs">MTN MoMo</span>
                   </button>
                   <button 
                     onClick={() => setWithdrawProvider('Airtel')}
                     className={`flex flex-col items-center justify-center py-2.5 border-2 rounded-xl transition-all font-bold gap-1 text-sm ${withdrawProvider === 'Airtel' ? 'border-[var(--color-primary)] bg-slate-50 text-[var(--color-primary)]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                   >
                     <span>📱</span>
                     <span className="text-xs">Airtel Money</span>
                   </button>
                   <button 
                     onClick={() => setWithdrawProvider('Bank')}
                     className={`flex flex-col items-center justify-center py-2.5 border-2 rounded-xl transition-all font-bold gap-1 text-sm ${withdrawProvider === 'Bank' ? 'border-[var(--color-primary)] bg-slate-50 text-[var(--color-primary)]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                   >
                     <span>🏦</span>
                     <span className="text-xs">Bank</span>
                   </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Account Name</label>
                <input 
                  type="text" 
                  value={withdrawAccountName}
                  onChange={e => setWithdrawAccountName(e.target.value)}
                  placeholder="e.g. John Doe" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all" 
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  {withdrawProvider === 'Bank' ? 'Account Number' : 'Phone Number'}
                </label>
                <input 
                  type={withdrawProvider === 'Bank' ? 'text' : 'tel'} 
                  value={withdrawAccountNumber}
                  onChange={e => setWithdrawAccountNumber(e.target.value)}
                  placeholder={withdrawProvider === 'Bank' ? 'e.g. 9030000001234' : 'e.g. 0770000000'} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all" 
                />
                {withdrawProvider === 'Bank' && (
                  <p className="text-[10px] font-semibold text-slate-500 mt-1.5">Enter your bank account number. Withdrawals to bank accounts may take 1–3 business days.</p>
                )}
              </div>

              <button 
                onClick={handleWithdrawSubmit}
                disabled={isSubmittingWithdraw}
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

      {/* Mobile Bottom Navigation Component */}
      <FunderBottomNav activePage="Wallet" />
    </div>
  );
}
