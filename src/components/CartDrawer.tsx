'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    totalPrice, 
    totalItems,
    clearCart
  } = useCart();

  // Lock background scroll when cart drawer is open
  React.useEffect(() => {
    if (isCartOpen) {
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
          closeCart();
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
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    let itemsList = items
      .map((it) => `- ${it.product.name} (${it.product.volume}) x ${it.quantity} = ₹${it.product.price * it.quantity}`)
      .join('\n');

    const message = `Hello Dr. Monali's Homeopathy Clinic!\n\nI would like to place an order for the following formulations:\n${itemsList}\n\n*Total Order Value: ₹${totalPrice}*\n\nPlease confirm availability and delivery to my address.`;

    window.open(`https://wa.me/919209472224?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[130] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#108283]/10 flex items-center justify-center text-[#108283]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900">
                  Your Clinic Cart
                </h3>
                <p className="text-xs text-gray-500">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#FAF0DD] text-[#108283] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-1">
                  Your cart is empty
                </h4>
                <p className="text-xs text-gray-500 max-w-xs font-light mb-6">
                  Explore our doctor-formulated skincare and hair remedies to begin your wellness routine.
                </p>
                <button
                  onClick={closeCart}
                  className="bg-[#108283] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#0c6b6c] transition-colors"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div 
                  key={product.id}
                  className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 relative group"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-18 h-18 object-contain rounded-xl bg-white p-2 border border-gray-200/60"
                  />
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1 pr-6">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#108283] font-medium block mt-0.5">
                        {product.volume}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-['Playfair_Display'] font-bold text-sm text-gray-900">
                        ₹{product.price * quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-full bg-white px-2 py-0.5">
                        <button 
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800">
                          {quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-[#FAF0DD]/30 space-y-4">
              
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Clinic Pickup / Free Delivery
                  </span>
                  <span className="font-bold">FREE</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0DAAA]/50 flex justify-between items-baseline">
                <span className="font-['Playfair_Display'] text-base font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="font-['Playfair_Display'] text-2xl font-bold text-[#108283]">
                  ₹{totalPrice}
                </span>
              </div>

              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <span>Checkout via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-gray-500 font-light flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#108283]" />
                Direct communication with Dr. Monali&apos;s Clinic team
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
