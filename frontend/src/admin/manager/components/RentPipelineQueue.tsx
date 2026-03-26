import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { formatMoney } from '../../../utils/formatters';
import { formatDistanceToNow } from 'date-fns';
import { Send, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RentPipelineQueue() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['pending_manager_rent_requests'],
    queryFn: managerApi.getPendingRentRequests,
    refetchInterval: 15000
  });

  const { data: poolData } = useQuery({
    queryKey: ['manager_pool_balance'],
    queryFn: managerApi.getPoolBalance
  });

  const deployMutation = useMutation({
    mutationFn: managerApi.deployCapital,
    onSuccess: () => {
      toast.success('Capital deployed successfully! Agent bonus queued.');
      queryClient.invalidateQueries({ queryKey: ['pending_manager_rent_requests'] });
      queryClient.invalidateQueries({ queryKey: ['manager_pool_balance'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deploy capital.');
    }
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white h-64 rounded-xl border border-gray-200"></div>;
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-bold tracking-tight text-gray-900">Deployment Queue Empty</h3>
        <p className="text-gray-500 mt-1">All manager-approved rent requests have been fully funded.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-inter">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Request Time</th>
              <th className="px-6 py-4">Tenant</th>
              <th className="px-6 py-4">Agent (Payee)</th>
              <th className="px-6 py-4 text-right">Repayment Principal</th>
              <th className="px-6 py-4 text-right">Daily Installment</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req: any) => {
              const principal = Number(req.total_repayment);
              const isLockedOut = poolData?.isGateLocked || (poolData?.liquidPool < principal);
              
              return (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(req.created_at))} ago
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-gray-900">
                    {req.profiles?.full_name || 'Unknown Tenant'}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold text-xs">
                      {req.agents?.profiles?.full_name || 'Agent ID ' + req.agent_id}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-black tracking-tight text-gray-900">
                    {formatMoney(principal)} <span className="text-xs text-gray-400 font-bold">UGX</span>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-[#6c11d4]">
                    {formatMoney(Math.ceil((principal * 1.33) / 30))} /day
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => deployMutation.mutate(req.id)}
                      disabled={isLockedOut || deployMutation.isPending}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all ${
                        isLockedOut
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md hover:shadow-purple-900/20 active:scale-95'
                      }`}
                      title={isLockedOut ? "Insufficient liquid deployment pool." : "Deploy funds to rent"}
                    >
                      {deployMutation.isPending && deployMutation.variables === req.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send size={16} />
                      )}
                      Deploy Capital
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
