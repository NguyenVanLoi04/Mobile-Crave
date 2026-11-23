import { apiClient } from '../api/apiClient';
import { NominatimSearchResult } from '../../types/osm';

/**
 * Nominatim Service (Powered by Axios)
 * Complies strictly with Section 4.4 and Section 12 of Crave plan.md:
 * - Max 1 request/second across entire client
 * - Proper User-Agent identification
 * - Attributed to OpenStreetMap
 */
class NominatimService {
  private readonly BASE_URL = 'https://nominatim.openstreetmap.org';
  private lastRequestTime = 0;

  /**
   * Throttle requests to strictly enforce the OSM 1 request/second policy
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLast = now - this.lastRequestTime;
    const minInterval = 1050; // 1.05s to ensure safety margin

    if (timeSinceLast < minInterval) {
      const waitTime = minInterval - timeSinceLast;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Forward Geocoding: Search address string to find coordinates (using Axios)
   * Section 4.2 of plan.md
   */
  async searchAddress(query: string, limit: number = 5): Promise<NominatimSearchResult[]> {
    if (!query || query.trim().length === 0) return [];

    await this.enforceRateLimit();

    try {
      const response = await apiClient.get<NominatimSearchResult[]>(`${this.BASE_URL}/search`, {
        params: {
          q: query.trim(),
          format: 'jsonv2',
          addressdetails: 1,
          limit,
        },
      });

      return response.data || [];
    } catch (error) {
      console.warn('NominatimService.searchAddress error:', error);
      return [];
    }
  }

  /**
   * Reverse Geocoding: Convert coordinates to friendly address (using Axios)
   * Section 4.3 of plan.md
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<NominatimSearchResult | null> {
    await this.enforceRateLimit();

    try {
      const response = await apiClient.get<NominatimSearchResult>(`${this.BASE_URL}/reverse`, {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'jsonv2',
          addressdetails: 1,
        },
      });

      return response.data || null;
    } catch (error) {
      console.warn('NominatimService.reverseGeocode error:', error);
      return null;
    }
  }
}

export const nominatimService = new NominatimService();
