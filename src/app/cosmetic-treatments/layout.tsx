import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cosmetic Treatments Kolhapur | Medifacial, Chemical Peel, Anti-Aging | Dr. Monali',
  description:
    'Advanced cosmetic treatments at Dr. Monali\'s Clinic Kolhapur. Medifacial, Chemical Peel, Anti-Acne, Anti-Aging, Pigmentation, Mole & Wart Removal by Dr. Monali Subhedar. Book: +91 92094 72224.',
  keywords: [
    'cosmetic treatments kolhapur',
    'medifacial kolhapur',
    'chemical peel kolhapur',
    'anti acne treatment kolhapur',
    'acne treatment kolhapur',
    'pimple treatment kolhapur',
    'acne scar treatment kolhapur',
    'anti aging treatment kolhapur',
    'pigmentation treatment kolhapur',
    'melasma treatment kolhapur',
    'mole removal kolhapur',
    'wart removal kolhapur',
    'skin tag removal kolhapur',
    'cosmetologist kolhapur',
    'cosmetic clinic kolhapur',
    'skin booster kolhapur',
    'glow facial kolhapur',
    'medical facial kolhapur',
    'dr monali cosmetic clinic',
    'best cosmetic clinic kolhapur',
    'skin specialist kolhapur',
  ],
  alternates: {
    canonical: '/cosmetic-treatments',
  },
  openGraph: {
    title: 'Cosmetic Treatments Kolhapur | Dr. Monali\'s Clinic',
    description:
      'Medical-grade cosmetic procedures: Medifacials, Chemical Peels, Pigmentation, Anti-Aging, Acne Scars & Mole Removal at Dr. Monali\'s Clinic Kolhapur.',
    url: 'https://www.drmonalisclinic.com/cosmetic-treatments',
  },
};

export default function CosmeticTreatmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
