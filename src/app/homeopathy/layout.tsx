import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Homeopathy Treatments in Kolhapur | Skin, Psoriasis, Vitiligo & Chronic Care',
  description:
    'Best constitutional homeopathy clinic in Kolhapur. Non-steroidal, natural root-cause treatment for Psoriasis, Vitiligo, Eczema, Kidney Stones, PCOD, Allergies, and Pediatric Growth by Dr. Monali Subhedar.',
  keywords: [
    'homeopathy clinic kolhapur',
    'best homeopathy doctor kolhapur',
    'psoriasis treatment kolhapur',
    'vitiligo homeopathy kolhapur',
    'eczema natural cure kolhapur',
    'kidney stone homeopathy kolhapur',
    'pcod treatment kolhapur homeopathy',
    'pediatric growth homeopathy kolhapur',
    'constitutional homeopathy maharashtra',
  ],
  alternates: {
    canonical: '/homeopathy',
  },
  openGraph: {
    title: 'Homeopathy Treatments in Kolhapur | Dr. Monali Subhedar',
    description:
      'Root-cause constitutional homeopathic treatments for chronic skin diseases, kidney stones, PCOD, and pediatric care in Kolhapur.',
    url: 'https://drmonalisclinic.com/homeopathy',
    images: [{ url: '/hero-model.png', width: 1200, height: 630, alt: 'Homeopathy Treatments Kolhapur' }],
  },
};

export default function HomeopathyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
