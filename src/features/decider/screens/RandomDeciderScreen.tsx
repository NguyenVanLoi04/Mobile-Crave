import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { AppHeader } from '../../../components/shared';
import { AppText, AppIcon, AppButton } from '../../../components/ui';
import { useTranslation } from '../../../i18n';
import { SpinWheel, SpinWheelRef, WheelSegment, getCuisineIcon } from '../components/SpinWheel';
import { RollsHistory } from '../components/RollsHistory';
import { WinnerPopupModal } from '../components/WinnerPopupModal';
import { EmptyWheelState } from '../components/EmptyWheelState';
import { useDeciderStore, useSavedStore, useRestaurantStore } from '../../../store';
import { RESTAURANTS_DATA } from '../../../constants';

export interface RandomDeciderScreenProps {
  navigation?: any;
  onSpinComplete?: (winner?: WheelSegment) => void;
  onOpenWinnerPopup?: (winner?: WheelSegment) => void;
}

export const RandomDeciderScreen: React.FC<RandomDeciderScreenProps> = ({
  navigation,
  onSpinComplete,
  onOpenWinnerPopup,
}) => {
  const { t } = useTranslation();
  const addMyRoll = useDeciderStore((state) => state.addMyRoll);
  const savedItems = useSavedStore((state) => state.savedItems);
  const addSaved = useSavedStore((state) => state.addSaved);
  const restaurants = useRestaurantStore((state) => state.restaurants);

  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<WheelSegment | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const spinWheelRef = useRef<SpinWheelRef>(null);

  // Extract saved restaurants from store
  const savedRestaurants = useMemo(
    () => savedItems.map((s) => s.item),
    [savedItems]
  );

  // User must have > 2 saved restaurants to spin
  const hasEnoughRestaurants = savedRestaurants.length > 2;

  // Map saved restaurants to wheel segments (up to 8 for wheel balance)
  const segments: WheelSegment[] = useMemo(() => {
    return savedRestaurants.slice(0, 8).map((r) => ({
      id: r.id,
      label: r.name,
      iconName: getCuisineIcon(r.cuisine, r.name),
      image: r.image,
      restaurant: r,
    }));
  }, [savedRestaurants]);

  const matchingRestaurant = selectedWinner?.restaurant
    ? selectedWinner.restaurant
    : selectedWinner
      ? restaurants.find(
        (r) =>
          r.name.toLowerCase().includes(selectedWinner.label.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(selectedWinner.label.toLowerCase())
      ) || restaurants[0]
      : restaurants[0];

  const handleStartSpin = () => {
    if (isSpinning || !hasEnoughRestaurants) return;
    setIsSpinning(true);
    spinWheelRef.current?.spin();
  };

  const handleSpinWinner = (winner?: WheelSegment) => {
    setIsSpinning(false);
    if (winner) {
      setSelectedWinner(winner);
      setShowWinnerModal(true);
      addMyRoll(winner);
    }
    if (onOpenWinnerPopup) {
      onOpenWinnerPopup(winner);
    } else if (onSpinComplete) {
      onSpinComplete(winner);
    }
  };

  const handleSpinAgain = () => {
    setShowWinnerModal(false);
    setTimeout(() => {
      handleStartSpin();
    }, 350);
  };

  const handleGetDirections = () => {
    setShowWinnerModal(false);
    if (matchingRestaurant) {
      navigation?.navigate('RestaurantDetail', { restaurant: matchingRestaurant });
    }
  };

  const handleSaveToList = () => {
    setShowWinnerModal(false);
    navigation?.navigate('MainTabs', { screen: 'Saved' });
  };

  const handleExplorePress = () => {
    if (navigation) {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  const handleAddSampleRestaurants = () => {
    RESTAURANTS_DATA.slice(0, 3).forEach((item) => {
      addSaved(item, 'Mẫu thử vòng xoay', 'must_visit');
    });
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <AppHeader title={t.decider.headerTitle} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 72,
            paddingBottom: insets.bottom + 90,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <View style={styles.introBlock}>
          <AppText variant="h1" align="center" color={colors.textPrimary} style={styles.title}>
            {t.decider.title}
          </AppText>
          <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtext}>
            {hasEnoughRestaurants ? t.decider.spinningFromSaved : t.decider.subtitle}
          </AppText>
        </View>

        {hasEnoughRestaurants ? (
          <>
            {/* Spin Wheel Interactive Centerpiece */}
            <View style={styles.wheelWrapper}>
              <SpinWheel
                ref={spinWheelRef}
                segments={segments}
                onSpinPress={handleSpinWinner}
                showReadyBanner={true}
              />
            </View>

            {/* CTA Button & Hint */}
            <View style={styles.ctaWrapper}>
              <AppButton
                title={isSpinning ? t.decider.deciding : t.decider.spinWheel}
                size="lg"
                variant="primary"
                disabled={isSpinning}
                onPress={handleStartSpin}
                style={styles.spinCta}
              />

              <View style={styles.hintRow}>
                <AppText variant="labelSmall" color={colors.textMuted}>
                  {t.decider.hint}
                </AppText>
              </View>
            </View>

            {/* Recent Rolls History */}
            <RollsHistory navigation={navigation} />
          </>
        ) : (
          /* Empty Illustration State when saved count <= 2 */
          <EmptyWheelState
            savedCount={savedRestaurants.length}
            savedRestaurants={savedRestaurants}
            onExplorePress={handleExplorePress}
            onAddSamplePress={handleAddSampleRestaurants}
          />
        )}
      </ScrollView>

      {/* Popup Kết quả sau khi quay (Dạng Popup Modal, không chuyển trang) */}
      <WinnerPopupModal
        visible={showWinnerModal}
        winner={selectedWinner}
        onClose={() => setShowWinnerModal(false)}
        onSpinAgain={handleSpinAgain}
        onGetDirections={handleGetDirections}
        onSaveToList={handleSaveToList}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgScreen,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  introBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  title: {
    marginBottom: spacing.xs,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  subtext: {
    lineHeight: 20,
    maxWidth: 290,
  },
  wheelWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  ctaWrapper: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  spinCta: {
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs + 2,
    gap: 4,
  },
});
