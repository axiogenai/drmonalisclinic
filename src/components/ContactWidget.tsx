'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Calendar, X } from 'lucide-react';

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popout Menu */}
      {isOpen && (
        <div className="mb-4 bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_12px_36px_rgba(0,0,0,0.14)] rounded-2xl p-4 w-64 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="font-['Playfair_Display'] font-semibold text-gray-900">Dr. Monali's Clinic</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <a
            href="https://wa.me/919209472224"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 text-emerald-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold">Chat on WhatsApp</div>
              <div className="text-[11px] text-gray-500">+91 92094 72224</div>
            </div>
          </a>

          <a
            href="tel:+919209472224"
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal-50 text-[#108283] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#108283] text-white flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold">Call Clinic</div>
              <div className="text-[11px] text-gray-500">+91 92094 72224</div>
            </div>
          </a>

          <a
            href="#booking"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-[#F0A070] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#F0A070] text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold">Book Consultation</div>
              <div className="text-[11px] text-gray-500">Online & In-Clinic</div>
            </div>
          </a>
        </div>
      )}

      {/* Main Pill + Button as seen in screenshots */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer group select-none"
      >
        {/* Tooltip bubble "Contact Us" */}
        <div className="relative bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-100 text-gray-800 text-xs font-['Source_Sans_3'] font-medium transition-transform group-hover:-translate-x-1">
          Contact Us
          {/* Arrow pointer on right */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[6px] border-l-white"></div>
        </div>

        {/* Blue Circle Button */}
        <div className="w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#1260cb] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(24,119,242,0.35)] transition-all duration-300">
          <MessageCircle className="w-6 h-6 fill-white" />
        </div>
      </div>
    </div>
  );
}
