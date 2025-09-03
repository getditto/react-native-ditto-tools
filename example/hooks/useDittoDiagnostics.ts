import { useEffect, useRef } from 'react';
import { Ditto } from '@dittolive/ditto';
import { dittoLogger } from '../utils/dittoLogger';

interface DittoDiagnosticsConfig {
  enabled: boolean;
  interval: number;
}

export const useDittoDiagnostics = (
  ditto: Ditto | null, 
  config: DittoDiagnosticsConfig
) => {
  const diagnosticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runDiagnostics = (dittoInstance: Ditto) => {
    dittoLogger.group('DITTO DIAGNOSTIC', () => {
      try {
        const graph = dittoInstance.presence.graph;
        const localPeer = graph.localPeer;
        
        dittoLogger.debug('LOCAL PEER ANALYSIS', {
          device: localPeer.deviceName,
          os: localPeer.os,
          sdkVersion: localPeer.dittoSdkVersion,
          siteId: localPeer.address.siteId,
          peerKey: localPeer.peerKeyString.substring(0, 20) + '...',
          connectedToCloud: localPeer.isConnectedToDittoCloud,
          activeConnections: localPeer.connections.length
        });
        
        if (localPeer.connections.length > 0) {
          dittoLogger.info('CONNECTION DETAILS');
          localPeer.connections.forEach((conn, i) => {
            dittoLogger.debug(`Connection ${i}`, {
              type: conn.connectionType || 'unknown',
              peer1: conn.peerKeyString1?.substring(0, 10) + '...',
              peer2: conn.peerKeyString2?.substring(0, 10) + '...',
              approximateDistanceInMeters: conn.approximateDistanceInMeters
            });
          });
        } else {
          dittoLogger.warn('NO ACTIVE CONNECTIONS');
          dittoLogger.info('TROUBLESHOOTING STEPS:', [
            'Check WiFi allows peer-to-peer communication',
            'Verify both devices have same App ID',
            'Check if firewall/router blocks multicast',
            'Try mobile hotspot test'
          ]);
        }
        
        dittoLogger.info(`REMOTE PEERS: ${graph.remotePeers.length}`);
        
        if (graph.remotePeers.length === 0) {
          dittoLogger.warn('NO REMOTE PEERS DISCOVERED');
        }
        
      } catch (e) {
        dittoLogger.error('Diagnostic error:', e);
      }
    });
  };

  useEffect(() => {
    if (!ditto || !config.enabled) {
      return;
    }

    // Run initial diagnostic
    diagnosticTimerRef.current = setTimeout(() => {
      runDiagnostics(ditto);
    }, config.interval);

    return () => {
      if (diagnosticTimerRef.current) {
        clearTimeout(diagnosticTimerRef.current);
        diagnosticTimerRef.current = null;
      }
    };
  }, [ditto, config.enabled, config.interval]);

  return {
    runDiagnostics: ditto ? () => runDiagnostics(ditto) : () => {},
  };
};