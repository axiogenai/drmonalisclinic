'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { defaultAboutSettings } from '@/data/defaultAboutAndFooter';

function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(end);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // If mobile, keep final value directly without delay or observer failure
    if (window.innerWidth < 768) {
      setCount(end);
      return;
    }

    setCount(0); // On desktop start from 0 for the animation

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;
          const animate = (time: number) => {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    const fallbackTimer = setTimeout(() => {
      setCount(end);
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="font-['Playfair_Display'] font-normal italic">
      {count}
      {suffix}
    </span>
  );
}

function parseNumber(str: string, fallback: number): number {
  if (!str) return fallback;
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : fallback;
}

function parseSuffix(str: string, fallback: string): string {
  if (!str) return fallback;
  const clean = str.replace(/[0-9]/g, '').trim();
  return clean || fallback;
}

export default function ConfidenceSection() {
  let adminData: ReturnType<typeof useAdminData> | null = null;
  try {
    adminData = useAdminData();
  } catch {}
  const stats = adminData?.aboutSettings?.stats || defaultAboutSettings.stats;

  const counters = [
    { label: 'Years of Experience', value: parseNumber(stats.yearsExperience, 6), suffix: parseSuffix(stats.yearsExperience, '+') },
    { label: 'Treatments Performed', value: parseNumber(stats.treatmentsPerformed, 5), suffix: parseSuffix(stats.treatmentsPerformed, 'k+') },
    { label: 'Client Satisfaction', value: parseNumber(stats.clientSatisfaction, 98), suffix: parseSuffix(stats.clientSatisfaction, '%') },
    { label: 'Safe & Natural Care', value: parseNumber(stats.safeFdaApproved, 100), suffix: parseSuffix(stats.safeFdaApproved, '%') },
  ];

  return (
    <section className="bg-white py-20 md:py-28 relative">
      <div className="max-w-[1140px] mx-auto px-5 md:px-8 flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div
          className="inline-block bg-[#FAEDDA] text-gray-900 text-xs md:text-sm font-normal px-5 py-1.5 rounded-full mb-6 uppercase tracking-wider font-source"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          CONFIDENCE STARTS WITH CARE
        </div>

        {/* Short, Clean Headline */}
        <h2
          className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal leading-[1.22] text-gray-950 max-w-4xl mb-4 md:whitespace-nowrap"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Skin, Hair &amp; Holistic Health.{' '}
          <span className="italic text-[#108283] font-medium whitespace-nowrap">Expertly cared for.</span>
        </h2>

        {/* Concise Subtitle */}
        <p
          className="font-source text-gray-600 text-base sm:text-lg font-light max-w-3xl mb-12 md:mb-16 leading-relaxed md:whitespace-nowrap"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          Personalized, gentle care at <strong className="font-semibold text-gray-900">Dr. Monali&apos;s Homeopathy Clinic</strong> to restore natural well-being.
        </p>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 w-full pt-4">
          {counters.map((stat) => (
            <div 
              key={stat.label}
              className="flex flex-col items-center justify-center text-center"
            >
              {/* Number on top in teal italic serif */}
              <div
                className="text-[#108283] text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[86px] font-normal leading-none mb-3 font-playfair"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label underneath in delicate italic serif */}
              <p
                className="font-playfair text-sm sm:text-base lg:text-[17px] text-[#535353] italic font-normal tracking-wide"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
