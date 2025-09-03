import { useState, useEffect } from 'react';
import { useDitto } from './useDitto';

export interface DiskUsage {
  totalSize: number;
  documentsSize: number;
  attachmentsSize: number;
}

export const useDiskUsage = () => {
  const { dittoService, isInitialized } = useDitto();
  const [diskUsage, setDiskUsage] = useState<DiskUsage>({
    totalSize: 0,
    documentsSize: 0,
    attachmentsSize: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const fetchDiskUsage = async () => {
      try {
        setLoading(true);
        const usageData = await dittoService.getDiskUsage();
        setDiskUsage(usageData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch disk usage'));
      } finally {
        setLoading(false);
      }
    };

    fetchDiskUsage();
  }, [dittoService, isInitialized]);

  return { diskUsage, loading, error };
};
