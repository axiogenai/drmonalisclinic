'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { blogArticles } from '@/data/blogArticles';
import { useAdminData } from '@/context/AdminDataContext';

export default function BlogSection() {
  const { blogs: contextBlogs } = useAdminData();

  // Merge context blogs if admin created any
  const displayBlogs = blogArticles.map((defaultArticle) => {
    const matched = contextBlogs?.find((b) => b.title === defaultArticle.title || b.id === defaultArticle.id);
    if (matched) {
      return {
        ...defaultArticle,
        title: matched.title || defaultArticle.title,
        excerpt: matched.excerpt || defaultArticle.excerpt,
        image: matched.image || defaultArticle.image,
        category: matched.category || defaultArticle.category,
        date: matched.date || defaultArticle.date,
      };
    }
    return defaultArticle;
  });

  return (
    <section id="blogs" className="py-20 md:py-28 bg-white relative scroll-mt-20">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-16">
          <div className="inline-block bg-[#FAEDDA] text-[#108283] text-xs md:text-sm font-['Source_Sans_3'] font-medium px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            BLOG
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl text-gray-950 font-normal">
            Latest from <span className="text-[#108283] font-bold italic">Dr. Monali&apos;s Clinic</span>
          </h2>
          <p className="font-['Source_Sans_3'] text-gray-600 text-sm md:text-base max-w-xl mx-auto mt-3 font-light">
            Explore clinical dermatology insights, natural homeopathy guides, and holistic health wisdom by our specialist doctors.
          </p>
        </div>

        {/* Cards Grid - Navigates directly to dedicated article pages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1080px] mx-auto">
          {displayBlogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="group rounded-2xl overflow-hidden bg-white border border-gray-100/90 shadow-[0_4px_22px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_38px_rgba(16,130,131,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="flex flex-col flex-grow">
                {/* Image Container */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] font-['Source_Sans_3'] font-semibold text-[#108283] shadow-xs">
                    {blog.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[11px] font-['Source_Sans_3'] text-gray-400 mb-2.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{blog.date}</span>
                    <span className="text-gray-300">•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="font-['Playfair_Display'] text-lg sm:text-[19px] font-bold text-gray-900 group-hover:text-[#108283] transition-colors leading-snug mb-2 line-clamp-2 min-h-[50px]">
                    {blog.title}
                  </h3>

                  <p className="font-['Source_Sans_3'] text-[13px] text-gray-500 font-light leading-relaxed line-clamp-2 mb-2">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Read Article Action Footer */}
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-gray-100/70 flex items-center justify-between mt-auto">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-['Source_Sans_3'] font-bold text-[#108283] group-hover:text-[#0b5c5d] transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>

                <span className="text-[11px] text-gray-400 group-hover:text-gray-600 transition-colors font-['Source_Sans_3']">
                  Dr. Monali
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
