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

// DQL query result types for SHOW ALL
export interface DQLQueryResult {
  items?: DQLResultItem[];
}

export interface DQLResultItem {
  // Case 1: Item with nested value object
  value?: Record<string, unknown>;
  // Case 2: Item with explicit key and value
  key?: unknown;
  // Case 3: Item as direct key-value pairs
  [key: string]: unknown;
}

// Type guard functions
export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const hasKeyValue = (item: DQLResultItem): item is DQLResultItem & { key: unknown; value: unknown } => {
  return item.key !== undefined && item.value !== undefined;
};

export const hasNestedValue = (item: DQLResultItem): item is DQLResultItem & { value: Record<string, unknown> } => {
  return item.value !== undefined && isRecord(item.value);
};