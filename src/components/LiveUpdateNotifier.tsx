'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminData } from '@/context/AdminDataContext';
import { X, RefreshCw } from 'lucide-react';

export default function LiveUpdateNotifier() {
  const pathname = usePathname();
  const { lastLiveUpdate, clearLiveUpdate } = useAdminData();
  const [visible, setVisible] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<{ label: string; timestamp: number } | null>(null);

  // Do not show the public visitor toast while managing the admin console
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin || !lastLiveUpdate) {
      setVisible(false);
      return;
    }

    setCurrentNotice(lastLiveUpdate);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      clearLiveUpdate();
    }, 5000);

    return () => clearTimeout(timer);
  }, [lastLiveUpdate, isAdmin, clearLiveUpdate]);

  if (isAdmin || !visible || !currentNotice) {
    return null;
  }

  return (
    <aside
      aria-label="Live Content Update Notification"
      className="fixed bottom-5 right-5 z-[99999] pointer-events-auto max-w-sm sm:max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0a5e5f]/95 text-white backdrop-blur-md rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.25)] border border-[#108283]/40">
        {/* Pulsing Emerald Live Status Dot (Strictly no sparkles) */}
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1 font-['Source_Sans_3']">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Live Update (5s Sync)
            </span>
            <span className="text-[10px] text-gray-300">Just now</span>
          </div>
          <p className="text-xs text-white/95 leading-snug mt-0.5 truncate">
            {currentNotice.label} updated from clinic admin
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            clearLiveUpdate();
          }}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5-Second Animated Progress Bar */}
      <div className="h-1 w-full bg-white/10 rounded-b-2xl overflow-hidden -mt-1">
        <div 
          className="h-full bg-emerald-400 transition-all duration-[5000ms] ease-linear w-0"
          style={{ width: '100%', animation: 'shrinkWidth 5s linear forwards' }}
        />
      </div>

      <style jsx>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </aside>
  );
}
