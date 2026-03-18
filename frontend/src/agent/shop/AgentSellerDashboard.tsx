import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Store, LineChart, PackageSearch, 
  Wallet, PlusCircle, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function AgentSellerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc] dark:bg-[#1e1e1e] min-h-[100dvh] font-['Inter'] pb-24">
       {/* Header */}
       <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/agent-shop')} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#6d28d9]/10 transition-colors -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Store size={20} className="text-[#6d28d9]" /> Seller Hub
            </h1>
          </div>
          <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-md text-xs font-bold">
             <ShieldCheck size={14} /> Verified
          </div>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto w-full p-4 space-y-6">
        
        {/* Earnings Overview */}
        <section className="bg-gradient-to-br from-[#1e1e1e] to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
           <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-[#6d28d9]/20 rounded-full blur-3xl"></div>
           
           <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <p className="text-slate-400 font-semibold text-sm">Escrow Balance & Earnings</p>
              <h2 className="text-4xl font-black text-white tracking-tight">UGX 1,250,000</h2>
              <button className="mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-full text-sm font-bold backdrop-blur-md transition-colors flex items-center gap-2">
                 <Wallet size={16} /> Withdraw to Main Wallet
              </button>
           </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-1">
             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-2">
                <LineChart size={16} />
             </div>
             <p className="text-xs font-bold text-slate-500">Total Sales</p>
             <p className="text-2xl font-black text-slate-900 dark:text-white">45</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-1">
             <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center mb-2">
                <PackageSearch size={16} />
             </div>
             <p className="text-xs font-bold text-slate-500">Active Listings</p>
             <p className="text-2xl font-black text-slate-900 dark:text-white">12</p>
          </div>
        </div>

        {/* Manage Products */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Your Products</h3>
              <button className="text-[#6d28d9] text-sm font-bold flex items-center gap-1">
                 View All <ArrowRight size={16} />
              </button>
           </div>

           <div className="space-y-3">
              {/* Product 1 */}
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex gap-3 items-center">
                 <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200" className="w-16 h-16 rounded-xl object-cover" />
                 <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">Modern 3-Seater Sofa</h4>
                    <p className="text-xs text-slate-500">UGX 1,200,000 • In Stock</p>
                 </div>
                 <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
                    Active
                 </div>
              </div>
              
              {/* Product 2 */}
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex gap-3 items-center">
                 <img src="https://images.unsplash.com/photo-1607472586893-edb57cb1474b?auto=format&fit=crop&q=80&w=200" className="w-16 h-16 rounded-xl object-cover" />
                 <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">Professional Plumbing</h4>
                    <p className="text-xs text-slate-500">UGX 50,000 • Service</p>
                 </div>
                 <div className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    Draft
                 </div>
              </div>
           </div>
        </section>

      </main>

      {/* Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-[960px] mx-auto">
          <button className="w-full bg-[#6d28d9] hover:bg-[#5a1bb9] py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-[#6d28d9]/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <PlusCircle size={20} />
            Add New Product
          </button>
        </div>
      </div>
    </div>
  );
}
