import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Cosmetic & Aesthetic Treatments in Kolhapur | Medifacials, Peels & Anti-Aging',
  description:
    'Advanced cosmetology clinic in Kolhapur. Dermatologist-grade Hydra-Derm medifacials, chemical peels, hyperpigmentation removal, anti-aging collagen therapy & acne scar remodeling by Dr. Monali Subhedar.',
  keywords: [
    'cosmetic clinic kolhapur',
    'cosmetology clinic kolhapur',
    'medifacial kolhapur',
    'chemical peel kolhapur',
    'skin glow treatment kolhapur',
    'anti aging clinic kolhapur',
    'pigmentation removal kolhapur',
    'acne scar treatment kolhapur',
    'aesthetic dermatologist kolhapur',
  ],
  alternates: {
    canonical: '/cosmetic-treatments',
  },
  openGraph: {
    title: 'Cosmetic & Aesthetic Treatments in Kolhapur | Dr. Monali Clinic',
    description:
      'Premier cosmetic clinic in Kolhapur for medifacials, chemical peels, skin rejuvenation, and scar remodeling.',
    url: 'https://drmonalisclinic.com/cosmetic-treatments',
    images: [{ url: '/hero-model.png', width: 1200, height: 630, alt: 'Cosmetic Treatments Kolhapur' }],
  },
};

export default function CosmeticLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
