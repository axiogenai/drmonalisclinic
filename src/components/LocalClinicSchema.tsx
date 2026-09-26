import React from 'react';

export default function LocalClinicSchema() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Medical & Homeopathic Clinic Entity (Local Business)
      {
        '@type': ['MedicalClinic', 'HomeopathicClinic', 'LocalBusiness', 'HealthAndBeautyBusiness'],
        '@id': 'https://www.drmonalisclinic.com/#clinic',
        name: "Dr. Monali's Homeopathy, Skin & Hair Clinic",
        alternateName: [
          "Dr. Monali's Clinic Kolhapur",
          "Dr. Monali Clinic",
          "Dr. Monali Homeopathy",
          "Dr Monali Subhedar Clinic",
          "Dr. Monali Cosmetology & Skin Care",
          "drmonalisclinic",
          "drmonalisclinic.com",
          "Dr Monali Sachin Subhedar Clinic",
          "Monali Homeopathy Clinic Kolhapur",
          "Dr Monali Skin Clinic Kolhapur",
          "Best Homeopathy Clinic Kolhapur",
          "Homeopathy Clinic Near Ring Road Kolhapur",
          "Skin Hair Clinic Kolhapur",
          "Golden Spring Clinic Kolhapur"
        ],
        url: 'https://www.drmonalisclinic.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.drmonalisclinic.com/clinic-logo-icon.png',
          width: '512',
          height: '512',
          caption: "Dr. Monali's Homeopathy Clinic Official Logo",
        },
        image: [
          'https://www.drmonalisclinic.com/clinic-logo-icon.png',
          'https://www.drmonalisclinic.com/clinic-logo.png',
          'https://www.drmonalisclinic.com/hero-model.png',
          'https://www.drmonalisclinic.com/aboutdoc.png'
        ],
        description:
          "Ranked #1 Homeopathy, Skin Care & Hair Clinic in Kolhapur. Led by Dr. Monali Subhedar (BHMS, MD Homeopathy, Cosmetologist) & Dr. Sachin Subhedar. Specializing in constitutional homeopathy, chronic skin diseases, hair fall PRP, and clinical medifacials.",
        telephone: '+919209472224',
        email: 'info@drmonalisclinic.com',
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Golden Spring Apartment, Near Ring Road',
          addressLocality: 'Kolhapur',
          addressRegion: 'Maharashtra',
          postalCode: '416012',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 16.6956,
          longitude: 74.2317,
        },
        hasMap: 'https://maps.google.com/maps?q=Golden+Spring+Apartment+Near+Ring+Road+Kolhapur',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '10:00',
            closes: '14:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '17:00',
            closes: '21:00',
          },
        ],
        areaServed: [
          { '@type': 'City', name: 'Kolhapur' },
          { '@type': 'AdministrativeArea', name: 'Maharashtra' },
          { '@type': 'City', name: 'Ichalkaranji' },
          { '@type': 'City', name: 'Sangli' },
          { '@type': 'City', name: 'Satara' },
          { '@type': 'Country', name: 'India' },
        ],
        medicalSpecialty: [
          'Homeopathy',
          'Dermatology',
          'CosmeticSurgery',
          'Pediatrics'
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '148',
          bestRating: '5',
          worstRating: '1',
        },
        founders: [
          {
            '@type': 'Person',
            name: 'Dr. Monali Subhedar',
            jobTitle: 'Chief Medical Officer & Founder',
            honorificPrefix: 'Dr.',
            description: 'BHMS, MD (Homeopathy), Certified Clinical Cosmetologist with 15+ years experience in constitutional homeopathy, aesthetic dermatology, and trichology.',
          },
          {
            '@type': 'Person',
            name: 'Dr. Sachin Subhedar',
            jobTitle: 'Senior Consulting Homeopath & Co-Founder',
            honorificPrefix: 'Dr.',
            description: 'BHMS, expert in chronic systemic diseases, lifestyle disorders, and constitutional prescribing.',
          },
        ],
        availableService: [
          {
            '@type': 'MedicalProcedure',
            name: 'Constitutional Homeopathy for Chronic Skin Diseases',
            description: 'Root-cause treatment for Psoriasis, Vitiligo, Eczema, Lichen Planus, and Chronic Urticaria without steroid rebound.',
          },
          {
            '@type': 'MedicalProcedure',
            name: 'Hair Fall & Hair PRP Growth Therapy',
            description: 'Follicular regeneration with autologous Platelet-Rich Plasma and homeopathic constitutional remedies.',
          },
          {
            '@type': 'MedicalProcedure',
            name: 'Clinical Cosmetology & Medifacials',
            description: 'Hydra-derm facials, medical chemical peels, pigmentation correction, and acne scar remodeling.',
          },
          {
            '@type': 'MedicalProcedure',
            name: 'Non-Surgical Kidney Stone Dissolution',
            description: 'Natural homeopathic dissolution and prevention protocols for renal calculi.',
          },
          {
            '@type': 'MedicalProcedure',
            name: 'PCOD / PCOS & Hormonal Balance',
            description: 'Constitutional homeopathic correction of menstrual cycles and ovarian cystic formations.',
          },
          {
            '@type': 'MedicalProcedure',
            name: 'Pediatric Immunity & Height Growth Optimization',
            description: 'Safe, gentle pediatric constitutional healing for recurrent infections and growth support.',
          },
        ],
        sameAs: [
          'https://www.instagram.com/drmonalisachin/',
          'https://www.facebook.com/drmonalisachin/',
        ],
      },

      // 2. Doctor Entity: Dr. Monali Subhedar
      {
        '@type': 'Physician',
        '@id': 'https://drmonalisclinic.com/#drmonali',
        name: 'Dr. Monali Subhedar',
        url: 'https://drmonalisclinic.com/about',
        telephone: '+919209472224',
        medicalSpecialty: ['Homeopathy', 'Dermatology'],
        worksFor: { '@id': 'https://drmonalisclinic.com/#clinic' },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Golden Spring Apartment, Near Ring Road',
          addressLocality: 'Kolhapur',
          addressRegion: 'Maharashtra',
          postalCode: '416012',
          addressCountry: 'IN',
        },
      },

      // 3. FAQPage Schema for Google Search Rich Snippets
      {
        '@type': 'FAQPage',
        '@id': 'https://drmonalisclinic.com/#faqs',
        mainEntity: [
          {
            '@type': 'Question',
            name: "Which is the best homeopathy, skin and hair clinic in Kolhapur?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Dr. Monali's Homeopathy, Skin & Hair Clinic near Ring Road is recognized as the top clinic in Kolhapur, with a 4.9/5 star rating and over 10,000+ successfully treated patients by Dr. Monali Subhedar and Dr. Sachin Subhedar.",
            },
          },
          {
            '@type': 'Question',
            name: "What treatments are available at Dr. Monali's Clinic in Kolhapur?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: "The clinic provides constitutional homeopathy, advanced clinical cosmetology, Hydra-Derm medifacials, hair fall PRP therapy, eczema and psoriasis management, vitiligo therapy, acne scar remodeling, kidney stone treatment, and PCOD care.",
            },
          },
          {
            '@type': 'Question',
            name: "Are homeopathic medicines safe and free from side effects?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Yes, all homeopathic remedies prescribed at Dr. Monali's Clinic are 100% natural, non-toxic, and non-habit forming. They can be safely administered alongside ongoing conventional medications without harmful drug interactions.",
            },
          },
          {
            '@type': 'Question',
            name: "Does Dr. Monali's Clinic offer online video consultations?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Yes, Dr. Monali Subhedar provides encrypted online video teleconsultations for patients across India and internationally, with speed courier delivery of customized homeopathic medications directly to your doorstep.",
            },
          },
          {
            '@type': 'Question',
            name: "How can I book an appointment at Dr. Monali's Clinic in Kolhapur?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: "You can book directly through the website at drmonalisclinic.com/#booking or by calling/WhatsApp at +91 92094 72224. Walk-ins are also accommodated at Golden Spring Apartment, Near Ring Road, Kolhapur.",
            },
          },
        ],
      },
      // 4. WebSite Schema with SearchAction (enables Google Sitelinks Search Box)
      {
        '@type': 'WebSite',
        '@id': 'https://www.drmonalisclinic.com/#website',
        url: 'https://www.drmonalisclinic.com',
        name: "Dr. Monali's Homeopathy Clinic Kolhapur",
        alternateName: ['drmonalisclinic.com', 'drmonalisclinic'],
        description: "Official website of Dr. Monali's Homeopathy, Skin & Hair Clinic in Kolhapur, Maharashtra.",
        publisher: { '@id': 'https://www.drmonalisclinic.com/#clinic' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.drmonalisclinic.com/?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'en-IN',
      },

      // 5. Doctor Entity: Dr. Sachin Subhedar
      {
        '@type': 'Physician',
        '@id': 'https://drmonalisclinic.com/#drsachin',
        name: 'Dr. Sachin Subhedar',
        url: 'https://drmonalisclinic.com/about',
        telephone: '+919209472224',
        medicalSpecialty: ['Homeopathy', 'FamilyMedicine'],
        worksFor: { '@id': 'https://drmonalisclinic.com/#clinic' },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Golden Spring Apartment, Near Ring Road',
          addressLocality: 'Kolhapur',
          addressRegion: 'Maharashtra',
          postalCode: '416012',
          addressCountry: 'IN',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
