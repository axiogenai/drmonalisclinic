'use client';

import React, { useState, Suspense } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#F8FAFB] overflow-x-hidden">
      {/* Sidebar */}
      <Suspense fallback={<aside className="w-[260px] bg-[#0a5e5f] h-screen hidden lg:block" />}>
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Suspense>
      
      {/* Main Content Wrapper */}
      <div className="lg:pl-[260px] flex flex-col min-h-screen w-full min-w-0">
        <Suspense fallback={<header className="h-16 bg-white border-b border-gray-100" />}>
          <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        </Suspense>
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
