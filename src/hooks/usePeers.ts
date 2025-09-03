import { useEffect, useState } from 'react';
import type { Ditto, Peer, Observer } from '@dittolive/ditto';

// Re-export Ditto's Peer type for convenience
export type PeerInfo = Peer;

export const usePeers = (ditto: Ditto) => {
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('usePeers: Setting up peer observation');
    let observer: Observer;

    const setupPeerObserver = async () => {
      try {
        setIsLoading(true);
        
        // Observe peers
        observer = ditto.presence.observe((presenceGraph) => {
          console.log('usePeers: Received presence graph update');
          console.log('usePeers: Full presence graph:', presenceGraph);
          console.log('usePeers: Local peer:', presenceGraph.localPeer);
          const remotePeers = presenceGraph.remotePeers || [];
          console.log('usePeers: Remote peers count:', remotePeers.length);
          console.log('usePeers: Remote peers details:', remotePeers);
          setPeers(remotePeers);
          setIsLoading(false);
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
      if (observer) {
        observer.stop();
      }
    };
  }, [ditto]);

  return {
    peers,
    isLoading,
    peerCount: peers.length,
  };
};