import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'About Dr. Monali Subhedar & Dr. Sachin Subhedar | Best Doctors in Kolhapur',
  description:
    'Meet Dr. Monali Subhedar (BHMS, MD Homeopathy, Cosmetologist) and Dr. Sachin Subhedar. Over 15+ years of constitutional homeopathic care and clinical aesthetics in Kolhapur, Maharashtra.',
  keywords: [
    'about dr monali subhedar',
    'dr monali subhedar qualifications',
    'dr sachin subhedar kolhapur',
    'best homeopathic doctor in kolhapur',
    'top homeopath kolhapur',
    'homeopathy clinic founder kolhapur',
    'experienced dermatologist kolhapur',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Dr. Monali Subhedar & Dr. Sachin Subhedar | Kolhapur Clinic',
    description:
      'Learn about Dr. Monali Subhedar & Dr. Sachin Subhedar — 15+ years of constitutional healing, cosmetology, and personalized care in Kolhapur.',
    url: 'https://drmonalisclinic.com/about',
    images: [{ url: '/aboutdoc.png', width: 1200, height: 630, alt: 'Dr. Monali Subhedar' }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
