'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminData } from '@/context/AdminDataContext';
import { defaultMarqueeItems } from '@/data/marquee';
import { MarqueeItem } from '@/types/admin';

const getBadgeStyle = (color?: string) => {
  switch (color) {
    case 'rose': return 'bg-rose-500 text-white';
    case 'gold': return 'bg-amber-600 text-white';
    case 'amber': return 'bg-amber-400 text-gray-950 font-bold';
    case 'emerald': return 'bg-emerald-600 text-white';
    case 'teal':
    default: return 'bg-[#108283] text-white';
  }
};

export default function ProductAnnouncementBanner() {
  const { marqueeItems, marqueeSettings } = useAdminData();

  if (marqueeSettings && marqueeSettings.isEnabled === false) {
    return null;
  }

  const activeItems: MarqueeItem[] = (marqueeItems && marqueeItems.length > 0)
    ? marqueeItems.filter((item) => item.isActive !== false)
    : defaultMarqueeItems.filter((item) => item.isActive !== false);

  if (activeItems.length === 0) {
    return null;
  }

  // Calculate dynamic repeat count so each track spans at least 10 items (approx 3000px+)
  // This ensures 1, 2, 3, or more products ALWAYS scroll infinitely without any blank gaps or stopping!
  const repeatCount = Math.max(2, Math.ceil(10 / activeItems.length));

  return (
    <section className="w-full bg-white border-b border-[#F0DAAA]/30 overflow-hidden relative select-none">
      <div className="py-2.5 transition-colors hover:bg-[#FAF7F0]">
        <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
          {/* Two identical tracks ensure a 100% gapless, seamless infinite loop at translateX(-50%) */}
          {[0, 1].map((trackIdx) => (
            <div
              key={trackIdx}
              className="flex items-center shrink-0"
              aria-hidden={trackIdx === 1 ? 'true' : undefined}
            >
              {[...Array(repeatCount)].map((_, loopIdx) => (
                <div key={loopIdx} className="flex items-center shrink-0">
                  {activeItems.map((item, itemIdx) => (
                    <Link
                      key={`${trackIdx}-${loopIdx}-${itemIdx}-${item.id}`}
                      href={item.link || '/shop'}
                      className="flex items-center shrink-0 group/item cursor-pointer focus:outline-none"
                      title={`${item.name} - Click to explore`}
                    >
                      {/* Product or Offer Thumbnail (32x32px) */}
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#108283]/20 bg-white shrink-0 shadow-xs flex items-center justify-center">
                        <img
                          src={item.image || '/clinic-logo-icon.png'}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          loading="eager"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/clinic-logo-icon.png';
                          }}
                        />
                      </div>

                      {/* Item Name in Source Sans 3 font */}
                      <span className="ml-2.5 font-['Source_Sans_3'] text-xs sm:text-sm font-medium text-gray-800 whitespace-nowrap group-hover/item:text-[#108283] transition-colors">
                        {item.name}
                      </span>

                      {/* Dynamic Pill Badge */}
                      <span className={`ml-2 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 shadow-xs ${getBadgeStyle(item.badgeColor)}`}>
                        {item.badge}
                      </span>

                      {/* Round Dot Divider */}
                      <div
                        className="mx-8 sm:mx-12 flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#108283]/35" />
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
