import React from 'react';
import { View, StyleSheet, Image, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing } from '../../../theme';
import { RestaurantItem } from '../../../types';
import { AppText, AppIcon } from '../../../components/ui';
import { useTranslation } from '../../../i18n';

export interface SwipeCardProps {
  restaurant: RestaurantItem;
  showMatchStamp?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  restaurant,
  showMatchStamp = false,
  style,
}) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.card, style]}>
      {/* Background Image */}
      <Image source={restaurant.image} style={styles.bgImage} resizeMode="cover" />

      {/* Gradient Scrim for legibility */}
      <LinearGradient
        colors={['rgba(6, 28, 53, 0.4)', 'transparent', 'rgba(6, 28, 53, 0.95)']}
        locations={[0, 0.35, 0.85]}
        style={styles.scrim}
      >
        {/* Top Badges Row */}
        <View style={styles.topBadgesRow}>
          {/* Rating */}
          <BlurView intensity={70} tint="light" style={styles.pillBadge}>
            <AppIcon name="star" size={12} color="#FFB800" style={styles.badgeIcon} />
            <AppText variant="labelMedium" color={colors.textPrimary}>
              {restaurant.rating.toFixed(1)}
            </AppText>
            <AppText variant="labelSmall" color={colors.textMuted} style={styles.reviewsText}>
              {restaurant.reviewsCount}
            </AppText>
          </BlurView>

          {/* Distance */}
          <BlurView intensity={70} tint="dark" style={styles.distanceBadge}>
            <AppIcon name="location-sharp" size={12} color={colors.bgWhite} style={styles.badgeIcon} />
            <AppText variant="labelSmall" color={colors.bgWhite}>
              {restaurant.distanceKm} km
            </AppText>
          </BlurView>

          {/* Illustration Tag if not real photo */}
          {restaurant.isIllustration && (
            <View style={styles.illustrationTag}>
              <AppText variant="labelXS" color="#FFFFFF">
                {t.restaurant.illustrationTag}
              </AppText>
            </View>
          )}
        </View>

        {/* Center: CRAVE IT Stamp if Match State */}
        {showMatchStamp && (
          <View style={styles.matchStampWrapper}>
            <View style={styles.matchStamp}>
              <AppIcon name="heart" size={20} color={colors.bgWhite} style={styles.stampHeart} />
              <AppText variant="h3" color={colors.bgWhite} style={styles.stampText}>
                {t.swipe.craveIt}
              </AppText>
            </View>
          </View>
        )}

        {/* Bottom Details Sheet */}
        <View style={styles.bottomSheet}>
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <AppText variant="h1" color={colors.bgWhite} style={styles.titleText}>
                {restaurant.name}
              </AppText>
              <View style={styles.statusRow}>
                <AppText variant="body" color={colors.accentBlueFaint}>
                  {restaurant.address} •{' '}
                </AppText>
                <AppText variant="body" color="#00E676" style={styles.statusOpen}>
                  {t.swipe.openNowUntil} {restaurant.openUntil}
                </AppText>
              </View>
            </View>

            <View style={styles.categoryBadge}>
              <AppText variant="labelSmall" color={colors.bgWhite}>
                {restaurant.priceLevel} • Street Food King
              </AppText>
            </View>
          </View>

          {/* Culinary Tags */}
          <View style={styles.tagsRow}>
            {restaurant.tags?.map((tag, index) => (
              <BlurView key={index} intensity={40} tint="light" style={styles.culinaryTag}>
                <AppText variant="labelSmall" color={colors.bgWhite}>
                  {tag}
                </AppText>
              </BlurView>
            ))}
          </View>

          {/* Micro Hints */}
          <View style={styles.hintsRow}>
            <View style={styles.hintItem}>
              <AppIcon name="arrow-back" size={12} color={colors.accentBlueFaint} />
              <AppText variant="labelSmall" color={colors.accentBlueFaint} style={styles.hintText}>
                {t.swipe.swipeLeftHint}
              </AppText>
            </View>

            <View style={styles.hintItem}>
              <AppText variant="labelSmall" color={colors.accentBlueFaint} style={styles.hintText}>
                {t.swipe.swipeRightHint}
              </AppText>
              <AppIcon name="arrow-forward" size={12} color={colors.accentBlueFaint} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 480,
    borderRadius: radius.xl + 4,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  scrim: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.base,
  },
  topBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  badgeIcon: {
    marginRight: 4,
  },
  reviewsText: {
    marginLeft: 2,
  },
  chefPickBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMedium,
  },
  chefPickText: {
    fontWeight: '700',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginLeft: 'auto',
  },
  illustrationTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  matchStampWrapper: {
    alignSelf: 'center',
    transform: [{ rotate: '-12deg' }],
  },
  matchStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BA88',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    borderWidth: 3,
    borderColor: colors.bgWhite,
    shadowColor: '#00BA88',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  stampHeart: {
    marginRight: spacing.xs + 2,
  },
  stampText: {
    letterSpacing: 1,
    fontWeight: '800',
  },
  bottomSheet: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  titleText: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statusOpen: {
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  culinaryTag: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  hintsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  hintText: {
    fontWeight: '600',
  },
});
