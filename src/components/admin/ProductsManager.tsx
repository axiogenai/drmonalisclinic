'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, ChevronDown, Check, Tag, Layers, IndianRupee, ArrowLeft, ArrowRight, Upload, Image as ImageIcon } from 'lucide-react';
import { useAdminData, Product } from '@/context/AdminContext';
import { uploadImageToSupabase } from '@/lib/supabase';
import AdminModal from './AdminModal';

interface DropdownOption {
  value: string;
  label: string;
  dotColor?: string;
  badge?: string;
}

function CustomSelect({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = 'Select an option'
}: {
  label?: string;
  required?: boolean;
  value?: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 bg-gray-50/80 hover:bg-white border rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] transition-all duration-200 cursor-pointer text-left ${
          isOpen 
            ? 'border-[#108283] ring-2 ring-[#108283]/20 bg-white shadow-xs' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.dotColor && (
            <span className={`w-2 h-2 rounded-full ${selectedOption.dotColor} shrink-0 ring-2 ring-white shadow-xs`} />
          )}
          <span className={`truncate ${selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#108283]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-150 max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm transition-colors text-left font-['Source_Sans_3'] cursor-pointer ${
                  isSelected 
                    ? 'bg-[#FAEDDA]/60 text-[#108283] font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.dotColor && (
                    <span className={`w-2 h-2 rounded-full ${opt.dotColor} shrink-0`} />
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#108283] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductsManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'out_of_stock' | 'coming_soon'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'basic' | 'details'>('basic');
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    subtitle: '',
    category: 'serums',
    categoryLabel: 'Serums & Elixirs',
    price: 0,
    mrp: 0,
    volume: '30ml | 1.0 fl oz',
    rating: 5,
    reviewsCount: 0,
    image: '',
    status: 'available',
    badge: '',
    shortDesc: '',
    fullDesc: '',
    howToUse: '',
    suitableFor: 'All Indian Skin Types',
    ingredientsList: '',
    keyActives: [],
    benefits: []
  });

  const [isUploading, setIsUploading] = useState(false);

  const categoryOptions: DropdownOption[] = [
    { value: 'serums', label: 'Serums & Elixirs' },
    { value: 'creams', label: 'Barrier Creams' },
    { value: 'hair', label: 'Hair & Scalp' },
    { value: 'cleansers', label: 'Cleansers' },
  ];

  const statusOptions: DropdownOption[] = [
    { value: 'available', label: 'In Stock (Available)', dotColor: 'bg-emerald-500' },
    { value: 'out_of_stock', label: 'Out of Stock', dotColor: 'bg-rose-500' },
    { value: 'coming_soon', label: 'Coming Soon', dotColor: 'bg-amber-500' },
  ];

  const categoryLabelMap: Record<string, string> = {
    serums: 'Serums & Elixirs',
    creams: 'Barrier Creams',
    hair: 'Hair & Scalp',
    cleansers: 'Cleansers',
  };

  const filteredProducts = products.filter((p: Product) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setActiveModalTab('basic');
    setFormData({
      name: '',
      subtitle: '',
      category: 'serums',
      categoryLabel: 'Serums & Elixirs',
      price: 0,
      mrp: 0,
      volume: '30ml | 1.0 fl oz',
      rating: 5,
      reviewsCount: 0,
      image: '',
      status: 'available',
      badge: '',
      shortDesc: '',
      fullDesc: '',
      howToUse: '',
      suitableFor: 'All Indian Skin Types',
      ingredientsList: '',
      keyActives: [],
      benefits: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setActiveModalTab('basic');
    setFormData({
      ...product,
      keyActives: product.keyActives ? [...product.keyActives] : [],
      benefits: product.benefits ? [...product.benefits] : []
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleArrayChange = (field: 'keyActives' | 'benefits', index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'keyActives' | 'benefits') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayItem = (field: 'keyActives' | 'benefits', index: number) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.price || !formData.image?.trim()) {
      alert('Please fill in required fields: Product Name, Price, and Image URL.');
      return;
    }
    
    const cleanedPayload: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Date.now(),
      name: formData.name.trim(),
      subtitle: formData.subtitle?.trim() || '',
      category: (formData.category as Product['category']) || 'serums',
      categoryLabel: formData.categoryLabel?.trim() || categoryLabelMap[formData.category || 'serums'] || 'Skincare',
      price: Number(formData.price),
      mrp: Number(formData.mrp) || Number(formData.price),
      volume: formData.volume?.trim() || '30ml',
      rating: formData.rating || 5,
      reviewsCount: formData.reviewsCount || 0,
      image: formData.image.trim(),
      status: (formData.status as Product['status']) || 'available',
      badge: formData.badge?.trim() || '',
      shortDesc: formData.shortDesc?.trim() || '',
      fullDesc: formData.fullDesc?.trim() || '',
      howToUse: formData.howToUse?.trim() || '',
      suitableFor: formData.suitableFor?.trim() || 'All Skin Types',
      ingredientsList: formData.ingredientsList?.trim() || '',
      keyActives: (formData.keyActives || []).filter(a => a.trim() !== ''),
      benefits: (formData.benefits || []).filter(b => b.trim() !== '')
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, cleanedPayload);
    } else {
      addProduct(cleanedPayload);
    }
    setIsModalOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // 1. Try Supabase Storage upload
    try {
      const publicUrl = await uploadImageToSupabase(file, file.name, 'products');
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, image: publicUrl }));
        setIsUploading(false);
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
          setFormData((prev) => ({ ...prev, image: dataUrl }));
        } else {
          setFormData((prev) => ({ ...prev, image: event.target?.result as string }));
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-sm font-['Source_Sans_3'] shadow-2xs"
            />
          </div>

          {/* Quick status filter pills */}
          <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-xl text-xs font-['Source_Sans_3']">
            {(['all', 'available', 'out_of_stock', 'coming_soon'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer capitalize ${
                  statusFilter === st 
                    ? 'bg-white text-gray-900 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {st === 'all' ? 'All' : st === 'out_of_stock' ? 'Out of Stock' : st === 'coming_soon' ? 'Coming Soon' : 'In Stock'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#108283] text-white rounded-xl hover:bg-[#0c6b6c] transition-colors cursor-pointer text-sm font-semibold font-['Source_Sans_3'] shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Slim Modern Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-gray-500 font-['Source_Sans_3'] text-sm">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredProducts.map((product: Product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden group hover:border-[#108283]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Professional Proportioned Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2] border-b border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    product.status === 'out_of_stock' ? 'grayscale-[30%]' : ''
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/400x400/FAF0DD/108283?text=' + encodeURIComponent(product.name);
                  }}
                />
                
                {/* Floating Status & Custom Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none gap-1">
                  {product.badge ? (
                    <span className="bg-[#108283] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs truncate max-w-[95px]">
                      {product.badge}
                    </span>
                  ) : <span />}
                  
                  {product.status === 'out_of_stock' ? (
                    <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs shrink-0">
                      Out of Stock
                    </span>
                  ) : product.status === 'coming_soon' ? (
                    <span className="bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs shrink-0">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs shrink-0">
                      In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] font-bold text-[#108283] uppercase tracking-wider block mb-1">
                    {product.categoryLabel || product.category}
                  </span>
                  
                  <h3 className="font-['Playfair_Display'] font-semibold text-gray-900 text-sm truncate mb-1.5" title={product.name}>
                    {product.name}
                  </h3>

                  <div className="flex items-baseline justify-between mb-2.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-gray-950 text-sm font-['Source_Sans_3']">₹{product.price}</span>
                      {product.mrp && product.mrp > product.price && (
                        <span className="text-xs text-gray-400 line-through font-['Source_Sans_3']">₹{product.mrp}</span>
                      )}
                    </div>
                    {product.volume && (
                      <span className="text-[10px] text-gray-400 font-medium font-['Source_Sans_3']">
                        {product.volume.split('|')[0].trim()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Professional Action Buttons */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 gap-2 mt-auto">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#108283] hover:bg-[#FAEDDA]/60 rounded-lg transition-colors cursor-pointer border border-gray-200/80 font-['Source_Sans_3']"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-rose-200/80 font-['Source_Sans_3']"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slim, Compact Admin Product Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Segmented Tab Bar */}
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveModalTab('basic')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 font-['Source_Sans_3'] cursor-pointer ${
                activeModalTab === 'basic'
                  ? 'bg-white text-[#108283] shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Basic Info & Pricing</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModalTab('details')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 font-['Source_Sans_3'] cursor-pointer ${
                activeModalTab === 'details'
                  ? 'bg-white text-[#108283] shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Details & Actives</span>
            </button>
          </div>

          {/* TAB 1: Basic Info & Pricing */}
          {activeModalTab === 'basic' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dr. Monali's HA Glow Serum"
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                  Subtitle / Active Formula
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hyaluronic Acid + 24K Gold Leaf"
                  value={formData.subtitle || ''}
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Category & Label Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <CustomSelect
                    label="Category"
                    required
                    value={formData.category}
                    options={categoryOptions}
                    onChange={(val) => {
                      const newLabel = categoryLabelMap[val] || formData.categoryLabel;
                      setFormData({
                        ...formData,
                        category: val as Product['category'],
                        categoryLabel: newLabel
                      });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                    Category Label
                  </label>
                  <input
                    type="text"
                    value={formData.categoryLabel || ''}
                    onChange={e => setFormData({...formData, categoryLabel: e.target.value})}
                    placeholder="e.g., Serums & Elixirs"
                    className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Price, MRP, Volume Row */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price ?? ''}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.mrp ?? ''}
                    onChange={e => setFormData({...formData, mrp: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                    Volume / Size
                  </label>
                  <input
                    type="text"
                    placeholder="30ml"
                    value={formData.volume || ''}
                    onChange={e => setFormData({...formData, volume: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Status & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <CustomSelect
                    label="Status"
                    required
                    value={formData.status}
                    options={statusOptions}
                    onChange={(val) => setFormData({...formData, status: val as Product['status']})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                    Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Best Seller"
                    value={formData.badge || ''}
                    onChange={e => setFormData({...formData, badge: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Product Image (Slim Compact Upload & Preview) */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                  Product Image <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {formData.image ? (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200 shadow-xs group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={formData.image} 
                        alt="Product preview" 
                        className="w-full h-full object-cover object-center" 
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=NA'; }} 
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
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
                    required
                    placeholder="Upload image or enter /products/... or https://"
                    value={formData.image || ''}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="flex-1 min-w-0 px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                  />

                  <label 
                    className={`px-3 py-2 ${isUploading ? 'bg-gray-400 cursor-wait' : 'bg-[#108283] hover:bg-[#0c6b6c] cursor-pointer'} text-white rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 font-['Source_Sans_3'] shadow-xs`}
                    title="Upload product image to Supabase storage"
                  >
                    <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={isUploading}
                      onChange={handleFileUpload} 
                    />
                  </label>
                </div>
                <p className="text-[10px] text-gray-400 font-['Source_Sans_3'] mt-1">
                  Supports any image size (JPEG, PNG, WEBP) — auto-scaled &amp; properly fitted.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Details & Actives */}
          {activeModalTab === 'details' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                  Short Description
                </label>
                <textarea
                  value={formData.shortDesc || ''}
                  onChange={e => setFormData({...formData, shortDesc: e.target.value})}
                  rows={2}
                  placeholder="One sentence summary shown on listing cards..."
                  className="w-full px-3 py-1.5 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                  Full Description
                </label>
                <textarea
                  value={formData.fullDesc || ''}
                  onChange={e => setFormData({...formData, fullDesc: e.target.value})}
                  rows={2}
                  placeholder="Detailed product story, texture, results..."
                  className="w-full px-3 py-1.5 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all resize-none"
                />
              </div>

              {/* Key Actives */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider font-['Source_Sans_3']">
                    Key Actives
                  </label>
                  <button 
                    type="button" 
                    onClick={() => addArrayItem('keyActives')} 
                    className="text-xs text-[#108283] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Active
                  </button>
                </div>
                
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {formData.keyActives && formData.keyActives.length > 0 ? (
                    formData.keyActives.map((active: string, i: number) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="e.g., 2% Pure Hyaluronic Acid"
                          value={active}
                          onChange={e => handleArrayChange('keyActives', i, e.target.value)}
                          className="flex-1 px-2.5 py-1 bg-gray-50/80 border border-gray-200 rounded-lg text-xs font-['Source_Sans_3'] focus:bg-white focus:ring-1 focus:ring-[#108283] outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeArrayItem('keyActives', i)} 
                          className="text-gray-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-400 font-['Source_Sans_3'] italic py-0.5">No active ingredients added yet.</p>
                  )}
                </div>
              </div>

              {/* Key Benefits */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider font-['Source_Sans_3']">
                    Key Benefits
                  </label>
                  <button 
                    type="button" 
                    onClick={() => addArrayItem('benefits')} 
                    className="text-xs text-[#108283] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Benefit
                  </button>
                </div>
                
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {formData.benefits && formData.benefits.length > 0 ? (
                    formData.benefits.map((benefit: string, i: number) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="e.g., Boosts moisture retention"
                          value={benefit}
                          onChange={e => handleArrayChange('benefits', i, e.target.value)}
                          className="flex-1 px-2.5 py-1 bg-gray-50/80 border border-gray-200 rounded-lg text-xs font-['Source_Sans_3'] focus:bg-white focus:ring-1 focus:ring-[#108283] outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeArrayItem('benefits', i)} 
                          className="text-gray-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-400 font-['Source_Sans_3'] italic py-0.5">No benefits added yet.</p>
                  )}
                </div>
              </div>

              {/* How to Use */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                  How to Use
                </label>
                <input
                  type="text"
                  placeholder="e.g., Apply 3-4 drops morning and night on cleansed damp skin..."
                  value={formData.howToUse || ''}
                  onChange={e => setFormData({...formData, howToUse: e.target.value})}
                  className="w-full px-3 py-1.5 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              {activeModalTab === 'basic' ? (
                <button
                  type="button"
                  onClick={() => setActiveModalTab('details')}
                  className="flex items-center gap-1 text-xs font-semibold text-[#108283] hover:text-[#0c6b6c] py-1.5 px-1 cursor-pointer font-['Source_Sans_3']"
                >
                  <span>More Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveModalTab('basic')}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 py-1.5 px-1 cursor-pointer font-['Source_Sans_3']"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Info</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium text-xs sm:text-sm cursor-pointer font-['Source_Sans_3']"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl transition-all font-semibold text-xs sm:text-sm cursor-pointer shadow-xs font-['Source_Sans_3'] active:scale-98"
              >
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
