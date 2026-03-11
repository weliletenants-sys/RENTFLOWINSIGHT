import { UserPlus, MapPin, Target, ArrowDownToLine, Users } from 'lucide-react';

export default function AgentDashboard() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Agent Performance Metric */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute opacity-10 -right-4 -bottom-4">
          <Target size={120} />
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <p className="text-purple-100 font-medium">Monthly Collection Goal</p>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">86%</span>
        </div>
        
        <h2 className="text-4xl font-bold tracking-tight mb-2">KES 120,400</h2>
        <p className="text-sm text-purple-200">/ KES 140,000</p>

        <div className="flex space-x-2 mt-6">
          <button className="flex-1 bg-white text-purple-700 py-3 rounded-2xl font-semibold flex justify-center items-center gap-2 hover:bg-purple-50 transition">
            <ArrowDownToLine size={18} />
            Record Collection
          </button>
        </div>
      </div>

      {/* Grid Quick Actions */}
      <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider ml-2">Quick Commands</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100 hover:bg-purple-50 transition">
          <div className="bg-purple-100 text-purple-600 p-2 rounded-xl">
            <UserPlus size={20} />
          </div>
          <span className="font-semibold text-gray-700 text-sm">Register User</span>
        </button>
        <button className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100 hover:bg-purple-50 transition">
          <div className="bg-purple-100 text-purple-600 p-2 rounded-xl">
            <MapPin size={20} />
          </div>
          <span className="font-semibold text-gray-700 text-sm">GPS Check-in</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users size={18} className="text-purple-600"/> Assigned Tenants
          </h3>
          <button className="text-sm font-semibold text-purple-600">Map View</button>
        </div>

        {/* List Items */}
        {['Sarah M.', 'David O.', 'Kevin N.'].map((name, i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-50/50 hover:bg-gray-50 p-4 rounded-2xl transition cursor-pointer mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex justify-center items-center font-bold text-sm">
              {name.charAt(0)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-sm">{name}</h4>
              <p className="text-xs text-gray-500">Rent due: Tomorrow</p>
            </div>
            <button className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
              Contact
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
