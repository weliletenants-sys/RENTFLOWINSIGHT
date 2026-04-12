import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Search, SlidersHorizontal, ShoppingBag, 
  MapPin, Star, Smartphone, Home, Wrench, Package, ArrowRight,
  TrendingUp, Store
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Package },
  { id: 'electronics', name: 'Electronics', icon: Smartphone },
  { id: 'home', name: 'Home Essentials', icon: Home },
  { id: 'services', name: 'Services', icon: Wrench },
];

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Samsung 43" Smart TV',
    price: 850000,
    category: 'electronics',
    seller: 'TechWorld UG',
    rating: 4.8,
    reviews: 24,
    location: 'Kampala CBD',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400',
    featured: true
  },
  {
    id: 'p2',
    name: 'Professional Plumbing Services',
    price: 50000,
    category: 'services',
    seller: 'Kateregga John',
    rating: 4.9,
    reviews: 112,
    location: 'Makindye, 2km away',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57cb1474b?auto=format&fit=crop&q=80&w=400',
    featured: true
  },
  {
    id: 'p3',
    name: 'Modern 3-Seater Sofa',
    price: 1200000,
    category: 'home',
    seller: 'Furniture Hub',
    rating: 4.5,
    reviews: 8,
    location: 'Ntinda',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
    featured: false
  },
  {
    id: 'p4',
    name: 'Solar Panel 200W',
    price: 250000,
    category: 'electronics',
    seller: 'GreenEnergy Ltd',
    rating: 4.7,
    reviews: 45,
    location: 'Industrial Area',
    image: 'https://images.unsplash.com/photo-1509391366360-1282136eafbe?auto=format&fit=crop&q=80&w=400',
    featured: false
  }
];

export default function AgentShop() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const featuredProducts = filteredProducts.filter(p => p.featured);

  return (
    <div className="bg-[#f8fafc] dark:bg-[#1e1e1e] min-h-screen font-['Inter'] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 py-4">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#6c11d4]/10 hover:text-[#6c11d4] transition-colors -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag size={24} className="text-[#6c11d4]" />
              Welile Market
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/agent-shop/seller')} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6c11d4]/10 text-[#6c11d4] text-sm font-semibold hover:bg-[#6c11d4]/20 transition-colors">
              <Store size={16} />
              <span className="hidden sm:inline">Seller Hub</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto p-4 space-y-8 mt-2">
        
        {/* Search */}
        <section className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search products, services, sellers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border-transparent focus:border-[#6c11d4]/30 focus:ring-4 focus:ring-[#6c11d4]/10 rounded-2xl shadow-sm text-slate-900 dark:text-white transition-all outline-none"
            />
          </div>
          <button className="flex items-center justify-center w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-slate-600 dark:text-slate-400 hover:text-[#6c11d4] transition-colors">
            <SlidersHorizontal size={24} />
          </button>
        </section>

        {/* Categories */}
        <section>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all border ${
                    isActive 
                      ? 'bg-[#6c11d4] border-[#6c11d4] text-white shadow-md shadow-[#6c11d4]/20' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#6c11d4]/50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-semibold text-sm">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured Section */}
        {featuredProducts.length > 0 && activeCategory === 'all' && !searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-[#6c11d4]" /> Featured & Deals
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredProducts.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => navigate(`/agent-shop/product/${product.id}`)}
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md hover:border-[#6c11d4]/30 transition-all flex h-36"
                >
                  <div className="w-36 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">HOT</div>
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">{product.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{product.seller}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[#f59e0b] text-xs font-bold mb-1">
                        <Star size={12} fill="currentColor" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 font-normal">({product.reviews})</span>
                      </div>
                      <p className="text-[#6c11d4] font-black tracking-tight">UGX {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Products Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {searchQuery ? 'Search Results' : 'Nearby Products & Services'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => navigate(`/agent-shop/product/${product.id}`)}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md hover:border-[#6c11d4]/30 transition-all flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight mb-1">{product.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={10} />
                      <span className="truncate">{product.location}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-end justify-between">
                    <div>
                      <p className="text-[#6c11d4] font-black text-sm tracking-tight">UGX {product.price.toLocaleString()}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-[#6c11d4] group-hover:text-white transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
             <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
               <Package size={48} className="mx-auto text-slate-300 mb-4" />
               <h3 className="text-slate-900 dark:text-white font-bold mb-1">No products found</h3>
               <p className="text-slate-500 text-sm">Try adjusting your search or category filters.</p>
             </div>
          )}
        </section>

      </main>
    </div>
  );
}
