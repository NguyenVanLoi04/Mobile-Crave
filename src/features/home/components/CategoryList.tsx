import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { colors, spacing } from '../../../theme';
import { CategoryItem } from '../../../types';
import { AppText } from '../../../components/ui';
import { CategoryChip } from '../../../components/shared';
import { useTranslation } from '../../../i18n';

export interface CategoryListProps {
  categories: CategoryItem[];
  selectedId: string;
  onSelectCategory: (item: CategoryItem) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedId,
  onSelectCategory,
}) => {
  const { t } = useTranslation();

  const keyExtractor = useCallback((item: CategoryItem) => item.id, []);

  const renderCategoryItem = useCallback(
    ({ item }: { item: CategoryItem }) => (
      <CategoryChip
        item={item}
        isSelected={item.id === selectedId}
        onPress={onSelectCategory}
      />
    ),
    [selectedId, onSelectCategory]
  );

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <AppText variant="h3" color={colors.textPrimary}>
          {t.home.exploreCravings}
        </AppText>
      </View>

      {/* Horizontal Chips FlatList */}
      <FlatList
        data={categories}
        keyExtractor={keyExtractor}
        renderItem={renderCategoryItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm + 2,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingRight: spacing.lg,
    paddingVertical: spacing.xs,
  },
});
