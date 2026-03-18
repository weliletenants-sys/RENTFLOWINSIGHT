import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Share2, Heart, Star, MapPin, ShieldCheck, 
  Store, MessageCircle, Info 
} from 'lucide-react';
import { MOCK_PRODUCTS } from './AgentShop';

export default function AgentProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];

  return (
    <div className="bg-[#f8fafc] dark:bg-[#1e1e1e] min-h-[100dvh] flex flex-col font-['Inter'] relative">
        {/* Transparent Header */}
        <header className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-red-500 transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </header>

        {/* Carousel Image */}
        <div className="w-full h-[40dvh] bg-slate-200 dark:bg-slate-800 relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {/* Mock Pagination */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <div className="w-2 h-2 rounded-full bg-white/50"></div>
             <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-[#1e1e1e] -mt-6 rounded-t-3xl relative z-20 pb-28">
           <div className="max-w-[960px] mx-auto p-5 space-y-6">
              
              {/* Core Details */}
              <section className="space-y-3">
                 <div className="flex items-start justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{product.name}</h1>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-[#6d28d9] tracking-tight">UGX {product.price.toLocaleString()}</p>
                 </div>
                 <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1 text-[#f59e0b]">
                      <Star size={16} fill="currentColor" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviews} reviews)</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin size={14} />
                      <span>{product.location}</span>
                    </div>
                 </div>
              </section>

              {/* Seller Profiling */}
              <section className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#6d28d9]/10 text-[#6d28d9] flex items-center justify-center">
                    <Store size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {product.seller} <ShieldCheck size={14} className="text-green-500" />
                    </h3>
                    <p className="text-xs text-slate-500">Verified Welile Seller</p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-[#6d28d9] hover:bg-[#6d28d9]/10 transition-colors border border-slate-100 dark:border-slate-700">
                  <MessageCircle size={20} />
                </button>
              </section>

              {/* Description */}
              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Description</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  High quality {product.name.toLowerCase()} available for immediate purchase. This item comes with a standard warranty directly from the seller and is verified by Welile standards. Available for delivery or pickup at the seller's location in {product.location}.
                </p>
                <button className="text-[#6d28d9] text-sm font-semibold flex items-center gap-1 mt-2">
                   Read more
                </button>
              </section>

              {/* Escrow Information */}
              <section className="p-4 rounded-2xl bg-[#6d28d9]/5 border border-[#6d28d9]/20 flex gap-3">
                 <div className="text-[#6d28d9] mt-0.5"><Info size={20} /></div>
                 <div>
                   <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Welile Protection</h4>
                   <p className="text-xs text-slate-600 dark:text-slate-400">Your payment is held securely in escrow and only released to the seller after order confirmation.</p>
                 </div>
              </section>

           </div>
        </div>

        {/* Floating Checkout Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 z-50">
          <div className="max-w-[960px] mx-auto flex gap-3">
            <button 
              onClick={() => navigate(`/agent-shop/checkout/${product.id}`)}
              className="flex-1 bg-[#6d28d9] hover:bg-[#5a1bb9] py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-[#6d28d9]/30 active:scale-[0.98] transition-transform"
            >
              Buy Now
            </button>
          </div>
        </div>
    </div>
  );
}
