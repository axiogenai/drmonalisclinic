import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Homeopathy Treatments Kolhapur | Kidney Stones, PCOD, Eczema, Height Growth | Dr. Monali',
  description:
    'Expert homeopathic treatments at Dr. Monali\'s Clinic Kolhapur. Constitutional treatment for Kidney Stones, PCOD, Eczema, Psoriasis, Piles, Height Growth & Weight Management by Dr. Monali Subhedar & Dr. Sachin Subhedar (BHMS Mumbai). Book now: +91 92094 72224.',
  keywords: [
    'homeopathy treatment kolhapur',
    'homeopathy doctor kolhapur',
    'best homeopathy clinic kolhapur',
    'constitutional homeopathy kolhapur',
    'kidney stone homeopathy kolhapur',
    'kidney stone treatment kolhapur',
    'pcod homeopathy kolhapur',
    'pcod treatment kolhapur',
    'pcos treatment kolhapur',
    'eczema treatment kolhapur',
    'psoriasis homeopathy kolhapur',
    'piles treatment kolhapur',
    'height growth treatment kolhapur',
    'weight loss kolhapur',
    'weight gain treatment kolhapur',
    'dr monali subhedar homeopathy',
    'dr sachin subhedar',
    'homeopathy for skin diseases kolhapur',
    'natural treatment kolhapur',
    'safe homeopathy treatment',
  ],
  alternates: {
    canonical: '/homeopathy',
  },
  openGraph: {
    title: 'Homeopathy Treatments Kolhapur | Dr. Monali\'s Clinic',
    description:
      'Constitutional homeopathic treatments for Kidney Stones, PCOD, Eczema, Psoriasis, Piles, Height Growth & Weight Management. Safe, natural, no side effects.',
    url: 'https://www.drmonalisclinic.com/homeopathy',
  },
};

export default function HomeopathyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
