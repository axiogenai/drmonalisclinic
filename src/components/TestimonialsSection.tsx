'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';

interface TestimonialItem {
  id: string;
  name: string;
  tag: string;
  headline: string;
  concern: string;
  review: string;
  image: string;
  rating: number;
}

interface CardTheme {
  name: string;
  baseBg: string;
  overlayGradient: string;
  tagStyle: string;
  dividerColor: string;
}

// Soft, professional, clinical luxury themes (muted, elegant, medical-grade)
const CARD_THEMES: CardTheme[] = [
  // 0. Soft Forest Sage (Acne Recovery)
  {
    name: 'sage',
    baseBg: '#0A1C16',
    overlayGradient: 'from-[#0A1C16]/98 via-[#0A1C16]/75 to-transparent',
    tagStyle: 'text-[#A2C7B8] bg-[#162721] border border-[#2B4036]',
    dividerColor: 'border-[#2B4036]/50',
  },
  // 1. Soft Slate Navy (Allergic Dermatitis)
  {
    name: 'navy',
    baseBg: '#0C1624',
    overlayGradient: 'from-[#0C1624]/98 via-[#0C1624]/75 to-transparent',
    tagStyle: 'text-[#9EB5D6] bg-[#172333] border border-[#2A3C52]',
    dividerColor: 'border-[#2A3C52]/50',
  },
  // 2. Warm Sand Espresso (Skin Restoration)
  {
    name: 'espresso',
    baseBg: '#1E1610',
    overlayGradient: 'from-[#1E1610]/98 via-[#1E1610]/75 to-transparent',
    tagStyle: 'text-[#D4BA9F] bg-[#2A1F17] border border-[#443327]',
    dividerColor: 'border-[#443327]/50',
  },
  // 3. Soft Plum Charcoal (Trichology & Scalp)
  {
    name: 'plum',
    baseBg: '#1B121D',
    overlayGradient: 'from-[#1B121D]/98 via-[#1B121D]/75 to-transparent',
    tagStyle: 'text-[#C4AEC7] bg-[#261A29] border border-[#3E2D42]',
    dividerColor: 'border-[#3E2D42]/50',
  },
  // 4. Muted Bronze Olive (Hair Regrowth)
  {
    name: 'olive',
    baseBg: '#1A170F',
    overlayGradient: 'from-[#1A170F]/98 via-[#1A170F]/75 to-transparent',
    tagStyle: 'text-[#D6C59E] bg-[#262115] border border-[#3E3725]',
    dividerColor: 'border-[#3E3725]/50',
  },
  // 5. Soft Dusty Rose (Holistic Wellness)
  {
    name: 'rose',
    baseBg: '#1E1215',
    overlayGradient: 'from-[#1E1215]/98 via-[#1E1215]/75 to-transparent',
    tagStyle: 'text-[#CEABB1] bg-[#2B1B1F] border border-[#422C32]',
    dividerColor: 'border-[#422C32]/50',
  },
  // 6. Muted Steel Teal (Stress Relief)
  {
    name: 'teal',
    baseBg: '#0C191E',
    overlayGradient: 'from-[#0C191E]/98 via-[#0C191E]/75 to-transparent',
    tagStyle: 'text-[#98BAC4] bg-[#16252C] border border-[#263D47]',
    dividerColor: 'border-[#263D47]/50',
  },
  // 7. Soft Viridian Spruce (Eczema Management)
  {
    name: 'spruce',
    baseBg: '#0E1C15',
    overlayGradient: 'from-[#0E1C15]/98 via-[#0E1C15]/75 to-transparent',
    tagStyle: 'text-[#9BCAB7] bg-[#17271F] border border-[#273F33]',
    dividerColor: 'border-[#273F33]/50',
  },
  // 8. Roasted Mocha (Vitality & Aging)
  {
    name: 'mocha',
    baseBg: '#1C1612',
    overlayGradient: 'from-[#1C1612]/98 via-[#1C1612]/75 to-transparent',
    tagStyle: 'text-[#D1BEAF] bg-[#271E1A] border border-[#3F332C]',
    dividerColor: 'border-[#3F332C]/50',
  },
];

const fallbackTestimonials: TestimonialItem[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    tag: 'ACNE RECOVERY',
    headline: 'Priya Sharma',
    concern: 'Chronic Acne & Skin Health',
    review:
      'Dr. Monali took time to explain my treatment plan and constitutional remedy. My skin has never looked clearer and healthier!',
    image: '/services/anti-acne.png',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ravi Kulkarni',
    tag: 'ALLERGIC DERMATITIS',
    headline: 'Ravi Kulkarni',
    concern: 'Allergies & Flare-ups',
    review:
      "After struggling with acne and skin allergies for years, I finally found lasting relief at Dr. Monali's clinic. The holistic homeopathic results exceeded my expectations!",
    image: '/services/General Homeopathy Skin Care Treatment.jpg',
    rating: 5,
  },
  {
    id: '3',
    name: 'Sneha Patil',
    tag: 'SKIN RESTORATION',
    headline: 'Sneha Patil',
    concern: 'Hyperpigmentation & Melasma',
    review:
      'The consultation was very detailed. My stubborn pigmentation has significantly reduced without any harsh chemicals or side effects.',
    image: '/services/medifacial.png',
    rating: 5,
  },
  {
    id: '4',
    name: 'Anil Shinde',
    tag: 'TRICHOLOGY & SCALP',
    headline: 'Anil Shinde',
    concern: 'Hair Fall & Scalp Health',
    review:
      'Best clinical experience I’ve had. Attentive care and Dr. Sachin truly understands root causes. My persistent hair fall stopped in weeks!',
    image: '/services/hair-care.png',
    rating: 5,
  },
  {
    id: '5',
    name: 'Kavitha Pawar',
    tag: 'HAIR REGROWTH',
    headline: 'Kavitha Pawar',
    concern: 'Hair Thinning & Density',
    review:
      'I came in for hair thinning and the density improvement has been remarkable. Dr. Monali’s gentle medicines and patience are commendable.',
    image: '/products/scalp-hair-oil.jpg',
    rating: 5,
  },
  {
    id: '6',
    name: 'Divya Thakur',
    tag: 'HOLISTIC WELLNESS',
    headline: 'Divya Thakur',
    concern: 'Skin Balance & Vitality',
    review:
      'The holistic remedies I got here were amazing. My skin feels naturally balanced and glowing from within. Truly wonderful care!',
    image: '/services/homeopathy-specialization.png',
    rating: 5,
  },
  {
    id: '7',
    name: 'Rahul Mane',
    tag: 'STRESS RELIEF',
    headline: 'Rahul Mane',
    concern: 'Dark Circles & Breakouts',
    review:
      'Dr. Monali is the most patient physician I’ve consulted. She explained everything clearly and my recurring stress breakouts have vanished.',
    image: '/about-story.jpg',
    rating: 5,
  },
  {
    id: '8',
    name: 'Meera Lad',
    tag: 'ECZEMA MANAGEMENT',
    headline: 'Meera Lad',
    concern: 'Chronic Skin Flare-ups',
    review:
      'Dr. Sachin’s individualized homeopathic remedies addressed my chronic skin flare-ups gently and effectively. Very impressed!',
    image: '/services/eczema.jpg',
    rating: 5,
  },
  {
    id: '9',
    name: 'Suresh Bhosale',
    tag: 'VITALITY & AGING',
    headline: 'Suresh Bhosale',
    concern: 'Melasma & Vitality',
    review:
      'From consultation to treatment, everything was seamless. Dr. Monali’s approach is holistic yet scientific. My overall vitality speaks for itself!',
    image: '/services/anti-aging.png',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const { testimonials: contextTestimonials } = useAdminData();

  const testimonials: TestimonialItem[] =
    contextTestimonials && contextTestimonials.length > 0
      ? contextTestimonials.map((item, index) => {
          const fallback = fallbackTestimonials[index % fallbackTestimonials.length];
          return {
            id: item.id || String(index + 1),
            name: item.name,
            tag: (item as any).tag || fallback.tag,
            headline: (item as any).headline || fallback.headline || item.name,
            concern: item.concern || fallback.concern,
            review: item.review,
            image: (item as any).image || fallback.image,
            rating: (item as any).rating || 5,
          };
        })
      : fallbackTestimonials;

  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Track window resize for responsive calculations
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = testimonials.length;

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Always continuously auto-rotating every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 3500);
    return () => clearInterval(interval);
  }, [next]);

  // Touch swipe support for mobile devices with directional gesture filtering
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && touchStartYRef.current !== null) {
      const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
      const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
      // Only trigger if horizontal movement exceeds vertical movement (user intended horizontal swipe)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX > 0) {
          next();
        } else {
          prev();
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Track previous position diffs and wrap-around keys to eliminate the left-to-right swipe animation
  const prevDiffsRef = useRef<Record<string, number>>({});
  const wrapKeysRef = useRef<Record<string, number>>({});

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1280;

  // Fluid responsive card dimensions
  const cardWidth = isMobile
    ? Math.min(285, Math.round(windowWidth * 0.76))
    : isTablet
    ? 290
    : 320;
  const cardHeight = isMobile
    ? Math.round(cardWidth * 1.34)
    : isTablet
    ? 425
    : 465;
  const stageHeight = cardHeight + (isMobile ? 24 : 30);

  // Mathematically calculated horizontal spreads so side cards NEVER get cut off:
  // On desktop (>= 1280px): 5 cards visible. Outer cards have guaranteed margin inside viewport edge.
  // On tablet/small laptop (< 1280px): 3 cards visible. Flanking cards sit cleanly with side clearance.
  // On mobile (< 640px): 1 prominent center card with flanking cards peeking in symmetrically by ~45px.
  const maxDesktopReach = (windowWidth / 2) - ((cardWidth * 0.76) / 2) - 68;
  const step2 = isDesktop ? Math.min(520, Math.max(380, Math.round(maxDesktopReach))) : 0;
  const step1 = isDesktop
    ? Math.round(step2 * 0.54)
    : isTablet
    ? Math.min(300, Math.max(220, Math.round((windowWidth / 2) - ((cardWidth * 0.88) / 2) - 24)))
    : Math.round(cardWidth * 0.88 + 14);
  const step3 = isDesktop
    ? step2 + Math.round(cardWidth * 0.76)
    : step1 + Math.round(cardWidth * 0.88);

  // Unified, ultra-smooth cubic-bezier transition applied to ALL cards simultaneously
  const CARD_TRANSITION =
    'transform 550ms cubic-bezier(0.22, 1, 0.36, 1), opacity 550ms ease, box-shadow 550ms ease, filter 550ms ease';

  // Compute card layout and transitions:
  // When a card wraps around from left to right, we hide its transform swipe animation (opacity/filter fade only).
  // All other cards glide smoothly with identical 550ms cubic-bezier animations.
  const getCardStyle = (index: number, isWrapping: boolean) => {
    let diff = index - activeIndex;

    // Circular wrap-around calculation
    while (diff > total / 2) diff -= total;
    while (diff < -total / 2) diff += total;

    // Suppress left-to-right transform swipe on wrap-around
    const transition = isWrapping
      ? 'opacity 450ms ease, filter 450ms ease'
      : CARD_TRANSITION;

    if (diff === 0) {
      // CENTER ACTIVE CARD: Prominent, upright, full scale with smooth transform
      return {
        transform: 'translate3d(0px, 0px, 40px) scale(1)',
        zIndex: 35,
        opacity: 1,
        filter: 'brightness(1)',
        boxShadow: '0 20px 45px -12px rgba(35, 28, 20, 0.22), 0 4px 12px -2px rgba(35, 28, 20, 0.08)',
        pointerEvents: 'auto' as const,
        cursor: 'default',
        transition,
      };
    } else if (diff === -1) {
      // FLANKING LEFT CARD: Preview card with smooth transform
      return {
        transform: `translate3d(-${step1}px, 0px, 0px) scale(${isMobile ? 0.86 : 0.88})`,
        zIndex: 25,
        opacity: isMobile ? 0.65 : 0.9,
        filter: isMobile ? 'brightness(0.88)' : 'brightness(0.93)',
        boxShadow: '0 10px 25px -8px rgba(35, 28, 20, 0.12)',
        pointerEvents: 'auto' as const,
        cursor: 'pointer',
        transition,
      };
    } else if (diff === 1) {
      // FLANKING RIGHT CARD: Preview card with smooth transform
      return {
        transform: `translate3d(${step1}px, 0px, 0px) scale(${isMobile ? 0.86 : 0.88})`,
        zIndex: 25,
        opacity: isMobile ? 0.65 : 0.9,
        filter: isMobile ? 'brightness(0.88)' : 'brightness(0.93)',
        boxShadow: '0 10px 25px -8px rgba(35, 28, 20, 0.12)',
        pointerEvents: 'auto' as const,
        cursor: 'pointer',
        transition,
      };
    } else if (Math.abs(diff) === 2 && !isDesktop) {
      // MOBILE & TABLET OFFSTAGE EXIT / ENTER:
      // Smoothly glides offscreen while fading out to 0, or glides in from 0!
      const dir = diff > 0 ? 1 : -1;
      return {
        transform: `translate3d(${dir * step3}px, 0px, -30px) scale(0.72)`,
        zIndex: 5,
        opacity: 0,
        filter: 'brightness(0.8)',
        boxShadow: 'none',
        pointerEvents: 'none' as const,
        cursor: 'default',
        transition,
      };
    } else if (diff === -2 && isDesktop) {
      // LAST CARD (OUTER LEFT EDGE): Smooth transform or suppressed on wrap
      return {
        transform: `translate3d(-${step2}px, 0px, -20px) scale(0.76)`,
        zIndex: 15,
        opacity: 0.72,
        filter: 'brightness(0.86)',
        boxShadow: '0 6px 18px -6px rgba(35, 28, 20, 0.1)',
        pointerEvents: 'auto' as const,
        cursor: 'pointer',
        transition,
      };
    } else if (diff === 2 && isDesktop) {
      // LAST CARD (OUTER RIGHT EDGE): Smooth transform or suppressed on wrap
      return {
        transform: `translate3d(${step2}px, 0px, -20px) scale(0.76)`,
        zIndex: 15,
        opacity: 0.72,
        filter: 'brightness(0.86)',
        boxShadow: '0 6px 18px -6px rgba(35, 28, 20, 0.1)',
        pointerEvents: 'auto' as const,
        cursor: 'pointer',
        transition,
      };
    } else if (diff === -3 && isDesktop) {
      // OFFSTAGE LEFT: Smooth glide exit
      return {
        transform: `translate3d(-${step3}px, 0px, -40px) scale(0.65)`,
        zIndex: 5,
        opacity: 0,
        filter: 'brightness(0.8)',
        boxShadow: 'none',
        pointerEvents: 'none' as const,
        cursor: 'default',
        transition,
      };
    } else if (diff === 3 && isDesktop) {
      // OFFSTAGE RIGHT: Smooth glide entrance
      return {
        transform: `translate3d(${step3}px, 0px, -40px) scale(0.65)`,
        zIndex: 5,
        opacity: 0,
        filter: 'brightness(0.8)',
        boxShadow: 'none',
        pointerEvents: 'none' as const,
        cursor: 'default',
        transition,
      };
    } else {
      // Beyond offstage: unmount from DOM so circular wrap-around never flies across
      return null;
    }
  };

  return (
    <section id="testimonials" className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-[#FAF5EC] via-[#FDFBF7] to-[#F5EEE2] relative overflow-hidden w-full scroll-mt-20 md:scroll-mt-24">
      <div id="patient-stories" className="absolute -top-24 pointer-events-none" />
      <div id="stories" className="absolute -top-24 pointer-events-none" />
      {/* Subtle Warm Backdrop Depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[1000px] h-[350px] bg-gradient-to-r from-[#EFE5D8]/40 via-[#FAF0DD]/50 to-[#EFE5D8]/40 blur-[130px] rounded-full pointer-events-none" />

      {/* Stylish Architectural Curved Divider at Top */}
      <div className="absolute top-0 inset-x-0 overflow-hidden leading-none z-20 pointer-events-none -mt-[1px]">
        <svg
          className="relative block w-full h-6 sm:h-8 md:h-10 text-white fill-current"
          viewBox="0 0 1440 50"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C480,40 960,40 1440,0 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {/* Stylish Architectural Curved Divider at Bottom */}
      <div className="absolute bottom-0 inset-x-0 overflow-hidden leading-none z-20 pointer-events-none -mb-[1px]">
        <svg
          className="relative block w-full h-6 sm:h-8 md:h-10 text-white fill-current rotate-180"
          viewBox="0 0 1440 50"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C480,40 960,40 1440,0 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 px-4">
          <div className="inline-flex items-center gap-1.5 bg-[#FAEDDA] text-[#108283] border border-[#108283]/20 text-[11px] sm:text-xs font-['Source_Sans_3'] font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider shadow-xs">
            PATIENT STORIES & EXPERIENCES
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-[34px] text-gray-950 font-normal leading-snug mb-1.5">
            What Our <span className="text-[#108283] font-bold italic">Patients</span> Say
          </h2>
          <p className="font-['Source_Sans_3'] text-xs sm:text-[13.5px] text-gray-600 font-light max-w-md mx-auto">
            Real stories of transformation and gentle healing through personalized homeopathic care.
          </p>
        </div>

        {/* Carousel Stage - Full Width Bleed */}
        <div className="relative w-full overflow-hidden">
          {/* Floating Navigation Arrows (Desktop: >= 1280px with clear margin, NEVER overlapping cards) */}
          <button
            type="button"
            onClick={prev}
            className="hidden xl:flex absolute left-4 2xl:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 text-gray-800 backdrop-blur-xl border border-[#D8C7B0] items-center justify-center transition-all shadow-[0_4px_16px_rgba(35,28,20,0.12)] active:scale-95 cursor-pointer group"
            aria-label="Previous Story"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={next}
            className="hidden xl:flex absolute right-4 2xl:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 text-gray-800 backdrop-blur-xl border border-[#D8C7B0] items-center justify-center transition-all shadow-[0_4px_16px_rgba(35,28,20,0.12)] active:scale-95 cursor-pointer group"
            aria-label="Next Story"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Carousel Cards Container */}
          <div
            className="relative w-full flex items-center justify-center select-none overflow-visible touch-pan-y"
            style={{
              height: `${stageHeight}px`,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((t, i) => {
              let diff = i - activeIndex;
              while (diff > total / 2) diff -= total;
              while (diff < -total / 2) diff += total;

              const prevDiff = prevDiffsRef.current[t.id];
              // Detect when this card wrapped from the left side to the right side
              const isWrapping =
                prevDiff !== undefined && (
                  (prevDiff < 0 && diff > 0) ||
                  Math.abs(diff - prevDiff) > 1.5
                );

              if (isWrapping) {
                wrapKeysRef.current[t.id] = (wrapKeysRef.current[t.id] || 0) + 1;
              }
              prevDiffsRef.current[t.id] = diff;

              const cardStyle = getCardStyle(i, isWrapping);

              // Off-stage cards return null and are completely unmounted!
              // This guarantees cards NEVER fly across the screen during wrap-around rotation.
              if (!cardStyle) return null;

              const theme = CARD_THEMES[i % CARD_THEMES.length];
              const isCenter = diff === 0;

              return (
                <div
                  key={`${t.id}-${wrapKeysRef.current[t.id] || 0}`}
                  onClick={() => {
                    if (!isCenter) setActiveIndex(i);
                  }}
                  className={`absolute rounded-[20px] sm:rounded-[26px] overflow-hidden select-none touch-manipulation ${
                    isCenter
                      ? 'border-2 border-[#D8C7B0]'
                      : 'border border-[#EADBCE]/85 hover:border-[#D8C7B0]'
                  }`}
                  style={{
                    backgroundColor: theme.baseBg,
                    left: '50%',
                    top: '50%',
                    marginLeft: `-${cardWidth / 2}px`,
                    marginTop: `-${cardHeight / 2}px`,
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    ...cardStyle,
                  }}
                >
                  {/* Background Image with Fallback */}
                  <img
                    src={t.image}
                    alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/about-story.jpg';
                    }}
                  />

                  {/* Soft & Professional Clinic Backdrop Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${theme.overlayGradient} pointer-events-none`} />

                  {/* Card Content at Bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 flex flex-col justify-end text-left z-10 pointer-events-none">
                    {/* Soft, Professional Category Tag Pill */}
                    <div className="mb-1 sm:mb-1.5 flex items-center">
                      <span className={`inline-flex items-center text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] uppercase font-['Source_Sans_3'] px-2 py-0.5 rounded-md shadow-2xs ${theme.tagStyle}`}>
                        {t.tag}
                      </span>
                    </div>

                    {/* Patient Headline / Name */}
                    <h3 className="font-['Playfair_Display'] text-base sm:text-xl font-bold text-white tracking-tight leading-snug mb-0.5 sm:mb-1 drop-shadow-xs">
                      {t.headline}
                    </h3>

                    {/* Patient Review Quote */}
                    <p className="font-['Source_Sans_3'] text-[11px] sm:text-xs text-gray-200/95 font-light leading-relaxed mb-2 sm:mb-2.5 line-clamp-2">
                      "{t.review}"
                    </p>

                    {/* Patient Details & Verified Badge */}
                    <div className={`flex items-center justify-between pt-1.5 sm:pt-2 border-t ${theme.dividerColor}`}>
                      {/* Soft Warm Gold Stars */}
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, starI) => (
                          <Star key={starI} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#E2B887] text-[#E2B887]" />
                        ))}
                      </div>

                      {/* Clean Minimalist Inline Verified Indicator */}
                      <div className="flex items-center gap-1.5 text-[11px] font-['Source_Sans_3'] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-gray-200 tracking-wide">Verified Patient</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Pagination & Navigation Controls */}
        <div className="flex items-center justify-center gap-3 mt-4 sm:mt-5 px-4">
          {/* Left Chevron */}
          <button
            type="button"
            onClick={prev}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white text-gray-700 flex items-center justify-center transition-all border border-[#D8C7B0] shadow-2xs cursor-pointer active:scale-95 touch-manipulation"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* Dots Pagination - matching warm sand palette */}
          <div className="flex items-center gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="transition-all duration-300 rounded-full cursor-pointer"
                style={{
                  width: activeIndex === i ? '24px' : '6px',
                  height: '6px',
                  backgroundColor: activeIndex === i ? '#C7AA87' : '#E5DCD0',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Right Chevron */}
          <button
            type="button"
            onClick={next}
            className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center transition-all border border-[#D8C7B0] shadow-2xs cursor-pointer active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
