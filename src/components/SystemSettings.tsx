import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import type { Ditto } from '@dittolive/ditto';
import type { ViewStyle } from 'react-native';
import type { SystemSetting } from '../types/systemSettings';
import { useSystemSettings } from '../hooks/useSystemSettings';

interface SystemSettingsProps {
  ditto: Ditto;
  style?: ViewStyle;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ 
  ditto, 
  style
}) => {
  const { settings, loading, error, refresh, lastUpdatedAt } = useSystemSettings(ditto);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  // Filter settings based on search term
  const filteredSettings = useMemo(() => {
    if (!searchTerm.trim()) {
      return settings;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return settings.filter(setting => 
      setting.key.toLowerCase().includes(searchLower) ||
      String(setting.value).toLowerCase().includes(searchLower)
    );
  }, [settings, searchTerm]);


  const renderSettingItem = ({ item }: { item: SystemSetting }) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingKey}>
        {item.key}
      </Text>
      <Text style={styles.settingValue}>
        {String(item.value)}
      </Text>
    </View>
  );

  // Show loading state only for initial load with no data and no error
  if (loading && settings.length === 0 && !error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>⏳ Loading settings...</Text>
          <View style={styles.refreshButton} onTouchEnd={handleRefresh}>
            <Text style={styles.refreshIcon}>🔄</Text>
            <Text style={styles.refreshButtonText}>Force Refresh</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load system settings</Text>
          <View style={styles.refreshButton} onTouchEnd={handleRefresh}>
            <Text style={styles.refreshIcon}>🔄</Text>
            <Text style={styles.refreshButtonText}>Retry</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          autoCapitalize="none"
          autoComplete="off"
          clearButtonMode="always"
          enterKeyHint="search"
          inputMode="search"
          placeholder="Search settings..."
          placeholderTextColor="#999999"
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
        <View
          style={styles.refreshButton}
          onTouchEnd={loading ? undefined : handleRefresh}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
          <Text style={[styles.refreshButtonText, { color: loading ? '#999999' : '#007AFF' }]}>
            Refresh
          </Text>
        </View>
      </View>
      
      <View style={styles.headerContainer}>
        <Text style={styles.settingsCount}>
          {searchTerm.trim() ? `${filteredSettings.length} of ${settings.length} settings` : `${settings.length} settings`}
        </Text>
      </View>
      
      {filteredSettings.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {searchTerm.trim() ? `No settings match "${searchTerm}"` : 'No settings found'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSettings}
          renderItem={renderSettingItem}
          keyExtractor={(item) => item.key}
        />
      )}
      
      {lastUpdatedAt && (
        <View style={styles.footerContainer}>
          <Text style={styles.lastUpdatedText}>
            Last updated: {lastUpdatedAt.toLocaleTimeString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingsCount: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  refreshIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  refreshButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  settingItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingKey: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: '#666666',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});

export default React.memo(SystemSettings);