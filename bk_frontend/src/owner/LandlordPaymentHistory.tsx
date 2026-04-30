import { Receipt, Search, Download } from 'lucide-react';


export default function LandlordPaymentHistory({ payments = [] }: { payments: any[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Receipt size={20} className="text-purple-600" />
            Payment History
          </h2>
          <p className="text-sm text-slate-500 mt-1">Review all rent deposits tracking towards your properties</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tenant..." 
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm w-full md:w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold border-b border-slate-100 dark:border-slate-800">Date</th>
              <th className="p-4 font-semibold border-b border-slate-100 dark:border-slate-800">Tenant Name</th>
              <th className="p-4 font-semibold border-b border-slate-100 dark:border-slate-800">Payment Method</th>
              <th className="p-4 font-semibold border-b border-slate-100 dark:border-slate-800">Amount</th>
              <th className="p-4 font-semibold border-b border-slate-100 dark:border-slate-800 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {payments.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">No payment history found.</td></tr>
            ) : payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                  {new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="p-4">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{payment.tenantName}</span>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {payment.method}
                </td>
                <td className="p-4">
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    UGX {payment.amount.toLocaleString()}
                  </span>
                </td>
                <td className="p-4 justify-end flex">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                    ${payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                  `}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {payments.length > 0 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition">
            View All Records
          </button>
        </div>
      )}
    </div>
  );
}
