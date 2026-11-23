import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from '@expo/vector-icons';
import { IconFamily } from '../../../types';
import { colors } from '../../../theme';

export interface AppIconProps {
  name: string;
  family?: IconFamily;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  family = 'Ionicons',
  size = 20,
  color = colors.textPrimary,
  style,
}) => {
  switch (family) {
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name as any} size={size} color={color} style={style} />;
    case 'Feather':
      return <Feather name={name as any} size={size} color={color} style={style} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={name as any} size={size} color={color} style={style} />;
    case 'Ionicons':
    default:
      return <Ionicons name={name as any} size={size} color={color} style={style} />;
  }
};
