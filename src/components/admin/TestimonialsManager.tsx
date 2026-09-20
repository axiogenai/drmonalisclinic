'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminData } from '@/context/AdminContext';
import AdminModal from '@/components/admin/AdminModal';

export default function TestimonialsManager() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdminData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    review: '',
    concern: ''
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setFormData({
        name: item.name || '',
        review: item.review || '',
        concern: item.concern || ''
      });
      setEditingId(item.id);
    } else {
      setFormData({
        name: '',
        review: '',
        concern: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.review) return;
    
    if (editingId) {
      updateTestimonial(editingId, formData);
    } else {
      addTestimonial({ ...formData, id: 'testi-' + Date.now() });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-playfair font-bold text-[#108283]">Patient Stories</h2>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#108283] text-white rounded-xl hover:bg-[#188D90] transition-colors shrink-0 font-source text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-source">No testimonials found. Add your first patient story.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item: any) => (
            <div key={item.id} className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-playfair font-bold text-gray-900">{item.name}</h3>
                  {item.concern && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#FAEDDA] text-[#108283] text-[10px] font-semibold rounded-full uppercase tracking-wider">
                      {item.concern}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 mb-6 relative">
                <span className="text-4xl text-[#FAEDDA] font-serif absolute -top-2 -left-2 opacity-50">"</span>
                <p className="text-gray-600 text-sm font-source italic relative z-10 pl-4 line-clamp-4">
                  {item.review}
                </p>
              </div>

              {deletingId === item.id ? (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl mt-auto">
                  <p className="text-xs text-red-800 font-semibold flex-1">Delete story?</p>
                  <button 
                    onClick={() => setDeletingId(null)}
                    className="px-2 py-1 text-xs text-gray-600 hover:bg-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      deleteTestimonial(item.id);
                      setDeletingId(null);
                    }}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 mt-auto">
                  <button 
                    onClick={() => handleOpenModal(item)}
                    className="p-2 text-gray-400 hover:text-[#108283] hover:bg-[#FAEDDA] rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeletingId(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Testimonial" : "Add Patient Story"}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient Name</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-sm font-source"
              placeholder="e.g. Sarah M."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Concern / Treatment (Optional)</label>
            <input 
              type="text"
              value={formData.concern}
              onChange={(e) => setFormData({...formData, concern: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-sm font-source"
              placeholder="e.g. Acne Scar Treatment"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Review</label>
            <textarea 
              value={formData.review}
              onChange={(e) => setFormData({...formData, review: e.target.value})}
              rows={5}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-sm font-source resize-none"
              placeholder="The patient's experience..."
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
              disabled={!formData.name || !formData.review}
              className="px-6 py-2.5 bg-[#108283] hover:bg-[#188D90] disabled:opacity-50 disabled:cursor-not-allowed text-white font-source font-semibold text-sm rounded-xl transition-colors"
            >
              Save Testimonial
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
