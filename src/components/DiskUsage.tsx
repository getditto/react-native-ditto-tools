import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import type { ListRenderItem, ViewStyle } from 'react-native';
import { Ditto } from '@dittolive/ditto';
import { useDiskUsage } from '../hooks/useDiskUsage';
import type { DiskUsageData } from '../hooks/useDiskUsage';
import { useLogExport } from '../hooks/useLogExport';
import { useDataDirectoryExport } from '../hooks/useDataDirectoryExport';

interface DiskUsageItem {
  key: string;
  name: string;
  size: number;
  formattedSize: string;
}

interface DiskUsageProps {
  ditto: Ditto;
  style?: ViewStyle;
}

const DiskUsage: React.FC<DiskUsageProps> = ({
  ditto,
  style,
}) => {
  const { diskUsageInfo, isLoading, error } = useDiskUsage(ditto);
  const logExportResult = useLogExport(ditto);
  const { exportLogs, isExporting } = logExportResult || { exportLogs: null, isExporting: false };
  const { exportDataDirectory, isExporting: isExportingData, error: dataExportError, cleanupWarning } = useDataDirectoryExport(ditto);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  const getDiskUsageItems = (diskUsage: DiskUsageData): DiskUsageItem[] => {
    const items: DiskUsageItem[] = [
      {
        key: 'ditto_store',
        name: 'ditto_store',
        size: diskUsage.ditto_store,
        formattedSize: formatBytes(diskUsage.ditto_store),
      },
      {
        key: 'ditto_replication',
        name: 'ditto_replication',
        size: diskUsage.ditto_replication,
        formattedSize: formatBytes(diskUsage.ditto_replication),
      },
      {
        key: 'ditto_attachments',
        name: 'ditto_attachments',
        size: diskUsage.ditto_attachments,
        formattedSize: formatBytes(diskUsage.ditto_attachments),
      },
      {
        key: 'ditto_auth',
        name: 'ditto_auth',
        size: diskUsage.ditto_auth,
        formattedSize: formatBytes(diskUsage.ditto_auth),
      },
    ];

    // Sort by size descending
    return items.sort((a, b) => b.size - a.size);
  };

  const renderDiskUsageItem: ListRenderItem<DiskUsageItem> = ({ item }) => (
    <View style={styles.diskUsageItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemSize}>{item.formattedSize}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.exportButtonsContainer}>
        <View style={styles.buttonWrapper}>
          <Pressable 
            style={styles.testButtonText}
            onPress={() => {
              exportLogs();
            }}
          >
            <Text style={styles.testButtonInnerText}>
              {isExporting ? 'Exporting...' : 'Export Logs'}
            </Text>
          </Pressable>
        </View>
        
        <View style={styles.buttonWrapper}>
        <Pressable 
            style={[
              styles.testButtonText,
              isExportingData && styles.testButtonDisabled,
            ]}
            onPress={async () => {
              try {
                await exportDataDirectory();
              } catch (err) {
                console.error('Data directory export failed:', err);
              }
            }}
            disabled={isExportingData}
          >
            <Text style={styles.testButtonInnerText}>
              {isExportingData ? 'Exporting...' : 'Export Data Directory'}
            </Text>
          </Pressable>
        </View>
        
        {/* Error Messages */}
        {dataExportError && (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessageText}>⚠️ {dataExportError}</Text>
          </View>
        )}
        
        {/* Cleanup Warning */}
        {cleanupWarning && (
          <View style={styles.warningMessageContainer}>
            <Text style={styles.warningMessageText}>⚠️ {cleanupWarning}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No disk usage data available</Text>
      <Text style={styles.emptySubtext}>
        Make sure your app is properly connected to Ditto.
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!diskUsageInfo?.lastUpdatedAt) return null;
    
    return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Last updated: {formatDate(diskUsageInfo.lastUpdatedAt)}
        </Text>
      </View>
    );
  };

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Text style={styles.errorText}>⚠️ Error loading disk usage</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]}>
        <Text style={styles.loadingIndicator}>⏳</Text>
        <Text style={styles.loadingText}>Loading disk usage...</Text>
      </View>
    );
  }

  const diskUsageItems = diskUsageInfo?.diskUsage ? getDiskUsageItems(diskUsageInfo.diskUsage) : [];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.contentContainer}>
        <FlatList
          data={diskUsageItems}
          renderItem={renderDiskUsageItem}
          keyExtractor={(item) => item.key}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={diskUsageItems.length === 0 ? styles.emptyListContainer : styles.listContent}
          showsVerticalScrollIndicator={true}
          style={styles.flatListContainer}
        />
      </View>
      {diskUsageInfo?.lastUpdatedAt && renderFooter()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  contentContainer: {
    flex: 1,
  },
  flatListContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff3b30',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  exportButtonsContainer: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },
  testButtonText: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  testButtonInnerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  testButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  errorMessageContainer: {
    backgroundColor: '#ffe6e6',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  errorMessageText: {
    color: '#cc0000',
    fontSize: 14,
    fontWeight: '500',
  },
  warningMessageContainer: {
    backgroundColor: '#fff3cd',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  warningMessageText: {
    color: '#b8860b',
    fontSize: 14,
    fontWeight: '500',
  },
  diskUsageItem: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  itemSize: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default DiskUsage;