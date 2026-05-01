import { motion } from 'motion/react';
import { ShoppingBag, ChevronRight, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="px-8 py-4 bg-brand-medium text-white rounded-full font-bold hover:bg-brand-dark transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/shop" className="p-2 hover:bg-white rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-4xl font-bold tracking-tight font-serif text-brand-dark">Shopping Bag</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-50 shadow-sm"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1 font-serif">{item.name}</h3>
                    <p className="text-sm text-gray-400 font-medium">Premium Quality</p>
                  </div>
                  <p className="font-bold text-brand-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900 disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-100 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 sticky top-24">
            <h3 className="text-xl font-bold mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-gold font-bold uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-black text-2xl text-brand-dark">{formatPrice(total)}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-brand-dark text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-medium transition-all shadow-lg shadow-brand-dark/10 mb-4"
            >
              Proceed to Checkout
              <ChevronRight size={20} />
            </button>
            <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
              Secure Checkout • 30 Day Returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
