import { Service } from '@/types/admin';

export const defaultServices: Service[] = [
  // ==========================================
  // HOMEOPATHY TREATMENTS (/homeopathy)
  // ==========================================
  {
    id: 'kidney-stones',
    title: 'Kidney Stones',
    category: 'homeopathy',
    indications: 'Renal calculi, sudden flank pain, burning urination, recurrent stone formation',
    description: 'Safe, natural homeopathic remedies that gently dissolve kidney stones and facilitate natural expulsion without surgery. Prevents recurrent calculus formation.',
    highlights: ['Non-Surgical Stone Dissolution', 'Pain & Spasm Relief', 'Prevents Recurrence', 'Safe for Renal Health'],
    image: '/services/kidney-stones.jpg',
    imagePosition: 'object-center'
  },
  {
    id: 'piles',
    title: 'Piles (Hemorrhoids)',
    category: 'homeopathy',
    indications: 'Painful bleeding piles, internal and external hemorrhoids, anal fissures, chronic constipation',
    description: 'Effective homeopathic treatment providing relief from swelling, bleeding, and burning. Addresses root digestive and venous causes without surgical trauma.',
    highlights: ['Painless, Non-Invasive', 'Relieves Bleeding & Inflammation', 'Corrects Root Digestive Cause', 'No Surgical Recovery Period'],
    image: '/services/piles.jpg',
    imagePosition: 'object-center'
  },
  {
    id: 'height-increase',
    title: 'Height Increase',
    category: 'homeopathy',
    indications: 'Delayed growth milestones, short stature in children & adolescents, bone density and posture support',
    description: 'Constitutional homeopathic growth therapy designed to naturally stimulate growth hormone response, support bone epiphyseal plates, and optimize metabolic absorption during growth years.',
    highlights: ['Safe for Children & Teens', 'Naturally Supports Growth Plates', 'Improves Calcium Assimilation', '100% Hormone-Free'],
    image: '/services/height-increase.png',
    imagePosition: 'object-[center_12%]'
  },
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    category: 'homeopathy',
    indications: 'Sluggish metabolism, obesity, hormonal weight retention, post-pregnancy weight gain, thyroid-related weight',
    description: 'Holistic weight loss protocol that balances sluggish metabolism, curbs unhealthy cravings, and promotes natural fat burning alongside personalized dietary guidance.',
    highlights: ['Boosts Basal Metabolic Rate', 'Zero Crash Dieting', 'Hormonal & Thyroid Balancing', 'Long-Term Sustainable Results'],
    image: '/services/weight-loss.png',
    imagePosition: 'object-center'
  },
  {
    id: 'weight-gain',
    title: 'Weight Gain',
    category: 'homeopathy',
    indications: 'Underweight conditions, poor appetite, malabsorption, post-illness emaciation, muscle weakness',
    description: 'Constitutional therapy focused on improving digestive fire, enhancing nutrient absorption in the gut, and building healthy lean mass and stamina.',
    highlights: ['Stimulates Healthy Appetite', 'Enhances Gut Nutrient Absorption', 'Increases Energy & Vitality', 'Safe & Natural Mass Building'],
    image: '/services/weight-gain.png',
    imagePosition: 'object-center'
  },
  {
    id: 'eczema-psoriasis',
    title: 'Eczema & Psoriasis',
    category: 'homeopathy',
    indications: 'Dry red patches, silvery flaking scales, chronic intense itching, dermatitis, cracked weeping skin',
    description: 'Deep constitutional healing addressing immune dysregulation and skin barrier inflammation at the root, delivering long-term remission without steroid dependence.',
    highlights: ['100% Steroid-Free Healing', 'Calms Severe Itching & Scaling', 'Regulates Autoimmune Response', 'Long-Term Skin Remission'],
    image: '/services/psoriasis.jpg',
    imagePosition: 'object-center'
  },
  {
    id: 'pcod',
    title: 'PCOD (Polycystic Ovarian Disease)',
    category: 'homeopathy',
    indications: 'Irregular or missed periods, hormonal cystic acne, hirsutism (unwanted facial hair), ovarian cysts, weight fluctuations',
    description: 'Gentle homeopathic treatment that addresses hormonal imbalance, dissolves follicular cysts, restores regular menstrual cycles, and supports fertility naturally.',
    highlights: ['Restores Natural Menstrual Rhythm', 'Reduces Cyst Formation', 'Controls Hormonal Acne & Hair Fall', 'Safe for Long-Term Reproductive Health'],
    image: '/services/pcod.png',
    imagePosition: 'object-center'
  },

  // ==========================================
  // COSMETIC TREATMENTS (/cosmetic-treatments)
  // ==========================================
  {
    id: 'medifacial',
    title: 'Medifacial',
    category: 'cosmetic',
    indications: 'Dullness, dehydrated skin, clogged pores, sun damage, lack of natural glow',
    description: 'Medical-grade clinical facials utilizing ultrasound, deep infusion of active serums, and gentle vacuum extraction for instantaneous glow and deep cellular hydration.',
    highlights: ['Immediate Radiant Glow', 'Deep Pore Cleansing', 'Customized to Your Skin Type', 'Zero Downtime'],
    image: '/services/medifacial.png',
    imagePosition: 'object-center'
  },
  {
    id: 'anti-acne',
    title: 'Anti-Acne Treatment',
    category: 'cosmetic',
    indications: 'Active acne, recurring breakouts, inflammatory papules & pustules, excessive oil production',
    description: 'Comprehensive anti-acne therapy combining topical clinical treatments with homeopathic root-cause remedies to soothe inflammation and clear breakouts permanently.',
    highlights: ['Targeted Antibacterial Action', 'Regulates Excess Sebum', 'Prevents Acne Scarring', 'Soothes Active Inflammation'],
    image: '/services/anti-acne.png',
    imagePosition: 'object-center'
  },
  {
    id: 'chemical-peel',
    title: 'Chemical Peel',
    category: 'cosmetic',
    indications: 'Superficial acne scars, pigmentation, uneven skin tone, fine lines, rough skin texture',
    description: 'Dermatologically formulated chemical peels that gently exfoliate damaged outer layers, revealing smoother, brighter, and rejuvenated skin underneath.',
    highlights: ['Removes Damaged Outer Cells', 'Lightens Stubborn Marks', 'Smooths Skin Surface', 'Customized Peel Strengths'],
    image: '/services/chemical-peel.png',
    imagePosition: 'object-center'
  },
  {
    id: 'anti-aging',
    title: 'Anti-Aging Treatment',
    category: 'cosmetic',
    indications: 'Fine lines, crow\'s feet, skin laxity, loss of firmness, dull aged complexion',
    description: 'Non-surgical aesthetic therapies that boost natural collagen synthesis, firm sagging skin, and restore youthful elasticity and vitality.',
    highlights: ['Stimulates Natural Collagen', 'Firms & Tones Skin Texture', 'Reduces Fine Expression Lines', 'Youthful Natural Rejuvenation'],
    image: '/services/anti-aging.png',
    imagePosition: 'object-center'
  },
  {
    id: 'pigmentation',
    title: 'Pigmentation Treatment',
    category: 'cosmetic',
    indications: 'Melasma, dark patches, sun spots, post-acne marks, hyperpigmentation',
    description: 'Advanced pigment-clearing protocols designed to inhibit excess melanin production and gradually restore an even, luminous skin tone.',
    highlights: ['Targets Deep Melanin Deposits', 'Fades Melasma & Sun Spots', 'Even, Bright Complexion', 'Safe for All Indian Skin Types'],
    image: '/services/pigmentation.png',
    imagePosition: 'object-center'
  },
  {
    id: 'removal-moles-warts',
    title: 'Removal of Moles, Warts, & Skin Tags',
    category: 'cosmetic',
    indications: 'Elevated moles, benign viral warts, unwanted skin tags on neck, face, and body',
    description: 'Quick, hygienic, and precise cosmetic removal procedure performed under local anesthesia with minimal discomfort and clean cosmetic healing.',
    highlights: ['Quick In-Clinic Procedure', 'Virtually Painless', 'Minimal to No Scarring', 'Immediate Clear Skin'],
    image: '/services/moles-warts-removal.png',
    imagePosition: 'object-center'
  },

  // ==========================================
  // HAIR & SKIN TREATMENTS (/hair-and-skin)
  // ==========================================
  {
    id: 'hair-prp',
    title: 'Hair PRP (Platelet-Rich Plasma)',
    category: 'hair-skin',
    indications: 'Androgenetic alopecia, hair thinning, excessive shedding, receding hairline, weakened follicles',
    description: 'Autologous platelet-rich plasma enriched with natural growth factors injected into the scalp to awaken dormant follicles, increase hair density, and arrest hair fall.',
    highlights: ['100% Autologous (Own Blood)', 'Stimulates Dormant Follicles', 'Thickens Existing Hair Strands', 'Clinically Proven Efficacy'],
    image: '/services/hair-prp.png',
    imagePosition: 'object-center'
  },
  {
    id: 'skin-prp',
    title: 'Skin PRP',
    category: 'hair-skin',
    indications: 'Tired dull skin, loss of skin elasticity, micro-wrinkles, under-eye dark circles, uneven texture',
    description: 'Harnessing your body\'s own concentrated growth factors to trigger vigorous collagen synthesis, cell renewal, and a luminous, firm complexion.',
    highlights: ['Natural Collagen Stimulation', 'Restores Youthful Radiance', 'Improves Fine Lines & Texture', 'Safe & Biocompatible'],
    image: '/services/skin-prp.png',
    imagePosition: 'object-center'
  },
  {
    id: 'mesotherapy',
    title: 'Mesotherapy',
    category: 'hair-skin',
    indications: 'Scalp nutrient depletion, hair thinning, superficial dehydration, dull skin tone',
    description: 'Micro-infusion of customized nutrient cocktails containing essential vitamins, minerals, and peptides directly into the target dermal and scalp layer.',
    highlights: ['Direct Nutritional Delivery', 'Strengthens Hair Roots', 'Intense Skin Hydration', 'Quick & Comfortable'],
    image: '/services/mesotherapy.png',
    imagePosition: 'object-center'
  },
  {
    id: 'microneedling',
    title: 'Microneedling',
    category: 'hair-skin',
    indications: 'Atrophic acne scars, enlarged pores, skin texture irregularities, stretch marks',
    description: 'Precision micro-channeling that triggers the natural wound healing cascade, generating fresh elastin and collagen for smooth, refined skin texture.',
    highlights: ['Visibly Reduces Acne Scars', 'Tightens Enlarged Pores', 'Improves Skin Elasticity', 'Enhanced Serum Penetration'],
    image: '/services/microneedling.png',
    imagePosition: 'object-center'
  },
  {
    id: 'high-frequency',
    title: 'High-Frequency Therapy',
    category: 'hair-skin',
    indications: 'Stubborn active acne, bacterial scalp conditions, poor blood circulation, hair thinning',
    description: 'Gentle electrical current therapy that produces germicidal ozone to eliminate acne-causing bacteria, soothe inflammation, and stimulate micro-circulation in hair follicles.',
    highlights: ['Antibacterial & Antiseptic Action', 'Calms Cystic Breakouts', 'Stimulates Scalp Microcirculation', 'Painless & Relaxing'],
    image: '/services/high-frequency.png',
    imagePosition: 'object-center'
  }
];
