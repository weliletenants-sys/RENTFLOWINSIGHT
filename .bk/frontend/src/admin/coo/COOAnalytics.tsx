import React, { useState, useEffect } from 'react';
import { PieChart, BarChart2, TrendingUp, Calendar, Filter, Loader2, AlertTriangle } from 'lucide-react';
import { fetchAnalytics } from '../../services/cooApi';

const COOAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const result = await fetchAnalytics();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Aggregating analytical trends...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Analytics</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const paymentMethods = data?.paymentMethods || [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-800">Payment Analytics</h2>
          <p className="text-sm text-slate-500">Breakdown of payment channels and collection trends</p>
        </div>
        <div className="flex items-center space-x-2">
           <button className="flex items-center space-x-2 text-slate-600 px-3 py-2 border border-slate-100 rounded-lg hover:bg-slate-50 text-sm font-medium bg-white">
             <Calendar size={16} /> <span>This Month</span>
           </button>
           <button className="flex items-center space-x-2 text-[#6c11d4] px-3 py-2 bg-[#EAE5FF] rounded-lg hover:bg-purple-100 transition text-sm font-bold">
             <Filter size={16} /> <span>Filter</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <PieChart className="text-[#6c11d4] mr-2" size={20} /> Channel Distribution
            </h3>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-6 relative">
             <div className="flex justify-between items-end h-40">
                {/* Dynamically mapped mock chart */}
                {paymentMethods.map((method: any, i: number) => (
                  <div key={method.name} className="flex flex-col items-center justify-end w-1/3 h-full">
                    <div className={`w-16 rounded-t-md ${i===0 ? 'bg-yellow-400' : i===1 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ height: `${method.value}%` }}></div>
                    <span className="text-xs font-bold text-slate-600 mt-2 whitespace-nowrap">{method.name} ({method.value}%)</span>
                  </div>
                ))}
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <p className="text-xs font-bold text-slate-500 uppercase">Top Provider</p>
                 <p className="font-bold text-slate-800">{data?.topProvider || "MTN (Live)"}</p>
               </div>
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <p className="text-xs font-bold text-slate-500 uppercase">Avg Ticket Size</p>
                 <p className="font-bold text-slate-800">{data?.avgTicketSize ? `UGX ${data.avgTicketSize.toLocaleString()}` : "Pending"}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Collection Trend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <TrendingUp className="text-green-600 mr-2" size={20} /> Collection Trendline
            </h3>
          </div>
          <div className="flex-1 space-y-4">
             {/* Abstracted Trend Bar Chart */}
             <div className="space-y-3">
               {data?.revenueTrends?.map((trend: any, i: number) => (
                 <div key={i} className="flex items-center">
                    <span className="w-24 text-xs font-bold text-slate-500">{trend.month}</span>
                    <div className="flex-1 ml-2 bg-slate-100 rounded-full h-3">
                      <div className="bg-[#6c11d4] h-3 rounded-full" style={{ width: `${Math.min(100, (trend.value / 10000000) * 100)}%` }}></div>
                    </div>
                    <span className="w-24 text-right text-xs font-bold text-slate-700 ml-2">UGX {(trend.value / 1000000).toFixed(1)}M</span>
                 </div>
               ))}
               {!data?.revenueTrends?.length && (
                  <p className="text-sm font-medium text-slate-400 py-4 text-center">Awaiting incoming telemetry data...</p>
               )}
             </div>
             
             <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mt-4">
                 <p className="text-sm text-indigo-800 flex items-center">
                  <BarChart2 size={16} className="mr-2" /> Collections are up <strong>&nbsp;{data?.collectionGrowth || 0}%&nbsp;</strong> compared to last month.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default COOAnalytics;
