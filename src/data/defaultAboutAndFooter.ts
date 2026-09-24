import { FooterSettings, AboutSettings } from '@/types/admin';

export const defaultFooterSettings: FooterSettings = {
  clinicName: "Dr. Monali's",
  subTitle: "Homeopathy Clinic",
  description: "Dr. Monali's Homeopathy Clinic is your trusted destination for natural, holistic healing in Kolhapur. Led by Dr. Monali Subhedar & Dr. Sachin Subhedar — healing through nature's wisdom.",
  address: "Golden Spring Apartment, Near Ring Road, Kolhapur",
  mapsUrl: "https://maps.google.com/?q=Golden+Spring+Apartment+Near+Ring+Road+Kolhapur",
  phone: "+91 92094 72224",
  email: "info@drmonalisclinic.com",
  workingDays: "Monday – Saturday",
  morningHours: "Morning: 10:00 AM – 2:00 PM",
  eveningHours: "Evening: 5:00 PM – 9:00 PM",
  sundayHours: "Sunday: Closed",
  instagramUrl: "https://www.instagram.com/drmonalisachin/",
  facebookUrl: "https://www.facebook.com/drmonalisachin/",
  whatsappNumber: "919209472224",
  creditText: "team.axiogen.in",
  creditUrl: "https://team.axiogen.in",
};

export const defaultAboutSettings: AboutSettings = {
  tagline: "ABOUT OUR PHYSICIANS",
  heading: "Meet Dr. Monali & Dr. Sachin Subhedar",
  subheading: "Decades of combined clinical mastery in classical constitutional homeopathy, clinical aesthetics, and family healthcare.",
  councilRegistrationText: "Reg. No. 61847 & 64981",

  doctor1: {
    name: "Dr. Monali Subhedar",
    title: "Homeopathy & Aesthetic Physician",
    degrees: "BHMS (Mumbai), PGDCC",
    regNo: "Reg. No. 61847",
    bio: "Specializing in classical homeopathy and clinical aesthetics, Dr. Monali provides individualized remedies for chronic skin and hair concerns, acne scar resurfacing, melasma, and holistic aesthetic rejuvenation. Her practice combines gentle natural therapies with thorough constitutional evaluation to achieve lasting wellness.",
    highlights: [
      "Classical Homeopathy for Skin & Hair",
      "Clinical Trichology & Hair Restoration",
      "Chemical Peels & Medifacials",
      "Safe, Steroid-Free Natural Rejuvenation",
    ],
  },

  doctor2: {
    name: "Dr. Sachin Subhedar",
    title: "Homeopathy & Family Physician",
    degrees: "BHMS (Mumbai)",
    regNo: "Reg. No. 64981",
    bio: "With deep expertise in family medicine and holistic healthcare, Dr. Sachin focuses on acute and chronic illnesses, pediatric and geriatric care, allergies, and long-term health restoration. He is dedicated to addressing root causes and strengthening the body's natural defense mechanisms across all age groups.",
    highlights: [
      "Comprehensive Family Healthcare",
      "Chronic Kidney Stone & Piles Management",
      "Pediatric & Adolescent Growth Support",
      "Immunity Restoration & Metabolic Balance",
    ],
  },

  philosophyQuote: "“Dr. Monali's Homeopathy Clinic reflects our commitment to holistic healing, integrity, and individualized care — treating the individual as a whole, not just the symptoms.”",
  philosophyText: "Every protocol is customized through detailed constitutional case analysis, prioritizing long-term biological vitality, natural immunity, and side-effect-free healing over temporary relief.",

  storyQuote: "“Our journey in homeopathy is guided by the conviction that true healing begins from within. Every patient brings a unique story, and our mission is to provide safe, natural care that restores balance, health, and vitality for every family.”",
  storyText: "This empathy and clinical dedication define every consultation at Dr. Monali's Homeopathy Clinic, ensuring patients feel heard, understood, and fully supported.",

  stats: {
    yearsExperience: "6+",
    treatmentsPerformed: "5k+",
    clientSatisfaction: "98%",
    safeFdaApproved: "100%",
  },

  heroHeading: "Behind Every Glow is a Story",
  heroSubheading: "Indulge in premium skincare solutions designed for beauty, health, and confidence.",

  storyTitle: "Welcome to Dr. Monali's Clinic",
  storyParagraphs: [
    "Dr. Monali's Homeopathy & Cosmetology Clinic was born from a clear vision to solve skin, hair, and constitutional health concerns at their root and promote a more confident, healthy version of each individual. We believe that clear skin, radiant hair, and lasting health are pathways to self-esteem and emotional well being.",
    "Rooted in clinical excellence and delivered with empathy, we provide patient centered care that is mindful, transparent, and thorough at every step.",
    "At Dr. Monali's Clinic, we believe that true healing begins with trust, compassion, and a deep understanding of each patient's unique health journey. Established in Kolhapur, our clinic is a sanctuary of care where constitutional science and modern cosmetology come together to bring lasting results and lifelong relationships.",
  ],

  whyUsItems: [
    {
      title: "Thorough Guidance from Start to Finish",
      desc: "We explain each step with care and transparency until you feel confident, not just informed.",
    },
    {
      title: "Beyond Treatment",
      desc: "Our connection doesn’t end with your appointment. We stay in touch, follow up, and ensure you’re healing well post-treatment.",
    },
    {
      title: "All Ages, All Skin Types",
      desc: "From newborns to the elderly, our clinical journey has touched every age group, building trust across generations.",
    },
    {
      title: "Word-of-Mouth Growth",
      desc: "Our reputation has grown organically, driven by heartfelt referrals from our happy, healed patients.",
    },
    {
      title: "Anxiety-Free Ambience",
      desc: "Patients often share how the calm, green setting and welcoming space immediately ease their fears — a rare comfort in clinical spaces.",
    },
  ],

  educationalDegreesList: [
    "Bachelor of Homeopathic Medicine and Surgery (B.H.M.S.) – Mumbai University",
    "Post Graduate Diploma in Clinical Cosmetology (PGDCC)",
    "Certified Trichologist & Aesthetic Medicine Practitioner",
    "Registered Medical Practitioners – Maharashtra Council (Reg. Nos. 61847 & 64981)",
  ],

  expertiseList: [
    "Classical Homeopathy for Chronic & Autoimmune Skin Conditions",
    "Advanced Acne, Acne Scar Resurfacing & Pore Refinement",
    "Melasma, Pigmentation & Deep Radiant Glow Protocols",
    "Clinical Trichology: PRP Therapy, Mesotherapy & Hair Fall Arrest",
    "Chemical Peels, Hydrafacials and Skin Booster Treatments",
    "Comprehensive Family Healthcare & Immunity Restoration",
  ],
};
