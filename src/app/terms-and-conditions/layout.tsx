import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Dr. Monali\'s Clinic Kolhapur',
  description:
    'Terms of clinical service, outpatient consultation policies, and medicine storage guidelines for Dr. Monali\'s Homeopathy, Skin & Hair Clinic in Kolhapur, Maharashtra.',
  keywords: [
    'terms and conditions dr monali clinic',
    'clinic terms kolhapur',
    'homeopathy clinic guidelines',
  ],
  alternates: {
    canonical: '/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms & Conditions | Dr. Monali\'s Clinic Kolhapur',
    description:
      'Consultation guidelines and clinical terms for Dr. Monali\'s Homeopathy Clinic in Kolhapur.',
    url: 'https://www.drmonalisclinic.com/terms-and-conditions',
  },
};

export default function TermsAndConditionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
