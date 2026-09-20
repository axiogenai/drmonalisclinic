'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Menu, Bell } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  
  // Convert tab to Title Case
  const pageTitle = tab === 'marquee' 
    ? 'Announcement Marquee Banner' 
    : tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ');

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-playfair text-xl font-semibold text-[#188D90] capitalize">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F0A070] rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-700 font-source">Dr. Monali</p>
            <p className="text-xs text-gray-500 font-source">Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#108283] text-white flex items-center justify-center font-playfair font-semibold text-sm shadow-sm ring-2 ring-[#FAEDDA]/50">
            DM
          </div>
        </div>
      </div>
    </header>
  );
}
