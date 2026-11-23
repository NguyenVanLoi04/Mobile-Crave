import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { RESTAURANTS_DATA } from '../../../constants';
import { AppHeader } from '../../../components/shared';
import { AppText, AppIcon, AppButton } from '../../../components/ui';

const imgPho = require('../../../../assets/images/restaurant_pho.png');
const imgBanhMi = require('../../../../assets/images/restaurant_banhmi.png');
const imgSushi = require('../../../../assets/images/restaurant_sushi.png');

export interface SpinResultScreenProps {
  navigation?: any;
  onSpinAgain?: () => void;
  onViewDetailPress?: () => void;
  onOrderPress?: () => void;
}

export const SpinResultScreen: React.FC<SpinResultScreenProps> = ({
  navigation,
  onSpinAgain,
  onViewDetailPress,
  onOrderPress,
}) => {
  const winner = RESTAURANTS_DATA[0]; // Pho 24 Heritage
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <AppHeader title="Home" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
          {/* Confetti / Match Selected Banner */}
          <View style={styles.matchBanner}>
            <View style={styles.matchTag}>
              <AppText variant="labelSmall" color={colors.primary} style={styles.matchTagText}>
                MATCH SELECTED
              </AppText>
            </View>
            <AppText variant="h1" align="center" color={colors.textPrimary} style={styles.matchDish}>
              {winner.dishSpecialty || 'Pho Bo Dac Biet'}
            </AppText>
            <AppText variant="body" align="center" color={colors.textSecondary}>
              Special Beef Noodle Soup
            </AppText>
          </View>

          {/* Hero Spotlight Winning Restaurant Card */}
          <View style={styles.winnerCard}>
            <View style={styles.imageBox}>
              <Image source={imgPho} style={styles.winnerImage} resizeMode="cover" />
              <View style={styles.ratingBadge}>
                <AppIcon name="star" size={11} color="#FFB800" style={styles.starIcon} />
                <AppText variant="labelMedium" color={colors.bgWhite}>
                  {winner.rating.toFixed(1)} {winner.reviewsCount}
                </AppText>
              </View>
            </View>

            <View style={styles.winnerDetails}>
              <View style={styles.restaurantRow}>
                <View style={styles.restaurantTextCol}>
                  <AppText variant="h3" color={colors.textPrimary}>
                    {winner.name}
                  </AppText>
                  <AppText variant="body" color={colors.textSecondary}>
                    District 1 • Traditional Recipe Since 1994
                  </AppText>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={styles.saveBtn}>
                  <AppIcon name="bookmark-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Status & Distance */}
              <View style={styles.metaRow}>
                <AppIcon name="navigate" size={12} color={colors.primary} />
                <AppText variant="labelMedium" color={colors.primary} style={styles.metaDistance}>
                  {winner.distanceKm} km
                </AppText>
                <View style={styles.openDot} />
                <AppText variant="labelSmall" color="#00BA88" style={styles.metaOpen}>
                  Open until {winner.openUntil}
                </AppText>
              </View>

              {/* Tags */}
              <View style={styles.tagsRow}>
                <AppText variant="body" color={colors.textSecondary}>
                  {winner.cuisine} • Soup & Noodles
                </AppText>
                <View style={styles.freeDeliveryBadge}>
                  <AppText variant="labelSmall" color={colors.primary}>
                    Michelin Guide
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.ctaSection}>
            <AppButton
              title="View Restaurant Details →"
              size="lg"
              variant="primary"
              onPress={
                onViewDetailPress ||
                onOrderPress ||
                (() => navigation?.navigate('RestaurantDetail', { restaurant: winner }))
              }
              style={styles.orderBtn}
            />

            <View style={styles.secondaryActionsRow}>
              <AppButton
                title="Directions"
                variant="outline"
                size="md"
                onPress={() => {}}
                iconLeft={<AppIcon name="navigate-outline" size={15} color={colors.textPrimary} />}
                style={styles.actionHalfBtn}
              />
              <AppButton
                title="Spin Again"
                variant="outline"
                size="md"
                onPress={onSpinAgain}
                iconLeft={<AppIcon name="refresh" size={15} color={colors.textPrimary} />}
                style={styles.actionHalfBtn}
              />
            </View>
          </View>

          {/* Alternative Suggestions */}
          <View style={styles.alternativesSection}>
            <View style={styles.altHeaderRow}>
              <View style={styles.altTitleGroup}>
                <AppIcon name="swap-horizontal" size={16} color={colors.textPrimary} />
                <AppText variant="h4" color={colors.textPrimary}>
                  Not feeling it?
                </AppText>
              </View>
              <AppText variant="labelSmall" color={colors.primary}>
                Quick picks
              </AppText>
            </View>

            {/* Alt Card 1: Bánh Mì */}
            <TouchableOpacity activeOpacity={0.8} style={styles.altCard}>
              <Image source={imgBanhMi} style={styles.altThumb} />
              <View style={styles.altTextCol}>
                <AppText variant="labelMedium" color={colors.textPrimary}>
                  Bánh Mì Huỳnh Hoa
                </AppText>
                <AppText variant="labelSmall" color={colors.textMuted}>
                  Savory Street Food • 1.1 km away
                </AppText>
                <View style={styles.altRatingRow}>
                  <AppIcon name="star" size={10} color="#FFB800" />
                  <AppText variant="labelSmall" color={colors.textSecondary} style={styles.altScore}>
                    4.8 • $ • Quick bite
                  </AppText>
                </View>
              </View>
              <View style={styles.arrowCircle}>
                <AppIcon name="chevron-forward" size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>

            {/* Alt Card 2: Sushi */}
            <TouchableOpacity activeOpacity={0.8} style={styles.altCard}>
              <Image source={imgSushi} style={styles.altThumb} />
              <View style={styles.altTextCol}>
                <AppText variant="labelMedium" color={colors.textPrimary}>
                  Oishii Sushi & Izakaya
                </AppText>
                <AppText variant="labelSmall" color={colors.textMuted}>
                  Japanese Cuisine • 1.7 km away
                </AppText>
                <View style={styles.altRatingRow}>
                  <AppIcon name="star" size={10} color="#FFB800" />
                  <AppText variant="labelSmall" color={colors.textSecondary} style={styles.altScore}>
                    4.9 • $$$ • Dine-in
                  </AppText>
                </View>
              </View>
              <View style={styles.arrowCircle}>
                <AppIcon name="chevron-forward" size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 68,
  },
  matchBanner: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    marginBottom: spacing.md,
  },
  matchTag: {
    backgroundColor: colors.accentBlue,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },
  matchTagText: {
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  matchDish: {
    marginBottom: 2,
  },
  winnerCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.bgWhite,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: 'rgba(23, 43, 69, 1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  imageBox: {
    height: 180,
    position: 'relative',
  },
  winnerImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(6, 28, 53, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  starIcon: {
    marginRight: 4,
  },
  winnerDetails: {
    padding: spacing.base,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  restaurantTextCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  metaDistance: {
    marginRight: spacing.xs,
  },
  openDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00BA88',
  },
  metaOpen: {
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  freeDeliveryBadge: {
    backgroundColor: colors.accentBlue,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  ctaSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  orderBtn: {
    width: '100%',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionHalfBtn: {
    flex: 1,
  },
  alternativesSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  altHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm + 2,
  },
  altTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  altCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  altThumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
  },
  altTextCol: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  altRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  altScore: {
    marginLeft: 3,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
});
