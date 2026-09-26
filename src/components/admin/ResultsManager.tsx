'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Images, 
  Image as ImageIcon, 
  Upload, 
  RotateCcw, 
  AlertCircle, 
  Check, 
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAdminData, ResultItem } from '@/context/AdminContext';
import { useDialog } from '@/context/DialogContext';
import { uploadImageToSupabase } from '@/lib/supabase';
import AdminModal from '@/components/admin/AdminModal';
import AdminSelect from '@/components/admin/AdminSelect';

type CategoryFilter = 'all' | 'skin' | 'hair' | 'face';

interface CategoryMeta {
  key: 'skin' | 'hair' | 'face';
  label: string;
  badgeColor: string;
  dotColor: string;
}

const CATEGORIES: CategoryMeta[] = [
  { 
    key: 'skin', 
    label: 'Skin & Scars', 
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-500'
  },
  { 
    key: 'hair', 
    label: 'Hair Care', 
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    dotColor: 'bg-teal-500'
  },
  { 
    key: 'face', 
    label: 'Face & Anti-Aging', 
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500'
  },
];

export default function ResultsManager() {
  const { results, addResult, updateResult, deleteResult, restoreDefaultResults } = useAdminData();
  const { confirm, toast } = useDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
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

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'skin' as 'skin' | 'hair' | 'face',
    image: '',
    metric: '',
    doctorNotes: '',
    isActive: true,
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const counts = useMemo(() => {
    return {
      all: results.length,
      skin: results.filter(r => r.category === 'skin').length,
      hair: results.filter(r => r.category === 'hair').length,
      face: results.filter(r => r.category === 'face').length,
    };
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const matchesSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.metric.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.doctorNotes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [results, searchTerm, categoryFilter]);

  const handleOpenModal = (result?: ResultItem) => {
    if (result) {
      setFormData({
        name: result.name || '',
        category: result.category || 'skin',
        image: result.image || '',
        metric: result.metric || '',
        doctorNotes: result.doctorNotes || '',
        isActive: result.isActive !== false,
      });
      setEditingId(result.id);
    } else {
      setFormData({
        name: '',
        category: categoryFilter !== 'all' ? categoryFilter : 'skin',
        image: '',
        metric: '',
        doctorNotes: '',
        isActive: true,
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const compressAndGetUrl = async (file: File, callback: (dataUrl: string) => void) => {
    // 1. Try Supabase Storage upload
    try {
      const publicUrl = await uploadImageToSupabase(file, file.name, 'transformations');
      if (publicUrl) {
        callback(publicUrl);
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
        const maxDim = 1000;
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
          callback(dataUrl);
        } else {
          callback(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAndGetUrl(file, (dataUrl) => {
      setFormData(prev => ({ ...prev, image: dataUrl }));
    });
  };

  const handleDirectCardImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAndGetUrl(file, (dataUrl) => {
      updateResult(id, { image: dataUrl });
      toast({
        title: 'Photo Updated',
        message: 'Transformation photo updated successfully.',
        type: 'success',
      });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: 'Condition Required',
        message: 'Please enter a transformation name/condition.',
        type: 'error',
      });
      return;
    }
    if (!formData.image.trim()) {
      toast({
        title: 'Photo Required',
        message: 'Please provide an image URL or upload a photo.',
        type: 'error',
      });
      return;
    }

    if (editingId) {
      updateResult(editingId, {
        name: formData.name.trim(),
        category: formData.category,
        image: formData.image.trim(),
        metric: formData.metric.trim() || 'Clinical Improvement',
        doctorNotes: formData.doctorNotes.trim(),
        isActive: formData.isActive,
      });
      toast({
        title: 'Transformation Updated',
        message: `"${formData.name.trim()}" result updated successfully.`,
        type: 'success',
      });
    } else {
      const newResult: ResultItem = {
        id: `res-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        image: formData.image.trim(),
        metric: formData.metric.trim() || 'Clinical Improvement',
        doctorNotes: formData.doctorNotes.trim(),
        isActive: formData.isActive,
      };
      addResult(newResult);
      toast({
        title: 'Transformation Created',
        message: `"${newResult.name}" added to showcase.`,
        type: 'success',
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name?: string) => {
    const ok = await confirm({
      title: 'Delete Transformation Case',
      message: `Are you sure you want to delete ${name ? `"${name}"` : 'this transformation case'}? This will remove the case from the homepage results gallery.`,
      confirmText: 'Delete Case',
      cancelText: 'Cancel',
      type: 'danger',
    });
    if (ok) {
      deleteResult(id);
      setDeletingId(null);
      toast({
        title: 'Transformation Removed',
        message: `${name ? `"${name}"` : 'Transformation'} was removed successfully.`,
        type: 'success',
      });
    }
  };

  const handleResetDefaults = () => {
    restoreDefaultResults();
    setShowResetConfirm(false);
    notify('Reset all 16 clinical transformation results to default');
  };

  const getCategoryMeta = (cat: string): CategoryMeta => {
    return CATEGORIES.find(c => c.key === cat) || CATEGORIES[0];
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#108283] text-white px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <Check size={18} />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Top Banner & Quick Links (Same as ServicesManager) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-teal-50 text-[#108283]">
              <Images size={20} />
            </span>
            <h2 className="text-xl font-['Playfair_Display'] font-bold text-gray-900">
              Before &amp; After Results Management
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-['Source_Sans_3']">
            Manage clinical before/after results, photograph transformations, and clinical metrics shown on the homepage.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Link
              href="/#results"
              target="_blank"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-[#FAEDDA]/70 border border-gray-200 text-gray-700 hover:text-[#108283] text-xs rounded-lg transition-colors font-['Source_Sans_3']"
            >
              <span>View Results on Homepage</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl transition-colors shrink-0 font-['Source_Sans_3'] text-xs font-semibold cursor-pointer"
            title="Restore default clinical transformation results"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#108283] text-white rounded-xl hover:bg-[#0c6b6c] transition-colors shrink-0 font-['Source_Sans_3'] text-sm font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transformation</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Search Row (Exact same as ServicesManager) */}
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
              All Results ({counts.all})
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
            placeholder="Search transformations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Results Grid - Identical Card Styling to ServicesManager */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 font-['Source_Sans_3'] text-sm">No transformation results found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredResults.map((item) => {
            const catMeta = getCategoryMeta(item.category);
            return (
              <div 
                key={item.id} 
                className="bg-white border border-gray-200/80 rounded-xl overflow-hidden group hover:border-[#108283]/40 hover:shadow-md transition-all flex flex-col justify-between shadow-xs"
              >
                {/* 16:10 Photographic Image with Direct Upload option */}
                <div className="aspect-[16/10] w-full overflow-hidden relative bg-gray-100 border-b border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/FAF0DD/108283?text=' + encodeURIComponent(item.name);
                    }}
                  />
                  
                  {/* Target Category Badge */}
                  <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-xs border ${catMeta.badgeColor}`}>
                    {catMeta.label}
                  </span>

                  {/* Direct Image Upload Option on Card */}
                  <label 
                    className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-black/70 hover:bg-black/90 text-white rounded-lg text-[10px] font-semibold cursor-pointer transition-all flex items-center gap-1 backdrop-blur-xs opacity-0 group-hover:opacity-100 shadow-sm"
                    title="Change transformation photo"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleDirectCardImageUpload(item.id, e)} 
                    />
                  </label>
                </div>
                
                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-[#108283] uppercase tracking-wider">
                        {catMeta.label}
                      </span>
                      <Link 
                        href="/#results"
                        target="_blank"
                        className="text-[11px] text-gray-400 hover:text-[#108283] flex items-center gap-0.5 font-['Source_Sans_3']"
                        title="View on page"
                      >
                        <span>View</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>

                    <h3 className="text-sm sm:text-[15px] font-['Playfair_Display'] font-bold text-gray-900 leading-snug mb-2 line-clamp-1 group-hover:text-[#108283] transition-colors" title={item.name}>
                      {item.name}
                    </h3>
                    
                    {/* Clinical Metric Box */}
                    <div className="bg-teal-50/60 border border-teal-100 p-2.5 rounded-lg mb-2 text-xs">
                      <span className="text-[9.5px] font-bold text-[#108283] uppercase tracking-wider block mb-0.5">Clinical Metric</span>
                      <p className="text-gray-700 line-clamp-1 font-['Source_Sans_3'] text-[11.5px]" title={item.metric}>
                        {item.metric}
                      </p>
                    </div>

                    <p className="text-gray-500 text-xs font-['Source_Sans_3'] line-clamp-2 leading-relaxed mb-3" title={item.doctorNotes}>
                      {item.doctorNotes}
                    </p>
                  </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-auto gap-2">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#108283] hover:bg-teal-50 hover:border-teal-200 rounded-lg transition-colors border border-gray-200/80 cursor-pointer font-['Source_Sans_3']"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                        title="Delete Result"
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

      {/* Add / Edit Modal - Compact & Clean (Same structure as ServicesManager) */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Transformation Result' : 'Add New Transformation'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Condition / Treatment Name */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
              Treatment / Condition Name <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all"
              placeholder="e.g. Accident Scars, Melasma, Hair Regrowth"
            />
          </div>

          {/* Category */}
          <AdminSelect
            label="Category"
            required
            value={formData.category}
            onChange={(val) => setFormData({ ...formData, category: val as any })}
            options={[
              { value: 'skin', label: 'Skin & Scars' },
              { value: 'hair', label: 'Hair Care' },
              { value: 'face', label: 'Face & Anti-Aging' },
            ]}
          />

          {/* Transformation Metric */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
              Transformation Metric <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text"
              required
              value={formData.metric}
              onChange={(e) => setFormData({...formData, metric: e.target.value})}
              className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all"
              placeholder="e.g. 80 - 90% Scar Reduction, Deep Tissue Regeneration"
            />
          </div>

          {/* Doctor / Clinical Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
              Doctor / Clinical Notes <span className="text-rose-500">*</span>
            </label>
            <textarea 
              rows={2}
              required
              value={formData.doctorNotes}
              onChange={(e) => setFormData({...formData, doctorNotes: e.target.value})}
              className="w-full px-3 py-1.5 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-['Source_Sans_3'] transition-all resize-none"
              placeholder="Constitutional homeopathic remedies and natural regenerative therapy stimulating gentle tissue recovery..."
            />
          </div>

          {/* Clinical Photograph (Slim Compact Upload & Preview - Same as ServicesManager) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
              Clinical Photograph (Upload File or Enter URL) <span className="text-rose-500">*</span>
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
                placeholder="Upload file or enter /accident-scars.png or https://"
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

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#108283] hover:bg-[#0c6b6c] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingId ? 'Save Changes' : 'Create Transformation'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Reset Defaults Confirmation Modal */}
      <AdminModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset to Default Results"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-amber-50 text-amber-600 shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Restore all 16 clinical transformation results?
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This will reset any custom transformations you added or edited back to the clinic&apos;s original 16 cases across Skin, Hair, and Face.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
