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
    <div className="w-full overflow-hidden bg-white py-12 md:py-16 border-y border-gray-100 select-none">
      <div className="max-w-[1140px] mx-auto px-5 mb-6 text-center">
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
                className="flex items-center justify-center mx-8 md:mx-12 shrink-0 h-16 md:h-20"
              >
                <img
                  src={logo}
                  alt="Partner Technology"
                  className="h-full w-auto max-w-[160px] md:max-w-[190px] object-contain grayscale hover:grayscale-0 opacity-65 hover:opacity-100 transition-all duration-300"
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
