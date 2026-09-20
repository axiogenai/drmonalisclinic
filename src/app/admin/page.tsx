'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardOverview from '@/components/admin/DashboardOverview';
import AppointmentsManager from '@/components/admin/AppointmentsManager';
import ProductsManager from '@/components/admin/ProductsManager';
import ServicesManager from '@/components/admin/ServicesManager';
import TestimonialsManager from '@/components/admin/TestimonialsManager';
import FAQManager from '@/components/admin/FAQManager';
import BlogManager from '@/components/admin/BlogManager';
import MarqueeManager from '@/components/admin/MarqueeManager';
import ResultsManager from '@/components/admin/ResultsManager';

function AdminContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  
  switch (tab) {
    case 'appointments': return <AppointmentsManager />;
    case 'services': return <ServicesManager />;
    case 'results': return <ResultsManager />;
    case 'products': return <ProductsManager />;
    case 'blogs': return <BlogManager />;
    case 'testimonials': return <TestimonialsManager />;
    case 'faqs': return <FAQManager />;
    case 'marquee': return <MarqueeManager />;
    default: return <DashboardOverview />;
  }
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <AdminContent />
    </Suspense>
  );
}
