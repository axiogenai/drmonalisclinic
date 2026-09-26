import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Patient Privacy Policy | Dr. Monali\'s Clinic Kolhapur',
  description:
    'Patient privacy and clinical confidentiality guidelines at Dr. Monali\'s Homeopathy, Skin & Hair Clinic Kolhapur. Zero third-party commercial data sharing and medical-grade confidentiality standards.',
  keywords: [
    'privacy policy dr monali clinic',
    'patient confidentiality kolhapur clinic',
    'medical data protection homeopathy',
  ],
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Dr. Monali\'s Clinic Kolhapur',
    description:
      'Patient privacy guidelines and medical confidentiality at Dr. Monali\'s Homeopathy Clinic, Kolhapur.',
    url: 'https://www.drmonalisclinic.com/privacy-policy',
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
