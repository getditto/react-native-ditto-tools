import { useEffect, useState, useRef, useCallback } from 'react';
import { useDittoContext } from './useDittoContext';
import type { Peer } from '@dittolive/ditto';

// Re-export Ditto's Peer type for convenience
export type PeerInfo = Peer;

// Throttle function to limit update frequency
const throttle = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | null = null;
  
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - (now - lastCall));
    }
  }) as T;
};

export const usePeers = () => {
  const { ditto } = useDittoContext();
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const observerRef = useRef<any>(null);

  // Throttled update function - max 2 updates per second
  const throttledUpdatePeers = useCallback(
    throttle((remotePeers: PeerInfo[]) => {
      console.log('usePeers: Throttled update - peers count:', remotePeers.length);
      setPeers(remotePeers);
      setIsLoading(false);
    }, 500),
    []
  );

  useEffect(() => {
    console.log('usePeers: Setting up peer observation');

    const setupPeerObserver = async () => {
      try {
        setIsLoading(true);
        
        // Observe peers with throttled updates
        observerRef.current = ditto.presence.observe((presenceGraph) => {
          const remotePeers = presenceGraph.remotePeers || [];
          throttledUpdatePeers(remotePeers);
        });

        console.log('usePeers: Peer observer set up successfully');
      } catch (error) {
        console.error('usePeers: Error setting up peer observer:', error);
        setIsLoading(false);
      }
    };

    setupPeerObserver();

    // Cleanup function
    return () => {
      console.log('usePeers: Cleaning up peer observer');
      if (observerRef.current) {
        observerRef.current.stop();
        observerRef.current = null;
      }
    };
  }, [ditto, throttledUpdatePeers]);

  return {
    peers,
    isLoading,
    peerCount: peers.length,
  };
};