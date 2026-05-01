import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, updateDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { formatPrice } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Trash2, Edit, Database, Loader2, DollarSign, 
  ShoppingBag, Users, CheckCircle2, Package, Clock, Ship 
} from 'lucide-react';

export const AdminPage = () => {
  const { profile } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders'>('stats');

  const isAdmin = profile?.role === 'admin';
  const isEmployee = profile?.role === 'employee' || isAdmin;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pSnap, cSnap, oSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'categories')),
          getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')))
        ]);
        setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setCategories(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setOrders(oSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const seedData = async () => {
    setSeeding(true);
    try {
      // 1. Categories
      const categoriesList = [
        { name: 'Pure Porcelain', description: 'Graceful and fine dining pieces' },
        { name: 'Kitchen Essentials', description: 'Functional tools for modern homes' },
        { name: 'Home Decor', description: 'Earthy accents and minimal art' },
        { name: 'Tea & Coffee', description: 'Artisanal sets for the perfect brew' }
      ];
      
      const catRefs = [];
      for (const cat of categoriesList) {
        const ref = await addDoc(collection(db, 'categories'), cat);
        catRefs.push({ ...cat, id: ref.id });
      }

      // 2. Products
      const initialProducts = [
        { 
          name: 'Royal Bone China Set', 
          price: 24500, 
          stock: 8, 
          categoryId: catRefs[0].id, 
          isFeatured: true, 
          description: 'A masterpiece 32-piece set of fine bone china for elite hosting.',
          imageUrl: 'https://images.unsplash.com/photo-1544991587-b842c27f8574?auto=format&fit=crop&q=80&w=800' 
        },
        { 
          name: 'Rustic Earth Plates', 
          price: 3800, 
          stock: 45, 
          categoryId: catRefs[0].id, 
          isFeatured: false, 
          description: 'Hand-crafted ceramic plates with a textured brown finish.',
          imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800' 
        },
        { 
          name: 'Turkish Copper Kettle', 
          price: 5200, 
          stock: 15, 
          categoryId: catRefs[3].id, 
          isFeatured: true, 
          description: 'Traditional hand-hammered copper kettle for authentic tea service.',
          imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800' 
        },
        { 
          name: 'Minimalist Serving Tray', 
          price: 2900, 
          stock: 20, 
          categoryId: catRefs[1].id, 
          isFeatured: false, 
          description: 'Eco-friendly bamboo tray with a sleek modern silhouette.',
          imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534802ad6cf?auto=format&fit=crop&q=80&w=800' 
        },
        { 
          name: 'Matte Grey Coffee Mugs', 
          price: 1200, 
          stock: 100, 
          categoryId: catRefs[3].id, 
          isFeatured: true, 
          description: 'Durable stoneware mugs for your morning ritual.',
          imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800' 
        }
      ];

      for (const p of initialProducts) {
        const pRef = await addDoc(collection(db, 'products'), { ...p, createdAt: serverTimestamp() });
        
        await addDoc(collection(db, 'reviews'), {
          productId: pRef.id,
          userId: 'system',
          userName: 'Zia Ahmed',
          rating: 5,
          comment: 'The quality of the porcelain is amazing. Definitely worth the price for my new Lahore home!',
          createdAt: serverTimestamp()
        });
      }

      window.location.reload();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'seed');
    } finally {
      setSeeding(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'orders');
    }
  };

  if (!isEmployee) {
    return (
      <div className="h-screen flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-500 mb-8">This portal is restricted to authorized Shopix staff only.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-brand-dark" /></div>;

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-brand-dark font-serif">Staff Portal</h1>
          <p className="text-gray-400 font-medium">Signed in as {profile?.role}</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={seedData} 
            disabled={seeding}
            className="flex items-center gap-3 px-8 py-3 bg-off-white text-brand-dark rounded-full text-sm font-bold hover:bg-white transition-all border border-gray-100"
          >
            {seeding ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
            Seed Shopix Website Data
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-12 gap-8">
        {['stats', 'products', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-brand-dark' : 'text-gray-300 hover:text-gray-500'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-dark rounded-full" />}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-700 mb-6">
              <DollarSign />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <h2 className="text-4xl font-black text-brand-dark">{formatPrice(orders.reduce((a, b) => a + (b.total || 0), 0))}</h2>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 mb-6">
              <ShoppingBag />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
            <h2 className="text-4xl font-black text-brand-dark">{orders.length}</h2>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-700 mb-6">
              <Users />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Staff</p>
            <h2 className="text-4xl font-black text-brand-dark">01</h2>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-xl font-serif">Inventory List</h3>
            {isAdmin && (
              <button className="flex items-center gap-2 px-6 py-2 bg-brand-dark text-white rounded-full text-sm font-bold shadow-lg shadow-brand-dark/10 hover:bg-brand-medium transition-all">
                <Plus size={16} /> New Product
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-8 py-6">Product Item</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6">Price</th>
                  <th className="px-8 py-6">Stock</th>
                  <th className="px-8 py-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">No products in inventory. Seed data to begin.</td></tr>
                ) : (
                  products.map(p => (
                    <tr key={p.id}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
                            <img src={p.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <span className="font-bold text-base block font-serif">{p.name}</span>
                            {p.isFeatured && <span className="text-[10px] font-black uppercase tracking-widest text-gold">Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-500">
                          {categories.find(c => c.id === p.categoryId)?.name || 'General'}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-sm">{formatPrice(p.price)}</td>
                      <td className="px-8 py-6 font-bold text-sm">{p.stock}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <button className="p-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl text-gray-400 hover:text-brand-dark transition-all"><Edit size={18} /></button>
                          {isAdmin && <button className="p-3 bg-red-50 hover:bg-white border border-transparent hover:border-red-100 rounded-2xl text-red-300 hover:text-red-600 transition-all"><Trash2 size={18} /></button>}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <h3 className="font-bold text-xl">Client Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-8 py-6">Order ID</th>
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Amount</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">No orders recorded yet.</td></tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id}>
                      <td className="px-8 py-6 font-bold text-sm tracking-widest">#{o.id.slice(-6).toUpperCase()}</td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-sm">{o.customerName}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">{o.shippingAddress}</p>
                      </td>
                      <td className="px-8 py-6 font-black text-brand-medium">{formatPrice(o.total)}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            o.status === 'delivered' ? 'bg-green-500' : 
                            o.status === 'pending' ? 'bg-gold' : 'bg-blue-500'
                          }`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{o.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <select 
                          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-gold/20"
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
