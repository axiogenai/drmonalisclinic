'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactWidget from '@/components/ContactWidget';
import { blogArticles, getBlogBySlug } from '@/data/blogArticles';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  Quote, 
  ArrowRight,
  BookOpen,
  Share2,
  PhoneCall
} from 'lucide-react';

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const article = getBlogBySlug(slug);

  if (!article) {
    notFound();
  }

  // Other related articles (excluding the current one)
  const relatedArticles = blogArticles.filter((b) => b.slug !== slug);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2C3E50] font-['Source_Sans_3']">
      <Navbar />

      {/* Hero Header */}
      <div className="pt-28 md:pt-36 pb-12 md:pb-16 max-w-4xl mx-auto px-5 md:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/#blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#108283] hover:text-[#0c6b6c] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Articles</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#108283] transition-colors cursor-pointer px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-2xs"
            title="Share this article"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Category & Read Time */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-[#FAEDDA] text-[#108283] text-xs md:text-sm font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
            {article.category}
          </span>
          <span className="text-xs md:text-sm text-gray-400">• {article.readTime}</span>
        </div>

        {/* Article Title */}
        <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-[1.18] mb-6">
          {article.title}
        </h1>

        {/* Author & Publication Meta */}
        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pb-8 border-b border-gray-200 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#108283]/10 border border-[#108283]/20 flex items-center justify-center text-[#108283] font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 leading-tight">{article.author}</p>
              <p className="text-[11px] text-gray-500">{article.authorRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-4 h-4 text-[#108283]" />
            <span>{article.date}</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-4 h-4 text-[#108283]" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="my-10 rounded-3xl overflow-hidden aspect-[16/9] w-full shadow-[0_12px_35px_rgba(0,0,0,0.08)] relative border border-gray-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Lead Summary */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border-l-4 border-[#108283] shadow-sm mb-10">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal italic">
            "{article.lead}"
          </p>
        </div>

        {/* Article Body Content */}
        <div className="space-y-10 text-gray-700 leading-relaxed text-base sm:text-lg">
          {article.contentSections.map((section, idx) => (
            <section key={idx} className="space-y-4 bg-white rounded-2xl p-6 sm:p-8 shadow-2xs border border-gray-100/80">
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {section.heading}
              </h2>

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-gray-600 font-light leading-relaxed">
                  {p}
                </p>
              ))}

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2.5 pt-2 pl-1">
                  {section.bulletPoints.map((bp, bpIdx) => (
                    <li key={bpIdx} className="flex items-start gap-3 text-gray-700 text-sm sm:text-base font-normal">
                      <span className="w-2 h-2 rounded-full bg-[#108283] mt-2 shrink-0" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Doctor's Highlight Quote */}
          {article.doctorAdviceQuote && (
            <div className="bg-gradient-to-r from-[#FAF0DD]/80 to-white rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/30 shadow-xs relative overflow-hidden">
              <Quote className="w-12 h-12 text-[#108283]/20 absolute top-4 right-4" />
              <p className="font-['Playfair_Display'] text-xl sm:text-2xl font-medium text-gray-900 leading-relaxed mb-4 italic">
                "{article.doctorAdviceQuote}"
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#108283]">
                — Dr. Monali Subhedar, MD (Hom.)
              </p>
            </div>
          )}

          {/* Key Clinical Takeaways Box */}
          <div className="bg-[#FAF0DD]/80 border border-[#D4AF37]/30 rounded-3xl p-7 sm:p-9 shadow-xs">
            <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-[#108283]" />
              Key Clinical Takeaways
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-gray-700">
              {article.takeaways.map((takeaway, tIdx) => (
                <li key={tIdx} className="flex items-start gap-3">
                  <span className="text-[#108283] font-bold text-base mt-0.5">✓</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Consultation CTA Card */}
          <div className="bg-[#108283] text-white rounded-3xl p-8 sm:p-10 shadow-lg text-center flex flex-col items-center">
            <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Ready to Address Your Health from the Root?
            </h3>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mb-7 font-light">
              Schedule your personalized constitutional evaluation with Dr. Monali Subhedar at our Kolhapur clinic or via online teleconsultation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#booking"
                className="px-8 py-3.5 bg-white hover:bg-[#FAEDDA] text-[#108283] font-bold rounded-full text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Book Appointment Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+919209472224"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full text-sm transition-all border border-white/20 flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call +91 92094 72224</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-900">
                More Articles from <span className="text-[#108283] italic">Dr. Monali</span>
              </h3>
              <Link
                href="/#blogs"
                className="text-xs sm:text-sm font-semibold text-[#108283] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="h-44 w-full overflow-hidden relative">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 px-3 py-0.5 rounded-full text-[10.5px] font-semibold text-[#108283]">
                      {rel.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400 mb-1.5">{rel.date} • {rel.readTime}</p>
                      <h4 className="font-['Playfair_Display'] text-base font-bold text-gray-900 group-hover:text-[#108283] transition-colors leading-snug line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="pt-4 flex items-center gap-1 text-xs font-bold text-[#108283] group-hover:translate-x-1 transition-transform">
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ContactWidget />
    </main>
  );
}
