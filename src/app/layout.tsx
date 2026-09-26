import type { Metadata, Viewport } from 'next';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { CartProvider } from '@/context/CartContext';
import { AdminDataProvider } from '@/context/AdminDataContext';
import { DialogProvider } from '@/context/DialogContext';
import CartDrawer from '@/components/CartDrawer';
import LocalClinicSchema from '@/components/LocalClinicSchema';
import LiveUpdateNotifier from '@/components/LiveUpdateNotifier';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.drmonalisclinic.com';

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
    'Dr. Monali\'s Homeopathy, Skin & Hair Clinic Kolhapur — Ranked #1 by patients. Led by Dr. Monali Subhedar & Dr. Sachin Subhedar (BHMS Mumbai). Specialized in constitutional homeopathy, acne, psoriasis, hair fall PRP, medifacials, chemical peels, PCOD, kidney stones & height growth therapy. Serving Kolhapur, Ichalkaranji, Sangli, Satara & all of Maharashtra.',
  keywords: [
    // Doctor Name Searches
    'dr monali subhedar',
    'dr monali subhedar kolhapur',
    'dr monali homeopathy',
    'dr monali skin clinic',
    'dr monali hair clinic',
    'dr monali cosmetologist',
    'dr sachin subhedar',
    'dr sachin subhedar kolhapur',
    'dr monali and sachin subhedar',
    'monali clinic',
    'monali clinic kolhapur',
    'monali homeopathy clinic',
    'monali skin clinic kolhapur',
    // Clinic Name Searches
    'dr monalis clinic',
    'dr monalis homeopathy clinic',
    'drmonalisclinic',
    'drmonalisclinic.com',
    'drmonali clinic kolhapur',
    'dr monalis clinic kolhapur',
    // Kolhapur Local Searches
    'best clinic in kolhapur',
    'top clinic kolhapur',
    'best doctor in kolhapur',
    'best homeopathy clinic in kolhapur',
    'homeopathic doctor kolhapur',
    'homeopathy doctor near me kolhapur',
    'best skin clinic in kolhapur',
    'skin specialist in kolhapur',
    'dermatologist in kolhapur',
    'best hair clinic in kolhapur',
    'hair specialist in kolhapur',
    'cosmetologist in kolhapur',
    'cosmetic clinic kolhapur',
    'cosmetology clinic kolhapur',
    'trichologist kolhapur',
    'clinic near ring road kolhapur',
    'clinic golden spring apartment kolhapur',
    'doctor near me kolhapur',
    // Treatment Searches
    'acne treatment kolhapur',
    'acne scar treatment kolhapur',
    'pimple treatment kolhapur',
    'pigmentation treatment kolhapur',
    'melasma treatment kolhapur',
    'medifacial kolhapur',
    'chemical peel kolhapur',
    'hair fall treatment kolhapur',
    'hair prp in kolhapur',
    'hair prp therapy kolhapur',
    'hair loss treatment kolhapur',
    'hair thinning treatment kolhapur',
    'psoriasis treatment kolhapur',
    'eczema treatment kolhapur',
    'vitiligo treatment kolhapur',
    'skin disease treatment kolhapur',
    'pcod treatment kolhapur',
    'pcos treatment kolhapur',
    'pcod homeopathy kolhapur',
    'kidney stone treatment kolhapur',
    'kidney stone homeopathy kolhapur',
    'piles treatment kolhapur',
    'height growth treatment kolhapur',
    'weight loss treatment kolhapur',
    'weight gain treatment kolhapur',
    'anti aging treatment kolhapur',
    'botox alternative kolhapur',
    'skin booster kolhapur',
    'microneedling kolhapur',
    'mesotherapy kolhapur',
    'skin prp kolhapur',
    'mole removal kolhapur',
    'wart removal kolhapur',
    // Nearby City Searches
    'homeopathy clinic ichalkaranji',
    'skin clinic ichalkaranji',
    'best clinic sangli',
    'homeopathy doctor satara',
    'best homeopathy clinic maharashtra',
    // Google/Search Intent Phrases
    'best homeopathy doctor for skin',
    'homeopathy for hair fall',
    'constitutional homeopathy treatment',
    'safe skin treatment without steroids',
    'natural treatment for psoriasis',
    'homeopathy clinic near me',
    'online homeopathy consultation kolhapur',
    'book appointment kolhapur clinic',
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/clinic-logo-icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Favicon Guidelines Standard (Multi-resolution + multiples of 48px) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48" />
        <link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/favicon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/clinic-logo-icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
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
              <LiveUpdateNotifier />
            </DialogProvider>
          </CartProvider>
        </AdminDataProvider>
      </body>
    </html>
  );
}
