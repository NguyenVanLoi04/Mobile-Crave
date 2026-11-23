import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon } from '../../../components/ui';
import { useTranslation } from '../../../i18n';

export interface SwipeFilterRailProps {
  selectedCategory?: string;
  distanceFilter?: string;
  onSelectCategory?: (category: string) => void;
  onToggleDistance?: () => void;
}

export const SwipeFilterRail: React.FC<SwipeFilterRailProps> = ({
  selectedCategory = 'all',
  distanceFilter = '< 3 km',
  onSelectCategory,
  onToggleDistance,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All Cravings */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectCategory?.('all')}
          style={[styles.pill, selectedCategory === 'all' && styles.pillActive]}
        >
          <AppIcon
            name="flame"
            size={14}
            color={selectedCategory === 'all' ? colors.bgWhite : colors.primary}
            style={styles.icon}
          />
          <AppText
            variant="labelMedium"
            color={selectedCategory === 'all' ? colors.bgWhite : colors.textPrimary}
          >
            {t.swipe.allCravings}
          </AppText>
        </TouchableOpacity>

        {/* Vietnamese */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectCategory?.('vietnamese')}
          style={[styles.pill, selectedCategory === 'vietnamese' && styles.pillActive]}
        >
          <AppIcon
            name="restaurant-outline"
            size={14}
            color={selectedCategory === 'vietnamese' ? colors.bgWhite : colors.primary}
            style={styles.icon}
          />
          <AppText
            variant="labelMedium"
            color={selectedCategory === 'vietnamese' ? colors.bgWhite : colors.textPrimary}
          >
            {t.swipe.vietnamese}
          </AppText>
        </TouchableOpacity>

        {/* Distance Filter */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleDistance}
          style={styles.distancePill}
        >
          <AppIcon name="navigate-outline" size={13} color={colors.primary} style={styles.icon} />
          <AppText variant="labelMedium" color={colors.primary}>
            {distanceFilter}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.bgWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pillActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.accentBlue,
  },
  icon: {
    marginRight: spacing.xs,
  },
});
