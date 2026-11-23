import React from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon } from '../../../components/ui';
import { useTranslation } from '../../../i18n';
import { useDeciderStore, RollItem } from '../../../store';

const imgPho = require('../../../../assets/images/restaurant_pho.png');

export interface RollsHistoryProps {
  navigation?: any;
}

export const RollsHistory: React.FC<RollsHistoryProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const myRolls = useDeciderStore((state) => state.myRolls);

  const handlePressCard = (restaurant: any) => {
    if (navigation && restaurant) {
      navigation.navigate('RestaurantDetail', { restaurant });
    }
  };

  const renderItem = ({ item }: { item: RollItem }) => {
    const imageSource =
      typeof item.image === 'string'
        ? { uri: item.image }
        : item.image?.uri
        ? { uri: item.image.uri }
        : item.image || imgPho;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePressCard(item.restaurant)}
        style={styles.historyCard}
      >
        <Image source={imageSource} style={styles.cardThumb} resizeMode="cover" />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <AppText
              variant="labelMedium"
              color={colors.textPrimary}
              numberOfLines={1}
              style={styles.cardName}
            >
              {item.name}
            </AppText>
            <AppIcon name="checkmark-circle" size={13} color={colors.primary} />
          </View>
          <AppText variant="labelSmall" color={colors.textMuted}>
            {item.user} {t.decider.rolledTimeAgo} {item.timeAgo}
          </AppText>
          <AppText variant="labelSmall" color={colors.textSecondary} style={styles.metaText}>
            {item.distance} • ★ {item.rating}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <AppIcon name="time-outline" size={17} color={colors.primary} style={styles.titleIcon} />
          <AppText variant="h3" color={colors.textPrimary}>
            {t.decider.recentRolls}
          </AppText>
          {myRolls.length > 0 && (
            <View style={styles.countBadge}>
              <AppText variant="labelXS" color={colors.primary} style={styles.countText}>
                {myRolls.length}
              </AppText>
            </View>
          )}
        </View>
      </View>

      {/* FlatList rendering items or clean empty state */}
      <FlatList
        data={myRolls}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
        contentContainerStyle={styles.scrollList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <AppIcon name="time-outline" size={26} color={colors.primary} />
            </View>
            <AppText variant="labelMedium" color={colors.textPrimary} style={styles.emptyTitle}>
              {t.decider.emptyRollsTitle}
            </AppText>
            <AppText variant="labelSmall" color={colors.textMuted} align="center" style={styles.emptySubtitle}>
              {t.decider.emptyRollsSubtitle}
            </AppText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs + 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 6,
  },
  countBadge: {
    backgroundColor: 'rgba(23, 111, 242, 0.1)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  countText: {
    fontWeight: '700',
  },
  emptyContainer: {
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs + 2,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    lineHeight: 18,
    maxWidth: 270,
  },
  scrollList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm + 2,
    paddingVertical: 2,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardThumb: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: '#E8EFF8',
  },
  cardContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardName: {
    fontWeight: '700',
    flex: 1,
  },
  metaText: {
    marginTop: 2,
    fontWeight: '600',
  },
});
