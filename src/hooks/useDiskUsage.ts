import { useEffect, useState, useCallback } from 'react';
import type { Ditto } from '@dittolive/ditto';

export interface DiskUsageEntry {
  key: string;
  name: string;
  value: any;
  formattedValue: string;
  size?: number; // for numeric values that represent bytes
}

export interface DiskUsageInfo {
  deviceName: string;
  lastUpdatedAt: string | null;
  diskUsageEntries: DiskUsageEntry[];
  rawData: any; // Full JSON for debugging
}

// Legacy interface for backward compatibility (deprecated)
export interface DiskUsageData {
  device_available: number;
  device_total: number;
  ditto_attachments: number;
  ditto_auth: number;
  ditto_replication: number;
  ditto_store: number;
  ditto_total: number;
}

export const useDiskUsage = (ditto: Ditto) => {
  const [diskUsageInfo, setDiskUsageInfo] = useState<DiskUsageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatValue = (key: string, value: any): string => {
    if (typeof value === 'number') {
      // Format bytes for disk usage fields
      if (key.includes('ditto_') || key.includes('device_') || key.toLowerCase().includes('size') || key.toLowerCase().includes('bytes')) {
        return formatBytes(value);
      }
      return value.toLocaleString();
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return String(value);
  };

  const fetchDiskUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      const results = await ditto.store.execute("SELECT * FROM __small_peer_info");
      
      if (results.items.length > 0) {
        // Get the first item (should be local peer info)
        const item = results.items[0];
        if (item) {
          // Get the full JSON data using the value property
          const fullData = item.value;
          
          // Extract specific fields
          const deviceName = fullData.device_name || 'Unknown Device';
          const lastUpdatedAt = fullData.last_updated_at || null;
          
          // Parse device_disk_usage properties dynamically
          const diskUsageData = fullData.device_disk_usage || {};
          const diskUsageEntries: DiskUsageEntry[] = Object.entries(diskUsageData)
            .map(([key, value]) => ({
              key,
              name: key.replace(/_/g, ' '), // Make names more readable
              value,
              formattedValue: formatValue(key, value),
              size: typeof value === 'number' ? value : undefined
            }))
            // Sort by size (numeric values first, then by name)
            .sort((a, b) => {
              if (a.size !== undefined && b.size !== undefined) {
                return b.size - a.size; // Descending by size
              }
              if (a.size !== undefined) return -1;
              if (b.size !== undefined) return 1;
              return a.name.localeCompare(b.name);
            });
          
          setDiskUsageInfo({
            deviceName,
            lastUpdatedAt,
            diskUsageEntries,
            rawData: fullData
          });
        } else {
          setDiskUsageInfo(null);
        }
      } else {
        setDiskUsageInfo(null);
      }
      
      setIsLoading(false);
      setError(null);
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to get disk usage');
    }
  }, [ditto]);

  useEffect(() => {
    fetchDiskUsage();
  }, [fetchDiskUsage]);

  return {
    diskUsageInfo,
    isLoading,
    error,
    refresh: fetchDiskUsage,
    // For backward compatibility
    diskUsage: diskUsageInfo?.rawData?.device_disk_usage || null
  };
};