'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Award, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const certificates = [
  { id: 1, img: '/certificates/certificate1.png', title: 'BHMS Degree', desc: 'Bachelor of Homoeopathic Medicine and Surgery (Mumbai)' },
  { id: 2, img: '/certificates/certificate2.png', title: 'Clinical Cosmetology', desc: 'Advanced Clinical Cosmetology & Aesthetics Certification' },
  { id: 3, img: '/certificates/certificate3.png', title: 'Maharashtra Council', desc: 'Maharashtra Council of Homeopathy Registration' },
  { id: 4, img: '/certificates/certificate4.png', title: 'CME Training', desc: 'Continuing Medical Education & Advanced Training' },
  { id: 5, img: '/certificates/certificate5.png', title: 'Aesthetic Physician', desc: 'Board Certified Aesthetic Physician Credentials' },
  { id: 6, img: '/certificates/certificate6.png', title: 'Specialized Treatments', desc: 'Specialized Certification in Advanced Skincare' },
];

export default function DermatologistGuide() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth RAF-based marquee refs
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);
  const xPosRef = useRef(0);
  const currentSpeedRef = useRef(0.8);
  const targetSpeedRef = useRef(0.8);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      // Smoothly decelerate/accelerate speed towards target
      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.08;
      xPosRef.current -= currentSpeedRef.current;

      const setWidth = singleSetRef.current ? singleSetRef.current.offsetWidth : 2400;
      if (xPosRef.current <= -setWidth) {
        xPosRef.current += setWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${xPosRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMarqueeMouseEnter = () => {
    // Ultra-slow speed when hovered: barely moves!
    targetSpeedRef.current = 0.07;
  };

  const handleMarqueeMouseLeave = () => {
    targetSpeedRef.current = 0.8;
  };

  const handleMouseEnterCard = (img: string) => {
    targetSpeedRef.current = 0.05; // barely moves
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setSelectedCert(img);
    }, 3000);
  };

  const handleMouseLeaveCard = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleCardClick = (img: string) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setSelectedCert(img);
  };

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="certifications" className="py-20 bg-gradient-to-b from-white to-[#F9FCFC] relative overflow-hidden">
      {/* Fallback anchor for old links */}
      <div id="guide" className="absolute -top-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Source_Sans_3']">
          Verified <span className="text-[#108283]">Certifications</span> & Credentials
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg font-['Source_Sans_3']">
          Our practice is built on a foundation of rigorous medical education, continuous training, and recognized certifications from premier medical councils.
        </p>
      </div>

      {/* Marquee Container */}
      <div 
        className="w-full relative py-8"
        onMouseEnter={handleMarqueeMouseEnter}
        onMouseLeave={handleMarqueeMouseLeave}
      >
        <div className="w-full overflow-hidden py-4 select-none">
          <div 
            ref={trackRef}
            className="flex w-max items-center will-change-transform"
          >
            {[...Array(2)].map((_, setIdx) => (
              <div 
                key={setIdx} 
                ref={setIdx === 0 ? singleSetRef : undefined}
                className="flex items-center"
              >
                {certificates.map((cert) => (
                  <div 
                    key={`${setIdx}-${cert.id}`} 
                    className="w-[320px] sm:w-[360px] md:w-[380px] shrink-0 mx-4 sm:mx-5 cursor-pointer group/card"
                    onMouseEnter={() => handleMouseEnterCard(cert.img)}
                    onMouseLeave={handleMouseLeaveCard}
                    onClick={() => handleCardClick(cert.img)}
                  >
                    <div className="bg-white rounded-3xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.07)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(16,130,131,0.18)] hover:border-[#108283]/40 transition-all duration-300 h-full flex flex-col">
                      {/* Clean Certificate Image Container - No overlay text blocking */}
                      <div className="relative h-[360px] sm:h-[400px] md:h-[440px] w-full rounded-2xl overflow-hidden bg-slate-50 border border-gray-200/90 flex items-center justify-center p-3 shadow-inner">
                        <img 
                          src={cert.img} 
                          alt={cert.title}
                          className="w-full h-full object-contain drop-shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f0f0f0/a0a0a0?text=Certificate';
                          }}
                        />
                      </div>
                      
                      {/* Content below image */}
                      <div className="pt-5 pb-3 px-2 flex-grow flex flex-col items-center text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-['Source_Sans_3']">{cert.title}</h3>
                        <p className="text-sm text-gray-500 font-medium line-clamp-2">{cert.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200 cursor-pointer select-none"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="relative p-3 sm:p-4 bg-white rounded-3xl shadow-2xl flex items-center justify-center cursor-default max-w-full max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 bg-white text-gray-900 rounded-full p-2 shadow-xl hover:bg-gray-100 transition-all z-20 cursor-pointer border border-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCert(null);
              }}
              aria-label="Close certificate view"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <img 
              src={selectedCert} 
              alt="Certificate Full View" 
              className="max-h-[82vh] max-w-[88vw] object-contain rounded-2xl drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/1200x800/f0f0f0/a0a0a0?text=Certificate+View';
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
