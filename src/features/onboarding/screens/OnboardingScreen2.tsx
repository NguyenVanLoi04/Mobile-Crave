import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppButton, AppIcon } from '../../../components/ui';
import { OnboardingCard } from '../components/OnboardingCard';
import { OnboardingDots } from '../components/OnboardingDots';
import { useTranslation } from '../../../i18n';

const imgLogo = require('../../../../assets/images/logo.png');
const imgIllustration = require('../../../../assets/images/welcome2.png');

export interface OnboardingScreen2Props {
  onNext: () => void;
  onSkip?: () => void;
  onBack: () => void;
  onSeeHowItWorks?: () => void;
}

export const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({
  onNext,
  onBack,
  onSkip,
  onSeeHowItWorks,
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
            <AppText variant="labelMedium" color={colors.textMuted}>2/3</AppText>
          </View>
        </View>

        {/* Visual Showcase Card */}
        <OnboardingCard
          badgeLabel="Instant Decision Engine"
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
            {t.onboarding.welcome2Title}
          </AppText>
          <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtext}>
            {t.onboarding.welcome2Subtitle}
          </AppText>
        </View>

        {/* Step dots */}
        <OnboardingDots currentStep={2} />

        {/* Action buttons */}
        <View style={styles.actionsBlock}>
          <AppButton
            title={t.onboarding.welcome2Action}
            size="lg"
            variant="primary"
            onPress={onNext}
            style={styles.ctaButton}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSeeHowItWorks || onNext}
            style={styles.secondaryLink}
          >
            <AppText variant="labelMedium" color={colors.textMuted}>
              {t.onboarding.welcome2SubAction}
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
  counterBox: {
    minWidth: 36,
    alignItems: 'flex-end',
  },
});
