import { apiClient } from '../api/apiClient';
import { OSMElement, OSMOverpassResponse } from '../../types/osm';

/**
 * Overpass API Service (Powered by Axios)
 * Conforms to Section 3 of Crave plan.md:
 * - Queries nodes, ways, and relations (nwr) around user coordinates
 * - Supports amenity filters: restaurant, cafe, fast_food, food_court, ice_cream, bakery
 * - Supports cuisine tag filters
 * - Features automatic fallback to secondary mirror if primary is slow or down
 */
class OverpassService {
  private readonly ENDPOINTS = [
    'https://overpass.openstreetmap.fr/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
  ];

  private cache: Map<string, { data: OSMElement[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours cache (POIs & restaurants rarely change)

  /**
   * Build Overpass QL query string
   */
  private buildQuery(
    latitude: number,
    longitude: number,
    radiusMeters: number,
    categoryFilter?: string,
    cuisineFilter?: string,
    nameKeyword?: string,
    limit: number = 50
  ): string {
    const lat = latitude.toFixed(6);
    const lon = longitude.toFixed(6);
    const radius = Math.min(Math.max(radiusMeters, 500), 10000); // 500m to 10km safety clamp

    let filterClause = '';

    if (nameKeyword && nameKeyword.trim().length > 0) {
      // Search by name keyword
      const cleanKeyword = nameKeyword.trim().replace(/["\\]/g, '');
      filterClause = `
        nwr["amenity"~"^(restaurant|cafe|fast_food|food_court|ice_cream)$"]["name"~"${cleanKeyword}",i](around:${radius},${lat},${lon});
        nwr["shop"~"^(bakery|pastry|tea)$"]["name"~"${cleanKeyword}",i](around:${radius},${lat},${lon});
      `;
    } else if (cuisineFilter && cuisineFilter.trim().length > 0) {
      // Search by cuisine (e.g. vietnamese, japanese, italian, pizza, etc.)
      const cleanCuisine = cuisineFilter.trim().toLowerCase();
      filterClause = `
        nwr["amenity"~"^(restaurant|fast_food)$"]["cuisine"~"${cleanCuisine}",i](around:${radius},${lat},${lon});
      `;
    } else if (categoryFilter === 'cafe') {
      filterClause = `
        nwr["amenity"="cafe"](around:${radius},${lat},${lon});
        nwr["shop"~"^(bakery|pastry|tea)$"](around:${radius},${lat},${lon});
      `;
    } else if (categoryFilter === 'fast_food') {
      filterClause = `
        nwr["amenity"="fast_food"](around:${radius},${lat},${lon});
      `;
    } else if (categoryFilter === 'restaurant') {
      filterClause = `
        nwr["amenity"="restaurant"](around:${radius},${lat},${lon});
      `;
    } else {
      // General food & drinks query (Section 3.3 of plan.md)
      filterClause = `
        nwr["amenity"~"^(restaurant|cafe|fast_food|food_court|ice_cream)$"](around:${radius},${lat},${lon});
        nwr["shop"~"^(bakery|pastry|tea)$"](around:${radius},${lat},${lon});
      `;
    }

    const countLimit = limit > 0 ? ` ${Math.min(limit, 100)}` : ' 50';
    return `[out:json][timeout:25];(${filterClause});out center tags${countLimit};`;
  }

  /**
   * Fetch nearby food places from Overpass API using Axios
   */
  async fetchNearby(options: {
    latitude: number;
    longitude: number;
    radiusMeters?: number;
    category?: string;
    cuisine?: string;
    keyword?: string;
    limit?: number;
    forceRefresh?: boolean;
  }): Promise<OSMElement[]> {
    const {
      latitude,
      longitude,
      radiusMeters = 2000,
      category,
      cuisine,
      keyword,
      limit = 30,
      forceRefresh = false,
    } = options;

    const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}_${radiusMeters}_${category || ''}_${cuisine || ''}_${keyword || ''}_${limit}`;
    const now = Date.now();

    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
        return cached.data;
      }
    }

    const query = this.buildQuery(
      latitude,
      longitude,
      radiusMeters,
      category,
      cuisine,
      keyword,
      limit
    );

    let elements: OSMElement[] = [];
    let lastError: any = null;

    // Try mirrors sequentially with Axios until one responds with valid data
    for (const endpoint of this.ENDPOINTS) {
      try {
        elements = await this.executeQuery(endpoint, query);
        if (elements && elements.length > 0) {
          break; // Succeeded!
        }
      } catch (err) {
        lastError = err;
        console.warn(`Overpass endpoint ${endpoint} failed, trying next mirror...`);
      }
    }

    if (elements.length === 0 && lastError) {
      console.warn('All Overpass mirrors failed or timed out:', lastError);
    }

    // Filter out items without a valid name or coordinates
    const validElements = elements.filter((el) => {
      const hasName = el.tags && el.tags.name && el.tags.name.trim().length > 0;
      const hasCoords =
        (el.lat !== undefined && el.lon !== undefined) ||
        (el.center && el.center.lat !== undefined && el.center.lon !== undefined);
      return hasName && hasCoords;
    });

    this.cache.set(cacheKey, {
      data: validElements,
      timestamp: now,
    });

    return validElements;
  }

  /**
   * Execute GET/POST request to Overpass interpreter using Axios
   * Ưu tiên GET request để tránh các vấn đề CORS OPTIONS preflight và socket hangup trên Android
   */
  private async executeQuery(endpoint: string, query: string): Promise<OSMElement[]> {
    try {
      // 1. Thử GET request trước (nhẹ nhất, hoạt động ổn định trên Android/iOS)
      const url = `${endpoint}?data=${encodeURIComponent(query)}`;
      const response = await apiClient.get<OSMOverpassResponse>(url, {
        timeout: 10000,
      });
      return response.data?.elements || [];
    } catch {
      // 2. Fallback sang POST request nếu GET không thành công
      try {
        const response = await apiClient.post<OSMOverpassResponse>(
          endpoint,
          `data=${encodeURIComponent(query)}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 10000,
          }
        );
        return response.data?.elements || [];
      } catch (postErr) {
        throw postErr;
      }
    }
  }

  /**
   * Fetch detail of a single OSM element by ID and type
   */
  async fetchElementDetail(
    osmType: 'node' | 'way' | 'relation',
    osmId: number
  ): Promise<OSMElement | null> {
    const query = `[out:json][timeout:15];(${osmType}(${osmId}););out center tags;`;
    for (const endpoint of this.ENDPOINTS) {
      try {
        const elements = await this.executeQuery(endpoint, query);
        if (elements && elements.length > 0) {
          return elements[0];
        }
      } catch (err) {
        console.warn(`Overpass detail failed on ${endpoint}:`, err);
      }
    }
    return null;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const overpassService = new OverpassService();
