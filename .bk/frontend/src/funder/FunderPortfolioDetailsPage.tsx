import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Calendar, Clock, DollarSign, Target, Loader2, Plus, RefreshCw, CheckCircle, Edit2, X, Check, AlertCircle, ArrowUpRight } from 'lucide-react';
import { getFunderPortfolioDetails, getFunderDashboardStats, topupFunderPortfolio, updatePortfolioDetails, requestWithdrawal } from '../services/funderApi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import SharePortfolioDropdown from './components/SharePortfolioDropdown';

export default function FunderPortfolioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isSubmittingTopUp, setIsSubmittingTopUp] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [processingText, setProcessingText] = useState('Processing...');

  // New Part A State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [isUpdatingRoi, setIsUpdatingRoi] = useState(false);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    if (isSubmittingTopUp || isSubmittingWithdraw) {
      const texts = ['Processing...', 'Contacting Ledger...', 'Just a moment...'];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setProcessingText(texts[i]);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setProcessingText('Processing...');
    }
  }, [isSubmittingTopUp, isSubmittingWithdraw]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const [res, stats] = await Promise.all([
            getFunderPortfolioDetails(id),
            getFunderDashboardStats()
          ]);
          setData(res);
          setWalletBalance(stats.availableLiquid || 0);
          setEditedName(res.portfolioInfo.assetName);
        }
      } catch (err) {
        console.error('Failed to load portfolio details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const submitTopUp = async () => {
    if (!data?.portfolioInfo?.portfolioCode) return;
    setIsSubmittingTopUp(true);
    try {
      await topupFunderPortfolio(data.portfolioInfo.portfolioCode, Number(topUpAmount));

      const [res, stats] = await Promise.all([getFunderPortfolioDetails(id!), getFunderDashboardStats()]);
      setData(res);
      setWalletBalance(stats.availableLiquid || 0);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowTopUpModal(false);
        setTopUpAmount('');
      }, 2500);

    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingTopUp(false);
    }
  };

  const submitWithdraw = async () => {
    setIsSubmittingWithdraw(true);
    try {
      // By default the controller was looking for portfolio_id. We're intercepting it via code if needed,
      // but let's pass the raw `id` from the URL, which is the code. 
      // If the backend strictly wants GUID, the controller needs patching to accept either. I'll pass data.portfolioInfo.id if available, fallback to `id`.
      await requestWithdrawal(data.portfolioInfo.id || id as string, Number(withdrawAmount));

      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        navigate('/funder/portfolio'); // After 90 day notice, might wanna take them back to home
      }, 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || editedName === data.portfolioInfo.assetName) {
      setIsEditingName(false);
      return;
    }
    setIsUpdatingName(true);
    try {
      await updatePortfolioDetails(data.portfolioInfo.portfolioCode, { account_name: editedName });
      setData((prev: any) => ({
        ...prev,
        portfolioInfo: { ...prev.portfolioInfo, assetName: editedName }
      }));
      setIsEditingName(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleToggleRoiMode = async () => {
    setIsUpdatingRoi(true);
    try {
      const newMode = data.portfolioInfo.roiMode === 'Monthly Compounding' ? 'monthly_payout' : 'monthly_compounding';
      await updatePortfolioDetails(data.portfolioInfo.portfolioCode, { roi_mode: newMode });

      const [res, stats] = await Promise.all([getFunderPortfolioDetails(id!), getFunderDashboardStats()]);
      setData(res);
      setWalletBalance(stats.availableLiquid || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingRoi(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-50 min-h-screen p-8 flex flex-col items-center justify-center pb-32">
        <h2 className="text-xl font-bold text-slate-400 mb-4">Portfolio Not Found</h2>
        <button onClick={() => navigate('/funder/portfolio')} className="px-6 py-2 rounded-xl text-sm font-bold border-2 transition-all hover:shadow-md border-[var(--color-primary)] text-[var(--color-primary)]">
          Back to Portfolios
        </button>
      </div>
    );
  }

  const { portfolioInfo, payoutHistory } = data;

  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text(`Portfolio Performance Ledger`, 14, 20);

      doc.setFontSize(14);
      doc.setTextColor(100, 116, 139);
      doc.text(`Code: ${portfolioInfo.portfolioCode}`, 14, 30);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Initial Capital: UGX ${portfolioInfo.investedAmount.toLocaleString()}`, 14, 45);
      doc.text(`Total Accumulation: UGX ${portfolioInfo.totalEarned.toLocaleString()}`, 14, 52);
      doc.text(`Expected Total: UGX ${portfolioInfo.expectedTotal.toLocaleString()}`, 14, 59);
      doc.text(`Maturity Date: ${portfolioInfo.maturityDate}`, 14, 66);
      doc.text(`Next Payout: ${portfolioInfo.nextPayout || 'N/A'}`, 14, 73);

      const isGrowthPositive = portfolioInfo.todayGrowth > 0;
      doc.text(`Daily Yield Pace: ${isGrowthPositive ? '+' : ''}${portfolioInfo.todayGrowth.toLocaleString()} UGX / Day`, 14, 80);

      const tableData = payoutHistory.map((tx: any) => [
        new Date(tx.date).toLocaleDateString(),
        tx.type,
        `UGX ${tx.amount.toLocaleString()}`,
        tx.status
      ]);

      if (tableData.length > 0) {
        doc.text(`Payout History Log`, 14, 90);
        autoTable(doc, {
          startY: 95,
          head: [['Date', 'Type', 'Amount', 'Status']],
          body: tableData,
          theme: 'striped',
          styles: { fontSize: 10, cellPadding: 5 },
          headStyles: { fillColor: [59, 130, 246] }
        });
      } else {
        doc.text(`No transactions recorded.`, 14, 90);
      }

      doc.save(`Portfolio_${portfolioInfo.portfolioCode}_Report.pdf`);
    } catch (error) {
      console.error('PDF Engine Error:', error);
    }
  };

  const currentValue = portfolioInfo.investedAmount + portfolioInfo.totalEarned;
  const isGrowthPositive = portfolioInfo.todayGrowth >= 0;

  // Lifecycle calculations
  const createdDate = new Date(portfolioInfo.createdDate || Date.now() - 30 * 24 * 60 * 60 * 1000); // Hack if missing
  const matDate = new Date(portfolioInfo.maturityDate);
  const now = new Date();

  const totalDuration = matDate.getTime() - createdDate.getTime();
  const elapsed = Math.max(0, now.getTime() - createdDate.getTime());
  let progressPercentage = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;
  if (progressPercentage > 100) progressPercentage = 100;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6" id="portfolio-pdf-content">

        {/* Header Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <button
            onClick={() => navigate('/funder/portfolio')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[var(--color-primary)] transition-colors w-fit"
            data-html2canvas-ignore="true"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to Portfolios
          </button>

          <div className="flex items-center gap-3" data-html2canvas-ignore="true">
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2.5 font-bold text-sm bg-white border-2 border-slate-200 text-slate-600 rounded-xl hover:border-slate-300 transition flex items-center gap-2 shadow-sm"
            >
              Withdraw
            </button>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-4 py-2.5 font-bold text-sm bg-white border-2 border-slate-200 text-[var(--color-primary)] rounded-xl hover:border-[var(--color-primary)] transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Funds
            </button>
            <SharePortfolioDropdown
              portfolioCode={portfolioInfo.portfolioCode}
              shareUrl={`${window.location.origin}/investor/portfolio/${portfolioInfo.portfolioCode}`}
              onPdfDownload={handleExportPDF}
            />
          </div>
        </div>

        {/* Portfolio Hero Card */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-4 lg:p-5 flex flex-col justify-between items-start gap-4">
          <div className="flex flex-col lg:flex-row justify-between w-full items-start lg:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={e => setEditedName(e.target.value)}
                      className="text-2xl font-black text-slate-900 tracking-tight bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 outline-none focus:border-purple-500"
                      autoFocus
                    />
                    <button onClick={handleSaveName} disabled={isUpdatingName} className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition">
                      {isUpdatingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { setIsEditingName(false); setEditedName(portfolioInfo.assetName); }} disabled={isUpdatingName} className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group">
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
                      {portfolioInfo.assetName}
                    </h1>
                    <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-[var(--color-primary)] transition bg-slate-50 rounded-lg">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider ml-1">
                      Active
                    </span>
                  </div>
                )}
              </div>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <span className="font-bold text-slate-400">{portfolioInfo.portfolioCode}</span>
                <span className="text-slate-300">•</span>
                <span>Pool Contribution: UGX {portfolioInfo.investedAmount.toLocaleString()}</span>
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end w-full lg:w-auto p-4 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Value</p>
              <p className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-1.5">
                UGX {currentValue.toLocaleString()}
              </p>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${isGrowthPositive ? 'bg-emerald-100/50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                <TrendingUp className="w-3.5 h-3.5" />
                +{portfolioInfo.todayGrowth.toLocaleString()} UGX Today
              </div>
            </div>
          </div>

          {/* Lifecycle Progress Circular Indicator */}
          <div className="w-full mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-0.5">Lifecycle Progress</p>
              <p className="text-xs font-medium text-slate-500">Solid track to maturity</p>
            </div>

            {/* Circular Progress SVG */}
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="28"
                  className="stroke-slate-100"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32" cy="32" r="28"
                  className="stroke-[var(--color-primary)] transition-all duration-1000 ease-out"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray="175.93"
                  strokeDashoffset={175.93 - (175.93 * progressPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900 tracking-tighter">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col items-start lg:items-center text-left lg:text-center gap-3 lg:col-span-2 relative overflow-hidden">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-0.5">ROI Strategy</p>
                <p className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{portfolioInfo.roiMode}</p>
              </div>
            </div>
            <button
              onClick={handleToggleRoiMode}
              disabled={isUpdatingRoi}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-lg transition border border-slate-200 flex items-center justify-center gap-2"
            >
              {isUpdatingRoi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Toggle Strategy
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">Next Payout</p>
              <p className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{portfolioInfo.nextPayout || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">Matures On</p>
              <p className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{portfolioInfo.maturityDate}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center gap-3 lg:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex flex-1 justify-between items-center">
              <div className="min-w-0 text-left pr-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Total Profit</p>
                <p className="font-black text-emerald-600 text-[13px] sm:text-sm tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">+ UGX {portfolioInfo.totalEarned.toLocaleString()}</p>
              </div>
              <div className="w-px h-8 bg-slate-100 mx-1 lg:mx-2 shrink-0" />
              <div className="text-right min-w-0 pl-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Expected Est.</p>
                <p className="font-bold text-slate-900 text-[13px] sm:text-sm tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">UGX {portfolioInfo.expectedTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout History Section */}
        <div className="mt-4 pt-4 border-t-2 border-slate-100/50">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                Payout History
              </h2>
              <p className="text-sm text-slate-500 mt-0.5 font-medium">Record of returns generated by this portfolio.</p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payoutHistory.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 text-sm">{tx.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-[var(--color-primary)]">
                          <TrendingUp className="w-3.5 h-3.5" /> {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-600">UGX {tx.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {payoutHistory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* TOP-UP MODAL */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowTopUpModal(false)} />
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative flex flex-col overflow-hidden animate-fadeInUp">

            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[var(--color-primary)]" /> Add Funds
                </h3>
                <p className="text-xs text-slate-500 font-medium tracking-wide mt-1 uppercase">Portfolio {portfolioInfo.portfolioCode}</p>
              </div>
              <button onClick={() => setShowTopUpModal(false)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300 transition">✕</button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <div className="py-10 flex flex-col items-center justify-center text-center animate-fadeInUp">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 animate-scaleIn" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Funds Added Successfully!</h3>
                  <p className="text-sm font-medium text-slate-500">Your capital has been securely injected into the portfolio.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Available Wallet Balance</span>
                    <span className="font-black text-slate-900">UGX {walletBalance.toLocaleString()}</span>
                  </div>

                  <div className="mb-6">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Top-up Amount (UGX)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 px-4 text-slate-900 font-black text-lg focus:outline-none focus:border-[var(--color-primary)] transition"
                    />
                  </div>

                  {Number(topUpAmount) > walletBalance && (
                    <p className="text-xs font-bold text-red-500 bg-red-50 py-2.5 px-3 rounded-xl border border-red-100 uppercase tracking-wide mb-6 flex items-center text-center justify-center">
                      ⚠ Insufficient available balance
                    </p>
                  )}

                  <button
                    onClick={submitTopUp}
                    disabled={isSubmittingTopUp || !topUpAmount || Number(topUpAmount) <= 0 || Number(topUpAmount) > walletBalance}
                    className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${isSubmittingTopUp
                        ? 'bg-purple-100 text-purple-700 cursor-not-allowed shadow-inner'
                        : (!topUpAmount || Number(topUpAmount) <= 0 || Number(topUpAmount) > walletBalance)
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'text-white shadow-md hover:-translate-y-[1px] hover:shadow-lg'
                      }`}
                    style={(!isSubmittingTopUp && topUpAmount && Number(topUpAmount) > 0 && Number(topUpAmount) <= walletBalance) ? { background: 'var(--color-primary)' } : undefined}
                  >
                    {isSubmittingTopUp ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                        <span className="animate-pulse">{processingText}</span>
                      </>
                    ) : 'Confirm Top-Up'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)} />
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative flex flex-col overflow-hidden animate-fadeInUp">

            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-slate-700" /> Withdraw Capital
                </h3>
                <p className="text-xs text-slate-500 font-medium tracking-wide mt-1 uppercase">Portfolio {portfolioInfo.portfolioCode}</p>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300 transition">✕</button>
            </div>

            <div className="p-6">
              {withdrawSuccess ? (
                <div className="py-10 flex flex-col items-center justify-center text-center animate-fadeInUp">
                  <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 animate-scaleIn" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">90-Day Notice Submitted</h3>
                  <p className="text-sm font-medium text-slate-500">Your withdrawal request is logged. Rewards are paused and funds will clear in 90 days.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 bg-amber-50 p-3 sm:p-4 rounded-xl border border-amber-100 flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] sm:text-xs font-bold text-amber-900 leading-normal">
                      Withdrawing capital early triggers a strict 90-day liquidity lock. Your portfolio will stop generating ROI immediately, and funds will be released to your wallet on {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Withdraw Amount (UGX)</label>
                      <button onClick={() => setWithdrawAmount(portfolioInfo.investedAmount.toString())} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">Max</button>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 px-4 text-slate-900 font-black text-lg focus:outline-none focus:border-slate-400 transition"
                    />
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Available to withdraw: UGX {portfolioInfo.investedAmount.toLocaleString()}</p>
                  </div>

                  {Number(withdrawAmount) > portfolioInfo.investedAmount && (
                    <p className="text-xs font-bold text-red-500 bg-red-50 py-2.5 px-3 rounded-xl border border-red-100 uppercase tracking-wide mb-6 flex items-center text-center justify-center">
                      ⚠ Amount exceeds portfolio principal
                    </p>
                  )}

                  <button
                    onClick={submitWithdraw}
                    disabled={isSubmittingWithdraw || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > portfolioInfo.investedAmount}
                    className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${isSubmittingWithdraw
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-inner'
                        : (!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > portfolioInfo.investedAmount)
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'text-white shadow-md hover:-translate-y-[1px] hover:shadow-lg'
                      }`}
                    style={(!isSubmittingWithdraw && withdrawAmount && Number(withdrawAmount) > 0 && Number(withdrawAmount) <= portfolioInfo.investedAmount) ? { background: 'var(--color-primary)' } : undefined}
                  >
                    {isSubmittingWithdraw ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="animate-pulse">{processingText}</span>
                      </>
                    ) : 'Accept Terms & Withdraw'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
