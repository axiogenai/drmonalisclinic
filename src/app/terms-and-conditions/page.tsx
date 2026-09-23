'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactWidget from '@/components/ContactWidget';
import { ArrowLeft, BookOpen, AlertCircle, Calendar, Package, CheckCircle2 } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2C3E50]">
      <Navbar />

      <div className="pt-28 md:pt-36 pb-20 max-w-4xl mx-auto px-5 md:px-8">
        {/* Breadcrumb / Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#108283] hover:text-[#0b5c5d] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-gray-100 mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FAEDDA] text-[#108283] text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Clinic Guidelines &amp; Patient Terms
          </div>

          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Terms &amp; Conditions
          </h1>

          <p className="font-['Source_Sans_3'] text-gray-600 text-base md:text-lg leading-relaxed">
            Welcome to Dr. Monali&apos;s Homeopathy Clinic. By booking consultations, scheduling in-clinic appointments, or purchasing clinic remedies and products, you agree to comply with the clinical care terms outlined below.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500">
            <span>Effective Date: January 2025</span>
            <span className="text-[#108283] font-semibold">Dr. Monali&apos;s Homeopathy Clinic, Kolhapur</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 font-['Source_Sans_3'] text-gray-700">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#108283]" />
              1. Nature of Homeopathic Treatment &amp; Care
            </h2>
            <p className="leading-relaxed mb-4">
              Homeopathy is a recognized constitutional system of natural medicine. Every treatment plan at Dr. Monali&apos;s clinic is uniquely customized based on complete case assessment, individual susceptibility, and clinical diagnosis.
            </p>
            <ul className="space-y-2.5 text-sm md:text-[15px] text-gray-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Healing response timelines vary by individual constitution, chronicity of illness, and disciplined adherence to dosage.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Patients are advised never to abruptly discontinue life-critical conventional medicines without explicit physician guidance.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#108283]" />
              2. Appointment Protocols &amp; Rescheduling
            </h2>
            <p className="leading-relaxed mb-4">
              To ensure every patient receives focused, dedicated consultation time without prolonged waiting periods:
            </p>
            <ul className="space-y-2.5 text-sm md:text-[15px] text-gray-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span><strong>Arrival Time:</strong> Please arrive 10 minutes prior to your scheduled consultation slot.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span><strong>Rescheduling / Cancellation:</strong> If you are unable to attend, please inform our clinic front desk via phone or WhatsApp at least 2 hours in advance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span><strong>Walk-in Patients:</strong> Walk-ins are welcomed, but pre-booked appointments are given priority.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Package className="w-5 h-5 text-[#108283]" />
              3. Medicine Storage &amp; Dosage Instructions
            </h2>
            <p className="leading-relaxed mb-4">
              Homeopathic remedies (pills, dilutions, and bio-chemic salts) are sensitive to strong odors and extreme heat:
            </p>
            <ul className="space-y-2.5 text-sm md:text-[15px] text-gray-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Store remedies in a cool, dry place away from camphor, raw onions, garlic, eucalyptus, and direct sunlight.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Pour pills into the bottle cap; avoid touching medicine pellets directly with bare hands before consumption.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Maintain a 15-minute gap before and after taking medicines from food or strong beverages.</span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              4. Emergency Care Notice
            </h2>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 text-amber-900 text-sm md:text-[15px] leading-relaxed">
              Dr. Monali&apos;s Homeopathy Clinic is an outpatient constitutional medical practice. We do not provide intensive care, trauma resuscitation, or 24/7 surgical emergency interventions. In case of acute cardiac distress, poisoning, major trauma, or life-threatening emergencies, please immediately proceed to the nearest multi-specialty hospital emergency room.
            </div>
          </div>

          {/* Clinic Contact Box */}
          <div className="bg-[#FAF0DD]/80 border border-[#D4AF37]/30 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-2">
              Have Questions About Our Clinic Policies?
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-5 max-w-xl mx-auto">
              Our front desk and consultation coordinators are happy to guide you:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a 
                href="tel:+919209472224" 
                className="px-5 py-2.5 bg-[#108283] hover:bg-[#0b5c5d] text-white font-semibold rounded-full text-sm transition-colors shadow-sm"
              >
                Call Clinic Desk: +91 92094 72224
              </a>
              <a 
                href="mailto:info@drmonalisclinic.com" 
                className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full text-sm transition-colors border border-gray-200 shadow-sm"
              >
                Email: info@drmonalisclinic.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ContactWidget />
    </main>
  );
}
