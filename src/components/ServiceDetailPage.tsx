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
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 md:py-24 max-w-[1240px] mx-auto text-center flex flex-col items-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#108283]/10 text-[#108283] text-sm font-semibold tracking-wider mb-6">
          {badge}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] text-[#2C3E50] mb-6">
          {categoryTitle}
        </h1>
        <p className="text-gray-600 max-w-2xl text-base sm:text-lg leading-relaxed mb-8">
          {categorySubtitle}
        </p>

        {/* Specialization Chips */}
        <div className="w-full max-w-full overflow-x-auto pb-1 -mx-4 px-4">
          <div className="flex flex-nowrap sm:flex-wrap gap-2 justify-start sm:justify-center min-w-max sm:min-w-0 px-4 sm:px-0">
            {specializations.map((spec, index) => (
              <span 
                key={index}
                className="px-4 py-2 rounded-full border border-gray-200/80 bg-white/50 text-gray-700 text-sm font-medium hover:border-[#108283] hover:text-[#108283] transition-colors cursor-pointer whitespace-nowrap shrink-0 sm:shrink"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment cards */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1240px] mx-auto space-y-16 md:space-y-24">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={service.id} id={service.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 lg:gap-16 items-center scroll-mt-32`}>
              <div className="w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-auto">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-black/5 w-full h-full md:aspect-[4/3] group bg-white">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${service.imagePosition || 'object-center'}`} 
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-['Playfair_Display'] text-[#2C3E50] leading-tight tracking-tight break-words">
                  {service.title}
                </h2>
                <div className="bg-[#FAF0DD]/50 p-5 rounded-2xl border border-[#D4AF37]/20 break-words">
                  <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Indications:</h4>
                  <p className="text-gray-700 font-medium break-words">{service.indications}</p>
                </div>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed break-words">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-4">
                  {service.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#108283]/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#108283]" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm sm:text-base">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing, Process Duration & In-Place Consultation Booking */}
                <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3.5">
                  <button 
                    onClick={() => handleOpenBooking(service)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#108283] hover:bg-[#0c6b6c] text-white rounded-full font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95"
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
