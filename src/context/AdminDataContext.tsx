'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/types/product';
import { 
  Service, 
  Testimonial, 
  FAQ, 
  BlogPost, 
  Appointment, 
  SiteSettings, 
  MarqueeItem, 
  MarqueeSettings, 
  ResultItem, 
  FooterSettings, 
  AboutSettings, 
  Coupon, 
  CouponValidationResult 
} from '@/types/admin';
import { 
  getAppointmentsFromDb, 
  saveAppointmentToDb, 
  updateAppointmentStatusInDb, 
  deleteAppointmentFromDb, 
  isSupabaseConfigured,
  getAllSettingsFromDb,
  saveSettingToDb,
  supabase
} from '@/lib/supabase';
import { products as defaultProducts } from '@/data/products';
import { defaultServices } from '@/data/services';
import { defaultMarqueeItems, defaultMarqueeSettings } from '@/data/marquee';
import { defaultResults } from '@/data/results';
import { defaultFooterSettings, defaultAboutSettings } from '@/data/defaultAboutAndFooter';
import { defaultCoupons } from '@/data/defaultCoupons';

interface LiveUpdateInfo {
  timestamp: number;
  key: string;
  label: string;
}

interface AdminDataContextType {
  lastLiveUpdate: LiveUpdateInfo | null;
  clearLiveUpdate: () => void;

  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => Promise<void>;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  recordCouponUse: (code: string) => boolean;
  validateCoupon: (code: string, cartTotal: number) => CouponValidationResult;
  resetCoupons: () => Promise<void>;

  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  services: Service[];
  addService: (service: Service) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  testimonials: Testimonial[];
  addTestimonial: (testimonial: Testimonial) => Promise<void>;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  faqs: FAQ[];
  addFaq: (faq: FAQ) => Promise<void>;
  updateFaq: (id: string, faq: Partial<FAQ>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  reorderFaqs: (newFaqs: FAQ[]) => Promise<void>;

  blogs: BlogPost[];
  addBlog: (blog: BlogPost) => Promise<void>;
  updateBlog: (id: string, blog: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  clearAppointments: () => void;

  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;

  footerSettings: FooterSettings;
  updateFooterSettings: (settings: Partial<FooterSettings>) => Promise<void>;
  resetFooterSettings: () => Promise<void>;

  aboutSettings: AboutSettings;
  updateAboutSettings: (settings: Partial<AboutSettings>) => Promise<void>;
  resetAboutSettings: () => Promise<void>;

  marqueeItems: MarqueeItem[];
  addMarqueeItem: (item: MarqueeItem) => Promise<void>;
  updateMarqueeItem: (id: string, item: Partial<MarqueeItem>) => Promise<void>;
  deleteMarqueeItem: (id: string) => Promise<void>;
  reorderMarqueeItems: (items: MarqueeItem[]) => Promise<void>;

  marqueeSettings: MarqueeSettings;
  updateMarqueeSettings: (settings: Partial<MarqueeSettings>) => Promise<void>;

  results: ResultItem[];
  addResult: (result: ResultItem) => Promise<void>;
  updateResult: (id: string, result: Partial<ResultItem>) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  restoreDefaultResults: () => Promise<void>;
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

const KEY_LABELS: Record<string, string> = {
  about_settings: 'Physician Profiles & Statistics',
  footer_settings: 'Footer & Clinic Info',
  site_settings: 'Clinic Contact & Headlines',
  coupons: 'Discount Coupons',
  products: 'Skincare & Wellness Products',
  services: 'Clinical Treatments',
  testimonials: 'Patient Testimonials',
  faqs: 'Frequently Asked Questions',
  blogs: 'Health Articles & Blogs',
  marquee_items: 'Product Announcement Marquee',
  marquee_settings: 'Marquee Strip Configuration',
  results: 'Clinical Before & After Results',
};

// Universal helper to persist settings to Supabase and API fallback
async function persistSetting<T>(key: string, data: T): Promise<boolean> {
  let ok = false;
  if (isSupabaseConfigured()) {
    try {
      ok = await saveSettingToDb(key, data);
    } catch (e) {
      console.warn(`Direct save for ${key} failed, attempting API fallback:`, e);
    }
  }

  if (!ok && typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data }),
      });
      const json = await res.json();
      ok = Boolean(json.success);
    } catch (err) {
      console.warn(`API fallback save for ${key} failed:`, err);
    }
  }
  return ok;
}

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
  const [lastLiveUpdate, setLastLiveUpdate] = useState<LiveUpdateInfo | null>(null);

  const clearLiveUpdate = useCallback(() => {
    setLastLiveUpdate(null);
  }, []);

  const triggerUpdateNotice = useCallback((key: string, fallbackLabel?: string) => {
    const label = KEY_LABELS[key] || fallbackLabel || 'Clinic Content';
    setLastLiveUpdate({ timestamp: Date.now(), key, label });
  }, []);

  useEffect(() => {
    // 1. Initial synchronous hydration from localStorage for zero layout shift
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

    const loadedServices = loadData<Service[]>('admin_services_pages_v1', []);
    const isServicePagesFormat = loadedServices && loadedServices.length > 0 && loadedServices.some(s => 
      s.category === 'homeopathy' || s.category === 'cosmetic' || s.category === 'hair-skin'
    );

    if (isServicePagesFormat) {
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
    }

    setTestimonials(loadData<Testimonial[]>('admin_testimonials', defaultTestimonials));
    setFaqs(loadData<FAQ[]>('admin_faqs', defaultFaqs));
    setBlogs(loadData<BlogPost[]>('admin_blogs', defaultBlogs));
    setAppointments(loadData<Appointment[]>('admin_appointments_v2', []));
    setSiteSettings(loadData<SiteSettings>('admin_settings', defaultSettings));
    setFooterSettings(loadData<FooterSettings>('admin_footer_settings_v1', defaultFooterSettings));
    setAboutSettings(loadData<AboutSettings>('admin_about_settings_v1', defaultAboutSettings));

    const loadedMarquee = loadData<MarqueeItem[]>('admin_marquee_items_v2', []);
    const hasBrokenMarquee = !loadedMarquee || loadedMarquee.length === 0 || loadedMarquee.some(m => 
      !m.image || m.image.includes('stroke-logo')
    );
    if (!hasBrokenMarquee) {
      setMarqueeItems(loadedMarquee);
    } else {
      setMarqueeItems(defaultMarqueeItems);
    }

    setMarqueeSettings(loadData<MarqueeSettings>('admin_marquee_settings', defaultMarqueeSettings));

    const loadedResults = loadData<ResultItem[]>('admin_results_v1', []);
    if (loadedResults && loadedResults.length > 0) {
      setResults(loadedResults);
    } else {
      setResults(defaultResults);
    }

    // 2. Asynchronously sync from Supabase Central Database
    if (isSupabaseConfigured()) {
      // Sync appointments
      getAppointmentsFromDb().then(dbAppts => {
        if (dbAppts && dbAppts.length > 0) {
          setAppointments(prev => {
            const map = new Map();
            prev.forEach(a => map.set(a.id, a));
            dbAppts.forEach(a => map.set(a.id, a));
            const merged = Array.from(map.values());
            try { localStorage.setItem('admin_appointments_v2', JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
      });

      // Sync all clinic_settings (About, Footer, Services, Products, etc.)
      getAllSettingsFromDb().then(settingsMap => {
        if (!settingsMap) return;

        // About Settings
        if (settingsMap.about_settings) {
          setAboutSettings(settingsMap.about_settings);
          try { localStorage.setItem('admin_about_settings_v1', JSON.stringify(settingsMap.about_settings)); } catch {}
        } else {
          persistSetting('about_settings', defaultAboutSettings);
        }

        // Footer Settings
        if (settingsMap.footer_settings) {
          setFooterSettings(settingsMap.footer_settings);
          try { localStorage.setItem('admin_footer_settings_v1', JSON.stringify(settingsMap.footer_settings)); } catch {}
        } else {
          persistSetting('footer_settings', defaultFooterSettings);
        }

        // Site Settings
        if (settingsMap.site_settings) {
          setSiteSettings(settingsMap.site_settings);
          try { localStorage.setItem('admin_settings', JSON.stringify(settingsMap.site_settings)); } catch {}
        } else {
          persistSetting('site_settings', defaultSettings);
        }

        // Coupons
        if (settingsMap.coupons && Array.isArray(settingsMap.coupons) && settingsMap.coupons.length > 0) {
          setCoupons(settingsMap.coupons);
          try { localStorage.setItem('admin_coupons_v1', JSON.stringify(settingsMap.coupons)); } catch {}
        } else if (!settingsMap.coupons) {
          persistSetting('coupons', defaultCoupons);
        }

        // Products
        if (settingsMap.products && Array.isArray(settingsMap.products) && settingsMap.products.length > 0) {
          setProducts(settingsMap.products);
          try { localStorage.setItem('admin_products', JSON.stringify(settingsMap.products)); } catch {}
        } else if (!settingsMap.products) {
          persistSetting('products', defaultProducts || []);
        }

        // Services
        if (settingsMap.services && Array.isArray(settingsMap.services) && settingsMap.services.length > 0) {
          setServices(settingsMap.services);
          try { localStorage.setItem('admin_services_pages_v1', JSON.stringify(settingsMap.services)); } catch {}
        } else if (!settingsMap.services) {
          persistSetting('services', defaultServices);
        }

        // Testimonials
        if (settingsMap.testimonials && Array.isArray(settingsMap.testimonials) && settingsMap.testimonials.length > 0) {
          setTestimonials(settingsMap.testimonials);
          try { localStorage.setItem('admin_testimonials', JSON.stringify(settingsMap.testimonials)); } catch {}
        } else if (!settingsMap.testimonials) {
          persistSetting('testimonials', defaultTestimonials);
        }

        // FAQs
        if (settingsMap.faqs && Array.isArray(settingsMap.faqs) && settingsMap.faqs.length > 0) {
          setFaqs(settingsMap.faqs);
          try { localStorage.setItem('admin_faqs', JSON.stringify(settingsMap.faqs)); } catch {}
        } else if (!settingsMap.faqs) {
          persistSetting('faqs', defaultFaqs);
        }

        // Blogs
        if (settingsMap.blogs && Array.isArray(settingsMap.blogs) && settingsMap.blogs.length > 0) {
          setBlogs(settingsMap.blogs);
          try { localStorage.setItem('admin_blogs', JSON.stringify(settingsMap.blogs)); } catch {}
        } else if (!settingsMap.blogs) {
          persistSetting('blogs', defaultBlogs);
        }

        // Marquee Items
        if (settingsMap.marquee_items && Array.isArray(settingsMap.marquee_items) && settingsMap.marquee_items.length > 0) {
          setMarqueeItems(settingsMap.marquee_items);
          try { localStorage.setItem('admin_marquee_items_v2', JSON.stringify(settingsMap.marquee_items)); } catch {}
        } else if (!settingsMap.marquee_items) {
          persistSetting('marquee_items', defaultMarqueeItems);
        }

        // Marquee Settings
        if (settingsMap.marquee_settings) {
          setMarqueeSettings(settingsMap.marquee_settings);
          try { localStorage.setItem('admin_marquee_settings', JSON.stringify(settingsMap.marquee_settings)); } catch {}
        } else if (!settingsMap.marquee_settings) {
          persistSetting('marquee_settings', defaultMarqueeSettings);
        }

        // Results
        if (settingsMap.results && Array.isArray(settingsMap.results) && settingsMap.results.length > 0) {
          setResults(settingsMap.results);
          try { localStorage.setItem('admin_results_v1', JSON.stringify(settingsMap.results)); } catch {}
        } else if (!settingsMap.results) {
          persistSetting('results', defaultResults);
        }
      });

      // 3. Supabase Realtime channel subscription for instant live updates
      if (supabase) {
        const channel = supabase
          .channel('clinic_settings_sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'clinic_settings' },
            (payload: any) => {
              const row = payload.new;
              if (!row || !row.key) return;
              const { key, data } = row;

              if (key === 'about_settings' && data) {
                setAboutSettings(data);
                try { localStorage.setItem('admin_about_settings_v1', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'footer_settings' && data) {
                setFooterSettings(data);
                try { localStorage.setItem('admin_footer_settings_v1', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'site_settings' && data) {
                setSiteSettings(data);
                try { localStorage.setItem('admin_settings', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'coupons' && Array.isArray(data)) {
                setCoupons(data);
                try { localStorage.setItem('admin_coupons_v1', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'products' && Array.isArray(data)) {
                setProducts(data);
                try { localStorage.setItem('admin_products', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'services' && Array.isArray(data)) {
                setServices(data);
                try { localStorage.setItem('admin_services_pages_v1', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'testimonials' && Array.isArray(data)) {
                setTestimonials(data);
                try { localStorage.setItem('admin_testimonials', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'faqs' && Array.isArray(data)) {
                setFaqs(data);
                try { localStorage.setItem('admin_faqs', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'blogs' && Array.isArray(data)) {
                setBlogs(data);
                try { localStorage.setItem('admin_blogs', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'marquee_items' && Array.isArray(data)) {
                setMarqueeItems(data);
                try { localStorage.setItem('admin_marquee_items_v2', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'marquee_settings' && data) {
                setMarqueeSettings(data);
                try { localStorage.setItem('admin_marquee_settings', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              } else if (key === 'results' && Array.isArray(data)) {
                setResults(data);
                try { localStorage.setItem('admin_results_v1', JSON.stringify(data)); } catch {}
                triggerUpdateNotice(key);
              }
            }
          )
          .subscribe();

        return () => {
          if (supabase) {
            supabase.removeChannel(channel);
          }
        };
      }
    }

    setIsLoaded(true);
  }, [triggerUpdateNotice]);

  // 4. Active 5-second polling interval (guarantees cross-domain updates show within 5 seconds on main website)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const intervalId = setInterval(() => {
      // Only execute query if tab is visible in browser to avoid wasted cycles
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
        return;
      }

      getAllSettingsFromDb().then(settingsMap => {
        if (!settingsMap) return;

        // Check About Settings
        if (settingsMap.about_settings) {
          const newStr = JSON.stringify(settingsMap.about_settings);
          const currentStr = localStorage.getItem('admin_about_settings_v1');
          if (newStr !== currentStr) {
            setAboutSettings(settingsMap.about_settings);
            try { localStorage.setItem('admin_about_settings_v1', newStr); } catch {}
            triggerUpdateNotice('about_settings');
          }
        }

        // Check Footer Settings
        if (settingsMap.footer_settings) {
          const newStr = JSON.stringify(settingsMap.footer_settings);
          const currentStr = localStorage.getItem('admin_footer_settings_v1');
          if (newStr !== currentStr) {
            setFooterSettings(settingsMap.footer_settings);
            try { localStorage.setItem('admin_footer_settings_v1', newStr); } catch {}
            triggerUpdateNotice('footer_settings');
          }
        }

        // Check Site Settings
        if (settingsMap.site_settings) {
          const newStr = JSON.stringify(settingsMap.site_settings);
          const currentStr = localStorage.getItem('admin_settings');
          if (newStr !== currentStr) {
            setSiteSettings(settingsMap.site_settings);
            try { localStorage.setItem('admin_settings', newStr); } catch {}
            triggerUpdateNotice('site_settings');
          }
        }

        // Check Coupons
        if (settingsMap.coupons && Array.isArray(settingsMap.coupons)) {
          const newStr = JSON.stringify(settingsMap.coupons);
          const currentStr = localStorage.getItem('admin_coupons_v1');
          if (newStr !== currentStr) {
            setCoupons(settingsMap.coupons);
            try { localStorage.setItem('admin_coupons_v1', newStr); } catch {}
            triggerUpdateNotice('coupons');
          }
        }

        // Check Products
        if (settingsMap.products && Array.isArray(settingsMap.products)) {
          const newStr = JSON.stringify(settingsMap.products);
          const currentStr = localStorage.getItem('admin_products');
          if (newStr !== currentStr) {
            setProducts(settingsMap.products);
            try { localStorage.setItem('admin_products', newStr); } catch {}
            triggerUpdateNotice('products');
          }
        }

        // Check Services
        if (settingsMap.services && Array.isArray(settingsMap.services)) {
          const newStr = JSON.stringify(settingsMap.services);
          const currentStr = localStorage.getItem('admin_services_pages_v1');
          if (newStr !== currentStr) {
            setServices(settingsMap.services);
            try { localStorage.setItem('admin_services_pages_v1', newStr); } catch {}
            triggerUpdateNotice('services');
          }
        }

        // Check Testimonials
        if (settingsMap.testimonials && Array.isArray(settingsMap.testimonials)) {
          const newStr = JSON.stringify(settingsMap.testimonials);
          const currentStr = localStorage.getItem('admin_testimonials');
          if (newStr !== currentStr) {
            setTestimonials(settingsMap.testimonials);
            try { localStorage.setItem('admin_testimonials', newStr); } catch {}
            triggerUpdateNotice('testimonials');
          }
        }

        // Check FAQs
        if (settingsMap.faqs && Array.isArray(settingsMap.faqs)) {
          const newStr = JSON.stringify(settingsMap.faqs);
          const currentStr = localStorage.getItem('admin_faqs');
          if (newStr !== currentStr) {
            setFaqs(settingsMap.faqs);
            try { localStorage.setItem('admin_faqs', newStr); } catch {}
            triggerUpdateNotice('faqs');
          }
        }

        // Check Blogs
        if (settingsMap.blogs && Array.isArray(settingsMap.blogs)) {
          const newStr = JSON.stringify(settingsMap.blogs);
          const currentStr = localStorage.getItem('admin_blogs');
          if (newStr !== currentStr) {
            setBlogs(settingsMap.blogs);
            try { localStorage.setItem('admin_blogs', newStr); } catch {}
            triggerUpdateNotice('blogs');
          }
        }

        // Check Marquee Items
        if (settingsMap.marquee_items && Array.isArray(settingsMap.marquee_items)) {
          const newStr = JSON.stringify(settingsMap.marquee_items);
          const currentStr = localStorage.getItem('admin_marquee_items_v2');
          if (newStr !== currentStr) {
            setMarqueeItems(settingsMap.marquee_items);
            try { localStorage.setItem('admin_marquee_items_v2', newStr); } catch {}
            triggerUpdateNotice('marquee_items');
          }
        }

        // Check Marquee Settings
        if (settingsMap.marquee_settings) {
          const newStr = JSON.stringify(settingsMap.marquee_settings);
          const currentStr = localStorage.getItem('admin_marquee_settings');
          if (newStr !== currentStr) {
            setMarqueeSettings(settingsMap.marquee_settings);
            try { localStorage.setItem('admin_marquee_settings', newStr); } catch {}
            triggerUpdateNotice('marquee_settings');
          }
        }

        // Check Results
        if (settingsMap.results && Array.isArray(settingsMap.results)) {
          const newStr = JSON.stringify(settingsMap.results);
          const currentStr = localStorage.getItem('admin_results_v1');
          if (newStr !== currentStr) {
            setResults(settingsMap.results);
            try { localStorage.setItem('admin_results_v1', newStr); } catch {}
            triggerUpdateNotice('results');
          }
        }
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [triggerUpdateNotice]);

  // Coupon actions
  const addCoupon = async (coupon: Coupon) => {
    const updated = [coupon, ...coupons];
    setCoupons(updated);
    try { localStorage.setItem('admin_coupons_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('coupons', updated);
  };

  const updateCoupon = async (id: string, partial: Partial<Coupon>) => {
    const updated = coupons.map(c => c.id === id ? { ...c, ...partial } : c);
    setCoupons(updated);
    try { localStorage.setItem('admin_coupons_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('coupons', updated);
  };

  const deleteCoupon = async (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    setCoupons(updated);
    try { localStorage.setItem('admin_coupons_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('coupons', updated);
  };

  const resetCoupons = async () => {
    setCoupons(defaultCoupons);
    try { localStorage.setItem('admin_coupons_v1', JSON.stringify(defaultCoupons)); } catch {}
    await persistSetting('coupons', defaultCoupons);
  };

  const recordCouponUse = (code: string): boolean => {
    const cleanCode = (code || '').trim().toUpperCase();
    let recorded = false;
    const updated = coupons.map(c => {
      if (c.code.toUpperCase() === cleanCode) {
        recorded = true;
        return { ...c, usedCount: c.usedCount + 1 };
      }
      return c;
    });
    if (recorded) {
      setCoupons(updated);
      try { localStorage.setItem('admin_coupons_v1', JSON.stringify(updated)); } catch {}
      persistSetting('coupons', updated);
    }
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
  const addProduct = async (product: Product) => {
    const updated = [...products, product];
    setProducts(updated);
    try { localStorage.setItem('admin_products', JSON.stringify(updated)); } catch {}
    await persistSetting('products', updated);
  };

  const updateProduct = async (id: string, partial: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...partial } : p);
    setProducts(updated);
    try { localStorage.setItem('admin_products', JSON.stringify(updated)); } catch {}
    await persistSetting('products', updated);
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    try { localStorage.setItem('admin_products', JSON.stringify(updated)); } catch {}
    await persistSetting('products', updated);
  };

  // Service actions
  const addService = async (service: Service) => {
    const updated = [...services, service];
    setServices(updated);
    try { localStorage.setItem('admin_services_pages_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('services', updated);
  };

  const updateService = async (id: string, partial: Partial<Service>) => {
    const updated = services.map(s => s.id === id ? { ...s, ...partial } : s);
    setServices(updated);
    try { localStorage.setItem('admin_services_pages_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('services', updated);
  };

  const deleteService = async (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    try { localStorage.setItem('admin_services_pages_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('services', updated);
  };

  // Testimonial actions
  const addTestimonial = async (testimonial: Testimonial) => {
    const updated = [...testimonials, testimonial];
    setTestimonials(updated);
    try { localStorage.setItem('admin_testimonials', JSON.stringify(updated)); } catch {}
    await persistSetting('testimonials', updated);
  };

  const updateTestimonial = async (id: string, partial: Partial<Testimonial>) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, ...partial } : t);
    setTestimonials(updated);
    try { localStorage.setItem('admin_testimonials', JSON.stringify(updated)); } catch {}
    await persistSetting('testimonials', updated);
  };

  const deleteTestimonial = async (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    try { localStorage.setItem('admin_testimonials', JSON.stringify(updated)); } catch {}
    await persistSetting('testimonials', updated);
  };

  // FAQ actions
  const addFaq = async (faq: FAQ) => {
    const updated = [...faqs, faq];
    setFaqs(updated);
    try { localStorage.setItem('admin_faqs', JSON.stringify(updated)); } catch {}
    await persistSetting('faqs', updated);
  };

  const updateFaq = async (id: string, partial: Partial<FAQ>) => {
    const updated = faqs.map(f => f.id === id ? { ...f, ...partial } : f);
    setFaqs(updated);
    try { localStorage.setItem('admin_faqs', JSON.stringify(updated)); } catch {}
    await persistSetting('faqs', updated);
  };

  const deleteFaq = async (id: string) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    try { localStorage.setItem('admin_faqs', JSON.stringify(updated)); } catch {}
    await persistSetting('faqs', updated);
  };

  const reorderFaqs = async (newFaqs: FAQ[]) => {
    setFaqs(newFaqs);
    try { localStorage.setItem('admin_faqs', JSON.stringify(newFaqs)); } catch {}
    await persistSetting('faqs', newFaqs);
  };

  // Blog actions
  const addBlog = async (blog: BlogPost) => {
    const updated = [...blogs, blog];
    setBlogs(updated);
    try { localStorage.setItem('admin_blogs', JSON.stringify(updated)); } catch {}
    await persistSetting('blogs', updated);
  };

  const updateBlog = async (id: string, partial: Partial<BlogPost>) => {
    const updated = blogs.map(b => b.id === id ? { ...b, ...partial } : b);
    setBlogs(updated);
    try { localStorage.setItem('admin_blogs', JSON.stringify(updated)); } catch {}
    await persistSetting('blogs', updated);
  };

  const deleteBlog = async (id: string) => {
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    try { localStorage.setItem('admin_blogs', JSON.stringify(updated)); } catch {}
    await persistSetting('blogs', updated);
  };

  // Appointment actions
  const addAppointment = async (appointment: Appointment) => {
    setAppointments(prev => [appointment, ...prev]);
    saveAppointmentToDb(appointment);
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    updateAppointmentStatusInDb(id, status);
  };

  const deleteAppointment = async (id: string) => {
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
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...settings };
    setSiteSettings(updated);
    try { localStorage.setItem('admin_settings', JSON.stringify(updated)); } catch {}
    await persistSetting('site_settings', updated);
  };

  // Footer actions
  const updateFooterSettings = async (settings: Partial<FooterSettings>) => {
    const updated = { ...footerSettings, ...settings };
    setFooterSettings(updated);
    try { localStorage.setItem('admin_footer_settings_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('footer_settings', updated);
  };

  const resetFooterSettings = async () => {
    setFooterSettings(defaultFooterSettings);
    try { localStorage.setItem('admin_footer_settings_v1', JSON.stringify(defaultFooterSettings)); } catch {}
    await persistSetting('footer_settings', defaultFooterSettings);
  };

  // About actions
  const updateAboutSettings = async (settings: Partial<AboutSettings>) => {
    const updated = { ...aboutSettings, ...settings };
    setAboutSettings(updated);
    try { localStorage.setItem('admin_about_settings_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('about_settings', updated);
  };

  const resetAboutSettings = async () => {
    setAboutSettings(defaultAboutSettings);
    try { localStorage.setItem('admin_about_settings_v1', JSON.stringify(defaultAboutSettings)); } catch {}
    await persistSetting('about_settings', defaultAboutSettings);
  };

  // Marquee actions
  const addMarqueeItem = async (item: MarqueeItem) => {
    const updated = [...marqueeItems, item];
    setMarqueeItems(updated);
    try { localStorage.setItem('admin_marquee_items_v2', JSON.stringify(updated)); } catch {}
    await persistSetting('marquee_items', updated);
  };

  const updateMarqueeItem = async (id: string, partial: Partial<MarqueeItem>) => {
    const updated = marqueeItems.map(m => m.id === id ? { ...m, ...partial } : m);
    setMarqueeItems(updated);
    try { localStorage.setItem('admin_marquee_items_v2', JSON.stringify(updated)); } catch {}
    await persistSetting('marquee_items', updated);
  };

  const deleteMarqueeItem = async (id: string) => {
    const updated = marqueeItems.filter(m => m.id !== id);
    setMarqueeItems(updated);
    try { localStorage.setItem('admin_marquee_items_v2', JSON.stringify(updated)); } catch {}
    await persistSetting('marquee_items', updated);
  };

  const reorderMarqueeItems = async (items: MarqueeItem[]) => {
    setMarqueeItems(items);
    try { localStorage.setItem('admin_marquee_items_v2', JSON.stringify(items)); } catch {}
    await persistSetting('marquee_items', items);
  };

  const updateMarqueeSettings = async (settings: Partial<MarqueeSettings>) => {
    const updated = { ...marqueeSettings, ...settings };
    setMarqueeSettings(updated);
    try { localStorage.setItem('admin_marquee_settings', JSON.stringify(updated)); } catch {}
    await persistSetting('marquee_settings', updated);
  };

  // Result actions
  const addResult = async (result: ResultItem) => {
    const updated = [...results, result];
    setResults(updated);
    try { localStorage.setItem('admin_results_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('results', updated);
  };

  const updateResult = async (id: string, partial: Partial<ResultItem>) => {
    const updated = results.map(r => r.id === id ? { ...r, ...partial } : r);
    setResults(updated);
    try { localStorage.setItem('admin_results_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('results', updated);
  };

  const deleteResult = async (id: string) => {
    const updated = results.filter(r => r.id !== id);
    setResults(updated);
    try { localStorage.setItem('admin_results_v1', JSON.stringify(updated)); } catch {}
    await persistSetting('results', updated);
  };

  const restoreDefaultResults = async () => {
    setResults(defaultResults);
    try { localStorage.setItem('admin_results_v1', JSON.stringify(defaultResults)); } catch {}
    await persistSetting('results', defaultResults);
  };

  return (
    <AdminDataContext.Provider value={{
      lastLiveUpdate,
      clearLiveUpdate,
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
