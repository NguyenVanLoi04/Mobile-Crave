import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { colors } from '../theme';
import { useAppStore } from '../store';
import { SplashScreen } from '../features/home/screens/SplashScreen';

// Feature Screens
import {
  OnboardingScreen1,
  OnboardingScreen2,
  OnboardingScreen3,
} from '../features/onboarding';
import { FoodSwipeWithMatchScreen } from '../features/swipe';
import { SpinResultScreen, WheelSpinWinnerScreen } from '../features/decider';
import { RestaurantDetailScreen } from '../features/restaurant';
import { OnboardingInputUserNameScreen } from '../features/onboarding/screens/OnboardingInputUserNameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Named Screen Wrappers (Resolves React Navigation inline function warning) ───
const Onboarding1Screen = ({ navigation }: any) => {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  return (
    <OnboardingScreen1
      onNext={() => navigation.navigate('Onboarding2')}
      onSkip={() => {
        completeOnboarding();
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }}
    />
  );
};

const Onboarding2Screen = ({ navigation }: any) => {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  return (
    <OnboardingScreen2
      onNext={() => navigation.navigate('Onboarding3')}
      onSkip={() => {
        completeOnboarding();
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }}
      onBack={() => navigation.goBack()}
    />
  );
};

const Onboarding3Screen = ({ navigation }: any) => (
  <OnboardingScreen3
    onBack={() => navigation.goBack()}
    onEnableLocation={() => navigation.navigate('InputUserName')}
    onMaybeLater={() => navigation.navigate('InputUserName')}
  />
);

const InputUserNameScreen = ({ navigation }: any) => {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  return (
    <OnboardingInputUserNameScreen
      onNext={() => {
        completeOnboarding();
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }}
    />
  );
};

const FoodSwipeMatchScreen = ({ navigation }: any) => (
  <FoodSwipeWithMatchScreen
    onDismissMatch={() => navigation.goBack()}
  />
);

const SpinResultScreenWrapper = ({ navigation }: any) => (
  <SpinResultScreen
    onSpinAgain={() => navigation.navigate('MainTabs', { screen: 'Decide' })}
  />
);

const WheelWinnerScreenWrapper = ({ navigation }: any) => (
  <WheelSpinWinnerScreen
    onClose={() => navigation.goBack()}
    onSpinAgain={() => navigation.goBack()}
    onSaveToList={() => navigation.navigate('MainTabs', { screen: 'Saved' })}
    onGetDirections={() => navigation.navigate('SpinResult')}
  />
);

export const RootNavigator: React.FC = () => {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const hasHydrated = useAppStore((state) => state._hasHydrated);
  const [isReady, setIsReady] = useState(false);
  const [isSplashTimerDone, setIsSplashTimerDone] = useState(false);

  useEffect(() => {
    // Hiển thị Splash Screen trong 1.8 giây để tạo trải nghiệm mượt mà
    const timer = setTimeout(() => {
      setIsSplashTimerDone(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasHydrated || useAppStore.persist?.hasHydrated?.()) {
      setIsReady(true);
      return;
    }
  }, [hasHydrated]);

  if (!isReady || !isSplashTimerDone) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasCompletedOnboarding ? 'MainTabs' : 'Onboarding1'}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.bgScreen,
          },
        }}
      >
        {/* ─── Onboarding Flow ────────────────────────────────────────── */}
        <Stack.Screen
          name="Onboarding1"
          component={Onboarding1Screen}
        />
        <Stack.Screen
          name="Onboarding2"
          component={Onboarding2Screen}
        />
        <Stack.Screen
          name="Onboarding3"
          component={Onboarding3Screen}
        />

        <Stack.Screen
          name="InputUserName"
          component={InputUserNameScreen}
        />

        {/* ─── Main Tab Navigation (Tab.Navigator with Tab.Screens) ──── */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
        />

        {/* ─── Modals / Transition Screens ──────────────────────────── */}
        <Stack.Screen
          name="FoodSwipeMatch"
          component={FoodSwipeMatchScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="SpinResult"
          component={SpinResultScreenWrapper}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="WheelWinner"
          component={WheelWinnerScreenWrapper}
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="RestaurantDetail"
          component={RestaurantDetailScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
