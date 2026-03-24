import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Calendar, Clock, DollarSign, Target, Loader2, Download, Plus, RefreshCw, CheckCircle } from 'lucide-react';
import { getFunderPortfolioDetails, getFunderDashboardStats, topupFunderPortfolio } from '../services/funderApi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [isExporting, setIsExporting] = useState(false);
  const [processingText, setProcessingText] = useState('Processing...');

  useEffect(() => {
    if (isSubmittingTopUp) {
      const texts = ['Processing...', 'Adding funds to pool...', 'Just a moment...'];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setProcessingText(texts[i]);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setProcessingText('Processing...');
    }
  }, [isSubmittingTopUp]);

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
      
      // Optimistic internal refresh
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
    setIsExporting(true);
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
      
      const isGrowthPositive = portfolioInfo.todayGrowth > 0;
      doc.text(`Daily Yield Pace: ${isGrowthPositive ? '+' : ''}${portfolioInfo.todayGrowth.toLocaleString()} UGX / Day`, 14, 73);

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
    } finally {
      setIsExporting(false);
    }
  };

  const currentValue = portfolioInfo.investedAmount + portfolioInfo.totalEarned;
  const isGrowthPositive = portfolioInfo.todayGrowth >= 0;

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
              onClick={() => setShowTopUpModal(true)} 
              className="px-4 py-2.5 font-bold text-sm bg-white border-2 border-slate-200 text-[var(--color-primary)] rounded-xl hover:border-[var(--color-primary)] transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Funds
            </button>
            <button 
              onClick={handleExportPDF} 
              disabled={isExporting}
              className={`px-4 py-2.5 font-bold text-sm text-white rounded-xl transition flex items-center gap-2 hover:shadow-lg ${isExporting ? 'opacity-80 cursor-not-allowed' : ''}`}
              style={{ background: 'var(--color-primary)' }}
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? 'Exporting...' : 'Export Report'}
            </button>
          </div>
        </div>

        {/* Portfolio Hero Card */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {portfolioInfo.assetName}
              </h1>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="font-bold text-slate-400">{portfolioInfo.portfolioCode}</span>
              <span className="text-slate-300">•</span>
              <span>Pool Contribution: UGX {portfolioInfo.investedAmount.toLocaleString()}</span>
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end w-full lg:w-auto p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Value</p>
            <p className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter mb-2">
              UGX {currentValue.toLocaleString()}
            </p>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${isGrowthPositive ? 'bg-emerald-100/50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              <TrendingUp className="w-4 h-4" />
              +{portfolioInfo.todayGrowth.toLocaleString()} UGX Today
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">ROI Strategy</p>
              <p className="font-bold text-slate-900 text-sm">{portfolioInfo.roiMode.split(' ')[0]}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">Lock Cycle</p>
              <p className="font-bold text-slate-900 text-sm">{portfolioInfo.durationLeft}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">Matures On</p>
              <p className="font-bold text-slate-900 text-sm">{portfolioInfo.maturityDate}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">Auto-Renew</p>
              <p className={`font-bold text-sm ${portfolioInfo.autoRenew ? 'text-emerald-600' : 'text-slate-500'}`}>
                {portfolioInfo.autoRenew ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2 lg:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 mb-1">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex w-full justify-between items-center text-left">
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-0.5">Total Profit</p>
                 <p className="font-black text-emerald-600 text-sm tracking-tight">+ UGX {portfolioInfo.totalEarned.toLocaleString()}</p>
               </div>
               <div className="w-px h-8 bg-slate-100 mx-2" />
               <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-0.5">Expected Est.</p>
                 <p className="font-bold text-slate-900 text-sm tracking-tight">UGX {portfolioInfo.expectedTotal.toLocaleString()}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Payout History Section */}
        <div className="mt-8 pt-8 border-t-2 border-slate-100/50">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-6 h-6 text-[var(--color-primary)]" />
                Payout History
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Record of returns generated by this portfolio.</p>
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
                    className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                      isSubmittingTopUp
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

    </div>
  );
}
