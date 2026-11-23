import { RestaurantItem } from '../../types/restaurant';
import { RESTAURANTS_DATA } from '../../constants';
import { overpassService } from './overpassService';
import { normalizeOSMElement, osmToRestaurantItem } from './restaurantAdapter';
import { locationService, UserLocationResult } from '../location/locationService';

/**
 * Restaurant Repository
 * Conforms to Section 14 of Crave plan.md (Data Layer Abstraction)
 * Separates data retrieval from UI logic, coordinates OSM Overpass API,
 * device GPS location, and fallback cache.
 */
class RestaurantRepository {
  /**
   * Fetch nearby restaurants around user coordinates
   */
  async getNearbyRestaurants(options?: {
    latitude?: number;
    longitude?: number;
    radiusMeters?: number;
    category?: string;
    cuisine?: string;
    keyword?: string;
    limit?: number;
    forceRefresh?: boolean;
  }): Promise<{ items: RestaurantItem[]; location: UserLocationResult }> {
    // 1. Determine location
    let locationResult: UserLocationResult;
    if (options?.latitude !== undefined && options?.longitude !== undefined) {
      locationResult = {
        coords: { latitude: options.latitude, longitude: options.longitude },
        isPermissionGranted: true,
        isFallback: false,
        district: 'Nearby',
        city: 'TP. Hồ Chí Minh',
      };
    } else {
      locationResult = await locationService.getCurrentLocation();
    }

    const { latitude, longitude } = locationResult.coords;

    try {
      // 2. Query Overpass API (default limit 30 closest places)
      const elements = await overpassService.fetchNearby({
        latitude,
        longitude,
        radiusMeters: options?.radiusMeters || 2000,
        category: options?.category,
        cuisine: options?.cuisine,
        keyword: options?.keyword,
        limit: options?.limit || 50,
        forceRefresh: options?.forceRefresh,
      });

      if (!elements || elements.length === 0) {
        // If Overpass returned no results in this remote location, fallback to RESTAURANTS_DATA
        return {
          items: RESTAURANTS_DATA,
          location: locationResult,
        };
      }

      // 3. Normalize & convert to Crave RestaurantItem
      const items = elements.map((el) => {
        const osm = normalizeOSMElement(el, latitude, longitude);
        return osmToRestaurantItem(osm);
      });

      // Sort by distance ascending (closest first)
      items.sort((a, b) => a.distanceKm - b.distanceKm);

      return {
        items,
        location: locationResult,
      };
    } catch (error) {
      console.warn('RestaurantRepository: Overpass failed, using local fallback:', error);
      // Graceful fallback to initial mock data so UI remains functional even without internet
      return {
        items: RESTAURANTS_DATA,
        location: locationResult,
      };
    }
  }

  /**
   * Search restaurants by keyword
   */
  async searchRestaurants(keyword: string): Promise<RestaurantItem[]> {
    const loc = await locationService.getCurrentLocation();
    const result = await this.getNearbyRestaurants({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      keyword,
    });
    return result.items;
  }

  /**
   * Lấy chi tiết thông tin một nhà hàng theo ID từ OpenStreetMap
   */
  async getRestaurantDetail(
    compositeId: string,
    userLat?: number,
    userLon?: number
  ): Promise<RestaurantItem | null> {
    const parts = compositeId.split('/');
    if (parts.length !== 2) return null;
    const type = parts[0] as 'node' | 'way' | 'relation';
    const id = parseInt(parts[1], 10);
    if (isNaN(id)) return null;

    const element = await overpassService.fetchElementDetail(type, id);
    if (!element) return null;

    const osm = normalizeOSMElement(element, userLat, userLon);
    return osmToRestaurantItem(osm);
  }
}

export const restaurantRepository = new RestaurantRepository();
