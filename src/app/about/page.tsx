'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Award, CheckCircle2, Stethoscope } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactWidget from '@/components/ContactWidget';
import { useAdminData } from '@/context/AdminDataContext';
import { defaultAboutSettings } from '@/data/defaultAboutAndFooter';

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
            const elapsed = (time - startTime) / (duration * 1000);
            const progress = Math.min(elapsed, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
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
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutPage() {
  let adminData: ReturnType<typeof useAdminData> | null = null;
  try {
    adminData = useAdminData();
  } catch {}
  const aboutSettings = adminData?.aboutSettings || defaultAboutSettings;

  // Hero background slideshow
  const heroSlides = [
    '/docbg.png',
    '/docbg2.png',
  ];
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Doctor section accordion
  const [activeAccordion, setActiveAccordion] = useState<string | null>('expertise');

  // Services Slider
  const services = [
    {
      title: 'Skin Treatments',
      desc: 'Targeted solutions for acne, pigmentation, aging, and overall skin health.',
      image: 'https://primederm.in/wp-content/uploads/2026/03/Skin-treatments.jpg',
      link: '/cosmetic-treatments'
    },
    {
      title: 'Hair Treatments',
      desc: 'Advanced therapies to treat hair loss, thinning, dandruff, and scalp conditions.',
      image: 'https://primederm.in/wp-content/uploads/2026/03/Hair-treatments.jpg',
      link: '/hair-and-skin'
    },
    {
      title: 'Body Treatments',
      desc: 'Aesthetic treatments for contouring, stretch marks, sweating, and rejuvenation.',
      image: 'https://primederm.in/wp-content/uploads/2026/03/Body-treatments.jpg',
      link: '/cosmetic-treatments'
    },
    {
      title: 'Dermato Surgery',
      desc: 'Safe, expert procedures for scars, moles, tags, and more.',
      image: 'https://primederm.in/wp-content/uploads/2026/03/Dermato-Surgery.jpg',
      link: '/cosmetic-treatments'
    },
    {
      title: 'Medical Dermatology',
      desc: 'Diagnosis and treatment for chronic skin, scalp, and nail conditions.',
      image: 'https://primederm.in/wp-content/uploads/2026/03/Medical-Dermatology.jpg',
      link: '/homeopathy'
    },
    {
      title: 'Injectables',
      desc: 'Botox, fillers, and boosters for refined, natural-looking enhancement.',
      image: 'https://primederm.in/wp-content/uploads/2026/03/Injectables.jpg',
      link: '/cosmetic-treatments'
    },
    {
      title: 'Wellness',
      desc: 'IV drips and diet counselling to support skin and hair from within.',
      image: 'https://primederm.in/wp-content/uploads/2026/03/Wellness.jpg',
      link: '/homeopathy'
    },
    {
      title: 'Medi Facials',
      desc: 'Dermatologist-designed facials to hydrate, brighten, and renew.',
      image: 'https://primederm.in/wp-content/uploads/2026/03/Medi-Facials.jpg',
      link: '/cosmetic-treatments'
    }
  ];

  const [currentServiceIdx, setCurrentServiceIdx] = useState(0);

  const nextService = () => {
    setCurrentServiceIdx((prev) => (prev + 1) % services.length);
  };

  const prevService = () => {
    setCurrentServiceIdx((prev) => (prev - 1 + services.length) % services.length);
  };

  const marqueeItems = [
    'Skin Treatments',
    'Hair Treatments',
    'Body Treatments',
    'Dermato Surgery',
    'Medical Dermatology',
    'Injectables',
    'Wellness',
    'Medi Facials'
  ];

  return (
    <main className="min-h-screen bg-white font-['Source_Sans_3'] text-[#333333]">
      <Navbar />

      {/* =========================================================================
          SECTION 1: HERO SLIDESHOW (Behind Every Glow is a Story)
          ========================================================================= */}
      <section className="relative h-screen min-h-[650px] w-full overflow-hidden flex items-end pb-24 md:pb-28">
        {/* Slideshow background layers */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              currentHeroSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl text-left">
            <h1 className="text-white font-['Playfair_Display'] text-5xl sm:text-6xl md:text-[72px] font-light leading-[1.05] tracking-[-0.02em]">
              {(() => {
                const words = (aboutSettings.heroHeading || defaultAboutSettings.heroHeading).split(' ');
                const last = words.pop();
                return (
                  <>
                    {words.join(' ')}{' '}
                    <span className="font-extrabold italic text-[#108283] block sm:inline">
                      {last}
                    </span>
                  </>
                );
              })()}
            </h1>

            <p className="text-white font-['Source_Sans_3'] text-xl sm:text-2xl font-light leading-snug mt-5 mb-8 max-w-xl">
              {aboutSettings.heroSubheading || defaultAboutSettings.heroSubheading}
            </p>

            <a
              href="#abt-section"
              className="inline-flex items-center gap-3 bg-[#108283] hover:bg-transparent text-white hover:text-[#108283] border border-[#108283] rounded-full px-7 py-4 text-[13px] font-medium transition-all duration-300 shadow-xl group"
            >
              <span>Where it all Began</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: OUR STORY (Welcome to Dr. Monali's Clinic)
          ========================================================================= */}
      <section id="abt-section" className="py-20 md:py-28 bg-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Image with Premium Elevation */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100/80">
                <img
                  src="/about-story.jpg"
                  alt="Dr. Monali's Homeopathy & Skin Clinic"
                  className="w-full h-auto object-cover rounded-2xl block"
                />
              </div>
            </div>

            {/* Right Column: Story Text */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <span className="inline-block bg-[#FAEDDA] text-[#333333] text-[13px] font-medium px-5 py-1.5 rounded-full uppercase tracking-wider">
                  OUR STORY
                </span>
              </div>

              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-[60px] lg:text-[64px] font-normal text-gray-900 leading-[1.08] tracking-[-0.02em]">
                {(aboutSettings.storyTitle || defaultAboutSettings.storyTitle).includes("Dr. Monali") ? (
                  <>
                    {(aboutSettings.storyTitle || defaultAboutSettings.storyTitle).split("Dr. Monali")[0]}
                    <span className="text-[#108283] italic font-extrabold block sm:inline">
                      Dr. Monali{(aboutSettings.storyTitle || defaultAboutSettings.storyTitle).split("Dr. Monali")[1]}
                    </span>
                  </>
                ) : (
                  aboutSettings.storyTitle || defaultAboutSettings.storyTitle
                )}
              </h2>

              <p className="font-['Playfair_Display'] text-lg sm:text-xl md:text-[22px] italic text-[#555555] leading-relaxed pt-1 font-normal">
                {aboutSettings.storyQuote || defaultAboutSettings.storyQuote}
              </p>

              <div className="space-y-4 font-['Source_Sans_3'] text-base md:text-[16px] text-gray-800 leading-[26px] font-light">
                {(aboutSettings.storyParagraphs && aboutSettings.storyParagraphs.length > 0
                  ? aboutSettings.storyParagraphs
                  : defaultAboutSettings.storyParagraphs
                ).map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="pt-2">
                <a
                  href="#services"
                  className="inline-flex items-center gap-3 bg-[#108283] hover:bg-[#0d6e6f] text-white border border-[#108283] rounded-full px-8 py-3.5 text-[14px] font-medium transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: APRICOT/ORANGE SLIM CONTINUOUS TREATMENT MARQUEE STRIP
          ========================================================================= */}
      <section className="w-full bg-[#F0A070] py-2.5 md:py-3 overflow-hidden select-none shadow-sm">
        <div className="flex w-max animate-marquee items-center">
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center">
              {marqueeItems.map((item, idx) => (
                <div key={idx} className="flex items-center mx-5 md:mx-7 gap-3 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />
                  <span className="font-['Playfair_Display'] text-base md:text-lg lg:text-[19px] font-normal text-white tracking-wide leading-none">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: OUR PHILOSOPHY & OUR PROMISE (Dead-Centered Model & Symmetrical Columns)
          ========================================================================= */}
      <section className="relative bg-white pt-20 md:pt-28 pb-0 overflow-hidden min-h-[620px] lg:min-h-[700px] flex items-center">
        
        {/* Dead-Centered Bottom-Anchored Cutout Model */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-0 flex justify-center items-end opacity-15 lg:opacity-100">
          <img
            src="/about-model.png"
            alt="Dr. Monali's Clinic Model"
            className="h-[420px] md:h-[540px] lg:h-[680px] xl:h-[720px] w-auto max-w-none object-contain block translate-y-1"
          />
        </div>

        {/* Foreground Content: Symmetrical Left & Right Text Columns */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
            
            {/* Left Column: OUR PHILOSOPHY */}
            <div className="w-full lg:w-[340px] xl:w-[360px] flex flex-col items-center text-center space-y-6">
              <div>
                <span className="inline-block bg-[#FAEDDA] text-[#333333] text-[13px] font-normal px-6 py-1.5 rounded-full uppercase tracking-wider">
                  OUR PHILOSOPHY
                </span>
              </div>
              <div className="space-y-5 text-[#7A7A7A] font-['Source_Sans_3'] text-[16px] md:text-[17px] font-light italic leading-[1.65] max-w-[340px]">
                <p>
                  &ldquo;We&apos;re not just skin specialists, we are partners in your wellness journey. Our team is deeply committed to guiding you through every step of your treatment, from the first consultation to the final result and beyond.
                </p>
                <p>
                  We take time to listen, explain, reassure, and follow up. Every patient receives personalized attention and clear information, because your confidence and comfort matter as much as the treatment itself.&rdquo;
                </p>
              </div>
            </div>

            {/* Spacer for Center Model on Desktop */}
            <div className="hidden lg:block lg:w-[500px] xl:w-[560px] shrink-0" aria-hidden="true" />

            {/* Right Column: OUR PROMISE */}
            <div className="w-full lg:w-[340px] xl:w-[360px] flex flex-col items-center text-center space-y-6">
              <div>
                <span className="inline-block bg-[#FAEDDA] text-[#333333] text-[13px] font-normal px-6 py-1.5 rounded-full uppercase tracking-wider">
                  OUR PROMISE
                </span>
              </div>
              <div className="space-y-5 text-[#7A7A7A] font-['Source_Sans_3'] text-[16px] md:text-[17px] font-light italic leading-[1.65] max-w-[340px]">
                <p>
                  &ldquo;We&apos;re continuously working to enhance your experience, update our techniques, and ensure that every visit puts a smile on your face, along with visible, lasting results.
                </p>
                <p>
                  Our clinic is more than just a skin care center it is a place where you are truly seen, heard, and cared for.&rdquo;
                </p>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 7: WHY US? / What Sets Us Apart
          ========================================================================= */}
      <section className="pt-24 pb-12 bg-[#FAEDDA] relative">
        <div className="max-w-[1140px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Image */}
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img
                  src="https://primederm.in/wp-content/uploads/2025/05/pexels-john-tekeridis-21837-14256897-2.png"
                  alt="Why Choose Dr. Monali's Clinic"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Right: Why Us Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <span className="inline-block bg-[#F0A070] text-black text-sm font-normal px-5 py-1.5 rounded-full uppercase">
                  WHY US?
                </span>
              </div>

              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-[72px] font-light text-black leading-[1.05]">
                What Sets{' '}
                <span className="text-[#108283] font-extrabold italic">
                  Us
                </span>{' '}
                Apart
              </h2>

              <ul className="space-y-4 font-['Source_Sans_3'] text-base md:text-[16px] text-black leading-[23.8px] font-normal">
                {(aboutSettings.whyUsItems && aboutSettings.whyUsItems.length > 0 
                  ? aboutSettings.whyUsItems 
                  : defaultAboutSettings.whyUsItems
                ).map((item, idx) => (
                  <li key={idx}>
                    <strong className="font-semibold text-black">{item.title}:</strong>{' '}
                    {item.desc}
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <p className="font-['Source_Sans_3'] text-[22px] font-medium italic text-black">
                  &ldquo;<span className="text-[#108283]">Healing</span> is not just about medicine it’s about kindness, presence, and care.&rdquo;
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: 4 BIG STATISTICS COUNTERS on #FAEDDA
          ========================================================================= */}
      <section className="pb-24 bg-[#FAEDDA]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-10 border-t border-[#F0DAAA]/50 text-center">
            
            {/* Counter 1 */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-['Playfair_Display'] text-base sm:text-lg md:text-[21px] font-normal italic text-[#4A4A4A] mb-3 md:mb-4 tracking-wide">
                Years of Experience
              </span>
              <span className="font-['Playfair_Display'] text-6xl sm:text-7xl md:text-8xl lg:text-[94px] font-normal italic text-[#108283] leading-none tracking-tight">
                <AnimatedCounter 
                  end={parseNumber(aboutSettings.stats.yearsExperience, 6)} 
                  suffix={parseSuffix(aboutSettings.stats.yearsExperience, '+')} 
                  duration={1.8} 
                />
              </span>
            </div>

            {/* Counter 2 */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-['Playfair_Display'] text-base sm:text-lg md:text-[21px] font-normal italic text-[#4A4A4A] mb-3 md:mb-4 tracking-wide">
                Treatments Performed
              </span>
              <span className="font-['Playfair_Display'] text-6xl sm:text-7xl md:text-8xl lg:text-[94px] font-normal italic text-[#108283] leading-none tracking-tight">
                <AnimatedCounter 
                  end={parseNumber(aboutSettings.stats.treatmentsPerformed, 5)} 
                  suffix={parseSuffix(aboutSettings.stats.treatmentsPerformed, 'k+')} 
                  duration={1.8} 
                />
              </span>
            </div>

            {/* Counter 3 */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-['Playfair_Display'] text-base sm:text-lg md:text-[21px] font-normal italic text-[#4A4A4A] mb-3 md:mb-4 tracking-wide">
                Client Satisfaction
              </span>
              <span className="font-['Playfair_Display'] text-6xl sm:text-7xl md:text-8xl lg:text-[94px] font-normal italic text-[#108283] leading-none tracking-tight">
                <AnimatedCounter 
                  end={parseNumber(aboutSettings.stats.clientSatisfaction, 98)} 
                  suffix={parseSuffix(aboutSettings.stats.clientSatisfaction, '%')} 
                  duration={2.2} 
                />
              </span>
            </div>

            {/* Counter 4 */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-['Playfair_Display'] text-base sm:text-lg md:text-[21px] font-normal italic text-[#4A4A4A] mb-3 md:mb-4 tracking-wide">
                Safe &amp; FDA Approved
              </span>
              <span className="font-['Playfair_Display'] text-6xl sm:text-7xl md:text-8xl lg:text-[94px] font-normal italic text-[#108283] leading-none tracking-tight">
                <AnimatedCounter 
                  end={parseNumber(aboutSettings.stats.safeFdaApproved, 100)} 
                  suffix={parseSuffix(aboutSettings.stats.safeFdaApproved, '%')} 
                  duration={2.2} 
                />
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: OUR SERVICES (Tailored Treatments, Trusted Care - 8 Cards Slider)
          ========================================================================= */}
      <section id="services" className="py-24 md:py-32 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block bg-[#FAEDDA] text-black text-sm font-normal px-5 py-1.5 rounded-full uppercase mb-4">
              OUR SERVICES
            </span>
            <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-[72px] font-light text-black leading-tight">
              Tailored Treatments,{' '}
              <span className="text-[#108283] font-extrabold italic">
                Trusted Care
              </span>
            </h2>
          </div>

          {/* Service Cards Slider */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.slice(currentServiceIdx, currentServiceIdx + 4).concat(
                services.slice(0, Math.max(0, currentServiceIdx + 4 - services.length))
              ).map((srv, idx) => (
                <div
                  key={idx}
                  className="relative min-h-[500px] rounded-[40px] overflow-hidden flex flex-col justify-end p-8 bg-cover bg-center group transition-all duration-500 shadow-md hover:shadow-2xl"
                  style={{ backgroundImage: `url(${srv.image})` }}
                >
                  {/* Overlay with Apricot Hover */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-[#F0A070]/60 transition-colors duration-500" />

                  {/* Content */}
                  <div className="relative z-10 space-y-3">
                    <h3 className="font-['Playfair_Display'] text-3xl md:text-[40px] font-normal text-white leading-[45.5px]">
                      {srv.title}
                    </h3>
                    <p className="font-['Source_Sans_3'] text-sm md:text-base text-white font-normal leading-[23.8px]">
                      {srv.desc}
                    </p>

                    <div className="pt-3">
                      <Link
                        href={srv.link}
                        className="w-14 h-14 rounded-full bg-[#C45656] text-white flex items-center justify-center shadow-lg"
                        aria-label={`View ${srv.title}`}
                      >
                        <ArrowRight className="w-6 h-6" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={prevService}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-[#108283] hover:text-white text-gray-700 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-sm font-medium text-gray-500">
                {currentServiceIdx + 1} / {services.length}
              </span>
              <button
                onClick={nextService}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-[#108283] hover:text-white text-gray-700 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Next service"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 10: ABOUT OUR PHYSICIANS (Dr. Monali & Dr. Sachin Subhedar)
          ========================================================================= */}
      <section id="abt" className="relative py-28 md:py-36 bg-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-[#FAEDDA] text-black text-xs md:text-sm font-medium px-5 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {aboutSettings.tagline || defaultAboutSettings.tagline}
            </span>
            <h2 className="font-['Playfair_Display'] text-[15px] xs:text-[18px] sm:text-[26px] md:text-[36px] lg:text-[46px] xl:text-[50px] font-light text-black leading-tight whitespace-nowrap tracking-tight">
              {(aboutSettings.heading || defaultAboutSettings.heading).includes('&') ? (
                <>
                  {(aboutSettings.heading || defaultAboutSettings.heading).split('&')[0]} &amp;{' '}
                  <span className="text-[#108283] font-extrabold italic">
                    {(aboutSettings.heading || defaultAboutSettings.heading).split('&')[1]}
                  </span>
                </>
              ) : (
                aboutSettings.heading || defaultAboutSettings.heading
              )}
            </h2>
            <p className="font-['Source_Sans_3'] text-gray-600 text-base md:text-lg font-light mt-3">
              {aboutSettings.subheading || defaultAboutSettings.subheading}
            </p>
          </div>

          {/* 3-Column Doctor Layout: Left Monali, Center Image, Right Sachin (Clean, unwrapped typography and image) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
            
            {/* Left Column: Dr. Monali Subhedar */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="inline-block bg-[#FAEDDA] text-[#108283] text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
                  {aboutSettings.doctor1.title}
                </div>
                <h3 className="font-['Playfair_Display'] font-bold text-gray-950 text-2xl md:text-[28px] leading-snug whitespace-nowrap">
                  {aboutSettings.doctor1.name}
                </h3>
                <p className="text-xs font-semibold text-[#108283] tracking-wide mt-1 mb-4 uppercase">
                  {aboutSettings.doctor1.degrees} • {aboutSettings.doctor1.regNo}
                </p>
                <p className="font-['Source_Sans_3'] text-gray-700 text-[16px] leading-[26px] font-light">
                  {aboutSettings.doctor1.bio}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-gray-100 font-['Source_Sans_3'] text-sm text-gray-800">
                {(aboutSettings.doctor1.highlights && aboutSettings.doctor1.highlights.length > 0
                  ? aboutSettings.doctor1.highlights
                  : defaultAboutSettings.doctor1.highlights
                ).map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Column: Joint Doctors Portrait (No wrapper, pure image) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <img
                src="/aboutdoc.png?v=latest"
                alt={`${aboutSettings.doctor1.name} & ${aboutSettings.doctor2.name}`}
                className="w-full max-w-[440px] h-auto object-contain block"
              />
              <div className="mt-4 inline-flex items-center gap-2 bg-white border border-gray-200/80 shadow-xs px-4 py-1.5 rounded-full text-xs font-medium text-gray-700">
                <Award className="w-4 h-4 text-[#108283]" />
                <span>Maharashtra Council {aboutSettings.councilRegistrationText || defaultAboutSettings.councilRegistrationText}</span>
              </div>
            </div>

            {/* Right Column: Dr. Sachin Subhedar */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="inline-block bg-[#FAEDDA] text-[#108283] text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
                  {aboutSettings.doctor2.title}
                </div>
                <h3 className="font-['Playfair_Display'] font-bold text-gray-950 text-2xl md:text-[28px] leading-snug whitespace-nowrap">
                  {aboutSettings.doctor2.name}
                </h3>
                <p className="text-xs font-semibold text-[#108283] tracking-wide mt-1 mb-4 uppercase">
                  {aboutSettings.doctor2.degrees} • {aboutSettings.doctor2.regNo}
                </p>
                <p className="font-['Source_Sans_3'] text-gray-700 text-[16px] leading-[26px] font-light">
                  {aboutSettings.doctor2.bio}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-gray-100 font-['Source_Sans_3'] text-sm text-gray-800">
                {(aboutSettings.doctor2.highlights && aboutSettings.doctor2.highlights.length > 0
                  ? aboutSettings.doctor2.highlights
                  : defaultAboutSettings.doctor2.highlights
                ).map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Accordion Tabs for Clinical Detail */}
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Tab 1: Areas of Expertise */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'expertise' ? null : 'expertise')}
                className="w-full p-4 flex items-center justify-between text-left font-bold text-gray-900 font-['Source_Sans_3'] text-base hover:text-[#108283] transition-colors cursor-pointer"
              >
                <span>Areas of Clinical Expertise</span>
                {activeAccordion === 'expertise' ? <ChevronUp className="w-5 h-5 text-[#108283]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {activeAccordion === 'expertise' && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-3">
                  <ul className="space-y-2 font-['Source_Sans_3'] text-sm text-gray-700 list-disc list-inside">
                    {(aboutSettings.expertiseList || defaultAboutSettings.expertiseList).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Tab 2: Educational Background & Credentials */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'credentials' ? null : 'credentials')}
                className="w-full p-4 flex items-center justify-between text-left font-bold text-gray-900 font-['Source_Sans_3'] text-base hover:text-[#108283] transition-colors cursor-pointer"
              >
                <span>Educational Background &amp; Credentials</span>
                {activeAccordion === 'credentials' ? <ChevronUp className="w-5 h-5 text-[#108283]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {activeAccordion === 'credentials' && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-3">
                  <ul className="space-y-2 font-['Source_Sans_3'] text-sm text-gray-700 list-disc list-inside">
                    {(aboutSettings.educationalDegreesList || defaultAboutSettings.educationalDegreesList).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Tab 3: Philosophy of Care */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'philosophy' ? null : 'philosophy')}
                className="w-full p-4 flex items-center justify-between text-left font-bold text-gray-900 font-['Source_Sans_3'] text-base hover:text-[#108283] transition-colors cursor-pointer"
              >
                <span>Our Philosophy of Holistic Care</span>
                {activeAccordion === 'philosophy' ? <ChevronUp className="w-5 h-5 text-[#108283]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {activeAccordion === 'philosophy' && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-3">
                  <ul className="space-y-2 font-['Source_Sans_3'] text-sm text-gray-700 list-disc list-inside">
                    <li>Patient-first, detail-oriented constitutional consultations</li>
                    <li>Root-cause healing targeting long-term health, not temporary quick fixes</li>
                    <li>Zero steroid dependency — gentle, natural, side-effect-free remedies</li>
                    <li>Focus on emotional well-being along with visible, lasting results</li>
                    <li>Regular follow-ups to ensure complete recovery and lasting satisfaction</li>
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Centered Book Button */}
          <div className="text-center pt-10">
            <Link
              href="/appointment"
              className="inline-flex items-center gap-3 bg-[#108283] hover:bg-[#0c6b6c] text-white border border-[#108283] rounded-full px-8 py-4 text-[14px] font-medium transition-all duration-300 shadow-md cursor-pointer"
            >
              <span>Book Consultation with Our Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 11: CALL TO ACTION BANNER (Rediscover Your Skin, Redefine Your Confidence)
          ========================================================================= */}
      <section className="py-20 md:py-24 bg-[#111111] text-white relative overflow-hidden">
        <div className="max-w-[960px] mx-auto px-5 md:px-8 text-center relative z-10">
          
          <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 text-[#108283]">
            CONFIDENCE STARTS WITH CARE
          </div>

          <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl font-normal leading-tight mb-6">
            Rediscover Your{' '}
            <span className="text-[#108283] font-extrabold italic">Skin</span>,{' '}
            Redefine Your{' '}
            <span className="text-[#108283] font-extrabold italic">Confidence</span>
          </h2>

          <p className="font-['Playfair_Display'] text-xl sm:text-2xl italic text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto">
            &ldquo;Dr. Monali&apos;s Homeopathy &amp; Cosmetology Clinic helps you rebuild what time, stress, or conditions took away. For every skin that’s struggled, for every strand that’s lost, trust our holistic care to restore with confidence.&rdquo;
          </p>

          <Link
            href="/appointment"
            className="inline-flex items-center gap-3 bg-[#108283] hover:bg-white text-white hover:text-[#108283] px-8 py-4 rounded-full font-medium text-sm transition-all duration-300 shadow-xl cursor-pointer"
          >
            <span>Book Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </section>

      {/* Global Elements */}
      <Footer />
      <ContactWidget />
    </main>
  );
}
