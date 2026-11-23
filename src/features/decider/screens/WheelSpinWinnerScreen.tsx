import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon, AppButton } from '../../../components/ui';

export interface WheelSpinWinnerScreenProps {
  route?: any;
  winnerItem?: any;
  onClose?: () => void;
  onGetDirections?: () => void;
  onSaveToList?: () => void;
  onSpinAgain?: () => void;
}

export const WheelSpinWinnerScreen: React.FC<WheelSpinWinnerScreenProps> = ({
  route,
  winnerItem,
  onClose,
  onGetDirections,
  onSaveToList,
  onSpinAgain,
}) => {
  const insets = useSafeAreaInsets();
  const winner = route?.params?.winner || winnerItem || {
    label: 'Phở Bò Tái Lăn',
    iconName: 'restaurant',
  };

  return (
    <View style={styles.overlay}>
      {/* Dimmed backdrop simulated wheel */}
      <View style={styles.dimmedWheelCircle} />

      {/* Modal Card */}
      <View
        style={[
          styles.modalSheet,
          { paddingBottom: Math.max(spacing.xl, insets.bottom + 16) },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top Bar: Handle & Close Button */}
          <View style={styles.modalTopBar}>
            <View style={styles.dragHandle} />
            <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.closeBtn}>
              <AppIcon name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Match Decision Tag */}
          <View style={styles.celebrationRow}>
            <View style={styles.matchDecisionBadge}>
              <AppIcon name="sparkles" size={13} color={colors.primary} style={styles.sparkleIcon} />
              <AppText variant="labelSmall" color={colors.primary} style={styles.badgeText}>
                The Crave Wheel Decided!
              </AppText>
            </View>
          </View>

          {/* Heading */}
          <AppText variant="h1" align="center" color={colors.textPrimary} style={styles.modalTitle}>
            Your Delicious Match
          </AppText>

          {/* Match Preview Card */}
          <View style={styles.previewCard}>
            {/* Card Header Tags */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.flavorMatchPill}>
                <View style={styles.flavorDot} />
                <AppText variant="labelSmall" color={colors.bgWhite}>
                  98% Flavor Match
                </AppText>
              </View>

              <View style={styles.timePill}>
                <AppIcon name="bicycle-outline" size={12} color={colors.primary} />
                <AppText variant="labelSmall" color={colors.primary} style={styles.timeText}>
                  ~8 mins
                </AppText>
              </View>
            </View>

            {/* Card Background Graphic Placeholder */}
            <View style={styles.cardArtworkBox}>
              <AppIcon name="restaurant-outline" size={48} color={colors.primary} />
            </View>

            {/* Card Footer Meta */}
            <View style={styles.cardFooter}>
              <AppText variant="labelSmall" color={colors.textMuted}>
                DIST. 1, HO CHI MINH CITY
              </AppText>
              <AppText variant="labelSmall" color={colors.textMuted}>
                1.2 km away
              </AppText>
            </View>
          </View>

          {/* Dish Title & Rating */}
          <View style={styles.dishSection}>
            <View style={styles.dishTitleRow}>
              <AppText variant="h2" color={colors.textPrimary}>
                {winner.label}
              </AppText>
              <View style={styles.topPickBadge}>
                <AppText variant="labelSmall" color={colors.primary} style={styles.topPickText}>
                  Top Pick
                </AppText>
              </View>
            </View>

            <AppText variant="body" color={colors.textSecondary} style={styles.restaurantSubname}>
              🏪 Phở Thìn D1 • Traditional Northern Recipe
            </AppText>

            {/* Rating + Price + Open Tag */}
            <View style={styles.ratingsRow}>
              <View style={styles.starsPill}>
                <AppIcon name="star" size={11} color="#FFB800" />
                <AppText variant="labelSmall" color={colors.textPrimary} style={styles.scoreText}>
                  4.8 (890)
                </AppText>
              </View>

              <View style={styles.pricePill}>
                <AppText variant="labelSmall" color={colors.textSecondary}>
                  $$ • 65,000đ - 90,000đ
                </AppText>
              </View>
            </View>

            <View style={styles.openNowRow}>
              <View style={styles.liveOpenDot} />
              <AppText variant="labelSmall" color={colors.textSecondary}>
                Open now (Closes 11 PM)
              </AppText>
            </View>
          </View>

          {/* "Why this pick?" Callout */}
          <View style={styles.whyBox}>
            <View style={styles.whyHeaderRow}>
              <AppIcon name="trending-up-outline" size={14} color={colors.primary} />
              <AppText variant="labelMedium" color={colors.primary} style={styles.whyTitle}>
                Why this pick?
              </AppText>
            </View>
            <AppText variant="body" color={colors.textSecondary} style={styles.whyBody}>
              Hand-selected because you craved piping hot savory broth within 2 km with &gt;4.5★ verified diners.
            </AppText>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsBlock}>
            <AppButton
              title="Let's Eat! Get Directions"
              size="lg"
              variant="primary"
              onPress={onGetDirections}
              iconLeft={<AppIcon name="navigate" size={16} color={colors.bgWhite} />}
              style={styles.directionsBtn}
            />

            <View style={styles.splitRow}>
              <AppButton
                title="Save to List"
                size="md"
                variant="secondary"
                onPress={onSaveToList}
                iconLeft={<AppIcon name="heart-outline" size={16} color={colors.primary} />}
                style={styles.halfBtn}
              />
              <AppButton
                title="Spin Again (2 left)"
                size="md"
                variant="secondary"
                onPress={onSpinAgain}
                iconLeft={<AppIcon name="dice-outline" size={16} color={colors.primary} />}
                style={styles.halfBtn}
              />
            </View>
          </View>

          {/* Table wait time footer */}
          <AppText variant="labelSmall" align="center" color={colors.textMuted} style={styles.footerNote}>
            Table wait time is currently under 5 minutes
          </AppText>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(6, 28, 53, 0.45)',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  dimmedWheelCircle: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalSheet: {
    backgroundColor: colors.bgWhite,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  modalTopBar: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    position: 'relative',
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.separator,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: spacing.xs,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: '#F0F3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  matchDecisionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentBlue,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  sparkleIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontWeight: '800',
  },
  modalTitle: {
    marginBottom: spacing.md,
  },
  previewCard: {
    backgroundColor: '#EEF4FF',
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D8E6FF',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flavorMatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00478D',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  flavorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
    marginRight: 5,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  timeText: {
    marginLeft: 3,
    fontWeight: '700',
  },
  cardArtworkBox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D8E6FF',
    paddingTop: spacing.xs,
  },
  dishSection: {
    marginTop: spacing.md,
  },
  dishTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topPickBadge: {
    backgroundColor: colors.accentBlue,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  topPickText: {
    fontWeight: '700',
  },
  restaurantSubname: {
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginVertical: spacing.xs,
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  scoreText: {
    marginLeft: 3,
    fontWeight: '700',
  },
  pricePill: {
    backgroundColor: '#F0F3F8',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  openNowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  liveOpenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00BA88',
  },
  whyBox: {
    backgroundColor: '#F5F8FF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#E2ECFF',
  },
  whyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  whyTitle: {
    fontWeight: '700',
  },
  whyBody: {
    lineHeight: 18,
  },
  buttonsBlock: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  directionsBtn: {
    width: '100%',
  },
  splitRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfBtn: {
    flex: 1,
  },
  footerNote: {
    marginTop: spacing.md,
  },
});
