import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '../../../theme';
import { RestaurantItem } from '../../../types';
import { AppText, AppIcon } from '../../../components/ui';
import { RestaurantCard } from '../../../components/shared';
import { useTranslation } from '../../../i18n';

export interface NearbySectionProps {
  restaurants: RestaurantItem[];
  isLoading?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRestaurantPress?: (item: RestaurantItem) => void;
  onBookmarkPress?: (item: RestaurantItem) => void;
  onSeeAllPress?: () => void;
}

export const NearbySection: React.FC<NearbySectionProps> = ({
  restaurants,
  isLoading = false,
  totalCount,
  hasMore = false,
  onLoadMore,
  onRestaurantPress,
  onBookmarkPress,
  onSeeAllPress,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <AppText variant="h3" color={colors.textPrimary}>
            {t.home.nearbyTitle}
          </AppText>
          <AppText variant="body" color={colors.textMuted}>
            {t.home.nearbySubtitle}
          </AppText>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSeeAllPress}
          style={styles.seeAllButton}
        >
          <AppText variant="labelMedium" color={colors.primary}>
            {t.home.seeAll}
          </AppText>
          <AppIcon name="chevron-forward" size={13} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Cards List */}
      <View style={styles.list}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingHeader}>
              <ActivityIndicator size="small" color={colors.primary} />
              <AppText variant="labelMedium" color={colors.primary} style={styles.loadingText}>
                {t.home.loadingPlaces}
              </AppText>
            </View>

            {/* Skeleton Placeholders */}
            {[1, 2].map((key) => (
              <View key={key} style={styles.skeletonCard}>
                <View style={styles.skeletonImage} />
                <View style={styles.skeletonBody}>
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonSubtitle} />
                  <View style={styles.skeletonRow}>
                    <View style={styles.skeletonBadge} />
                    <View style={styles.skeletonBadge} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : restaurants.length > 0 ? (
          <>
            {restaurants.map((item) => (
              <RestaurantCard
                key={item.id}
                item={item}
                onPress={onRestaurantPress}
                onBookmarkPress={onBookmarkPress}
              />
            ))}

            {hasMore ? (
              <View style={styles.scrollLoadingFooter}>
                <ActivityIndicator size="small" color={colors.primary} />
                <AppText variant="labelMedium" color={colors.primary} style={styles.loadingMoreText}>
                  {t.home.loadingMore}
                </AppText>
              </View>
            ) : restaurants.length > 5 ? (
              <View style={styles.endOfListFooter}>
                <AppIcon name="checkmark-circle-outline" size={16} color={colors.textLight} />
                <AppText variant="labelSmall" color={colors.textLight} style={styles.endOfListText}>
                  {t.home.endOfList}
                </AppText>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyBox}>
            <AppIcon name="search-outline" size={36} color={colors.textLight} />
            <AppText variant="h4" color={colors.textSecondary} style={styles.emptyTitle}>
              {t.home.noCravingsFound}
            </AppText>
            <AppText variant="labelSmall" color={colors.textMuted} align="center">
              {t.home.tryAnotherSearch}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  list: {
    marginTop: spacing.xs,
  },
  loadingContainer: {
    marginVertical: spacing.sm,
  },
  loadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(23, 111, 242, 0.06)',
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  loadingText: {
    fontWeight: '600',
  },
  skeletonCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  skeletonImage: {
    width: '100%',
    height: 155,
    backgroundColor: '#E8EFF8',
  },
  skeletonBody: {
    padding: spacing.base,
    gap: spacing.sm,
  },
  skeletonTitle: {
    width: '60%',
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: '#E8EFF8',
  },
  skeletonSubtitle: {
    width: '85%',
    height: 14,
    borderRadius: radius.sm,
    backgroundColor: '#F0F4FA',
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  skeletonBadge: {
    width: 70,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: '#F0F4FA',
  },
  emptyBox: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: 16,
    marginVertical: spacing.sm,
  },
  emptyTitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  scrollLoadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.base,
  },
  loadingMoreText: {
    fontSize: 13,
    fontWeight: '600',
  },
  endOfListFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.base,
  },
  endOfListText: {
    fontSize: 12,
  },
});
