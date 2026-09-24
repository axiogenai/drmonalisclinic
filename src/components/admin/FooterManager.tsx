'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  MessageCircle,
  Share2,
  Copy,
  Info
} from 'lucide-react';
import { FooterSettings } from '@/types/admin';

export default function FooterManager() {
  const { footerSettings, updateFooterSettings, resetFooterSettings } = useAdminData();
  const [formData, setFormData] = useState<FooterSettings>(footerSettings);
  const [isSaved, setIsSaved] = useState(false);

  // Sync if context updates
  React.useEffect(() => {
    setFormData(footerSettings);
  }, [footerSettings]);

  const handleChange = (field: keyof FooterSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooterSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all footer and clinic contact settings to original clinic defaults?')) {
      resetFooterSettings();
      setIsSaved(false);
    }
  };

  return (
    <div className="space-y-8 font-['Source_Sans_3'] pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#108283] font-semibold text-xs uppercase tracking-wider mb-1">
            <Building2 size={16} />
            <span>Website Component Editor</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-900">
            Footer &amp; Clinic Info Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Customize the clinic contact details, working hours, address, Google Maps link, and social profiles displayed across the website footer.
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#108283] hover:bg-[#0c6b6c] text-white text-xs font-bold transition-all shadow-md shadow-[#108283]/20 active:scale-95 cursor-pointer"
          >
            <Save size={15} />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong>Changes Saved!</strong> The footer component across the whole website now reflects your new contact details and hours.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Section 1: Clinic Info & Hours */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Clock className="w-5 h-5 text-[#108283]" />
                <h2 className="font-['Playfair_Display'] text-lg font-bold text-gray-900">
                  Clinic Info &amp; Operating Hours
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Physical Clinic Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                    placeholder="Golden Spring Apartment, Near Ring Road, Kolhapur"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Google Maps URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.mapsUrl}
                    onChange={(e) => handleChange('mapsUrl', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-medium"
                      placeholder="+91 92094 72224"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                      placeholder="info@drmonalisclinic.com"
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours Fields */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Working Days
                    </label>
                    <input
                      type="text"
                      value={formData.workingDays}
                      onChange={(e) => handleChange('workingDays', e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                      placeholder="Monday – Saturday"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Sunday / Holiday Status
                    </label>
                    <input
                      type="text"
                      value={formData.sundayHours}
                      onChange={(e) => handleChange('sundayHours', e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-amber-700 font-semibold"
                      placeholder="Sunday: Closed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Morning Shift Hours
                    </label>
                    <input
                      type="text"
                      value={formData.morningHours}
                      onChange={(e) => handleChange('morningHours', e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                      placeholder="Morning: 10:00 AM – 2:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Evening Shift Hours
                    </label>
                    <input
                      type="text"
                      value={formData.eveningHours}
                      onChange={(e) => handleChange('eveningHours', e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                      placeholder="Evening: 5:00 PM – 9:00 PM"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Brand Tagline & Description */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Info className="w-5 h-5 text-[#108283]" />
                <h2 className="font-['Playfair_Display'] text-lg font-bold text-gray-900">
                  Footer Brand &amp; Tagline
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Brand Name (Line 1)
                  </label>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => handleChange('clinicName', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 font-bold"
                    placeholder="Dr. Monali's"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Subtitle / Specialty (Line 2)
                  </label>
                  <input
                    type="text"
                    value={formData.subTitle}
                    onChange={(e) => handleChange('subTitle', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-[#108283] font-semibold"
                    placeholder="Homeopathy Clinic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Footer Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900 leading-relaxed"
                  placeholder="Short brand overview displayed on the left column of the footer."
                />
              </div>
            </div>

            {/* Section 3: Social Media & Credits */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Share2 className="w-5 h-5 text-[#108283]" />
                <h2 className="font-['Playfair_Display'] text-lg font-bold text-gray-900">
                  Social Channels &amp; Credits
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                    placeholder="919209472224"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) => handleChange('instagramUrl', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={formData.facebookUrl}
                    onChange={(e) => handleChange('facebookUrl', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Made by Credit Text
                  </label>
                  <input
                    type="text"
                    value={formData.creditText}
                    onChange={(e) => handleChange('creditText', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                    placeholder="team.axiogen.in"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Made by Credit Link
                  </label>
                  <input
                    type="url"
                    value={formData.creditUrl}
                    onChange={(e) => handleChange('creditUrl', e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] outline-none transition-all text-gray-900"
                    placeholder="https://team.axiogen.in"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#108283] hover:bg-[#0c6b6c] text-white text-sm font-bold transition-all shadow-lg shadow-[#108283]/25 active:scale-95 cursor-pointer"
              >
                <Save size={16} />
                <span>Save All Footer Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview Column (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Live Preview (Exact Website Look)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              Live Sync
            </span>
          </div>

          {/* Exact Render of the Footer Card from user's image */}
          <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-800">
            <h4 className="font-['Playfair_Display'] text-xl font-medium text-white mb-5">
              Clinic Info &amp; Hours
            </h4>

            <div className="space-y-4 font-['Source_Sans_3'] text-sm text-gray-400">
              {/* Google Maps Link */}
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-[#108283] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {formData.address}
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#108283] font-medium ml-1.5 opacity-90 underline">
                    Maps ↗
                  </span>
                </span>
              </div>

              {/* Direct Phone Call & Copy */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#108283] shrink-0" />
                  <span className="font-medium text-white tracking-wide">
                    {formData.phone}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  <span className="text-[11px]">Copy</span>
                </span>
              </div>

              {/* Direct Email & Copy */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#108283] shrink-0" />
                  <span className="text-gray-300">
                    {formData.email}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  <span className="text-[11px]">Copy</span>
                </span>
              </div>

              {/* Timings & Live Status */}
              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <Clock className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-white font-medium">{formData.workingDays}</p>
                  <p className="text-gray-300 text-xs">{formData.morningHours}</p>
                  <p className="text-gray-300 text-xs">{formData.eveningHours}</p>
                  <p className="text-amber-400 text-xs font-semibold">{formData.sundayHours}</p>
                </div>
              </div>
            </div>

            {/* Brand column preview */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-['Playfair_Display'] font-bold text-white text-base">
                  {formData.clinicName}
                </span>
                <span className="text-xs font-medium uppercase text-[#108283]">
                  {formData.subTitle}
                </span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                {formData.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
