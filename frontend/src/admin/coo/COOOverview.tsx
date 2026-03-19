import React from 'react';
import { Users, Briefcase, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, UserCheck, Wallet, PieChart, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COOOverview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-inter">
      
      {/* 1. Financial Metrics Cards (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-sm font-bold">Total Investors</span>
            <div className="p-2 bg-[#EAE5FF] text-[#7B61FF] rounded-full">
              <Users size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">142</h3>
          <div className="inline-flex items-center text-green-600 text-xs font-bold">
            <ArrowUpRight size={14} className="mr-1" /> +12 this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-sm font-bold">Total Investments</span>
            <div className="p-2 bg-[#EAE5FF] text-[#7B61FF] rounded-full">
              <Briefcase size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">4.2B <span className="text-sm text-slate-400 font-medium">UGX</span></h3>
          <div className="inline-flex items-center text-green-600 text-xs font-bold">
            <ArrowUpRight size={14} className="mr-1" /> +200M this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-sm font-bold">Daily Collections</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-full">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-2">15.6M <span className="text-sm text-slate-400 font-medium">UGX</span></h3>
          <div className="inline-flex items-center text-slate-500 text-xs font-bold">
            Target: 18.0M
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-3xl border-2 border-red-100 shadow-sm relative overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors flex flex-col justify-between"
          onClick={() => navigate('/coo/withdrawals')}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-slate-600 text-sm font-bold">Pending Withdrawals</span>
            <div className="p-2 bg-red-100 text-red-600 rounded-full">
              <AlertTriangle size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-outfit text-red-600 mb-2 relative z-10">28.5M <span className="text-sm opacity-70 font-medium">UGX</span></h3>
          <div className="inline-flex items-center text-red-500 text-xs font-bold relative z-10">
            Requires Action (4 requests)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3. Agent Collections Context */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Agent Collections Overview</h3>
              <button onClick={() => navigate('/coo/collections')} className="text-xs font-bold text-[#7B61FF] bg-[#EAE5FF] px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors">
                 View All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl flex flex-col justify-center">
                <p className="text-sm text-slate-500 font-bold mb-1">Active Agents</p>
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-[#EAE5FF] flex items-center justify-center text-[#7B61FF]">
                     <UserCheck size={16} />
                   </div>
                   <p className="text-2xl font-bold text-slate-900">45</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl flex flex-col justify-center">
                <p className="text-sm text-slate-500 font-bold mb-1">Active Accounts</p>
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-[#EAE5FF] flex items-center justify-center text-[#7B61FF]">
                     <Users size={16} />
                   </div>
                   <p className="text-2xl font-bold text-slate-900">1,245</p>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-2xl flex flex-col justify-center">
                <p className="text-sm text-orange-700 font-bold mb-1">Missed Payments</p>
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                     <ArrowDownRight size={16} />
                   </div>
                   <p className="text-xl font-bold text-orange-600">32 <span className="text-sm font-medium">Tenants</span></p>
                </div>
              </div>
              <div className="p-4 bg-[#EAE5FF] rounded-2xl flex flex-col justify-center">
                <p className="text-sm text-[#7B61FF] font-bold mb-1">Today's Visits</p>
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#7B61FF]">
                     <Activity size={16} />
                   </div>
                   <p className="text-xl font-bold text-[#7B61FF]">184</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 & 5. Wallet Monitoring & Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/coo/wallets')}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#EAE5FF] text-[#7B61FF] rounded-full"><Wallet size={20} /></div>
                <h3 className="text-lg font-bold text-slate-800">Wallet Monitoring</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-bold text-slate-600">Main Operating Float</span>
                    <span className="font-bold text-green-600 px-2 py-0.5 bg-green-50 rounded-md">Healthy</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-bold text-slate-600">Agent Float Escrow</span>
                    <span className="font-bold text-orange-500 px-2 py-0.5 bg-orange-50 rounded-md">12%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/coo/analytics')}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#EAE5FF] text-[#7B61FF] rounded-full"><PieChart size={20} /></div>
                <h3 className="text-lg font-bold text-slate-800">Payment Modes</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                     <span className="w-3 h-3 rounded-full bg-[#7B61FF]"></span>
                     <span className="font-bold text-slate-600">Mobile Money</span>
                  </div>
                  <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">65%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                     <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                     <span className="font-bold text-slate-600">Bank Transfer</span>
                  </div>
                  <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">28%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                     <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                     <span className="font-bold text-slate-600">Cash (Agency)</span>
                  </div>
                  <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">7%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 7. Risk & Alerts (Right Column) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Risk & Alerts</h3>
            <button onClick={() => navigate('/coo/alerts')} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
               View Feed
            </button>
          </div>
          
          <div className="space-y-4 flex-1">
            <div 
              className="p-4 bg-white border border-red-100 rounded-2xl shadow-sm cursor-pointer hover:border-red-300 transition-all relative overflow-hidden"
              onClick={() => navigate('/coo/withdrawals')}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Pending Withdrawals</h4>
              <p className="text-xs text-slate-500 leading-relaxed">4 requests totaling <strong className="text-slate-700">UGX 28.5M</strong> waiting for COO approval before disbursement.</p>
            </div>
            
            <div className="p-4 bg-white border border-orange-100 rounded-2xl shadow-sm cursor-pointer hover:border-orange-300 transition-all relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400"></div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Overdue Payments</h4>
              <p className="text-xs text-slate-500 leading-relaxed">12 tenants have been overdue for &gt; 3 days. Totaling <strong className="text-slate-700">UGX 1.4M</strong>.</p>
            </div>
            
            <div className="p-4 bg-white border border-[#EAE5FF] rounded-2xl shadow-sm cursor-pointer hover:border-[#7B61FF] transition-all relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7B61FF]"></div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Upcoming Payouts</h4>
              <p className="text-xs text-slate-500 leading-relaxed"><strong className="text-slate-700">UGX 42M</strong> in Investor ROI payouts scheduled for tomorrow.</p>
            </div>
            
            <div className="p-4 bg-white border border-green-100 rounded-2xl shadow-sm cursor-pointer hover:border-green-300 transition-all relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Large Deposits</h4>
              <p className="text-xs text-slate-500 leading-relaxed">2 pending partner deposit checks &gt; <strong className="text-slate-700">UGX 50M</strong> require verification.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default COOOverview;
