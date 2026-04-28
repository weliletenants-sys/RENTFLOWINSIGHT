import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { formatMoney } from '../../../utils/currency';
import { CheckCircle, ShieldQuestion, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DepositRequestsManager() {
  const queryClient = useQueryClient();

  const { data: deposits, isLoading } = useQuery({
    queryKey: ['manager_pending_deposits'],
    queryFn: managerApi.getPendingDeposits,
    refetchInterval: 15000 // Realtime-ish
  });

  const approveMutation = useMutation({
    mutationFn: managerApi.approveDeposit,
    onSuccess: () => {
      toast.success('Deposit verified! Funds credited to destination wallet.');
      queryClient.invalidateQueries({ queryKey: ['manager_pending_deposits'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'System rejected deposit execution.');
    }
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white h-64 rounded-xl border border-gray-200"></div>;
  }

  if (!deposits || deposits.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-bold tracking-tight text-gray-900">Queue Cleared</h3>
        <p className="text-gray-500 mt-1">There are no pending mobile money TID verifications.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-inter">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <ShieldQuestion className="text-purple-600" />
        <h3 className="font-bold text-gray-900 tracking-tight">Pending TID Verifications</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Funder Name</th>
              <th className="px-6 py-4">Target Wallet</th>
              <th className="px-6 py-4 text-right">Raw Amount</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deposits.map((dep: any) => (
              <tr key={dep.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <span className="text-gray-500 font-medium">
                    {new Date(dep.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-5 font-medium text-gray-900">
                  {dep.profiles?.full_name || 'Unknown User'}
                  <div className="text-xs text-gray-400 font-normal">{dep.profiles?.phone || ''}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold text-xs uppercase">
                    {dep.target_wallet}
                  </span>
                </td>
                <td className="px-6 py-5 text-right font-black tracking-tight text-[#6c11d4]">
                  {formatMoney(Number(dep.amount))} <span className="text-xs opacity-50">UGX</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <button
                    onClick={() => approveMutation.mutate(dep.id)}
                    disabled={approveMutation.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-bold text-sm tracking-wide hover:bg-green-700 transition-all hover:shadow-md hover:shadow-green-900/20 active:scale-95 disabled:opacity-50"
                  >
                    {approveMutation.isPending && approveMutation.variables === dep.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Check size={16} />
                    )}
                    Verify & Credit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
