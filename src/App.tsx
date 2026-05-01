import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  Navigate
} from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Package, Home, Info, Phone, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { cn } from './lib/utils';

// Pages
import { HomePage } from './pages/Home';
import { ShopPage } from './pages/Shop';
import { ProductDetailPage } from './pages/ProductDetail';
import { CartPage } from './pages/Cart';
import { CheckoutPage } from './pages/Checkout';
import { AdminPage } from './pages/Admin';
import { ProfilePage } from './pages/Profile';
import { FAQPage } from './pages/FAQ';
import { ContactPage } from './pages/Contact';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { Intro3D } from './components/three/Intro3D';

const NavItem = ({ to, children, icon: Icon }: { to: string, children: React.ReactNode, icon: any }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium",
        isActive ? "bg-brand-dark text-white" : "hover:bg-off-white text-gray-500"
      )}
    >
      <Icon size={18} />
      <span className="text-sm">{children}</span>
    </Link>
  );
};

const Navbar = () => {
  const { user, profile, login } = useAuth();
  const { items } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter text-brand-dark font-serif">
          SHOPIX<span className="text-gold">.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavItem to="/" icon={Home}>Home</NavItem>
          <NavItem to="/shop" icon={Package}>Products</NavItem>
          {(profile?.role === 'admin' || profile?.role === 'employee') && (
            <NavItem to="/admin" icon={Shield}>Portal</NavItem>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 hover:bg-off-white rounded-full transition-colors">
            <ShoppingCart size={22} className="text-brand-dark" />
            {items.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={items.reduce((acc, i) => acc + i.quantity, 0)}
                className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
              >
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </motion.span>
            )}
          </Link>
          
          {user ? (
            <Link to="/profile" className="p-2 hover:bg-off-white rounded-full transition-colors">
              <User size={22} className="text-brand-dark" />
            </Link>
          ) : (
            <Link 
              to="/login"
              className="px-6 py-2 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-medium transition-all shadow-lg shadow-brand-dark/10"
            >
              Login
            </Link>
          )}

          <button 
            className="md:hidden p-2 text-brand-dark"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 overflow-hidden md:hidden flex flex-col p-6 gap-6"
          >
            <Link to="/" className="text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link to="/cart" className="text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>Cart</Link>
            <Link to="/faq" className="text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
            <Link to="/contact" className="text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            {user ? (
              <Link to="/profile" className="text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
            ) : (
              <button onClick={() => { login(); setIsMobileMenuOpen(false); }} className="text-left text-lg font-bold text-brand-medium">Login</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('shopix_intro_shown');
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('shopix_intro_shown', 'true');
  };

  return (
    <Router>
      <AnimatePresence>
        {showIntro && <Intro3D onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <div className="min-h-screen bg-off-white font-sans text-gray-900 overflow-x-hidden pt-20">
        <Navbar />
        <main className="min-h-[70vh]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-100 py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-6">
              <Link to="/" className="text-3xl font-black tracking-tighter text-brand-dark font-serif">
                SHOPIX<span className="text-gold">.</span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Setting the standard for premium household experiences in Pakistan. 
                Quality you can feel, design you can see.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400">Company</h4>
              <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
                <Link to="/contact" className="hover:text-brand-medium transition-colors">Contact</Link>
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400">Support</h4>
              <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
                <Link to="/faq" className="hover:text-brand-medium transition-colors">FAQ</Link>
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400">Connect</h4>
              <div className="flex gap-4">
                {/* Social icons would go here */}
                <span className="w-10 h-10 bg-gray-50 rounded-full" />
                <span className="w-10 h-10 bg-gray-50 rounded-full" />
                <span className="w-10 h-10 bg-gray-50 rounded-full" />
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-10 border-t border-gray-100 mt-20 text-center">
            <p className="text-xs text-gray-400 font-medium">
              &copy; {new Date().getFullYear()} Shopix Ecommerce Pakistan. All items are authentic. Built with precision.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
