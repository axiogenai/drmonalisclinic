import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductAnnouncementBanner from '@/components/ProductAnnouncementBanner';
import ConfidenceSection from '@/components/ConfidenceSection';
import AboutDoctorSection from '@/components/AboutDoctorSection';
import ServicesSection from '@/components/ServicesSection';
import SkinDiagnostic from '@/components/SkinDiagnostic';
import ServiceMarquee from '@/components/ServiceMarquee';
import ResultsSection from '@/components/ResultsSection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import AppointmentSection from '@/components/AppointmentSection';
import DermatologistGuide from '@/components/DermatologistGuide';
import FAQSection from '@/components/FAQSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import CTABanner from '@/components/CTABanner';
import Footer from '@/components/Footer';
import ContactWidget from '@/components/ContactWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden w-full">
      <Navbar />
      <HeroSection />
      <ProductAnnouncementBanner />
      <ConfidenceSection />
      <AboutDoctorSection />
      <ServicesSection />
      <SkinDiagnostic />
      <ServiceMarquee />
      <ResultsSection />
      <FeaturedProductsSection />
      <AppointmentSection />
      <DermatologistGuide />
      <FAQSection />
      <TestimonialsSection />
      <BlogSection />
      <CTABanner />
      <Footer />
      <ContactWidget />
    </main>
  );
}
