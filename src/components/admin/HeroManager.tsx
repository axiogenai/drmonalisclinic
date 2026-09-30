'use client';

import React, { useState, useEffect } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  CalendarCheck, 
  ArrowRight, 
  MapPin, 
  Clock, 
  FileText, 
  Type, 
  Link as LinkIcon,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { HeroSettings } from '@/types/admin';
import { defaultHeroSettings } from '@/data/defaultHeroSettings';
import { useDialog } from '@/context/DialogContext';

export default function HeroManager() {
  const { heroSettings, updateHeroSettings, resetHeroSettings } = useAdminData();
  const { confirm: dialogConfirm } = useDialog();
  const [formData, setFormData] = useState<HeroSettings>(heroSettings || defaultHeroSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Synchronize whenever context updates
  useEffect(() => {
    if (heroSettings) {
      setFormData(heroSettings);
    }
  }, [heroSettings]);

  // Countdown timer for saved notification
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

  const handleChange = (field: keyof HeroSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateHeroSettings(formData);
      setIsSaved(true);
      setCountdown(5);
    } catch (err) {
      console.error('Failed to save hero settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const ok = await dialogConfirm({
      title: 'Reset Hero Section to Defaults?',
      message: 'Are you sure you want to reset all headlines, taglines, clinical description, and button labels back to the original clinic defaults? This will update the homepage immediately.',
      confirmText: 'Reset to Defaults',
      cancelText: 'Cancel',
      type: 'warning',
    });

    if (!ok) return;

    setIsSaving(true);
    try {
      await resetHeroSettings();
      setFormData(defaultHeroSettings);
      setIsSaved(true);
      setCountdown(5);
    } catch (err) {
      console.error('Failed to reset hero settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Preview highlight renderer
  const renderPreviewHeading = (heading: string, highlight?: string) => {
    if (!heading) return null;
    if (!highlight || !highlight.trim()) return heading;

    const terms = highlight
      .split(/[,|]/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (terms.length === 0) return heading;

    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = heading.split(regex);

    return (
      <>
        {parts.map((part, index) => {
          const isMatch = terms.some((t) => t.toLowerCase() === part.toLowerCase());
          if (isMatch) {
            return (
              <span
                key={index}
                className="font-semibold italic text-[#108283]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {part}
              </span>
            );
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </>
    );
  };

  return (
    <div className="space-y-8 font-['Source_Sans_3'] pb-20">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#108283] font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles size={16} />
            <span>Homepage Editor</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-900">
            Hero Section Editor
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Edit the main headline, signature teal italic accents, tagline, clinical intro, action buttons, and operating badge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RotateCcw size={15} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl transition-all text-sm font-semibold cursor-pointer shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-300" />
                <span>Saved ({countdown}s)</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>
              <strong>Hero texts updated successfully!</strong> Changes are live on the website and synced across all devices.
            </span>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
            Active in {countdown}s
          </span>
        </div>
      )}

      {/* Live Visual Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700 text-xs font-semibold uppercase tracking-wider">
            <Eye size={15} className="text-[#108283]" />
            <span>Live Interactive Preview</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#108283] hover:underline font-medium"
          >
            <span>View Homepage Live</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div
          className="p-6 md:p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FAF0DD 0%, #FBF0E8 45%, #F5EBD8 100%)' }}
        >
          <div className="max-w-2xl text-left space-y-3">
            {/* Title */}
            <h2
              className="text-[26px] sm:text-[34px] md:text-[38px] font-normal leading-[1.15] text-gray-950 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {renderPreviewHeading(formData.heading, formData.headingHighlight)}
            </h2>

            {/* Subtitle / Tagline */}
            <p
              className="text-base sm:text-lg italic text-gray-700 font-light leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {formData.tagline}
            </p>

            {/* Description */}
            <p className="text-gray-600 text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-line">
              {formData.description}
            </p>

            {/* Buttons preview */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 bg-[#108283] text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-sm">
                <CalendarCheck className="w-3.5 h-3.5 text-white" />
                <span>{formData.primaryBtnText || 'Book Appointment'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>

              <div className="inline-flex items-center gap-1.5 bg-white/90 text-gray-900 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium shadow-2xs">
                <span>{formData.secondaryBtnText || 'Our Services'}</span>
                <ArrowRight className="w-3 h-3 text-[#108283]" />
              </div>
            </div>

            {/* Badges preview */}
            <div className="inline-flex flex-wrap items-center gap-2.5 bg-white/80 backdrop-blur-md border border-white/90 rounded-full px-3.5 py-1.5 shadow-2xs text-xs text-gray-700 mt-2">
              {formData.badgeOpenHours && (
                <div className="flex items-center gap-1.5 font-medium text-gray-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>{formData.badgeOpenHours}</span>
                </div>
              )}
              {formData.badgeOpenHours && formData.badgeLocation && (
                <span className="text-gray-300">•</span>
              )}
              {formData.badgeLocation && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-3 h-3 text-[#F0A070] shrink-0" />
                  <span>{formData.badgeLocation}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {/* Card 1: Main Heading & Accent Highlight */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 text-gray-900 font-semibold border-b border-gray-100 pb-3">
            <Type size={18} className="text-[#108283]" />
            <span className="text-base">Main Headline &amp; Accent Styling</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Main Heading Title
              </label>
              <input
                type="text"
                value={formData.heading}
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="e.g. Advanced Homeopathy, Skin & Hair Care"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                The primary headline displayed in bold Playfair Display on desktop and mobile.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Words to Highlight in Teal Accent (Italic)
              </label>
              <input
                type="text"
                value={formData.headingHighlight}
                onChange={(e) => handleChange('headingHighlight', e.target.value)}
                placeholder="e.g. Homeopathy, Skin & Hair Care"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] transition-all"
              />
              <div className="flex items-start gap-1.5 mt-1.5 text-xs text-gray-500">
                <HelpCircle size={14} className="text-[#108283] shrink-0 mt-0.5" />
                <span>
                  Tip: Any words typed here that match the main heading will automatically be styled with the signature <em>teal italic script</em> (e.g. &quot;Homeopathy, Skin &amp; Hair Care&quot;).
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Italic Sub-headline / Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Constitutional Healing & Modern Clinical Cosmetology in Kolhapur."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Displayed in elegant italic Playfair script directly beneath the main title.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Clinical Description */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-gray-900 font-semibold border-b border-gray-100 pb-3">
            <FileText size={18} className="text-[#108283]" />
            <span className="text-base">Clinical Introduction &amp; Doctor Bio</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Description Paragraph
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter clinic description..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] transition-all leading-relaxed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports line breaks. Highlights doctor qualifications, clinical experience, and treatments.
            </p>
          </div>
        </div>

        {/* Card 3: Action Buttons (CTAs) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-gray-900 font-semibold border-b border-gray-100 pb-3">
            <LinkIcon size={18} className="text-[#108283]" />
            <span className="text-base">Call-to-Action (CTA) Buttons</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Primary Button */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <span className="text-xs font-bold text-[#108283] uppercase tracking-wider block">
                Primary Button (Teal Pill)
              </span>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Button Label</label>
                <input
                  type="text"
                  value={formData.primaryBtnText}
                  onChange={(e) => handleChange('primaryBtnText', e.target.value)}
                  placeholder="e.g. Book Appointment"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#108283]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Destination URL / Anchor</label>
                <input
                  type="text"
                  value={formData.primaryBtnLink}
                  onChange={(e) => handleChange('primaryBtnLink', e.target.value)}
                  placeholder="e.g. #booking or /appointment"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#108283]"
                />
              </div>
            </div>

            {/* Secondary Button */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Secondary Button (White Pill)
              </span>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Button Label</label>
                <input
                  type="text"
                  value={formData.secondaryBtnText}
                  onChange={(e) => handleChange('secondaryBtnText', e.target.value)}
                  placeholder="e.g. Our Services"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#108283]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Destination URL / Anchor</label>
                <input
                  type="text"
                  value={formData.secondaryBtnLink}
                  onChange={(e) => handleChange('secondaryBtnLink', e.target.value)}
                  placeholder="e.g. #services or /homeopathy"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#108283]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Operating Status & Location Strip */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-gray-900 font-semibold border-b border-gray-100 pb-3">
            <Clock size={18} className="text-[#108283]" />
            <span className="text-base">Clinic Status &amp; Location Strip</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Operating Hours Badge
              </label>
              <input
                type="text"
                value={formData.badgeOpenHours}
                onChange={(e) => handleChange('badgeOpenHours', e.target.value)}
                placeholder="e.g. Open Mon–Sat: 10 AM–2 PM & 5–9 PM"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Shows a live green pulsing indicator alongside the hours.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Location Badge
              </label>
              <input
                type="text"
                value={formData.badgeLocation}
                onChange={(e) => handleChange('badgeLocation', e.target.value)}
                placeholder="e.g. Near Ring Road, Kolhapur"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Shows with an apricot location pin on desktop.</p>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer shadow-xs disabled:opacity-50"
          >
            Reset Defaults
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl transition-all text-sm font-semibold cursor-pointer shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-300" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Hero Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
