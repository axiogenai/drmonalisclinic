'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import AdminLogin from '@/components/admin/AdminLogin';
import { Loader2 } from 'lucide-react';

function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isPasswordRecovery } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. Session verification loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center font-['Source_Sans_3']">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#108283] to-[#0a5e5f] p-3 shadow-xl mb-4 flex items-center justify-center animate-pulse">
            <Image
              src="/clinic-logo-icon.png"
              alt="Dr. Monali's Clinic"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Loader2 className="w-4 h-4 text-[#108283] animate-spin" />
            <span>Verifying Staff Session...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated or Password Recovery Mode: Show clinical Supabase login/reset portal
  if (!isAuthenticated || isPasswordRecovery) {
    return <AdminLogin />;
  }

  // 3. Authenticated: Render full clinical management dashboard
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminAuthGate>
        {children}
      </AdminAuthGate>
    </AdminAuthProvider>
  );
}
