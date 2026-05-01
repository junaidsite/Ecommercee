import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatPrice } from '../lib/utils';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfilePage = () => {
  const { user, profile, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const q = query(
        collection(db, 'orders'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="text-green-500" />;
      case 'shipped': return <Truck className="text-blue-500" />;
      case 'pending': return <Clock className="text-gold" />;
      default: return <Package className="text-gray-400" />;
    }
  };

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-off-white rounded-full flex items-center justify-center mx-auto mb-6 text-brand-dark text-4xl font-black font-serif">
               {profile?.name?.[0]}
            </div>
            <h2 className="text-2xl font-bold mb-1 font-serif text-brand-dark">{profile?.name}</h2>
            <p className="text-sm text-gray-400 mb-6 font-medium">{profile?.email}</p>
            <div className="inline-block px-4 py-1.5 bg-off-white text-brand-medium text-[10px] font-black uppercase tracking-widest rounded-full mb-10">
              Role: {profile?.role}
            </div>
            <button 
              onClick={logout}
              className="w-full py-4 bg-red-50 text-red-600 rounded-full font-bold hover:bg-red-100 transition-all text-sm"
            >
              Logout Account
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <h3 className="text-2xl font-bold mb-8 font-serif text-brand-dark">My Orders</h3>
          <div className="space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-white rounded-3xl" />
                <div className="h-24 bg-white rounded-3xl" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-[40px] p-12 text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium italic">You haven't placed any orders yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="font-bold text-base mb-1">Order #{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-black">
                        {order.createdAt?.toDate().toLocaleDateString()} • {order.items?.length} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
                    <p className="text-xl font-black text-brand-dark">{formatPrice(order.total)}</p>
                    <span className="px-4 py-1 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
