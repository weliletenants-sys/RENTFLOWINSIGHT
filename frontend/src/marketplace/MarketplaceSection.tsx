import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from './ProductCard';
import CartDrawer from './CartDrawer';

// Must align with the API base interceptors
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
});

// Setup interceptor for token injection
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface Product {
   id: string;
   name: string;
   description: string;
   price: number;
   image_url: string;
   stock: number;
}

export interface CartItem {
   product: Product;
   quantity: number;
}

export default function MarketplaceSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     fetchProducts();
  }, []);

  const fetchProducts = async () => {
     setLoading(true);
     try {
       const res = await api.get('/marketplace/products');
       if (res.data && res.data.data) {
          setProducts(res.data.data);
       }
     } catch (e: any) {
       toast.error(e.response?.data?.detail || 'Failed fetching products');
     } finally {
       setLoading(false);
     }
  };

  const addToCart = (product: Product) => {
     setCart(prev => {
        const existing = prev.find(i => i.product.id === product.id);
        if (existing) {
           if (existing.quantity >= product.stock) {
               toast.error('Maximum stock reached');
               return prev;
           }
           return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { product, quantity: 1 }];
     });
     toast.success(`${product.name} added to cart!`);
  };

  const updateCartQuantity = (productId: string, qty: number) => {
     if (qty <= 0) {
        setCart(prev => prev.filter(i => i.product.id !== productId));
     } else {
        setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
     }
  };

  const clearCart = () => setCart([]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
         <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Marketplace
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Equip yourself with verified operational tools.</p>
         </div>
         <button 
           onClick={() => setIsCartOpen(true)}
           className="relative p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
         >
           <ShoppingBag className="text-slate-700 dark:text-slate-200" />
           {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                 {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
           )}
         </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
           <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {products.map(p => (
              <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
           ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200">
           <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
           <p className="text-slate-500 font-medium">No items available in the marketplace right now.</p>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer 
         isOpen={isCartOpen}
         onClose={() => setIsCartOpen(false)}
         cart={cart}
         updateQuantity={updateCartQuantity}
         clearCart={clearCart}
         api={api}
      />
    </div>
  );
}
