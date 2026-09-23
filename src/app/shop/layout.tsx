import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Clinical Skincare & Hair Products | In-Clinic Pickup Kolhapur',
  description:
    'Shop dermatologist & homeopath-approved skin and hair care products. Gentle foaming cleansers, brightening vitamin serums, hair growth oils & mineral sunscreens. In-clinic pickup in Kolhapur & Maharashtra delivery.',
  keywords: [
    'skincare products kolhapur',
    'doctor recommended skincare kolhapur',
    'hair growth serum kolhapur',
    'sunscreen kolhapur clinic',
    'homeopathy medicines online kolhapur',
    'clinic pickup kolhapur',
  ],
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Clinical Skincare & Hair Care Products | Dr. Monali Clinic Kolhapur',
    description:
      'Dermatologist-formulated skin and hair care essentials. Safe, non-comedogenic, and scientifically backed.',
    url: 'https://drmonalisclinic.com/shop',
    images: [{ url: '/clinic-logo.png', width: 1200, height: 630, alt: 'Skincare Products Kolhapur' }],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
