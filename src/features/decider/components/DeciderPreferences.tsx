import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../../../theme';
import { AppText, AppIcon } from '../../../components/ui';

export interface DeciderPreferencesProps {
  onTweakPress?: () => void;
  onPreferencesChange?: (prefs: { distance: string; budget: string; openNow: boolean; smartMatch: boolean }) => void;
}

const DISTANCE_OPTIONS = [
  { value: '≤ 1.0 km', label: 'Walking only' },
  { value: '≤ 2.5 km', label: 'Nearby only' },
  { value: '≤ 5.0 km', label: 'Short ride' },
  { value: '≤ 10 km', label: 'Citywide' },
];

const BUDGET_OPTIONS = [
  { value: '≤ 50k ₫', label: 'Street budget' },
  { value: '≤ 100k ₫', label: 'Casual eats' },
  { value: '≤ 200k ₫', label: 'Mid-range' },
  { value: 'Any ₫', label: 'Fine treats' },
];

export const DeciderPreferences: React.FC<DeciderPreferencesProps> = ({
  onTweakPress,
  onPreferencesChange,
}) => {
  const [distanceIdx, setDistanceIdx] = useState(1); // ≤ 2.5 km
  const [budgetIdx, setBudgetIdx] = useState(2); // ≤ 200k ₫
  const [openNow, setOpenNow] = useState(true);
  const [smartMatch, setSmartMatch] = useState(true);

  const currentDistance = DISTANCE_OPTIONS[distanceIdx];
  const currentBudget = BUDGET_OPTIONS[budgetIdx];

  const handleDistanceCycle = () => {
    const next = (distanceIdx + 1) % DISTANCE_OPTIONS.length;
    setDistanceIdx(next);
    onPreferencesChange?.({
      distance: DISTANCE_OPTIONS[next].value,
      budget: currentBudget.value,
      openNow,
      smartMatch,
    });
  };

  const handleBudgetCycle = () => {
    const next = (budgetIdx + 1) % BUDGET_OPTIONS.length;
    setBudgetIdx(next);
    onPreferencesChange?.({
      distance: currentDistance.value,
      budget: BUDGET_OPTIONS[next].value,
      openNow,
      smartMatch,
    });
  };

  const handleOpenToggle = () => {
    const next = !openNow;
    setOpenNow(next);
    onPreferencesChange?.({
      distance: currentDistance.value,
      budget: currentBudget.value,
      openNow: next,
      smartMatch,
    });
  };

  const handleSmartMatchToggle = () => {
    const next = !smartMatch;
    setSmartMatch(next);
    onTweakPress?.();
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <AppText variant="h4" color={colors.textPrimary}>
          Tweak Preferences
        </AppText>
        <TouchableOpacity activeOpacity={0.7} onPress={handleSmartMatchToggle}>
          <AppText
            variant="labelSmall"
            color={smartMatch ? colors.primary : colors.textMuted}
            style={styles.smartMatchText}
          >
            {smartMatch ? 'Smart Match ON' : 'Smart Match OFF'}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* 3 Preference Cards */}
      <View style={styles.cardsRow}>
        {/* Card 1: Distance */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleDistanceCycle}
          style={styles.prefCard}
        >
          <AppIcon name="navigate-outline" size={18} color={colors.primary} />
          <AppText variant="labelMedium" color={colors.textPrimary} style={styles.cardValue}>
            {currentDistance.value}
          </AppText>
          <AppText variant="labelSmall" color={colors.textMuted}>
            {currentDistance.label}
          </AppText>
        </TouchableOpacity>

        {/* Card 2: Budget */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBudgetCycle}
          style={styles.prefCard}
        >
          <AppIcon name="wallet-outline" size={18} color={colors.primary} />
          <AppText variant="labelMedium" color={colors.textPrimary} style={styles.cardValue}>
            {currentBudget.value}
          </AppText>
          <AppText variant="labelSmall" color={colors.textMuted}>
            {currentBudget.label}
          </AppText>
        </TouchableOpacity>

        {/* Card 3: Open Status */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOpenToggle}
          style={[styles.prefCard, openNow && styles.prefCardActive]}
        >
          <AppIcon
            name={openNow ? 'checkmark-circle-outline' : 'time-outline'}
            size={18}
            color={openNow ? colors.accentGreen : colors.textMuted}
          />
          <AppText
            variant="labelMedium"
            color={openNow ? colors.accentGreen : colors.textPrimary}
            style={styles.cardValue}
          >
            {openNow ? 'Open Now' : 'Any Time'}
          </AppText>
          <AppText variant="labelSmall" color={colors.textMuted}>
            {openNow ? 'Verified live' : 'All hours'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm + 2,
  },
  smartMatchText: {
    fontWeight: '700',
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prefCard: {
    flex: 1,
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  prefCardActive: {
    borderColor: 'rgba(0, 135, 90, 0.2)',
  },
  cardValue: {
    marginTop: spacing.xs,
    marginBottom: 2,
    fontWeight: '700',
  },
});
