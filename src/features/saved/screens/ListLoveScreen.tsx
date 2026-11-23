import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../../theme';
import { AppHeader } from '../../../components/shared';
import { AppText, AppIcon, AppButton } from '../../../components/ui';
import { SavedCard } from '../components/SavedCard';
import { HomeSearchBar } from '../../home/components/HomeSearchBar';
import { useTranslation } from '../../../i18n';
import { useSavedStore, SavedItem } from '../../../store';

export interface ListLoveScreenProps {
  navigation?: any;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'must_visit', label: 'Must Visit' },
  { id: 'street_food', label: 'Street Food' },
  { id: 'dinner', label: 'Fine Dining' },
];

export const ListLoveScreen: React.FC<ListLoveScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const savedItems = useSavedStore((state) => state.savedItems);
  const removeSaved = useSavedStore((state) => state.removeSaved);
  const [activeFilter, setActiveFilter] = useState('all');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const insets = useSafeAreaInsets();

  const handleSearch = useCallback((query?: string) => {
    setSubmittedSearch(query?.trim() || '');
  }, []);

  const handleClearSearch = useCallback(() => {
    setSubmittedSearch('');
  }, []);

  const getCategoryLabel = (id: string) => {
    switch (id) {
      case 'all':
        return t.saved.all;
      case 'must_visit':
        return t.saved.mustVisit;
      case 'street_food':
        return t.saved.streetFood;
      case 'dinner':
        return t.saved.fineDining;
      default:
        return id;
    }
  };

  const handleUnsave = useCallback(
    (id: string, name: string) => {
      Alert.alert(
        t.saved.removeFromSaved,
        t.saved.removeFromSavedConfirm,
        [
          { text: t.common.cancel, style: 'cancel' },
          {
            text: t.common.delete,
            style: 'destructive',
            onPress: () => {
              removeSaved(id);
            },
          },
        ]
      );
    },
    [removeSaved, t.saved.removeFromSaved, t.saved.removeFromSavedConfirm, t.common.cancel, t.common.delete]
  );

  const handleExploreMore = useCallback(() => {
    if (navigation) {
      navigation.navigate('MainTabs', { screen: 'Swipe' });
    }
  }, [navigation]);

  const filteredCards = useMemo(() => {
    return savedItems.filter((c) => {
      const matchesSearch =
        !submittedSearch ||
        c.item.name.toLowerCase().includes(submittedSearch.toLowerCase()) ||
        c.item.cuisine.toLowerCase().includes(submittedSearch.toLowerCase()) ||
        (c.collectionTag && c.collectionTag.toLowerCase().includes(submittedSearch.toLowerCase())) ||
        (c.item.dishSpecialty && c.item.dishSpecialty.toLowerCase().includes(submittedSearch.toLowerCase()));

      const matchesFilter =
        activeFilter === 'all' || c.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [savedItems, submittedSearch, activeFilter]);

  const keyExtractor = useCallback((item: SavedItem) => item.id, []);

  const renderSavedItem = useCallback(
    ({ item: card }: { item: SavedItem }) => (
      <View style={styles.cardItemWrapper}>
        <SavedCard
          item={card.item}
          collectionTag={card.collectionTag}
          promoBadge={card.promoBadge}
          heartTimeAgo={card.heartTimeAgo}
          primaryActionLabel={t.saved.viewDetails}
          primaryActionIcon={card.primaryActionIcon}
          onPress={() =>
            navigation?.navigate('RestaurantDetail', { restaurant: card.item })
          }
          onPrimaryAction={() =>
            navigation?.navigate('RestaurantDetail', { restaurant: card.item })
          }
          onUnsavePress={() => handleUnsave(card.id, card.item.name)}
        />
      </View>
    ),
    [navigation, handleUnsave, t.saved.viewDetails]
  );

  const headerElement = useMemo(
    () => (
      <View>
        {/* Search Bar with dedicated Search button */}
        <HomeSearchBar
          value={submittedSearch}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder={t.saved.searchPlaceholder}
        />

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            const countLabel = tab.id === 'all' ? ` (${savedItems.length})` : '';
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(tab.id)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <AppText
                  variant="labelMedium"
                  color={isActive ? colors.bgWhite : colors.textPrimary}
                >
                  {getCategoryLabel(tab.id)}
                  {countLabel}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sub-header / Status Row */}
        <View style={styles.statusRow}>
          <AppText variant="labelMedium" color={colors.textSecondary}>
            {filteredCards.length} {filteredCards.length === 1 ? t.saved.placeSaved : t.saved.placesSaved}
          </AppText>

          {(activeFilter !== 'all' || submittedSearch.length > 0) && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setActiveFilter('all');
                handleClearSearch();
              }}
            >
              <AppText variant="labelSmall" color={colors.primary} style={styles.resetText}>
                {t.saved.resetFilter}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [submittedSearch, activeFilter, savedItems.length, filteredCards.length, handleSearch, handleClearSearch, t.saved]
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <AppIcon name="heart-dislike-outline" size={32} color={colors.primary} />
        </View>
        <AppText variant="h3" color={colors.textPrimary} style={styles.emptyTitle}>
          {submittedSearch ? t.saved.noMatchingPlaces : t.saved.emptyTitle}
        </AppText>
        <AppText
          variant="body"
          color={colors.textMuted}
          align="center"
          style={styles.emptySubtext}
        >
          {submittedSearch ? t.saved.noMatchingSubtitle : t.saved.emptySubtitle}
        </AppText>
        <AppButton
          title={t.saved.exploreFood}
          size="md"
          variant="primary"
          onPress={handleExploreMore}
          iconRight={<AppIcon name="arrow-forward" size={15} color={colors.bgWhite} />}
          style={styles.emptyBtn}
        />
      </View>
    ),
    [submittedSearch, t.saved, handleExploreMore]
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <AppHeader
        title={t.saved.headerTitle}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                t.saved.headerTitle,
                `${savedItems.length} ${t.saved.placesSaved}`
              )
            }
            style={styles.headerMapBtn}
          >
            <AppIcon name="map-outline" size={17} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      {/* Performant Virtualized FlatList */}
      <FlatList
        data={filteredCards}
        keyExtractor={keyExtractor}
        renderItem={renderSavedItem}
        ListHeaderComponent={headerElement}
        ListEmptyComponent={renderEmpty}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={8}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 64,
            paddingBottom: insets.bottom + 90,
          },
        ]}
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
    paddingBottom: spacing.xxl,
  },
  headerMapBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: 'rgba(23, 111, 242, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: spacing.xs + 2,
  },
  filterChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.bgWhite,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  resetText: {
    fontWeight: '600',
  },
  cardItemWrapper: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.base,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    backgroundColor: colors.bgWhite,
    borderRadius: radius.xl,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(23, 111, 242, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  emptyTitle: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    marginBottom: spacing.lg,
    maxWidth: 260,
  },
  emptyBtn: {
    minWidth: 160,
  },
});
