import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart, ShieldCheck } from 'lucide-react';
import { CartItem } from './MarketplaceSection';
import { toast } from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  api: any;
}

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, clearCart, api }: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const totalRaw = cart.reduce((acc, current) => acc + (current.product.price * current.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    try {
      // Send stripped ID array mapped strictly to API parameters preventing client-side spoofing
      const payload = {
         items: cart.map(i => ({ 
           productId: i.product.id, 
           quantity: i.quantity 
         }))
      };

      const res = await api.post('/marketplace/orders', payload);
      
      if (res.data?.success) {
         toast.success('Checkout Successful! Wallet deducted securely.');
         clearCart();
         onClose();
      }
    } catch (e: any) {
      console.error('Checkout failed', e);
      // Strictly map the RFC 7807 problem details string generated organically in the Express backend
      toast.error(e.response?.data?.detail || 'Atomic checkout aborted. Verify funds.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right">
         <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
               <ShoppingCart /> Cart ({cart.reduce((a,b)=>a+b.quantity,0)})
            </h2>
            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200">
               <X className="text-slate-600 dark:text-slate-300" size={20} />
            </button>
         </div>

         <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShoppingCart size={48} className="opacity-20" />
                  <p className="font-medium text-lg">Your cart is empty.</p>
               </div>
            ) : (
               cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                     <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.product.image_url && <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />}
                     </div>
                     <div className="flex flex-col flex-grow justify-between">
                        <div>
                           <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.product.name}</p>
                           <p className="font-black text-purple-600 mt-1">UGX {item.product.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                           <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                             <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-white text-slate-600"><Minus size={14} /></button>
                             <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-white text-slate-600"><Plus size={14} /></button>
                           </div>
                           <button onClick={() => updateQuantity(item.product.id, 0)} className="text-xs text-red-500 font-bold uppercase tracking-wider hover:underline">Remove</button>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* Checkout Footer */}
         {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
               <div className="flex justify-between items-center mb-6">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Gross Total</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">UGX {totalRaw.toLocaleString()}</p>
               </div>
               
               <p className="text-xs text-slate-500 flex items-center gap-2 justify-center mb-4 font-medium">
                  <ShieldCheck size={14} className="text-emerald-500" /> Funds will be deducted from active wallet natively.
               </p>

               <button 
                 onClick={handleCheckout}
                 disabled={isCheckingOut}
                 className="w-full bg-slate-900 text-white flex items-center justify-center gap-2 p-4 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0"
               >
                 {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                    'Confirm Checkout'
                 )}
               </button>
            </div>
         )}
      </div>
    </div>
  );
}
