import { motion } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqData = [
  { q: "How long does delivery take inside Pakistan?", a: "Standard delivery takes 3-5 business days across all major cities including Karachi, Lahore, and Islamabad." },
  { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy if the product is damaged or not as described." },
  { q: "Do you offer cash on delivery?", a: "Yes, we currently offer Cash on Delivery (COD) as our primary payment method for your security." },
  { q: "Is the crockery microwave safe?", a: "Most of our porcelain items are microwave safe unless they have gold or silver trim. Please check the product description." }
];

export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="px-6 py-24 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 tracking-tight font-serif text-brand-dark">Common Questions</h1>
        <p className="text-gray-400 font-medium tracking-wide italic">Everything you need to know about Shopix.</p>
      </div>
      
      <div className="space-y-4">
        {faqData.map((item, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className={`w-full px-8 py-6 flex items-center justify-between text-left transition-all font-bold font-serif text-lg ${openIndex === i ? 'text-gold bg-off-white' : 'text-brand-dark hover:bg-off-white'}`}
            >
              {item.q}
              <ChevronDown className={`transition-transform ${openIndex === i ? 'rotate-180 text-gold' : 'text-gray-400'}`} />
            </button>
            {openIndex === i && (
              <div className="px-8 pb-6 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4 font-medium">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
