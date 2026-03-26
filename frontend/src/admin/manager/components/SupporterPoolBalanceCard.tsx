import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { formatMoney } from '../../../utils/formatters';
import { ShieldAlert, Info, Lock } from 'lucide-react';

export default function SupporterPoolBalanceCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['manager_pool_balance'],
    queryFn: managerApi.getPoolBalance,
    refetchInterval: 10000 // Realtime-ish polling to watch liquidity
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm animate-pulse h-48">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 w-64 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 flex items-center gap-3">
        <ShieldAlert className="shrink-0" />
        <p className="font-medium">Critical Error: Unable to compute live pool liquidity. Operations halted.</p>
      </div>
    );
  }

  const { liquidPool, deployedCapital, totalPartnerCapital, reserveLockAmount, isGateLocked } = data;

  const reservePercentage = totalPartnerCapital > 0 ? (reserveLockAmount / totalPartnerCapital) * 100 : 0;
  const liquidPercentage = totalPartnerCapital > 0 ? (liquidPool / totalPartnerCapital) * 100 : 0;
  const deployedPercentage = totalPartnerCapital > 0 ? (deployedCapital / totalPartnerCapital) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-inter">
      {/* Top Header Strip */}
      <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-900">Active Liquidity Pool</h3>
            <p className="text-sm text-gray-500 font-medium">Monitoring live funder capital vs platform deployment</p>
          </div>
        </div>
        
        {isGateLocked && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 animate-pulse">
            <ShieldAlert size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Liquidity Gate Locked</span>
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Liquid Balance */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              Available Liquid Deployable <Info size={14} className="text-gray-400" />
            </span>
            <span className={`text-5xl font-black tracking-tighter ${isGateLocked ? 'text-red-600' : 'text-[#6c11d4]'}`}>
              {formatMoney(liquidPool)} <span className="text-xl font-bold opacity-50">UGX</span>
            </span>
          </div>

          <div className="flex flex-col justify-end">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Capital Currently Deployed</span>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">{formatMoney(deployedCapital)} UGX</span>
          </div>

          <div className="flex flex-col justify-end border-l border-gray-100 pl-8">
            <span className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              15% Mandatory Reserve Lock <Lock size={12} />
            </span>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">{formatMoney(reserveLockAmount)} UGX</span>
          </div>
        </div>

        {/* Visual Gauge */}
        <div className="mt-8">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-gray-500">Fund Utilization</span>
            <span className="text-gray-500 text-right">Total Platform Capital: {formatMoney(totalPartnerCapital)} UGX</span>
          </div>
          
          <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" 
              style={{ width: `${deployedPercentage}%` }}
              title="Capital Deployed"
            >
              {deployedPercentage > 5 && 'DEPLOYED'}
            </div>
            
            <div 
              className={`h-full transition-all duration-1000 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${isGateLocked ? 'bg-red-500' : 'bg-purple-600'}`}
              style={{ width: `${liquidPercentage}%` }}
              title="Available Liquid Flow"
            >
              {liquidPercentage > 5 && 'LIQUID'}
            </div>

            <div 
              className="h-full bg-gray-800 transition-all duration-1000 ease-out opacity-20" 
              style={{ width: `${reservePercentage}%` }}
              title="Locked Minimum Reserve"
            ></div>
          </div>
          <div className="flex justify-end mt-1">
             <span className="text-[10px] font-bold text-gray-400">Lock Boundary</span>
          </div>
        </div>
      </div>
    </div>
  );
}
