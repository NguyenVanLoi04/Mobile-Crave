import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon } from '../../ui';

const imgLogo = require('../../../../assets/images/logo.png');

export interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onProfilePress?: () => void;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = '',
  showBack = false,
  onBackPress,
  onProfilePress,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={80}
      tint="light"
      style={[styles.header, { paddingTop: insets.top }]}
    >
      <View style={styles.headerInner}>
        {/* Left: Back button OR Crave Logo */}
        {showBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBackPress}
            style={styles.backButton}
          >
            <AppIcon name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandRow}>
            <Image source={imgLogo} style={styles.logoImage} resizeMode="contain" />
            <AppText variant="h3" color={colors.textPrimary}>Crave</AppText>
          </View>
        )}

        {/* Center: Title */}
        <View style={styles.centerContainer}>
          <AppText variant="bodyLarge" color={colors.textSecondary} style={styles.headerTitle}>
            {title}
          </AppText>
        </View>

        {/* Right Action / Avatar */}
        <View style={styles.rightContainer}>
          {rightAction ? (
            rightAction
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onProfilePress}
              style={styles.avatarCircle}
            >
              <AppIcon name="person" size={16} color={colors.bgWhite} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 4,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 64,
    paddingTop: spacing.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 90,
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.bgWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '600',
  },
  rightContainer: {
    minWidth: 90,
    alignItems: 'flex-end',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});
