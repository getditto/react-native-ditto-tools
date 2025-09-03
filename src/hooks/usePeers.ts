import { useEffect, useState } from 'react';
import type { Ditto, Peer, Observer } from '@dittolive/ditto';

// Re-export Ditto's Peer type for convenience
export type PeerInfo = Peer;

export const usePeers = (ditto: Ditto) => {
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [localPeer, setLocalPeer] = useState<PeerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let observer: Observer | null = null;

    const setupPeerObserver = async () => {
      try {
        setIsLoading(true);
        
        // Observe peers
        observer = ditto.presence.observe((presenceGraph) => {
          setLocalPeer(presenceGraph.localPeer);
          const remotePeers = presenceGraph.remotePeers || [];
          setPeers(remotePeers);
          setIsLoading(false);
          setError(null); // Clear any previous errors
        });
      } catch (error) {
        setIsLoading(false);
        setError(error instanceof Error ? error.message : 'Failed to observe peers');
      }
    };

    setupPeerObserver();

    // Cleanup function
    return () => {
      if (observer) {
        observer.stop();
      }
    };
  }, [ditto]);

  return {
    peers,
    localPeer,
    isLoading,
    peerCount: peers.length,
    error,
  };
};