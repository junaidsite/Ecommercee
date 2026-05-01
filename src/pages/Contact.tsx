import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const ContactPage = () => {
  return (
    <div className="px-6 py-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        <div>
          <h1 className="text-5xl font-bold mb-8 font-serif tracking-tight text-brand-dark">Get in Touch.</h1>
          <p className="text-gray-500 text-lg mb-12 leading-relaxed font-medium">
            Have questions about our collection or need help with an order? Our dedicated team at Shopix Pakistan is here to assist you.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-center">
              <div className="w-14 h-14 bg-off-white rounded-2xl flex items-center justify-center text-brand-medium"><Mail /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Email Us</p>
                <p className="font-bold text-brand-dark">hello@shopix.pk</p>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <div className="w-14 h-14 bg-off-white rounded-2xl flex items-center justify-center text-brand-medium"><Phone /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Call Us</p>
                <p className="font-bold text-brand-dark">+92 (300) 123-4567</p>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <div className="w-14 h-14 bg-off-white rounded-2xl flex items-center justify-center text-brand-medium"><MapPin /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Visit Hub</p>
                <p className="font-bold text-brand-dark">DHA Phase 6, Lahore, Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
          <form className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Full Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-gold/20 font-medium" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-gold/20 font-medium" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Message</label>
              <textarea className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-gold/20 min-h-[150px] resize-none font-medium" />
            </div>
            <button className="w-full py-5 bg-brand-dark text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-medium transition-all shadow-xl shadow-brand-dark/10">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
