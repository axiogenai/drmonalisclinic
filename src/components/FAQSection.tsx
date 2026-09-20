'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';

const fallbackFaqs = [
  {
    question: "What conditions do you treat at Dr. Monali's Homeopathy Clinic?",
    answer:
      'We specialize in holistic homeopathic care for chronic skin and hair concerns (such as acne, eczema, psoriasis, pigmentation, melasma, alopecia, and hair fall) as well as allergies, respiratory issues, and constitutional wellness.',
  },
  {
    question: 'How do I know which treatment is right for me?',
    answer:
      'During your in-depth constitutional consultation, Dr. Monali evaluates your physical symptoms, emotional health, medical history, and lifestyle. Homeopathy treats the whole person, so every treatment plan is 100% personalized to your unique constitution.',
  },
  {
    question: 'Are your treatments safe and free from side effects?',
    answer:
      'Yes, all our homeopathic remedies are completely natural, non-toxic, and gentle on the body. They stimulate your natural healing mechanisms to provide lasting relief without any harmful side effects.',
  },
  {
    question: 'Are your medicines safe to take alongside other treatments?',
    answer:
      'Yes, homeopathic medicines can safely be taken alongside conventional treatments. We carefully review your medical history during consultation to ensure a safe, complementary, and holistic healing journey.',
  },
  {
    question: 'Does the clinic offer online consultations for distant and international clients?',
    answer:
      'Yes, we provide online video consultations for patients across India and worldwide. Dr. Monali conducts comprehensive case assessments remotely, and prescribed homeopathic medicines are safely dispatched directly to your doorstep.',
  },
  {
    question: 'How can I book an appointment at the clinic?',
    answer:
      "You can book a consultation by calling us at +91 92094 72224, or through our website's booking form. Prior appointments are recommended to ensure dedicated time for your detailed case analysis.",
  },
];

export default function FAQSection() {
  const { faqs: contextFaqs } = useAdminData();
  const faqs = contextFaqs.length > 0 ? contextFaqs : fallbackFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 md:py-28 bg-white relative scroll-mt-20 md:scroll-mt-24">
      <div id="faq" className="absolute -top-24 pointer-events-none" />
      <div className="max-w-[1140px] mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-block bg-[#FAEDDA] text-[#108283] text-xs md:text-sm font-['Source_Sans_3'] font-medium px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            FAQs
          </div>

          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl text-gray-950 font-normal">
            <span className="text-[#108283] font-bold italic">Frequently</span> Asked Questions
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer group"
                >
                  <span className="font-['Playfair_Display'] text-lg md:text-xl font-medium text-gray-900 group-hover:text-[#108283] transition-colors pr-6">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FAF0DD] text-[#108283] flex items-center justify-center shrink-0 transition-transform duration-200">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 font-['Source_Sans_3'] text-gray-600 text-base leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
