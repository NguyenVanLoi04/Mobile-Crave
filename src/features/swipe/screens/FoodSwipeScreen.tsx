import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, StyleSheet, Animated, PanResponder, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { RESTAURANTS_DATA } from '../../../constants';
import { AppHeader } from '../../../components/shared';
import { AppText, AppIcon } from '../../../components/ui';
import { useTranslation } from '../../../i18n';
import { SwipeFilterRail } from '../components/SwipeFilterRail';
import { SwipeCard } from '../components/SwipeCard';
import { SwipeActionDock } from '../components/SwipeActionDock';
import { useSavedStore, useRestaurantStore } from '../../../store';

export interface FoodSwipeScreenProps {
  navigation?: any;
  onMatchStateTrigger?: () => void;
}

export const FoodSwipeScreen: React.FC<FoodSwipeScreenProps> = ({
  navigation,
  onMatchStateTrigger,
}) => {
  const { t } = useTranslation();
  const addSaved = useSavedStore((state) => state.addSaved);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const isDragging = useRef(false);

  // Khi currentIndex thay đổi và React đã nạp thẻ mới xong -> khôi phục opacity mượt mà
  useEffect(() => {
    cardOpacity.setValue(1);
  }, [currentIndex]);

  const storeRestaurants = useRestaurantStore((state) => state.restaurants);
  const baseRestaurants = storeRestaurants.length > 0 ? storeRestaurants : RESTAURANTS_DATA;

  const filteredDeck = useMemo(() => {
    return baseRestaurants.filter((r) => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'vietnamese')
        return r.cuisine.toLowerCase().includes('vietnamese') || r.name.toLowerCase().includes('pho');
      if (selectedFilter === 'asian')
        return (
          r.cuisine.toLowerCase().includes('japanese') ||
          r.cuisine.toLowerCase().includes('asian') ||
          r.cuisine.toLowerCase().includes('sushi')
        );
      if (selectedFilter === 'cafe')
        return (
          r.cuisine.toLowerCase().includes('cafe') ||
          r.cuisine.toLowerCase().includes('coffee') ||
          r.cuisine.toLowerCase().includes('dessert')
        );
      return true;
    });
  }, [baseRestaurants, selectedFilter]);

  const deck = filteredDeck.length > 0 ? filteredDeck : baseRestaurants;
  const currentRestaurant = deck[currentIndex % deck.length];
  const nextRestaurant = deck[(currentIndex + 1) % deck.length];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage(null);
    });
  };

  const swipeOut = (direction: 'left' | 'right', onComplete?: () => void) => {
    const toX = direction === 'right' ? 600 : -600;

    Animated.parallel([
      Animated.timing(cardAnim, {
        toValue: toX,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(bgAnim, {
        toValue: 300,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 1. Tàng hình thẻ cũ ngay lập tức để không bao giờ bị giật xuất hiện lại ở tâm màn hình
      cardOpacity.setValue(0);
      // 2. Reset vị trí thẻ về 0 (lúc này đang tàng hình nên người dùng hoàn toàn không thấy)
      cardAnim.setValue(0);
      // 3. Reset background anim cho thẻ mới phía sau
      bgAnim.setValue(0);
      // 4. Chuyển sang thẻ tiếp theo
      setCurrentIndex((prev) => (prev + 1) % deck.length);
      onComplete?.();
    });
  };

  const handlePass = () => {
    swipeOut('left');
  };

  const handleLove = () => {
    addSaved(currentRestaurant, 'Loved via Swipe', 'must_visit');
    swipeOut('right', () => {
      if (onMatchStateTrigger) {
        onMatchStateTrigger();
      }
    });
  };

  const handleSuperLike = () => {
    addSaved(currentRestaurant, 'Super Liked', 'must_visit');
    swipeOut('right', () => {
      if (onMatchStateTrigger) {
        onMatchStateTrigger();
      }
    });
  };

  const handleUndo = () => {
    cardOpacity.setValue(1);
    cardAnim.setValue(-400);
    bgAnim.setValue(0);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : deck.length - 1));
    Animated.spring(cardAnim, {
      toValue: 0,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 8,
      onPanResponderGrant: () => {
        isDragging.current = false;
      },
      onPanResponderMove: (_, gesture) => {
        if (Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10) {
          isDragging.current = true;
        }
        cardAnim.setValue(gesture.dx);
        bgAnim.setValue(Math.min(Math.abs(gesture.dx), 300));
      },
      onPanResponderRelease: (_, gesture) => {
        const isSwipeRight = gesture.dx > 100 || (gesture.dx > 30 && gesture.vx > 0.4);
        const isSwipeLeft = gesture.dx < -100 || (gesture.dx < -30 && gesture.vx < -0.4);

        if (isSwipeRight) {
          handleLove();
        } else if (isSwipeLeft) {
          handlePass();
        } else {
          Animated.parallel([
            Animated.spring(cardAnim, {
              toValue: 0,
              friction: 6,
              tension: 50,
              useNativeDriver: true,
            }),
            Animated.spring(bgAnim, {
              toValue: 0,
              friction: 6,
              tension: 50,
              useNativeDriver: true,
            }),
          ]).start();
        }

        setTimeout(() => {
          isDragging.current = false;
        }, 150);
      },
    })
  ).current;

  const cardRotation = cardAnim.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: ['-14deg', '0deg', '14deg'],
  });

  const likeStampOpacity = cardAnim.interpolate({
    inputRange: [20, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passStampOpacity = cardAnim.interpolate({
    inputRange: [-100, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const bgCardScale = bgAnim.interpolate({
    inputRange: [0, 300],
    outputRange: [0.94, 1.0],
    extrapolate: 'clamp',
  });

  const bgCardOpacity = bgAnim.interpolate({
    inputRange: [0, 300],
    outputRange: [0.65, 1.0],
    extrapolate: 'clamp',
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* Sticky Header */}
      <AppHeader title={t.swipe.headerTitle} />

      {/* Floating HUD Toast */}
      {toastMessage && (
        <Animated.View
          style={[
            styles.toastWrapper,
            {
              top: insets.top + 60,
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-12, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.toastPill}>
            <AppIcon name="heart" size={16} color={colors.bgWhite} />
            <AppText variant="labelMedium" color={colors.bgWhite} style={styles.toastText}>
              {toastMessage}
            </AppText>
          </View>
        </Animated.View>
      )}

      {/* Main Canvas Area */}
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 64,
            paddingBottom: insets.bottom + 80,
          },
        ]}
      >
        {/* Top Filter Rail */}
        <SwipeFilterRail
          selectedCategory={selectedFilter}
          onSelectCategory={(cat) => {
            setSelectedFilter(cat);
            setCurrentIndex(0);
            cardAnim.setValue(0);
          }}
        />

        {/* Swipe Card Deck Area */}
        <View style={styles.deckContainer}>
          {/* Background card preview */}
          <Animated.View
            style={[
              styles.bgCardPreview,
              {
                opacity: bgCardOpacity,
                transform: [{ scale: bgCardScale }],
              },
            ]}
          >
            <SwipeCard key={nextRestaurant.id} restaurant={nextRestaurant} style={styles.bgCard} />
          </Animated.View>

          {/* Active Foreground Card with PanResponder & Animation */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.cardWrapper,
              {
                opacity: cardOpacity,
                transform: [
                  { translateX: cardAnim },
                  { rotate: cardRotation },
                ],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.96}
              onPress={() => {
                if (!isDragging.current) {
                  navigation?.navigate('RestaurantDetail', { restaurant: currentRestaurant });
                }
              }}
            >
              <SwipeCard key={currentRestaurant.id} restaurant={currentRestaurant} />
            </TouchableOpacity>

            {/* Like Stamp Indicator */}
            <Animated.View
              style={[styles.stampPill, styles.likeStamp, { opacity: likeStampOpacity }]}
              pointerEvents="none"
            >
              <AppText variant="h3" color={colors.accentGreen} style={styles.stampText}>
                {t.swipe.craveIt}
              </AppText>
            </Animated.View>

            {/* Pass Stamp Indicator */}
            <Animated.View
              style={[styles.stampPill, styles.passStamp, { opacity: passStampOpacity }]}
              pointerEvents="none"
            >
              <AppText variant="h3" color={colors.accentRed} style={styles.stampText}>
                {t.swipe.pass}
              </AppText>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Floating Action Dock */}
        <SwipeActionDock
          onUndo={handleUndo}
          onPass={handlePass}
          onSuperLike={handleSuperLike}
          onLove={handleLove}
          onLocation={() => navigation?.navigate('RestaurantDetail', { restaurant: currentRestaurant })}
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
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  toastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 94, 184, 0.94)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  toastText: {
    fontWeight: '700',
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
  },
  bgCard: {
    height: 470,
  },
  cardWrapper: {
    position: 'relative',
  },
  stampPill: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 3,
    zIndex: 99,
  },
  likeStamp: {
    left: 24,
    borderColor: colors.accentGreen,
    backgroundColor: 'rgba(255,255,255,0.92)',
    transform: [{ rotate: '-18deg' }],
  },
  passStamp: {
    right: 24,
    borderColor: colors.accentRed,
    backgroundColor: 'rgba(255,255,255,0.92)',
    transform: [{ rotate: '18deg' }],
  },
  stampText: {
    fontWeight: '900',
    letterSpacing: 1,
  },
});
