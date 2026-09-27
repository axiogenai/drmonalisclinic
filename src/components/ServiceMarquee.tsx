'use client';

import React from 'react';
import { useAdminData } from '@/context/AdminDataContext';

const defaultServices = [
  'Homeopathy',
  'Skin Care',
  'Hair Care',
  'Medi Facial',
  'Chemical Peel',
  'Anti-Aging',
  'PRP Therapy',
  'Mesotherapy',
  'Microneedling',
  'Diet & Wellness',
];

export default function ServiceMarquee() {
  let adminData: ReturnType<typeof useAdminData> | null = null;
  try {
    adminData = useAdminData();
  } catch {}
  const adminServices = adminData?.services;
  const services = adminServices && adminServices.length > 0
    ? adminServices.map(s => s.title)
    : defaultServices;
  return (
    <div className="w-full overflow-hidden bg-[#F0A070] py-2.5 md:py-3 select-none relative shadow-sm">
      <div className="flex w-max animate-marquee items-center">
        {/* Render 3 times for completely gapless infinite looping */}
        {[...Array(3)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center">
            {services.map((service, index) => (
              <div key={`${loopIdx}-${index}`} className="flex items-center mx-5 md:mx-7 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 mr-3.5 shrink-0" />
                <span className="font-['Playfair_Display'] text-base md:text-lg lg:text-[19px] font-normal text-white tracking-wide leading-none">
                  {service}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
