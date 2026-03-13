import { useState, useEffect } from 'react';
import { ArrowUpRight, Calendar, Clock, Activity, Download, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FunderInvestModal from './FunderInvestModal';

export default function FunderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ totalContribution: 0, returnPerMonth: 0, portfoliosCount: 0 });
  const [virtualHouses, setVirtualHouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real app we'd get a token from AuthContext to pass in headers
  const fetchDashboardData = async () => {
    try {
      // Check onboarding verification
      if (user && user.isVerified === false) {
        navigate('/funder-onboarding');
        return;
      }

      if (!user) navigate('/login');
      // const headers = { Authorization: `Bearer ${user.token}` };
      
      // Fallback to empty data for showcase
      setStats({
        totalContribution: 5000000,
        returnPerMonth: 750000,
        portfoliosCount: 2
      });
      
      setVirtualHouses([
        { id: 'VH-8F9B2A', rentAmount: 200000, health: 'GREEN', fundedAt: new Date().toISOString() },
        { id: 'VH-3C4D5E', rentAmount: 450000, health: 'YELLOW', fundedAt: new Date(Date.now() - 15 * 86400000).toISOString() },
      ]);
    } catch (error) {
      console.error('Failed to load funder data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading portfolio...</div>;

  return (
    <div className="flex flex-col gap-6 -mt-2 w-full max-w-md mx-auto relative z-10">
      
      {/* Pending status example */}
      {stats.portfoliosCount === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-center gap-3 mx-1">
          <Clock className="text-yellow-600 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-yellow-900 text-sm">No Active Portfolios</h4>
            <p className="text-xs text-yellow-700 mt-0.5">Fund the Rent Pool to start earning 15% monthly.</p>
          </div>
        </div>
      )}

      {/* Hero Card: Core Metric (Uniform with TenantDashboard) */}
      <div className="bg-[#512DA8] p-6 rounded-[2rem] text-white shadow-xl shadow-purple-500/20 relative overflow-hidden mx-1">
        {/* Abstract pattern matching Tenant UI */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-purple-400/20 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-6">
          <p className="text-purple-200 font-medium text-sm">Total Contribution</p>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm">
            Active Portfolio
          </span>
        </div>
        
        <h2 className="relative z-10 text-[32px] font-black tracking-tight mb-6">
          <span className="text-xl font-bold opacity-80 mr-1">UGX</span>
          {stats.totalContribution.toLocaleString()}
        </h2>

        {/* Instead of a progress bar, we show ROI indicator */}
        <div className="relative z-10 space-y-2">
          <div className="flex justify-between text-xs text-purple-100/90 font-medium">
            <span>Projected Growth (12mo)</span>
            <span className="text-[#00E676] font-bold">+15% monthly</span>
          </div>
          <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#00E676] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `100%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Focus (Uniform with Tenant Pay Now focus) */}
      <div className="bg-white border-2 border-[#512DA8]/10 rounded-[2rem] p-5 shadow-sm flex items-center justify-between mx-1">
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Monthly Return</p>
          <p className="text-xl font-black text-gray-900">UGX {stats.returnPerMonth.toLocaleString()}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#512DA8] hover:bg-[#412387] text-white px-5 py-3 rounded-2xl font-bold shadow-lg transition active:scale-95 flex items-center gap-2 text-sm"
        >
          Fund Pool <ArrowUpRight size={18} strokeWidth={2.5}/>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center px-3 mt-1">
        <div className="flex flex-col items-center gap-2 cursor-pointer group w-1/3">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] text-[#512DA8] group-hover:bg-purple-50 group-active:scale-95 transition">
            <Download size={24} strokeWidth={1.5} />
          </div>
          <span className="text-[11px] font-bold text-gray-600 group-hover:text-[#512DA8]">Deposit</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group w-1/3">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] text-blue-500 group-hover:bg-blue-50 group-active:scale-95 transition">
            <Banknote size={24} strokeWidth={1.5} />
          </div>
          <span className="text-[11px] font-bold text-gray-600 group-hover:text-blue-500">Withdraw</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group w-1/3">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] text-orange-500 group-hover:bg-orange-50 group-active:scale-95 transition">
            <Calendar size={24} strokeWidth={1.5} />
          </div>
          <span className="text-[11px] font-bold text-gray-600 group-hover:text-orange-500">History</span>
        </div>
      </div>

      {/* Detailed Info Card - Virtual Houses List */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mx-1 mt-1 mb-8">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-gray-900 text-[17px]">Virtual Houses</h3>
          <Activity size={18} className="text-gray-400" />
        </div>

        <div className="space-y-4">
          {virtualHouses.map((house: any, idx: number) => (
            <div key={idx} className={`flex justify-between items-center pb-3 ${idx !== virtualHouses.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold tracking-tight">{house.id}</span>
                <span className="text-gray-500 text-[11px] font-medium mt-0.5">Funded {new Date(house.fundedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-gray-900 font-bold mb-1 tracking-tight">UGX {house.rentAmount.toLocaleString()}</span>
                {house.health === 'GREEN' && (
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">On Track</span>
                )}
                {house.health === 'YELLOW' && (
                  <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Delayed</span>
                )}
                {house.health === 'RED' && (
                  <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">At Risk</span>
                )}
              </div>
            </div>
          ))}

          {virtualHouses.length === 0 && (
            <div className="text-center py-4 text-gray-400 text-sm font-medium">
              No virtual houses funded yet.
            </div>
          )}
        </div>
      </div>

      <FunderInvestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletBalance={20000000} // Mock balance
        onSuccess={(amount) => {
          setStats(prev => ({
            ...prev,
            totalContribution: prev.totalContribution + amount,
            returnPerMonth: prev.returnPerMonth + (amount * 0.15)
          }));
        }}
      />
    </div>
  );
}
