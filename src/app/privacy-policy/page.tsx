'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactWidget from '@/components/ContactWidget';
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <Shield className="w-4 h-4" /> Patient Confidentiality &amp; Trust
          </div>

          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>

          <p className="font-['Source_Sans_3'] text-gray-600 text-base md:text-lg leading-relaxed">
            At Dr. Monali&apos;s Homeopathy Clinic, we are deeply committed to safeguarding the confidentiality and integrity of your personal and medical information. This Privacy Policy explains our stringent standards for data protection under the Indian Medical Council Code of Ethics and DISHA guidelines.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500">
            <span>Last Updated: January 2025</span>
            <span className="text-[#108283] font-semibold">Authorized by Dr. Monali Subhedar (MD Hom.)</span>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 font-['Source_Sans_3'] text-gray-700">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#108283]" />
              1. Confidentiality of Patient Health Records
            </h2>
            <p className="leading-relaxed mb-4">
              All consultations, constitutional case evaluations, symptom histories, photographs (for dermatological or trichological assessments), and diagnostic reports shared with Dr. Monali Subhedar and Dr. Sachin Subhedar are strictly confidential doctor-patient communications.
            </p>
            <ul className="space-y-2.5 text-sm md:text-[15px] text-gray-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Patient case sheets are accessible solely to licensed clinical practitioners directly supervising your healing protocol.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Under no circumstances are medical details shared with commercial advertisers, pharmaceutical sales agents, or third-party marketers.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#108283]" />
              2. Information We Collect
            </h2>
            <p className="leading-relaxed mb-4">
              To provide accurate constitutional homeopathic diagnoses and personalized treatment regimens, we may collect:
            </p>
            <ul className="space-y-2.5 text-sm md:text-[15px] text-gray-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span><strong>Personal Contact Details:</strong> Name, contact number, age, gender, residential city, and email address.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span><strong>Clinical &amp; Constitutional History:</strong> Primary health complaints, modalities, past medical history, family medical history, lifestyle, and dietary habits.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span><strong>Shop &amp; Dispatch Details:</strong> Delivery address and recipient details for dispatching authorized clinical remedies and skincare products.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Eye className="w-5 h-5 text-[#108283]" />
              3. Tele-Consultation &amp; Digital Communications
            </h2>
            <p className="leading-relaxed mb-3">
              For outstation and international patients consulting via telephone, video conference, or official WhatsApp (+91 92094 72224):
            </p>
            <p className="leading-relaxed text-sm md:text-[15px] text-gray-600">
              All digital communications are held on secured clinic devices. Prescriptions, dosage instructions, and dietary regimens transmitted digitally are protected and archived within encrypted clinical databases.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#108283]" />
              4. Patient Rights &amp; Access
            </h2>
            <p className="leading-relaxed mb-3">
              As a patient of Dr. Monali&apos;s Homeopathy Clinic, you retain the right to:
            </p>
            <ul className="space-y-2.5 text-sm md:text-[15px] text-gray-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Request a copy of your clinical treatment summary or verified medical receipts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Update or correct your contact information and mailing address.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#108283] shrink-0 mt-0.5" />
                <span>Opt out of informational clinic announcements or seasonal wellness bulletins at any time.</span>
              </li>
            </ul>
          </div>

          {/* Contact Box */}
          <div className="bg-[#FAF0DD]/80 border border-[#D4AF37]/30 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-2">
              Questions Regarding Your Medical Privacy?
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-5 max-w-xl mx-auto">
              Our clinical ethics team is available to assist you. Contact our desk directly:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a 
                href="mailto:info@drmonalisclinic.com" 
                className="px-5 py-2.5 bg-[#108283] hover:bg-[#0b5c5d] text-white font-semibold rounded-full text-sm transition-colors shadow-sm"
              >
                Email: info@drmonalisclinic.com
              </a>
              <a 
                href="tel:+919209472224" 
                className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full text-sm transition-colors border border-gray-200 shadow-sm"
              >
                Call: +91 92094 72224
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
