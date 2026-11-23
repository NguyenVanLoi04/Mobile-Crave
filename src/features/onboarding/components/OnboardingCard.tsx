import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon } from '../../../components/ui';

export interface OnboardingCardProps {
  badgeLabel?: string;
  badgeIconName?: string;
  badgePosition?: 'top' | 'bottom';
  children?: React.ReactNode;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  badgeLabel,
  badgeIconName = 'dice',
  badgePosition = 'bottom',
  children,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Ambient background glow */}
      <View style={styles.ambientGlow} />

      {/* Main visual card */}
      <LinearGradient
        colors={['#FFFFFF', '#EEF3FF', '#E4ECFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.card}
      >
        {/* Top badge if position is top */}
        {badgeLabel && badgePosition === 'top' && (
          <View style={styles.topBadgeWrapper}>
            <BlurView intensity={60} tint="light" style={styles.pillBadge}>
              <AppIcon name={badgeIconName} size={14} color={colors.primary} style={styles.badgeIcon} />
              <AppText variant="labelMedium" color={colors.primary}>
                {badgeLabel}
              </AppText>
            </BlurView>
          </View>
        )}

        {/* Inner illustration or content */}
        <View style={styles.contentCenter}>{children}</View>

        {/* Bottom floating micro-pill */}
        {badgeLabel && badgePosition === 'bottom' && (
          <View style={styles.bottomBadgeWrapper}>
            <BlurView intensity={70} tint="light" style={styles.pillBadge}>
              <AppIcon name={badgeIconName} size={14} color={colors.primary} style={styles.badgeIcon} />
              <AppText variant="labelMedium" color={colors.primary}>
                {badgeLabel}
              </AppText>
            </BlurView>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    marginVertical: spacing.md,
  },
  ambientGlow: {
    position: 'absolute',
    top: 16,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0, 94, 184, 0.12)',
  },
  card: {
    width: 330,
    height: 330,
    borderRadius: radius.xl + 6,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  topBadgeWrapper: {
    position: 'absolute',
    top: 14,
    zIndex: 10,
  },
  bottomBadgeWrapper: {
    position: 'absolute',
    bottom: 14,
    zIndex: 10,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeIcon: {
    marginRight: spacing.xs,
  },
});
