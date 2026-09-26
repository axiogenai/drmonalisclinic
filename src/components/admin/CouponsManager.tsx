'use client';

import React, { useState, useRef } from 'react';
import { 
  TicketPercent, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  Clock, 
  Users, 
  IndianRupee, 
  Percent, 
  ShieldAlert, 
  Calendar,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useDialog } from '@/context/DialogContext';
import { Coupon } from '@/types/admin';
import AdminModal from './AdminModal';

function toDateTimeLocal(isoDateStr?: string): string {
  if (!isoDateStr) return '';
  const date = new Date(isoDateStr);
  if (isNaN(date.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
}

export default function CouponsManager() {
  const { 
    coupons, 
    addCoupon, 
    updateCoupon, 
    deleteCoupon, 
    resetCoupons 
  } = useAdminData();
  const { toast, confirm } = useDialog();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'exhausted' | 'inactive'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const tabScrollRef = useRef<HTMLDivElement>(null);
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabScrollRef.current) {
      const scrollAmount = direction === 'left' ? -120 : 120;
      tabScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [maxDiscount, setMaxDiscount] = useState<number>(0);
  const [maxUses, setMaxUses] = useState<number>(50);
  const [usedCount, setUsedCount] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    toast({
      title: 'Coupon Code Copied!',
      message: `"${couponCode}" copied to clipboard.`,
      type: 'success',
    });
    setTimeout(() => {
      setCopiedCode((prev) => (prev === couponCode ? null : prev));
    }, 2000);
  };

  const openAddModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderAmount(0);
    setMaxDiscount(0);
    setMaxUses(50);
    setUsedCount(0);
    
    // Default start now, expiry 30 days later
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 30);
    
    setStartDate(toDateTimeLocal(now.toISOString()));
    setExpiresAt(toDateTimeLocal(expiry.toISOString()));
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || '');
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setMinOrderAmount(coupon.minOrderAmount || 0);
    setMaxDiscount(coupon.maxDiscount || 0);
    setMaxUses(coupon.maxUses || 1);
    setUsedCount(coupon.usedCount || 0);
    setStartDate(toDateTimeLocal(coupon.startDate));
    setExpiresAt(toDateTimeLocal(coupon.expiresAt));
    setIsActive(coupon.isActive);
    setIsModalOpen(true);
  };

  const handleToggleActive = (coupon: Coupon) => {
    const nextState = !coupon.isActive;
    updateCoupon(coupon.id, { isActive: nextState });
    toast({
      title: nextState ? 'Coupon Activated' : 'Coupon Deactivated',
      message: `Coupon code "${coupon.code}" is now ${nextState ? 'active and ready for patients' : 'disabled'}.`,
      type: 'info',
    });
  };

  const handleDelete = async (coupon: Coupon) => {
    const isConfirmed = await confirm({
      title: 'Delete Coupon Code?',
      message: `Are you sure you want to permanently delete coupon "${coupon.code}"? Customers will no longer be able to use it.`,
      confirmText: 'Delete Coupon',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (isConfirmed) {
      deleteCoupon(coupon.id);
      toast({
        title: 'Coupon Deleted',
        message: `Coupon "${coupon.code}" has been removed.`,
        type: 'success',
      });
    }
  };

  const handleResetDefaults = async () => {
    const isConfirmed = await confirm({
      title: 'Restore Default Coupons?',
      message: 'This will reset your clinic coupons list back to the recommended starting set (WELCOME10, GLOW200, FESTIVE50).',
      confirmText: 'Restore Defaults',
      cancelText: 'Cancel',
      type: 'warning',
    });

    if (isConfirmed) {
      resetCoupons();
      toast({
        title: 'Coupons Reset',
        message: 'Default promo coupons have been restored.',
        type: 'success',
      });
    }
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) {
      toast({
        title: 'Invalid Code',
        message: 'Please provide a valid alphanumeric coupon code (e.g. MONALI20).',
        type: 'error',
      });
      return;
    }

    // Check code duplication if adding new, or if code changed
    const duplicate = coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.id !== editingCoupon?.id
    );
    if (duplicate) {
      toast({
        title: 'Code Already Exists',
        message: `A coupon with code "${cleanCode}" is already registered. Please choose a unique code.`,
        type: 'error',
      });
      return;
    }

    if (!discountValue || discountValue <= 0) {
      toast({
        title: 'Invalid Discount',
        message: 'Please specify a discount value greater than 0.',
        type: 'error',
      });
      return;
    }

    if (discountType === 'percentage' && discountValue > 100) {
      toast({
        title: 'Percentage Limit',
        message: 'Percentage discount cannot exceed 100%.',
        type: 'error',
      });
      return;
    }

    if (!maxUses || maxUses < 1) {
      toast({
        title: 'Usage Limit Required',
        message: 'Please set a limited uses limit of at least 1 redemption.',
        type: 'error',
      });
      return;
    }

    if (!expiresAt) {
      toast({
        title: 'Expiry Date Required',
        message: 'Please set an expiration date and time for this limited-time offer.',
        type: 'error',
      });
      return;
    }

    const startIso = startDate ? new Date(startDate).toISOString() : new Date().toISOString();
    const expiryIso = new Date(expiresAt).toISOString();

    if (new Date(expiryIso).getTime() <= new Date(startIso).getTime()) {
      toast({
        title: 'Invalid Date Range',
        message: 'Expiration date must be later than the start date.',
        type: 'error',
      });
      return;
    }

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: cleanCode,
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscount: discountType === 'percentage' && maxDiscount > 0 ? Number(maxDiscount) : undefined,
        maxUses: Number(maxUses),
        usedCount: Number(usedCount) || 0,
        startDate: startIso,
        expiresAt: expiryIso,
        isActive,
      });

      toast({
        title: 'Coupon Updated',
        message: `Coupon "${cleanCode}" updated successfully.`,
        type: 'success',
      });
    } else {
      const newCoupon: Coupon = {
        id: `coupon-${Date.now()}`,
        code: cleanCode,
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscount: discountType === 'percentage' && maxDiscount > 0 ? Number(maxDiscount) : undefined,
        maxUses: Number(maxUses),
        usedCount: 0,
        startDate: startIso,
        expiresAt: expiryIso,
        isActive,
        createdAt: new Date().toISOString(),
      };

      addCoupon(newCoupon);

      toast({
        title: 'Coupon Issued!',
        message: `New discount coupon "${cleanCode}" is now live.`,
        type: 'success',
      });
    }

    setIsModalOpen(false);
  };

  // Metrics Calculations
  const nowTime = Date.now();
  const totalCouponsCount = coupons.length;
  const activeCouponsCount = coupons.filter(
    (c) => c.isActive && new Date(c.expiresAt).getTime() > nowTime && c.usedCount < c.maxUses
  ).length;
  const expiredOrExhaustedCount = coupons.filter(
    (c) => new Date(c.expiresAt).getTime() <= nowTime || c.usedCount >= c.maxUses
  ).length;
  const totalCouponsUsedCount = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  // Filtered List
  const filteredCoupons = coupons.filter((coupon) => {
    const isExpired = new Date(coupon.expiresAt).getTime() <= nowTime;
    const isExhausted = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
    const isAct = coupon.isActive && !isExpired && !isExhausted;

    // Status filter
    if (statusFilter === 'active' && !isAct) return false;
    if (statusFilter === 'expired' && !isExpired) return false;
    if (statusFilter === 'exhausted' && !isExhausted) return false;
    if (statusFilter === 'inactive' && coupon.isActive) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const codeMatch = coupon.code.toLowerCase().includes(q);
      const descMatch = (coupon.description || '').toLowerCase().includes(q);
      return codeMatch || descMatch;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#108283]/10 text-[#108283]">
              <TicketPercent className="w-5 h-5" />
            </span>
            <h1 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900">
              Coupons &amp; Product Discounts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-['Source_Sans_3']">
            Issue discount coupons with strict limits on usage count and expiration date for clinic products.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-[#108283]/30 bg-[#108283]/5 hover:bg-[#108283]/10 text-[#108283] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="How to Use Coupons Guide"
          >
            <HelpCircle className="w-4 h-4 text-[#108283]" />
            <span>How to Use Coupons</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default coupons"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#108283] hover:bg-[#0d6e6f] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer font-['Source_Sans_3']"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Coupon</span>
          </button>
        </div>
      </div>

      {/* Metrics Row - 4 Balanced Cards on Desktop & Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Metric 1: Total Coupons */}
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3.5">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#108283]/10 text-[#108283] flex items-center justify-center shrink-0">
            <TicketPercent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-gray-500 font-['Source_Sans_3'] truncate">Total Coupons</p>
            <p className="text-base sm:text-2xl font-bold text-gray-900 font-['Playfair_Display']">
              {totalCouponsCount}
            </p>
          </div>
        </div>

        {/* Metric 2: Active & Ready */}
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3.5">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-gray-500 font-['Source_Sans_3'] truncate">Active &amp; Ready</p>
            <p className="text-base sm:text-2xl font-bold text-emerald-600 font-['Playfair_Display']">
              {activeCouponsCount}
            </p>
          </div>
        </div>

        {/* Metric 3: Expired / Exhausted */}
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3.5">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-gray-500 font-['Source_Sans_3'] truncate">Expired</p>
            <p className="text-base sm:text-2xl font-bold text-amber-700 font-['Playfair_Display']">
              {expiredOrExhaustedCount}
            </p>
          </div>
        </div>

        {/* Metric 4: People Used */}
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3.5">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-teal-50 text-[#108283] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-gray-500 font-['Source_Sans_3'] truncate">People Used</p>
            <p className="text-base sm:text-2xl font-bold text-[#108283] font-['Playfair_Display']">
              {totalCouponsUsedCount}
            </p>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-['Source_Sans_3']">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all"
          />
        </div>

        {/* Filter Tabs with Mobile Left & Right Arrows */}
        <div className="flex items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            className="flex md:hidden w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer"
            title="Scroll filters left"
            aria-label="Scroll filters left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div 
            ref={tabScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 md:flex-initial pb-1 md:pb-0 text-xs"
          >
            {[
              { id: 'all', label: 'All Codes' },
              { id: 'active', label: 'Active' },
              { id: 'expired', label: 'Expired' },
              { id: 'exhausted', label: 'Limit Reached' },
              { id: 'inactive', label: 'Disabled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-[#108283] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 bg-gray-50 md:bg-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollTabs('right')}
            className="flex md:hidden w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer"
            title="Scroll filters right"
            aria-label="Scroll filters right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Coupons List / Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#108283]/10 text-[#108283] flex items-center justify-center mb-3">
            <TicketPercent className="w-7 h-7" />
          </div>
          <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-1">
            No coupon codes found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm font-['Source_Sans_3'] mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'No coupons match your current filter or search criteria.'
              : 'You have not issued any product discount coupons yet. Click below to create your first coupon.'}
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 bg-[#108283] text-white text-xs font-semibold rounded-xl hover:bg-[#0d6e6f] transition-all cursor-pointer"
          >
            Issue First Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCoupons.map((coupon) => {
            const isExpired = new Date(coupon.expiresAt).getTime() <= nowTime;
            const isExhausted = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
            const isUpcoming = coupon.startDate && new Date(coupon.startDate).getTime() > nowTime;
            const usagePercentage = Math.min(100, Math.round(((coupon.usedCount || 0) / coupon.maxUses) * 100));

            // Status label & styling
            let statusBadge = {
              label: 'Active',
              bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              dot: 'bg-emerald-500',
            };
            if (!coupon.isActive) {
              statusBadge = {
                label: 'Disabled',
                bg: 'bg-gray-100 text-gray-600 border-gray-200',
                dot: 'bg-gray-400',
              };
            } else if (isExpired) {
              statusBadge = {
                label: 'Expired',
                bg: 'bg-rose-50 text-rose-700 border-rose-200',
                dot: 'bg-rose-500',
              };
            } else if (isExhausted) {
              statusBadge = {
                label: 'Limit Reached',
                bg: 'bg-amber-50 text-amber-700 border-amber-200',
                dot: 'bg-amber-500',
              };
            } else if (isUpcoming) {
              statusBadge = {
                label: 'Upcoming',
                bg: 'bg-blue-50 text-blue-700 border-blue-200',
                dot: 'bg-blue-500',
              };
            }

            const expiryFormatted = new Date(coupon.expiresAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div 
                key={coupon.id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Top Ticket Header */}
                <div className="p-5 border-b border-dashed border-gray-200 bg-gradient-to-r from-gray-50/60 to-white">
                  
                  {/* Status Badge + Active Switch */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                      {statusBadge.label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] font-medium text-gray-500 cursor-pointer font-['Source_Sans_3']">
                        {coupon.isActive ? 'Enabled' : 'Paused'}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(coupon)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                          coupon.isActive ? 'bg-[#108283]' : 'bg-gray-300'
                        }`}
                        title={coupon.isActive ? 'Click to disable' : 'Click to enable'}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            coupon.isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Code & Discount Value */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-[#FAF0DD] border border-[#F0DAAA] rounded-xl font-mono font-bold text-base sm:text-lg text-gray-900 tracking-wider flex items-center gap-1.5 shadow-2xs">
                        <span>{coupon.code}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(coupon.code)}
                          className="text-gray-500 hover:text-[#108283] transition-colors cursor-pointer p-0.5"
                          title="Copy Code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Discount Value Pill */}
                    <div className="px-3 py-1 rounded-xl bg-[#108283] text-white font-['Playfair_Display'] font-bold text-sm sm:text-base">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} OFF`}
                    </div>
                  </div>

                  {/* Description */}
                  {coupon.description && (
                    <p className="mt-2.5 text-xs text-gray-600 font-['Source_Sans_3'] leading-relaxed line-clamp-2">
                      {coupon.description}
                    </p>
                  )}

                  {/* Min order and cap metadata */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-['Source_Sans_3'] text-gray-500">
                    <span className="bg-gray-100/80 px-2 py-0.5 rounded-md font-medium">
                      {coupon.minOrderAmount > 0
                        ? `Min. Order: ₹${coupon.minOrderAmount}`
                        : 'No Min. Order'}
                    </span>
                    {coupon.discountType === 'percentage' && coupon.maxDiscount ? (
                      <span className="bg-gray-100/80 px-2 py-0.5 rounded-md font-medium">
                        Capped at: ₹{coupon.maxDiscount}
                      </span>
                    ) : null}
                  </div>

                </div>

                {/* Middle Section: Strict Limits Tracking */}
                <div className="p-5 space-y-4 font-['Source_Sans_3'] bg-white flex-1">
                  
                  {/* LIMIT 1: Limited Uses Tracker */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#108283]" />
                        <span>Usage Limit ({coupon.usedCount || 0} / {coupon.maxUses} uses)</span>
                      </span>
                      <span className={`font-bold ${isExhausted ? 'text-rose-600' : 'text-gray-600'}`}>
                        {usagePercentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isExhausted 
                            ? 'bg-rose-500' 
                            : usagePercentage > 80 
                            ? 'bg-amber-500' 
                            : 'bg-[#108283]'
                        }`}
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-gray-500">
                      <span>{coupon.maxUses - (coupon.usedCount || 0)} redemptions left</span>
                      {isExhausted && (
                        <span className="text-rose-600 font-semibold">Exhausted</span>
                      )}
                    </div>
                  </div>

                  {/* LIMIT 2: Limited Time Tracker */}
                  <div className="pt-2 border-t border-gray-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#108283]" />
                        <span>Expiry Date</span>
                      </span>
                      <span className={`font-medium ${isExpired ? 'text-rose-600' : 'text-gray-800'}`}>
                        {expiryFormatted}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 flex items-center justify-between">
                      <span>Start: {new Date(coupon.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      {isExpired ? (
                        <span className="text-rose-600 font-semibold">Expired</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Valid until deadline</span>
                      )}
                    </p>
                  </div>

                </div>

                {/* Bottom Actions Bar */}
                <div className="p-3.5 px-5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-mono">
                    ID: {coupon.id.slice(-6)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(coupon)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#108283] hover:text-[#108283] text-gray-600 bg-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(coupon)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-500 hover:text-rose-600 bg-white text-xs transition-colors cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ISSUE / EDIT COUPON MODAL */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Issue New Discount Coupon'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveCoupon} className="space-y-4 font-['Source_Sans_3']">
          
          {/* Code & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Coupon Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. WELCOME10, GLOW200"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-sm tracking-wider uppercase focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Patients will type this code in the checkout drawer to claim their discount.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Description / Promo Title
              </label>
              <input
                type="text"
                placeholder="e.g. 10% off for first 50 clinic patients"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Discount Type & Value */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Discount Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountType('percentage')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    discountType === 'percentage'
                      ? 'bg-[#108283] text-white border-[#108283] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Percentage (%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('fixed')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    discountType === 'fixed'
                      ? 'bg-[#108283] text-white border-[#108283] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Fixed Amount (₹)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={discountType === 'percentage' ? 100 : 100000}
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Min. Order Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  placeholder="0 (no minimum)"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none"
                />
              </div>
            </div>

            {discountType === 'percentage' && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Max. Discount Cap in ₹ (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  placeholder="e.g. 500 (leave 0 for no cap)"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Limits the maximum deduction so a high-value cart doesn't receive excessive discounts.
                </p>
              </div>
            )}
          </div>

          {/* MANDATORY LIMITS SECTION */}
          <div className="p-4 bg-[#FAF0DD]/50 rounded-xl border border-[#F0DAAA] space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-[#108283]" />
              <span>Issuing Constraints (Limited Uses &amp; Time)</span>
            </div>

            {/* LIMITED USES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Max Allowable Uses (Limit) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none"
                />
                <p className="text-[10.5px] text-gray-500 mt-1 leading-tight">
                  Total times this coupon can be redeemed before it locks.
                </p>
              </div>

              {editingCoupon && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                      Redeemed Count So Far
                    </label>
                    <button
                      type="button"
                      onClick={() => setUsedCount(0)}
                      className="text-[10px] text-[#108283] hover:underline font-semibold cursor-pointer"
                    >
                      Reset to 0
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={usedCount}
                    onChange={(e) => setUsedCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none font-mono"
                  />
                  <p className="text-[10.5px] text-gray-500 mt-1 leading-tight">
                    Incremented automatically upon checkout.
                  </p>
                </div>
              )}
            </div>

            {/* LIMITED TIME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F0DAAA]/60">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Start Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Expiry Date &amp; Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none"
                />
              </div>
            </div>
            
            <p className="text-[11px] text-gray-600 bg-white/70 p-2.5 rounded-lg border border-[#F0DAAA]/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#108283] shrink-0" />
              <span>Coupon automatically deactivates as soon as expiry timestamp is reached.</span>
            </p>
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveToggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-[#108283] rounded border-gray-300 focus:ring-[#108283] cursor-pointer"
            />
            <label htmlFor="isActiveToggle" className="text-xs font-semibold text-gray-800 cursor-pointer">
              Set coupon active immediately upon saving
            </label>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#108283] hover:bg-[#0d6e6f] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {editingCoupon ? 'Save Changes' : 'Issue Coupon'}
            </button>
          </div>

        </form>
      </AdminModal>

      {/* How to Use Coupons Guide Modal */}
      <AdminModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title="How to Use & Apply Coupons"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 font-['Source_Sans_3'] text-gray-700">
          <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#108283] text-white flex items-center justify-center shrink-0 mt-0.5">
              <TicketPercent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Automated Cart &amp; Checkout Coupons</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Coupons created in this manager are instantly valid and applied by patients on the clinic website.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <div className="w-6 h-6 rounded-full bg-teal-100 text-[#108283] text-xs font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div className="text-xs">
                <p className="font-bold text-gray-900">Issue or Share Coupon Code</p>
                <p className="text-gray-600 mt-0.5">
                  Click <strong>&quot;Issue New Coupon&quot;</strong> to create a code (e.g. <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-900 font-bold">MONALI10</span>). Set a percentage or ₹ flat discount, minimum spend, and expiration date.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <div className="w-6 h-6 rounded-full bg-teal-100 text-[#108283] text-xs font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div className="text-xs">
                <p className="font-bold text-gray-900">Patient Adds Items to Bag</p>
                <p className="text-gray-600 mt-0.5">
                  Patients visit the live shop (<span className="text-[#108283] font-semibold">/shop</span>) and add their skincare formulations, serums, or creams to the cart.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <div className="w-6 h-6 rounded-full bg-teal-100 text-[#108283] text-xs font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div className="text-xs">
                <p className="font-bold text-gray-900">Apply Code Inside the Cart Drawer</p>
                <p className="text-gray-600 mt-0.5">
                  In the slide-out Cart Drawer, under the items subtotal, there is a dedicated coupon box: <span className="font-semibold text-gray-800">&quot;Have a coupon code?&quot;</span>. The patient types the code and clicks <span className="font-semibold text-[#108283]">&quot;Apply&quot;</span>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div className="text-xs">
                <p className="font-bold text-gray-900">Instant Real-Time Discount</p>
                <p className="text-gray-600 mt-0.5">
                  The discount is calculated and subtracted instantly from the order total. Minimum spend and expiry date are validated automatically in real time.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Coupon Limits &amp; Control</span>
            </p>
            <p>
              You can toggle any coupon <strong>Active</strong> or <strong>Disabled</strong> with one click, or set a maximum usage limit so the code expires automatically once reached.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <a
              href="/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#108283] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Test in Live Shop &amp; Cart Drawer</span>
              <span>↗</span>
            </a>
            <button
              type="button"
              onClick={() => setIsGuideOpen(false)}
              className="px-4 py-2 bg-[#108283] text-white rounded-xl text-xs font-semibold hover:bg-[#0c6b6c] transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      </AdminModal>

    </div>
  );
}
