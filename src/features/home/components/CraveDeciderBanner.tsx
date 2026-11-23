import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon, AppBadge } from '../../../components/ui';
import { useTranslation } from '../../../i18n';

export interface CraveDeciderBannerProps {
  onSpinPress?: () => void;
}

export const CraveDeciderBanner: React.FC<CraveDeciderBannerProps> = ({
  onSpinPress,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#D6E3FF', '#EFF3FF', '#FFFFFF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Glow backdrop */}
        <View style={styles.ambientGlow} />

        {/* Left Side: Icon Box & Texts */}
        <View style={styles.leftCol}>
          <View style={styles.iconBox}>
            <AppIcon name="dice" size={22} color={colors.bgWhite} />
          </View>

          <View style={styles.textCol}>
            <View style={styles.titleRow}>
              <AppText variant="h4" color={colors.textPrimary}>
                {t.home.cantDecide}
              </AppText>
            </View>
            <AppText variant="body" color={colors.textSecondary} numberOfLines={1}>
              {t.home.rollDecider}
            </AppText>
          </View>
        </View>

        {/* Right Side: Spin Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSpinPress}
          style={styles.spinButton}
        >
          <AppIcon name="refresh" size={13} color={colors.bgWhite} style={styles.spinIcon} />
          <AppText variant="labelMedium" color={colors.bgWhite}>
            {t.home.spinNow}
          </AppText>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#005EB8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    position: 'relative',
    borderRadius: radius.xl,
  },
  ambientGlow: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0, 71, 141, 0.08)',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    marginLeft: spacing.md,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  spinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    height: 38,
    borderRadius: radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  spinIcon: {
    marginRight: spacing.xs,
  },
});
