import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon } from '../../../components/ui';
import { useTranslation } from '../../../i18n';

const heroImg = require('../../../../assets/images/hero_food.png');

export interface HeroBannerProps {
  onDiscoverPress?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onDiscoverPress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.imageBackground}>
        <Image
          source={heroImg}
          style={[StyleSheet.absoluteFill, styles.imageStyle]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[colors.heroOverlayLight, colors.heroOverlayMid, colors.heroOverlay]}
          locations={[0, 0.45, 1]}
          style={styles.gradient}
        >
          {/* Chef's Selection Tag */}
          <BlurView intensity={45} tint="light" style={styles.chefBadge}>
            <AppIcon name="restaurant-outline" size={11} color={colors.bgWhite} style={styles.badgeIcon} />
            <AppText variant="labelSmall" color={colors.bgWhite} style={styles.chefBadgeText}>
              {t.home.chefsSelection}
            </AppText>
          </BlurView>

          {/* Heading */}
          <AppText variant="h2" color={colors.bgWhite} style={styles.headline}>
            {t.home.heroHeadline}
          </AppText>

          {/* Bottom row: Subtext + Discover CTA */}
          <View style={styles.bottomRow}>
            <AppText variant="body" color={colors.accentBlueFaint}>
              {t.home.curatedDishes}
            </AppText>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onDiscoverPress}
              style={styles.discoverButton}
            >
              <AppText variant="labelMedium" color={colors.bgWhite}>
                {t.home.discoverNow}
              </AppText>
              <AppIcon
                name="arrow-forward"
                size={13}
                color={colors.bgWhite}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 6,
  },
  imageBackground: {
    width: '100%',
    height: 210,
  },
  imageStyle: {
    borderRadius: radius.xl,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  chefBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs + 2,
  },
  badgeIcon: {
    marginRight: spacing.xs,
  },
  chefBadgeText: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headline: {
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005EB8',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  arrowIcon: {
    marginLeft: spacing.xs,
  },
});
