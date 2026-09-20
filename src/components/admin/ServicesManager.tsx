'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, X, ExternalLink, Tag, Check, Layers, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { useAdminData, Service } from '@/context/AdminContext';
import { uploadImageToSupabase } from '@/lib/supabase';
import AdminModal from '@/components/admin/AdminModal';

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
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-500'
  },
  {
    key: 'cosmetic',
    label: 'Cosmetic Treatments',
    path: '/cosmetic-treatments',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500'
  },
  {
    key: 'hair-skin',
    label: 'Hair & Skin Treatments',
    path: '/hair-and-skin',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    dotColor: 'bg-teal-500'
  }
];

export default function ServicesManager() {
  const { services, addService, updateService, deleteService } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategoryKey>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'homeopathy' as 'homeopathy' | 'cosmetic' | 'hair-skin',
    indications: '',
    description: '',
    image: '',
    highlights: [''],
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
        highlights: service.highlights?.length ? [...service.highlights] : ['']
      });
      setEditingId(service.id);
    } else {
      setFormData({
        title: '',
        category: categoryFilter !== 'all' ? categoryFilter : 'homeopathy',
        indications: '',
        description: '',
        image: '',
        highlights: ['']
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a service title');
      return;
    }

    const payload: Partial<Service> = {
      title: formData.title.trim(),
      category: formData.category,
      indications: formData.indications.trim(),
      description: formData.description.trim(),
      image: formData.image.trim() || '/services/kidney-stones.jpg',
      highlights: formData.highlights.map(h => h.trim()).filter(Boolean)
    };

    if (editingId) {
      updateService(editingId, payload);
    } else {
      const slugId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      addService({
        title: formData.title.trim(),
        category: formData.category,
        indications: formData.indications.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || '/services/kidney-stones.jpg',
        highlights: formData.highlights.map(h => h.trim()).filter(Boolean),
        id: slugId || ('srv-' + Date.now())
      });
    }
    setIsModalOpen(false);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-['Playfair_Display'] font-bold text-gray-900">
            Services Pages Management
          </h2>
          <p className="text-xs text-gray-500 font-['Source_Sans_3'] mt-1">
            Manage treatments published live on <strong className="text-teal-700">/homeopathy</strong>, <strong className="text-teal-700">/cosmetic-treatments</strong>, and <strong className="text-teal-700">/hair-and-skin</strong>.
          </p>
          {/* Quick Page Links */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Live Pages:</span>
            {CATEGORIES.map(cat => (
              <Link 
                key={cat.key}
                href={cat.path}
                target="_blank"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-[#FAEDDA]/70 border border-gray-200 text-gray-700 hover:text-[#108283] text-xs rounded-lg transition-colors font-['Source_Sans_3']"
              >
                <span>{cat.label}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
            ))}
          </div>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#108283] text-white rounded-xl hover:bg-[#0c6b6c] transition-colors shrink-0 font-['Source_Sans_3'] text-sm font-semibold shadow-xs cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Category Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
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
                      <div className="bg-[#FAF0DD]/40 border border-[#D4AF37]/20 p-2 rounded-lg mb-2 text-xs">
                        <span className="text-[9.5px] font-bold text-[#b8860b] uppercase tracking-wider block mb-0.5">Indications</span>
                        <p className="text-gray-700 line-clamp-1 font-['Source_Sans_3'] text-[11.5px]" title={service.indications}>
                          {service.indications}
                        </p>
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

                  {deletingId === service.id ? (
                    <div className="flex items-center gap-2 p-1.5 bg-red-50 rounded-lg mt-auto">
                      <p className="text-[11px] text-red-800 font-semibold flex-1">Delete service?</p>
                      <button 
                        onClick={() => setDeletingId(null)}
                        className="px-2 py-0.5 text-[11px] text-gray-600 hover:bg-white rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          deleteService(service.id);
                          setDeletingId(null);
                        }}
                        className="px-2 py-0.5 text-[11px] bg-red-600 text-white rounded hover:bg-red-700 font-medium cursor-pointer"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-auto gap-2">
                      <button 
                        onClick={() => handleOpenModal(service)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#108283] hover:bg-[#FAEDDA]/60 rounded-lg transition-colors border border-gray-200/80 cursor-pointer font-['Source_Sans_3']"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => setDeletingId(service.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/80 cursor-pointer font-['Source_Sans_3']"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
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
        maxWidth="max-w-md"
      >
        <div className="space-y-3.5">
          {/* Service Title */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
              Service Title <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all"
              placeholder="e.g. Kidney Stones, Hair PRP, Medifacial"
            />
          </div>

          {/* Service Category / Page Assignment */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
              Target Services Page <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as any})}
              className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] cursor-pointer"
            >
              <option value="homeopathy">Homeopathy Treatments (/homeopathy)</option>
              <option value="cosmetic">Cosmetic Treatments (/cosmetic-treatments)</option>
              <option value="hair-skin">Hair & Skin Treatments (/hair-and-skin)</option>
            </select>
          </div>

          {/* Indications (Symptom summary) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
              Indications / Clinical Concerns
            </label>
            <input 
              type="text"
              value={formData.indications}
              onChange={(e) => setFormData({...formData, indications: e.target.value})}
              className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all"
              placeholder="e.g. Renal calculi, sudden flank pain, burning urination..."
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
              Treatment Description
            </label>
            <textarea 
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-1.5 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all resize-none"
              placeholder="Provide full description of the procedure, healing philosophy, and expected outcome..."
            />
          </div>

          {/* Treatment Image (Slim Compact Upload & Preview) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
              Image (Upload File or Enter URL)
            </label>
            <div className="flex items-center gap-2">
              {formData.image ? (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200 shadow-xs group">
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
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="flex-1 min-w-0 px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] text-gray-700 outline-none focus:ring-1 focus:ring-[#108283] focus:border-[#108283] transition-all"
                placeholder="Upload file or enter /services/... or https://"
              />

              <label 
                className="px-3 py-2 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 flex items-center gap-1.5 font-['Source_Sans_3'] shadow-xs" 
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
            <p className="text-[10px] text-gray-400 font-['Source_Sans_3'] mt-1">
              Supports any image size (JPEG, PNG, WEBP) — auto-scaled &amp; properly fitted.
            </p>
          </div>

          {/* Treatment Highlights */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider font-['Source_Sans_3']">
                Treatment Highlights (Bullets)
              </label>
              <button 
                type="button" 
                onClick={handleAddHighlight}
                className="text-xs text-[#108283] font-semibold hover:underline cursor-pointer flex items-center gap-1 font-['Source_Sans_3']"
              >
                <Plus className="w-3 h-3" /> Add Highlight
              </button>
            </div>
            
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {formData.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input 
                    type="text"
                    value={h}
                    onChange={(e) => handleHighlightChange(i, e.target.value)}
                    placeholder="e.g. Non-Surgical Stone Dissolution"
                    className="flex-1 px-2.5 py-1 bg-gray-50/80 border border-gray-200 rounded-lg text-xs font-['Source_Sans_3'] focus:bg-white focus:ring-1 focus:ring-[#108283] outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveHighlight(i)}
                    className="text-gray-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium text-xs sm:text-sm cursor-pointer font-['Source_Sans_3']"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl transition-all font-semibold text-xs sm:text-sm cursor-pointer shadow-xs font-['Source_Sans_3'] active:scale-98"
            >
              {editingId ? 'Save Changes' : 'Add Service'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
