'use client';

import React from 'react';
import ServiceDetailPage from '../../components/ServiceDetailPage';
import { useAdminData } from '@/context/AdminContext';
import { defaultServices } from '@/data/services';

export default function CosmeticTreatmentsPage() {
  const { services } = useAdminData();
  
  const cosmeticServices = (services && services.length > 0
    ? services.filter(s => s.category === 'cosmetic')
    : []
  );

  const finalServices = cosmeticServices.length > 0 
    ? cosmeticServices 
    : defaultServices.filter(s => s.category === 'cosmetic');

  return (
    <ServiceDetailPage
      categoryTitle="Cosmetic Treatments"
      categorySubtitle="Advanced medical cosmetology and aesthetic procedures combined with holistic care to reveal clear, radiant, and youthful skin."
      services={finalServices as any}
    />
  );
}
