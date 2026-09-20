'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Leaf, HeartHandshake, Award } from 'lucide-react';
import { products as fallbackProducts } from '@/data/products';
import { useAdminData } from '@/context/AdminDataContext';
import ProductCard from '@/components/ProductCard';
import ProductQuickViewModal from '@/components/ProductQuickViewModal';
import { Product } from '@/types/product';

export default function FeaturedProductsSection() {
  const { products: contextProducts } = useAdminData();
  const products = contextProducts && contextProducts.length > 0 ? contextProducts : fallbackProducts;
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-5 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FAEDDA] text-[#8C5E28] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#108283]" />
            Inbuilt Clinic Formulations
          </div>

          {/* Heading + Button Row (Same Line) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 
              className="font-playfair text-2xl sm:text-3xl md:text-[32px] lg:text-[38px] font-normal text-gray-900 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Doctor-Crafted <span className="text-[#108283] font-bold italic">Formulations</span> &amp; Upcoming Drops
            </h2>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#108283] hover:bg-[#0c6b6c] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-xs sm:text-sm transition-all active:scale-95 shrink-0 whitespace-nowrap shadow-xs self-start md:self-auto"
            >
              <span>Visit Complete Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm md:text-base font-light mt-2 max-w-2xl leading-relaxed">
            Clinically formulated by Dr. Monali Subhedar. Harnessing potent plant actives and dermatological science for visible results at home.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-14 pt-8 border-t border-gray-200/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-[#108283] mb-2" />
            <h5 className="font-bold text-xs text-gray-900">Physician Formulated</h5>
            <p className="text-[11px] text-gray-500 font-light mt-0.5">By Dr. Monali Subhedar</p>
          </div>
          <div className="flex flex-col items-center">
            <Leaf className="w-6 h-6 text-[#108283] mb-2" />
            <h5 className="font-bold text-xs text-gray-900">Clean &amp; Cruelty-Free</h5>
            <p className="text-[11px] text-gray-500 font-light mt-0.5">Zero harsh parabens</p>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-6 h-6 text-[#108283] mb-2" />
            <h5 className="font-bold text-xs text-gray-900">24K Gold &amp; High Actives</h5>
            <p className="text-[11px] text-gray-500 font-light mt-0.5">Pharmaceutical grade</p>
          </div>
          <div className="flex flex-col items-center">
            <HeartHandshake className="w-6 h-6 text-[#108283] mb-2" />
            <h5 className="font-bold text-xs text-gray-900">Kolhapur In-Clinic Pickup</h5>
            <p className="text-[11px] text-gray-500 font-light mt-0.5">Direct from clinic counter</p>
          </div>
        </div>

      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
