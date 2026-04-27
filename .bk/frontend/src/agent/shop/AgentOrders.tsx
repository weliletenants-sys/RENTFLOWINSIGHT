import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Clock, Truck, CheckCircle2 } from 'lucide-react';

const MOCK_ORDERS: any[] = [];

export default function AgentOrders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredOrders = MOCK_ORDERS.filter(o => activeTab === 'ALL' || o.status === activeTab);

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'PENDING':
        return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Pending Fufillment' };
      case 'CONFIRMED':
        return { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'On the Way' };
      case 'DELIVERED':
        return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Delivered' };
      default:
        return { icon: Package, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', label: status };
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#1e1e1e] min-h-[100dvh] font-['Inter']">
       {/* Header */}
       <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-[960px] mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/agent-shop')} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#6c11d4]/10 transition-colors -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Orders</h1>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto w-full p-4 space-y-6">
         {/* Tabs */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
           {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                 activeTab === tab 
                   ? 'bg-[#6c11d4] text-white shadow-md shadow-[#6c11d4]/20'
                   : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
               }`}
             >
               {tab === 'ALL' ? 'All Orders' : tab.charAt(0) + tab.slice(1).toLowerCase()}
             </button>
           ))}
         </div>

         {/* Orders List */}
         <div className="space-y-4">
           {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
                <Package size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-slate-900 dark:text-white font-bold mb-1">No orders found</h3>
                <p className="text-slate-500 text-sm">You haven't placed any orders in this status.</p>
              </div>
           ) : (
             filteredOrders.map(order => {
               const Status = getStatusDisplay(order.status);
               const StatusIcon = Status.icon;
               return (
                 <div key={order.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                      <div>
                        <p className="text-xs font-bold text-slate-500">{order.id}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{order.date}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${Status.bg} ${Status.color}`}>
                         <StatusIcon size={14} />
                         <span className="text-[10px] font-black uppercase tracking-wider">{Status.label}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                       <img src={order.imageUrl} className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-700" />
                       <div className="flex-1">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{order.productName}</h3>
                          <p className="text-xs text-[#6c11d4] font-medium mt-1">{order.seller}</p>
                          <p className="font-black text-slate-900 dark:text-white mt-1">UGX {order.total.toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                       <button className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                         Contact Seller
                       </button>
                       {order.status === 'DELIVERED' ? (
                          <button className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Leave Review
                          </button>
                       ) : (
                          <button className="flex-1 py-2.5 rounded-xl bg-[#6c11d4]/10 text-[#6c11d4] font-bold text-xs hover:bg-[#6c11d4]/20 transition-colors">
                            Track
                          </button>
                       )}
                    </div>
                 </div>
               );
             })
           )}
         </div>
      </main>
    </div>
  );
}
