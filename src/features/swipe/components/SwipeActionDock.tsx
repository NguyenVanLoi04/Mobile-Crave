import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../../../theme';
import { AppIcon } from '../../../components/ui';

export interface SwipeActionDockProps {
  onUndo?: () => void;
  onPass?: () => void;
  onSuperLike?: () => void;
  onLove?: () => void;
  onLocation?: () => void;
}

export const SwipeActionDock: React.FC<SwipeActionDockProps> = ({
  onUndo,
  onPass,
  onSuperLike,
  onLove,
  onLocation,
}) => {
  return (
    <View style={styles.dock}>
      {/* 1. Undo Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onUndo}
        style={[styles.actionBtn, styles.smallBtn]}
      >
        <AppIcon name="arrow-undo-outline" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* 2. Pass / Dislike Button (Red cross) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPass}
        style={[styles.actionBtn, styles.largeBtn, styles.passBtn]}
      >
        <AppIcon name="close" size={24} color="#FF3B30" />
      </TouchableOpacity>

      {/* 3. Boost / Flame Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onSuperLike}
        style={[styles.actionBtn, styles.smallBtn, styles.flameBtn]}
      >
        <AppIcon name="flame" size={18} color={colors.primary} />
      </TouchableOpacity>

      {/* 4. Love / Crave Button (Green Heart) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onLove}
        style={[styles.actionBtn, styles.largeBtn, styles.loveBtn]}
      >
        <AppIcon name="heart" size={26} color={colors.bgWhite} />
      </TouchableOpacity>

      {/* 5. Location Pin */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onLocation}
        style={[styles.actionBtn, styles.smallBtn]}
      >
        <AppIcon name="navigate-outline" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm + 2,
    marginVertical: spacing.md,
  },
  actionBtn: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  smallBtn: {
    width: 46,
    height: 46,
  },
  largeBtn: {
    width: 58,
    height: 58,
  },
  passBtn: {
    backgroundColor: '#FFF0F0',
    shadowColor: '#FF3B30',
    shadowOpacity: 0.15,
  },
  flameBtn: {
    backgroundColor: '#E6F0FF',
  },
  loveBtn: {
    backgroundColor: '#00BA88',
    shadowColor: '#00BA88',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
