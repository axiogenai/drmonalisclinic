import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hair & Skin Treatments Kolhapur | PRP, Mesotherapy, Microneedling | Dr. Monali',
  description:
    'Advanced hair & skin regeneration at Dr. Monali\'s Clinic Kolhapur. Hair PRP, Skin PRP, Mesotherapy, Microneedling & High-Frequency Therapy for hair loss, acne scars & skin renewal. Dr. Monali Subhedar. Call: +91 92094 72224.',
  keywords: [
    'hair treatment kolhapur',
    'hair fall treatment kolhapur',
    'hair prp kolhapur',
    'hair prp therapy kolhapur',
    'hair loss treatment kolhapur',
    'hair thinning treatment kolhapur',
    'alopecia treatment kolhapur',
    'skin prp kolhapur',
    'mesotherapy kolhapur',
    'microneedling kolhapur',
    'high frequency therapy kolhapur',
    'skin rejuvenation kolhapur',
    'collagen therapy kolhapur',
    'hair restoration kolhapur',
    'prp treatment kolhapur',
    'trichologist kolhapur',
    'hair specialist kolhapur',
    'skin specialist kolhapur',
    'dr monali hair treatment',
    'best hair clinic kolhapur',
  ],
  alternates: {
    canonical: '/hair-and-skin',
  },
  openGraph: {
    title: 'Hair & Skin Treatments Kolhapur | Dr. Monali\'s Clinic',
    description:
      'Hair PRP, Skin PRP, Mesotherapy & Microneedling for hair loss, thinning & skin renewal at Dr. Monali\'s Clinic Kolhapur.',
    url: 'https://www.drmonalisclinic.com/hair-and-skin',
  },
};

export default function HairAndSkinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
