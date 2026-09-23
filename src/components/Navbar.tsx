'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Menu, X, ShoppingBag, ArrowRight, CalendarCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { scrollToTop, scrollToTarget } from '@/components/SmoothScroll';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const { openCart, totalItems } = useCart();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY > 32) {
        setIsScrolled(true);
      } else if (currentScrollY < 14) {
        setIsScrolled(false);
      }

      // Hide on fast scroll down, show on scroll up
      if (currentScrollY < 72) {
        setHideNav(false);
      } else if (delta > 14) {
        setHideNav(true);
      } else if (delta < -10) {
        setHideNav(false);
      }

      lastScrollY = currentScrollY;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shouldHide = hideNav && !isMobileMenuOpen;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 250);
  };

  // Smooth scroll back to top if already on Home, or navigate cleanly
  const handleHomeClick = (e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
    setHideNav(false);

    if (pathname === '/') {
      e.preventDefault();
      scrollToTop();
      if (window.location.hash) {
        window.history.pushState(null, '', '/');
      }
    } else {
      e.preventDefault();
      router.push('/');
      setTimeout(() => {
        scrollToTop();
      }, 150);
    }
  };

  // Handle in-page links (e.g., clicking /about when already on /about scrolls to top)
  const handlePageLinkClick = (href: string, e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
    setHideNav(false);

    if (pathname === href) {
      e.preventDefault();
      scrollToTop();
    }
  };

  // Appointment CTA button - scrolls smoothly to #booking or navigates
  const handleAppointmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
    setHideNav(false);

    if (pathname === '/') {
      scrollToTarget('booking', -90);
      window.history.pushState(null, '', '#booking');
    } else {
      router.push('/#booking');
    }
  };

  const serviceItems = [
    { 
      name: 'Homeopathy Treatments', 
      href: '/homeopathy',
      tag: 'Safe & Natural',
      desc: 'Kidney stones, Piles, PCOD, Eczema & Psoriasis' 
    },
    { 
      name: 'Cosmetic Treatments', 
      href: '/cosmetic-treatments',
      tag: 'Clinical Glow',
      desc: 'Medifacial, Peels, Anti-aging, Mole removal' 
    },
    { 
      name: 'Hair & Skin Treatments', 
      href: '/hair-and-skin',
      tag: 'Regenerative',
      desc: 'PRP therapy, Mesotherapy, Microneedling' 
    },
  ];

  return (
    <header
      className="fixed top-3.5 left-0 right-0 z-50 flex justify-center px-3 md:px-6 pointer-events-auto lg:pointer-events-none transition-transform duration-300"
      style={{ transform: shouldHide ? 'translateY(-120%)' : 'translateY(0)' }}
    >
      <div 
        className={`pointer-events-auto w-full max-w-xl lg:w-auto lg:max-w-fit transition-all duration-300 rounded-full px-4 sm:px-5 md:px-6 py-2 flex items-center justify-between lg:justify-start gap-4 md:gap-6 lg:gap-8 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-none' 
            : 'bg-white/95 backdrop-blur-md border border-white/90 shadow-none'
        }`}
      >
        {/* Logo */}
        <Link 
          href="/" 
          onClick={handleHomeClick}
          className="flex-shrink-0 flex items-center gap-2.5 group cursor-pointer"
        >
          <img
            src="/clinic-logo.png"
            alt="Dr. Monali's Homeopathy Clinic"
            className="h-9 md:h-10 w-auto object-contain"
          />
          <div className="flex flex-col justify-center">
            <span className="font-['Playfair_Display'] font-bold text-gray-900 text-base md:text-[17px] leading-tight tracking-tight">
              Dr. Monali&apos;s
            </span>
            <span className="text-[9px] md:text-[9.5px] font-bold tracking-wider uppercase text-[#108283] -mt-0.5 font-['Source_Sans_3']">
              Homeopathy Clinic
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-[14.5px] font-['Source_Sans_3'] font-medium text-gray-700">
          <Link 
            href="/" 
            onClick={handleHomeClick}
            className={`hover:text-[#108283] transition-colors cursor-pointer ${pathname === '/' ? 'text-[#108283] font-semibold' : ''}`}
          >
            Home
          </Link>

          <Link 
            href="/about" 
            onClick={(e) => handlePageLinkClick('/about', e)}
            className={`hover:text-[#108283] transition-colors cursor-pointer ${pathname === '/about' ? 'text-[#108283] font-semibold' : ''}`}
          >
            About
          </Link>

          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              type="button"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className={`flex items-center gap-1.5 hover:text-[#108283] transition-colors py-1 cursor-pointer font-medium ${
                isServicesOpen || pathname.includes('homeopathy') || pathname.includes('cosmetic') || pathname.includes('hair') ? 'text-[#108283]' : ''
              }`}
            >
              <span>Services</span>
              <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isServicesOpen && (
              <div 
                className="absolute top-full -left-2 pt-2.5 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.12)] p-2">
                  {serviceItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handlePageLinkClick(item.href, e)}
                      className="group flex flex-col p-2.5 rounded-xl hover:bg-[#FAF0DD]/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-gray-800 group-hover:text-[#108283] transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#108283]/10 text-[#108283]">
                          {item.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 mt-1 line-clamp-1 font-normal">
                        {item.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/shop" 
            onClick={(e) => handlePageLinkClick('/shop', e)}
            className={`hover:text-[#108283] transition-colors flex items-center gap-1.5 font-medium cursor-pointer ${pathname === '/shop' ? 'text-[#108283] font-semibold' : ''}`}
          >
            <span>Shop</span>
            <span className="text-[9.5px] bg-[#F0A070]/20 text-[#c86221] px-1.5 py-0.2 rounded-full font-bold tracking-wide">New</span>
          </Link>
        </nav>

        {/* Cart & Appointment CTA */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Cart Drawer Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2 text-gray-700 hover:text-[#108283] transition-colors cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#108283] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </button>

          {/* Appointment Button */}
          <button
            type="button"
            onClick={handleAppointmentClick}
            className="bg-[#108283] hover:bg-[#0c6b6c] text-white px-5 py-2 rounded-full font-['Source_Sans_3'] font-semibold text-xs md:text-sm tracking-wide transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Appointment
          </button>
        </div>

        {/* Mobile Cart & Hamburger */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openCart();
            }}
            className="relative p-2.5 text-gray-700 hover:text-[#108283] active:text-[#108283] transition-colors cursor-pointer touch-manipulation relative z-50"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#108283] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen((prev) => !prev);
            }}
            className="p-2.5 text-gray-700 hover:text-[#108283] active:text-[#108283] focus:outline-none cursor-pointer touch-manipulation relative z-50"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Luxury Mobile Navigation Drawer (Attached directly below the single navbar pill) */}
      {isMobileMenuOpen && (
        <>
          {/* Transparent tap-to-close backdrop behind header */}
          <div
            className="fixed inset-0 bg-transparent pointer-events-auto lg:hidden -z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Seamless Luxury Dropdown Card (No shadow, clean border) */}
          <div
            className="pointer-events-auto absolute top-full mt-2.5 left-3 right-3 sm:left-6 sm:right-6 max-w-xl mx-auto bg-white/98 backdrop-blur-2xl border border-gray-200/90 rounded-3xl shadow-none p-5 sm:p-6 space-y-5 lg:hidden max-h-[82vh] overflow-y-auto"
          >
            <nav className="flex flex-col space-y-2.5 font-source">
              <Link 
                href="/" 
                onClick={handleHomeClick}
                className={`text-base sm:text-lg font-medium tracking-tight py-2 border-b border-gray-100 flex items-center justify-between ${
                  pathname === '/' ? 'text-[#108283] font-bold' : 'text-gray-900 hover:text-[#108283]'
                }`}
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link 
                href="/about" 
                onClick={(e) => handlePageLinkClick('/about', e)}
                className={`text-base sm:text-lg font-medium tracking-tight py-2 border-b border-gray-100 flex items-center justify-between ${
                  pathname === '/about' ? 'text-[#108283] font-bold' : 'text-gray-900 hover:text-[#108283]'
                }`}
              >
                <span>About Dr. Monali</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>

              {/* Services Section (Accordion - Closed by default) */}
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="w-full py-2 flex items-center justify-between text-base sm:text-lg font-medium tracking-tight text-gray-900 hover:text-[#108283] transition-colors cursor-pointer"
                >
                  <span>Treatments &amp; Services</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isMobileServicesOpen ? 'rotate-180 text-[#108283]' : ''
                    }`}
                  />
                </button>

                {isMobileServicesOpen && (
                  <div className="space-y-1.5 pl-3 pb-3 pt-1">
                    {serviceItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          setIsMobileServicesOpen(false);
                          handlePageLinkClick(item.href, e);
                        }}
                        className="flex items-center justify-between py-1.5 text-sm font-medium text-gray-700 hover:text-[#108283] transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{item.name}</span>
                          <span className="text-xs text-gray-500 font-normal">{item.desc}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#108283]/10 text-[#108283] shrink-0">
                          {item.tag}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/#results" 
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  scrollToTarget('results');
                }}
                className="text-base sm:text-lg font-medium tracking-tight py-2 border-b border-gray-100 flex items-center justify-between text-gray-900 hover:text-[#108283]"
              >
                <span>Verified Clinical Results</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link 
                href="/shop" 
                onClick={(e) => handlePageLinkClick('/shop', e)}
                className="text-base sm:text-lg font-medium tracking-tight py-2 border-b border-gray-100 flex items-center justify-between text-gray-900 hover:text-[#108283]"
              >
                <div className="flex items-center gap-2">
                  <span>Clinic Shop</span>
                  <span className="text-[10px] bg-[#F0A070] text-white px-2 py-0.5 rounded-full font-bold">New</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            </nav>

            {/* Bottom Actions & Clinic Info Card */}
            <div className="space-y-3 pt-1">
              {/* Fast Contact info */}
              <div className="bg-[#FAF0DD]/70 border border-[#F0DAAA]/60 rounded-2xl p-3.5 flex items-center justify-between text-xs font-source">
                <div>
                  <div className="font-bold text-gray-950">Dr. Monali&apos;s Clinic (Homeopathy &amp; Skin)</div>
                  <div className="text-gray-600">Near Ring Road, Kolhapur</div>
                  <div className="text-emerald-700 font-semibold text-[11px] mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Mon–Sat: 10 AM–2 PM &amp; 5–9 PM</span>
                  </div>
                </div>
                <a
                  href="tel:+919209472224"
                  className="shrink-0 bg-[#108283] hover:bg-[#0c6b6c] text-white px-3.5 py-1.5 rounded-full font-bold text-xs shadow-xs transition-colors"
                >
                  Call Doctor
                </a>
              </div>

              {/* Primary Consultation CTA */}
              <button
                type="button"
                onClick={handleAppointmentClick}
                className="w-full flex items-center justify-center gap-2 bg-[#108283] hover:bg-[#0c6b6c] active:scale-98 text-white py-3 rounded-full font-source font-semibold text-sm shadow-[0_8px_20px_rgba(16,130,131,0.25)] transition-all cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-white" />
                <span>Book Consultation Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
