'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon, X } from 'lucide-react';
import { useAdminData } from '@/context/AdminContext';
import { useDialog } from '@/context/DialogContext';
import { uploadImageToSupabase } from '@/lib/supabase';
import AdminModal from '@/components/admin/AdminModal';

export default function BlogManager() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useAdminData();
  const { confirm, toast } = useDialog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    date: '',
    category: '',
    excerpt: ''
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setFormData({
        title: item.title || '',
        image: item.image || '',
        date: item.date || '',
        category: item.category || '',
        excerpt: item.excerpt || ''
      });
      setEditingId(item.id);
    } else {
      setFormData({
        title: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Skincare',
        excerpt: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Try Supabase Storage upload
    try {
      const publicUrl = await uploadImageToSupabase(file, file.name, 'blogs');
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

  const handleSave = () => {
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      toast({
        title: 'Title Required',
        message: 'Please provide a title for the blog article.',
        type: 'error'
      });
      return;
    }
    
    if (editingId) {
      updateBlog(editingId, { ...formData, title: trimmedTitle });
      toast({
        title: 'Article Updated',
        message: `"${trimmedTitle}" was successfully updated.`,
        type: 'success'
      });
    } else {
      addBlog({ ...formData, title: trimmedTitle, id: 'blog-' + Date.now() });
      toast({
        title: 'Article Created',
        message: `"${trimmedTitle}" published to blog list.`,
        type: 'success'
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: 'Delete Blog Article',
      message: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      confirmText: 'Delete Article',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (ok) {
      deleteBlog(id);
      toast({
        title: 'Article Deleted',
        message: `"${title}" has been removed.`,
        type: 'success'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-playfair font-bold text-[#108283]">Blog Posts</h2>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#108283] text-white rounded-xl hover:bg-[#188D90] transition-colors shrink-0 font-source text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Blog Post</span>
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-source">No blog posts found. Add your first article.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {blogs.map((item: any) => (
            <div key={item.id} className="bg-white border border-gray-200/80 rounded-xl overflow-hidden group hover:border-[#108283]/40 hover:shadow-md transition-all flex flex-col justify-between shadow-xs">
              {/* Professional Aspect Ratio Image */}
              <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 relative border-b border-gray-100">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
                {item.category && (
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-[#108283] rounded-full uppercase tracking-wider shadow-xs border border-gray-100">
                    {item.category}
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {item.date && (
                    <span className="text-[11px] text-gray-400 font-source mb-1 block">{item.date}</span>
                  )}
                  <h3 className="text-sm sm:text-[15px] font-playfair font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-[#108283] transition-colors" title={item.title}>
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-500 text-xs font-source line-clamp-2 leading-relaxed mb-3">
                    {item.excerpt}
                  </p>
                </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-auto gap-2">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#108283] hover:bg-[#FAEDDA]/60 rounded-lg transition-colors border border-gray-200/80 cursor-pointer font-source"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id, item.title)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/80 cursor-pointer font-source"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Blog Post" : "Add Blog Post"}
        maxWidth="max-w-md"
      >
        <div className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider font-source">Title <span className="text-rose-500">*</span></label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-source font-semibold text-gray-900"
              placeholder="e.g. 5 Tips for Glowing Skin"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider font-source">Date</label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs font-source"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider font-source">Category</label>
              <input 
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs font-source"
                placeholder="e.g. Skincare, Hair Loss"
              />
            </div>
          </div>

          {/* Blog Image (Slim Compact Upload & Preview) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-source">
              Cover Image (Upload File or Enter URL)
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
                className="flex-1 min-w-0 px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-source text-gray-700 outline-none focus:ring-1 focus:ring-[#108283] focus:border-[#108283] transition-all"
                placeholder="Upload file or enter /blog/... or https://"
              />

              <label 
                className="px-3 py-2 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 flex items-center gap-1.5 font-source shadow-xs"
                title="Upload blog image from computer"
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
            <p className="text-[10px] text-gray-400 font-source mt-1">
              Supports any image size (JPEG, PNG, WEBP) — auto-scaled &amp; properly fitted.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider font-source">Excerpt / Summary</label>
            <textarea 
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              rows={2}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-source resize-none"
              placeholder="Brief summary of the blog post..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-gray-600 font-source text-sm hover:bg-gray-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!formData.title}
              className="px-6 py-2.5 bg-[#108283] hover:bg-[#188D90] disabled:opacity-50 disabled:cursor-not-allowed text-white font-source font-semibold text-sm rounded-xl transition-colors"
            >
              Save Blog Post
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
