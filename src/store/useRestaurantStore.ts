import { create } from 'zustand';
import { RestaurantItem } from '../types/restaurant';
import { RESTAURANTS_DATA } from '../constants';

export interface RestaurantState {
  restaurants: RestaurantItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  selectedCategory: string; // 'trending' | 'pho' | 'banh-mi' | 'sushi' | 'coffee' | 'healthy' | 'all'
  searchQuery: string;

  // Actions
  fetchNearby: (forceRefresh?: boolean) => Promise<void>;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  refreshLocation: () => Promise<void>;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: RESTAURANTS_DATA,
  isLoading: false,
  isRefreshing: false,
  error: null,
  selectedCategory: 'trending',
  searchQuery: '',

  setCategory: (category: string) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  fetchNearby: async () => {
    set({ restaurants: RESTAURANTS_DATA, isLoading: false, isRefreshing: false, error: null });
  },

  refreshLocation: async () => {
    set({ restaurants: RESTAURANTS_DATA, isLoading: false });
  },
}));
