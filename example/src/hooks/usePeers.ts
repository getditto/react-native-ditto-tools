import { useState, useEffect } from 'react';
import { useDitto } from './useDitto';

export interface Peer {
  id: string;
  name: string;
  isConnected: boolean;
}

export const usePeers = () => {
  const { dittoService, isInitialized } = useDitto();
  const [peers, setPeers] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const fetchPeers = async () => {
      try {
        setLoading(true);
        const peerData = await dittoService.getPeers();
        setPeers(peerData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch peers'));
      } finally {
        setLoading(false);
      }
    };

    fetchPeers();

    // TODO: Set up real-time peer observation
    const interval = setInterval(fetchPeers, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [dittoService, isInitialized]);

  return { peers, loading, error };
};
