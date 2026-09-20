'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import { ArrowRight, X, Clock, Calendar, ShieldCheck, Check, Leaf, Droplets, Scissors, Syringe, Zap, Heart } from 'lucide-react';

interface Service {
  title: string;
  category: 'skin' | 'hair' | 'body' | 'surgery' | 'wellness';
  tagline: string;
  description: string;
  image: string;
  imagePosition?: string;
  cardBg: string;
  accent: string;
  iconColor: string;
  technology: string;
  downtime: string;
  sessions: string;
  highlights: string[];
  badge?: string;
}

const SERVICES: Service[] = [
  {
    title: 'Kidney Stone & Piles Treatment',
    category: 'wellness',
    tagline: 'Relief • Healing • Health',
    description: 'Effective homeopathic remedies for kidney stones and piles, ensuring non-invasive recovery.',
    image: '/services/kidney-stones.jpg',
    imagePosition: 'object-center',
    cardBg: '#064e3b',
    accent: 'from-[#064e3b]/95 via-[#10b981]/50 to-transparent',
    iconColor: '#10b981',
    technology: 'Advanced Homeopathic Therapeutics',
    downtime: 'Zero Downtime',
    sessions: 'Consultation & Follow-up',
    highlights: ['Non-surgical approach', 'Root cause treatment', 'Safe & natural', 'Long-lasting relief'],
  },
  {
    title: 'Height Growth Therapy',
    category: 'wellness',
    tagline: 'Grow • Develop • Thrive',
    description: 'Safe and natural homeopathic treatments to stimulate natural height growth during developmental years.',
    image: '/services/height-increase.png',
    imagePosition: 'object-top sm:object-[center_10%]',
    cardBg: '#0e4a5a',
    accent: 'from-[#0e4a5a]/95 via-[#14b8a6]/50 to-transparent',
    iconColor: '#14b8a6',
    technology: 'Constitutional Homeopathy',
    downtime: 'Zero Downtime',
    sessions: 'Regular Monitoring',
    highlights: ['Natural growth stimulation', 'No hormonal side-effects', 'Improves overall health', 'Personalised remedies'],
  },
  {
    title: 'Weight Management (Loss & Gain)',
    category: 'body',
    tagline: 'Balance • Shape • Wellness',
    description: 'Comprehensive homeopathic weight management protocols for healthy and sustainable loss or gain.',
    image: '/services/female-weight-loss.png',
    imagePosition: 'object-top sm:object-[center_18%]',
    cardBg: '#1e3a8a',
    accent: 'from-[#1e3a8a]/95 via-[#3b82f6]/50 to-transparent',
    iconColor: '#3b82f6',
    technology: 'Metabolic Balancing Homeopathy',
    downtime: 'Zero Downtime',
    sessions: 'Monthly Consultation',
    highlights: ['Metabolism improvement', 'No crash diets', 'Sustainable results', 'Healthy body mass'],
  },
  {
    title: 'Skin Diseases & Psoriasis',
    category: 'skin',
    tagline: 'Diagnose • Treat • Heal',
    description: 'Root-cause homeopathic treatments for eczema, psoriasis, vitiligo, and chronic skin conditions.',
    image: '/services/psoriasis.jpg',
    imagePosition: 'object-center',
    cardBg: '#0c4a6e',
    accent: 'from-[#0c4a6e]/95 via-[#0ea5e9]/50 to-transparent',
    iconColor: '#0ea5e9',
    technology: 'Holistic Dermatological Homeopathy',
    downtime: 'Zero Downtime',
    sessions: 'Consultation & Follow-up',
    highlights: ['Addresses root cause', 'Prevents recurrence', 'Safe for long-term use', 'Improves immunity'],
  },
  {
    title: 'PCOD Treatment',
    category: 'wellness',
    tagline: 'Regulate • Restore • Balance',
    description: 'Natural and effective management of PCOD and hormonal imbalances through constitutional homeopathy.',
    image: '/services/pcod.png',
    imagePosition: 'object-center sm:object-[center_20%]',
    cardBg: '#701a75',
    accent: 'from-[#701a75]/95 via-[#d946ef]/50 to-transparent',
    iconColor: '#d946ef',
    technology: 'Hormonal Balancing Remedies',
    downtime: 'Zero Downtime',
    sessions: 'Monthly Consultation',
    highlights: ['Regulates menstrual cycle', 'Reduces cystic tendency', 'Improves fertility', 'Manages weight'],
  },
  {
    title: 'Medi Facial & Chemical Peel',
    category: 'skin',
    tagline: 'Renew • Refine • Glow',
    description: 'Advanced medi facials and chemical peels for instant brightening, exfoliation, and skin rejuvenation.',
    image: '/services/medifacial.png',
    imagePosition: 'object-center sm:object-[center_20%]',
    cardBg: '#78350f',
    accent: 'from-[#78350f]/95 via-[#f59e0b]/50 to-transparent',
    iconColor: '#f59e0b',
    technology: 'Medical-grade peels & Exfoliation',
    downtime: '0 - 24 Hours',
    sessions: '3 - 5 Sessions',
    highlights: ['Instant radiance', 'Improves skin texture', 'Removes dead skin', 'Deep cleansing'],
    badge: 'Most Popular',
  },
  {
    title: 'Anti-Acne & Anti-Aging Treatment',
    category: 'skin',
    tagline: 'Clear • Youthful • Radiant',
    description: 'Targeted solutions to clear active acne, reduce scars, and combat signs of aging for a youthful glow.',
    image: '/services/anti-acne.png',
    imagePosition: 'object-center sm:object-[center_20%]',
    cardBg: '#115e59',
    accent: 'from-[#115e59]/95 via-[#2dd4bf]/50 to-transparent',
    iconColor: '#2dd4bf',
    technology: 'Advanced Cosmetological Protocols',
    downtime: 'Minimal',
    sessions: '4 - 6 Sessions',
    highlights: ['Clears acne breakouts', 'Reduces fine lines', 'Boosts collagen', 'Fades acne marks'],
  },
  {
    title: 'Pigmentation Treatment & Mole/Wart Removal',
    category: 'surgery',
    tagline: 'Precise • Safe • Flawless',
    description: 'Expert procedures for pigmentation correction and safe removal of moles, warts, and skin tags.',
    image: '/services/pigmentation.png',
    imagePosition: 'object-center sm:object-[center_25%]',
    cardBg: '#4c1d95',
    accent: 'from-[#4c1d95]/95 via-[#8b5cf6]/50 to-transparent',
    iconColor: '#8b5cf6',
    technology: 'Radiofrequency ablation & Depigmentation',
    downtime: '2 - 5 Days',
    sessions: '1 - 3 Sessions',
    highlights: ['Safe mole/wart removal', 'Evens skin tone', 'Minimal scarring', 'Quick recovery'],
  },
  {
    title: 'Hair PRP & Skin PRP',
    category: 'hair',
    tagline: 'Revive • Stimulate • Regrow',
    description: 'Platelet-Rich Plasma (PRP) therapy to naturally stimulate hair growth and rejuvenate facial skin.',
    image: '/services/hair-prp.png',
    imagePosition: 'object-top sm:object-[center_15%]',
    cardBg: '#7c2d12',
    accent: 'from-[#7c2d12]/95 via-[#ea580c]/50 to-transparent',
    iconColor: '#ea580c',
    technology: 'Autologous PRP Therapy',
    downtime: '12 - 24 Hours',
    sessions: '4 - 6 Sessions',
    highlights: ['Stimulates hair follicles', 'Improves hair density', 'Boosts skin collagen', 'Natural rejuvenation'],
  },
  {
    title: 'Mesotherapy & Microneedling',
    category: 'skin',
    tagline: 'Infuse • Repair • Rejuvenate',
    description: 'Advanced microneedling and mesotherapy to infuse vital nutrients and repair skin structure.',
    image: '/services/microneedling.png',
    imagePosition: 'object-top sm:object-[center_12%]',
    cardBg: '#881337',
    accent: 'from-[#881337]/95 via-[#f43f5e]/50 to-transparent',
    iconColor: '#f43f5e',
    technology: 'Microneedling & Vitamin Infusion',
    downtime: '1 - 2 Days',
    sessions: '3 - 6 Sessions',
    highlights: ['Improves acne scars', 'Deep nutrient infusion', 'Skin tightening', 'Enhances skin texture'],
  },
];

const CATS = [
  { key: 'all', label: 'All Treatments' },
  { key: 'wellness', label: 'Homeopathy' },
  { key: 'skin', label: 'Skin & Cosmetic' },
  { key: 'hair', label: 'Hair Care' },
  { key: 'body', label: 'Body & Wellness' },
] as const;

function CategoryIcon({ cat }: { cat: Service['category'] }) {
  const cls = 'w-5 h-5';
  if (cat === 'skin') return <Leaf className={cls} />;
  if (cat === 'hair') return <Droplets className={cls} />;
  if (cat === 'body') return <Zap className={cls} />;
  if (cat === 'surgery') return <Scissors className={cls} />;
  if (cat === 'wellness') return <Syringe className={cls} />;
  return <Heart className={cls} />;
}


const clampVal = (t: number, n: number, s: number) => Math.min(Math.max(t, n), s);
const stepF = 0.5;

const desktopConfig = {
  peek: 0.05,
  scaleStep: 0.028,
  exitShrink: 0.05,
  maxDepth: 2,
};

const mobileConfig = {
  peek: 0.038,
  scaleStep: 0,
  exitShrink: 0,
  maxDepth: 1,
};

const exitDistanceH = 1.45; 

const calcShiftS = (t: number, n: number) => clampVal((t - n) / stepF, 0, 1);

const calcElevationE = (t: number, n: number, s: number) => {
  const r = n - Math.max(t, 0);
  if (r <= 0) return 0;
  const i = Math.floor(r);
  const m = r - i;
  return Math.min(i + clampVal((m - (1 - stepF)) / stepF, 0, 1), s);
};

const calcOpacityU = (t: number, n: number, s: number) => clampVal(s + 1 - (n - Math.max(t, 0)), 0, 1);

const generateSafeKeyframes = (
  t: number,
  n: number,
  cfg: typeof desktopConfig
) => {
  const { peek: r, scaleStep: i, exitShrink: m, maxDepth: l } = cfg;
  
  const points: { p: number; y: string; scale: number; opacity: number }[] = [];
  const count = 30; // 30 samples is plenty — fewer = less interpolation work per frame
  for (let step = 0; step <= count; step++) {
    const p = step / count;
    const a = p * Math.max(n - 1, 1);
    const yVal = `${((calcElevationE(a, t, l) * r - calcShiftS(a, t) * exitDistanceH) * 100).toFixed(3)}%`;
    const scaleVal = Number((1 - calcElevationE(a, t, l) * i - calcShiftS(a, t) * m).toFixed(4));
    const opacityVal = Number(calcOpacityU(a, t, l).toFixed(4));
    points.push({ p, y: yVal, scale: scaleVal, opacity: opacityVal });
  }

  const filtered = [points[0]];
  for (let idx = 1; idx < points.length - 1; idx++) {
    const prev = filtered[filtered.length - 1];
    const curr = points[idx];
    const next = points[idx + 1];
    if (
      curr.y !== prev.y || curr.scale !== prev.scale || curr.opacity !== prev.opacity ||
      curr.y !== next.y || curr.scale !== next.scale || curr.opacity !== next.opacity
    ) {
      filtered.push(curr);
    }
  }
  filtered.push(points[points.length - 1]);

  return {
    progress: filtered.map((pt) => pt.p),
    y: filtered.map((pt) => pt.y),
    scale: filtered.map((pt) => pt.scale),
    opacity: filtered.map((pt) => pt.opacity),
  };
};

const DeckCardItem = React.memo(function DeckCardItem({
  service,
  index,
  total,
  progress,
  keyframes,
  active,
  onClick,
}: {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
  keyframes: ReturnType<typeof generateSafeKeyframes>;
  active: boolean;
  onClick: () => void;
}) {
  const y = useTransform(progress, keyframes.progress, keyframes.y);
  const scale = useTransform(progress, keyframes.progress, keyframes.scale);
  const opacity = useTransform(progress, keyframes.progress, keyframes.opacity);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8 py-[80px] md:py-[100px]"
      style={{ zIndex: total - index }}
    >
      <motion.div
        onClick={onClick}
        className="group relative w-full max-w-[1060px] rounded-[28px] sm:rounded-[32px] overflow-hidden cursor-pointer shadow-[0_24px_65px_rgba(0,0,0,0.3)] border border-white/20 min-h-[460px] md:h-[520px] flex flex-col justify-between p-5 sm:p-7 md:p-10"
        style={{ 
          y, 
          scale, 
          opacity, 
          pointerEvents: active ? 'auto' : 'none',
          backgroundColor: service.cardBg,
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
        }}
      >
        {/* Right-Side Dedicated Image Frame with Proper Proportions */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-[58%] lg:w-[54%] overflow-hidden pointer-events-none">
          <img
            src={service.image}
            alt={service.title}
            className={`w-full h-full object-cover ${service.imagePosition || 'object-top'}`}
            loading={index <= 1 ? 'eager' : 'lazy'}
            decoding="async"
          />
          {/* Edge blend gradient */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ 
              background: `linear-gradient(to top, ${service.cardBg} 0%, rgba(0,0,0,0.3) 50%, transparent 100%)` 
            }} 
          />
          <div 
            className="hidden md:block absolute inset-0 pointer-events-none" 
            style={{ 
              background: `linear-gradient(to right, ${service.cardBg} 0%, ${service.cardBg}88 25%, transparent 60%)` 
            }} 
          />
        </div>

        {/* Left Side Background Gradient for High Contrast Text */}
        <div 
          className="absolute inset-0 pointer-events-none md:w-[68%]" 
          style={{ 
            background: `linear-gradient(to right, ${service.cardBg} 0%, ${service.cardBg}F2 65%, transparent 100%)` 
          }} 
        />

        {/* Top Header Rail */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/20 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {service.badge && (
              <span className="whitespace-nowrap shrink-0 bg-white/95 backdrop-blur-sm text-[10px] sm:text-[11px] font-['Source_Sans_3'] font-bold text-gray-800 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
                {service.badge}
              </span>
            )}
            <span className="truncate text-white/85 text-[11px] sm:text-xs font-['Source_Sans_3'] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em]">
              {service.tagline}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="whitespace-nowrap text-white/80 font-mono text-[11px] sm:text-xs tracking-widest font-semibold">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: service.iconColor }}>
              <CategoryIcon cat={service.category} />
            </div>
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 py-3 sm:py-4 md:py-6 max-w-2xl">
          <h3 className="font-['Playfair_Display'] text-xl xs:text-2xl sm:text-3xl md:text-5xl font-normal text-white mb-2 sm:mb-3 leading-tight">
            {service.title}
          </h3>
          <p className="font-['Source_Sans_3'] text-white/90 text-xs sm:text-base md:text-lg font-light leading-relaxed mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-3">
            {service.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {service.highlights.map((h, i) => (
              <span key={i} className="text-[11px] sm:text-xs font-['Source_Sans_3'] bg-white/15 backdrop-blur-md text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/20 flex items-center gap-1 sm:gap-1.5">
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" /> {h}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Rail */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[11px] sm:text-sm font-['Source_Sans_3'] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/20">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {service.downtime}
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[11px] sm:text-sm font-['Source_Sans_3'] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/20">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {service.sessions}
            </span>
          </div>

          <button className="flex items-center gap-2 bg-white text-gray-900 text-xs sm:text-sm font-['Source_Sans_3'] font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#FAF0DD] transition-all shadow-md active:scale-95 cursor-pointer">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
});

export default function ServicesSection() {
  const [cat, setCat] = useState<'all' | Service['category']>('all');
  const [modal, setModal] = useState<Service | null>(null);

  const visible = cat === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.category === cat || (cat === 'body' && s.category === 'surgery'));

  const containerRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const config = isDesktop ? desktopConfig : mobileConfig;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const total = visible.length;
  const keyframes = useMemo(
    () => visible.map((_, idx) => generateSafeKeyframes(idx, total, config)),
    [visible, total, config]
  );

  const [activeCard, setActiveCard] = useState(0);
  const activeRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (val) => {
    const next = clampVal(Math.round(val * (total - 1)), 0, Math.max(total - 1, 0));
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActiveCard(next);
    }
  });


  return (
    <section id="services" className="relative bg-white pt-20 pb-24">
      <div className="absolute top-0 inset-x-0 h-72 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(250,240,221,0.6), transparent)' }} />

      {/* Header and Category Pills Container */}
      <div className="relative max-w-[1160px] mx-auto px-5 md:px-8 mb-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[#108283] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest border border-[#108283]/20 bg-[#FAF0DD] font-['Source_Sans_3']">
            <Leaf className="w-3.5 h-3.5" /> Our Services
          </span>
          <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-[58px] text-gray-950 font-normal mb-4 leading-tight">
            Our Treatments
          </h2>
          <p className="max-w-3xl mx-auto font-['Source_Sans_3'] text-gray-500 text-base md:text-lg leading-relaxed md:whitespace-nowrap">
            Homeopathy &amp; Modern Cosmetology under one roof &mdash; first of its kind in Kolhapur.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {CATS.map(c => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`px-5 py-2 rounded-full text-sm font-['Source_Sans_3'] font-medium transition-all duration-200 cursor-pointer border ${
                cat === c.key
                  ? 'bg-[#108283] text-white border-[#108283]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#108283]/40 hover:text-[#108283]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll-Sticky Card Deck — works on all screen sizes */}
      <article ref={containerRef} className="relative w-full" style={{ height: `${total * 100}svh` }}>
        <div className="sticky top-0 h-[100svh] flex items-center justify-center">
          {visible.map((s, index) => (
            <DeckCardItem
              key={s.title}
              service={s}
              index={index}
              total={total}
              progress={scrollYProgress}
              keyframes={keyframes[index]}
              active={activeCard === index}
              onClick={() => setModal(s)}
            />
          ))}
        </div>
      </article>


      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)' }}
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.3)] animate-in zoom-in-95 fade-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-52 overflow-hidden">
              <img src={modal.image} alt={modal.title} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${modal.accent}`} />
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <p className="text-white/75 text-[11px] font-['Source_Sans_3'] font-bold uppercase tracking-widest mb-1">{modal.tagline}</p>
                <h3 className="font-['Playfair_Display'] text-3xl text-white font-medium">{modal.title}</h3>
              </div>
              <button
                onClick={() => setModal(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/90 backdrop-blur text-gray-700 flex items-center justify-center hover:bg-white transition cursor-pointer shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-7 md:p-8">
              <p className="font-['Source_Sans_3'] text-gray-600 text-sm leading-relaxed mb-6">{modal.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: <Clock className="w-4 h-4 text-[#108283]" />, label: 'Downtime', val: modal.downtime },
                  { icon: <Calendar className="w-4 h-4 text-[#108283]" />, label: 'Sessions', val: modal.sessions },
                  { icon: <ShieldCheck className="w-4 h-4 text-[#108283]" />, label: 'Safety', val: 'FDA Approved' },
                ].map(m => (
                  <div key={m.label} className="flex flex-col gap-1 rounded-2xl p-4" style={{ background: 'rgba(250,240,221,0.6)', border: '1px solid #FAEDDA' }}>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-['Source_Sans_3']">{m.icon} {m.label}</div>
                    <div className="text-sm font-bold text-gray-900 font-['Source_Sans_3']">{m.val}</div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-['Source_Sans_3']">Technology Used</p>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-['Source_Sans_3'] text-gray-800">{modal.technology}</div>
              </div>

              <div className="mb-7">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-['Source_Sans_3']">Key Outcomes</p>
                <div className="grid grid-cols-2 gap-2">
                  {modal.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-['Source_Sans_3'] text-gray-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {h}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="#booking"
                onClick={() => setModal(null)}
                style={{ backgroundColor: modal.cardBg }}
                className="block text-center hover:opacity-90 text-white py-4 rounded-full font-['Source_Sans_3'] font-semibold text-sm transition-all active:scale-95 shadow-md"
              >
                Book {modal.title} Consultation →
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

