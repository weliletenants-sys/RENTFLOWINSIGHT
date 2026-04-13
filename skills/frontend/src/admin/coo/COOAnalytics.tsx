import React from 'react';
import { PieChart, BarChart2, TrendingUp, Calendar, Filter } from 'lucide-react';

const COOAnalytics: React.FC = () => {
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
                {/* Mock Bar Chart */}
                <div className="flex flex-col items-center justify-end w-1/3 h-full">
                  <div className="w-16 bg-yellow-400 rounded-t-md" style={{ height: '65%' }}></div>
                  <span className="text-xs font-bold text-slate-600 mt-2 whitespace-nowrap">Mobile (65%)</span>
                </div>
                <div className="flex flex-col items-center justify-end w-1/3 h-full">
                  <div className="w-16 bg-blue-500 rounded-t-md" style={{ height: '28%' }}></div>
                  <span className="text-xs font-bold text-slate-600 mt-2 whitespace-nowrap">Bank (28%)</span>
                </div>
                <div className="flex flex-col items-center justify-end w-1/3 h-full">
                  <div className="w-16 bg-green-500 rounded-t-md" style={{ height: '7%' }}></div>
                  <span className="text-xs font-bold text-slate-600 mt-2 whitespace-nowrap">Cash (7%)</span>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <p className="text-xs font-bold text-slate-500 uppercase">Top Provider</p>
                 <p className="font-bold text-slate-800">MTN MoMo (42%)</p>
               </div>
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <p className="text-xs font-bold text-slate-500 uppercase">Avg Ticket Size</p>
                 <p className="font-bold text-slate-800">UGX 125,000</p>
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
             {/* Mock Line Chart Concept (Using flex rows for visual) */}
             <div className="space-y-3">
               <div className="flex items-center">
                  <span className="w-12 text-xs font-bold text-slate-500">Week 4</span>
                  <div className="flex-1 ml-2 bg-slate-100 rounded-full h-3">
                    <div className="bg-[#6c11d4] h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="w-20 text-right text-xs font-bold text-slate-700 ml-2">UGX 4.2M</span>
               </div>
               <div className="flex items-center">
                  <span className="w-12 text-xs font-bold text-slate-500">Week 3</span>
                  <div className="flex-1 ml-2 bg-slate-100 rounded-full h-3">
                    <div className="bg-[#6c11d4] h-3 rounded-full opacity-80" style={{ width: '65%' }}></div>
                  </div>
                  <span className="w-20 text-right text-xs font-bold text-slate-700 ml-2">UGX 3.1M</span>
               </div>
               <div className="flex items-center">
                  <span className="w-12 text-xs font-bold text-slate-500">Week 2</span>
                  <div className="flex-1 ml-2 bg-slate-100 rounded-full h-3">
                    <div className="bg-[#6c11d4] h-3 rounded-full opacity-60" style={{ width: '75%' }}></div>
                  </div>
                  <span className="w-20 text-right text-xs font-bold text-slate-700 ml-2">UGX 3.8M</span>
               </div>
               <div className="flex items-center">
                  <span className="w-12 text-xs font-bold text-slate-500">Week 1</span>
                  <div className="flex-1 ml-2 bg-slate-100 rounded-full h-3">
                    <div className="bg-[#6c11d4] h-3 rounded-full opacity-40" style={{ width: '45%' }}></div>
                  </div>
                  <span className="w-20 text-right text-xs font-bold text-slate-700 ml-2">UGX 2.1M</span>
               </div>
             </div>
             
             <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mt-4">
                <p className="text-sm text-indigo-800 flex items-center">
                  <BarChart2 size={16} className="mr-2" /> Collections are up <strong>&nbsp;18%&nbsp;</strong> compared to last month.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default COOAnalytics;
