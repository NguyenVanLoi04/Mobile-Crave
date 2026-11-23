import { useQuery } from '@tanstack/react-query';
import { restaurantRepository } from '../services/osm/restaurantRepository';
import { RestaurantItem } from '../types/restaurant';
import { UserLocationResult } from '../services/location/locationService';

export interface UseNearbyRestaurantsOptions {
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
  category?: string;
  cuisine?: string;
  keyword?: string;
  limit?: number;
}

export const RESTAURANT_QUERY_KEYS = {
  all: ['restaurants'] as const,
  nearby: (params?: UseNearbyRestaurantsOptions) =>
    [
      ...RESTAURANT_QUERY_KEYS.all,
      'nearby',
      params?.latitude,
      params?.longitude,
      params?.radiusMeters,
      params?.category,
      params?.cuisine,
      params?.keyword,
      params?.limit,
    ] as const,
  search: (keyword: string) =>
    [...RESTAURANT_QUERY_KEYS.all, 'search', keyword] as const,
};

/**
 * Custom TanStack Query Hook to fetch nearby restaurants via OpenStreetMap Overpass API
 * Handles automatic caching, background revalidation, loading & error states
 */
export function useNearbyRestaurantsQuery(options?: UseNearbyRestaurantsOptions) {
  return useQuery<{ items: RestaurantItem[]; location: UserLocationResult }>({
    queryKey: RESTAURANT_QUERY_KEYS.nearby(options),
    queryFn: async () => {
      return await restaurantRepository.getNearbyRestaurants({
        latitude: options?.latitude,
        longitude: options?.longitude,
        radiusMeters: options?.radiusMeters || 2000,
        category: options?.category,
        cuisine: options?.cuisine,
        keyword: options?.keyword,
        limit: options?.limit || 50,
      });
    },
    // POI & restaurant locations rarely change, cache fresh for 2 hours
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}

/**
 * Custom TanStack Query Hook to search restaurants by keyword
 */
export function useRestaurantSearchQuery(keyword: string) {
  return useQuery<RestaurantItem[]>({
    queryKey: RESTAURANT_QUERY_KEYS.search(keyword),
    queryFn: async () => {
      return await restaurantRepository.searchRestaurants(keyword);
    },
    enabled: keyword.trim().length > 1,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
