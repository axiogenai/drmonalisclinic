'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon, X } from 'lucide-react';
import { useAdminData, Testimonial } from '@/context/AdminContext';
import { useDialog } from '@/context/DialogContext';
import { uploadImageToSupabase } from '@/lib/supabase';
import AdminModal from '@/components/admin/AdminModal';

const AVATAR_COLORS = [
  { bg: '#FCE7F3', text: '#9D174D', border: '#FBCFE8' }, // Luxury Rose Pink
  { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE' }, // Indigo Blue
  { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' }, // Warm Amber Gold
  { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' }, // Fresh Emerald Green
  { bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE' }, // Royal Violet Purple
  { bg: '#E0F2FE', text: '#075985', border: '#BAE6FD' }, // Sky Cyan Blue
  { bg: '#FFEDD5', text: '#9A3412', border: '#FED7AA' }, // Warm Coral Orange
  { bg: '#FAE8FF', text: '#86198F', border: '#F5D0FE' }, // Orchid Fuchsia
  { bg: '#CCFBF1', text: '#115E59', border: '#99F6E4' }, // Pure Teal Mint
  { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1' }, // Classic Slate
];

export default function TestimonialsManager() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdminData();
  const { confirm, toast } = useDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    concern: '',
    tag: '',
    rating: 5,
    review: '',
    image: ''
  });

  const filteredTestimonials = testimonials.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      (t.name || '').toLowerCase().includes(q) ||
      (t.concern || '').toLowerCase().includes(q) ||
      (t.tag || '').toLowerCase().includes(q) ||
      (t.review || '').toLowerCase().includes(q)
    );
  });

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setFormData({
        name: item.name || '',
        concern: item.concern || '',
        tag: item.tag || '',
        rating: item.rating || 5,
        review: item.review || '',
        image: item.image || ''
      });
      setEditingId(item.id);
    } else {
      setFormData({
        name: '',
        concern: '',
        tag: '',
        rating: 5,
        review: '',
        image: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase(file, file.name, 'testimonials');
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, image: publicUrl }));
        setIsUploading(false);
        return;
      }
    } catch (err) {
      console.warn('Supabase storage upload error:', err);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
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

  const handleSave = () => {
    const trimmedName = formData.name.trim();
    const trimmedReview = formData.review.trim();

    if (!trimmedName) {
      toast({
        title: 'Patient Name Required',
        message: 'Please enter the patient or reviewer name.',
        type: 'error'
      });
      return;
    }

    if (!trimmedReview) {
      toast({
        title: 'Review Quote Required',
        message: 'Please write the patient story or review experience.',
        type: 'error'
      });
      return;
    }

    const payload: Partial<Testimonial> = {
      name: trimmedName,
      concern: formData.concern.trim() || 'General Wellness',
      tag: (formData.tag.trim() || formData.concern.trim() || 'PATIENT STORY').toUpperCase(),
      rating: Number(formData.rating) || 5,
      review: trimmedReview,
      image: formData.image.trim() || undefined
    };

    if (editingId) {
      updateTestimonial(editingId, payload);
      toast({
        title: 'Patient Story Updated',
        message: `"${trimmedName}" story updated successfully.`,
        type: 'success'
      });
    } else {
      addTestimonial({
        ...payload,
        id: 'testi-' + Date.now()
      } as Testimonial);
      toast({
        title: 'Patient Story Added',
        message: `"${trimmedName}" added to clinic stories.`,
        type: 'success'
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: 'Delete Patient Story',
      message: `Are you sure you want to delete the story from "${name}"? This action cannot be undone.`,
      confirmText: 'Delete Story',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (ok) {
      deleteTestimonial(id);
      toast({
        title: 'Story Deleted',
        message: `Story from "${name}" was removed.`,
        type: 'success'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-[#108283]">Patient Stories</h2>
          <p className="text-xs text-gray-500 font-source mt-0.5">
            Manage real patient reviews, case recoveries, and clinical testimonials ({testimonials.length} total)
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-source focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none shadow-2xs"
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl transition-colors shrink-0 font-source text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Story</span>
          </button>
        </div>
      </div>

      {/* Grid of Testimonial Cards */}
      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-gray-500 font-source text-sm">
            {searchTerm ? 'No patient stories match your search query.' : 'No testimonials found. Add your first patient story.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTestimonials.map((item: Testimonial, index: number) => {
            const avatarTheme = AVATAR_COLORS[index % AVATAR_COLORS.length];
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-4.5 flex flex-col hover:border-[#108283]/40 hover:shadow-md transition-all shadow-xs group"
              >
                <div className="flex-1">
                  {/* Header: Photo / Avatar + Name + Stars */}
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <div 
                      className="w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center shrink-0 font-bold font-playfair text-xs shadow-2xs"
                      style={{
                        backgroundColor: avatarTheme.bg,
                        color: avatarTheme.text,
                        borderColor: avatarTheme.border,
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{item.name?.slice(0, 2).toUpperCase() || 'PT'}</span>
                      )}
                    </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm sm:text-base font-playfair font-bold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {/* Google Review Stars */}
                      <div className="flex items-center gap-0.5 shrink-0 select-none" title={`${item.rating || 5} out of 5 Stars`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            viewBox="0 0 24 24"
                            className="w-3.5 h-3.5"
                            fill={star <= (item.rating || 5) ? '#FBBC04' : '#E5E7EB'}
                            stroke={star <= (item.rating || 5) ? '#FBBC04' : '#D1D5DB'}
                            strokeWidth="1"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Pills: Tag & Concern */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      {item.tag && (
                        <span 
                          className="inline-block px-1.5 py-0.5 text-[8.5px] font-bold rounded-md uppercase tracking-wider border shadow-2xs"
                          style={{
                            backgroundColor: avatarTheme.bg,
                            color: avatarTheme.text,
                            borderColor: avatarTheme.border,
                          }}
                        >
                          {item.tag}
                        </span>
                      )}
                      {item.concern && item.concern !== item.tag && (
                        <span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-700 text-[8.5px] font-semibold rounded-md border border-gray-200">
                          {item.concern}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div className="relative mb-2.5 pl-3 border-l-2 border-[#108283]/30">
                  <p className="text-gray-600 text-xs sm:text-sm font-source italic leading-relaxed line-clamp-3">
                    "{item.review}"
                  </p>
                </div>
              </div>

              {/* Action Buttons: Anchored to Bottom */}
              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-gray-100 mt-1">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-[#108283] hover:bg-[#FAEDDA]/60 rounded-lg transition-colors border border-gray-200/80 cursor-pointer font-source"
                  title="Edit story"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/80 cursor-pointer font-source"
                  title="Delete story"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Add / Edit Testimonial Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Patient Story' : 'Add New Patient Story'}
        maxWidth="max-w-lg"
      >
        <div className="space-y-3.5">
          {/* Patient Name & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-source">
                Patient Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-source transition-all"
                placeholder="e.g. Sneha R."
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-source">
                Rating
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/70 border border-gray-200 rounded-xl select-none">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: stars })}
                      className="cursor-pointer p-0.5 focus:outline-none"
                      title={`${stars} Stars`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill={stars <= formData.rating ? '#FBBC04' : '#E5E7EB'}
                        stroke={stars <= formData.rating ? '#FBBC04' : '#D1D5DB'}
                        strokeWidth="1"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <span className="ml-1 text-xs font-bold text-gray-700 font-source">
                  {formData.rating} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Condition / Concern & Category Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-source">
                Condition / Treatment
              </label>
              <input
                type="text"
                value={formData.concern}
                onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-source transition-all"
                placeholder="e.g. Chronic Acne Recovery"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-source">
                Category Tag Pill
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-source transition-all"
                placeholder="e.g. ACNE RECOVERY"
              />
            </div>
          </div>

          {/* Patient Photo / Avatar Upload */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-source">
              Patient Photo / Avatar (Optional)
            </label>
            <div className="flex items-center gap-2">
              {formData.image ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white shrink-0 border border-gray-200 shadow-xs group">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full border border-dashed border-gray-300 bg-gray-50 shrink-0 flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
              )}

              <input
                type="text"
                placeholder="Image URL or upload below..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 min-w-0 px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-source focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all"
              />

              <label
                className={`px-3 py-2 ${
                  isUploading ? 'bg-gray-400 cursor-wait' : 'bg-[#108283] hover:bg-[#0c6b6c] cursor-pointer'
                } text-white rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 font-source shadow-xs`}
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
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-source">
              Patient Review Experience <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-source resize-none leading-relaxed transition-all"
              placeholder="Describe the clinical improvement, consultation experience, results achieved..."
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 font-source text-xs sm:text-sm hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#108283] hover:bg-[#0c6b6c] text-white font-source font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              {editingId ? 'Update Story' : 'Save Story'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
