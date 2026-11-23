import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Swipe: undefined;
  Decide: undefined;
  Saved: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  FoodSwipeMatch: undefined;
  SpinResult: undefined;
  WheelWinner: undefined;
  RestaurantDetail: { restaurantId?: string; restaurant?: any } | undefined;
  InputUserName: { name: string} | undefined;
};