'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Stethoscope, ArrowRight, RotateCcw, CheckCircle2, Activity, Layers, Sun, Leaf, Clock, Droplets } from 'lucide-react';

const concerns = [
  { id: 'acne-active', label: 'Active Acne & Blemishes', icon: Activity },
  { id: 'acne-scars', label: 'Acne Scars & Texture', icon: Layers },
  { id: 'pigmentation', label: 'Pigmentation & Melasma', icon: Sun },
  { id: 'hair-loss', label: 'Hair Thinning & Hair Fall', icon: Leaf },
  { id: 'anti-aging', label: 'Fine Lines & Dullness', icon: Clock },
  { id: 'glow-hydrate', label: 'Dull Skin & Dehydration', icon: Droplets },
];

const durations = [
  { id: 'recent', label: 'Recent (< 6 months)' },
  { id: 'moderate', label: 'Moderate (6 - 12 months)' },
  { id: 'chronic', label: 'Chronic / Persistent (1+ Years)' },
];

const recommendations: Record<string, { protocol: string; tech: string; duration: string; summary: string }> = {
  'acne-active': {
    protocol: 'Medical Acne Clarifying Protocol',
    tech: 'Salicylic Peels + Blue Light Therapy + Barrier Therapy',
    duration: '3 - 4 Sessions',
    summary: 'Targeted comedone clearance, sebum balancing, and eradication of P. acnes bacteria without barrier compromise.',
  },
  'acne-scars': {
    protocol: 'Precision Scar Remodeling Matrix',
    tech: 'Subcision + Micro-Needling RF + Fractional Laser',
    duration: '4 - 6 Sessions',
    summary: 'Deep dermal collagen induction to elevate rolling, boxcar, and surgical scars for up to 85% surface smoothing.',
  },
  'pigmentation': {
    protocol: 'Advanced Melano-Corrective System',
    tech: 'Q-Switched Nd:YAG Laser + Glutathione Infusion',
    duration: '4 - 5 Sessions',
    summary: 'Surgical-grade photo-acoustic dispersion of deep epidermal and dermal melanin clumps.',
  },
  'hair-loss': {
    protocol: 'Cellular Follicular Growth Therapy',
    tech: 'High-Concentration GFC + Low-Level Scalp Laser',
    duration: '4 - 6 Monthly Sessions',
    summary: 'Infusion of autologous growth factor concentrate into scalp tissue to arrest shedding and stimulate dormant anagen follicles.',
  },
  'anti-aging': {
    protocol: 'Facial Harmonization & Skin Booster',
    tech: 'US FDA Botulinum Smoothing + Hyaluronic Radiance Boost',
    duration: '1 - 2 Sessions',
    summary: 'Soft, natural dynamic wrinkle relaxation combined with intradermal hydration for lifted, luminous firmness.',
  },
  'glow-hydrate': {
    protocol: 'Prime Signature Medi Facial Renewal',
    tech: 'Hydra-Vacuum Infusion + Cryo-Toning + Vitamin C Serum',
    duration: 'Monthly Maintenance',
    summary: 'Instant micro-circulation boost, dead cell exfoliation, and intense dermal plumping with zero recovery downtime.',
  },
};

export default function SkinDiagnostic() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedConcern, setSelectedConcern] = useState<string>('acne-scars');
  const [selectedDuration, setSelectedDuration] = useState<string>('chronic');

  const activeRec = recommendations[selectedConcern] || recommendations['acne-scars'];

  return (
    <section id="diagnostic" className="py-20 md:py-28 bg-[#FAF0DD]/60 relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#108283]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F0A070]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1140px] mx-auto px-5 md:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FAEDDA] text-[#108283] text-xs md:text-sm font-['Source_Sans_3'] font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-[#108283]" />
            <span>CLINICAL PROTOCOL FINDER</span>
          </div>

          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl text-gray-950 font-normal mb-3">
            Find Your <span className="text-[#108283] font-bold italic">Personalized</span> Treatment Protocol
          </h2>

          <p className="font-['Source_Sans_3'] text-gray-600 text-base md:text-lg max-w-2xl font-light">
            Answer 2 quick diagnostic questions to explore what Dr. Monali’s clinical team typically recommends for your specific skin and hair profile.
          </p>
        </div>

        {/* Diagnostic Wizard Card */}
        <div className="max-w-3xl mx-auto rounded-[36px] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_16px_50px_rgba(0,0,0,0.06)] p-6 md:p-10">
          {/* Step Indicator */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#108283] text-white flex items-center justify-center text-xs font-bold font-['Source_Sans_3']">
                {step}
              </div>
              <span className="font-['Source_Sans_3'] text-sm font-semibold text-gray-800">
                {step === 1 && 'Step 1: Identify Primary Concern'}
                {step === 2 && 'Step 2: Condition Duration'}
                {step === 3 && 'Diagnostic Recommendation'}
              </span>
            </div>

            {step > 1 && (
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-['Source_Sans_3'] text-gray-500 hover:text-[#108283] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
            )}
          </div>

          {/* STEP 1: CONCERN SELECTOR */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="font-['Playfair_Display'] text-xl font-medium text-gray-900">
                What is your main focus area today?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {concerns.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedConcern(item.id);
                        setStep(2);
                      }}
                      className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer font-['Source_Sans_3'] ${
                        selectedConcern === item.id
                          ? 'border-[#108283] bg-[#108283]/5 text-[#108283] font-semibold'
                          : 'border-gray-100 bg-gray-50/70 hover:bg-white hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${selectedConcern === item.id ? 'bg-[#108283] text-white' : 'bg-white text-[#108283] shadow-xs'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: DURATION SELECTOR */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="font-['Playfair_Display'] text-xl font-medium text-gray-900">
                How long have you experienced this concern?
              </h3>

              <div className="space-y-3">
                {durations.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedDuration(item.id);
                      setStep(3);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer font-['Source_Sans_3'] ${
                      selectedDuration === item.id
                        ? 'border-[#108283] bg-[#108283]/5 text-[#108283] font-semibold'
                        : 'border-gray-100 bg-gray-50/70 hover:bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-sm">{item.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS CARD */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#108283]/10 to-[#FAF0DD] border border-[#108283]/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#108283] uppercase tracking-wider font-['Source_Sans_3'] mb-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>Dermatologist Recommended Protocol</span>
                </div>

                <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-medium text-gray-950 mb-3">
                  {activeRec.protocol}
                </h3>

                <p className="font-['Source_Sans_3'] text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                  {activeRec.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#108283]/15 font-['Source_Sans_3'] text-xs text-gray-700">
                  <div>
                    <span className="text-gray-400 block mb-1">Featured Medical Tech:</span>
                    <strong className="text-gray-900 font-semibold">{activeRec.tech}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Expected Course:</span>
                    <strong className="text-[#108283] font-semibold">{activeRec.duration}</strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="#booking"
                  className="w-full sm:flex-1 text-center bg-[#108283] hover:bg-[#0c6b6c] text-white py-4 rounded-full font-['Source_Sans_3'] font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Book Consultation for This Protocol</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-6 py-4 rounded-full border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Test Another Concern
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
