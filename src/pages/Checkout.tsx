import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    address: '',
    city: '',
    phone: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);

    const orderPath = 'orders';
    try {
      const orderData = {
        userId: auth.currentUser.uid,
        customerName: formData.name,
        shippingAddress: `${formData.address}, ${formData.city}`,
        phone: formData.phone,
        total,
        status: 'pending',
        createdAt: serverTimestamp(),
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      await addDoc(collection(db, orderPath), orderData);
      setSuccess(true);
      await clearCart();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, orderPath);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-4xl font-bold mb-4 font-serif">Order Confirmed!</h2>
        <p className="text-gray-500 mb-10 max-w-sm">Thank you for shopping with Shopix. Your premium household items will arrive soon.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-10 py-4 bg-brand-medium text-white rounded-full font-bold hover:bg-brand-dark transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate('/cart')} className="p-2 hover:bg-white rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold tracking-tight font-serif text-brand-dark">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-bold mb-4">Shipping Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-gold/20"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Address</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-gold/20"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">City</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-gold/20"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-gold/20"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-bold mb-4">Payment Method</h3>
              <div className="p-4 bg-off-white border border-gray-100 rounded-2xl flex items-center justify-between">
                <span className="font-bold text-brand-dark text-sm">Cash on Delivery</span>
                <div className="w-6 h-6 bg-brand-medium rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 size={16} />
                </div>
              </div>
            </div>

            <button 
              disabled={loading || items.length === 0}
              className="w-full py-5 bg-brand-dark text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-medium transition-all shadow-xl shadow-brand-dark/10"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Place Order"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 className="text-lg font-bold mb-6">Your Order</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto mb-6 pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{item.quantity}x <span className="font-bold text-gray-900">{item.name}</span></span>
                  <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
              <span className="font-bold text-xl">Total</span>
              <span className="font-black text-2xl text-brand-dark">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
