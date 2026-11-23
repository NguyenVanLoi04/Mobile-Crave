import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../../theme';
import { BottomNavTab, IconFamily } from '../../../types';
import { AppIcon, AppText } from '../../ui';
import { useTranslation } from '../../../i18n';
import { useSavedStore } from '../../../store';

export interface CustomBottomNavProps {
  currentTab?: BottomNavTab;
  onSelectTab?: (tab: BottomNavTab) => void;
  savedCount?: number;
  visible?: boolean;
}

export type BottomNavProps = Partial<BottomTabBarProps> & CustomBottomNavProps;

interface NavItemConfig {
  key: BottomNavTab;
  routeName: string;
  label: string;
  iconActive: string;
  iconInactive: string;
  family?: IconFamily;
  isSpecial?: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    key: 'home',
    routeName: 'Home',
    label: 'Home',
    iconActive: 'home',
    iconInactive: 'home-outline',
    family: 'Ionicons',
  },
  {
    key: 'decide',
    routeName: 'Decide',
    label: 'Decide',
    iconActive: 'dice',
    iconInactive: 'dice-outline',
    family: 'Ionicons',
  },
  {
    key: 'swipe',
    routeName: 'Swipe',
    label: 'Swipe',
    iconActive: 'cards',
    iconInactive: 'cards-outline',
    family: 'MaterialCommunityIcons',
    isSpecial: true,
  },
  {
    key: 'saved',
    routeName: 'Saved',
    label: 'Saved',
    iconActive: 'heart',
    iconInactive: 'heart-outline',
    family: 'Ionicons',
  },
  {
    key: 'profile',
    routeName: 'Profile',
    label: 'Settings',
    iconActive: 'settings',
    iconInactive: 'settings-outline',
    family: 'Ionicons',
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  state,
  descriptors,
  navigation,
  currentTab,
  onSelectTab,
  savedCount,
  visible = true,
}) => {
  const { t } = useTranslation();
  const storeSavedCount = useSavedStore((s) => s.savedItems.length);
  const actualSavedCount = savedCount !== undefined ? savedCount : storeSavedCount;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // If used inside Tab.Navigator, get active route and route name from state
  const activeRoute = state ? state.routes[state.index] : undefined;
  const activeRouteName = activeRoute?.name;

  // Check if current active route requests to hide the bottom tab bar via screen options
  const activeOptions = activeRoute && descriptors ? descriptors[activeRoute.key]?.options : undefined;
  const isHiddenByOptions =
    (activeOptions?.tabBarStyle as any)?.display === 'none' ||
    (activeOptions as any)?.tabBarVisible === false;

  const handlePress = (item: NavItemConfig) => {
    if (navigation) {
      navigation.navigate(item.routeName);
    } else if (onSelectTab) {
      onSelectTab(item.key);
    }
  };

  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(spacing.md, insets.bottom + 4);

  if (!visible || isKeyboardVisible || isHiddenByOptions) {
    return null;
  }

  return (
    <View style={[styles.navBar, { bottom: bottomOffset }]}>
      <View style={styles.navInner}>
        {NAV_ITEMS.map((item) => {
          const isActive = state
            ? activeRouteName === item.routeName
            : currentTab === item.key;

          const itemLabel =
            item.key === 'home'
              ? t.nav.home
              : item.key === 'decide'
              ? t.nav.decide
              : item.key === 'swipe'
              ? t.nav.swipe
              : item.key === 'saved'
              ? t.nav.saved
              : t.nav.settings;

          // Special Floating Center Button for SWIPE
          if (item.isSpecial) {
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.85}
                onPress={() => handlePress(item)}
                style={styles.specialNavItem}
              >
                <View
                  style={[
                    styles.specialButtonWrapper,
                    isActive && styles.specialButtonActive,
                  ]}
                >
                  <LinearGradient
                    colors={
                      isActive
                        ? ['#0072E8', '#00478D']
                        : ['#005EB8', '#003E7A']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.85, y: 1 }}
                    style={styles.specialButtonGradient}
                  >
                    <AppIcon
                      name={isActive ? item.iconActive : item.iconActive}
                      family={item.family}
                      size={25}
                      color={colors.bgWhite}
                    />
                  </LinearGradient>
                </View>
                <AppText
                  variant="labelSmall"
                  color={isActive ? colors.primary : '#64748B'}
                  style={isActive ? styles.specialLabelActive : styles.specialLabelInactive}
                >
                  {itemLabel}
                </AppText>
              </TouchableOpacity>
            );
          }

          // Standard Nav Item
          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.7}
              onPress={() => handlePress(item)}
              style={styles.navItem}
            >
              <View style={styles.iconWrapper}>
                <AppIcon
                  name={isActive ? item.iconActive : item.iconInactive}
                  family={item.family}
                  size={22}
                  color={isActive ? colors.primary : '#64748B'}
                />
                {item.key === 'saved' && actualSavedCount > 0 && (
                  <View style={styles.badge}>
                    <AppText variant="labelXS" color={colors.bgWhite} style={styles.badgeText}>
                      {actualSavedCount}
                    </AppText>
                  </View>
                )}
              </View>
              <AppText
                variant="labelSmall"
                color={isActive ? colors.primary : '#64748B'}
                style={isActive ? styles.labelActive : styles.labelInactive}
              >
                {itemLabel}
              </AppText>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    borderRadius: radius.xl + 6,
    borderWidth: 1,
    borderColor: 'rgba(218, 228, 245, 0.95)',
    backgroundColor: colors.bgWhite,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
    height: 64,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelActive: {
    fontWeight: '700',
    fontSize: 11,
    marginTop: 2,
  },
  labelInactive: {
    fontWeight: '500',
    fontSize: 11,
    marginTop: 2,
    color: '#64748B',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    marginTop: 2,
  },

  /* ─── Special Floating Center Button (Swipe) ─── */
  specialNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20, // Nhô lên khỏi thanh nav
    zIndex: 10,
  },
  specialButtonWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bgWhite,
    padding: 3.5, // Viền trắng nổi bật ngăn cách với nền
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 2,
  },
  specialButtonActive: {
    shadowColor: '#005EB8',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    transform: [{ scale: 1.06 }],
  },
  specialButtonGradient: {
    flex: 1,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialLabelActive: {
    fontWeight: '800',
    fontSize: 11,
    color: colors.primary,
  },
  specialLabelInactive: {
    fontWeight: '600',
    fontSize: 11,
    color: '#64748B',
  },

  /* ─── Badge ─── */
  badge: {
    position: 'absolute',
    top: -3,
    right: -10,
    backgroundColor: colors.accentRed,
    borderRadius: radius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.bgWhite,
  },
  badgeText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '800',
  },
});
