'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  Trash2, 
  Pencil, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  ShoppingBag, 
  Tag, 
  Check,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useAdminData, MarqueeItem, Product } from '@/context/AdminContext';
import { useDialog } from '@/context/DialogContext';
import { uploadImageToSupabase } from '@/lib/supabase';
import AdminModal from './AdminModal';
import AdminSelect from './AdminSelect';

export default function MarqueeManager() {
  const { confirm, toast } = useDialog();
  const { 
    marqueeItems, 
    addMarqueeItem, 
    updateMarqueeItem, 
    deleteMarqueeItem, 
    reorderMarqueeItems,
    products 
  } = useAdminData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarqueeItem | null>(null);
  const [modalMode, setModalMode] = useState<'product' | 'custom'>('product');

  const [selectedProductId, setSelectedProductId] = useState('');
  const [customName, setCustomName] = useState('');
  const [badgeText, setBadgeText] = useState('NEW');
  const [badgeColor, setBadgeColor] = useState<MarqueeItem['badgeColor']>('teal');
  const [customImage, setCustomImage] = useState('/products/ha-glow-serum.png');
  const [customLink, setCustomLink] = useState('/shop');
  const [isActive, setIsActive] = useState(true);

  const badgePresets = ['NEW', 'BEST SELLER', 'NOW AVAILABLE', 'SALE', 'SPECIAL OFFER', 'COMING SOON', 'LIMITED TIME', 'FLAT 15% OFF'];

  const openAddModal = (mode: 'product' | 'custom' = 'product') => {
    setEditingItem(null);
    setModalMode(mode);
    if (mode === 'product' && products.length > 0) {
      const firstProduct = products[0];
      setSelectedProductId(firstProduct.id);
      setCustomName(firstProduct.name.replace("Dr. Monali's ", ''));
      setCustomImage(firstProduct.image || '/products/ha-glow-serum.png');
      setBadgeText(firstProduct.badge || 'NEW');
      setBadgeColor('teal');
      setCustomLink('/shop');
    } else {
      setSelectedProductId('');
      setCustomName('');
      setCustomImage('/clinic-logo-icon.png');
      setBadgeText('SPECIAL OFFER');
      setBadgeColor('rose');
      setCustomLink('/shop');
    }
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MarqueeItem) => {
    setEditingItem(item);
    setModalMode(item.type === 'product' ? 'product' : 'custom');
    setSelectedProductId(item.productId || '');
    setCustomName(item.name);
    setBadgeText(item.badge);
    setBadgeColor(item.badgeColor || 'teal');
    setCustomImage(item.image || '/clinic-logo-icon.png');
    setCustomLink(item.link || '/shop');
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setCustomName(prod.name.replace("Dr. Monali's ", ''));
      setCustomImage(prod.image || '/products/ha-glow-serum.png');
      if (prod.badge) setBadgeText(prod.badge);
      else if (prod.status === 'coming_soon') setBadgeText('COMING SOON');
      else setBadgeText('NOW AVAILABLE');
      setCustomLink('/shop');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      toast({
        title: 'Input Required',
        message: 'Please enter an announcement title or select a product.',
        type: 'error',
      });
      return;
    }

    const payload: MarqueeItem = {
      id: editingItem ? editingItem.id : 'm-' + Date.now(),
      type: modalMode === 'product' ? 'product' : 'offer',
      productId: modalMode === 'product' ? selectedProductId : undefined,
      name: customName.trim(),
      badge: badgeText.trim() || 'ANNOUNCEMENT',
      badgeColor: badgeColor || 'teal',
      image: customImage.trim() || '/clinic-logo-icon.png',
      link: customLink.trim() || '/shop',
      isActive: isActive,
    };

    if (editingItem) {
      updateMarqueeItem(editingItem.id, payload);
      toast({
        title: 'Item Updated',
        message: `"${payload.name}" updated successfully.`,
        type: 'success',
      });
    } else {
      addMarqueeItem(payload);
      toast({
        title: 'Item Added',
        message: `"${payload.name}" added to the marquee.`,
        type: 'success',
      });
    }

    setIsModalOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Try Supabase Storage upload
    try {
      const publicUrl = await uploadImageToSupabase(file, file.name, 'marquee');
      if (publicUrl) {
        setCustomImage(publicUrl);
        return;
      }
    } catch (err) {
      console.warn('Supabase storage upload error:', err);
    }

    // 2. Fallback to local canvas compression
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCustomImage(dataUrl);
        } else {
          setCustomImage(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...marqueeItems];
    if (direction === 'up' && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      reorderMarqueeItems(newItems);
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
      reorderMarqueeItems(newItems);
    }
  };

  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case 'rose': return 'bg-rose-500 text-white';
      case 'gold': return 'bg-amber-600 text-white';
      case 'amber': return 'bg-amber-400 text-gray-950 font-bold';
      case 'emerald': return 'bg-emerald-600 text-white';
      case 'teal':
      default: return 'bg-[#108283] text-white';
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Top Action & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 font-playfair flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#108283]" />
            Homepage Announcement Strip
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage scrolling announcements, offers, and featured products displayed on the homepage marquee.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => openAddModal('product')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#108283] text-white rounded-xl hover:bg-[#0c6b6c] transition-all text-sm font-semibold shadow-xs cursor-pointer active:scale-98"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Select Product</span>
          </button>
          <button
            onClick={() => openAddModal('custom')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FAEDDA] text-[#108283] hover:bg-[#f3e1c4] rounded-xl transition-all text-sm font-semibold border border-[#108283]/20 shadow-xs cursor-pointer active:scale-98"
          >
            <Tag className="w-4 h-4 text-[#108283]" />
            <span>Add Offer / Promo</span>
          </button>
        </div>
      </div>

      {/* Live Running Preview Strip */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#108283]" /> Live Homepage Preview
            </span>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {marqueeItems.filter(i => i.isActive).length} of {marqueeItems.length} items active
          </span>
        </div>

        {/* Continuous Animated Running Strip (No scrollbars, hover to pause) */}
        <div className="border border-[#F0DAAA]/40 rounded-xl overflow-hidden bg-[#FAFAF8] py-2.5 px-3 relative select-none">
          {marqueeItems.filter(i => i.isActive).length === 0 ? (
            <p className="text-xs text-gray-400 py-2 text-center italic">No active items in marquee. Enable items below or click &quot;Select Product&quot; to add.</p>
          ) : (
            <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
              {(() => {
                const activeList = marqueeItems.filter(i => i.isActive);
                const repeatCount = Math.max(2, Math.ceil(10 / (activeList.length || 1)));
                return [0, 1].map((trackIdx) => (
                  <div
                    key={trackIdx}
                    className="flex items-center shrink-0"
                    aria-hidden={trackIdx === 1 ? 'true' : undefined}
                  >
                    {[...Array(repeatCount)].map((_, loopIdx) => (
                      <div key={loopIdx} className="flex items-center shrink-0">
                        {activeList.map((item, itemIdx) => (
                          <div
                            key={`${trackIdx}-${loopIdx}-${itemIdx}-${item.id}`}
                            className="flex items-center shrink-0"
                          >
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#108283]/20 bg-white shrink-0 shadow-xs flex items-center justify-center">
                              <img 
                                src={item.image || '/clinic-logo-icon.png'} 
                                alt={item.name} 
                                width={28}
                                height={28}
                                className="w-full h-full object-cover" 
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/clinic-logo-icon.png'; }}
                              />
                            </div>
                            <span className="ml-2.5 font-['Source_Sans_3'] text-xs sm:text-sm font-medium text-gray-800 whitespace-nowrap">
                              {item.name}
                            </span>
                            <span className={`ml-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs ${getBadgeStyle(item.badgeColor)}`}>
                              {item.badge}
                            </span>
                            <div className="mx-8 flex items-center justify-center shrink-0" aria-hidden="true">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#108283]/30" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Items List Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-playfair text-lg font-semibold text-gray-900">
              Configured Marquee Items ({marqueeItems.length})
            </h3>
            <p className="text-xs text-gray-400">Order from top to bottom matches sequence in the banner</p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            Use arrows to reorder
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center align-middle">Order</th>
                <th className="py-3.5 px-4 text-left align-middle">Item &amp; Preview</th>
                <th className="py-3.5 px-4 w-28 text-center align-middle">Type</th>
                <th className="py-3.5 px-4 w-36 text-left align-middle">Badge Tag</th>
                <th className="py-3.5 px-4 w-32 text-left align-middle">Destination</th>
                <th className="py-3.5 px-4 w-28 text-center align-middle">Status</th>
                <th className="py-3.5 px-4 w-24 text-center align-middle">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {marqueeItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No announcement items yet. Click &quot;Select Product&quot; or &quot;Add Offer / Promo&quot; above to get started.
                  </td>
                </tr>
              ) : (
                marqueeItems.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50/60 transition-colors ${!item.isActive ? 'opacity-60 bg-gray-50/30' : ''}`}>
                    {/* Order buttons */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-[#108283] hover:bg-gray-100 rounded disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === marqueeItems.length - 1}
                          className="p-1 text-gray-400 hover:text-[#108283] hover:bg-gray-100 rounded disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Item Thumbnail & Name */}
                    <td className="py-3.5 px-4 text-left align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0 shadow-xs flex items-center justify-center">
                          <img 
                            src={item.image || '/clinic-logo-icon.png'} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/clinic-logo-icon.png'; }}
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-gray-900 truncate leading-snug">{item.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">ID: {item.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Type Tag */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                          item.type === 'product' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {item.type === 'product' ? <ShoppingBag className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
                          <span className="capitalize">{item.type}</span>
                        </span>
                      </div>
                    </td>

                    {/* Badge Pill */}
                    <td className="py-3.5 px-4 text-left align-middle">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs ${getBadgeStyle(item.badgeColor)}`}>
                          {item.badge}
                        </span>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-3.5 px-4 text-left align-middle">
                      <div className="flex items-center">
                        <span className="inline-flex items-center text-xs text-gray-600 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-lg font-mono truncate max-w-[130px]">
                          {item.link || '/shop'}
                        </span>
                      </div>
                    </td>

                    {/* Active Status Toggle */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => updateMarqueeItem(item.id, { isActive: !item.isActive })}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                            item.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                          }`}
                          title={item.isActive ? 'Click to pause/hide' : 'Click to display'}
                        >
                          {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{item.isActive ? 'Active' : 'Hidden'}</span>
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-gray-500 hover:text-[#108283] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Item"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            const ok = await confirm({
                              title: 'Remove Marquee Item',
                              message: `Are you sure you want to remove "${item.name}" from the live announcement marquee?`,
                              confirmText: 'Remove Item',
                              cancelText: 'Cancel',
                              type: 'danger',
                            });
                            if (ok) {
                              deleteMarqueeItem(item.id);
                              toast({
                                title: 'Item Removed',
                                message: `"${item.name}" has been removed from the marquee.`,
                                type: 'success',
                              });
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Marquee Item' : 'Add Marquee Item'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => {
                setModalMode('product');
                if (products.length > 0) handleProductSelect(products[0].id);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                modalMode === 'product' ? 'bg-white text-[#108283] shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Select Clinic Product</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setModalMode('custom');
                if (modalMode === 'product') {
                  setCustomName('');
                  setBadgeText('SPECIAL OFFER');
                  setBadgeColor('rose');
                  setCustomImage('/clinic-logo.png');
                }
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                modalMode === 'custom' ? 'bg-white text-[#108283] shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Custom Offer / Sale / Drop</span>
            </button>
          </div>

          {modalMode === 'product' && (
            <div className="space-y-2 bg-teal-50/40 p-4 rounded-xl border border-teal-100">
              <AdminSelect
                label="Choose Product from Catalog"
                required
                value={selectedProductId}
                onChange={(val) => handleProductSelect(val)}
                placeholder="Select a product..."
                options={products.map((p) => ({
                  value: p.id,
                  label: `${p.name} — ₹${p.price}`,
                  sublabel: p.categoryLabel || p.category,
                }))}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Display Text / Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. HA Glow Serum or Flat 20% OFF Monali Clinic Formulations"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#108283] focus:ring-2 focus:ring-[#108283]/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Badge Pill Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. NEW, SALE, 20% OFF, UPCOMING"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#108283] focus:ring-2 focus:ring-[#108283]/20 outline-none uppercase"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {badgePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBadgeText(preset)}
                    className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-full text-gray-700 transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Badge Pill Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'teal', label: 'Teal', class: 'bg-[#108283]' },
                  { id: 'rose', label: 'Rose', class: 'bg-rose-500' },
                  { id: 'gold', label: 'Gold', class: 'bg-amber-600' },
                  { id: 'amber', label: 'Amber', class: 'bg-amber-400' },
                  { id: 'emerald', label: 'Green', class: 'bg-emerald-600' },
                ].map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setBadgeColor(col.id as MarqueeItem['badgeColor'])}
                    className={`h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${col.class} ${
                      badgeColor === col.id ? 'ring-3 ring-offset-2 ring-[#108283]' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={col.label}
                  >
                    {badgeColor === col.id && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Thumbnail Image (Upload File or Enter URL)
              </label>
              <div className="flex items-center gap-2">
                {customImage ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200 shadow-xs group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={customImage} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover object-center" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=IMG'; }} 
                    />
                    <button
                      type="button"
                      onClick={() => setCustomImage('')}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 shrink-0 flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}

                <input
                  type="text"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  placeholder="Upload image or enter /products/... or https://"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-[#108283] focus:ring-2 focus:ring-[#108283]/20 outline-none"
                />

                <label 
                  className="px-3 py-2 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                  title="Upload image from computer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                </label>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Supports any image size (JPEG, PNG, WEBP) — auto-scaled &amp; properly fitted.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Click Target URL
              </label>
              <input
                type="text"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="e.g. /shop, /#booking, or /cosmetic-treatments"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-[#108283] focus:ring-2 focus:ring-[#108283]/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/70">
            <div>
              <span className="text-sm font-semibold text-gray-900 block">Display in Live Marquee</span>
              <span className="text-xs text-gray-500">When enabled, this item scrolls in the homepage banner.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                isActive ? 'bg-[#108283]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="bg-[#FAFAF8] border border-[#F0DAAA]/30 rounded-xl p-3 text-center">
            <span className="text-[11px] text-gray-400 font-medium block mb-2">Live Item Preview:</span>
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-gray-100 shadow-xs">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                <img 
                  src={customImage || '/clinic-logo-icon.png'} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/clinic-logo-icon.png'; }}
                />
              </div>
              <span className="text-xs font-medium text-gray-800">{customName || 'Your Item Title'}</span>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getBadgeStyle(badgeColor)}`}>
                {badgeText || 'BADGE'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#108283] text-white text-sm font-semibold rounded-xl hover:bg-[#0c6b6c] transition-all shadow-sm cursor-pointer"
            >
              {editingItem ? 'Save Changes' : 'Add to Marquee'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
