import { CreditCard, Calendar, Gift, Search, PlusCircle, ArrowUpRight } from 'lucide-react';

export default function TenantDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Search / Action Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-purple-300 pointer-events-none" size={18} />
        <input 
          type="text" 
          placeholder="Search landlords or payments..." 
          className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-200 pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {/* Hero Card: Core Rent Access Metric */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        
        <div className="flex justify-between items-start mb-6">
          <p className="text-purple-100 font-medium">Available Credit Limit</p>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">Tier 1</span>
        </div>
        
        <h2 className="text-4xl font-bold tracking-tight mb-2">KES 25,000</h2>
        <div className="flex space-x-2 mt-6">
          <button className="flex-1 bg-white text-purple-700 py-3 rounded-2xl font-semibold flex justify-center items-center gap-2 hover:bg-purple-50 transition">
            <PlusCircle size={18} />
            Request Rent
          </button>
          <button className="w-12 h-12 bg-white/20 rounded-2xl flex justify-center items-center hover:bg-white/30 backdrop-blur-md transition">
            <CreditCard size={20} />
          </button>
        </div>
      </div>

      {/* Quick Actions (Four bubbles) */}
      <div className="flex justify-between items-center px-2">
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-sm text-purple-600 group-hover:bg-purple-50 transition">
            <ArrowUpRight size={24} />
          </div>
          <span className="text-xs font-medium text-gray-600">Pay Rent</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-sm text-purple-600 group-hover:bg-purple-50 transition">
            <Calendar size={24} />
          </div>
          <span className="text-xs font-medium text-gray-600">Schedule</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-sm text-purple-600 group-hover:bg-purple-50 transition">
            <PlusCircle size={24} />
          </div>
          <span className="text-xs font-medium text-gray-600">Landlord</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-sm text-purple-600 group-hover:bg-purple-50 transition">
            <Gift size={24} />
          </div>
          <span className="text-xs font-medium text-gray-600">Calculate</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Recent Request</h3>
          <button className="text-sm font-semibold text-purple-600">View all</button>
        </div>

        {/* List Item */}
        <div className="flex items-center gap-4 bg-gray-50/50 hover:bg-gray-50 p-4 rounded-2xl transition cursor-pointer mb-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex justify-center items-center font-bold">
            JM
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">John Macharia</h4>
            <p className="text-xs text-gray-500">Rent advance • Pending</p>
          </div>
          <div className="text-right">
            <h4 className="font-bold text-gray-800">KES 12,000</h4>
            <p className="text-xs text-orange-500">Processing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
