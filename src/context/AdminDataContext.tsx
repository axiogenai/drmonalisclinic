'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';
import { Service, Testimonial, FAQ, BlogPost, Appointment, SiteSettings, MarqueeItem, MarqueeSettings, ResultItem, FooterSettings, AboutSettings, Coupon, CouponValidationResult } from '@/types/admin';
import { 
  getAppointmentsFromDb, 
  saveAppointmentToDb, 
  updateAppointmentStatusInDb, 
  deleteAppointmentFromDb, 
  isSupabaseConfigured 
} from '@/lib/supabase';
import { products as defaultProducts } from '@/data/products';
import { defaultServices } from '@/data/services';
import { defaultMarqueeItems, defaultMarqueeSettings } from '@/data/marquee';
import { defaultResults } from '@/data/results';
import { defaultFooterSettings, defaultAboutSettings } from '@/data/defaultAboutAndFooter';
import { defaultCoupons } from '@/data/defaultCoupons';

interface AdminDataContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  recordCouponUse: (code: string) => boolean;
  validateCoupon: (code: string, cartTotal: number) => CouponValidationResult;
  resetCoupons: () => void;

  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;

  testimonials: Testimonial[];
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  faqs: FAQ[];
  addFaq: (faq: FAQ) => void;
  updateFaq: (id: string, faq: Partial<FAQ>) => void;
  deleteFaq: (id: string) => void;
  reorderFaqs: (newFaqs: FAQ[]) => void;

  blogs: BlogPost[];
  addBlog: (blog: BlogPost) => void;
  updateBlog: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  deleteAppointment: (id: string) => void;
  clearAppointments: () => void;

  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  footerSettings: FooterSettings;
  updateFooterSettings: (settings: Partial<FooterSettings>) => void;
  resetFooterSettings: () => void;

  aboutSettings: AboutSettings;
  updateAboutSettings: (settings: Partial<AboutSettings>) => void;
  resetAboutSettings: () => void;

  marqueeItems: MarqueeItem[];
  addMarqueeItem: (item: MarqueeItem) => void;
  updateMarqueeItem: (id: string, item: Partial<MarqueeItem>) => void;
  deleteMarqueeItem: (id: string) => void;
  reorderMarqueeItems: (items: MarqueeItem[]) => void;

  marqueeSettings: MarqueeSettings;
  updateMarqueeSettings: (settings: Partial<MarqueeSettings>) => void;

  results: ResultItem[];
  addResult: (result: ResultItem) => void;
  updateResult: (id: string, result: Partial<ResultItem>) => void;
  deleteResult: (id: string) => void;
  restoreDefaultResults: () => void;
}

const defaultTestimonials: Testimonial[] = [
  { id: '1', name: 'Priya M.', review: 'Dr. Monali is incredibly skilled and thorough...', concern: 'Chronic Acne & Skin Health' },
  { id: '2', name: 'Ravi K.', review: 'After struggling with acne and skin allergies for years...', concern: 'Allergies & Skin Recovery' },
  { id: '3', name: 'Sneha R.', review: 'The consultation was very detailed...', concern: 'Hyperpigmentation' },
  { id: '4', name: 'Anil S.', review: 'Best clinical experience I\'ve had...', concern: 'Hair Fall & Scalp Health' },
  { id: '5', name: 'Kavitha P.', review: 'I came in for hair loss treatment...', concern: 'Hair Thinning & Regrowth' },
  { id: '6', name: 'Divya T.', review: 'The holistic care and skin remedies I got here were amazing...', concern: 'Skin Glow & Balance' }
];

const defaultFaqs: FAQ[] = [
  { id: '1', question: "What conditions do you treat at Dr. Monali's Homeopathy Clinic?", answer: 'We specialize in holistic homeopathic care for chronic skin and hair concerns...' },
  { id: '2', question: 'How do I know which treatment is right for me?', answer: 'During your in-depth constitutional consultation...' },
  { id: '3', question: 'Are your treatments safe and free from side effects?', answer: 'Yes, all our homeopathic remedies are completely natural...' },
  { id: '4', question: 'Are your medicines safe to take alongside other treatments?', answer: 'Yes, homeopathic medicines can safely be taken alongside conventional treatments...' },
  { id: '5', question: 'Does the clinic offer online consultations for distant and international clients?', answer: 'Yes, we provide online video consultations...' },
  { id: '6', question: 'How can I book an appointment at the clinic?', answer: 'You can book a consultation by calling us...' }
];

const defaultBlogs: BlogPost[] = [
  { id: '1', image: '/services/anti-acne.png', title: 'Holistic Healing for Acne: Treating Breakouts from the Root', date: 'June 15, 2025', category: 'Skin Health', excerpt: 'Acne affects millions worldwide...' },
  { id: '2', image: '/services/hair-care.png', title: 'Natural Hair Care: Homeopathy for Hair Fall & Scalp Vitality', date: 'June 10, 2025', category: 'Hair Care', excerpt: 'Hair thinning requires holistic care...' },
  { id: '3', image: '/services/homeopathy-skincare.jpg', title: 'The Benefits of Homeopathy: Safe, Gentle & Root-Cause Healing', date: 'June 5, 2025', category: 'Homeopathy', excerpt: 'What makes homeopathic medicine unique?...' }
];

const defaultSettings: SiteSettings = {
  clinicName: "Dr. Monali's Homeopathy, Skin & Hair Clinic",
  phone: '+91 92094 72224',
  whatsapp: '919209472224',
  email: 'drmonalishomeopathy@gmail.com',
  address: 'Golden Spring Apartment, Near Ring Road, Kolhapur, Maharashtra 416012, India',
  heroHeading: 'Advanced Homeopathy, Skin & Hair Clinic',
  heroSubtext: 'Personalized constitutional healing & aesthetic cosmetology with Dr. Monali Subhedar & Dr. Sachin Subhedar'
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [footerSettings, setFooterSettings] = useState<FooterSettings>(defaultFooterSettings);
  const [aboutSettings, setAboutSettings] = useState<AboutSettings>(defaultAboutSettings);
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([]);
  const [marqueeSettings, setMarqueeSettings] = useState<MarqueeSettings>(defaultMarqueeSettings);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const loadData = <T,>(key: string, defaultData: T): T => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultData;
      } catch {
        return defaultData;
      }
    };

    setCoupons(loadData<Coupon[]>('admin_coupons_v1', defaultCoupons));
    setProducts(loadData<Product[]>('admin_products', defaultProducts || []));

    // For services: validate that services belong to the 3 service pages (homeopathy, cosmetic, hair-skin)
    const loadedServices = loadData<Service[]>('admin_services_pages_v1', []);
    const isServicePagesFormat = loadedServices && loadedServices.length > 0 && loadedServices.some(s => 
      s.category === 'homeopathy' || s.category === 'cosmetic' || s.category === 'hair-skin'
    );

    if (isServicePagesFormat) {
      // Ensure price and duration are populated even if older cache exists
      const mergedServices = loadedServices.map((srv) => {
        const defaultMatch = defaultServices.find((ds) => ds.id === srv.id);
        return {
          ...srv,
          price: srv.price || defaultMatch?.price,
          duration: srv.duration || defaultMatch?.duration,
        };
      });
      setServices(mergedServices);
    } else {
      setServices(defaultServices);
      try {
        localStorage.setItem('admin_services_pages_v1', JSON.stringify(defaultServices));
        localStorage.removeItem('admin_services_v2');
        localStorage.removeItem('admin_services');
      } catch {}
    }

    setTestimonials(loadData<Testimonial[]>('admin_testimonials', defaultTestimonials));
    setFaqs(loadData<FAQ[]>('admin_faqs', defaultFaqs));
    setBlogs(loadData<BlogPost[]>('admin_blogs', defaultBlogs));
    // Clean appointments list: purge any dummy/fake test bookings and load clean state
    const loadedAppointments = loadData<Appointment[]>('admin_appointments_v2', []);
    setAppointments(loadedAppointments);
    try {
      localStorage.removeItem('admin_appointments');
    } catch {}
    setSiteSettings(loadData<SiteSettings>('admin_settings', defaultSettings));
    setFooterSettings(loadData<FooterSettings>('admin_footer_settings_v1', defaultFooterSettings));
    setAboutSettings(loadData<AboutSettings>('admin_about_settings_v1', defaultAboutSettings));
    // For marquee items: ensure valid images and purge broken cached items like stroke-logo.png
    const loadedMarquee = loadData<MarqueeItem[]>('admin_marquee_items_v2', []);
    const hasBrokenMarquee = !loadedMarquee || loadedMarquee.length === 0 || loadedMarquee.some(m => 
      !m.image || m.image.includes('stroke-logo')
    );

    if (!hasBrokenMarquee) {
      setMarqueeItems(loadedMarquee);
    } else {
      setMarqueeItems(defaultMarqueeItems);
      try {
        localStorage.setItem('admin_marquee_items_v2', JSON.stringify(defaultMarqueeItems));
        localStorage.removeItem('admin_marquee_items');
      } catch {}
    }

    setMarqueeSettings(loadData<MarqueeSettings>('admin_marquee_settings', defaultMarqueeSettings));

    // For before/after results:
    const loadedResults = loadData<ResultItem[]>('admin_results_v1', []);
    if (loadedResults && loadedResults.length > 0) {
      setResults(loadedResults);
    } else {
      setResults(defaultResults);
      try {
        localStorage.setItem('admin_results_v1', JSON.stringify(defaultResults));
      } catch {}
    }

    // Asynchronously sync appointments with Supabase if configured
    if (isSupabaseConfigured()) {
      getAppointmentsFromDb().then(dbAppts => {
        if (dbAppts && dbAppts.length > 0) {
          setAppointments(prev => {
            const map = new Map();
            prev.forEach(a => map.set(a.id, a));
            dbAppts.forEach(a => map.set(a.id, a));
            return Array.from(map.values());
          });
        }
      });
    }

    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes, after initial load
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_coupons_v1', JSON.stringify(coupons));
    }
  }, [coupons, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded && services.length > 0) {
      localStorage.setItem('admin_services_pages_v1', JSON.stringify(services));
    }
  }, [services, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_testimonials', JSON.stringify(testimonials));
    }
  }, [testimonials, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_faqs', JSON.stringify(faqs));
    }
  }, [faqs, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_blogs', JSON.stringify(blogs));
    }
  }, [blogs, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_appointments_v2', JSON.stringify(appointments));
    }
  }, [appointments, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_settings', JSON.stringify(siteSettings));
    }
  }, [siteSettings, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_footer_settings_v1', JSON.stringify(footerSettings));
    }
  }, [footerSettings, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_about_settings_v1', JSON.stringify(aboutSettings));
    }
  }, [aboutSettings, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_marquee_items_v2', JSON.stringify(marqueeItems));
    }
  }, [marqueeItems, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('admin_marquee_settings', JSON.stringify(marqueeSettings));
    }
  }, [marqueeSettings, isLoaded]);

  useEffect(() => {
    if (isLoaded && results.length > 0) {
      localStorage.setItem('admin_results_v1', JSON.stringify(results));
    }
  }, [results, isLoaded]);

  // Coupon actions
  const addCoupon = (coupon: Coupon) => setCoupons(prev => [coupon, ...prev]);

  const updateCoupon = (id: string, updated: Partial<Coupon>) =>
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));

  const deleteCoupon = (id: string) =>
    setCoupons(prev => prev.filter(c => c.id !== id));

  const resetCoupons = () => {
    setCoupons(defaultCoupons);
    try {
      localStorage.setItem('admin_coupons_v1', JSON.stringify(defaultCoupons));
    } catch {}
  };

  const recordCouponUse = (code: string): boolean => {
    const cleanCode = (code || '').trim().toUpperCase();
    let recorded = false;
    setCoupons(prev =>
      prev.map(c => {
        if (c.code.toUpperCase() === cleanCode) {
          recorded = true;
          return { ...c, usedCount: c.usedCount + 1 };
        }
        return c;
      })
    );
    return recorded;
  };

  const validateCoupon = (code: string, cartTotal: number): CouponValidationResult => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { isValid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
    }

    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);
    if (!coupon) {
      return { isValid: false, discountAmount: 0, message: 'Invalid promo or coupon code.' };
    }

    if (!coupon.isActive) {
      return { isValid: false, discountAmount: 0, message: 'This coupon has been disabled by the clinic.' };
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return { isValid: false, discountAmount: 0, message: 'This coupon offer is not active yet.' };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      const expDate = new Date(coupon.expiresAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      return { isValid: false, discountAmount: 0, message: `This coupon expired on ${expDate}.` };
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return { isValid: false, discountAmount: 0, message: `This coupon has reached its maximum redemptions limit (${coupon.maxUses}/${coupon.maxUses} used).` };
    }

    if (coupon.minOrderAmount > 0 && cartTotal < coupon.minOrderAmount) {
      return { 
        isValid: false, 
        discountAmount: 0, 
        message: `Requires a minimum cart value of ₹${coupon.minOrderAmount} (Current: ₹${cartTotal}).` 
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, cartTotal);

    return {
      isValid: true,
      coupon,
      discountAmount: discount,
      message: `Coupon "${coupon.code}" applied! You saved ₹${discount}.`
    };
  };

  // Product actions
  const addProduct = (product: Product) => setProducts([...products, product]);
  const updateProduct = (id: string, updated: Partial<Product>) => 
    setProducts(products.map(p => p.id === id ? { ...p, ...updated } : p));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  // Service actions
  const addService = (service: Service) => setServices([...services, service]);
  const updateService = (id: string, updated: Partial<Service>) => 
    setServices(services.map(s => s.id === id ? { ...s, ...updated } : s));
  const deleteService = (id: string) => setServices(services.filter(s => s.id !== id));

  // Testimonial actions
  const addTestimonial = (testimonial: Testimonial) => setTestimonials([...testimonials, testimonial]);
  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => 
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, ...updated } : t));
  const deleteTestimonial = (id: string) => setTestimonials(testimonials.filter(t => t.id !== id));

  // FAQ actions
  const addFaq = (faq: FAQ) => setFaqs([...faqs, faq]);
  const updateFaq = (id: string, updated: Partial<FAQ>) => 
    setFaqs(faqs.map(f => f.id === id ? { ...f, ...updated } : f));
  const deleteFaq = (id: string) => setFaqs(faqs.filter(f => f.id !== id));
  const reorderFaqs = (newFaqs: FAQ[]) => setFaqs(newFaqs);

  // Blog actions
  const addBlog = (blog: BlogPost) => setBlogs([...blogs, blog]);
  const updateBlog = (id: string, updated: Partial<BlogPost>) => 
    setBlogs(blogs.map(b => b.id === id ? { ...b, ...updated } : b));
  const deleteBlog = (id: string) => setBlogs(blogs.filter(b => b.id !== id));

  // Appointment actions
  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [appointment, ...prev]);
    saveAppointmentToDb(appointment);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    updateAppointmentStatusInDb(id, status);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    deleteAppointmentFromDb(id);
  };

  const clearAppointments = () => {
    setAppointments([]);
    try {
      localStorage.removeItem('admin_appointments');
      localStorage.removeItem('admin_appointments_v2');
    } catch {}
  };

  // Settings actions
  const updateSiteSettings = (settings: Partial<SiteSettings>) => 
    setSiteSettings({ ...siteSettings, ...settings });

  // Footer actions
  const updateFooterSettings = (settings: Partial<FooterSettings>) =>
    setFooterSettings(prev => ({ ...prev, ...settings }));
  const resetFooterSettings = () => {
    setFooterSettings(defaultFooterSettings);
    try {
      localStorage.setItem('admin_footer_settings_v1', JSON.stringify(defaultFooterSettings));
    } catch {}
  };

  // About actions
  const updateAboutSettings = (settings: Partial<AboutSettings>) =>
    setAboutSettings(prev => ({ ...prev, ...settings }));
  const resetAboutSettings = () => {
    setAboutSettings(defaultAboutSettings);
    try {
      localStorage.setItem('admin_about_settings_v1', JSON.stringify(defaultAboutSettings));
    } catch {}
  };

  // Marquee actions
  const addMarqueeItem = (item: MarqueeItem) => setMarqueeItems([...marqueeItems, item]);
  const updateMarqueeItem = (id: string, updated: Partial<MarqueeItem>) =>
    setMarqueeItems(marqueeItems.map(m => m.id === id ? { ...m, ...updated } : m));
  const deleteMarqueeItem = (id: string) => setMarqueeItems(marqueeItems.filter(m => m.id !== id));
  const reorderMarqueeItems = (items: MarqueeItem[]) => setMarqueeItems(items);
  const updateMarqueeSettings = (settings: Partial<MarqueeSettings>) =>
    setMarqueeSettings({ ...marqueeSettings, ...settings });

  // Result actions
  const addResult = (result: ResultItem) => setResults([...results, result]);
  const updateResult = (id: string, updated: Partial<ResultItem>) =>
    setResults(results.map(r => r.id === id ? { ...r, ...updated } : r));
  const deleteResult = (id: string) => setResults(results.filter(r => r.id !== id));
  const restoreDefaultResults = () => {
    setResults(defaultResults);
    try {
      localStorage.setItem('admin_results_v1', JSON.stringify(defaultResults));
    } catch {}
  };

  return (
    <AdminDataContext.Provider value={{
      coupons, addCoupon, updateCoupon, deleteCoupon, recordCouponUse, validateCoupon, resetCoupons,
      products, addProduct, updateProduct, deleteProduct,
      services, addService, updateService, deleteService,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      faqs, addFaq, updateFaq, deleteFaq, reorderFaqs,
      blogs, addBlog, updateBlog, deleteBlog,
      appointments, addAppointment, updateAppointmentStatus, deleteAppointment, clearAppointments,
      siteSettings, updateSiteSettings,
      footerSettings, updateFooterSettings, resetFooterSettings,
      aboutSettings, updateAboutSettings, resetAboutSettings,
      marqueeItems, addMarqueeItem, updateMarqueeItem, deleteMarqueeItem, reorderMarqueeItems,
      marqueeSettings, updateMarqueeSettings,
      results, addResult, updateResult, deleteResult, restoreDefaultResults
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
