import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Home, Calendar, Clock, DollarSign, Target, Loader2 } from 'lucide-react';
import { getFunderPortfolioDetails } from '../services/funderApi';

interface VirtualHouse {
  id: string;
  code: string;
  rentAmount: number;
  location: string;
  assignedDate: string;
  status: 'active' | 'pending';
  imageUrl: string;
}

export default function FunderPortfolioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const res = await getFunderPortfolioDetails(id);
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load portfolio details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  const { portfolioInfo, payoutHistory, virtualHouses } = data;

  const currentValue = portfolioInfo.investmentAmount + portfolioInfo.totalRoiEarned;
  const isGrowthPositive = portfolioInfo.todayGrowth >= 0;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Navigation */}
        <button
          onClick={() => navigate('/funder/portfolio')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[var(--color-primary)] transition-colors mb-4"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Back to Portfolios
        </button>

        {/* Portfolio Hero Card */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {portfolioInfo.portfolioName}
              </h1>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="font-bold text-slate-400">{portfolioInfo.portfolioCode}</span>
              <span className="text-slate-300">•</span>
              <span>Pool Contribution: UGX {portfolioInfo.investmentAmount.toLocaleString()}</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-[20px] p-5 lg:p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ROI Mode</p>
              <p className="font-bold text-slate-900">{portfolioInfo.roiMode}</p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-5 lg:p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration Left</p>
              <p className="font-bold text-slate-900">{portfolioInfo.durationLeft}</p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-5 lg:p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Next Payout</p>
              <p className="font-bold text-slate-900">{portfolioInfo.nextPayout}</p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-5 lg:p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Profit</p>
              <p className="font-bold text-slate-900">UGX {portfolioInfo.totalRoiEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Virtual Houses List */}
        <div className="mt-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Home className="w-6 h-6 text-[var(--color-primary)]" />
                Virtual Properties
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Anonymized rent deals currently active under this portfolio's pool allocation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {virtualHouses.map((vh: VirtualHouse) => (
              <div key={vh.id} className="bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-48 overflow-hidden relative border-b border-slate-100">
                  <img src={vh.imageUrl} alt={vh.location} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-white/90 ${vh.status === 'active' ? 'text-emerald-700' : 'text-orange-600'}`}>
                      {vh.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-lg mb-1">{vh.code}</h3>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        {vh.location}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Assigned Value</p>
                      <p className="font-bold text-[var(--color-primary)]">UGX {vh.rentAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Assigned On</p>
                      <p className="font-bold text-slate-700">{vh.assignedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Payout History Section */}
        <div className="mt-10">
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
    </div>
  );
}
