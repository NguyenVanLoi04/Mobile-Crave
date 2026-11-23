import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { CategoryItem, RestaurantItem } from '../../../types';
import { CATEGORIES } from '../../../constants';
import { AppHeader, RestaurantCard } from '../../../components/shared';
import { AppText, AppIcon } from '../../../components/ui';
import { GreetingBar } from '../components/GreetingBar';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { HeroBanner } from '../components/HeroBanner';
import { CraveDeciderBanner } from '../components/CraveDeciderBanner';
import { CategoryList } from '../components/CategoryList';
import { useSavedStore, useRestaurantStore } from '../../../store';
import { useNearbyRestaurantsQuery } from '../../../queries/useRestaurantsQuery';
import { locationService } from '../../../services/location/locationService';
import { useTranslation } from '../../../i18n';

export interface HomeScreenProps {
  navigation?: any;
  onNavigateToDecider?: () => void;
  onNavigateToRestaurantDetail?: (restaurant: RestaurantItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  onNavigateToDecider,
  onNavigateToRestaurantDetail,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('trending');
  const [submittedSearch, setSubmittedSearch] = useState<string>('');
  const [displayCount, setDisplayCount] = useState<number>(10);

  // ─── TanStack Query Integration ──────────────────────────────
  const {
    data: nearbyData,
    isLoading,
    isRefetching,
    refetch,
  } = useNearbyRestaurantsQuery({ limit: 50 });

  const restaurants = nearbyData?.items || [];
  const userLocation = nearbyData?.location;

  // Reset pagination when filter or search changes
  useEffect(() => {
    setDisplayCount(10);
  }, [selectedCategoryId, submittedSearch]);

  // Sync with Zustand store for other screens (FoodSwipe, RandomDecider)
  useEffect(() => {
    if (nearbyData?.items && nearbyData.items.length > 0) {
      useRestaurantStore.setState({
        restaurants: nearbyData.items,
        userLocation: nearbyData.location,
      });
    }
  }, [nearbyData]);

  const toggleSaved = useSavedStore((state) => state.toggleSaved);
  const isSaved = useSavedStore((state) => state.isSaved);

  const handleRefreshLocation = () => {
    locationService.clearCache();
    refetch();
  };

  const handleDecider = () => {
    if (onNavigateToDecider) {
      onNavigateToDecider();
    } else if (navigation) {
      navigation.navigate('Decide');
    }
  };

  const handleSwipe = () => {
    if (navigation) {
      navigation.navigate('Swipe');
    }
  };

  const handleBookmarkToggle = (item: RestaurantItem) => {
    toggleSaved(item);
  };

  const handleRestaurantPress = (restaurant: RestaurantItem) => {
    if (onNavigateToRestaurantDetail) {
      onNavigateToRestaurantDetail(restaurant);
    } else if (navigation) {
      navigation.navigate('RestaurantDetail', { restaurant });
    }
  };

  const handleSearch = useCallback((query?: string) => {
    setSubmittedSearch(query?.trim() || '');
  }, []);

  const handleClearSearch = useCallback(() => {
    setSubmittedSearch('');
  }, []);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch =
        !submittedSearch ||
        r.name.toLowerCase().includes(submittedSearch.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(submittedSearch.toLowerCase()) ||
        (r.dishSpecialty && r.dishSpecialty.toLowerCase().includes(submittedSearch.toLowerCase()));

      const matchesCategory =
        selectedCategoryId === 'trending' ||
        (selectedCategoryId === 'pho' && (r.cuisine.toLowerCase().includes('vietnamese') || r.name.toLowerCase().includes('phở') || r.name.toLowerCase().includes('pho'))) ||
        (selectedCategoryId === 'banh-mi' && (r.name.toLowerCase().includes('bánh mì') || r.name.toLowerCase().includes('banh mi') || r.cuisine.toLowerCase().includes('street food'))) ||
        (selectedCategoryId === 'sushi' && (r.cuisine.toLowerCase().includes('japanese') || r.name.toLowerCase().includes('sushi'))) ||
        (selectedCategoryId === 'coffee' && (r.cuisine.toLowerCase().includes('coffee') || r.cuisine.toLowerCase().includes('cafe') || r.name.toLowerCase().includes('cà phê'))) ||
        (selectedCategoryId === 'healthy' && r.tags?.some((t) => t.toLowerCase().includes('authentic') || t.toLowerCase().includes('soup')));

      return matchesSearch && matchesCategory;
    });
  }, [restaurants, submittedSearch, selectedCategoryId]);

  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const locationLabel = isLoading
    ? t.home.locating
    : (userLocation?.formattedAddress || 'TP. Hồ Chí Minh');

  const handleEndReached = useCallback(() => {
    if (displayCount < filteredRestaurants.length) {
      setDisplayCount((prev) => Math.min(prev + 10, filteredRestaurants.length));
    }
  }, [displayCount, filteredRestaurants.length]);

  const keyExtractor = useCallback((item: RestaurantItem) => item.id, []);

  const renderRestaurantItem = useCallback(
    ({ item }: { item: RestaurantItem }) => (
      <View style={styles.cardWrapper}>
        <RestaurantCard
          item={item}
          onPress={handleRestaurantPress}
          onBookmarkPress={handleBookmarkToggle}
        />
      </View>
    ),
    [handleRestaurantPress, handleBookmarkToggle]
  );

  const headerElement = useMemo(
    () => (
      <View>
        <GreetingBar
          locationName={locationLabel}
          isLoadingLocation={isLoading}
          onLocationPress={handleRefreshLocation}
        />
        <HomeSearchBar
          value={submittedSearch}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
        <HeroBanner onDiscoverPress={handleSwipe} />
        <CraveDeciderBanner onSpinPress={handleDecider} />
        <CategoryList
          categories={CATEGORIES}
          selectedId={selectedCategoryId}
          onSelectCategory={(cat: CategoryItem) => setSelectedCategoryId(cat.id)}
        />
        {/* Section Header */}
        <View style={styles.nearbyHeaderRow}>
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
            onPress={() => { }}
            style={styles.seeAllButton}
          >
            <AppText variant="labelMedium" color={colors.primary}>
              {t.home.seeAll}
            </AppText>
            <AppIcon name="chevron-forward" size={13} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [
      locationLabel,
      isLoading,
      handleRefreshLocation,
      submittedSearch,
      handleSearch,
      handleClearSearch,
      handleSwipe,
      handleDecider,
      selectedCategoryId,
      t.home.nearbyTitle,
      t.home.nearbySubtitle,
      t.home.seeAll,
    ]
  );

  const renderFooter = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingHeader}>
            <ActivityIndicator size="small" color={colors.primary} />
            <AppText variant="labelMedium" color={colors.primary} style={styles.loadingText}>
              {t.home.loadingPlaces}
            </AppText>
          </View>
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
      );
    }

    const hasMore = displayCount < filteredRestaurants.length;

    if (hasMore) {
      return (
        <View style={styles.scrollLoadingFooter}>
          <ActivityIndicator size="small" color={colors.primary} />
          <AppText variant="labelMedium" color={colors.primary} style={styles.loadingMoreText}>
            {t.home.loadingMore}
          </AppText>
        </View>
      );
    }

    if (filteredRestaurants.length > 5) {
      return (
        <View style={styles.endOfListFooter}>
          <AppIcon name="checkmark-circle-outline" size={16} color={colors.textLight} />
          <AppText variant="labelSmall" color={colors.textLight} style={styles.endOfListText}>
            {t.home.endOfList}
          </AppText>
        </View>
      );
    }

    return <View style={styles.bottomSpacer} />;
  }, [isLoading, displayCount, filteredRestaurants.length, t.home.loadingPlaces, t.home.loadingMore, t.home.endOfList]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyBox}>
        <AppIcon name="search-outline" size={36} color={colors.textLight} />
        <AppText variant="h4" color={colors.textSecondary} style={styles.emptyTitle}>
          {t.home.noCravingsFound}
        </AppText>
        <AppText variant="labelSmall" color={colors.textMuted} align="center">
          {t.home.tryAnotherSearch}
        </AppText>
      </View>
    );
  }, [isLoading, t.home.noCravingsFound, t.home.tryAnotherSearch]);

  const listData = isLoading ? [] : filteredRestaurants.slice(0, displayCount);

  return (
    <View style={styles.screen}>
      {/* Sticky Blur Header */}
      <AppHeader onProfilePress={() => navigation?.navigate('MainTabs', { screen: 'Profile' })} />

      {/* Performant Virtualized FlatList Feed */}
      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderRestaurantItem}
        ListHeaderComponent={headerElement}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={8}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 100 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgScreen,
  },
  scrollContent: {
    paddingTop: 72,
  },
  cardWrapper: {
    paddingHorizontal: spacing.lg,
  },
  nearbyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
  loadingContainer: {
    marginHorizontal: spacing.lg,
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
    marginHorizontal: spacing.lg,
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
  bottomSpacer: {
    height: 100,
  },
});
