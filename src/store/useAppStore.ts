import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n/translations';

export type ThemeMode = 'Light' | 'Dark' | 'System';
export type LocationOption = 'WhileUsing' | 'Always' | 'Never';

export interface AppState {
  // Onboarding Status
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Hydration state
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // Preferences
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  toggleNotifications: () => void;
  hapticFeedback: boolean;
  setHapticFeedback: (enabled: boolean) => void;
  toggleHapticFeedback: () => void;

  // Location & Cache
  locationSetting: LocationOption;
  setLocationSetting: (setting: LocationOption) => void;
  cacheSize: string;
  clearCache: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Onboarding
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),

      // Hydration state
      _hasHydrated: false,
      setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),

      // Default language is Vietnamese
      language: 'vi',
      setLanguage: (language: Language) => set({ language }),

      // Default Preferences
      theme: 'Light',
      setTheme: (theme: ThemeMode) => set({ theme }),
      notifications: true,
      setNotifications: (notifications: boolean) => set({ notifications }),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      hapticFeedback: true,
      setHapticFeedback: (hapticFeedback: boolean) => set({ hapticFeedback }),
      toggleHapticFeedback: () => set((state) => ({ hapticFeedback: !state.hapticFeedback })),

      // Location & Cache
      locationSetting: 'WhileUsing',
      setLocationSetting: (locationSetting: LocationOption) => set({ locationSetting }),
      cacheSize: '38.4 MB',
      clearCache: () => set({ cacheSize: '0 KB' }),
    }),
    {
      name: 'crave-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        language: state.language,
        theme: state.theme,
        notifications: state.notifications,
        hapticFeedback: state.hapticFeedback,
        locationSetting: state.locationSetting,
      }),
    }
  )
);
