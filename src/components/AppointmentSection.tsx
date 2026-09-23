'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Phone, CheckCircle2, Calendar, Clock, Send, ShieldCheck, Check, MapPin, ExternalLink, AlertCircle, ChevronDown } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import CustomDatePicker from '@/components/CustomDatePicker';

const TREATMENT_OPTIONS = [
  { label: 'Skin Disorders & Eczema', sub: 'Psoriasis, Vitiligo, Acne' },
  { label: 'Hair & Scalp Problems', sub: 'Hair Fall, PRP, Dandruff' },
  { label: 'Kidney Stone & Piles', sub: 'Non-surgical Homeopathy' },
  { label: "Women's Health & PCOD", sub: 'Hormonal Balance, Cysts' },
  { label: 'Height Growth Therapy', sub: 'Natural Pediatric Growth' },
  { label: 'Weight Management', sub: 'Healthy Loss & Gain' },
  { label: 'Cosmetic & Medi Facials', sub: 'Skin Glow & Chemical Peels' },
  { label: 'General Consultation', sub: 'Family Medicine & Wellness' },
];

function TreatmentDropdown({
  options,
  value,
  onChange,
}: {
  options: typeof TREATMENT_OPTIONS;
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.label === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 text-left cursor-pointer select-none bg-white ${
          isOpen
            ? 'border-[#108283] ring-2 ring-[#108283]/20 shadow-sm'
            : 'border-gray-200 hover:border-[#108283]/60 focus:border-[#108283]'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="min-w-0 pr-2">
          <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
            {selectedOption.label}
          </p>
          <p className="text-xs text-gray-500 leading-tight truncate mt-0.5">
            {selectedOption.sub}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#108283]' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 w-full bg-white rounded-2xl border border-gray-200 shadow-[0_20px_45px_rgba(0,0,0,0.14)] p-1.5 max-h-[260px] overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
          role="listbox"
        >
          {options.map((item) => {
            const isSelected = item.label === value;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onChange(item.label);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#108283]/10 text-[#108283]'
                    : 'hover:bg-gray-50 text-gray-800'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="min-w-0">
                  <p className={`text-xs leading-snug truncate ${isSelected ? 'text-[#108283] font-bold' : 'text-gray-900 font-medium'}`}>
                    {item.label}
                  </p>
                  <p className={`text-[11px] leading-snug truncate ${isSelected ? 'text-[#0c6b6c]' : 'text-gray-500'}`}>
                    {item.sub}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#108283] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AppointmentSection() {
  const { addAppointment } = useAdminData();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    concern: 'Skin Disorders & Eczema',
    date: '',
  });

  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean }>({});

  const validateName = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) return 'Please enter your full name';
    if (trimmed.length < 3) return 'Name must be at least 3 characters';
    if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Name should contain letters only';
    return '';
  };

  const validatePhone = (phone: string): string => {
    const trimmed = phone.trim();
    if (!trimmed) return 'Please enter your phone number';
    const clean = trimmed.replace(/[\s\-()]/g, '');
    const isValid = /^(\+91|91|0)?[6-9]\d{9}$/.test(clean);
    if (!isValid) return 'Enter a valid 10-digit mobile number (e.g. 9876543210)';
    return '';
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({ ...prev, name: val }));
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateName(val) }));
    }
  };

  const handlePhoneChange = (val: string) => {
    setFormData((prev) => ({ ...prev, phone: val }));
    if (touched.phone) {
      setErrors((prev) => ({ ...prev, phone: validatePhone(val) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(formData.name);
    const phoneErr = validatePhone(formData.phone);

    setTouched({ name: true, phone: true });
    setErrors({ name: nameErr, phone: phoneErr });

    if (nameErr || phoneErr) {
      return;
    }

    if (addAppointment) {
      addAppointment({
        id: Date.now().toString(),
        fullName: formData.name.trim(),
        phone: formData.phone.trim(),
        date: formData.date || new Date().toISOString().split('T')[0],
        condition: formData.concern,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
    }

    setSubmitted(true);
  };

  return (
    <section id="booking" className="py-20 md:py-28 bg-white relative scroll-mt-20 md:scroll-mt-24">
      <div id="appointment" className="absolute -top-24 pointer-events-none" />
      <div className="max-w-[1140px] mx-auto px-5 md:px-8">
        {/* Centered Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-12">
          <div className="inline-block bg-[#FAEDDA] text-[#108283] text-xs md:text-sm font-['Source_Sans_3'] font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            APPOINTMENT
          </div>

          <h2 className="font-['Playfair_Display'] text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-gray-950 font-normal leading-tight mb-4 tracking-tight">
            Book Your <span className="text-[#108283] font-bold italic">Consultation</span> Today!
          </h2>

          <p className="font-['Source_Sans_3'] text-gray-700 text-base md:text-lg leading-relaxed font-light">
            Dr. Monali&apos;s Clinic (Homeopathy, Skin &amp; Hair), Near Ring Road, Kolhapur. Mon–Sat: 10 AM–2 PM &amp; 5–9 PM. Call us at{' '}
            <a href="tel:+919209472224" className="font-semibold text-[#108283] hover:underline">+91 92094 72224</a>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Booking System (Slim Form) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="h-full rounded-2xl md:rounded-[24px] border border-gray-100 shadow-[0_12px_35px_rgba(0,0,0,0.05)] bg-white p-5 sm:p-6 md:p-7 flex flex-col justify-between relative">
              {submitted ? (
                <div className="text-center py-8 space-y-3 animate-in fade-in duration-300 my-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-gray-950">
                    Consultation Request Received
                  </h3>
                  <p className="font-['Source_Sans_3'] text-gray-600 text-sm md:text-base max-w-md mx-auto">
                    Thank you, <strong className="text-gray-900">{formData.name}</strong>. Dr. Monali&apos;s Homeopathy Clinic team will call you at <strong className="text-gray-900">{formData.phone}</strong> to confirm your appointment.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#108283] font-semibold underline underline-offset-4 cursor-pointer pt-2"
                  >
                    Book another appointment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 font-['Source_Sans_3'] flex flex-col justify-between h-full">
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Your Full Name <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          onBlur={() => {
                            setTouched((prev) => ({ ...prev, name: true }));
                            setErrors((prev) => ({ ...prev, name: validateName(formData.name) }));
                          }}
                          placeholder="e.g. Priya Sharma"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                            touched.name && errors.name
                              ? 'border-red-400 bg-red-50/20 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                              : 'border-gray-200 focus:border-[#108283] focus:ring-1 focus:ring-[#108283]/30'
                          }`}
                        />
                        {touched.name && errors.name && (
                          <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          onBlur={() => {
                            setTouched((prev) => ({ ...prev, phone: true }));
                            setErrors((prev) => ({ ...prev, phone: validatePhone(formData.phone) }));
                          }}
                          placeholder="+91 98765 43210"
                          maxLength={15}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                            touched.phone && errors.phone
                              ? 'border-red-400 bg-red-50/20 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                              : 'border-gray-200 focus:border-[#108283] focus:ring-1 focus:ring-[#108283]/30'
                          }`}
                        />
                        {touched.phone && errors.phone && (
                          <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Preferred Consultation Date <span className="text-red-500">*</span>
                      </label>
                      <CustomDatePicker
                        value={formData.date}
                        onChange={(val) => setFormData({ ...formData, date: val })}
                        required
                      />
                    </div>

                    {/* Treatment Focus Dropdown */}
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Select Treatment Focus
                      </label>
                      <TreatmentDropdown
                        options={TREATMENT_OPTIONS}
                        value={formData.concern}
                        onChange={(val) => setFormData({ ...formData, concern: val })}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[#108283] hover:bg-[#0c6b6c] text-white py-3.5 rounded-full font-semibold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirm Consultation Request</span>
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Zero cancellation charges • Direct clinical triage</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Benefits, Contact Card & Map (Matched Equal Height) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 h-full">
            <div>
              <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl text-gray-950 font-normal mb-2.5">
                We’re listening and ready to help.
              </h3>

              <ul className="space-y-2">
                {[
                  'Personalized care for your specific symptoms.',
                  '100% natural, side-effect-free remedies.',
                  'Dedicated physician support throughout your recovery.',
                  'Transparent clinical assessments with zero sales pitch.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0" />
                    <span className="font-['Source_Sans_3'] text-gray-700 text-xs sm:text-sm leading-tight">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Teal Contact Card with Glassmorphic Highlight (Slim Design) */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#108283] to-[#0c6b6c] text-white p-4 sm:p-4.5 shadow-[0_10px_30px_rgba(16,130,131,0.2)] shrink-0">
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-['Playfair_Display'] text-base sm:text-lg font-medium leading-snug">
                    Contact Us
                  </h4>
                  <a
                    href="https://maps.app.goo.gl/AvzdvdMZNeZujABH6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Source_Sans_3'] text-white/85 hover:text-white text-xs leading-tight flex items-center gap-1 group/addr truncate"
                  >
                    <span className="truncate">Golden Spring Apt, Near Ring Road, Kolhapur</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover/addr:opacity-100" />
                  </a>
                  <div className="mt-1 flex flex-col xs:flex-row xs:items-center gap-x-3 gap-y-0.5">
                    <a 
                      href="tel:+919209472224" 
                      className="font-['Source_Sans_3'] text-sm sm:text-base font-bold text-white hover:underline whitespace-nowrap block"
                    >
                      +91 92094 72224
                    </a>
                    <span className="font-['Source_Sans_3'] text-white/75 text-[11px] whitespace-nowrap">
                      Mon–Sat: 10 AM–2 PM &amp; 5–9 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map Card (Flex to match height) */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.06)] bg-white flex-1 min-h-[175px] flex flex-col">
              <div className="px-3.5 py-2.5 bg-[#108283]/10 border-b border-[#108283]/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0c6b6c]">
                  <MapPin className="w-4 h-4 text-red-500 fill-red-500/20 shrink-0" />
                  <span>Clinic Location &amp; Directions</span>
                </div>
                <a
                  href="https://maps.app.goo.gl/AvzdvdMZNeZujABH6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#108283] hover:underline flex items-center gap-1"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="w-full flex-1 min-h-[135px] relative bg-gray-100">
                <iframe
                  title="Dr. Monali's Homeopathy Clinic Satellite Map"
                  src="https://maps.google.com/maps?q=Dr+Monali's+Homeopathy+Clinic+Ring+Road+Kolhapur&t=k&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
