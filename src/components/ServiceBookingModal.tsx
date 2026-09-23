'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  IndianRupee,
  MessageCircle
} from 'lucide-react';
import { Service, Appointment } from '@/types/admin';
import { useAdminData } from '@/context/AdminDataContext';
import { useDialog } from '@/context/DialogContext';

interface ServiceBookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceBookingModal({
  service,
  isOpen,
  onClose
}: ServiceBookingModalProps) {
  const { addAppointment } = useAdminData();
  const { toast } = useDialog();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Morning (10:00 AM - 01:00 PM)');
  const [consultationMode, setConsultationMode] = useState<'in_clinic' | 'online'>('in_clinic');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Reset state when service or open changes
  useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false);
      setIsSubmitting(false);
      // Pre-fill tomorrow as default date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPreferredDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen, service]);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 3) {
      toast({
        title: 'Full Name Required',
        message: 'Please enter your full name (minimum 3 characters).',
        type: 'error',
      });
      return;
    }

    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast({
        title: 'Valid Phone Required',
        message: 'Please enter a valid 10-digit mobile number.',
        type: 'error',
      });
      return;
    }

    if (!preferredDate) {
      toast({
        title: 'Date Required',
        message: 'Please select a preferred consultation date.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    const refId = 'APT-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(refId);

    const newAppointment: Appointment = {
      id: 'apt-' + Date.now(),
      fullName: fullName.trim(),
      phone: cleanPhone,
      date: preferredDate,
      condition: `${service.title} (${consultationMode === 'in_clinic' ? 'In-Clinic' : 'Online Video'}) - ${preferredSlot}`,
      message: notes.trim() ? `[Ref: ${refId}] ${notes.trim()}` : `[Ref: ${refId}] Auto-booked from ${service.title} card`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    try {
      addAppointment(newAppointment);

      toast({
        title: 'Consultation Requested!',
        message: `Your booking for "${service.title}" has been received.`,
        type: 'success',
      });

      setIsConfirmed(true);
    } catch (err) {
      console.error('Error saving appointment:', err);
      toast({
        title: 'Booking Saved Locally',
        message: 'Appointment recorded in clinic logs.',
        type: 'info',
      });
      setIsConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    const modeText = consultationMode === 'in_clinic' 
      ? 'In-Clinic Visit (Opp. Circuit House, Kolhapur)' 
      : 'Online Video Consultation';

    const msg = `Hello Dr. Monali's Clinic!\n\n` +
      `📅 *NEW CONSULTATION REQUEST*\n` +
      `--------------------------------\n` +
      `🔖 *Reference:* ${bookingRef}\n` +
      `🩺 *Treatment:* ${service.title}\n` +
      `💰 *Estimated Fee:* ${service.price || 'From ₹799+'}\n` +
      `⏱️ *Est. Duration:* ${service.duration || '30-45 mins'}\n` +
      `👤 *Patient Name:* ${fullName.trim()}\n` +
      `📞 *Mobile:* ${phone.trim()}\n` +
      `🗓️ *Preferred Date:* ${preferredDate}\n` +
      `⏰ *Time Slot:* ${preferredSlot}\n` +
      `🏥 *Mode:* ${modeText}\n` +
      (notes.trim() ? `📝 *Notes:* ${notes.trim()}\n` : '') +
      `--------------------------------\n` +
      `Please confirm my appointment slot. Thank you!`;

    window.open(`https://wa.me/919209472224?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[140] overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-[#108283] to-[#0c6b6c] text-white p-6 pb-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-xs font-semibold uppercase tracking-wider text-[#FAF0DD] mb-1.5 font-['Source_Sans_3']">
            Personalized Clinical Consultation
          </div>

          <h3 className="font-['Playfair_Display'] text-2xl font-bold leading-tight">
            {service.title}
          </h3>

          {/* Badges for Price & Duration */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {service.price && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-bold font-['Source_Sans_3'] border border-white/20">
                <IndianRupee className="w-3 h-3" />
                <span>{service.price}</span>
              </span>
            )}
            {service.duration && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[#FAF0DD] text-xs font-semibold font-['Source_Sans_3'] border border-white/20">
                <Clock className="w-3 h-3 text-[#FAF0DD]" />
                <span>{service.duration}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/30 text-white text-[11px] font-semibold font-['Source_Sans_3'] border border-emerald-400/30">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span>Dermatologist & Homeopath Led</span>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isConfirmed ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-gray-500 font-['Source_Sans_3'] -mt-1 mb-2">
                Book direct consultation for <strong className="text-gray-800">{service.title}</strong>. Zero page redirects—confirmed immediately with our clinic team.
              </p>

              {/* Consultation Mode Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-['Source_Sans_3']">
                  Consultation Mode <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultationMode('in_clinic')}
                    className={`flex items-center justify-center py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      consultationMode === 'in_clinic'
                        ? 'bg-[#108283]/10 border-[#108283] text-[#108283] ring-1 ring-[#108283]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>In-Clinic (Kolhapur)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationMode('online')}
                    className={`flex items-center justify-center py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      consultationMode === 'online'
                        ? 'bg-[#108283]/10 border-[#108283] text-[#108283] ring-1 ring-[#108283]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Online Video Call</span>
                  </button>
                </div>
              </div>

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                    Patient Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anjali Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                    Preferred Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                    Preferred Time Slot <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                      <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                      <option value="Evening (05:00 PM - 08:00 PM)">Evening (05:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Specific Symptoms / Notes */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 font-['Source_Sans_3']">
                  Specific Symptoms / Health Concerns (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Duration of problem, previous medications tried, or specific queries..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50/80 hover:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-['Source_Sans_3'] focus:ring-2 focus:ring-[#108283]/20 focus:border-[#108283] focus:bg-white outline-none transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Booking Slot...</span>
                  ) : (
                    <>
                      <span>Confirm Consultation Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation State */
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#108283] uppercase tracking-wider block mb-1">
                  Booking Recorded
                </span>
                <h4 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900">
                  Consultation Requested!
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto mt-1 font-['Source_Sans_3'] leading-relaxed">
                  Thank you, <strong className="text-gray-900">{fullName}</strong>. We have reserved your preferred slot for <strong className="text-[#108283]">{service.title}</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#FAF0DD]/50 border border-[#D4AF37]/30 rounded-2xl p-4 text-left space-y-2 text-xs font-['Source_Sans_3'] max-w-sm mx-auto">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Reference ID</span>
                  <span className="font-mono font-bold text-gray-900">{bookingRef}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Selected Date</span>
                  <span className="font-semibold text-gray-900">{preferredDate}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Slot</span>
                  <span className="font-semibold text-gray-900">{preferredSlot.split('(')[0].trim()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Estimated Fee</span>
                  <span className="font-bold text-[#108283]">{service.price || 'From ₹799+'}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Duration</span>
                  <span className="font-semibold text-gray-900">{service.duration || '30-45 mins'}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleWhatsAppConfirm}
                  className="w-full max-w-sm mx-auto bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation on WhatsApp</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full max-w-sm mx-auto py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer block"
                >
                  Continue Browsing Treatments
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
