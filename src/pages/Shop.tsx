import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { productService, type Product, type Category } from '../services/productService';
import { formatPrice, cn } from '../lib/utils';
import { useCart } from '../context/CartContext';

export const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(50000);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      const [p, c] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);
      setProducts(p);
      setCategories(c);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesPrice = p.price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-10">
          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-6">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Product name..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-6">Categories</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "text-left px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  selectedCategory === 'all' ? "bg-brand-dark text-white shadow-lg shadow-brand-dark/10" : "hover:bg-off-white text-gray-500"
                )}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                    "text-left px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedCategory === cat.id ? "bg-brand-dark text-white shadow-lg shadow-brand-dark/10" : "hover:bg-off-white text-gray-500"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400">Price Range</h3>
              <span className="text-xs font-bold text-brand-dark">{formatPrice(priceRange)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50000" 
              step="500"
              className="w-full accent-brand-medium"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-100"><LayoutGrid size={18} /></button>
              <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><List size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-100 rounded-3xl animate-pulse" />
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 italic">No products found matching your criteria.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={product.id}
                    className="group"
                  >
                    <Link to={`/shop/${product.id}`}>
                      <div className="aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden relative mb-4">
                        <img 
                          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/800/1000`} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </Link>
                    <h3 className="font-bold text-lg line-clamp-1 font-serif">{product.name}</h3>
                    <p className="text-brand-medium font-bold mt-1 text-base">{formatPrice(product.price)}</p>
                    <button 
                      onClick={() => {
                        addItem(product, 1);
                        const btn = document.getElementById(`add-${product.id}`);
                        if (btn) {
                          btn.innerText = "Added!";
                          setTimeout(() => btn.innerText = "Quick Add", 1000);
                        }
                      }}
                      id={`add-${product.id}`}
                      className="w-full mt-4 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest text-brand-dark shadow-sm hover:bg-off-white transition-all opacity-0 translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0"
                    >
                      Quick Add
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
