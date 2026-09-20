'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Stethoscope, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function AboutDoctorSection() {
  const [activeTab, setActiveTab] = useState<'bio' | 'philosophy' | 'story'>('bio');

  return (
    <section id="about" className="relative bg-white pt-24 md:pt-32 pb-24 md:pb-32 overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Left: Doctor Portrait with Floating Credential Badges */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative max-w-[420px] w-full">
              {/* Ambient Glow */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#108283]/20 via-[#FAEDDA]/60 to-[#F0A070]/20 rounded-[36px] blur-2xl opacity-60"></div>

              {/* Main Portrait Card */}
              <div className="relative rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white">
                <img
                  src="/doctor.png?v=original"
                  alt="Dr. Monali Subhedar &amp; Dr. Sachin Subhedar - Dr. Monali's Homeopathy Clinic"
                  className="w-full h-auto max-h-[580px] object-cover"
                  loading="lazy"
                />
              </div>

              {/* Verified Medical Council Registration Chip */}
              <div className="absolute -top-4 -right-2 bg-white/95 backdrop-blur-md border border-gray-100 shadow-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-['Source_Sans_3'] text-gray-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reg. No. 61847 &amp; 64981</span>
              </div>
            </div>
          </div>

          {/* Right: Bio & Interactive Philosophy Tabs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tag */}
            <div className="inline-block bg-[#FAEDDA] text-[#108283] text-xs md:text-sm font-['Source_Sans_3'] font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              ABOUT OUR PHYSICIANS
            </div>

            {/* Heading */}
            <h2
              className="font-playfair text-2xl xs:text-3xl sm:text-3xl md:text-3xl lg:text-[34px] leading-tight text-gray-950 font-normal mb-6 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Meet <span className="text-[#108283] font-semibold italic">Dr. Monali &amp; Dr. Sachin Subhedar</span>
            </h2>

            {/* Interactive Tab Switcher: Full-width equal 3-column pill */}
            <div className="w-full max-w-[460px] grid grid-cols-3 p-1 bg-[#F4F7F8] rounded-full mb-6 font-['Source_Sans_3'] text-[11.5px] xs:text-xs sm:text-sm">
              <button
                onClick={() => setActiveTab('bio')}
                className={`py-2 px-1 xs:px-2 rounded-full text-center transition-all cursor-pointer truncate ${
                  activeTab === 'bio'
                    ? 'bg-white text-gray-900 font-semibold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Clinical Profile
              </button>
              <button
                onClick={() => setActiveTab('philosophy')}
                className={`py-2 px-1 xs:px-2 rounded-full text-center transition-all cursor-pointer truncate ${
                  activeTab === 'philosophy'
                    ? 'bg-white text-gray-900 font-semibold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Core Philosophy
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`py-2 px-1 xs:px-2 rounded-full text-center transition-all cursor-pointer truncate ${
                  activeTab === 'story'
                    ? 'bg-white text-gray-900 font-semibold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Personal Story
              </button>
            </div>

            {/* Dynamic Content Panels */}
            <div className="min-h-[220px] mb-8 font-['Source_Sans_3'] text-gray-700 text-base md:text-[16.5px] leading-relaxed">
              {activeTab === 'bio' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-['Playfair_Display'] font-bold text-gray-950 text-base md:text-lg whitespace-nowrap">
                      Dr. Monali Subhedar
                    </h3>
                    <p className="text-xs font-semibold text-[#108283] tracking-wide mb-1">
                      BHMS (Mumbai) • Homeopathy &amp; Aesthetic Physician • Reg. No. 61847
                    </p>
                    <p className="text-sm md:text-[15px] leading-relaxed text-gray-700">
                      Specializing in classical homeopathy and clinical aesthetics, Dr. Monali provides individualized remedies for chronic skin and hair concerns, lifestyle conditions, and holistic aesthetic rejuvenation. Her practice combines gentle natural therapies with thorough constitutional evaluation to achieve lasting wellness.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-['Playfair_Display'] font-bold text-gray-950 text-base md:text-lg whitespace-nowrap">
                      Dr. Sachin Subhedar
                    </h3>
                    <p className="text-xs font-semibold text-[#108283] tracking-wide mb-1">
                      BHMS (Mumbai) • Homeopathy &amp; Family Physician • Reg. No. 64981
                    </p>
                    <p className="text-sm md:text-[15px] leading-relaxed text-gray-700">
                      With deep expertise in family medicine and holistic healthcare, Dr. Sachin focuses on acute and chronic illnesses, pediatric and geriatric care, and long-term health restoration. He is dedicated to addressing root causes and strengthening the body&apos;s natural defense mechanisms across all age groups.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'philosophy' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <blockquote
                    className="border-l-3 border-[#108283] pl-5 py-3 text-gray-900 font-medium text-base sm:text-[17px] leading-[1.7] bg-[#FAF0DD]/30 rounded-r-2xl"
                    style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif" }}
                  >
                    “Dr. Monali&apos;s Homeopathy Clinic reflects our commitment to holistic healing, integrity, and individualized care — treating the individual as a whole, not just the symptoms.”
                  </blockquote>
                  <p className="text-sm text-gray-600 pt-1 font-source" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                    Every protocol is customized through detailed constitutional case analysis, prioritizing long-term biological vitality, natural immunity, and side-effect-free healing over temporary relief.
                  </p>
                </div>
              )}

              {activeTab === 'story' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <blockquote
                    className="border-l-3 border-[#F0A070] pl-5 py-3 text-gray-900 font-medium text-base sm:text-[17px] leading-[1.7] bg-[#FAF0DD]/30 rounded-r-2xl"
                    style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif" }}
                  >
                    “Our journey in homeopathy is guided by the conviction that true healing begins from within. Every patient brings a unique story, and our mission is to provide safe, natural care that restores balance, health, and vitality for every family.”
                  </blockquote>
                  <p className="text-sm text-gray-600 pt-1 font-source" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                    This empathy and clinical dedication define every consultation at Dr. Monali&apos;s Homeopathy Clinic, ensuring patients feel heard, understood, and fully supported.
                  </p>
                </div>
              )}
            </div>

            {/* Action Trigger */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#booking"
                className="inline-flex items-center gap-3 bg-[#108283] hover:bg-[#0c6b6c] text-white px-8 py-3.5 rounded-full font-['Source_Sans_3'] font-semibold text-sm transition-all active:scale-95"
              >
                <span>Book Consultation with Our Doctors</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Transition into Services Section */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none translate-y-1">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-12 md:h-20 text-[#FAF0DD] fill-current"
        >
          <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
