export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'serums' | 'creams' | 'hair' | 'cleansers' | 'all';
  categoryLabel: string;
  price: number;
  mrp: number;
  volume: string;
  rating: number;
  reviewsCount: number;
  image: string;
  status: 'available' | 'coming_soon' | 'out_of_stock';
  badge?: string;
  shortDesc: string;
  fullDesc: string;
  keyActives: string[];
  benefits: string[];
  howToUse: string;
  suitableFor: string;
  ingredientsList: string;
}
