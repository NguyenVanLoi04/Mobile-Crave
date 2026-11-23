import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon, AppButton } from '../../../components/ui';
import { WheelSegment } from './SpinWheel';
import { useTranslation } from '../../../i18n';

export interface WinnerPopupModalProps {
  visible: boolean;
  winner?: WheelSegment | null;
  onClose: () => void;
  onGetDirections?: () => void;
  onSaveToList?: () => void;
  onSpinAgain?: () => void;
}

export const WinnerPopupModal: React.FC<WinnerPopupModalProps> = ({
  visible,
  winner,
  onClose,
  onGetDirections,
  onSaveToList,
  onSpinAgain,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const currentWinner = winner || {
    label: 'Phở Bò Tái Lăn',
    iconName: 'restaurant',
  };
  const restaurant = winner?.restaurant;
  const rating = restaurant?.rating ? restaurant.rating.toFixed(1) : '4.8';
  const reviewsCount = restaurant?.reviewsCount || '(340+)';
  const priceDisplay = restaurant?.priceLevel || '$$';
  const cuisineOrSpecialty = restaurant?.dishSpecialty || restaurant?.cuisine || 'Ẩm thực nổi bật';
  const distanceOrAddress = restaurant?.distanceKm
    ? `${restaurant.distanceKm} km ${t.decider.away}`
    : (restaurant?.address || 'Quán ngon đã lưu');
  const imageSource = winner?.image

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop tap to close */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Modal Sheet Content */}
        <View
          style={[
            styles.modalSheet,
            { paddingBottom: Math.max(spacing.xl, insets.bottom + 12) },
          ]}
        >
          {/* Top Bar: Drag Handle & Close Button */}
          <View style={styles.headerBar}>
            <View style={styles.dragHandle} />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
            >
              <AppIcon name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Hero Visual Icon Squircle */}
          <View style={styles.heroCenter}>
            <View style={styles.iconSquircle}>
              <Image
                source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
                style={styles.slotImage}
                resizeMode="cover"
              />
            </View>

            {/* Winning Dish Title */}
            <AppText variant="h2" align="center" color={colors.textPrimary} style={styles.dishTitle}>
              {currentWinner.label}
            </AppText>

            {/* Restaurant Subtitle */}
            <AppText variant="body" align="center" color={colors.textSecondary} style={styles.restaurantText}>
              {distanceOrAddress}
            </AppText>

            {/* Meta Tags Row */}
            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <AppIcon name="star" size={12} color="#FFB800" />
                <AppText variant="labelSmall" color={colors.textPrimary} style={styles.metaBold}>
                  {rating}
                </AppText>
                <AppText variant="labelSmall" color={colors.textMuted}>
                  {reviewsCount}
                </AppText>
              </View>

              <View style={styles.metaPill}>
                <AppText variant="labelSmall" color={colors.textSecondary}>
                  {priceDisplay} • {cuisineOrSpecialty}
                </AppText>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsBlock}>
            {/* Primary CTA */}
            <AppButton
              title={t.decider.viewDetails}
              size="lg"
              variant="primary"
              onPress={onGetDirections}
              iconLeft={<AppIcon name="navigate" size={16} color={colors.bgWhite} />}
              style={styles.primaryBtn}
            />

            {/* Secondary CTAs */}
            <View style={styles.secondaryRow}>
              <AppButton
                title={t.decider.spinAgain}
                size="md"
                variant="secondary"
                onPress={onSpinAgain}
                iconLeft={<AppIcon name="refresh" size={16} color={colors.primary} />}
                style={styles.halfBtn}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(6, 28, 53, 0.55)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalSheet: {
    backgroundColor: colors.bgWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 16,
  },
  headerBar: {
    alignItems: 'center',
    paddingTop: spacing.xs,
    position: 'relative',
    height: 36,
    justifyContent: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.borderLight,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 2,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCenter: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  iconSquircle: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 71, 141, 0.12)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accentBlueBg,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    marginTop: spacing.md,
  },
  badgeText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dishTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: spacing.sm,
  },
  restaurantText: {
    marginTop: 4,
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgSurface,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  metaBold: {
    fontWeight: '700',
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accentGreen,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  matchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.bgWhite,
  },
  matchText: {
    fontWeight: '700',
  },
  actionsBlock: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  primaryBtn: {
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfBtn: {
    flex: 1,
  },
  slotImage: {
    width: 76,
    height: 76,
    borderRadius: 22,
  }
});
