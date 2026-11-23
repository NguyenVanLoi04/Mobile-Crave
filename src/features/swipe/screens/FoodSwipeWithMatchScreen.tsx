import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../theme';
import { RESTAURANTS_DATA } from '../../../constants';
import { AppHeader } from '../../../components/shared';
import { useTranslation } from '../../../i18n';
import { SwipeFilterRail } from '../components/SwipeFilterRail';
import { SwipeCard } from '../components/SwipeCard';
import { SwipeActionDock } from '../components/SwipeActionDock';

export interface FoodSwipeWithMatchScreenProps {
  onDismissMatch?: () => void;
}

export const FoodSwipeWithMatchScreen: React.FC<FoodSwipeWithMatchScreenProps> = ({
  onDismissMatch,
}) => {
  const { t } = useTranslation();
  const matchedRestaurant = RESTAURANTS_DATA[1]; // Bánh Mì Huỳnh Hoa
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* Sticky Header */}
      <AppHeader title={t.swipe.headerTitle} />

      {/* Content */}
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 64,
            paddingBottom: insets.bottom + 80,
          },
        ]}
      >
          <SwipeFilterRail selectedCategory="all" />

          {/* Deck with tilted Card and Match Stamp */}
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={onDismissMatch}
            style={styles.deckContainer}
          >
            {/* Background card preview */}
            <View style={styles.bgCardPreview}>
              <SwipeCard restaurant={RESTAURANTS_DATA[0]} style={styles.bgCard} />
            </View>

            {/* Matched card tilted with "CRAVE IT" rubber stamp */}
            <View style={styles.tiltedCardWrapper}>
              <SwipeCard
                restaurant={matchedRestaurant}
                showMatchStamp={true}
              />
            </View>
          </TouchableOpacity>

          {/* Action Dock */}
          <SwipeActionDock
            onUndo={onDismissMatch}
            onPass={onDismissMatch}
            onLove={onDismissMatch}
          />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgScreen,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.bgScreen,
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingTop: 68,
    paddingBottom: 80,
    justifyContent: 'space-between',
  },
  deckContainer: {
    flex: 1,
    paddingHorizontal: spacing.base,
    justifyContent: 'center',
    position: 'relative',
  },
  bgCardPreview: {
    position: 'absolute',
    top: 10,
    left: spacing.lg,
    right: spacing.lg,
    opacity: 0.6,
    transform: [{ scale: 0.94 }],
  },
  bgCard: {
    height: 470,
  },
  tiltedCardWrapper: {
    transform: [{ rotate: '5deg' }],
  },
});
