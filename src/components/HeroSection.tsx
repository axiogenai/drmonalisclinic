'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col justify-between"
      style={{ minHeight: '100dvh', background: 'linear-gradient(135deg, #FAF0DD 0%, #FBF0E8 45%, #F5EBD8 100%)' }}
    >
      {/* Subtle luxury ambient highlight */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #F0DAAA 0%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 md:px-10 flex flex-col md:flex-row items-center md:items-end justify-between flex-1 w-full pt-28 xs:pt-32 sm:pt-36 md:pt-0">

        {/* ─── LEFT COLUMN (Desktop: Girl Portrait / Mobile: Positioned below text at bottom) ─── */}
        <div className="w-full md:w-[48%] order-2 md:order-1 relative flex flex-col items-center justify-end mt-auto md:mt-0">
          <div
            className="relative w-full max-w-[320px] xs:max-w-[370px] sm:max-w-[430px] md:max-w-none h-[340px] xs:h-[400px] sm:h-[460px] md:h-screen flex items-end justify-center"
          >
            <Image
              src="/girl.png"
              alt="Dr. Monali's Homeopathy Clinic"
              fill
              priority
              sizes="(max-width: 768px) 380px, 50vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Content ─── */}
        <div className="w-full md:w-[52%] order-1 md:order-2 flex flex-col justify-center items-center md:items-start text-center md:text-left pl-0 md:pl-10 pt-2 sm:pt-4 md:pt-0 pb-2 md:pb-12 min-h-auto md:min-h-screen">

          {/* Headline & Description (No animation on mobile) */}
          <motion.div
            initial={isMobile ? false : { opacity: 0, y: 20 }}
            animate={isMobile ? false : { opacity: 1, y: 0 }}
            transition={isMobile ? { duration: 0 } : { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3.5 max-w-2xl"
          >
            <h1
              className="font-playfair text-[30px] xs:text-[36px] sm:text-[40px] md:text-[44px] lg:text-[48px] font-normal leading-[1.15] tracking-tight text-gray-950 mb-2.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Advanced{' '}
              <span
                className="font-semibold italic text-[#108283]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Homeopathy
              </span>
              ,{' '}
              <span
                className="font-semibold italic text-[#108283]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Skin
              </span>{' '}
              &amp;{' '}
              <span
                className="font-semibold italic text-[#108283]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Hair Care
              </span>
            </h1>
            <p
              className="font-playfair text-base xs:text-lg sm:text-xl italic text-gray-700 font-light leading-snug mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Constitutional Healing &amp; Modern Clinical Cosmetology in Kolhapur.
            </p>
            <p className="font-source text-gray-600 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-lg mx-auto md:mx-0">
              Consult with <strong className="font-semibold text-gray-900">Dr. Monali Subhedar</strong> (BHMS, MD, Cosmetologist) &amp;{' '}
              <strong className="font-semibold text-gray-900">Dr. Sachin Subhedar</strong>.
              15+ years of trusted clinical excellence, combining root-cause constitutional homeopathy, advanced skin treatments, and hair PRP therapy.
            </p>
          </motion.div>

          {/* Action CTAs: High-end compact pill buttons */}
          <motion.div
            initial={isMobile ? false : { opacity: 0, y: 15 }}
            animate={isMobile ? false : { opacity: 1, y: 0 }}
            transition={isMobile ? { duration: 0 } : { duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-row items-center justify-center md:justify-start gap-2.5 sm:gap-3.5 mb-4 w-full sm:w-auto"
          >
            <Link
              href="#booking"
              className="inline-flex items-center justify-center gap-2 bg-[#108283] hover:bg-[#0c6b6c] active:scale-95 text-white rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer font-source shadow-[0_8px_20px_rgba(16,130,131,0.22)]"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              <CalendarCheck className="w-4 h-4 text-white" />
              <span>Book Appointment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="#services"
              className="inline-flex items-center justify-center gap-1.5 bg-white/90 hover:bg-white active:scale-95 text-gray-900 border border-gray-200/90 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all backdrop-blur-sm cursor-pointer font-source shadow-2xs"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              <span>Our Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#108283]" />
            </Link>
          </motion.div>

          {/* Sleek Single-Line Status Strip (Hidden on mobile, visible on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:inline-flex flex-wrap items-center justify-start gap-2.5 bg-white/80 backdrop-blur-md border border-white/90 rounded-full px-3.5 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.04)] font-source text-xs text-gray-700"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            <div className="flex items-center gap-1.5 font-medium text-gray-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Open Mon–Sat: 10 AM–2 PM &amp; 5–9 PM</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-[#F0A070] shrink-0" />
              <span>Near Ring Road, Kolhapur</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom wave separator with seamless baseline coverage */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-[45px] xs:h-[55px] md:h-[70px]"
        >
          <path
            d="M0,32 C360,65 720,15 1080,45 C1260,60 1380,38 1440,30 L1440,80 L0,80 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
