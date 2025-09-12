import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export interface SystemSetting {
  key: string;
  value: string | number | boolean;
}

export interface SystemSettingsStyles {
  container?: ViewStyle;
  searchContainer?: ViewStyle;
  searchInput?: TextStyle;
  searchIcon?: ImageStyle;
  headerContainer?: ViewStyle;
  settingsCount?: TextStyle;
  refreshButton?: ViewStyle;
  refreshButtonText?: TextStyle;
  refreshIcon?: ImageStyle;
  listContainer?: ViewStyle;
  settingItem?: ViewStyle;
  settingKey?: TextStyle;
  settingValue?: TextStyle;
  separator?: ViewStyle;
  loadingContainer?: ViewStyle;
  loadingText?: TextStyle;
  errorContainer?: ViewStyle;
  errorText?: TextStyle;
  emptyContainer?: ViewStyle;
  emptyText?: TextStyle;
}

export interface SystemSettingsProps {
  styles?: SystemSettingsStyles;
  onSettingPress?: (setting: SystemSetting) => void;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  refreshButtonText?: string;
  emptyMessage?: string;
  errorMessage?: string;
}

export interface UseSystemSettingsResult {
  settings: SystemSetting[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
  lastUpdatedAt: Date | null;
}

export interface UseSettingsSearchResult {
  filteredSettings: SystemSetting[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}