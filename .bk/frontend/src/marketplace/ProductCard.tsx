import React from 'react';
import { Product } from './MarketplaceSection';
import { Plus, PackageX } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 p-6 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center">
             <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Image</span>
          </div>
        )}
        
        {isOutOfStock && (
           <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-500 text-white font-black uppercase text-xs tracking-widest px-4 py-2 rounded-full shadow-lg">
                Sold Out
              </span>
           </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow text-left">
         <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 h-10">{product.description || 'Verified Rentflow Provider Tooling.'}</p>
         
         <div className="mt-auto pt-4 flex items-center justify-between">
            <div>
               <p className="text-lg font-black text-purple-600 dark:text-purple-400">UGX {product.price.toLocaleString()}</p>
               <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{product.stock} left in stock</p>
            </div>
            <button 
               onClick={onAdd}
               disabled={isOutOfStock}
               className={`p-3 rounded-full flex items-center justify-center transition-all ${isOutOfStock ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30'}`}
            >
               {isOutOfStock ? <PackageX size={18} /> : <Plus size={18} className="stroke-[3]" />}
            </button>
         </div>
      </div>
    </div>
  );
}
