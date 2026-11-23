import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppButton, AppIcon } from '../../../components/ui';
import { OnboardingCard } from '../components/OnboardingCard';
import { OnboardingDots } from '../components/OnboardingDots';
import { useTranslation } from '../../../i18n';

const imgLogo = require('../../../../assets/images/logo.png');
const imgIllustration = require('../../../../assets/images/welcome3.png');

export interface OnboardingScreen3Props {
  onBack: () => void;
  onEnableLocation: () => void;
  onMaybeLater: () => void;
}

export const OnboardingScreen3: React.FC<OnboardingScreen3Props> = ({
  onBack,
  onEnableLocation,
  onMaybeLater,
}) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backButton}>
            <AppIcon name="chevron-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <Image source={imgLogo} style={styles.brandLogo} resizeMode="contain" />
            <AppText variant="h3" color={colors.primary}>Crave</AppText>
          </View>

          <View style={styles.counterBox}>
            <AppText variant="labelMedium" color={colors.textMuted}>3/3</AppText>
          </View>
        </View>

        {/* Visual Showcase Card */}
        <OnboardingCard
          badgeLabel="Curated Local Spots"
          badgeIconName="location-sharp"
          badgePosition="top"
        >
          <Image
            source={imgIllustration}
            style={styles.heroIllustration}
            resizeMode="contain"
          />

          {/* Bottom Live Radar Badge */}
          <View style={styles.liveBadgeWrapper}>
            <View style={styles.liveDot} />
            <AppText variant="labelSmall" color={colors.textSecondary}>
              Live Wait Times Radar Active
            </AppText>
          </View>
        </OnboardingCard>

        {/* Text Content */}
        <View style={styles.textBlock}>
          <AppText variant="h1" align="center" color={colors.textPrimary} style={styles.title}>
            {t.onboarding.welcome3Title}
          </AppText>
          <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtext}>
            {t.onboarding.welcome3Subtitle}
          </AppText>
        </View>

        {/* Step dots */}
        <OnboardingDots currentStep={3} />

        {/* Action buttons */}
        <View style={styles.actionsBlock}>
          <AppButton
            title={t.onboarding.welcome3Action}
            size="lg"
            variant="primary"
            onPress={onEnableLocation}
            style={styles.ctaButton}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={onMaybeLater} style={styles.secondaryLink}>
            <AppText variant="labelMedium" color={colors.textMuted}>
              {t.onboarding.welcome3SubAction}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgScreen,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
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
    shadowRadius: 2,
    elevation: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  brandLogo: {
    width: 28,
    height: 28,
    borderRadius: 7,
  },
  counterBox: {
    minWidth: 36,
    alignItems: 'flex-end',
  },
  heroIllustration: {
    width: 250,
    height: 250,
    marginTop: 2,
    marginBottom: 6,
  },
  liveBadgeWrapper: {
    position: 'absolute',
    bottom: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    gap: spacing.xs + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  title: {
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  subtext: {
    lineHeight: 20,
  },
  actionsBlock: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  ctaButton: {
    width: '100%',
  },
  secondaryLink: {
    paddingVertical: spacing.xs,
  },
});
