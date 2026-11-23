import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../../theme';
import { RestaurantItem } from '../../../types';
import { RESTAURANTS_DATA } from '../../../constants';
import { AppText, AppIcon, AppButton, AppBadge } from '../../../components/ui';
import { useTranslation } from '../../../i18n';
import { openInMaps, openPhone, openWebsite, DEFAULT_COORDINATES } from '../../../utils/geo';
import { menuService } from '../../../services/menu/menuService';

const imgPho = require('../../../../assets/images/restaurant_pho.png');
const imgBanhMi = require('../../../../assets/images/restaurant_banhmi.png');
const imgSushi = require('../../../../assets/images/restaurant_sushi.png');
const imgHeroFood = require('../../../../assets/images/hero_food.png');

export interface RestaurantDetailScreenProps {
  route?: {
    params?: {
      restaurantId?: string;
      restaurant?: RestaurantItem;
    };
  };
  navigation?: any;
}

export const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const initialItem =
    route?.params?.restaurant ||
    RESTAURANTS_DATA.find((r) => r.id === route?.params?.restaurantId) ||
    RESTAURANTS_DATA[0];

  const [isFavorite, setIsFavorite] = useState(initialItem.isFavorite);
  const [activeTab, setActiveTab] = useState<'menu' | 'info'>('menu');

  // Dynamic menu generated according to restaurant's cuisine, specialty dish & name
  const menuList = initialItem.menu || menuService.generateMenuForRestaurant(initialItem);

  return (
    <View style={styles.screen}>
      {/* Scrollable Detail Body */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Container */}
        <View style={styles.heroContainer}>
          <Image
            source={initialItem.image}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Illustration Tag on Hero Image */}
          {initialItem.isIllustration && (
            <View style={styles.heroIllustrationBadge}>
              <AppIcon name="image-outline" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
              <AppText variant="labelXS" style={styles.heroIllustrationText}>
                {t.restaurant.illustrationTag}
              </AppText>
            </View>
          )}

          {/* Floating Top Controls */}
          <View style={[styles.floatingControls, { top: insets.top + 8 }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.circleBtn}
              onPress={() => navigation?.goBack()}
            >
              <AppIcon name="chevron-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.rightFloatingGroup}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.circleBtn}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <AppIcon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? colors.accentRed : colors.textPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={styles.circleBtn}>
                <AppIcon name="share-social-outline" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Restaurant Main Info Section */}
        <View style={styles.mainInfoCard}>
          <View style={styles.titleRow}>
            <AppText variant="h2" color={colors.textPrimary} style={styles.restaurantName}>
              {initialItem.name}
            </AppText>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <AppIcon name="star" size={14} color="#FFB800" />
              <AppText variant="labelMedium" color={colors.textPrimary} style={styles.ratingText}>
                {initialItem.rating}
              </AppText>
              <AppText variant="labelSmall" color={colors.textMuted}>
                {initialItem.reviewsCount}
              </AppText>
            </View>

            <View style={styles.dotSeparator} />
            <AppText variant="body" color={colors.textSecondary}>
              {initialItem.cuisine}
            </AppText>

            <View style={styles.dotSeparator} />
            <AppText variant="body" color={colors.textSecondary}>
              {initialItem.priceLevel}
            </AppText>

            <View style={styles.dotSeparator} />
            <AppText variant="body" color={colors.accentGreen}>
              {t.restaurant.openUntil} {initialItem.openUntil}
            </AppText>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addressRow}
            onPress={() => {
              const lat = initialItem.latitude || DEFAULT_COORDINATES.latitude;
              const lon = initialItem.longitude || DEFAULT_COORDINATES.longitude;
              openInMaps(lat, lon, initialItem.name);
            }}
          >
            <AppIcon name="location-outline" size={16} color={colors.primary} />
            <AppText variant="body" color={colors.textSecondary} style={styles.addressText}>
              {initialItem.address} ({initialItem.distanceKm} km {t.restaurant.kmAway})
            </AppText>
            <AppIcon name="open-outline" size={14} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Quick Action Pills */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionPill}
              onPress={() => {
                const lat = initialItem.latitude || DEFAULT_COORDINATES.latitude;
                const lon = initialItem.longitude || DEFAULT_COORDINATES.longitude;
                openInMaps(lat, lon, initialItem.name);
              }}
            >
              <AppIcon name="navigate" size={16} color={colors.primary} />
              <AppText variant="labelMedium" color={colors.primary}>{t.restaurant.directions}</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionPill}
              onPress={() => {
                if (initialItem.phone) {
                  openPhone(initialItem.phone);
                } else {
                  Alert.alert('Phone', 'No phone number available on OpenStreetMap for this venue.');
                }
              }}
            >
              <AppIcon name="call" size={16} color={colors.primary} />
              <AppText variant="labelMedium" color={colors.primary}>{t.restaurant.callShop}</AppText>
            </TouchableOpacity>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {initialItem.tags?.map((tag: string, index: number) => (
              <View key={index} style={styles.tagPill}>
                <AppText variant="labelSmall" color={colors.textSecondary}>
                  #{tag}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Section Tabs: Menu | Info */}
        <View style={styles.tabHeader}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tabBtn, activeTab === 'menu' && styles.tabBtnActive]}
            onPress={() => setActiveTab('menu')}
          >
            <AppText
              variant="labelMedium"
              color={activeTab === 'menu' ? colors.primary : colors.textMuted}
            >
              {t.restaurant.menuTab}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tabBtn, activeTab === 'info' && styles.tabBtnActive]}
            onPress={() => setActiveTab('info')}
          >
            <AppText
              variant="labelMedium"
              color={activeTab === 'info' ? colors.primary : colors.textMuted}
            >
              {t.restaurant.infoTab}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Tab Content: Menu */}
        {activeTab === 'menu' && (
          <View style={styles.menuSection}>
            {/* If restaurant has a website or online link, show direct button */}
            {initialItem.website && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.onlineMenuBanner}
                onPress={() => openWebsite(initialItem.website!)}
              >
                <AppIcon name="restaurant-outline" size={20} color={colors.primary} />
                <View style={styles.onlineMenuTextCol}>
                  <AppText variant="labelMedium" color={colors.textPrimary}>
                    Trang web & Thực đơn trực tuyến
                  </AppText>
                  <AppText variant="body" color={colors.primary} numberOfLines={1}>
                    {initialItem.website}
                  </AppText>
                </View>
                <AppIcon name="open-outline" size={16} color={colors.primary} />
              </TouchableOpacity>
            )}

            {menuList.map((dish) => (
              <View key={dish.id} style={styles.dishCard}>
                <View style={styles.dishInfoCol}>
                  <View style={styles.dishHeaderRow}>
                    <AppText
                      variant="h4"
                      color={colors.textPrimary}
                      numberOfLines={1}
                      style={styles.dishName}
                    >
                      {dish.name}
                    </AppText>
                    {dish.isBestseller && (
                      <AppBadge label="Bestseller" variant="accent" />
                    )}
                  </View>
                  <AppText
                    variant="body"
                    color={colors.textSecondary}
                    numberOfLines={2}
                    style={styles.dishDesc}
                  >
                    {dish.desc}
                  </AppText>
                  <AppText variant="h4" color={colors.primary} style={styles.dishPrice}>
                    {dish.price}
                  </AppText>
                </View>

                {/* Dish Thumbnail Image */}
                <View style={styles.dishThumbWrapper}>
                  <Image source={dish.image} style={styles.dishThumb} resizeMode="cover" />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tab Content: Info */}
        {activeTab === 'info' && (
          <View style={styles.infoSection}>
            {/* Contact & Location Info Card */}
            <View style={styles.amenityCard}>
              <AppText variant="h4" color={colors.textPrimary} style={styles.amenityTitle}>
                {t.restaurant.infoTab}
              </AppText>

              {/* Hours */}
              <View style={styles.infoRowItem}>
                <AppIcon name="time-outline" size={18} color={colors.primary} />
                <View style={styles.infoRowTextCol}>
                  <AppText variant="labelMedium" color={colors.textPrimary}>Giờ mở cửa</AppText>
                  <AppText variant="body" color={colors.textSecondary}>
                    {initialItem.openingHours || initialItem.openUntil || '08:00 - 22:00'}
                  </AppText>
                </View>
              </View>

              {/* Phone if available */}
              {initialItem.phone && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.infoRowItem}
                  onPress={() => openPhone(initialItem.phone!)}
                >
                  <AppIcon name="call-outline" size={18} color={colors.primary} />
                  <View style={styles.infoRowTextCol}>
                    <AppText variant="labelMedium" color={colors.textPrimary}>Điện thoại liên hệ</AppText>
                    <AppText variant="body" color={colors.primary}>{initialItem.phone}</AppText>
                  </View>
                </TouchableOpacity>
              )}

              {/* Website if available */}
              {initialItem.website && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.infoRowItem}
                  onPress={() => openWebsite(initialItem.website!)}
                >
                  <AppIcon name="globe-outline" size={18} color={colors.primary} />
                  <View style={styles.infoRowTextCol}>
                    <AppText variant="labelMedium" color={colors.textPrimary}>Trang web</AppText>
                    <AppText variant="body" color={colors.primary} numberOfLines={1}>
                      {initialItem.website}
                    </AppText>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* House Amenities */}
            <View style={styles.amenityCard}>
              <AppText variant="h4" color={colors.textPrimary} style={styles.amenityTitle}>
                {t.restaurant.houseAmenities}
              </AppText>
              <View style={styles.amenitiesGrid}>
                <View style={styles.amenityItem}>
                  <AppIcon name="snow-outline" size={18} color={colors.primary} />
                  <AppText variant="labelSmall">{t.restaurant.airConditioned}</AppText>
                </View>
                <View style={styles.amenityItem}>
                  <AppIcon name="wifi-outline" size={18} color={colors.primary} />
                  <AppText variant="labelSmall">{t.restaurant.freeWifi}</AppText>
                </View>
                <View style={styles.amenityItem}>
                  <AppIcon name="card-outline" size={18} color={colors.primary} />
                  <AppText variant="labelSmall">{t.restaurant.cardPayment}</AppText>
                </View>
                <View style={styles.amenityItem}>
                  <AppIcon name="car-outline" size={18} color={colors.primary} />
                  <AppText variant="labelSmall">{t.restaurant.freeParking}</AppText>
                </View>
              </View>
            </View>

            {/* OpenStreetMap Attribution Card (Section 5.5 & 13 of plan.md) */}
            <View style={[styles.amenityCard, styles.osmCard]}>
              <View style={styles.osmCardHeader}>
                <AppIcon name="information-circle-outline" size={18} color={colors.textSecondary} />
                <AppText variant="labelMedium" color={colors.textPrimary}>Nguồn dữ liệu địa điểm</AppText>
              </View>
              <AppText variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
                Dữ liệu tọa độ, loại hình và địa chỉ được cung cấp bởi ©{' '}
                <AppText
                  variant="body"
                  color={colors.primary}
                  style={{ textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL('https://www.openstreetmap.org/copyright')}
                >
                  OpenStreetMap contributors
                </AppText>{' '}
                theo giấy phép ODbL.
              </AppText>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom CTA Dock */}
      <View style={[styles.bottomDock, { paddingBottom: Math.max(spacing.md, insets.bottom + 8) }]}>
        <View style={styles.infoPreview}>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <AppText variant="labelSmall" color={colors.accentGreen}>
              {t.common.openNow}
            </AppText>
          </View>
          <AppText variant="h3" color={colors.textPrimary}>
            {initialItem.distanceKm} km {t.restaurant.kmAway}
          </AppText>
        </View>

        <AppButton
          title={t.restaurant.getDirections}
          variant="primary"
          size="lg"
          iconLeft={<AppIcon name="navigate" size={17} color={colors.bgWhite} />}
          onPress={() =>
            Alert.alert(
              t.restaurant.directions,
              `Opening navigation to ${initialItem.name} (${initialItem.address})...`
            )
          }
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgScreen,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroIllustrationBadge: {
    position: 'absolute',
    bottom: spacing.lg + spacing.sm,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  heroIllustrationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  floatingControls: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rightFloatingGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.lg,
  },
  mainInfoCard: {
    backgroundColor: colors.bgWhite,
    marginHorizontal: spacing.base,
    marginTop: -spacing.md,
    borderRadius: radius.xl,
    padding: spacing.base,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  titleRow: {
    marginBottom: spacing.xs,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    marginBottom: spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontWeight: '700',
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.base,
  },
  addressText: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  actionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.accentBlue,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tagPill: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
  },
  tabBtn: {
    paddingVertical: spacing.md,
    marginRight: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: colors.primary,
  },
  menuSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    gap: spacing.md,
  },
  onlineMenuBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 111, 242, 0.08)',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(23, 111, 242, 0.25)',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  onlineMenuTextCol: {
    flex: 1,
  },
  dishCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dishInfoCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  dishHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  dishName: {
    flexShrink: 1,
    fontWeight: '700',
  },
  dishDesc: {
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  dishPrice: {
    fontWeight: '700',
  },
  dishThumbWrapper: {
    width: 82,
    height: 82,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.bgSurface,
  },
  dishThumb: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  amenityCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  amenityTitle: {
    marginBottom: spacing.md,
  },
  infoRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoRowTextCol: {
    flex: 1,
  },
  osmCard: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  osmCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  amenityItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bgWhite,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  infoPreview: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accentGreen,
  },
  ctaButton: {
    minWidth: 170,
  },
});
