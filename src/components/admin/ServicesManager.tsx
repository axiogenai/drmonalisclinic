'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, X, ExternalLink, Tag, Check, Layers, AlertCircle, Upload, Image as ImageIcon, Clock, ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';
import { useAdminData, Service } from '@/context/AdminContext';
import { useDialog } from '@/context/DialogContext';
import { uploadImageToSupabase } from '@/lib/supabase';
import AdminModal from '@/components/admin/AdminModal';
import AdminSelect from '@/components/admin/AdminSelect';

type ServiceCategoryKey = 'all' | 'homeopathy' | 'cosmetic' | 'hair-skin';

interface CategoryMeta {
  key: ServiceCategoryKey;
  label: string;
  path: string;
  badgeColor: string;
  dotColor: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    key: 'homeopathy',
    label: 'Homeopathy Treatments',
    path: '/homeopathy',
    badgeColor: 'bg-[#108283] text-white border-white/20 shadow-xs',
    dotColor: 'bg-[#108283]'
  },
  {
    key: 'cosmetic',
    label: 'Cosmetic Treatments',
    path: '/cosmetic-treatments',
    badgeColor: 'bg-[#b45309] text-white border-white/20 shadow-xs',
    dotColor: 'bg-[#b45309]'
  },
  {
    key: 'hair-skin',
    label: 'Hair & Skin Treatments',
    path: '/hair-and-skin',
    badgeColor: 'bg-[#0f4c5c] text-white border-white/20 shadow-xs',
    dotColor: 'bg-[#0f4c5c]'
  }
];

export default function ServicesManager() {
  const { services, addService, updateService, deleteService } = useAdminData();
  const { confirm, toast } = useDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategoryKey>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const scrollCategories = (dir: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: dir === 'left' ? -140 : 140,
        behavior: 'smooth'
      });
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    category: 'homeopathy' as 'homeopathy' | 'cosmetic' | 'hair-skin',
    indications: '',
    description: '',
    image: '',
    highlights: [''],
    price: '',
    duration: '',
  });

  const counts = useMemo(() => {
    return {
      all: services.length,
      homeopathy: services.filter(s => s.category === 'homeopathy').length,
      cosmetic: services.filter(s => s.category === 'cosmetic').length,
      'hair-skin': services.filter(s => s.category === 'hair-skin').length
    };
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((s: Service) => {
      const matchesSearch = 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.indications && s.indications.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, categoryFilter]);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setFormData({
        title: service.title || '',
        category: (service.category as any) || 'homeopathy',
        indications: service.indications || '',
        description: service.description || '',
        image: service.image || '',
        highlights: service.highlights?.length ? [...service.highlights] : [''],
        price: service.price || '',
        duration: service.duration || '',
      });
      setEditingId(service.id);
    } else {
      setFormData({
        title: '',
        category: categoryFilter !== 'all' ? categoryFilter : 'homeopathy',
        indications: '',
        description: '',
        image: '',
        highlights: [''],
        price: 'From ₹999+',
        duration: '30-45 mins',
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Title Required',
        message: 'Please enter a service title before saving.',
        type: 'error',
      });
      return;
    }

    const payload: Partial<Service> = {
      title: formData.title.trim(),
      category: formData.category,
      indications: formData.indications.trim(),
      description: formData.description.trim(),
      image: formData.image.trim() || '/services/kidney-stones.jpg',
      highlights: formData.highlights.map(h => h.trim()).filter(Boolean),
      price: formData.price.trim() || undefined,
      duration: formData.duration.trim() || undefined,
    };

    if (editingId) {
      updateService(editingId, payload);
      toast({
        title: 'Service Updated',
        message: `"${payload.title}" has been updated successfully.`,
        type: 'success',
      });
    } else {
      const slugId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      addService({
        title: formData.title.trim(),
        category: formData.category,
        indications: formData.indications.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || '/services/kidney-stones.jpg',
        highlights: formData.highlights.map(h => h.trim()).filter(Boolean),
        price: formData.price.trim() || undefined,
        duration: formData.duration.trim() || undefined,
        id: slugId || ('srv-' + Date.now())
      });
      toast({
        title: 'Service Created',
        message: `"${payload.title}" added to clinic treatments.`,
        type: 'success',
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, title?: string) => {
    const ok = await confirm({
      title: 'Delete Treatment Service',
      message: `Are you sure you want to delete ${title ? `"${title}"` : 'this service'}? This will remove the service from treatment listings and patient booking options.`,
      confirmText: 'Delete Service',
      cancelText: 'Cancel',
      type: 'danger',
    });
    if (ok) {
      deleteService(id);
      toast({
        title: 'Service Deleted',
        message: `${title ? `"${title}"` : 'Service'} was removed successfully.`,
        type: 'success',
      });
    }
  };

  const handleAddHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const handleRemoveHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights.length ? newHighlights : [''] });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Try Supabase Storage upload
    try {
      const publicUrl = await uploadImageToSupabase(file, file.name, 'services');
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, image: publicUrl }));
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
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const getCategoryMeta = (cat: string): CategoryMeta => {
    return CATEGORIES.find(c => c.key === cat) || CATEGORIES[0];
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Links */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3.5">
        {/* Header Row with Title and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-teal-50 text-[#108283]">
                <Stethoscope size={20} />
              </span>
              <h2 className="text-lg sm:text-xl font-['Playfair_Display'] font-bold text-gray-900">
                Services Pages Management
              </h2>
            </div>
            <p className="text-xs text-gray-500 font-['Source_Sans_3']">
              Manage treatments published live on <strong className="text-teal-700">/homeopathy</strong>, <strong className="text-teal-700">/cosmetic-treatments</strong>, and <strong className="text-teal-700">/hair-and-skin</strong>.
            </p>
          </div>

          <button 
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#108283] text-white rounded-xl hover:bg-[#0c6b6c] transition-colors shrink-0 font-['Source_Sans_3'] text-sm font-semibold shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>

        {/* Quick Page Links Bar */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
              Live Pages:
            </span>
          </div>

          <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            {CATEGORIES.map(cat => (
              <Link 
                key={cat.key}
                href={cat.path}
                target="_blank"
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-[#FAEDDA]/70 border border-gray-200 text-gray-700 hover:text-[#108283] text-xs font-semibold rounded-lg transition-colors font-['Source_Sans_3'] text-center"
                title={`View ${cat.label}`}
              >
                <span className="truncate hidden sm:inline">{cat.label}</span>
                <span className="truncate sm:hidden">{cat.label.replace(' Treatments', '')}</span>
                <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pill Tabs with Mobile Left & Right Arrows */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            className="flex sm:hidden w-7 h-7 rounded-lg bg-white border border-gray-200/90 shadow-2xs text-gray-700 hover:text-[#108283] hover:border-[#108283] items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer"
            title="Scroll categories left"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div 
            ref={categoryScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar scroll-smooth flex-1 sm:flex-initial"
          >
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-['Source_Sans_3'] transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#108283] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Services ({counts.all})
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-['Source_Sans_3'] transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  categoryFilter === cat.key
                    ? 'bg-[#108283] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cat.dotColor}`} />
                <span>{cat.label}</span>
                <span className="opacity-75">({counts[cat.key]})</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollCategories('right')}
            className="flex sm:hidden w-7 h-7 rounded-lg bg-white border border-gray-200/90 shadow-2xs text-gray-700 hover:text-[#108283] hover:border-[#108283] items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer"
            title="Scroll categories right"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search treatments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 font-['Source_Sans_3'] text-sm">No services found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredServices.map((service: Service) => {
            const catMeta = getCategoryMeta(service.category);
            return (
              <div 
                key={service.id} 
                className="bg-white border border-gray-200/80 rounded-xl overflow-hidden group hover:border-[#108283]/40 hover:shadow-md transition-all flex flex-col justify-between shadow-xs"
              >
                {/* Professional 16:10 Photographic Image */}
                <div className="aspect-[16/10] w-full overflow-hidden relative bg-gray-100 border-b border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/FAF0DD/108283?text=' + encodeURIComponent(service.title);
                    }}
                  />
                  {/* Target Page Badge */}
                  <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-xs border ${catMeta.badgeColor}`}>
                    {catMeta.label.split(' ')[0]}
                  </span>
                </div>
                
                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-[#108283] uppercase tracking-wider">
                        {catMeta.label}
                      </span>
                      <Link 
                        href={`${catMeta.path}#${service.id}`}
                        target="_blank"
                        className="text-[11px] text-gray-400 hover:text-[#108283] flex items-center gap-0.5 font-['Source_Sans_3']"
                        title="View on page"
                      >
                        <span>View</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>

                    <h3 className="text-sm sm:text-[15px] font-['Playfair_Display'] font-bold text-gray-900 leading-snug mb-2 line-clamp-1 group-hover:text-[#108283] transition-colors" title={service.title}>
                      {service.title}
                    </h3>
                    
                    {/* Indications Box */}
                    {service.indications && (
                      <div className="bg-teal-50/60 border border-teal-100 p-2.5 rounded-lg mb-2 text-xs">
                        <span className="text-[9.5px] font-bold text-[#108283] uppercase tracking-wider block mb-0.5">Indications</span>
                        <p className="text-gray-700 line-clamp-1 font-['Source_Sans_3'] text-[11.5px]" title={service.indications}>
                          {service.indications}
                        </p>
                      </div>
                    )}

                    {/* Price and Duration Badges */}
                    {(service.price || service.duration) && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {service.price && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-50 text-[#108283] border border-teal-200/80 text-[10.5px] font-bold font-['Source_Sans_3']">
                            <span>{service.price}</span>
                          </span>
                        )}
                        {service.duration && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200 text-[10.5px] font-semibold font-['Source_Sans_3']">
                            <span>⏱️ {service.duration}</span>
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-gray-500 text-xs font-['Source_Sans_3'] line-clamp-2 leading-relaxed mb-3">
                      {service.description}
                    </p>

                    {service.highlights && service.highlights.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 font-['Source_Sans_3'] mb-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{service.highlights.length} Key Treatment Highlights</span>
                      </div>
                    )}
                  </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-auto gap-2">
                      <button 
                        onClick={() => handleOpenModal(service)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#108283] hover:bg-teal-50 hover:border-teal-200 rounded-lg transition-colors border border-gray-200/80 cursor-pointer font-['Source_Sans_3']"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id, service.title)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/80 cursor-pointer font-['Source_Sans_3']"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Service' : 'Add Service'}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          {/* Service Title and Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label className="flex items-center text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5 h-4 font-['Source_Sans_3']">
                Service Title <span className="text-rose-500 ml-1">*</span>
              </label>
              <input 
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all font-medium text-gray-900"
                placeholder="e.g. Kidney Stones, Hair PRP, Medifacial"
              />
            </div>

            <div className="sm:col-span-5">
              <AdminSelect
                label="Target Category"
                required
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val as any })}
                options={[
                  { value: 'homeopathy', label: 'Homeopathy (/homeopathy)' },
                  { value: 'cosmetic', label: 'Cosmetic (/cosmetic-treatments)' },
                  { value: 'hair-skin', label: 'Hair & Skin (/hair-and-skin)' },
                ]}
              />
            </div>
          </div>

          {/* Indications (Symptom summary) */}
          <div>
            <label className="flex items-center text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5 h-4 font-['Source_Sans_3']">
              Indications / Clinical Concerns
            </label>
            <input 
              type="text"
              value={formData.indications}
              onChange={(e) => setFormData({...formData, indications: e.target.value})}
              className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all font-medium text-gray-900"
              placeholder="e.g. Renal calculi, flank pain, burning urination, recurrent stones..."
            />
          </div>

          {/* Consultation Fee & Time Required Row - Horizontally Balanced & Pixel-Aligned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5 h-4 font-['Source_Sans_3']">
                Starting Fee / Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs pointer-events-none select-none">
                  ₹
                </span>
                <input 
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full pl-7 pr-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all font-medium text-gray-900"
                  placeholder="e.g. From ₹999+, ₹1,499"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5 h-4 font-['Source_Sans_3']">
                Duration / Process Time
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input 
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all font-medium text-gray-900"
                  placeholder="e.g. 30-45 mins, 1 hr"
                />
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="flex items-center text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5 h-4 font-['Source_Sans_3']">
              Treatment Description
            </label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all resize-none leading-relaxed text-gray-800"
              placeholder="Provide full description of the procedure, healing philosophy, and expected outcome..."
            />
          </div>

          {/* Treatment Image (Upload & Preview) */}
          <div>
            <label className="flex items-center text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5 h-4 font-['Source_Sans_3']">
              Featured Image <span className="text-rose-500 ml-1">*</span>
            </label>

            {/* Touch-Friendly Image Upload & Preview Row */}
            <div className="flex items-center gap-3 mb-2.5">
              {formData.image ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200 shadow-2xs group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=IMG'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl border border-dashed border-gray-300 bg-gray-50 shrink-0 flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}

              <label 
                className="flex-1 py-2.5 px-4 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 font-['Source_Sans_3'] shadow-xs active:scale-98"
                title="Upload image from device"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Photo to Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>
            </div>

            {/* Paste URL fallback */}
            <input 
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs font-['Source_Sans_3'] text-gray-700 outline-none focus:ring-1 focus:ring-[#108283] focus:border-[#108283] transition-all"
              placeholder="Or paste image URL (/services/... or https://)"
            />
            <p className="text-[10px] text-gray-400 font-['Source_Sans_3'] mt-1">
              Supports camera capture &amp; photos (JPEG, PNG, WEBP) — auto-scaled &amp; optimized.
            </p>
          </div>

          {/* Treatment Highlights - Clean list without double scrollbar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center text-[11px] font-semibold text-gray-700 uppercase tracking-wider h-4 font-['Source_Sans_3']">
                Key Treatment Highlights ({formData.highlights.filter(h => h.trim()).length})
              </label>
              <button 
                type="button" 
                onClick={handleAddHighlight}
                className="text-xs text-[#108283] hover:text-[#0c6b6c] font-semibold cursor-pointer flex items-center gap-1 font-['Source_Sans_3'] bg-teal-50/80 hover:bg-teal-100/80 px-2.5 py-0.5 rounded-lg transition-colors border border-teal-200/50"
              >
                <Plus className="w-3 h-3" /> Add Highlight
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#108283] text-[10px] font-bold flex items-center justify-center shrink-0 border border-teal-200/60 select-none">
                    {i + 1}
                  </span>
                  <input 
                    type="text"
                    value={h}
                    onChange={(e) => handleHighlightChange(i, e.target.value)}
                    placeholder={`Highlight #${i + 1} (e.g. Non-Surgical Stone Dissolution)`}
                    className="flex-1 px-3 py-1.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:bg-white focus:ring-1 focus:ring-[#108283] focus:border-[#108283] outline-none transition-all"
                  />
                  {formData.highlights.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveHighlight(i)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors shrink-0"
                      title="Remove highlight"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-gray-100 mt-2">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium text-xs sm:text-sm cursor-pointer font-['Source_Sans_3']"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleSave}
              className="px-5 py-2 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl transition-all font-semibold text-xs sm:text-sm cursor-pointer shadow-xs font-['Source_Sans_3'] active:scale-98"
            >
              {editingId ? 'Save Changes' : 'Add Service'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
