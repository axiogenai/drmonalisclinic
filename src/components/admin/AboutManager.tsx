'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { 
  Award, 
  GraduationCap, 
  UserCheck, 
  Stethoscope, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  BookOpen, 
  BarChart3,
  Quote,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AboutSettings, DoctorProfile } from '@/types/admin';
import { useDialog } from '@/context/DialogContext';

export default function AboutManager() {
  const { aboutSettings, updateAboutSettings, resetAboutSettings } = useAdminData();
  const { confirm: dialogConfirm } = useDialog();
  const [formData, setFormData] = useState<AboutSettings>(aboutSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'doctors' | 'stats' | 'philosophy' | 'about_page'>('doctors');

  const tabScrollRef = useRef<HTMLDivElement>(null);
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabScrollRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      tabScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [countdown, setCountdown] = useState<number>(0);

  // Sync if context updates
  React.useEffect(() => {
    setFormData(aboutSettings);
  }, [aboutSettings]);

  useEffect(() => {
    if (countdown <= 0) {
      setIsSaved(false);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAboutSettings(formData);
      setIsSaved(true);
      setCountdown(5);
    } catch (err) {
      console.error('Failed to save about settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const ok = await dialogConfirm({
      title: 'Reset Doctor Credentials & About Content?',
      message: 'Are you sure you want to reset all doctor bios, degrees, and about page content back to the original clinic defaults? This will update the live website within 5 seconds.',
      confirmText: 'Reset to Defaults',
      cancelText: 'Cancel',
      type: 'warning',
    });

    if (!ok) return;

    setIsSaving(true);
    try {
      await resetAboutSettings();
      setIsSaved(true);
      setCountdown(5);
    } catch (err) {
      console.error('Failed to reset about settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to update doctor fields
  const handleDoctorChange = (doctorKey: 'doctor1' | 'doctor2', field: keyof DoctorProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [doctorKey]: {
        ...prev[doctorKey],
        [field]: value
      }
    }));
    setIsSaved(false);
  };

  // Highlights handlers
  const handleAddHighlight = (doctorKey: 'doctor1' | 'doctor2') => {
    setFormData(prev => ({
      ...prev,
      [doctorKey]: {
        ...prev[doctorKey],
        highlights: [...prev[doctorKey].highlights, 'New clinical specialty']
      }
    }));
    setIsSaved(false);
  };

  const handleUpdateHighlight = (doctorKey: 'doctor1' | 'doctor2', idx: number, val: string) => {
    const list = [...formData[doctorKey].highlights];
    list[idx] = val;
    setFormData(prev => ({
      ...prev,
      [doctorKey]: {
        ...prev[doctorKey],
        highlights: list
      }
    }));
    setIsSaved(false);
  };

  const handleDeleteHighlight = (doctorKey: 'doctor1' | 'doctor2', idx: number) => {
    setFormData(prev => ({
      ...prev,
      [doctorKey]: {
        ...prev[doctorKey],
        highlights: prev[doctorKey].highlights.filter((_, i) => i !== idx)
      }
    }));
    setIsSaved(false);
  };

  // Stats handler
  const handleStatChange = (key: keyof AboutSettings['stats'], val: string) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: val
      }
    }));
    setIsSaved(false);
  };

  // Degree list handlers (accordion)
  const handleAddDegree = () => {
    setFormData(prev => ({
      ...prev,
      educationalDegreesList: [...prev.educationalDegreesList, 'Degree / Certification – University / Board']
    }));
    setIsSaved(false);
  };

  const handleUpdateDegree = (idx: number, val: string) => {
    const list = [...formData.educationalDegreesList];
    list[idx] = val;
    setFormData(prev => ({ ...prev, educationalDegreesList: list }));
    setIsSaved(false);
  };

  const handleDeleteDegree = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      educationalDegreesList: prev.educationalDegreesList.filter((_, i) => i !== idx)
    }));
    setIsSaved(false);
  };

  return (
    <div className="space-y-8 font-['Source_Sans_3'] pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#108283] font-semibold text-xs uppercase tracking-wider mb-1">
            <GraduationCap size={16} />
            <span>Physician &amp; Profile CMS</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-900">
            About &amp; Doctors Content Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Edit doctor qualifications, medical degrees, council registration numbers, clinical bios, philosophy, and statistics displayed on the Home Page and separate /about page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#108283] hover:bg-[#0c6b6c] disabled:opacity-60 text-white text-xs font-bold transition-all shadow-md shadow-[#108283]/20 active:scale-95 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to Cloud...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <strong>Saved to Database &amp; Live on drmonalisclinic.com in &lt; 5s! ✓</strong>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {countdown}s
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Doctor credentials, statistics, and about content are synced and live for all visitors across www.drmonalisclinic.com.
              </p>
            </div>
          </div>
          <a
            href="https://www.drmonalisclinic.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shrink-0 shadow-xs"
          >
            <span>Open Live /about Site</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}

      {/* Tabs with Horizontal Scroll and Mobile Navigation Arrows */}
      <div className="flex items-center gap-1.5 border-b border-gray-200 pb-2 w-full">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="flex sm:hidden w-7 h-7 rounded-lg bg-white border border-gray-200/90 shadow-2xs text-gray-700 hover:text-[#108283] hover:border-[#108283] items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer"
          title="Scroll sub-tabs left"
          aria-label="Scroll sub-tabs left"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={tabScrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
        >
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'doctors'
                ? 'bg-[#108283] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <UserCheck size={16} className="shrink-0" />
            <span>Doctors &amp; Degrees</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'stats'
                ? 'bg-[#108283] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={16} className="shrink-0" />
            <span>Clinic Statistics (4 Counters)</span>
          </button>

          <button
            onClick={() => setActiveTab('philosophy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'philosophy'
                ? 'bg-[#108283] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Quote size={16} className="shrink-0" />
            <span>Philosophy &amp; Story Quotes</span>
          </button>

          <button
            onClick={() => setActiveTab('about_page')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'about_page'
                ? 'bg-[#108283] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Layers size={16} className="shrink-0" />
            <span>/about Page Exclusive Content</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => scrollTabs('right')}
          className="flex sm:hidden w-7 h-7 rounded-lg bg-white border border-gray-200/90 shadow-2xs text-gray-700 hover:text-[#108283] hover:border-[#108283] items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer"
          title="Scroll sub-tabs right"
          aria-label="Scroll sub-tabs right"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* TAB 1: DOCTORS & DEGREES */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          {/* Common Section Header */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
            <h2 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
              Section Header &amp; Council Registration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Section Pill Tag
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                  placeholder="ABOUT OUR PHYSICIANS"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Council Registration Chip
                </label>
                <input
                  type="text"
                  value={formData.councilRegistrationText}
                  onChange={(e) => setFormData({ ...formData, councilRegistrationText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-semibold"
                  placeholder="Reg. No. 61847 & 64981"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Main Section Heading
                </label>
                <input
                  type="text"
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-bold"
                  placeholder="Meet Dr. Monali & Dr. Sachin Subhedar"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subheading
                </label>
                <textarea
                  rows={2}
                  value={formData.subheading}
                  onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 leading-relaxed resize-y"
                  placeholder="Decades of combined clinical mastery..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Doctor 1: Dr. Monali */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#108283]" />
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900">
                    Doctor 1: {formData.doctor1.name}
                  </h3>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#108283]/10 text-[#108283] font-bold">
                  Primary Physician
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Doctor Full Name
                </label>
                <input
                  type="text"
                  value={formData.doctor1.name}
                  onChange={(e) => handleDoctorChange('doctor1', 'name', e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Degrees &amp; Qualifications
                  </label>
                  <input
                    type="text"
                    value={formData.doctor1.degrees}
                    onChange={(e) => handleDoctorChange('doctor1', 'degrees', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-[#108283] font-bold"
                    placeholder="BHMS (Mumbai), PGDCC"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.doctor1.regNo}
                    onChange={(e) => handleDoctorChange('doctor1', 'regNo', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-medium"
                    placeholder="Reg. No. 61847"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Clinical Designation / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.doctor1.title}
                  onChange={(e) => handleDoctorChange('doctor1', 'title', e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                  placeholder="Homeopathy & Aesthetic Physician"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Clinical Bio / Description
                </label>
                <textarea
                  rows={4}
                  value={formData.doctor1.bio}
                  onChange={(e) => handleDoctorChange('doctor1', 'bio', e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 leading-relaxed resize-y"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Key Specialties &amp; Highlights (Bullet Points)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddHighlight('doctor1')}
                    className="text-xs text-[#108283] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Item</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.doctor1.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => handleUpdateHighlight('doctor1', idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteHighlight('doctor1', idx)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete highlight"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Doctor 2: Dr. Sachin */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#108283]" />
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900">
                    Doctor 2: {formData.doctor2.name}
                  </h3>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Family Physician
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Doctor Full Name
                </label>
                <input
                  type="text"
                  value={formData.doctor2.name}
                  onChange={(e) => handleDoctorChange('doctor2', 'name', e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Degrees &amp; Qualifications
                  </label>
                  <input
                    type="text"
                    value={formData.doctor2.degrees}
                    onChange={(e) => handleDoctorChange('doctor2', 'degrees', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-[#108283] font-bold"
                    placeholder="BHMS (Mumbai)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.doctor2.regNo}
                    onChange={(e) => handleDoctorChange('doctor2', 'regNo', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-medium"
                    placeholder="Reg. No. 64981"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Clinical Designation / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.doctor2.title}
                  onChange={(e) => handleDoctorChange('doctor2', 'title', e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                  placeholder="Homeopathy & Family Physician"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Clinical Bio / Description
                </label>
                <textarea
                  rows={4}
                  value={formData.doctor2.bio}
                  onChange={(e) => handleDoctorChange('doctor2', 'bio', e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 leading-relaxed resize-y"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Key Specialties &amp; Highlights (Bullet Points)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddHighlight('doctor2')}
                    className="text-xs text-[#108283] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Item</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.doctor2.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => handleUpdateHighlight('doctor2', idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteHighlight('doctor2', idx)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete highlight"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: STATS COUNTERS */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-gray-900">
              Clinic Impact Statistics (4 Big Animated Counters on /about)
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              These 4 metric counters appear prominently in the apricot statistics band on the /about page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                1. Years of Experience
              </label>
              <input
                type="text"
                value={formData.stats.yearsExperience}
                onChange={(e) => handleStatChange('yearsExperience', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-lg font-bold text-[#108283] focus:ring-2 focus:ring-[#108283]/20 outline-none"
                placeholder="6+"
              />
              <p className="text-[11px] text-gray-400">Label: Years of Experience</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                2. Treatments Performed
              </label>
              <input
                type="text"
                value={formData.stats.treatmentsPerformed}
                onChange={(e) => handleStatChange('treatmentsPerformed', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-lg font-bold text-[#108283] focus:ring-2 focus:ring-[#108283]/20 outline-none"
                placeholder="5k+"
              />
              <p className="text-[11px] text-gray-400">Label: Treatments Performed</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                3. Client Satisfaction
              </label>
              <input
                type="text"
                value={formData.stats.clientSatisfaction}
                onChange={(e) => handleStatChange('clientSatisfaction', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-lg font-bold text-[#108283] focus:ring-2 focus:ring-[#108283]/20 outline-none"
                placeholder="98%"
              />
              <p className="text-[11px] text-gray-400">Label: Client Satisfaction</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                4. Safe &amp; FDA Approved
              </label>
              <input
                type="text"
                value={formData.stats.safeFdaApproved}
                onChange={(e) => handleStatChange('safeFdaApproved', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-lg font-bold text-[#108283] focus:ring-2 focus:ring-[#108283]/20 outline-none"
                placeholder="100%"
              />
              <p className="text-[11px] text-gray-400">Label: Safe &amp; FDA Approved</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHILOSOPHY & STORY */}
      {activeTab === 'philosophy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Core Clinical Philosophy */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#108283]/10 text-[#108283] flex items-center justify-center">
                    <Quote className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-gray-900">
                      Core Clinical Philosophy
                    </h3>
                    <p className="text-[11px] text-gray-500 font-source">
                      Featured on the Home Page &amp; /about philosophy tabs
                    </p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#108283]/10 text-[#108283] font-bold shrink-0">
                  Tab 1
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Main Philosophy Quote
                </label>
                <textarea
                  rows={3}
                  value={formData.philosophyQuote}
                  onChange={(e) => setFormData({ ...formData, philosophyQuote: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-medium resize-y leading-relaxed"
                  placeholder="Enter the primary clinical philosophy quote..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Explanatory Paragraph
                </label>
                <textarea
                  rows={4}
                  value={formData.philosophyText}
                  onChange={(e) => setFormData({ ...formData, philosophyText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 leading-relaxed resize-y"
                  placeholder="Provide constitutional case and treatment details..."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Syncs to Home &amp; /about</span>
              <span className="font-mono text-[11px]">Philosophy Tab</span>
            </div>
          </div>

          {/* Card 2: Personal Clinic Story */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-gray-900">
                      Personal Clinic Story
                    </h3>
                    <p className="text-[11px] text-gray-500 font-source">
                      Featured on the Home Page &amp; /about story tabs
                    </p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold shrink-0">
                  Tab 2
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Main Story Quote
                </label>
                <textarea
                  rows={3}
                  value={formData.storyQuote}
                  onChange={(e) => setFormData({ ...formData, storyQuote: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-medium resize-y leading-relaxed"
                  placeholder="Enter the personal clinic journey quote..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Explanatory Paragraph
                </label>
                <textarea
                  rows={4}
                  value={formData.storyText}
                  onChange={(e) => setFormData({ ...formData, storyText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 leading-relaxed resize-y"
                  placeholder="Describe patient care and clinical dedication..."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Syncs to Home &amp; /about</span>
              <span className="font-mono text-[11px]">Story Tab</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: /about PAGE EXCLUSIVE */}
      {activeTab === 'about_page' && (
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-gray-900">
                Dedicated /about Page Content
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Customize hero headings, story paragraphs, and credentials on the separate /about route.
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#108283]/10 text-[#108283] font-bold shrink-0">
              Exclusive /about route
            </span>
          </div>

          {/* Clean 2-column row for headings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Hero Heading
              </label>
              <input
                type="text"
                value={formData.heroHeading}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-bold"
                placeholder="Behind Every Glow is a Story"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Our Story Title
              </label>
              <input
                type="text"
                value={formData.storyTitle}
                onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
                className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-bold"
                placeholder="Welcome to Dr. Monali's Clinic"
              />
            </div>
          </div>

          {/* Full width row for Hero Subheading */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Hero Subheading
            </label>
            <textarea
              rows={2}
              value={formData.heroSubheading}
              onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
              className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 leading-relaxed resize-y"
              placeholder="Indulge in premium skincare solutions designed for beauty, health, and confidence."
            />
          </div>

          {/* Educational Degrees Accordion - clean, full-width single-column list */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Playfair_Display'] text-sm sm:text-base font-bold text-gray-900">
                  Educational Background &amp; Degrees (Accordion on /about)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Credentials displayed in the interactive dropdown accordion.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddDegree}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#108283]/10 hover:bg-[#108283]/20 text-[#108283] text-xs font-bold transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Degree</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.educationalDegreesList.map((deg, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 p-2 px-3 bg-gray-50/80 hover:bg-white focus-within:bg-white border border-gray-200 rounded-xl transition-all shadow-2xs group"
                >
                  <span className="w-5 h-5 rounded-md bg-[#108283]/10 text-[#108283] flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={deg}
                    onChange={(e) => handleUpdateDegree(idx, e.target.value)}
                    className="flex-1 bg-transparent text-xs sm:text-sm text-gray-900 font-medium outline-none"
                    placeholder="Degree / Qualification title"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteDegree(idx)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    title="Delete degree"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action */}
      <div className="flex justify-start pt-4">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#108283] hover:bg-[#0c6b6c] text-white text-sm font-bold transition-all shadow-lg shadow-[#108283]/25 active:scale-95 cursor-pointer"
        >
          <Save size={16} />
          <span>Save All Changes</span>
        </button>
      </div>
    </div>
  );
}
