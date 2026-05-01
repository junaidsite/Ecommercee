import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, Star, Send, User } from 'lucide-react';
import { productService, type Product, type Review } from '../services/productService';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { addItem } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      Promise.all([
        productService.getProductById(id),
        productService.getReviewsByProduct(id)
      ]).then(([p, r]) => {
        setProduct(p);
        setReviews(r);
        setLoading(false);
      });
    }
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || submittingReview || !newReview.comment.trim()) return;
    
    setSubmittingReview(true);
    try {
      await productService.addReview({
        productId: id,
        userId: user.uid,
        userName: profile?.name || 'Anonymous User',
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      // Refresh reviews
      const updatedReviews = await productService.getReviewsByProduct(id);
      setReviews(updatedReviews);
      setNewReview({ rating: 5, comment: '' });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-brand-dark uppercase tracking-widest text-xs">Shopix Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-[4/5] bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100"
        >
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col py-8"
        >
          <span className="text-xs font-bold text-gold uppercase tracking-widest mb-4">In Stock</span>
          <h1 className="text-5xl font-bold mb-4 tracking-tight font-serif text-brand-dark">{product.name}</h1>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  className={cn("fill-current", star <= 4 ? "text-gold" : "text-gray-200")} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 font-medium">({reviews.length} reviews)</span>
          </div>
          <p className="text-3xl font-black text-brand-dark mb-8">{formatPrice(product.price)}</p>
          
          <p className="text-gray-500 leading-relaxed mb-10">
            {product.description || "Experience the pinnacle of craftmanship with our premium collection. Each piece is meticulously designed to bring a touch of elegance and modern sophistication to your Pakistani home."}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-12">
            <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-sm tracking-tighter">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold"
              >
                +
              </button>
            </div>
            <button 
              onClick={(e) => {
                addItem(product, quantity);
                const originalText = e.currentTarget.innerHTML;
                e.currentTarget.innerHTML = "Added to Bag!";
                const btn = e.currentTarget;
                setTimeout(() => btn.innerHTML = originalText, 1500);
              }}
              className="px-10 py-4 bg-brand-medium text-white rounded-full font-bold flex items-center gap-2 hover:bg-brand-dark transition-all shadow-xl shadow-brand-medium/10"
            >
              <ShoppingBag size={20} />
              Add to Bag
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-gold" size={24} />
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Authentic Only</div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="text-gold" size={24} />
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Express Delivery</div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="text-gold" size={24} />
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Premium Finish</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="pt-24 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Send size={18} className="text-brand-dark" /> Write a Review
                  </h3>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star 
                            size={24} 
                            className={cn(
                              star <= newReview.rating ? "text-yellow-400 fill-current" : "text-gray-200"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Experience</label>
                    <textarea 
                      required
                      placeholder="What did you love about this product?"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-gold/20 min-h-[120px] resize-none"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />
                  </div>
                  <button 
                    disabled={submittingReview}
                    className="w-full py-4 bg-brand-dark text-white rounded-full font-bold text-sm hover:bg-brand-medium transition-all disabled:opacity-50"
                  >
                    {submittingReview ? "Posting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-6 font-medium">Please login to share your experience with this product.</p>
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="w-full py-4 bg-gray-100 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-200 transition-all"
                  >
                    Login to Review
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xl">{reviews.length} Feedbacks</h3>
            </div>
            
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="py-12 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-medium italic">Be the first to review this elegant piece.</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={rev.id} 
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-off-white rounded-2xl flex items-center justify-center text-brand-medium">
                          <User size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-base">{rev.userName}</h4>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-0.5">
                            {rev.createdAt?.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={cn(
                              "fill-current",
                              star <= rev.rating ? "text-yellow-400" : "text-gray-200"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm font-medium">"{rev.comment}"</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add cn utility locally if not importing correctly or for convenience in this file
import { cn } from '../lib/utils';
