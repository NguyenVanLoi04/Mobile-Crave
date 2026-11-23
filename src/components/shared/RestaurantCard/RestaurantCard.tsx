import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing } from '../../../theme';
import { RestaurantItem } from '../../../types';
import { AppIcon, AppText, AppBadge } from '../../ui';
import { useTranslation } from '../../../i18n';

export interface RestaurantCardProps {
  item: RestaurantItem;
  onPress?: (item: RestaurantItem) => void;
  onBookmarkPress?: (item: RestaurantItem) => void;
  variant?: 'compact' | 'standard';
}

export const RestaurantCard: React.FC<RestaurantCardProps> = React.memo(({
  item,
  onPress,
  onBookmarkPress,
  variant = 'standard',
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
      style={styles.card}
    >
      {/* Image container with floating pills */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />

        {/* Rating Pill Top-Left */}
        <BlurView intensity={80} tint="light" style={styles.ratingPill}>
          <AppIcon name="star" size={11} color="#FFB800" style={styles.starIcon} />
          <AppText variant="labelMedium" color={colors.textPrimary}>
            {item.rating.toFixed(1)}
          </AppText>
          <AppText variant="labelSmall" color={colors.textMuted} style={styles.reviewText}>
            {item.reviewsCount}
          </AppText>
        </BlurView>

        {/* Bookmark Top-Right */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onBookmarkPress?.(item)}
          style={styles.bookmarkButton}
        >
          <BlurView intensity={80} tint="light" style={styles.bookmarkBlur}>
            <AppIcon
              name={item.isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={14}
              color={item.isFavorite ? colors.primary : colors.textPrimary}
            />
          </BlurView>
        </TouchableOpacity>

        {/* Quick Badge Bottom-Left */}
        {item.badge && (
          <View style={styles.badgeWrapper}>
            <AppBadge label={item.badge} variant="dark" />
          </View>
        )}

        {/* Illustration Tag Bottom-Right */}
        {item.isIllustration && (
          <View style={styles.illustrationTag}>
            <AppIcon name="image-outline" size={10} color="#FFFFFF" style={{ marginRight: 3 }} />
            <AppText variant="labelXS" style={styles.illustrationText}>
              {t.restaurant.illustrationTag}
            </AppText>
          </View>
        )}
      </View>

      {/* Info details */}
      <View style={styles.infoContainer}>
        {/* Name and Delivery Time badge */}
        <View style={styles.headerRow}>
          <AppText
            variant="h4"
            color={colors.textPrimary}
            numberOfLines={1}
            style={styles.title}
          >
            {item.name}
          </AppText>
          <AppBadge label={item.deliveryTime} variant="accent" />
        </View>

        {/* Meta row: Price · Cuisine · Distance · Highlight */}
        <View style={styles.metaRow}>
          <AppText variant="body" color={colors.textSecondary}>
            {item.priceLevel} • {item.cuisine}
          </AppText>

          <View style={styles.dotSeparator} />

          <View style={styles.distanceRow}>
            <AppIcon name="navigate" size={11} color={colors.primary} style={styles.navIcon} />
            <AppText variant="labelMedium" color={colors.primary}>
              {item.distanceKm} km
            </AppText>
          </View>

          {item.highlightTag && (
            <>
              <View style={styles.dotSeparator} />
              <AppText variant="body" color={colors.textSecondary} numberOfLines={1}>
                {item.highlightTag}
              </AppText>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginTop: spacing.base,
    shadowColor: 'rgba(23, 43, 69, 1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  imageContainer: {
    height: 180,
    backgroundColor: '#DDE9FF',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingPill: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  starIcon: {
    marginRight: spacing.xs,
  },
  reviewText: {
    marginLeft: 2,
  },
  bookmarkButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  bookmarkBlur: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrapper: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
  },
  illustrationTag: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  illustrationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  infoContainer: {
    padding: spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
    gap: spacing.sm,
  },
  title: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.separator,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    marginRight: 2,
  },
});
