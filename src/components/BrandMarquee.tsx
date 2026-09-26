'use client';

import React from 'react';

const logos = [
  'https://primederm.in/wp-content/uploads/2025/06/1.webp',
  'https://primederm.in/wp-content/uploads/2025/06/2.webp',
  'https://primederm.in/wp-content/uploads/2025/06/3.webp',
  'https://primederm.in/wp-content/uploads/2025/06/4.webp',
  'https://primederm.in/wp-content/uploads/2025/06/5.webp',
  'https://primederm.in/wp-content/uploads/2025/06/6.webp',
  'https://primederm.in/wp-content/uploads/2025/06/7.webp',
  'https://primederm.in/wp-content/uploads/2025/06/8.webp',
  'https://primederm.in/wp-content/uploads/2025/06/Untitled-design.png',
  'https://primederm.in/wp-content/uploads/2025/08/Crystal_Tomato_Logo_RGB-scaled.png',
];

export default function BrandMarquee() {
  return (
    <div className="overflow-hidden w-full max-w-full bg-white py-10 sm:py-12 md:py-16 border-y border-gray-100 select-none">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8 mb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-['Source_Sans_3'] font-semibold">
          TRUSTED CLINICAL PARTNERS & TECHNOLOGIES
        </span>
      </div>

      <div className="flex w-max animate-marquee items-center">
        {[...Array(3)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center">
            {logos.map((logo, index) => (
              <div
                key={`${loopIdx}-${index}`}
                className="flex items-center justify-center mx-6 sm:mx-8 md:mx-12 shrink-0 h-[70px] sm:h-[90px] md:h-[110px]"
              >
                <img
                  src={logo}
                  alt="Partner Technology"
                  className="h-full w-auto max-w-[150px] sm:max-w-[170px] md:max-w-[200px] object-contain grayscale hover:grayscale-0 opacity-65 hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
