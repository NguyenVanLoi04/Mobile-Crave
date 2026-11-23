import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserState {
  name: string;
  setName: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: 'Alex Nguyen',
      setName: (name: string) => set({ name }),
    }),
    {
      name: 'crave-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
