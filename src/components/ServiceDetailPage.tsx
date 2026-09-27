'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import AppointmentSection from './AppointmentSection';
import Footer from './Footer';
import ContactWidget from './ContactWidget';
import ServiceBookingModal from './ServiceBookingModal';
import { Service } from '@/types/admin';
import { IndianRupee, Clock, Calendar, Check, ArrowRight } from 'lucide-react';

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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

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
        <p className="text-gray-600 max-w-2xl text-lg leading-relaxed mb-8">
          {categorySubtitle}
        </p>

        {/* Specialization Chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {specializations.map((spec, index) => (
            <span 
              key={index}
              className="px-4 py-2 rounded-full border border-gray-200/80 bg-white/50 text-gray-700 text-sm font-medium hover:border-[#108283] hover:text-[#108283] transition-colors cursor-pointer"
            >
              {spec}
            </span>
          ))}
        </div>
      </section>

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
                        <Check className="w-4 h-4 text-[#108283]" />
                      </div>
                      <span className="text-gray-700 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing, Process Duration & In-Place Consultation Booking */}
                <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3.5">
                  <button 
                    onClick={() => handleOpenBooking(service)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-full font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Price Tag Pill */}
                  {service.price && (
                    <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FAF0DD] border border-[#D4AF37]/35 shadow-xs">
                      <IndianRupee className="w-4 h-4 text-[#108283]" />
                      <span className="text-xs sm:text-sm font-bold text-[#108283] tracking-tight">
                        {service.price}
                      </span>
                    </div>
                  )}

                  {/* Duration / Process Time Pill */}
                  {service.duration && (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white border border-gray-200 shadow-xs">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        {service.duration}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* In-Place Quick Booking Modal (Zero Redirections) */}
      <ServiceBookingModal
        service={selectedService}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <AppointmentSection />
      <Footer />
      <ContactWidget />
    </main>
  );
}
