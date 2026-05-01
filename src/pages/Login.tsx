import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for email login could go here if added to service
    setError('Email login coming soon. Please use Google Login for now.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-sm border border-gray-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 tracking-tight font-serif text-brand-dark">Welcome Back</h1>
          <p className="text-gray-400 text-sm font-medium">Login to your Shopix account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                placeholder="yours@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

          <button className="w-full py-4 bg-brand-dark text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-medium transition-all shadow-xl shadow-brand-dark/10">
            <LogIn size={18} /> Login
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px bg-gray-100 flex-1" />
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Or Continue With</span>
          <div className="h-px bg-gray-100 flex-1" />
        </div>

        <button 
          onClick={async () => {
            await login();
            navigate('/');
          }}
          className="w-full mt-8 py-4 bg-white border border-gray-100 text-gray-700 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>

        <p className="mt-10 text-center text-sm text-gray-400 font-medium">
          Don't have an account? <Link to="/signup" className="text-brand-dark font-bold hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};
