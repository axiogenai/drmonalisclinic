'use client';

import React from 'react';
import Navbar from './Navbar';
import AppointmentSection from './AppointmentSection';
import Footer from './Footer';
import ContactWidget from './ContactWidget';

interface Service {
  id: string;
  title: string;
  indications: string;
  description: string;
  highlights: string[];
  image: string;
  imagePosition?: string;
}

interface ServiceDetailPageProps {
  categoryTitle: string;
  categorySubtitle: string;
  badge?: string;
  services: Service[];
  specializations?: string[];
}

export default function ServiceDetailPage({
  categoryTitle,
  categorySubtitle,
  badge = "OUR SERVICES",
  services,
  specializations = ['Homeopathy', 'Hair Care', 'Skin Care', 'Diet & Weight Management']
}: ServiceDetailPageProps) {
  return (
    <main className="min-h-screen bg-[#FDFBF7] font-['Source_Sans_3'] selection:bg-[#108283] selection:text-white pt-24">
      <Navbar />

      {/* Hero category banner */}
      <section className="px-5 md:px-10 py-16 md:py-24 max-w-[1240px] mx-auto text-center flex flex-col items-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#108283]/10 text-[#108283] text-sm font-semibold tracking-wider mb-6">
          {badge}
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] text-[#2C3E50] mb-6">
          {categoryTitle}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8 leading-relaxed">
          {categorySubtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-3 items-center text-sm md:text-base text-gray-500 font-medium">
          <span className="text-gray-700 font-semibold mr-2">Specializations:</span>
          {specializations.map((spec, index) => (
            <React.Fragment key={index}>
              <span className="px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">{spec}</span>
              {index < specializations.length - 1 && <span className="text-gray-300">•</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Horizontal marquee bar for treatments (seamless loop, no scrollbar) */}
      <div className="w-full bg-white border-y border-gray-200/80 overflow-hidden py-3.5 select-none shadow-2xs">
        <div className="flex w-max animate-marquee items-center">
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center">
              {services.map((service) => (
                <div key={service.id} className="flex items-center mx-4 md:mx-6 gap-3 shrink-0">
                  <a
                    href={`#${service.id}`}
                    className="text-sm md:text-base text-gray-700 hover:text-[#108283] font-medium transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {service.title}
                  </a>
                  <span className="text-[#108283]/40 font-bold select-none">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Treatment cards */}
      <section className="py-16 md:py-24 px-5 md:px-10 max-w-[1240px] mx-auto space-y-24">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={service.id} id={service.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-center scroll-mt-32`}>
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-black/5 aspect-[4/3] group bg-white">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${service.imagePosition || 'object-center'}`} 
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-['Playfair_Display'] text-[#2C3E50] leading-tight tracking-tight sm:whitespace-nowrap">
                  {service.title}
                </h2>
                <div className="bg-[#FAF0DD]/50 p-5 rounded-2xl border border-[#D4AF37]/20">
                  <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Indications:</h4>
                  <p className="text-gray-700 font-medium">{service.indications}</p>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-3 pt-4">
                  {service.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#108283]/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#108283]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-gray-700 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8">
                  <a href="#booking" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#108283] text-white rounded-full font-semibold hover:bg-[#0c6b6c] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                    Book Consultation
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <AppointmentSection />
      <Footer />
      <ContactWidget />
    </main>
  );
}
