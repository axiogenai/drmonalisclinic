import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Book Doctor Consultation | Dr. Monali Subhedar Clinic Kolhapur',
  description:
    'Schedule your appointment with Dr. Monali Subhedar & Dr. Sachin Subhedar in Kolhapur. Personalized consultations for skin diseases, hair fall, homeopathy & cosmetology. Mon–Sat: 10 AM–2 PM & 5–9 PM. Call: +91 92094 72224.',
  keywords: [
    'book appointment dr monali clinic',
    'doctor consultation kolhapur',
    'homeopathy doctor appointment kolhapur',
    'skin doctor appointment kolhapur',
    'hair specialist appointment kolhapur',
    'dr monali subhedar appointment',
    'dr sachin subhedar consultation',
    'clinic near ring road kolhapur booking',
  ],
  alternates: {
    canonical: '/appointment',
  },
  openGraph: {
    title: 'Book Consultation | Dr. Monali\'s Homeopathy & Skin Clinic Kolhapur',
    description:
      'Book an in-clinic or online consultation with Dr. Monali Subhedar & Dr. Sachin Subhedar in Kolhapur. Mon–Sat 10 AM–2 PM & 5–9 PM.',
    url: 'https://www.drmonalisclinic.com/appointment',
    images: [{ url: '/clinic-logo.png', width: 1200, height: 630, alt: 'Book Appointment Dr Monali Clinic' }],
  },
};

export default function AppointmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
