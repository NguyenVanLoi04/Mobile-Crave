import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RestaurantItem } from '../types';

export interface SavedItem {
  id: string;
  item: RestaurantItem;
  collectionTag?: string;
  promoBadge?: string;
  heartTimeAgo?: string;
  primaryActionLabel?: string;
  primaryActionIcon?: string;
  category: 'must_visit' | 'street_food' | 'dinner' | 'all';
}

const INITIAL_SAVED_ITEMS: SavedItem[] = [];

export interface SavedState {
  savedItems: SavedItem[];
  addSaved: (
    item: RestaurantItem,
    collectionTag?: string,
    category?: SavedItem['category']
  ) => void;
  removeSaved: (idOrRestaurantId: string) => void;
  isSaved: (restaurantId: string) => boolean;
  toggleSaved: (item: RestaurantItem) => void;
  clearAllSaved: () => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedItems: INITIAL_SAVED_ITEMS,

      isSaved: (restaurantId: string) => {
        return get().savedItems.some(
          (s) => s.item.id === restaurantId || s.id === restaurantId
        );
      },

      addSaved: (item, collectionTag = 'Must Visit', category = 'must_visit') => {
        const exists = get().isSaved(item.id);
        if (exists) return;

        const newItem: SavedItem = {
          id: `saved_${item.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          item: { ...item, isFavorite: true },
          collectionTag,
          promoBadge: item.badge || 'Popular',
          heartTimeAgo: 'Just now',
          category,
        };

        set((state) => ({
          savedItems: [newItem, ...state.savedItems],
        }));
      },

      removeSaved: (idOrRestaurantId: string) => {
        set((state) => ({
          savedItems: state.savedItems.filter(
            (s) => s.id !== idOrRestaurantId && s.item.id !== idOrRestaurantId
          ),
        }));
      },

      toggleSaved: (item: RestaurantItem) => {
        const alreadySaved = get().isSaved(item.id);
        if (alreadySaved) {
          get().removeSaved(item.id);
        } else {
          get().addSaved(item);
        }
      },

      clearAllSaved: () => {
        set({ savedItems: [] });
      },
    }),
    {
      name: 'crave-saved-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        savedItems: state.savedItems,
      }),
    }
  )
);
