import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { CartProvider } from '@/context/CartContext';
import { AdminDataProvider } from '@/context/AdminDataContext';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: "Dr. Monali's Homeopathy Clinic - Kolhapur",
  description: 'Homeopathy, Skin Care, Hair Care & Cosmetic Treatments by Dr. Monali Subhedar & Dr. Sachin Subhedar in Kolhapur',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=Roboto:wght@400;500;600;700&family=Roboto+Slab:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased bg-white text-gray-900 selection:bg-[#108283] selection:text-white">
        <AdminDataProvider>
          <CartProvider>
            <SmoothScroll />
            {children}
            <CartDrawer />
          </CartProvider>
        </AdminDataProvider>
      </body>
    </html>
  );
}
