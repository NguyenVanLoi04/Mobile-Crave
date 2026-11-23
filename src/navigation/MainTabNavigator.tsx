import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { BottomNav } from '../components/shared';

// Screens
import { HomeScreen } from '../features/home';
import { FoodSwipeScreen } from '../features/swipe';
import { RandomDeciderScreen } from '../features/decider';
import { ListLoveScreen } from '../features/saved';
import { ProfileScreen } from '../features/profile';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Swipe"
        component={FoodSwipeScreen}
        options={{ title: 'Swipe' }}
      />
      <Tab.Screen
        name="Decide"
        component={RandomDeciderScreen}
        options={{ title: 'Decide' }}
      />
      <Tab.Screen
        name="Saved"
        component={ListLoveScreen}
        options={{ title: 'Saved' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};
