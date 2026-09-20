'use client';

import React from 'react';
import ServiceDetailPage from '../../components/ServiceDetailPage';
import { useAdminData } from '@/context/AdminContext';
import { defaultServices } from '@/data/services';

export default function HomeopathyPage() {
  const { services } = useAdminData();
  
  const homeopathyServices = (services && services.length > 0
    ? services.filter(s => s.category === 'homeopathy')
    : []
  );

  const finalServices = homeopathyServices.length > 0 
    ? homeopathyServices 
    : defaultServices.filter(s => s.category === 'homeopathy');

  return (
    <ServiceDetailPage
      categoryTitle="Homeopathy Treatments"
      categorySubtitle="Gentle, non-invasive, and constitutional healing rooted in natural principles. Safe for children, adults, and seniors with zero side effects."
      services={finalServices as any}
    />
  );
}
