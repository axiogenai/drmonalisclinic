'use client';

import React from 'react';
import { ShoppingBag, Star, Clock, MessageCircle } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const isComingSoon = product.status === 'coming_soon';
  const isOutOfStock = product.status === 'out_of_stock';

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hello Dr. Monali's Clinic, I would like to order "${product.name}" (${product.volume}) for ₹${product.price}. Please confirm availability.`
    );
    window.open(`https://wa.me/919209472224?text=${msg}`, '_blank');
  };

  const handleWhatsAppWaitlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hello Dr. Monali's Clinic! I want to join the VIP Priority Waitlist for "${product.name}". Please notify me upon launch!`
    );
    window.open(`https://wa.me/919209472224?text=${msg}`, '_blank');
  };

  const handleWhatsAppRestock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hello Dr. Monali's Clinic! I noticed "${product.name}" is currently out of stock. Could you please let me know when it will be restocked?`
    );
    window.open(`https://wa.me/919209472224?text=${msg}`, '_blank');
  };

  return (
    <div className="group relative bg-[#FCFBF8] rounded-[20px] border border-[#EBE6DD] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      {/* 1. Visual Showcase Canvas - Compact edge-to-edge product photo */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-[16/10] sm:h-44 overflow-hidden cursor-pointer bg-[#F4EDE2]"
      >
        {/* Full Image with object-cover */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center select-none ${
            isComingSoon ? 'blur-[5px]' : isOutOfStock ? 'grayscale-[30%]' : ''
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/600x600/FAF0DD/108283?text=' + encodeURIComponent(product.name);
          }}
        />

        {/* Coming Soon Center Overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center z-10">
            <div className="bg-black/90 border-2 border-[#F0A070] text-[#F0A070] px-4 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-1.5 shadow-md">
              COMING SOON
            </div>
            <p className="text-white text-[10px] font-medium tracking-wide">
              Pre-Launch Formulation
            </p>
          </div>
        )}

        {/* Out of Stock Center Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 text-center z-10">
            <div className="bg-rose-600 text-white px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-1 shadow-md">
              OUT OF STOCK
            </div>
          </div>
        )}

        {/* Top Badges overlay on image */}
        {product.badge && !isComingSoon && !isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm bg-[#108283] text-white">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* 2. Editorial Product Content */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-grow">
        <div>
          {/* Rating & Volume Row */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1 font-['Source_Sans_3']">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="ml-1 font-bold text-gray-900">{product.rating}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-light">
                {product.reviewsCount} {isComingSoon ? 'waitlist' : 'reviews'}
              </span>
            </div>
            <span className="text-[10px] font-medium text-gray-500 bg-neutral-100 px-1.5 py-0.5 rounded">
              {product.volume.split('|')[0].trim()}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-playfair text-[15px] sm:text-[16px] font-semibold text-gray-950 leading-tight cursor-pointer line-clamp-1 mb-0.5 hover:text-[#108283] transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {product.name}
          </h3>

          {/* Key Actives Formula */}
          <p className="text-[11px] font-medium text-[#108283] line-clamp-1 mb-1 font-['Source_Sans_3']">
            {product.subtitle}
          </p>

          {/* Short description */}
          <p className="text-[11px] text-gray-500 font-light line-clamp-1 leading-snug mb-2.5 font-['Source_Sans_3']">
            {product.shortDesc}
          </p>
        </div>

        {/* 3. Pricing & Elegant Modern Action */}
        <div className="pt-2.5 border-t border-gray-200/60 mt-auto">
          <div className="flex items-baseline justify-between mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-950 font-['Source_Sans_3'] tracking-tight">
                ₹{product.price}
              </span>
              <span className="text-xs text-gray-400 line-through font-['Source_Sans_3']">
                ₹{product.mrp}
              </span>
            </div>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-['Source_Sans_3'] border border-emerald-100">
              Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
            </span>
          </div>

          {isComingSoon ? (
            <button
              onClick={handleWhatsAppWaitlist}
              className="w-full bg-[#F0A070] hover:bg-[#e28b57] text-white py-2 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer font-['Source_Sans_3'] transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Join VIP Priority Waitlist</span>
            </button>
          ) : isOutOfStock ? (
            <button
              onClick={handleWhatsAppRestock}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer font-['Source_Sans_3'] transition-colors border border-stone-200"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#108283]" />
              <span>Enquire Restock on WhatsApp</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-[#108283] hover:bg-[#0c6b6c] text-white py-2 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer font-['Source_Sans_3'] transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleWhatsAppOrder}
                title="Order on WhatsApp"
                className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center cursor-pointer shrink-0 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



