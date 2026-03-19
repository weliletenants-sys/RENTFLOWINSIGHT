import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Truck, CheckCircle2, 
  Wallet, AlertCircle, ShoppingCart 
} from 'lucide-react';
import { MOCK_PRODUCTS } from './AgentShop';
import toast from 'react-hot-toast';

export default function AgentCheckout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];

  const MOCK_WALLET_BALANCE = 5000000; // Agent has 5M UGX in virtual wallet

  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'PICKUP' | 'DELIVERY'>('DELIVERY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deliveryCost = deliveryMethod === 'DELIVERY' ? 15000 : 0;
  const subTotal = (product?.price || 0) * quantity;
  const totalCost = subTotal + deliveryCost;
  const remainingBalance = MOCK_WALLET_BALANCE - totalCost;
  const canAfford = remainingBalance >= 0;

  const handleConfirmPurchase = async () => {
    if (!canAfford) return toast.error('Insufficient wallet balance');
    
    setIsSubmitting(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('Payment successfully held in escrow');
  };

  if (isSuccess) {
    return (
      <div className="bg-[#f8fafc] dark:bg-[#1e1e1e] min-h-[100dvh] flex flex-col font-['Inter']">
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center mb-4">
            <CheckCircle2 size={48} />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Order Confirmed!</h1>
            <p className="text-slate-500 dark:text-slate-400">
              UGX {totalCost.toLocaleString()} has been securely deducted from your wallet and is held in Welile Escrow.
            </p>
          </div>
          
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl space-y-3">
             <div className="flex items-start gap-4 pb-4 border-b border-dashed border-slate-200 dark:border-slate-700">
                <img src={product.image} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-slate-500">Qty: {quantity} • By {product.seller}</p>
                </div>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-[#f59e0b]">Pending Fulfillment</span>
             </div>
             <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-slate-500">Order ID</span>
                <span className="font-bold text-slate-900 dark:text-white">ORD-{Math.floor(10000+Math.random()*90000)}</span>
             </div>
          </div>

          <div className="w-full max-w-sm space-y-3 pt-6">
            <button onClick={() => navigate('/agent-shop/orders')} className="w-full bg-[#6d28d9] hover:bg-[#5a1bb9] py-4 rounded-xl text-white font-bold text-lg shadow-lg active:scale-[0.98] transition-all">
              Track Order
            </button>
            <button onClick={() => navigate('/agent-shop')} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-4 rounded-xl text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-[#1e1e1e] min-h-[100dvh] flex flex-col font-['Inter']">
       {/* Header */}
       <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#6d28d9]/10 transition-colors -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Secure Checkout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto w-full p-4 space-y-6 pb-32">
        {/* Order Item */}
        <section className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4">
           <img src={product.image} className="w-20 h-20 rounded-xl object-cover" />
           <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">{product.name}</h3>
                <p className="text-xs text-[#6d28d9] font-semibold mt-1">{product.seller}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                 <p className="font-black text-slate-900 dark:text-white">UGX {product.price.toLocaleString()}</p>
                 <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 rounded-lg px-2 py-1">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 h-6 flex items-center justify-center text-slate-500 font-bold">-</button>
                   <span className="font-bold text-sm text-slate-900 dark:text-white w-4 text-center">{quantity}</span>
                   <button onClick={() => setQuantity(quantity + 1)} className="w-6 h-6 flex items-center justify-center text-slate-500 font-bold">+</button>
                 </div>
              </div>
           </div>
        </section>

        {/* Delivery Options */}
        <section className="space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck size={18} className="text-[#6d28d9]" /> Delivery Method
          </h3>
          <div className="grid grid-cols-2 gap-3">
             <label className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === 'DELIVERY' ? 'border-[#6d28d9] bg-[#6d28d9]/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                <input type="radio" name="delivery" className="sr-only" checked={deliveryMethod === 'DELIVERY'} onChange={() => setDeliveryMethod('DELIVERY')} />
                <span className="font-bold text-sm text-slate-900 dark:text-white mb-1">Standard Delivery</span>
                <span className="text-xs text-slate-500">+UGX 15,000</span>
             </label>
             <label className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === 'PICKUP' ? 'border-[#6d28d9] bg-[#6d28d9]/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                <input type="radio" name="delivery" className="sr-only" checked={deliveryMethod === 'PICKUP'} onChange={() => setDeliveryMethod('PICKUP')} />
                <span className="font-bold text-sm text-slate-900 dark:text-white mb-1">Store Pickup</span>
                <span className="text-xs text-green-500 font-semibold">Free</span>
             </label>
          </div>
        </section>

        {/* Wallet Calculation */}
        <section className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Wallet size={18} className="text-[#6d28d9]" />
              <span className="font-bold text-sm">Pay with Welile Wallet</span>
            </div>
            <span className="text-xs text-slate-400">Available: UGX {MOCK_WALLET_BALANCE.toLocaleString()}</span>
          </div>
          <div className="p-5 space-y-3 text-white">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Items Subtotal</span>
                <span>UGX {subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-300">
                <span>Fulfillment Fee</span>
                <span>UGX {deliveryCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-black text-lg pt-3 border-t border-slate-700">
                <span>Total Cost</span>
                <span className="text-[#6d28d9]">UGX {totalCost.toLocaleString()}</span>
              </div>
          </div>
          <div className={`p-3 text-xs font-bold text-center ${canAfford ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
             {canAfford 
               ? `Balance after purchase: UGX ${remainingBalance.toLocaleString()}`
               : (
                 <span className="flex items-center justify-center gap-1">
                   <AlertCircle size={14} /> Insufficient Balance. Please deposit funds.
                 </span>
               )
             }
          </div>
        </section>
      </main>

      {/* Checkout Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-[960px] mx-auto">
          <button 
            onClick={handleConfirmPurchase}
            disabled={!canAfford || isSubmitting}
            className="w-full bg-[#6d28d9] hover:bg-[#5a1bb9] py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-[#6d28d9]/30 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
               <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
               <>
                 <ShoppingCart size={20} /> Pay UGX {totalCost.toLocaleString()}
               </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
