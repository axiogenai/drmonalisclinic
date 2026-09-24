export interface Service {
  id: string;
  title: string;
  category: 'homeopathy' | 'cosmetic' | 'hair-skin' | string;
  indications?: string;
  description: string;
  image: string;
  imagePosition?: string;
  highlights: string[];
  tagline?: string;
  cardBg?: string;
  accent?: string;
  iconColor?: string;
  technology?: string;
  downtime?: string;
  sessions?: string;
  badge?: string;
  price?: string;
  duration?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  review: string;
  concern: string;
  tag?: string;
  headline?: string;
  image?: string;
  rating?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  image: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

export interface Appointment {
  id: string;
  fullName: string;
  phone: string;
  date: string;
  condition: string;
  message?: string;
  status: 'new' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SiteSettings {
  clinicName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  heroHeading: string;
  heroSubtext: string;
}

export interface MarqueeItem {
  id: string;
  type: 'product' | 'custom' | 'offer';
  productId?: string;
  name: string;
  badge: string;
  badgeColor?: 'teal' | 'gold' | 'rose' | 'amber' | 'emerald';
  image?: string;
  link?: string;
  isActive: boolean;
}

export interface MarqueeSettings {
  isEnabled: boolean;
  speed: 'slow' | 'normal' | 'fast';
  theme: 'cream' | 'white' | 'gold' | 'teal';
}

export interface ResultItem {
  id: string;
  name: string;
  category: 'skin' | 'hair' | 'face';
  image: string;
  metric: string;
  doctorNotes: string;
  isActive?: boolean;
}

export interface FooterSettings {
  clinicName: string;
  subTitle: string;
  description: string;
  address: string;
  mapsUrl: string;
  phone: string;
  email: string;
  workingDays: string;
  morningHours: string;
  eveningHours: string;
  sundayHours: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  creditText: string;
  creditUrl: string;
}

export interface DoctorProfile {
  name: string;
  title: string;
  degrees: string;
  regNo: string;
  bio: string;
  highlights: string[];
}

export interface AboutSettings {
  tagline: string;
  heading: string;
  subheading: string;
  councilRegistrationText: string;
  doctor1: DoctorProfile;
  doctor2: DoctorProfile;
  philosophyQuote: string;
  philosophyText: string;
  storyQuote: string;
  storyText: string;

  stats: {
    yearsExperience: string;
    treatmentsPerformed: string;
    clientSatisfaction: string;
    safeFdaApproved: string;
  };

  heroHeading: string;
  heroSubheading: string;
  storyTitle: string;
  storyParagraphs: string[];
  whyUsItems: { title: string; desc: string }[];
  educationalDegreesList: string[];
  expertiseList: string[];
}

