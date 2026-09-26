'use client';

import React from 'react';
import { Phone } from 'lucide-react';

export default function TargetAreasSection() {
  return (
    <section className="py-14 sm:py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8 text-center">
        {/* Pill Tag */}
        <div className="inline-block bg-[#FAEDDA] text-[#108283] text-xs md:text-sm font-['Source_Sans_3'] font-medium px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
          TARGET AREAS
        </div>

        {/* Heading */}
        <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-950 font-normal mb-4">
          Explore the <span className="text-[#108283] font-bold italic">Target Areas</span> of Skin Treatments
        </h2>

        {/* Subtitle */}
        <p className="font-['Source_Sans_3'] text-gray-700 max-w-3xl mx-auto text-base md:text-lg mb-12 md:mb-16 font-light">
          From face and scalp to body and beyond, our treatments are designed to address every area with expert precision and personalized care.
        </p>

        {/* Anatomical Map Image Card with Glassmorphic Accent */}
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-white shadow-[0_16px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-3 sm:p-4 md:p-8 mb-10 sm:mb-12">
          <img 
            src="/target-areas.png"
            alt="Target Areas of Skin Treatments"
            className="w-full h-auto max-h-[640px] object-contain mx-auto"
            loading="lazy"
          />
        </div>

        {/* Floating Glassmorphic Contact Card */}
        <div className="inline-flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 sm:gap-4 bg-white/90 backdrop-blur-xl px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 max-w-full">
          <div className="w-12 h-12 rounded-full bg-[#108283] text-white flex items-center justify-center shadow-md shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="text-center sm:text-left font-['Source_Sans_3']">
            <p className="font-bold text-gray-900 text-sm">Have Questions? Contact Us</p>
            <p className="text-gray-600 text-xs md:text-sm font-medium">+91 92094 72224</p>
          </div>
        </div>
      </div>
    </section>
  );
}
