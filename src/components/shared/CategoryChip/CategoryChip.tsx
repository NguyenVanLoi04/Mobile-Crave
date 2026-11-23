import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../../theme';
import { CategoryItem } from '../../../types';
import { AppIcon, AppText } from '../../ui';

export interface CategoryChipProps {
  item: CategoryItem;
  isSelected?: boolean;
  onPress: (item: CategoryItem) => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = React.memo(({
  item,
  isSelected = false,
  onPress,
}) => {
  const active = isSelected || item.active;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={[styles.chip, active && styles.chipActive]}
    >
      <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
        <AppIcon
          name={item.iconName}
          family={item.iconFamily}
          size={16}
          color={active ? colors.bgWhite : colors.primary}
        />
      </View>
      <AppText
        variant="labelMedium"
        color={active ? colors.bgWhite : colors.textPrimary}
        style={active ? styles.textActive : styles.textInactive}
      >
        {item.label}
      </AppText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingLeft: 6,
    paddingRight: spacing.md + 4,
    borderRadius: radius.full,
    backgroundColor: colors.bgWhite,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 3,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  textActive: {
    fontWeight: '700',
  },
  textInactive: {
    fontWeight: '600',
  },
});
