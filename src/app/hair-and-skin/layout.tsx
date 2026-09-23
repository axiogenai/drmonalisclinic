import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Hair & Skin Clinic Kolhapur | Hair Fall PRP & Advanced Dermatology',
  description:
    'Best Hair & Skin Clinic in Kolhapur. Autologous Hair PRP Therapy, alopecia treatments, hair thinning reversal, acne control, and skin rejuvenation under expert supervision of Dr. Monali Subhedar.',
  keywords: [
    'hair clinic kolhapur',
    'hair fall treatment in kolhapur',
    'hair prp kolhapur',
    'best skin specialist kolhapur',
    'alopecia treatment kolhapur',
    'hair regrowth clinic kolhapur',
    'dermatology clinic near ring road kolhapur',
    'scalp treatment kolhapur',
    'hair thinning solutions kolhapur',
  ],
  alternates: {
    canonical: '/hair-and-skin',
  },
  openGraph: {
    title: 'Hair & Skin Clinic Kolhapur | Hair Fall PRP & Dermatology',
    description:
      'Proven hair regrowth PRP treatments and clinical dermatology in Kolhapur. Book a consultation with Dr. Monali Subhedar.',
    url: 'https://drmonalisclinic.com/hair-and-skin',
    images: [{ url: '/hero-model.png', width: 1200, height: 630, alt: 'Hair and Skin Clinic Kolhapur' }],
  },
};

export default function HairAndSkinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
