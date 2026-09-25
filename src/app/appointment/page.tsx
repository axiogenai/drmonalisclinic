'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight,
  MessageCircle,
  Stethoscope,
  ChevronDown,
  Check
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactWidget from '@/components/ContactWidget';
import CustomDatePicker from '@/components/CustomDatePicker';
import { useAdminData } from '@/context/AdminDataContext';

const TREATMENT_OPTIONS = [
  { label: 'Skin Disorders & Eczema', sub: 'Psoriasis, Vitiligo, Chronic Itching' },
  { label: 'Hair & Scalp Problems', sub: 'Hair Fall, PRP, Alopecia, Dandruff' },
  { label: 'Kidney Stone & Piles', sub: 'Non-surgical Homeopathy Protocol' },
  { label: "Women's Health & PCOD", sub: 'Hormonal Balance, Cysts, Irregular Cycles' },
  { label: 'Height Growth Therapy', sub: 'Natural Pediatric & Adolescent Growth' },
  { label: 'Weight Management', sub: 'Healthy Metabolic Loss & Gain' },
  { label: 'Cosmetic & Medi Facials', sub: 'Skin Glow, Peels, Mole Removal' },
  { label: 'General Consultation', sub: 'Family Medicine & Constitutional Care' },
];

export default function AppointmentPage() {
  const { addAppointment } = useAdminData();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    consultationType: 'in-clinic', // 'in-clinic' | 'online'
    concern: 'Skin Disorders & Eczema',
    date: '',
    notes: '',
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

    if (nameErr || phoneErr) return;

    if (addAppointment) {
      addAppointment({
        id: `apt-${Date.now()}`,
        fullName: formData.name.trim(),
        phone: formData.phone.trim(),
        date: formData.date || new Date().toISOString().split('T')[0],
        condition: `${formData.concern} (${formData.consultationType === 'online' ? 'Online Video' : 'In-Clinic'})`,
        message: formData.notes.trim() || undefined,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
    }

    setSubmitted(true);
  };

  const handleWhatsAppBooking = () => {
    const msg = `Hello Dr. Monali's Homeopathy Clinic!\n\nI would like to book a consultation.\n\n*Name:* ${formData.name.trim() || 'Patient'}\n*Phone:* ${formData.phone.trim() || 'Not specified'}\n*Preferred Date:* ${formData.date || 'Earliest available'}\n*Treatment Focus:* ${formData.concern}\n*Type:* ${formData.consultationType === 'online' ? 'Online Video Consultation' : 'In-Clinic Visit'}\n\nPlease let me know available slots. Thank you!`;
    window.open(`https://wa.me/919209472224?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-['Source_Sans_3']">
      <Navbar />

      <main className="flex-1 pt-28 md:pt-36 pb-20">
        <div className="max-w-[1140px] mx-auto px-5 md:px-8">
          
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <div className="inline-flex items-center gap-1.5 bg-[#FAF0DD] text-[#108283] text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Direct Doctor Consultation</span>
            </div>

            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-gray-950 tracking-tight leading-tight mb-4">
              Book Your <span className="text-[#108283] italic">Appointment</span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Schedule your in-depth constitutional consultation with Dr. Monali Subhedar &amp; Dr. Sachin Subhedar. Appointments ensure zero waiting time.
            </p>

            {/* Quick Contact Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-gray-700">
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200/80 shadow-2xs">
                <Clock className="w-4 h-4 text-[#108283]" />
                <span>Mon–Sat: 10 AM–2 PM &amp; 5–9 PM</span>
              </span>
              <a 
                href="tel:+919209472224"
                className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200/80 shadow-2xs hover:text-[#108283] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#108283]" />
                <span className="font-semibold">+91 92094 72224</span>
              </a>
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200/80 shadow-2xs">
                <MapPin className="w-4 h-4 text-[#108283]" />
                <span>Ring Road, Kolhapur</span>
              </span>
            </div>
          </div>

          {/* Form & Info 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Booking Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              {submitted ? (
                <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-950">
                    Consultation Request Confirmed
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-gray-900">{formData.name}</strong>. Our clinic reception has received your booking for <strong className="text-gray-900">{formData.date || 'the requested date'}</strong>. We will call you at <strong className="text-gray-900">{formData.phone}</strong> shortly to confirm your time slot.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleWhatsAppBooking}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Instant WhatsApp Confirmation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-semibold transition-colors"
                    >
                      Book Another Date
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Consultation Type Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Choose Consultation Format <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, consultationType: 'in-clinic' })}
                        className={`py-3 px-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          formData.consultationType === 'in-clinic'
                            ? 'bg-[#108283] text-white border-[#108283] shadow-xs ring-2 ring-[#108283]/20'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-white'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>In-Clinic (Kolhapur)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, consultationType: 'online' })}
                        className={`py-3 px-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          formData.consultationType === 'online'
                            ? 'bg-[#108283] text-white border-[#108283] shadow-xs ring-2 ring-[#108283]/20'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-white'
                        }`}
                      >
                        <Stethoscope className="w-4 h-4" />
                        <span>Online Video / Phone</span>
                      </button>
                    </div>
                  </div>

                  {/* Patient Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Patil"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={() => {
                          setTouched((prev) => ({ ...prev, name: true }));
                          setErrors((prev) => ({ ...prev, name: validateName(formData.name) }));
                        }}
                        className={`w-full px-4 py-3 bg-gray-50/80 border rounded-2xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all ${
                          touched.name && errors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                        }`}
                      />
                      {touched.name && errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Mobile Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        onBlur={() => {
                          setTouched((prev) => ({ ...prev, phone: true }));
                          setErrors((prev) => ({ ...prev, phone: validatePhone(formData.phone) }));
                        }}
                        className={`w-full px-4 py-3 bg-gray-50/80 border rounded-2xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all ${
                          touched.phone && errors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                        }`}
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Preferred Consultation Date <span className="text-red-500">*</span>
                    </label>
                    <CustomDatePicker
                      value={formData.date}
                      onChange={(val) => setFormData({ ...formData, date: val })}
                      placeholder="Select consultation date..."
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Treatment Focus */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Primary Health or Aesthetic Focus
                    </label>
                    <select
                      value={formData.concern}
                      onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                    >
                      {TREATMENT_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.label}>
                          {opt.label} — {opt.sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Additional Medical History / Notes */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Symptoms / Health Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention any ongoing treatments, duration of symptoms, or specific health queries..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#108283] hover:bg-[#0c6b6c] text-white py-3.5 rounded-2xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer mt-2"
                  >
                    <span>Confirm Consultation Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-gray-500 font-light flex items-center justify-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#108283]" />
                    <span>Your contact and medical details are treated with 100% clinical confidentiality.</span>
                  </p>
                </form>
              )}
            </div>

            {/* Right Column: Clinic Info Card & Doctor Credentials */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Card 1: Clinic Overview & Direct Contact */}
              <div className="bg-[#108283] text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div>
                    <span className="text-xs bg-white/15 px-3 py-1 rounded-full font-semibold uppercase tracking-wider text-[#FAF0DD]">
                      Prime Location
                    </span>
                    <h3 className="font-['Playfair_Display'] text-2xl font-bold mt-2">
                      Dr. Monali&apos;s Clinic
                    </h3>
                    <p className="text-xs text-white/80 mt-1">
                      Homeopathy, Aesthetic Cosmetology &amp; Family Medicine
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#F0A070] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Golden Spring Apartment</p>
                        <p className="text-white/80 text-xs">Near Ring Road, Kolhapur, Maharashtra 416012</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#F0A070] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">OPD Timings</p>
                        <p className="text-white/80 text-xs">Morning: 10:00 AM – 2:00 PM</p>
                        <p className="text-white/80 text-xs">Evening: 5:00 PM – 9:00 PM (Mon–Sat)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-[#F0A070] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Direct Reception Line</p>
                        <a href="tel:+919209472224" className="text-white underline text-xs">
                          +91 92094 72224
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                    <a
                      href="https://maps.google.com/?q=Kolhapur+Ring+Road+Homeopathy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1 underline underline-offset-4"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={handleWhatsAppBooking}
                      className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Us</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Doctors On Duty */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
                <h4 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                  Consulting Physicians
                </h4>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-950 text-sm">Dr. Monali Subhedar</p>
                      <span className="text-[10px] bg-[#108283]/10 text-[#108283] font-bold px-2 py-0.5 rounded-full">
                        Reg. 61847
                      </span>
                    </div>
                    <p className="text-gray-600 mt-0.5">BHMS (Mumbai) • Certified Aesthetic Physician</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">Specialist in Chronic Skin Disorders, Hair PRP &amp; Constitutional Homeopathy.</p>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-950 text-sm">Dr. Sachin Subhedar</p>
                      <span className="text-[10px] bg-[#108283]/10 text-[#108283] font-bold px-2 py-0.5 rounded-full">
                        Reg. 64981
                      </span>
                    </div>
                    <p className="text-gray-600 mt-0.5">BHMS (Mumbai) • Family Physician</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">Specialist in Kidney Stone Relief, Piles Management &amp; Internal Wellness.</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Patient Assurance */}
              <div className="bg-[#FAF0DD]/60 rounded-3xl p-5 border border-[#F0DAAA]/70 text-xs space-y-2">
                <h5 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                  <Check className="w-4 h-4 text-[#108283]" />
                  <span>Why Pre-Book Your Visit?</span>
                </h5>
                <ul className="space-y-1.5 text-gray-600 text-[11.5px] leading-relaxed">
                  <li>• Zero in-clinic waiting time; your file is pre-prepared.</li>
                  <li>• Dedicated 20–30 minute constitutional evaluation.</li>
                  <li>• Complete case history taken in a private consultation room.</li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
      <ContactWidget />
    </div>
  );
}
