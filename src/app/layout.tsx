import type { Metadata, Viewport } from 'next';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { CartProvider } from '@/context/CartContext';
import { AdminDataProvider } from '@/context/AdminDataContext';
import { DialogProvider } from '@/context/DialogContext';
import CartDrawer from '@/components/CartDrawer';
import LocalClinicSchema from '@/components/LocalClinicSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drmonalisclinic.com';

export const viewport: Viewport = {
  themeColor: '#108283',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dr. Monali's Homeopathy, Skin & Hair Clinic Kolhapur | Best Clinic in Kolhapur",
    template: "%s | Dr. Monali's Clinic Kolhapur",
  },
  description:
    'Ranked #1 Homeopathy, Skin Care & Hair Clinic in Kolhapur. Led by Dr. Monali Subhedar & Dr. Sachin Subhedar. Specializing in constitutional homeopathy, hair fall PRP, acne scars, psoriasis, vitiligo & clinical medifacials near Ring Road, Kolhapur.',
  keywords: [
    'best clinic in kolhapur',
    'best homeopathy clinic in kolhapur',
    'homeopathic doctor in kolhapur',
    'best skin clinic in kolhapur',
    'dermatologist in kolhapur',
    'skin specialist in kolhapur',
    'dr monali subhedar',
    'dr sachin subhedar',
    'dr monali homeopathy clinic kolhapur',
    'hair fall treatment kolhapur',
    'hair prp in kolhapur',
    'acne scar treatment kolhapur',
    'medifacial kolhapur',
    'psoriasis treatment kolhapur',
    'vitiligo homeopathy kolhapur',
    'pcod homeopathy kolhapur',
    'kidney stone treatment kolhapur',
    'near ring road kolhapur clinic',
    'cosmetic clinic kolhapur',
    'trichologist kolhapur',
    'homeopathy doctor near me kolhapur',
    'cosmetology clinic kolhapur',
  ],
  authors: [
    { name: 'Dr. Monali Subhedar', url: 'https://drmonalisclinic.com/about' },
    { name: 'Dr. Sachin Subhedar', url: 'https://drmonalisclinic.com/about' },
  ],
  creator: "Dr. Monali's Clinic",
  publisher: "Dr. Monali's Homeopathy, Skin & Hair Clinic",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: "Dr. Monali's Homeopathy, Skin & Hair Clinic Kolhapur",
    title: "Dr. Monali's Homeopathy, Skin & Hair Clinic | Best Clinic in Kolhapur",
    description:
      'Ranked #1 Homeopathy, Skin & Hair Clinic in Kolhapur. Constitutional medical healing & modern clinical aesthetics by Dr. Monali Subhedar.',
    images: [
      {
        url: '/clinic-logo.png',
        width: 1200,
        height: 630,
        alt: "Dr. Monali's Homeopathy, Skin & Hair Clinic Kolhapur",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dr. Monali's Homeopathy, Skin & Hair Clinic Kolhapur",
    description:
      'Ranked #1 Homeopathy, Skin & Hair Clinic in Kolhapur. Led by Dr. Monali Subhedar & Dr. Sachin Subhedar.',
    images: ['/clinic-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/clinic-logo-icon.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/clinic-logo-icon.png',
    apple: '/clinic-logo-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/clinic-logo-icon.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/clinic-logo-icon.png" />
        
        {/* Geo Meta Tags for Kolhapur Local Pack #1 Ranking */}
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Kolhapur" />
        <meta name="geo.position" content="16.6956;74.2317" />
        <meta name="ICBM" content="16.6956, 74.2317" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=Roboto:wght@400;500;600;700&family=Roboto+Slab:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased bg-white text-gray-900 selection:bg-[#108283] selection:text-white">
        <LocalClinicSchema />
        <AdminDataProvider>
          <CartProvider>
            <DialogProvider>
              <SmoothScroll />
              {children}
              <CartDrawer />
            </DialogProvider>
          </CartProvider>
        </AdminDataProvider>
      </body>
    </html>
  );
}
