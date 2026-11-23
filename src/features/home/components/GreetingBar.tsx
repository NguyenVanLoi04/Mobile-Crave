import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon } from '../../../components/ui';
import { useTranslation } from '../../../i18n';
import { useUserStore } from '../../../store';

export interface GreetingBarProps {
  userName?: string;
  locationName?: string;
  isLoadingLocation?: boolean;
  hasUnreadNotifications?: boolean;
  onLocationPress?: () => void;
  onNotificationsPress?: () => void;
}

export const GreetingBar: React.FC<GreetingBarProps> = ({
  userName,
  locationName = 'District 1, Ho Chi Minh City',
  isLoadingLocation = false,
  hasUnreadNotifications = true,
  onLocationPress,
  onNotificationsPress,
}) => {
  const { t } = useTranslation();
  const storedName = useUserStore((state) => state.name);
  const displayName = userName || storedName.split(' ')[0] || 'Alex';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Left: Greeting and Location */}
        <View style={styles.leftCol}>
          <View style={styles.greetingRow}>
            <AppText variant="labelMedium" color={colors.textSecondary}>
              {t.home.greetingAfternoon}, {displayName}
            </AppText>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onLocationPress}
            style={styles.locationButton}
          >
            {isLoadingLocation ? (
              <ActivityIndicator size="small" color={colors.primary} style={styles.locIcon} />
            ) : (
              <AppIcon name="location-sharp" size={14} color={colors.primary} style={styles.locIcon} />
            )}
            <AppText variant="h3" color={colors.textPrimary} numberOfLines={1}>
              {locationName}
            </AppText>
            <AppIcon name="chevron-down" size={14} color={colors.textPrimary} style={styles.chevronIcon} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    marginRight: spacing.md,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  waveIcon: {
    marginLeft: spacing.xs,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locIcon: {
    marginRight: spacing.xs,
  },
  chevronIcon: {
    marginLeft: spacing.xs,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.bgWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bgWhite,
  },
});
