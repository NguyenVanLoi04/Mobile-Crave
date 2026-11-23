export type OSMElementType = 'node' | 'way' | 'relation';

export interface OSMElement {
  type: OSMElementType;
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
}

export interface OSMOverpassResponse {
  version: number;
  generator: string;
  osm3s?: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OSMElement[];
}

export interface OSMRestaurant {
  id: string; // composite e.g. "node/123456"
  osmType: OSMElementType;
  osmId: number;
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
  cuisine?: string[];
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  distanceKm?: number;
  photoUrl?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: '$' | '$$' | '$$$' | '$$$$';
  tags: Record<string, string>;
}

export interface NominatimAddress {
  road?: string;
  house_number?: string;
  suburb?: string;
  city_district?: string;
  quarter?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  [key: string]: string | undefined;
}

export interface NominatimSearchResult {
  place_id: number;
  licence?: string;
  osm_type?: string;
  osm_id?: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  importance?: number;
  address?: NominatimAddress;
}
