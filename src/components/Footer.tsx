'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  Copy, 
  Check, 
  ArrowUp, 
  ExternalLink,
  X,
  Shield,
  BookOpen,
  CheckCircle2,
  Lock,
  FileText
} from 'lucide-react';
import { scrollToTop, scrollToTarget } from '@/components/SmoothScroll';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  // Modals state
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);
  
  // Copy feedback state
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);



  // Keyboard escape listener to close modals and completely lock background & side scrollbar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();

      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();

      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();

      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  // Copy phone handler
  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('+919209472224');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  // Copy email handler
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('info@drmonali.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  // Smooth scroll or navigation helpers
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      scrollToTop();
    } else {
      router.push('/');
      setTimeout(() => scrollToTop(), 150);
    }
  };

  const handleSectionClick = (targetId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      scrollToTarget(targetId, -90);
      if (window.location.hash !== `#${targetId}`) {
        window.history.pushState(null, '', `#${targetId}`);
      }
    } else {
      router.push(`/#${targetId}`);
    }
  };

  const handlePageClick = (href: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault();
      scrollToTop();
    }
  };

  const handleTreatmentClick = (url: string, e: React.MouseEvent) => {
    const [path, hash] = url.split('#');
    if (pathname === path && hash) {
      e.preventDefault();
      scrollToTarget(hash, -90);
      window.history.pushState(null, '', `#${hash}`);
    } else if (pathname === path && !hash) {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <>
      <footer id="contact" className="bg-[#111111] text-white pt-16 pb-10 border-t-4 border-[#108283] relative overflow-hidden scroll-mt-20">
        <div className="max-w-[1140px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/10">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-4 space-y-6">
              <Link 
                href="/" 
                onClick={handleHomeClick}
                className="inline-flex items-center gap-3 group cursor-pointer"
              >
                <img 
                  src="/clinic-logo.png" 
                  alt="Dr. Monali's Homeopathy Clinic"
                  className="h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-['Playfair_Display'] font-bold text-white text-xl leading-tight group-hover:text-[#108283] transition-colors">
                    Dr. Monali&apos;s
                  </span>
                  <span className="text-xs font-medium tracking-wider uppercase text-[#108283]">
                    Homeopathy Clinic
                  </span>
                </div>
              </Link>
              
              <p className="font-['Source_Sans_3'] text-gray-400 text-sm md:text-[15px] leading-relaxed font-light">
                Dr. Monali&apos;s Homeopathy Clinic is your trusted destination for natural, holistic healing in Kolhapur. Led by Dr. Monali Subhedar &amp; <span className="whitespace-nowrap">Dr. Sachin Subhedar</span> — healing through nature&apos;s wisdom.
              </p>

              {/* Social Media Links */}
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/drmonalisachin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E1306C] flex items-center justify-center transition-all duration-300 text-white hover:scale-110 shadow-sm"
                  aria-label="Visit our Instagram"
                  title="Follow Dr. Monali on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/drmonalisachin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 text-white hover:scale-110 shadow-sm"
                  aria-label="Visit our Facebook"
                  title="Follow Dr. Monali on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/919209472224?text=Hello%20Dr.%20Monali%27s%20Clinic,%20I%20would%20like%20to%20inquire%20about%20a%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 text-white hover:scale-110 shadow-sm"
                  aria-label="Chat on WhatsApp"
                  title="Direct WhatsApp Consultation Inquiry"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 + Col 3: Quick Links & Our Treatments — side-by-side 2-col grid on mobile */}
            <div className="grid grid-cols-2 gap-6 md:contents">

            {/* Col 2: Quick Links */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="font-['Playfair_Display'] text-lg font-medium text-white">
                Quick Links
              </h4>
              <ul className="space-y-3 font-['Source_Sans_3'] text-sm text-gray-400">
                <li>
                  <Link 
                    href="/" 
                    onClick={handleHomeClick}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/shop" 
                    onClick={(e) => handlePageClick('/shop', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Clinic Shop
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    onClick={(e) => handlePageClick('/about', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <a 
                    href="/#services" 
                    onClick={(e) => handleSectionClick('services', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a 
                    href="/#stories" 
                    onClick={(e) => handleSectionClick('stories', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Patient Stories
                  </a>
                </li>
                <li>
                  <a 
                    href="/#booking" 
                    onClick={(e) => handleSectionClick('booking', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Appointment
                  </a>
                </li>
                <li>
                  <a 
                    href="/#faqs" 
                    onClick={(e) => handleSectionClick('faqs', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Services / Our Treatments */}
            <div className="lg:col-span-3 space-y-5">
              <h4 className="font-['Playfair_Display'] text-lg font-medium text-white">
                Our Treatments
              </h4>
              <ul className="space-y-3 font-['Source_Sans_3'] text-sm text-gray-400">
                <li>
                  <Link 
                    href="/homeopathy#eczema-psoriasis" 
                    onClick={(e) => handleTreatmentClick('/homeopathy#eczema-psoriasis', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Skin Disorders
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/hair-and-skin#hair-prp" 
                    onClick={(e) => handleTreatmentClick('/hair-and-skin#hair-prp', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Hair Loss &amp; Scalp
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/homeopathy" 
                    onClick={(e) => handleTreatmentClick('/homeopathy', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Respiratory Ailments
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/homeopathy#kidney-stones" 
                    onClick={(e) => handleTreatmentClick('/homeopathy#kidney-stones', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Joint &amp; Bone Problems
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/homeopathy#pcod" 
                    onClick={(e) => handleTreatmentClick('/homeopathy#pcod', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Women&apos;s Health
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cosmetic-treatments" 
                    onClick={(e) => handleTreatmentClick('/cosmetic-treatments', e)}
                    className="hover:text-[#108283] hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Cosmetic Treatments
                  </Link>
                </li>
              </ul>
            </div>

            {/* End of mobile 2-col wrapper for Quick Links + Our Treatments */}
            </div>

            {/* Col 4: Contact Info & Hours */}
            <div className="lg:col-span-3 space-y-5">
              <h4 className="font-['Playfair_Display'] text-lg font-medium text-white">
                Clinic Info &amp; Hours
              </h4>
              <div className="space-y-4 font-['Source_Sans_3'] text-sm text-gray-400">
                {/* Google Maps Link */}
                <a 
                  href="https://maps.google.com/?q=Golden+Spring+Apartment+Gangailon+Javal+Ring+Road+Kolhapur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-white transition-colors group cursor-pointer"
                  title="Open clinic location in Google Maps"
                >
                  <MapPin className="w-5 h-5 text-[#108283] group-hover:text-[#F0A070] shrink-0 mt-0.5 transition-colors" />
                  <span className="leading-snug">
                    Golden Spring Apartment, Gangailon Javal, Ring Road, Kolhapur
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#108283] font-medium ml-1.5 opacity-90 group-hover:underline">
                      Maps ↗
                    </span>
                  </span>
                </a>

                {/* Direct Phone Call & Copy */}
                <div className="flex items-center justify-between gap-2 group">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#108283] shrink-0" />
                    <a 
                      href="tel:+919209472224" 
                      className="hover:text-[#61CE70] transition-colors font-medium text-white tracking-wide"
                      title="Call Dr. Monali's Clinic"
                    >
                      +91 92094 72224
                    </a>
                  </div>
                  <button
                    onClick={handleCopyPhone}
                    className="text-xs px-2 py-0.5 rounded bg-white/10 hover:bg-[#108283] text-gray-300 hover:text-white transition-all flex items-center gap-1"
                    title="Copy phone number"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[11px] text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Email & Copy */}
                <div className="flex items-center justify-between gap-2 group">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#108283] shrink-0" />
                    <a 
                      href="mailto:info@drmonali.com?subject=Consultation%20Inquiry%20-%20Dr.%20Monali%27s%20Homeopathy%20Clinic" 
                      className="hover:text-white transition-colors"
                      title="Send an email to info@drmonali.com"
                    >
                      info@drmonali.com
                    </a>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="text-xs px-2 py-0.5 rounded bg-white/10 hover:bg-[#108283] text-gray-300 hover:text-white transition-all flex items-center gap-1"
                    title="Copy email address"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[11px] text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Timings & Live Status */}
                <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                  <Clock className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">Monday – Saturday</p>
                    </div>
                    <p className="text-gray-300 text-xs">Morning: 10:00 AM – 2:00 PM</p>
                    <p className="text-gray-300 text-xs">Evening: 5:00 PM – 9:00 PM</p>
                    <p className="text-amber-400 text-xs font-semibold">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col lg:flex-row items-center justify-between text-xs text-gray-500 font-['Source_Sans_3'] gap-4">
            <p className="text-gray-400">
              Powered by{' '}
              <a 
                href="https://team.axiogen.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#108283] hover:text-white font-semibold transition-colors"
              >
                Team.axiogen.in
              </a>
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {/* Privacy Policy Modal Trigger */}
              <button 
                onClick={() => setActiveModal('privacy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>

              {/* Terms & Conditions Modal Trigger */}
              <button 
                onClick={() => setActiveModal('terms')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms &amp; Conditions
              </button>

              {/* Book Appointment smooth scroll */}
              <a 
                href="/#booking" 
                onClick={(e) => handleSectionClick('booking', e)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Book Appointment
              </a>

              {/* Admin / CRM Link */}
              <Link 
                href="/admin" 
                className="text-[#108283] hover:text-white font-semibold transition-colors flex items-center gap-1"
              >
                <span>Admin / CRM</span>
              </Link>

              {/* Back to Top Button */}
              <button
                onClick={() => scrollToTop()}
                className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-white/10"
                title="Scroll back to top"
              >
                <span>Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================
          PRIVACY POLICY MODAL
      ========================================================= */}
      {activeModal === 'privacy' && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white text-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-[#FAF0DD]/50 to-white">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#FAEDDA] text-[#108283] text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" /> Patient Confidentiality
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-gray-900">
                  Privacy Policy
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-['Source_Sans_3']">
                  Dr. Monali&apos;s Homeopathy Clinic • Kolhapur
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 font-['Source_Sans_3'] text-sm md:text-base text-gray-700 leading-relaxed">
              <div>
                <h4 className="font-semibold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#108283]" />
                  1. Doctor-Patient Confidentiality
                </h4>
                <p className="text-gray-600 text-sm">
                  All clinical case assessments, symptom disclosures, photographic evidence (for skin/hair conditions), and diagnostic records are strictly confidential under the Indian Medical Council Code of Ethics and DISHA standards. Case details are accessible only to supervising licensed homeopathic doctors.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#108283]" />
                  2. Purpose of Information Collection
                </h4>
                <p className="text-gray-600 text-sm">
                  We collect personal contact information (Name, Phone, City) and constitutional medical notes solely to diagnose conditions accurately and formulate individualized homeopathic remedies.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#108283]" />
                  3. Zero Third-Party Sharing
                </h4>
                <p className="text-gray-600 text-sm">
                  We maintain a strict policy against commercial data dissemination: your personal or medical information is never sold, leased, or transmitted to pharmaceutical representatives, external advertisers, or commercial third parties.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#108283]" />
                  4. Secure Tele-Consultations
                </h4>
                <p className="text-gray-600 text-sm">
                  Prescriptions and dietary schedules shared over phone or clinic WhatsApp (+91 92094 72224) are recorded within secured clinic systems for continuous follow-up care.
                </p>
              </div>

              <div className="bg-[#FAF0DD]/60 rounded-xl p-4 border border-[#D4AF37]/30 text-xs text-gray-700">
                <span className="font-bold text-gray-900">Privacy Inquiries:</span> For record inquiries or data correction, reach Dr. Monali&apos;s desk at{' '}
                <a href="mailto:info@drmonali.com" className="text-[#108283] font-semibold underline">info@drmonali.com</a> or call{' '}
                <a href="tel:+919209472224" className="text-[#108283] font-semibold underline">+91 92094 72224</a>.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:px-8 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <Link 
                href="/privacy-policy" 
                onClick={() => setActiveModal(null)}
                className="text-xs font-semibold text-[#108283] hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full Policy Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#108283] hover:bg-[#0b5c5d] text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
              >
                I Understand &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TERMS & CONDITIONS MODAL
      ========================================================= */}
      {activeModal === 'terms' && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white text-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-[#FAF0DD]/50 to-white">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#FAEDDA] text-[#108283] text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" /> Clinic Guidelines
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-gray-900">
                  Terms &amp; Conditions
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-['Source_Sans_3']">
                  Dr. Monali&apos;s Homeopathy Clinic • Kolhapur
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 font-['Source_Sans_3'] text-sm md:text-base text-gray-700 leading-relaxed">
              <div>
                <h4 className="font-semibold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#108283]" />
                  1. Constitutional Medical Consultations
                </h4>
                <p className="text-gray-600 text-sm">
                  Homeopathy is a constitutional holistic therapy. Treatment outcomes depend on case chronicity, patient susceptibility, and consistent adherence to dosage and dietary guidelines.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#108283]" />
                  2. Appointments &amp; Rescheduling
                </h4>
                <p className="text-gray-600 text-sm">
                  Please arrive 10 minutes prior to your in-clinic consultation. If you need to reschedule or cancel your slot, kindly inform our desk at least 2 hours in advance via phone or WhatsApp.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#108283]" />
                  3. Medicine Storage Guidelines
                </h4>
                <p className="text-gray-600 text-sm">
                  Store your homeopathic remedies in a cool, dry place away from direct sunlight, camphor, raw garlic/onions, and strong perfumes. Maintain a 15-minute gap between food/drinks and taking homeopathic pills.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  4. Outpatient Care &amp; Emergency Disclaimer
                </h4>
                <p className="text-gray-600 text-sm">
                  Our clinic provides outpatient holistic and constitutional medical care. For acute medical emergencies, trauma, poisonings, or acute life-threatening situations, patients must immediately report to the nearest hospital casualty/emergency unit.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:px-8 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <Link 
                href="/terms-and-conditions" 
                onClick={() => setActiveModal(null)}
                className="text-xs font-semibold text-[#108283] hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full Terms Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#108283] hover:bg-[#0b5c5d] text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
              >
                Accept &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
