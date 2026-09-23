'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Truck, 
  MapPin, 
  Home, 
  Building2, 
  User, 
  Phone, 
  CheckCircle2, 
  IndianRupee 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useDialog } from '@/context/DialogContext';

interface DeliveryDetails {
  method: 'home' | 'pickup';
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
  state: string;
  notes: string;
}

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
  const { toast } = useDialog();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'delivery'>('cart');

  const [deliveryData, setDeliveryData] = useState<DeliveryDetails>({
    method: 'home',
    fullName: '',
    phone: '',
    addressLine: '',
    city: 'Kolhapur',
    pincode: '',
    state: 'Maharashtra',
    notes: '',
  });

  // Load saved delivery address from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('clinic_user_delivery_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDeliveryData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn('Could not load saved address:', e);
    }
  }, []);

  // Reset to cart step whenever cart is reopened
  useEffect(() => {
    if (isCartOpen) {
      setCheckoutStep('cart');
    }
  }, [isCartOpen]);

  // Lock background scroll when cart drawer is open
  useEffect(() => {
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

  const handleProceedToDelivery = () => {
    if (items.length === 0) return;
    setCheckoutStep('delivery');
  };

  const handleConfirmOrderWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!deliveryData.fullName.trim() || deliveryData.fullName.trim().length < 3) {
      toast({
        title: 'Full Name Required',
        message: 'Please enter your recipient name (at least 3 characters).',
        type: 'error',
      });
      return;
    }

    const cleanPhone = deliveryData.phone.replace(/[\s\-()]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast({
        title: 'Valid Phone Required',
        message: 'Please enter a valid 10-digit mobile number.',
        type: 'error',
      });
      return;
    }

    if (deliveryData.method === 'home') {
      if (!deliveryData.addressLine.trim() || deliveryData.addressLine.trim().length < 5) {
        toast({
          title: 'Delivery Address Required',
          message: 'Please enter your street address, building, or landmark for courier delivery.',
          type: 'error',
        });
        return;
      }

      if (!deliveryData.city.trim()) {
        toast({
          title: 'City Required',
          message: 'Please enter your city/town.',
          type: 'error',
        });
        return;
      }

      if (!/^\d{6}$/.test(deliveryData.pincode.trim())) {
        toast({
          title: 'Valid 6-Digit Pincode Required',
          message: 'Please enter a valid 6-digit postal pincode.',
          type: 'error',
        });
        return;
      }
    }

    // Save address to localStorage for future orders
    try {
      localStorage.setItem('clinic_user_delivery_address', JSON.stringify(deliveryData));
    } catch (e) {
      console.warn('Could not save address to localStorage:', e);
    }

    // Build Itemized List
    const itemsList = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.product.name}* (${it.product.volume || 'Standard'})\n   Quantity: ${it.quantity} | Price: ₹${it.product.price * it.quantity}`
      )
      .join('\n');

    // Build Address Section
    let addressBlock = '';
    if (deliveryData.method === 'home') {
      addressBlock = 
        `🏠 *Delivery Method:* Home Delivery (Free Courier)\n` +
        `📍 *Address:* ${deliveryData.addressLine.trim()}\n` +
        `🏙️ *City:* ${deliveryData.city.trim()}\n` +
        `📮 *Pincode:* ${deliveryData.pincode.trim()}\n` +
        `🗺️ *State:* ${deliveryData.state.trim() || 'Maharashtra'}`;
    } else {
      addressBlock = 
        `🏥 *Delivery Method:* Self Clinic Pickup\n` +
        `📍 *Pickup Location:* Dr. Monali's Clinic, Opp. Circuit House, Kolhapur`;
    }

    const message = 
      `Hello Dr. Monali's Homeopathy Clinic!\n\n` +
      `🌿 *NEW FORMULATION ORDER REQUEST*\n` +
      `===================================\n\n` +
      `📦 *ORDERED PRODUCTS:*\n` +
      `${itemsList}\n\n` +
      `💰 *Total Amount:* ₹${totalPrice}\n` +
      `🚚 *Shipping Fee:* FREE\n\n` +
      `-----------------------------------\n` +
      `👤 *PATIENT / RECIPIENT DETAILS:*\n` +
      `Name: ${deliveryData.fullName.trim()}\n` +
      `Phone: ${cleanPhone}\n` +
      `${addressBlock}\n` +
      (deliveryData.notes.trim() ? `📝 *Special Instructions:* ${deliveryData.notes.trim()}\n` : '') +
      `===================================\n` +
      `Please confirm stock availability and share payment instructions (UPI / Bank Transfer / COD). Thank you!`;

    window.open(`https://wa.me/919209472224?text=${encodeURIComponent(message)}`, '_blank');

    toast({
      title: 'Order Sent to WhatsApp!',
      message: 'Our dispensary team will verify formulation stock and confirm your delivery.',
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-[130] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              {checkoutStep === 'delivery' ? (
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="p-1.5 -ml-1 text-gray-500 hover:text-[#108283] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  title="Back to items"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#108283]/10 flex items-center justify-center text-[#108283] shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                  {checkoutStep === 'cart' ? 'Your Clinic Cart' : 'Delivery & Recipient Address'}
                </h3>
                <p className="text-xs text-gray-500">
                  {checkoutStep === 'cart'
                    ? `${totalItems} ${totalItems === 1 ? 'item' : 'items'} selected`
                    : 'Step 2 of 2 • Order Destination'}
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

          {/* Body Content */}
          {checkoutStep === 'cart' ? (
            /* STEP 1: CART ITEMS LIST */
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
                  <div className="w-16 h-16 rounded-full bg-[#FAF0DD] text-[#108283] flex items-center justify-center mb-4 shadow-xs">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-1">
                    Your cart is empty
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs font-light mb-6 font-['Source_Sans_3']">
                    Explore our doctor-formulated clinical skincare and homeopathic remedies to begin your wellness routine.
                  </p>
                  <button
                    onClick={closeCart}
                    className="bg-[#108283] hover:bg-[#0c6b6c] text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div 
                    key={product.id}
                    className="flex gap-3.5 p-3.5 bg-gray-50/80 hover:bg-gray-50 rounded-2xl border border-gray-100 relative group transition-all"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200/80 p-0.5">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/100x100/FAF0DD/108283?text=Rx';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between min-w-0 pr-1">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="font-['Playfair_Display'] text-sm font-bold text-gray-900 truncate" title={product.name}>
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-gray-400 font-medium block">
                            {product.volume || 'Standard Pack'}
                          </span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-1 -mr-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-sm text-gray-950 font-['Source_Sans_3']">
                          ₹{product.price * quantity}
                        </span>

                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs">
                          <button 
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800 font-mono">
                            {quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
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
          ) : (
            /* STEP 2: ADDRESS & DELIVERY FORM */
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 font-['Source_Sans_3']">
              {/* Delivery Method Segmented Tabs */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Choose Delivery Method <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryData({ ...deliveryData, method: 'home' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryData.method === 'home'
                        ? 'bg-[#108283]/10 border-[#108283] text-[#108283] ring-1 ring-[#108283]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Home Delivery (Free)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryData({ ...deliveryData, method: 'pickup' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryData.method === 'pickup'
                        ? 'bg-[#108283]/10 border-[#108283] text-[#108283] ring-1 ring-[#108283]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Clinic Pickup</span>
                  </button>
                </div>
              </div>

              {deliveryData.method === 'pickup' ? (
                <div className="p-3.5 bg-[#FAF0DD]/60 rounded-xl border border-[#D4AF37]/30 text-xs text-gray-700 space-y-1">
                  <p className="font-bold text-[#108283] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 shrink-0 text-[#108283]" />
                    <span>Dr. Monali&apos;s Clinic Pickup Counter</span>
                  </p>
                  <p className="text-[11.5px] text-gray-600 leading-relaxed pl-5">
                    Opposite Circuit House, Tarabai Park / Kolhapur. Order will be packed and kept ready at the front reception.
                  </p>
                </div>
              ) : null}

              {/* Full Name & Phone */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Recipient / Patient Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Patil"
                      value={deliveryData.fullName}
                      onChange={(e) => setDeliveryData({ ...deliveryData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile (for delivery updates)"
                      maxLength={10}
                      value={deliveryData.phone}
                      onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Home Delivery Specific Fields */}
              {deliveryData.method === 'home' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Street Address / Flat / Building / Landmark <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        rows={2}
                        required
                        placeholder="House/Flat number, Building name, Street, Landmark..."
                        value={deliveryData.addressLine}
                        onChange={(e) => setDeliveryData({ ...deliveryData, addressLine: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        City / Town <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kolhapur"
                        value={deliveryData.city}
                        onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Pincode <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="6-digit pincode"
                        maxLength={6}
                        value={deliveryData.pincode}
                        onChange={(e) => setDeliveryData({ ...deliveryData, pincode: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={deliveryData.state}
                      onChange={(e) => setDeliveryData({ ...deliveryData, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Delivery Notes */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Delivery Notes / Doctor Advice Queries (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery, urgent dispatch..."
                  value={deliveryData.notes}
                  onChange={(e) => setDeliveryData({ ...deliveryData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="pt-1 flex items-center gap-2 text-[11px] text-gray-500 font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Address securely stored for your next refill.</span>
              </div>
            </div>
          )}

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-gray-100 bg-[#FAF0DD]/30 space-y-3.5">
              
              <div className="space-y-1.5 text-xs text-gray-600 font-['Source_Sans_3']">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> 
                    {deliveryData.method === 'pickup' ? 'Clinic Pickup' : 'All-India Courier Delivery'}
                  </span>
                  <span className="font-bold">FREE</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0DAAA]/50 flex justify-between items-baseline font-['Playfair_Display']">
                <span className="text-base font-bold text-gray-900">
                  Total Payable
                </span>
                <span className="text-2xl font-bold text-[#108283]">
                  ₹{totalPrice}
                </span>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  type="button"
                  onClick={handleProceedToDelivery}
                  className="w-full bg-[#108283] hover:bg-[#0c6b6c] text-white py-3.5 rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer font-['Source_Sans_3']"
                >
                  <span>Proceed to Delivery &amp; Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmOrderWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer font-['Source_Sans_3']"
                >
                  <span>Place Order via WhatsApp (₹{totalPrice})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <p className="text-[11px] text-center text-gray-500 font-light flex items-center justify-center gap-1 font-['Source_Sans_3']">
                <ShieldCheck className="w-3.5 h-3.5 text-[#108283]" />
                Direct communication with Dr. Monali&apos;s Clinic Dispensary
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
