'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const searchParams = useSearchParams();
  const { user, signOut } = useAdminAuth();
  const tab = searchParams.get('tab') || 'dashboard';
  
  // Convert tab to Title Case
  let pageTitle = tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ');
  if (tab === 'marquee') pageTitle = 'Announcement Marquee Banner';
  if (tab === 'coupons') pageTitle = 'Coupons & Discounts';
  if (tab === 'about') pageTitle = 'About & Doctors CMS';
  if (tab === 'footer') pageTitle = 'Footer & Clinic Info';

  // Get user display info
  const userEmail = user?.email || 'admin@drmonalisclinic.com';
  const userInitials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'DM';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 font-['Source_Sans_3']">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-['Playfair_Display'] text-xl font-semibold text-[#188D90] capitalize">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-gray-800 truncate max-w-[180px]">{userEmail}</p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Active Staff</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#108283] text-white flex items-center justify-center font-['Playfair_Display'] font-semibold text-xs shadow-xs ring-2 ring-[#FAEDDA]/60">
            {userInitials}
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors cursor-pointer"
            title="Sign out of Admin Panel"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
