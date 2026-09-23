'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBag, 
  Stethoscope, 
  MessageSquareQuote, 
  HelpCircle, 
  FileText, 
  Settings,
  Megaphone,
  Images,
  X,
  LogOut,
  Home
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
  { name: 'Appointments', id: 'appointments', icon: Calendar },
  { name: 'Services', id: 'services', icon: Stethoscope },
  { name: 'Products', id: 'products', icon: ShoppingBag },
  { name: 'Before & After', id: 'results', icon: Images },
  { name: 'Testimonials', id: 'testimonials', icon: MessageSquareQuote },
  { name: 'FAQs', id: 'faqs', icon: HelpCircle },
  { name: 'Blog Posts', id: 'blogs', icon: FileText },
  { name: 'Marquee Banner', id: 'marquee', icon: Megaphone },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const searchParams = useSearchParams();
  const { signOut } = useAdminAuth();
  const activeTab = searchParams.get('tab') || 'dashboard';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-[#0a5e5f] text-white z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <div>
            <h2 className="font-playfair text-xl font-bold">Dr. Monali's</h2>
            <p className="text-xs text-[#FAEDDA]/80 tracking-wider uppercase">Admin Panel</p>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Link
                key={item.id}
                href={`/admin?tab=${item.id}`}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors relative ${
                  isActive 
                    ? 'bg-[#108283] text-white font-medium' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#61CE70] rounded-r-md" />
                )}
                <Icon size={18} className={isActive ? "text-[#61CE70]" : ""} />
                <span className="font-source">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 shrink-0 space-y-2">
          <Link
            href="https://drmonalisclinic.com"
            className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <Home size={18} />
            <span className="font-source text-sm">Back to Public Site</span>
          </Link>
          <button
            onClick={() => {
              signOut();
              onClose();
            }}
            className="flex items-center gap-3 px-3 py-2 text-[#F0A070] hover:text-white hover:bg-white/5 rounded-md transition-colors w-full text-left cursor-pointer"
          >
            <LogOut size={18} />
            <span className="font-source text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
