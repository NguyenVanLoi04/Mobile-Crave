import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing } from '../../../theme';
import { RestaurantItem } from '../../../types';
import { AppText, AppIcon, AppButton } from '../../../components/ui';
import { useTranslation } from '../../../i18n';

export interface SavedCardProps {
  item: RestaurantItem;
  collectionTag?: string;
  promoBadge?: string;
  heartTimeAgo?: string;
  primaryActionLabel?: string;
  primaryActionIcon?: string;
  onPress?: () => void;
  onPrimaryAction?: () => void;
  onMapPress?: () => void;
  onSharePress?: () => void;
  onUnsavePress?: () => void;
}

export const SavedCard: React.FC<SavedCardProps> = React.memo(({
  item,
  collectionTag,
  promoBadge,
  heartTimeAgo,
  primaryActionLabel,
  primaryActionIcon = 'restaurant-outline',
  onPress,
  onPrimaryAction,
  onMapPress,
  onSharePress,
  onUnsavePress,
}) => {
  const { t } = useTranslation();
  const actualActionLabel = primaryActionLabel || t.saved.viewDetails;
  const handleShare = async () => {
    if (onSharePress) {
      onSharePress();
      return;
    }
    try {
      await Share.share({
        message: `Check out ${item.name} on Crave! Location: ${item.address}`,
      });
    } catch {
      // Ignore
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={styles.card}
    >
      {/* Cover Image */}
      <View style={styles.imageBox}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />

        {/* Rating Pill Top-Left */}
        <BlurView intensity={80} tint="light" style={styles.ratingPill}>
          <AppIcon name="star" size={11} color="#FFB800" style={styles.starIcon} />
          <AppText variant="labelMedium" color={colors.textPrimary}>
            {item.rating.toFixed(1)}
          </AppText>
          <AppText variant="labelSmall" color={colors.textMuted} style={styles.countText}>
            {item.reviewsCount}
          </AppText>
        </BlurView>

        {/* Red Heart Button Top-Right (Unsave) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onUnsavePress}
          style={styles.heartButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <BlurView intensity={85} tint="light" style={styles.heartBlur}>
            <AppIcon name="heart" size={16} color="#FF3B30" />
          </BlurView>
        </TouchableOpacity>

        {/* Badge Bottom-Left (if collectionTag or promoBadge exists) */}
        {(collectionTag || promoBadge) && (
          <View style={styles.badgeWrapper}>
            <BlurView intensity={70} tint="dark" style={styles.darkBadge}>
              <AppText variant="labelSmall" color={colors.bgWhite} style={styles.badgeText}>
                {collectionTag || promoBadge}
              </AppText>
            </BlurView>
          </View>
        )}

        {/* Illustration Tag if not real photo and no collectionTag */}
        {item.isIllustration && !collectionTag && !promoBadge && (
          <View style={styles.badgeWrapper}>
            <View style={styles.illustrationBadge}>
              <AppText variant="labelXS" color="#FFFFFF">
                {t.restaurant.illustrationTag}
              </AppText>
            </View>
          </View>
        )}

        {/* Hearted time pill bottom-right */}
        {heartTimeAgo && (
          <View style={styles.timeWrapper}>
            <BlurView intensity={65} tint="dark" style={styles.timeBadge}>
              <AppIcon name="time-outline" size={10} color={colors.bgWhite} style={styles.timeIcon} />
              <AppText variant="labelXS" color={colors.bgWhite}>
                {heartTimeAgo}
              </AppText>
            </BlurView>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        {/* Name & Cuisine/Price */}
        <View style={styles.headerRow}>
          <AppText
            variant="h4"
            color={colors.textPrimary}
            numberOfLines={1}
            style={styles.nameText}
          >
            {item.name}
          </AppText>
          <View style={styles.cuisinePill}>
            <AppText variant="labelSmall" color={colors.primary}>
              {item.cuisine.split('&')[0].trim()}
            </AppText>
          </View>
        </View>

        {/* Specialty Dish / Description */}
        {item.dishSpecialty && (
          <AppText
            variant="body"
            color={colors.textSecondary}
            numberOfLines={1}
            style={styles.specialty}
          >
            {item.dishSpecialty}
          </AppText>
        )}

        {/* Location & Distance Meta */}
        <View style={styles.metaRow}>
          <View style={styles.distanceRow}>
            <AppIcon name="navigate" size={11} color={colors.primary} style={styles.navIcon} />
            <AppText variant="labelMedium" color={colors.primary}>
              {item.distanceKm} km
            </AppText>
          </View>

          <View style={styles.dotSeparator} />

          <AppText
            variant="body"
            color={colors.textMuted}
            numberOfLines={1}
            style={styles.addressText}
          >
            {item.address}
          </AppText>

          <View style={styles.dotSeparator} />

          <AppText variant="body" color={colors.textSecondary}>
            {item.priceLevel}
          </AppText>
        </View>

        {/* Action Row */}
        <View style={styles.actionsRow}>
          <AppButton
            title={actualActionLabel}
            size="sm"
            variant="primary"
            onPress={onPrimaryAction || onPress}
            iconLeft={<AppIcon name={primaryActionIcon} size={14} color={colors.bgWhite} />}
            style={styles.primaryBtn}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onMapPress || onPrimaryAction || onPress}
            style={styles.iconBtn}
          >
            <AppIcon name="navigate-outline" size={17} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShare}
            style={styles.iconBtn}
          >
            <AppIcon name="share-outline" size={17} color={colors.primary} />
          </TouchableOpacity>
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
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: 'rgba(23, 43, 69, 1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  imageBox: {
    height: 155,
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
    marginRight: 3,
  },
  countText: {
    marginLeft: 2,
  },
  heartButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  heartBlur: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  badgeWrapper: {
    position: 'absolute',
    bottom: spacing.sm + 2,
    left: spacing.md,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  darkBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
  },
  badgeText: {
    fontWeight: '600',
  },
  illustrationBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  timeWrapper: {
    position: 'absolute',
    bottom: spacing.sm + 2,
    right: spacing.md,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: 3,
  },
  timeIcon: {
    marginRight: 2,
  },
  infoSection: {
    padding: spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: 4,
  },
  nameText: {
    flex: 1,
    fontWeight: '700',
  },
  cuisinePill: {
    backgroundColor: colors.accentBlue,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  specialty: {
    marginBottom: spacing.xs + 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    marginRight: 2,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.separator,
  },
  addressText: {
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  primaryBtn: {
    flex: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
