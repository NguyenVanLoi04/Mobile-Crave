import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon, AppButton } from '../../../components/ui';
import { useTranslation } from '../../../i18n';
import { RestaurantItem } from '../../../types';

export interface EmptyWheelStateProps {
  savedCount: number;
  savedRestaurants?: RestaurantItem[];
  onExplorePress: () => void;
  onAddSamplePress?: () => void;
}

export const EmptyWheelState: React.FC<EmptyWheelStateProps> = ({
  savedCount,
  savedRestaurants,
  onExplorePress,
  onAddSamplePress,
}) => {
  const { t } = useTranslation();
  const progressPercent = Math.min(100, Math.round((savedCount / 3) * 100));

  const slots = [
    {
      id: 1,
      label: savedRestaurants?.[0]?.name ? savedRestaurants[0].name.slice(0, 8) + '..' : `${t.decider.placePrefix} 1`,
      icon: 'heart',
      filled: savedCount >= 1,
      image: savedRestaurants?.[0]?.image,
    },
    {
      id: 2,
      label: savedRestaurants?.[1]?.name ? savedRestaurants[1].name.slice(0, 8) + '..' : `${t.decider.placePrefix} 2`,
      icon: 'restaurant',
      filled: savedCount >= 2,
      image: savedRestaurants?.[1]?.image,
    },
    {
      id: 3,
      label: `${t.decider.placePrefix} 3`,
      icon: 'flame',
      filled: savedCount >= 3,
      image: savedRestaurants?.[2]?.image,
    },
  ];

  return (
    <View style={styles.container}>
      {/* ─── Wheel Illustration ─────────────────────────────────────── */}
      <View style={styles.illustrationWrapper}>
        <LinearGradient
          colors={['#EDF3FE', '#E1ECFE', '#F6F9FF']}
          style={styles.wheelOuterRing}
        >
          {/* Dashed Rim simulating unfilled roulette wheel */}
          <View style={styles.dashedCircle} />

          {/* Center Hub */}
          <View style={styles.centerGlow}>
            <View style={styles.centerHub}>
              <AppIcon name="dice" size={26} color={colors.bgWhite} />
            </View>
          </View>

          {/* 3 Interactive Slot Nodes Orbiting the Wheel */}
          {slots.map((slot, index) => {
            // Position 3 slots around the wheel: top (0 deg), bottom-right (120 deg), bottom-left (240 deg)
            const angleDeg = index * 120 - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radiusDist = 82;
            const x = Math.round(Math.cos(angleRad) * radiusDist);
            const y = Math.round(Math.sin(angleRad) * radiusDist);

            return (
              <View
                key={slot.id}
                style={[
                  styles.slotBadge,
                  slot.filled ? styles.slotBadgeFilled : styles.slotBadgeEmpty,
                  {
                    transform: [{ translateX: x }, { translateY: y }],
                  },
                ]}
              >
                {slot.image ? (
                  <Image
                    source={typeof slot.image === 'string' ? { uri: slot.image } : slot.image}
                    style={styles.slotImage}
                    resizeMode="cover"
                  />
                ) : (
                  <AppIcon
                    name={slot.filled ? 'checkmark-circle' : slot.icon}
                    size={14}
                    color={slot.filled ? colors.bgWhite : colors.primary}
                  />
                )}
                <AppText
                  variant="labelXS"
                  color={slot.filled ? colors.bgWhite : colors.textPrimary}
                  style={styles.slotLabel}
                >
                  {slot.label}
                </AppText>
              </View>
            );
          })}
        </LinearGradient>
      </View>

      {/* ─── Requirement Banner ─────────────────────────────────────── */}
      <View style={styles.requirementBadge}>
        <View style={styles.alertIconCircle}>
          <AppIcon name="information-circle" size={18} color={colors.primary} />
        </View>
        <AppText variant="labelMedium" color={colors.primaryDark} style={styles.requirementText}>
          {t.decider.emptySavedNeedMore}
        </AppText>
      </View>


      {/* ─── Progress Bar Card ───────────────────────────────────────── */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <AppText variant="labelSmall" color={colors.textSecondary}>
            {t.decider.unlockProgress}
          </AppText>
          <AppText variant="labelMedium" color={colors.primary} style={styles.progressCount}>
            {savedCount}/3 {t.decider.emptySavedProgress}
          </AppText>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* ─── Actions ─────────────────────────────────────────────────── */}
      <View style={styles.actionsContainer}>
        <AppButton
          title={t.decider.exploreAndSave}
          size="lg"
          variant="primary"
          onPress={onExplorePress}
          iconRight={<AppIcon name="arrow-forward" size={16} color={colors.bgWhite} />}
          style={styles.primaryBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
  illustrationWrapper: {
    marginVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelOuterRing: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 6,
    borderColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  dashedCircle: {
    position: 'absolute',
    width: 174,
    height: 174,
    borderRadius: 87,
    borderWidth: 2,
    borderColor: '#9EC1FA',
    borderStyle: 'dashed',
  },
  centerGlow: {
    padding: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(23, 111, 242, 0.12)',
  },
  centerHub: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  slotBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotBadgeFilled: {
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.bgWhite,
  },
  slotBadgeEmpty: {
    backgroundColor: colors.bgWhite,
    borderWidth: 1.5,
    borderColor: '#BBD2F8',
    borderStyle: 'dashed',
  },
  slotLabel: {
    fontWeight: '700',
  },
  slotImage: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 2,
  },
  requirementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 111, 242, 0.08)',
    paddingVertical: spacing.xs + 3,
    paddingHorizontal: spacing.base,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(23, 111, 242, 0.22)',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  alertIconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementText: {
    fontWeight: '700',
    fontSize: 13,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.base,
    paddingHorizontal: spacing.sm,
  },
  mainTitle: {
    fontSize: 22,
    marginBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  description: {
    lineHeight: 21,
    color: colors.textSecondary,
    fontSize: 14,
  },
  progressCard: {
    width: '100%',
    backgroundColor: colors.bgWhite,
    padding: spacing.base,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginVertical: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  progressCount: {
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: '#EBF1FB',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  primaryBtn: {
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  sampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  sampleText: {
    fontWeight: '600',
  },
});
