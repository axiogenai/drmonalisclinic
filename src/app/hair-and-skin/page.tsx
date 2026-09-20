'use client';

import React from 'react';
import ServiceDetailPage from '../../components/ServiceDetailPage';
import { useAdminData } from '@/context/AdminContext';
import { defaultServices } from '@/data/services';

export default function HairAndSkinPage() {
  const { services } = useAdminData();
  
  const hairSkinServices = (services && services.length > 0
    ? services.filter(s => s.category === 'hair-skin')
    : []
  );

  const finalServices = hairSkinServices.length > 0 
    ? hairSkinServices 
    : defaultServices.filter(s => s.category === 'hair-skin');

  return (
    <ServiceDetailPage
      categoryTitle="Hair & Skin Treatments"
      categorySubtitle="Regenerative aesthetic therapies using autologous growth factors and advanced micro-infusion technology for hair restoration and skin remodeling."
      services={finalServices as any}
    />
  );
}
