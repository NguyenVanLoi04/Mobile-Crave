import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../../theme';

export interface OnboardingDotsProps {
  totalSteps?: number;
  currentStep: number; // 1-based index (1, 2, 3)
}

export const OnboardingDots: React.FC<OnboardingDotsProps> = ({
  totalSteps = 3,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index + 1 === currentStep;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    gap: spacing.xs + 2,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: colors.separator,
  },
});
