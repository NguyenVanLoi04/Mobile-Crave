export type IconFamily = 'Ionicons' | 'MaterialCommunityIcons' | 'Feather' | 'FontAwesome5';

export interface CategoryItem {
  id: string;
  label: string;
  iconName: string;
  iconFamily: IconFamily;
  active?: boolean;
}
