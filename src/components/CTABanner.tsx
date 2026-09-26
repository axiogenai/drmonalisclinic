'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, Check, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { scrollToTarget } from '@/components/SmoothScroll';

export default function CTABanner() {
  const pathname = usePathname();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [error, setError] = useState('');

  // Handle Book Consultation click with smooth scroll across routes
  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      scrollToTarget('booking', -90);
      if (window.location.hash !== '#booking') {
        window.history.pushState(null, '', '#booking');
      }
    } else {
      router.push('/#booking');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    // Simulate luxury newsletter subscription
    setTimeout(() => {
      setLoading(false);
      setSubscribedEmail(email.trim());
      setSubscribed(true);
      setEmail('');
    }, 600);
  };

  return (
    <section className="relative bg-[#108283] py-20 md:py-28 overflow-hidden text-white">
      <div className="max-w-[1140px] mx-auto px-5 md:px-8 relative z-10 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-white/95 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm border border-white/15">
          <span>Begin Your Transformation</span>
        </div>

        <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal leading-[1.15] mb-6 max-w-3xl mx-auto">
          Rediscover Your Skin, Redefine Your Confidence
        </h2>

        <p className="font-['Source_Sans_3'] text-white/90 text-base md:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Take the first step toward holistic healing, healthier skin, and revitalized hair. Schedule a personalized consultation with Dr. Monali today.
        </p>

        {/* Primary Action Button */}
        <div className="mb-14">
          <button
            type="button"
            onClick={handleBookingClick}
            className="inline-flex items-center gap-3 bg-white hover:bg-[#FAEDDA] text-[#108283] px-9 py-4 rounded-full font-['Source_Sans_3'] font-bold text-base transition-all active:scale-95 group shadow-lg hover:shadow-xl cursor-pointer"
          >
            <span>Book Consultation</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </button>
        </div>

        {/* Newsletter Subscription Card */}
        <div className="max-w-md mx-auto px-2">
          <p className="text-xs uppercase tracking-wider sm:tracking-widest text-white/85 font-['Source_Sans_3'] mb-3.5 font-medium text-center leading-relaxed">
            <Mail className="w-3.5 h-3.5 text-white/80 inline-block mr-1.5 -mt-0.5 align-middle shrink-0" />
            <span>Subscribe for Holistic Health &amp; Wellness Insights</span>
          </p>

          {subscribed ? (
            <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-5 text-center animate-fadeIn shadow-lg">
              <div className="w-10 h-10 rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-2 text-emerald-300">
                <Check className="w-5 h-5 text-emerald-300" />
              </div>
              <h4 className="font-bold text-white text-base mb-1 font-['Source_Sans_3']">
                Thank you for subscribing!
              </h4>
              <p className="text-xs text-white/85 leading-relaxed font-light mb-3">
                We have registered <strong className="text-white font-semibold">{subscribedEmail}</strong>. You will receive seasonal wellness updates and holistic skincare advice.
              </p>
              <button
                type="button"
                onClick={() => setSubscribed(false)}
                className="text-xs text-[#FAEDDA] hover:text-white underline font-medium transition-colors cursor-pointer"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="flex-grow relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email address"
                  className="w-full bg-white/15 backdrop-blur-md border border-white/30 placeholder-white/60 text-white text-sm px-6 py-3.5 rounded-full focus:outline-none focus:bg-white/25 focus:border-white/50 transition-all"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#F0A070] hover:bg-[#e28b57] text-white px-7 py-3.5 rounded-full text-sm font-['Source_Sans_3'] font-bold transition-all shadow-md shrink-0 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>
          )}

          {error && (
            <p className="text-xs text-amber-200 mt-2 font-medium animate-fadeIn">
              {error}
            </p>
          )}

          {/* Privacy Micro-copy */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/70 font-light">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Zero spam. Unsubscribe anytime with one click.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
