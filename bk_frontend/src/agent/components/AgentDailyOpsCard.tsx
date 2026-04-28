import { MapPin, Banknote, Target, TrendingUp, RefreshCcw } from 'lucide-react';
import { useOfflineAgentDashboard } from '../../hooks/useOfflineAgentDashboard';

export default function AgentDailyOpsCard() {
  const { stats, isRefreshing, refreshData, isOnline } = useOfflineAgentDashboard();

  const floatProgress = Math.min(100, (stats.floatCollected / stats.floatLimit) * 100);

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 relative overflow-hidden">
      {!isOnline && (
        <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 text-center">
          Offline Mode - Showing Cached Data
        </div>
      )}

      <div className="flex justify-between items-center mb-5 mt-1">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={16} className="text-[#512DA8]" />
          Daily Ops
        </h3>
        <button 
          onClick={refreshData}
          disabled={!isOnline || isRefreshing}
          className={`p-1.5 text-gray-400 hover:text-gray-600 transition ${isRefreshing ? 'animate-spin' : ''} ${!isOnline ? 'opacity-30' : ''}`}
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col justify-center items-center gap-1 border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
            <MapPin size={16} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.visitsToday}</span>
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Visits Today</span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col justify-center items-center gap-1 border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-1">
            <Banknote size={16} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.collectionsCount}</span>
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Collections</span>
        </div>
      </div>

      {/* Float Gauge */}
      <div>
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-xs text-gray-500 font-medium tracking-wide">Float Capacity</span>
            <div className="font-bold text-gray-900 mt-0.5">
              UGX {stats.floatCollected.toLocaleString()} <span className="text-gray-400 font-normal text-sm">/ {stats.floatLimit.toLocaleString()}</span>
            </div>
          </div>
          <Target size={20} className="text-gray-300" />
        </div>

        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              floatProgress > 90 ? 'bg-red-500' : floatProgress > 75 ? 'bg-amber-500' : 'bg-[#00E676]'
            }`}
            style={{ width: `${floatProgress}%` }}
          />
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">Resets daily at 00:00 UTC</p>
      </div>
    </div>
  );
}
