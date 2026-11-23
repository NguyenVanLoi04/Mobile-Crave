import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../../theme';

export type BadgeVariant = 'primary' | 'accent' | 'dark' | 'glass';

export interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = 'accent',
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryContainer;
      case 'dark':
        return styles.darkContainer;
      case 'glass':
        return styles.glassContainer;
      case 'accent':
      default:
        return styles.accentContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
      case 'dark':
      case 'glass':
        return styles.whiteText;
      case 'accent':
      default:
        return styles.accentText;
    }
  };

  return (
    <View style={[styles.baseContainer, getContainerStyle(), style]}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={[styles.baseText, getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  iconWrapper: {
    marginRight: spacing.xs,
  },
  baseText: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  accentContainer: {
    backgroundColor: colors.accentBlue,
  },
  accentText: {
    color: colors.primary,
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  darkContainer: {
    backgroundColor: 'rgba(6, 28, 53, 0.75)',
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  whiteText: {
    color: colors.bgWhite,
  },
});
