import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon } from '../../../components/ui';
import { RestaurantItem } from '../../../types';
import { useTranslation } from '../../../i18n';

export interface WheelSegment {
  id: string;
  label: string;
  iconName: string;
  image?: any;
  restaurant?: RestaurantItem;
  color?: string;
}

export const getCuisineIcon = (cuisine?: string, name?: string): string => {
  const text = `${cuisine || ''} ${name || ''}`.toLowerCase();
  if (
    text.includes('cà phê') ||
    text.includes('cafe') ||
    text.includes('coffee') ||
    text.includes('tea') ||
    text.includes('trà')
  ) {
    return 'cafe';
  }
  if (
    text.includes('bánh mì') ||
    text.includes('burger') ||
    text.includes('fast food') ||
    text.includes('fast_food')
  ) {
    return 'fast-food';
  }
  if (text.includes('pizza') || text.includes('pasta') || text.includes('ý')) {
    return 'pizza';
  }
  if (
    text.includes('sushi') ||
    text.includes('hải sản') ||
    text.includes('seafood') ||
    text.includes('ốc') ||
    text.includes('cá')
  ) {
    return 'fish';
  }
  if (
    text.includes('lẩu') ||
    text.includes('nướng') ||
    text.includes('bbq') ||
    text.includes('bún bò') ||
    text.includes('cay')
  ) {
    return 'flame';
  }
  if (
    text.includes('bánh') ||
    text.includes('kem') ||
    text.includes('dessert') ||
    text.includes('chè')
  ) {
    return 'ice-cream';
  }
  if (
    text.includes('bia') ||
    text.includes('nhậu') ||
    text.includes('pub') ||
    text.includes('bar')
  ) {
    return 'beer';
  }
  return 'restaurant';
};

export const WHEEL_SEGMENTS: WheelSegment[] = [
  {
    id: '1',
    label: 'Phở Bò',
    iconName: 'restaurant',
    image: { uri: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80' },
  },
  {
    id: '2',
    label: 'Bánh Mì',
    iconName: 'fast-food',
    image: { uri: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800&auto=format&fit=crop&q=80' },
  },
  {
    id: '3',
    label: 'Bún Bò',
    iconName: 'flame',
    image: { uri: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80' },
  },
  {
    id: '4',
    label: 'Sushi',
    iconName: 'fish',
    image: { uri: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80' },
  },
  {
    id: '5',
    label: 'Cơm Tấm',
    iconName: 'pizza',
    image: { uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80' },
  },
  {
    id: '6',
    label: 'Cà Phê',
    iconName: 'cafe',
    image: { uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80' },
  },
];

export interface SpinWheelRef {
  spin: () => void;
  isSpinning: boolean;
}

export interface SpinWheelProps {
  segments?: WheelSegment[];
  onSpinPress?: (winner?: WheelSegment) => void;
  isSpinning?: boolean;
  showReadyBanner?: boolean;
}

export const SpinWheel = forwardRef<SpinWheelRef, SpinWheelProps>(({
  segments,
  onSpinPress,
  isSpinning = false,
  showReadyBanner = false,
}, ref) => {
  const { t } = useTranslation();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [isRotating, setIsRotating] = useState(false);

  const activeSegments = segments && segments.length > 0 ? segments : WHEEL_SEGMENTS;
  const segmentCount = activeSegments.length;
  const segmentAngle = 360 / segmentCount;

  const startSpinAnimation = () => {
    if (isRotating) return;
    setIsRotating(true);
    spinAnim.setValue(0);

    // 4 to 6 full 360-degree spins plus a random stop angle
    const randomAngle = Math.floor(Math.random() * 360);
    const targetDegrees = 1440 + randomAngle;

    Animated.timing(spinAnim, {
      toValue: targetDegrees,
      duration: 2600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsRotating(false);
      const normalizedAngle = (360 - (randomAngle % 360)) % 360;
      const winningIndex = Math.floor(normalizedAngle / segmentAngle) % segmentCount;
      const winner = activeSegments[winningIndex];
      onSpinPress?.(winner);
    });
  };

  useImperativeHandle(ref, () => ({
    spin: startSpinAnimation,
    isSpinning: isRotating,
  }));

  const spinRotation = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Top Active Pointer */}
      <View style={styles.pointerPill}>
        <AppIcon name="location-sharp" size={12} color={colors.bgWhite} style={styles.pointerIcon} />
        <AppText variant="labelSmall" color={colors.bgWhite} style={styles.pointerText}>
          {isRotating ? t.decider.spinning : t.decider.currentTarget}
        </AppText>
      </View>
      <View style={styles.pointerArrow} />

      {/* Wheel Rim */}
      <View style={styles.wheelOuterRing}>
        {/* Animated Rotating Wheel Body */}
        <Animated.View
          style={[
            styles.wheelBody,
            { transform: [{ rotate: spinRotation }] },
          ]}
        >
          {/* Segment Labels & Restaurant Images positioned radially */}
          {activeSegments.map((seg, idx) => {
            const angle = (idx * 360) / segmentCount;
            const radiusOffset = segmentCount > 6 ? -74 : -80;
            const restaurantImage = seg.image || seg.restaurant?.image;
            const imageSource =
              typeof restaurantImage === 'string'
                ? { uri: restaurantImage }
                : restaurantImage?.uri
                  ? { uri: restaurantImage.uri }
                  : restaurantImage;

            return (
              <View
                key={`${seg.id}_${idx}`}
                style={[
                  styles.segmentSlot,
                  {
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: radiusOffset },
                    ],
                  },
                ]}
              >
                {imageSource ? (
                  <View style={[styles.thumbWrapper, segmentCount > 6 && styles.thumbWrapperSmall]}>
                    <Image
                      source={imageSource}
                      style={[styles.segThumb, segmentCount > 6 && styles.segThumbSmall]}
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <View style={styles.iconCircle}>
                    <AppIcon name={seg.iconName} size={segmentCount > 6 ? 15 : 18} color={colors.primary} />
                  </View>
                )}
                <AppText
                  variant="labelSmall"
                  color={colors.textPrimary}
                  numberOfLines={1}
                  style={[
                    styles.segLabel,
                    segmentCount > 6 && { fontSize: 8.5, maxWidth: 58 },
                  ]}
                >
                  {seg.label}
                </AppText>
              </View>
            );
          })}

          {/* Center Hub */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={startSpinAnimation}
            style={styles.centerHub}
          >
            <AppIcon name={isRotating ? 'refresh' : 'play'} size={16} color={colors.bgWhite} />
            <AppText variant="labelSmall" color={colors.bgWhite} style={styles.hubText}>
              {isRotating ? t.decider.rollBtn : t.decider.spinBtn}
            </AppText>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Ready Banner */}
      {showReadyBanner && (
        <View style={styles.readyBanner}>
          <View style={styles.readyIconBox}>
            <AppIcon name="restaurant" size={16} color={colors.primary} />
          </View>
          <View style={styles.readyTextBox}>
            <AppText variant="labelSmall" color={colors.textMuted} style={styles.readySubtitle}>
              {isRotating ? t.decider.readySelecting : t.decider.readyToDiscover}
            </AppText>
            <AppText variant="labelMedium" color={colors.textPrimary}>
              {isRotating ? t.decider.readyTitleSpinning : t.decider.tapSpinToRoll}
            </AppText>
          </View>
          <View style={styles.optionsBadge}>
            <AppText variant="labelSmall" color={colors.primary}>
              {segmentCount} {t.decider.placesCount}
            </AppText>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    position: 'relative',
  },
  pointerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  pointerIcon: {
    marginRight: 4,
  },
  pointerText: {
    fontWeight: '700',
  },
  pointerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primaryDark,
    zIndex: 20,
    marginBottom: -4,
  },
  wheelOuterRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FFFFFF',
    borderWidth: 8,
    borderColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  wheelBody: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  segmentSlot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbWrapper: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.bgWhite,
    padding: 1.5,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbWrapperSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    padding: 1,
  },
  segThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
  segThumbSmall: {
    borderRadius: 11,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAF2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  segLabel: {
    fontWeight: '700',
    marginTop: 2,
    fontSize: 10,
    maxWidth: 68,
    textAlign: 'center',
  },
  centerHub: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.bgWhite,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  hubText: {
    fontWeight: '800',
    fontSize: 10,
    marginTop: 1,
  },
  readyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5FF',
    borderRadius: radius.lg,
    padding: spacing.sm + 2,
    marginTop: spacing.lg,
    width: 290,
    justifyContent: 'space-between',
  },
  readyIconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyTextBox: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  readySubtitle: {
    fontSize: 9,
    fontWeight: '700',
  },
  optionsBadge: {
    backgroundColor: colors.bgWhite,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
});
