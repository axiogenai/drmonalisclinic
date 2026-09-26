'use client';

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { defaultResults } from '@/data/results';

interface ResultTab {
  name: string;
  category: 'skin' | 'hair' | 'face';
  image: string;
  metric: string;
  doctorNotes: string;
}

const CATEGORIES = [
  { key: 'skin', label: 'Skin & Scars' },
  { key: 'hair', label: 'Hair Care' },
  { key: 'face', label: 'Face & Anti-Aging' },
] as const;

const resultTabs: ResultTab[] = [
  // Skin
  {
    name: 'Accident Scars',
    category: 'skin',
    image: '/accident-scars.png',
    metric: '80 - 90% Scar Reduction',
    doctorNotes: 'Constitutional homeopathic remedies and natural regenerative therapy stimulating gentle tissue recovery.',
  },
  {
    name: 'Acne Scars',
    category: 'skin',
    image: 'https://primederm.in/wp-content/uploads/2026/02/acnescarwithsurgery.jpg',
    metric: 'Deep Tissue Regeneration',
    doctorNotes: 'Holistic homeopathic treatment addressing deep chronic tissue inflammation and encouraging natural skin smoothing.',
  },
  {
    name: 'Melasma',
    category: 'skin',
    image: 'https://primederm.in/wp-content/uploads/2025/07/MELASMA-768x512.png',
    metric: 'Dermal Melanin Clearance',
    doctorNotes: 'Root-cause homeopathic regulation of melanocyte activity, clearing hyperpigmentation without harsh chemical peeling.',
  },
  {
    name: 'Dark Circles',
    category: 'skin',
    image: 'https://primederm.in/wp-content/uploads/2025/07/DARK-CIRCLES.png',
    metric: 'Infraorbital Brightening',
    doctorNotes: 'Constitutional remedies addressing underlying fatigue, micro-circulation, and infraorbital skin health.',
  },
  {
    name: 'Under Eye',
    category: 'skin',
    image: 'https://primederm.in/wp-content/uploads/2025/07/UNDER-EYE-TREATMENT.png',
    metric: 'Tear Trough Smoothing',
    doctorNotes: 'Holistic homeopathic care improving lymphatic drainage, sleep quality, and under-eye discoloration.',
  },
  {
    name: 'Skin Booster',
    category: 'skin',
    image: 'https://primederm.in/wp-content/uploads/2026/02/skin-boosters.jpg',
    metric: 'Deep Dermal Hydration Surge',
    doctorNotes: 'Natural homeopathic vitality remedies stimulating cellular rejuvenation and internal dermal hydration.',
  },
  {
    name: 'Hands & Feet',
    category: 'skin',
    image: 'https://primederm.in/wp-content/uploads/2025/07/HANDS-AND-FEET.png',
    metric: 'Photodamage Reversal',
    doctorNotes: 'Constitutional homeopathy targeting pigmentation, sun damage, and skin texture restoration.',
  },

  // Hair
  {
    name: 'Hair Loss',
    category: 'hair',
    image: 'https://primederm.in/wp-content/uploads/2026/03/Hair-treatments.jpg',
    metric: 'Visible Anagen Regrowth',
    doctorNotes: 'Individualized homeopathic hair therapy targeting root hormonal and nutritional factors to stimulate follicular regrowth.',
  },
  {
    name: 'Hair Thinning',
    category: 'hair',
    image: 'https://primederm.in/wp-content/uploads/2026/01/hair-transplantation.jpg',
    metric: 'Follicular Density Restored',
    doctorNotes: 'Constitutional homeopathic trichology rejuvenating dormant hair follicles and curbing thinning.',
  },
  {
    name: 'Facial Hair',
    category: 'hair',
    image: 'https://primederm.in/wp-content/uploads/2025/07/FACIAL-HAIR.png',
    metric: 'Natural Hormonal Balance',
    doctorNotes: 'Constitutional homeopathic remedies addressing underlying hormonal and endocrine imbalances naturally.',
  },

  // Face & Anti-Aging
  {
    name: 'Forehead Lines',
    category: 'face',
    image: 'https://primederm.in/wp-content/uploads/2025/07/FOREHEAD-REJ.png',
    metric: 'Frontalis Smoothing',
    doctorNotes: 'Gentle homeopathic remedies and stress relaxation enhancing facial muscle balance and skin radiance.',
  },
  {
    name: 'Frown Lines',
    category: 'face',
    image: 'https://primederm.in/wp-content/uploads/2025/07/FROWN-LINES-.png',
    metric: 'Glabellar Relaxation',
    doctorNotes: 'Constitutional homeopathic therapy easing chronic facial muscle tension and stress lines naturally.',
  },
  {
    name: "Crow's Feet",
    category: 'face',
    image: 'https://primederm.in/wp-content/uploads/2025/07/CROWS-FEET.png',
    metric: 'Dynamic Rhytid Smoothing',
    doctorNotes: 'Gentle homeopathic anti-aging formulations supporting micro-circulation and skin elasticity.',
  },
  {
    name: 'Ear Lobe',
    category: 'face',
    image: 'https://primederm.in/wp-content/uploads/2025/07/EAR-LOBE.png',
    metric: 'Scarless Lobe Repair',
    doctorNotes: 'Holistic skin repair and herbal tissue healing supporting natural contour restoration.',
  },
  {
    name: 'Calf Botox',
    category: 'face',
    image: 'https://primederm.in/wp-content/uploads/2025/07/Calf-botox.png',
    metric: 'Refined Gastrocnemius Contour',
    doctorNotes: 'Targeted constitutional therapy and homeopathic muscle relaxation restoring balanced calf tone.',
  },
  {
    name: 'Sagging Arms',
    category: 'face',
    image: 'https://primederm.in/wp-content/uploads/2025/07/SAGGING-ARMS.png',
    metric: 'Skin Laxity Tightening',
    doctorNotes: 'Constitutional homeopathic remedies and holistic wellness boosting skin elasticity and muscle tone.',
  },
];

export default function ResultsSection() {
  const { results } = useAdminData();
  const allResults = results && results.length > 0 ? results : defaultResults;

  const [activeCategory, setActiveCategory] = useState<'skin' | 'hair' | 'face'>('skin');
  const [activeTab, setActiveTab] = useState('Accident Scars');

  const visibleTabs = allResults.filter((t) => t.category === activeCategory && (t as any).isActive !== false);
  const activeData = allResults.find((t) => t.name === activeTab) || visibleTabs[0] || allResults[0];

  const handleCategorySelect = (category: 'skin' | 'hair' | 'face') => {
    setActiveCategory(category);
    const firstTabInCategory = allResults.find((t) => t.category === category && (t as any).isActive !== false);
    if (firstTabInCategory) {
      setActiveTab(firstTabInCategory.name);
    }
  };

  return (
    <section id="results" className="pt-20 md:pt-28 pb-28 md:pb-36 bg-[#FAF0DD] relative overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-5 md:px-8">
        {/* Header Block */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div className="inline-block bg-[#F0A070] text-white text-xs md:text-sm font-['Source_Sans_3'] font-medium px-5 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-xs">
            VERIFIED RESULTS
          </div>

          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-gray-950 font-normal leading-tight max-w-3xl mb-4">
            Experience the <span className="text-[#108283] font-bold italic">Subtle Power</span> of Transformation
          </h2>

          <p className="font-['Source_Sans_3'] text-gray-700 text-base md:text-lg max-w-2xl font-light">
            Dr. Monali&apos;s Homeopathy Clinic offers holistic treatments for lasting, natural results
          </p>
        </div>

        {/* 1. Simple 3 Category Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1.5 bg-white rounded-full border border-gray-200/80 shadow-xs gap-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => handleCategorySelect(c.key)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === c.key
                    ? 'bg-[#108283] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#108283]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Clean Treatment Pills for the Selected Category */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-10 text-center font-['Source_Sans_3']">
          {visibleTabs.map((tab) => {
            const isActive = tab.name === activeTab;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#108283] text-white border-[#108283] shadow-sm font-semibold'
                    : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200 hover:border-[#108283]/40'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Clinical Image Display Container with Glassmorphic Frame */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[36px] overflow-hidden bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.07)] p-4 md:p-7 transition-all duration-500 hover:shadow-[0_28px_65px_rgba(16,130,131,0.15)]">
            
            {/* Top Bar inside Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#108283]"></span>
                <span className="font-['Playfair_Display'] text-gray-950 font-medium text-lg md:text-xl">
                  {activeData.name}
                </span>
              </div>

              {/* Clinical Metric Pill */}
              <div className="inline-flex items-center gap-1.5 bg-[#108283]/10 text-[#108283] text-xs font-['Source_Sans_3'] font-bold px-3.5 py-1.5 rounded-full border border-[#108283]/20">
                <ShieldCheck className="w-4 h-4" />
                <span>{activeData.metric}</span>
              </div>
            </div>

            {/* Clinical Image Display */}
            <div className="relative w-full overflow-hidden rounded-[26px] bg-neutral-50 flex items-center justify-center min-h-[360px] md:min-h-[460px]">
              <img
                src={activeData.image}
                alt={`${activeData.name} - Dr. Monali's Homeopathy Clinic Clinical Results`}
                className="w-full h-auto max-h-[560px] object-contain transition-all duration-300 animate-in fade-in zoom-in-95"
                key={activeData.image}
                loading="lazy"
              />
            </div>

            {/* Doctor Note Bar */}
            <div className="mt-5 p-4 rounded-2xl bg-[#FAF0DD]/50 border border-[#FAEDDA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-['Source_Sans_3']">
              <div className="text-xs md:text-sm text-gray-700">
                <strong className="text-gray-900 font-semibold">Clinical Note: </strong>
                <span>{activeData.doctorNotes}</span>
              </div>

              <a
                href="#booking"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#108283] hover:underline"
              >
                <span>Consult for this condition &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dual-Shade Wave Transition (Harmonious counter-crests with vertical fade-down) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none translate-y-1 pointer-events-none">
        <svg 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-16 md:h-24 lg:h-28"
        >
          <defs>
            {/* Shade 1: Soft luminous frosted cream (translucent white over beige) fading down */}
            <linearGradient id="waveOppositeShade1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
            </linearGradient>

            {/* Shade 2: Pure crisp white fading down into 100% solid white */}
            <linearGradient id="waveOppositeShade2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
              <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* First Shade: Prominent high crest on the left, flowing across */}
          <path 
            d="M0,36 C240,8 460,12 720,38 C960,60 1200,18 1440,30 L1440,120 L0,120 Z" 
            fill="url(#waveOppositeShade1)" 
          />

          {/* Second Shade: Opposite flow! Dips low on the left, crests high on the right */}
          <path 
            d="M0,70 C240,78 460,72 720,58 C960,42 1200,32 1440,46 L1440,120 L0,120 Z" 
            fill="url(#waveOppositeShade2)" 
          />
        </svg>
      </div>
    </section>
  );
}
