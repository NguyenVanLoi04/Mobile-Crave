export interface MenuItem {
  id: string;
  name: string;
  price: string;
  desc: string;
  isBestseller?: boolean;
  image: any;
  category?: string;
}

export interface RestaurantItem {
  id: string;
  name: string;
  image: any; // ImageSourcePropType / require or { uri: string }
  badge?: string;
  rating: number;
  reviewsCount: string;
  deliveryTime: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  cuisine: string;
  distanceKm: number;
  highlightTag?: string;
  isFavorite?: boolean;
  address?: string;
  openUntil?: string;
  tags?: string[];
  dishSpecialty?: string;
  // OSM OpenStreetMap fields
  latitude?: number;
  longitude?: number;
  osmId?: number;
  osmType?: 'node' | 'way' | 'relation';
  phone?: string;
  website?: string;
  openingHours?: string;
  osmTags?: Record<string, string>;
  isIllustration?: boolean;
  menu?: MenuItem[];
  menuUrl?: string;
}
