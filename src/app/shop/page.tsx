'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Leaf, 
  HeartHandshake, 
  Award, 
  Truck, 
  PhoneCall, 
  HelpCircle,
  ArrowRight,
  Clock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactWidget from '@/components/ContactWidget';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import ProductQuickViewModal from '@/components/ProductQuickViewModal';
import { products as fallbackProducts } from '@/data/products';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useAdminData } from '@/context/AdminDataContext';

export default function ShopPage() {
  const { products: contextProducts } = useAdminData();
  const products = contextProducts && contextProducts.length > 0 ? contextProducts : fallbackProducts;
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'serums' | 'creams' | 'hair' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { openCart, totalItems } = useCart();

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'serums', label: 'Serums & Elixirs' },
    { id: 'creams', label: 'Barrier Creams' },
    { id: 'hair', label: 'Hair & Scalp' },
    { id: 'upcoming', label: 'Upcoming Drops' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory === 'upcoming') {
        if (p.status !== 'coming_soon') return false;
      } else if (selectedCategory !== 'all') {
        if (p.category !== selectedCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSubtitle = p.subtitle.toLowerCase().includes(q);
        const matchesActives = p.keyActives.some((act) => act.toLowerCase().includes(q));
        if (!matchesName && !matchesSubtitle && !matchesActives) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-white text-gray-800 font-['Source_Sans_3']">
      <Navbar />

      {/* 1. Product Grid & Static Category Filter */}
      <section className="pt-28 md:pt-36 pb-16 md:pb-24 bg-[#FAF0DD]/20 min-h-screen">
        <div className="max-w-[1140px] mx-auto px-5 md:px-8">
          
          {/* Controls: Search & Category Pills (Static In-Place) */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-200/90 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#108283] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ingredient or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F4F7F8] focus:bg-white text-xs text-gray-800 placeholder-gray-400 pl-9 pr-4 py-2.5 rounded-full border border-gray-200/80 focus:border-[#108283]/40 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Section subtitle */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#108283]">
                {selectedCategory === 'all' 
                  ? 'Catalog Overview' 
                  : selectedCategory === 'upcoming' 
                  ? 'Exclusive Pre-Launch' 
                  : categories.find(c => c.id === selectedCategory)?.label}
              </p>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Formulation' : 'Formulations'}
              </h2>
            </div>

            {totalItems > 0 && (
              <button
                onClick={openCart}
                className="inline-flex items-center gap-2 bg-[#108283] hover:bg-[#0c6b6c] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>View Cart ({totalItems})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-800">
                No products found
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Try searching for different keywords or select &quot;All Products&quot;.
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-4 bg-[#108283] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#0c6b6c]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. Clinic Consultation Prescription Banner */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-[1140px] mx-auto px-5 md:px-8">
          <div className="bg-gradient-to-r from-[#108283] to-[#0c6b6c] rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Personalized Skincare Plan
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl font-normal leading-tight">
                Not sure which formulation is right for your skin?
              </h3>
              <p className="text-white/85 text-sm md:text-base font-light leading-relaxed">
                Book an in-person consultation with Dr. Monali Subhedar at our Kolhapur clinic for comprehensive skin diagnostics and a tailored treatment prescription.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <a
                href="/#booking"
                className="bg-white text-[#108283] hover:bg-[#FAF0DD] px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-center transition-all shadow-md active:scale-95"
              >
                Book Clinic Visit
              </a>
              <a
                href="https://wa.me/919209472224?text=Hello%20Dr.%20Monali%27s%20Clinic%2C%20I%20would%20like%20guidance%20on%20choosing%20the%20right%20skincare%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-center transition-all shadow-md active:scale-95"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Shop FAQs */}
      <section className="py-20 md:py-24 bg-[#F4F7F8]/70">
        <div className="max-w-[840px] mx-auto px-5 md:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FAEDDA] text-[#8C5E28] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-normal text-gray-900">
              About Our <span className="text-[#108283] font-bold italic">Formulations</span>
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <h4 className="font-bold text-sm text-gray-900 mb-1 font-['Playfair_Display'] text-base">
                How can I purchase products from the clinic?
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                You can pick up products directly from our Kolhapur clinic counter (Golden Spring Apartment, Near Ring Road), or click &quot;Order on WhatsApp&quot; for direct home delivery across Kolhapur and Maharashtra.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <h4 className="font-bold text-sm text-gray-900 mb-1 font-['Playfair_Display'] text-base">
                When will the upcoming HA Glow Serum be available?
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Dr. Monali&apos;s HA Glow Serum (Hyaluronic Acid + 24K Gold Leaf) is undergoing final stability and clinical patch testing. Click &quot;Join VIP Waitlist&quot; to receive priority notification and exclusive launch pricing when the first limited batch arrives!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <h4 className="font-bold text-sm text-gray-900 mb-1 font-['Playfair_Display'] text-base">
                Are these products safe to use with homeopathic medicines?
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Yes, absolutely! Since our formulations are developed in-house by Dr. Monali Subhedar, they are free from strong synthetic camphors and menthol that interfere with constitutional homeopathic remedies.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Global & Overlay Elements */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <CartDrawer />
      <Footer />
      <ContactWidget />
    </main>
  );
}
