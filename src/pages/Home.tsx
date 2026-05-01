import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Star, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero3D } from '../components/three/Hero3D';
import { formatPrice } from '../lib/utils';

export const HomePage = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 lg:px-12 overflow-hidden">
        <Hero3D />
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
              New Collection 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-brand-dark font-serif">
              Elegance <br /> In Every <br /> Detail.
            </h1>
            <p className="text-lg text-gray-500 max-w-md mb-10 leading-relaxed font-medium">
              Discover our curated collection of premium crockery and household essentials designed for the modern Pakistani home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="px-8 py-4 bg-brand-medium text-white rounded-full font-bold flex items-center gap-2 hover:bg-brand-dark transition-all group shadow-xl shadow-brand-medium/10">
                Shop Collection
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop?featured=true" className="px-8 py-4 bg-white border border-gray-100 text-brand-dark rounded-full font-bold hover:bg-off-white transition-all">
                View Featured
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: ShieldCheck, title: "Premium Quality", desc: "Handpicked durable materials for longevity." },
            { icon: Truck, title: "Nationwide Delivery", desc: "Fast and secure shipping across Pakistan." },
            { icon: Star, title: "Trusted Brand", desc: "Serving thousands of happy households." },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 bg-off-white rounded-2xl flex items-center justify-center text-brand-medium">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-gray-500 max-w-[250px]">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products Mini-Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-gold font-bold text-xs uppercase tracking-widest mb-2">Editor's Choice</p>
              <h2 className="text-4xl font-bold tracking-tight text-brand-dark">Signature Pieces</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-brand-medium hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Placeholder items for now, will fetch from Firebase later */}
            {[1, 2, 3, 4].map((item) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] bg-gray-100 rounded-3xl mb-4 overflow-hidden relative">
                  <img 
                    src={`https://picsum.photos/seed/shopix-${item}/800/1000`} 
                    alt="Product" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <button className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ShoppingBag size={20} className="text-brand-medium" />
                  </button>
                </div>
                <h4 className="font-bold text-lg">{item === 1 ? 'Royal Bone China' : 'Premium Set'}</h4>
                <p className="text-sm text-gray-500 mb-1">Crockery</p>
                <p className="text-brand-medium font-bold">{formatPrice(4500)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
