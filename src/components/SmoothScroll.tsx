'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function scrollToTop(duration = 1.1) {
  if (typeof window === 'undefined') return;
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(0, { duration, immediate: false });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function scrollToTarget(targetId: string, offset = -90, duration = 1.2) {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(targetId);
  if (!el) return;
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    // Only initialize Lenis on non-touch devices to avoid touch event interference on mobile
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (isTouch) {
      return;
    }

    // Initialize modern Lenis for desktop mouse wheel
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      infinite: false,
    });

    (window as any).__lenis = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // If URL contains a hash upon loading/navigation, scroll to it smoothly
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      setTimeout(() => {
        scrollToTarget(targetId);
      }, 400);
    }

    const onHashChange = () => {
      if (window.location.hash) {
        const targetId = window.location.hash.replace('#', '');
        scrollToTarget(targetId);
      }
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('hashchange', onHashChange);
      lenis.destroy();
      (window as any).__lenis = null;
    };
  }, []);

  return null;
}
