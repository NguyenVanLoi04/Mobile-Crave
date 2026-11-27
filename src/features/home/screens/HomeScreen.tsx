import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../theme';
import { CategoryItem, RestaurantItem } from '../../../types';
import { CATEGORIES, RESTAURANTS_DATA } from '../../../constants';
import { AppHeader, RestaurantCard } from '../../../components/shared';
import { AppText, AppIcon } from '../../../components/ui';
import { GreetingBar } from '../components/GreetingBar';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { HeroBanner } from '../components/HeroBanner';
import { CraveDeciderBanner } from '../components/CraveDeciderBanner';
import { CategoryList } from '../components/CategoryList';
import { useSavedStore, useRestaurantStore } from '../../../store';
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
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sync RESTAURANTS_DATA to Zustand store once for other screens (FoodSwipe, RandomDecider)
  useEffect(() => {
    useRestaurantStore.setState({
      restaurants: RESTAURANTS_DATA,
      isLoading: false,
    });
  }, []);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setDisplayCount(10);
  }, [selectedCategoryId, submittedSearch]);

  const toggleSaved = useSavedStore((state) => state.toggleSaved);

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

  // Instant in-memory filter (No API delay, No 502, No timeouts)
  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS_DATA.filter((r) => {
      const matchesSearch =
        !submittedSearch ||
        r.name.toLowerCase().includes(submittedSearch.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(submittedSearch.toLowerCase()) ||
        (r.dishSpecialty && r.dishSpecialty.toLowerCase().includes(submittedSearch.toLowerCase())) ||
        (r.tags && r.tags.some((t) => t.toLowerCase().includes(submittedSearch.toLowerCase())));

      const matchesCategory =
        selectedCategoryId === 'trending' ||
        (selectedCategoryId === 'pho' &&
          (r.cuisine.toLowerCase().includes('vietnamese') ||
            r.name.toLowerCase().includes('phở') ||
            r.name.toLowerCase().includes('bún') ||
            r.dishSpecialty?.toLowerCase().includes('phở') ||
            r.dishSpecialty?.toLowerCase().includes('bún'))) ||
        (selectedCategoryId === 'banh-mi' &&
          (r.name.toLowerCase().includes('bánh') ||
            r.cuisine.toLowerCase().includes('street food') ||
            r.dishSpecialty?.toLowerCase().includes('bánh'))) ||
        (selectedCategoryId === 'sushi' &&
          (r.cuisine.toLowerCase().includes('japanese') ||
            r.name.toLowerCase().includes('sushi') ||
            r.name.toLowerCase().includes('ramen'))) ||
        (selectedCategoryId === 'coffee' &&
          (r.cuisine.toLowerCase().includes('coffee') ||
            r.name.toLowerCase().includes('coffee') ||
            r.name.toLowerCase().includes('cà phê'))) ||
        (selectedCategoryId === 'healthy' &&
          (r.cuisine.toLowerCase().includes('healthy') ||
            r.name.toLowerCase().includes('healthy') ||
            r.tags?.some((t) => t.toLowerCase().includes('fresh') || t.toLowerCase().includes('clean'))));

      return matchesSearch && matchesCategory;
    });
  }, [submittedSearch, selectedCategoryId]);

  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const handleEndReached = useCallback(() => {
    if (displayCount < filteredRestaurants.length) {
      setDisplayCount((prev) => Math.min(prev + 10, filteredRestaurants.length));
    }
  }, [displayCount, filteredRestaurants.length]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setSubmittedSearch('');
    setDisplayCount(10);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  }, []);

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
          locationName="TP. Hồ Chí Minh"
          isLoadingLocation={false}
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
            onPress={() => setSelectedCategoryId('trending')}
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
    return <View style={styles.bottomSpacer} />;
  }, []);

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyBox}>
        <AppIcon name="search-outline" size={36} color={colors.textMuted} />
        <AppText variant="h4" color={colors.textSecondary} style={styles.emptyTitle}>
          {t.home.noCravingsFound}
        </AppText>
        <AppText variant="labelSmall" color={colors.textMuted} align="center">
          {t.home.tryAnotherSearch}
        </AppText>
      </View>
    );
  }, [t.home.noCravingsFound, t.home.tryAnotherSearch]);

  const listData = filteredRestaurants.slice(0, displayCount);

  return (
    <View style={styles.screen}>
      <AppHeader
        onProfilePress={() => navigation?.navigate('MainTabs', { screen: 'Profile' })}
      />

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
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 100 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
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
  bottomSpacer: {
    height: spacing.xl,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.bgWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: spacing.md,
  },
  emptyTitle: {
    marginTop: spacing.sm,
    marginBottom: 4,
  },
});
