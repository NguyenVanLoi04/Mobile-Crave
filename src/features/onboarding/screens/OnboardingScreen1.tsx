import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppButton } from '../../../components/ui';
import { OnboardingCard } from '../components/OnboardingCard';
import { OnboardingDots } from '../components/OnboardingDots';
import { useTranslation } from '../../../i18n';

const imgLogo = require('../../../../assets/images/logo.png');
const imgIllustration = require('../../../../assets/images/welcome1.png');

export interface OnboardingScreenProps {
  onNext: () => void;
  onSkip?: () => void;
}

export const OnboardingScreen1: React.FC<OnboardingScreenProps> = ({
  onNext,
  onSkip,
}) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.topBar}>
          <View style={styles.brandPill}>
            <Image source={imgLogo} style={styles.brandLogo} resizeMode="contain" />
            <AppText variant="h4" color={colors.textPrimary}>Crave</AppText>
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={onSkip} style={styles.skipButton}>
            <AppText variant="bodyLarge" color={colors.textMuted}>{t.onboarding.skip}</AppText>
          </TouchableOpacity>
        </View>

        {/* Visual Showcase Card */}
        <OnboardingCard
          badgeLabel="Decide Mode Ready"
          badgeIconName="dice"
          badgePosition="bottom"
        >
          <Image
            source={imgIllustration}
            style={styles.heroIllustration}
            resizeMode="contain"
          />
        </OnboardingCard>

        {/* Text Content */}
        <View style={styles.textBlock}>
          <AppText variant="h1" align="center" color={colors.textPrimary} style={styles.title}>
            {t.onboarding.welcome1Title}
          </AppText>
          <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtext}>
            {t.onboarding.welcome1Subtitle}
          </AppText>
        </View>

        {/* Step dots */}
        <OnboardingDots currentStep={1} />

        {/* Action buttons */}
        <View style={styles.actionsBlock}>
          <AppButton
            title={t.onboarding.welcome1Action}
            size="lg"
            variant="primary"
            onPress={onNext}
            style={styles.ctaButton}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={onNext} style={styles.secondaryLink}>
            <AppText variant="labelMedium" color={colors.textMuted}>
              {t.onboarding.welcome1SubAction}
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
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: 'rgba(230, 238, 255, 0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  brandLogo: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  brandCircle: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    padding: spacing.xs,
  },
  heroIllustration: {
    width: 260,
    height: 260,
    marginTop: -10,
    marginBottom: spacing.xs,
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
