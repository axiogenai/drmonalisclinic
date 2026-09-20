'use client';

import React from 'react';
import { X, Star, CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, onClose }: QuickViewProps) {
  const { addToCart } = useCart();

  // Lock background scroll when modal is open
  React.useEffect(() => {
    if (product) {
      const lenis = typeof window !== 'undefined' ? (window as any).__lenis : null;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }

      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.documentElement.style.setProperty('overflow', 'hidden', 'important');
      document.body.style.setProperty('overflow', 'hidden', 'important');
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');

      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        if (lenis && typeof lenis.start === 'function') {
          lenis.start();
        }
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.classList.remove('overflow-hidden');
        document.body.classList.remove('overflow-hidden');
        document.body.style.paddingRight = originalPaddingRight;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [product, onClose]);

  if (!product) return null;
  const isComingSoon = product.status === 'coming_soon';
  const isOutOfStock = product.status === 'out_of_stock';

  const handleWhatsAppAction = () => {
    if (isComingSoon) {
      const msg = encodeURIComponent(
        `Hello Dr. Monali's Clinic! I want to pre-register for "${product.name}" (Hyaluronic Acid + 24K Gold Leaf). Please send me VIP early-access information upon release!`
      );
      window.open(`https://wa.me/919209472224?text=${msg}`, '_blank');
    } else if (isOutOfStock) {
      const msg = encodeURIComponent(
        `Hello Dr. Monali's Clinic! I noticed "${product.name}" is currently out of stock. Could you please let me know when it will be restocked?`
      );
      window.open(`https://wa.me/919209472224?text=${msg}`, '_blank');
    } else {
      const msg = encodeURIComponent(
        `Hello Dr. Monali's Clinic, I want to order "${product.name}" (${product.volume}) for ₹${product.price}. Please confirm availability and delivery in Kolhapur.`
      );
      window.open(`https://wa.me/919209472224?text=${msg}`, '_blank');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-[24px] shadow-2xl max-w-[760px] w-full max-h-[90vh] overflow-y-auto p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 cursor-default border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 bg-gray-100/90 hover:bg-gray-200 text-gray-700 p-1.5 rounded-full transition-all cursor-pointer shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Full-Frame 1:1 Square Product Photo */}
        <div className="w-full md:w-[46%] aspect-square rounded-2xl relative overflow-hidden shrink-0 bg-[#FAF8F5] border border-gray-100 shadow-xs">
          <img 
            src={product.image} 
            alt={product.name}
            className={`w-full h-full object-cover block select-none ${
              isComingSoon ? 'blur-[5px] scale-105' : ''
            }`}
          />
          {isComingSoon && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-10">
              <div className="bg-black/90 border-2 border-[#F0A070] text-[#F0A070] px-6 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase shadow-md mb-2">
                COMING SOON
              </div>
              <p className="text-white text-xs font-medium tracking-wide">
                Pre-Launch Formulation
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="w-full md:w-[54%] flex flex-col justify-between self-stretch py-1">
          <div>
            {/* Header: Category & Rating Row */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5 pr-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#108283] bg-[#108283]/10 px-2 py-0.5 rounded-full">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1 text-amber-600 text-[11px] font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-500 font-normal">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-gray-950 leading-snug">
              {product.name}
            </h2>
            <p className="text-[11px] font-semibold text-[#108283] mt-0.5">
              {product.subtitle} &bull; {product.volume}
            </p>

            {/* Price & Savings */}
            <div className="flex items-baseline gap-2 my-2.5">
              <span className="text-2xl font-bold text-gray-950 font-['Source_Sans_3'] tracking-tight">
                ₹{product.price}
              </span>
              <span className="text-xs text-gray-400 line-through font-['Source_Sans_3']">
                ₹{product.mrp}
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-['Source_Sans_3'] border border-emerald-100">
                Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
              </span>
            </div>

            {/* Concise Description */}
            <p className="text-[11px] text-gray-600 leading-relaxed font-light mb-3 line-clamp-2">
              {product.shortDesc || product.fullDesc}
            </p>

            {/* Key Clinical Benefits (Compact 2-point highlight) */}
            <div className="space-y-1 mb-3 bg-[#FAF8F5] p-2.5 rounded-xl border border-gray-100">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-800 mb-1">
                Clinical Highlights
              </h4>
              {product.benefits.slice(0, 2).map((b, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-700 leading-tight">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#108283] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Suitable For Chip */}
            <div className="text-[10px] text-gray-500 mb-3 flex items-center gap-1.5">
              <span className="font-bold text-gray-700">Suitable For:</span>
              <span className="truncate">{product.suitableFor}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
            {!isComingSoon && !isOutOfStock && (
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="flex-1 bg-[#108283] hover:bg-[#0c6b6c] text-white py-2.5 rounded-full font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            )}
            <button
              onClick={handleWhatsAppAction}
              className={`flex-1 py-2.5 rounded-full font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-white ${
                isComingSoon 
                  ? 'bg-[#F0A070] hover:bg-[#e28b57]' 
                  : isOutOfStock
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span>{isComingSoon ? 'Join VIP Waitlist' : isOutOfStock ? 'Enquire Restock on WhatsApp' : 'Order on WhatsApp'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
