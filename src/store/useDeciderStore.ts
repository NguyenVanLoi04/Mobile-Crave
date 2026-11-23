import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WheelSegment } from '../features/decider/components/SpinWheel';
import { RESTAURANTS_DATA } from '../constants';

const imgPho = require('../../assets/images/restaurant_pho.png');

export interface RollItem {
  id: string;
  name: string;
  user: string;
  timeAgo: string;
  distance: string;
  rating: number;
  image: any;
  restaurant?: any;
}

export interface DeciderState {
  lastWinner: WheelSegment | null;
  setLastWinner: (winner: WheelSegment | null) => void;
  myRolls: RollItem[];
  addMyRoll: (winner: WheelSegment) => void;
  clearRolls: () => void;
}

const INITIAL_MY_ROLLS: RollItem[] = [];

export const useDeciderStore = create<DeciderState>()(
  persist(
    (set) => ({
      lastWinner: null,
      setLastWinner: (winner) => set({ lastWinner: winner }),
      myRolls: INITIAL_MY_ROLLS,
      addMyRoll: (winner) => {
        const restaurant = winner.restaurant || RESTAURANTS_DATA[0];
        const newRoll: RollItem = {
          id: `roll_${Date.now()}`,
          name: restaurant.name || winner.label,
          user: 'You',
          timeAgo: 'Vừa xong',
          distance: restaurant.distanceKm ? `${restaurant.distanceKm} km` : 'Gần bạn',
          rating: restaurant.rating || 4.8,
          image: restaurant.image || imgPho,
          restaurant,
        };
        set((state) => ({
          lastWinner: winner,
          myRolls: [newRoll, ...state.myRolls],
        }));
      },
      clearRolls: () => set({ myRolls: [] }),
    }),
    {
      name: 'crave-decider-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
