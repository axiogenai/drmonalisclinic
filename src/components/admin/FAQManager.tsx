'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search, HelpCircle } from 'lucide-react';
import { useAdminData, FAQ } from '@/context/AdminContext';
import { useDialog } from '@/context/DialogContext';
import AdminModal from '@/components/admin/AdminModal';

export default function FAQManager() {
  const { faqs, addFaq, updateFaq, deleteFaq, reorderFaqs } = useAdminData();
  const { confirm, toast } = useDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const filteredFaqs = faqs.filter((f) => {
    const q = searchTerm.toLowerCase();
    return (
      (f.question || '').toLowerCase().includes(q) ||
      (f.answer || '').toLowerCase().includes(q)
    );
  });

  const handleOpenModal = (item?: FAQ) => {
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
    const trimmedQuestion = formData.question.trim();
    const trimmedAnswer = formData.answer.trim();

    if (!trimmedQuestion) {
      toast({
        title: 'Question Required',
        message: 'Please enter the question text.',
        type: 'error'
      });
      return;
    }

    if (!trimmedAnswer) {
      toast({
        title: 'Answer Required',
        message: 'Please provide the answer text.',
        type: 'error'
      });
      return;
    }

    if (editingId) {
      updateFaq(editingId, { question: trimmedQuestion, answer: trimmedAnswer });
      toast({
        title: 'FAQ Updated',
        message: `FAQ updated successfully.`,
        type: 'success'
      });
    } else {
      addFaq({
        id: 'faq-' + Date.now(),
        question: trimmedQuestion,
        answer: trimmedAnswer
      });
      toast({
        title: 'FAQ Added',
        message: `New question added to FAQ list.`,
        type: 'success'
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, question: string) => {
    const ok = await confirm({
      title: 'Delete FAQ',
      message: `Are you sure you want to remove this FAQ: "${question}"?`,
      confirmText: 'Delete FAQ',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (ok) {
      deleteFaq(id);
      toast({
        title: 'FAQ Removed',
        message: 'The FAQ has been deleted.',
        type: 'success'
      });
    }
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    const newFaqs = [...faqs];
    if (direction === 'up' && index > 0) {
      [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
      reorderFaqs(newFaqs);
      toast({
        title: 'Order Updated',
        message: 'FAQ order shifted upwards.',
        type: 'success'
      });
    } else if (direction === 'down' && index < newFaqs.length - 1) {
      [newFaqs[index + 1], newFaqs[index]] = [newFaqs[index], newFaqs[index + 1]];
      reorderFaqs(newFaqs);
      toast({
        title: 'Order Updated',
        message: 'FAQ order shifted downwards.',
        type: 'success'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-[#108283]">FAQs Management</h2>
          <p className="text-xs text-gray-500 font-source mt-0.5">
            Configure clinic FAQs and patient query answers ({faqs.length} total)
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
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
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-source text-sm">
            {searchTerm ? 'No FAQs match your search.' : 'No FAQs found. Add your first frequently asked question.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden">
          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider font-source">
            <div className="col-span-2 text-center">Order</div>
            <div className="col-span-8">Question &amp; Answer</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* List items with clean dividing borders */}
          <div className="divide-y divide-gray-100">
            {filteredFaqs.map((item: FAQ, index: number) => (
              <div
                key={item.id}
                className="px-4 sm:px-6 py-3.5 hover:bg-slate-50/80 transition-colors flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 sm:items-center group"
              >
                {/* Order & Reorder Arrows */}
                <div className="sm:col-span-2 flex items-center justify-between sm:justify-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 bg-gray-100/90 rounded-lg p-0.5 border border-gray-200/70">
                    <button
                      type="button"
                      onClick={() => moveFaq(index, 'up')}
                      disabled={index === 0}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#108283] hover:bg-white rounded transition-colors disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-bold text-gray-700 px-1.5 font-mono">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveFaq(index, 'down')}
                      disabled={index === faqs.length - 1}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#108283] hover:bg-white rounded transition-colors disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question & Answer Content */}
                <div className="sm:col-span-8 min-w-0 pr-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#108283]/10 text-[#108283] flex items-center justify-center font-bold text-[10px] shrink-0">
                      Q
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 font-source truncate group-hover:text-[#108283] transition-colors">
                      {item.question}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 font-source line-clamp-2 pl-6 leading-relaxed">
                    {item.answer}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="sm:col-span-2 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/90 rounded-lg shadow-2xs hover:border-[#108283] hover:text-[#108283] transition-all cursor-pointer"
                  >
                    <Pencil className="w-3 h-3 text-[#108283]" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.question)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer Stats */}
          <div className="bg-gray-50/70 px-6 py-2.5 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500 font-source">
            <span>Showing {filteredFaqs.length} of {faqs.length} FAQs</span>
            <span className="hidden sm:inline">Use arrows to adjust display order</span>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit FAQ' : 'Add FAQ'}
        maxWidth="max-w-lg"
      >
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-source">
              Question <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-source font-semibold text-gray-900 transition-all"
              placeholder="e.g. How does constitutional homeopathy work for chronic skin conditions?"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1 font-source">
              Answer <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none text-xs sm:text-sm font-source resize-none leading-relaxed transition-all"
              placeholder="Provide a clear, patient-friendly medical explanation..."
            />
          </div>

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
              {editingId ? 'Update FAQ' : 'Save FAQ'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
