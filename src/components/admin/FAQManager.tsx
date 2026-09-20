'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useAdminData } from '@/context/AdminContext';
import AdminModal from '@/components/admin/AdminModal';

export default function FAQManager() {
  const { faqs, addFaq, updateFaq, deleteFaq, reorderFaqs } = useAdminData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setFormData({
        question: item.question || '',
        answer: item.answer || ''
      });
      setEditingId(item.id);
    } else {
      setFormData({
        question: '',
        answer: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.question || !formData.answer) return;
    
    if (editingId) {
      updateFaq(editingId, formData);
    } else {
      addFaq({ ...formData, id: 'faq-' + Date.now() });
    }
    setIsModalOpen(false);
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    const newFaqs = [...faqs];
    if (direction === 'up' && index > 0) {
      [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
      reorderFaqs(newFaqs);
    } else if (direction === 'down' && index < newFaqs.length - 1) {
      [newFaqs[index + 1], newFaqs[index]] = [newFaqs[index], newFaqs[index + 1]];
      reorderFaqs(newFaqs);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-playfair font-bold text-[#108283]">FAQs Management</h2>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#108283] text-white rounded-xl hover:bg-[#188D90] transition-colors shrink-0 font-source text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-source">No FAQs found. Add your first frequently asked question.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((item: any, index: number) => (
            <div key={item.id} className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 group hover:border-[#108283]/30 transition-colors">
              
              <div className="flex flex-row sm:flex-col gap-1 text-gray-300">
                <button 
                  onClick={() => moveFaq(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:text-[#108283] hover:bg-[#FAEDDA] rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => moveFaq(index, 'down')}
                  disabled={index === faqs.length - 1}
                  className="p-1 hover:text-[#108283] hover:bg-[#FAEDDA] rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 font-source mb-2">{item.question}</h3>
                <p className="text-sm text-gray-600 font-source line-clamp-3">{item.answer}</p>
                
                {deletingId === item.id && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl mt-4 max-w-sm">
                    <p className="text-xs text-red-800 font-semibold flex-1">Delete this FAQ?</p>
                    <button 
                      onClick={() => setDeletingId(null)}
                      className="px-2 py-1 text-xs text-gray-600 hover:bg-white rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        deleteFaq(item.id);
                        setDeletingId(null);
                      }}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>

              {!deletingId || deletingId !== item.id ? (
                <div className="flex sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-gray-50 pt-4 sm:pt-0 sm:pl-4 justify-end">
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
              ) : null}
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit FAQ" : "Add FAQ"}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Question</label>
            <input 
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-sm font-source font-semibold text-gray-900"
              placeholder="e.g. Is laser hair removal painful?"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Answer</label>
            <textarea 
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              rows={6}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-sm font-source resize-none"
              placeholder="Detailed answer..."
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
              disabled={!formData.question || !formData.answer}
              className="px-6 py-2.5 bg-[#108283] hover:bg-[#188D90] disabled:opacity-50 disabled:cursor-not-allowed text-white font-source font-semibold text-sm rounded-xl transition-colors"
            >
              Save FAQ
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
