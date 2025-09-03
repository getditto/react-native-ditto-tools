import { useState, useEffect } from 'react';
import { useDitto } from './useDitto.ts';

export interface PermissionsHealth {
  bluetooth: boolean;
  wifi: boolean;
  storage: boolean;
}

export const usePermissions = () => {
  const { dittoService, isInitialized } = useDitto();
  const [permissions, setPermissions] = useState<PermissionsHealth>({
    bluetooth: false,
    wifi: false,
    storage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const checkPermissions = async () => {
      try {
        setLoading(true);
        const healthData = await dittoService.getPermissionsHealth();
        setPermissions(healthData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check permissions'));
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [dittoService, isInitialized]);

  return { permissions, loading, error };
};
