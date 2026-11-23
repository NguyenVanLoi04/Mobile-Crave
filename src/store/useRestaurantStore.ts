import { create } from 'zustand';
import { RestaurantItem } from '../types/restaurant';
import { RESTAURANTS_DATA } from '../constants';
import { restaurantRepository } from '../services/osm/restaurantRepository';
import { locationService, UserLocationResult } from '../services/location/locationService';

export interface RestaurantState {
  restaurants: RestaurantItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  userLocation: UserLocationResult | null;
  selectedCategory: string; // 'trending' | 'pho' | 'banh-mi' | 'sushi' | 'coffee' | 'healthy' | 'all'
  searchQuery: string;

  // Actions
  fetchNearby: (forceRefresh?: boolean) => Promise<void>;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  refreshLocation: () => Promise<void>;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: RESTAURANTS_DATA,
  isLoading: false,
  isRefreshing: false,
  error: null,
  userLocation: null,
  selectedCategory: 'trending',
  searchQuery: '',

  setCategory: (category: string) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  fetchNearby: async (forceRefresh = false) => {
    // If refreshing, show refreshing state
    if (forceRefresh) {
      set({ isRefreshing: true, error: null });
    } else if (get().restaurants.length === 0 || get().restaurants === RESTAURANTS_DATA) {
      set({ isLoading: true, error: null });
    }

    try {
      const { items, location } = await restaurantRepository.getNearbyRestaurants({
        forceRefresh,
      });

      set({
        restaurants: items.length > 0 ? items : RESTAURANTS_DATA,
        userLocation: location,
        isLoading: false,
        isRefreshing: false,
        error: null,
      });
    } catch (err: any) {
      console.warn('useRestaurantStore fetchNearby error:', err);
      set({
        isLoading: false,
        isRefreshing: false,
        error: err.message || 'Không thể tải dữ liệu quán ăn',
      });
    }
  },

  refreshLocation: async () => {
    locationService.clearCache();
    await get().fetchNearby(true);
  },
}));
