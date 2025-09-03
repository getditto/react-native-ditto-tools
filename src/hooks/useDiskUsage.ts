import { useEffect, useState, useCallback } from 'react';
import type { Ditto } from '@dittolive/ditto';

export interface DiskUsageData {
  device_available: number;
  device_total: number;
  ditto_attachments: number;
  ditto_auth: number;
  ditto_replication: number;
  ditto_store: number;
  ditto_total: number;
}

export interface DiskUsageInfo {
  deviceName: string;
  diskUsage: DiskUsageData | null;
  lastUpdatedAt: string | null;
}

export const useDiskUsage = (ditto: Ditto) => {
  const [diskUsageInfo, setDiskUsageInfo] = useState<DiskUsageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiskUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      const results = await ditto.store.execute("SELECT * FROM __small_peer_info");
      
      if (results.items.length > 0) {
        // Get the first item (should be local peer info)
        const item = results.items[0];
        if (item) {
          const data = item.value;
          
          setDiskUsageInfo({
            deviceName: data.device_name || 'Unknown Device',
            diskUsage: data.device_disk_usage || null,
            lastUpdatedAt: data.last_updated_at || null,
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
  };
};