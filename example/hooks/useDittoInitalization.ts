import { useEffect, useState } from 'react';
import { init, Ditto, TransportConfig } from '@dittolive/ditto';
import { Platform } from 'react-native';
import { logger } from '../utils/logger';

// Singleton pattern to prevent multiple Ditto instances
let globalDittoInstance: Ditto | null = null;

export const useDittoInitialization = () => {
  const [ditto, setDitto] = useState<Ditto | null>(null);

  useEffect(() => {
    const initializeDitto = async () => {
      try {
        // If we already have a global instance, stop it first and create a new one
        if (globalDittoInstance) {
          logger.info('Stopping existing Ditto instance');
          try {
            globalDittoInstance.stopSync();
            globalDittoInstance = null;
            // Give a small delay to ensure cleanup
            await new Promise<void>(resolve => setTimeout(() => resolve(), 100));
          } catch (error) {
            logger.warning('Error stopping existing Ditto instance:', error);
          }
        }

        await init();
        
        const identity = {
          type: 'offlinePlayground' as const,
          appID: 'a3fc6351-c7d7-4018-8557-c8994c16e749',
          offlineToken: 'o2d1c2VyX2lkdTEwMTE0MTAzOTQ3Mzk1MjI5MjA1NmZleHBpcnl4GDIwMjUtMDktMzBUMjI6NTk6NTkuOTk5WmlzaWduYXR1cmV4WFRudUdIb2x6TEx2QjVqcjExMXZLaFV6NzFSRVRMV1B2RDZnd0o0UEQ4WU1ibWxpKzlYdnlTOGNjeVBMQnhabHVOclZPeGY5amNOUzR5ekFiSm45a2hRPT0=',
        };

        logger.info('Creating new Ditto instance...');
        const dittoInstance = new Ditto(identity);
        logger.success('Ditto instance created successfully');

        // Set offline license token for offlinePlayground identity
        logger.info('Setting offline license token...');
        try {
          dittoInstance.setOfflineOnlyLicenseToken(identity.offlineToken);
          logger.success('Offline license token set successfully');
        } catch (licenseError) {
          logger.error('Error setting offline license token:', licenseError);
          throw licenseError;
        }

        // Configure transports BEFORE starting sync
        logger.group('Transport Configuration', () => {
          try {
            const transportsConfig = new TransportConfig();
            transportsConfig.peerToPeer.bluetoothLE.isEnabled = true;
            transportsConfig.peerToPeer.lan.isEnabled = true;
            transportsConfig.peerToPeer.lan.isMdnsEnabled = true;
            transportsConfig.peerToPeer.lan.isMulticastEnabled = true;

            // Apple Wireless Direct Link is only available on Apple devices
            if (Platform.OS === 'ios') {
              transportsConfig.peerToPeer.awdl.isEnabled = true;
            }

            dittoInstance.setTransportConfig(transportsConfig);
            logger.success('Transport configuration set successfully');
            
          } catch (transportError) {
            logger.error('Error configuring transports:', transportError);
          }
        });

        logger.group('Sync Initialization', () => {
          try {
            dittoInstance.startSync();
            logger.success('Ditto sync started successfully');
            
          } catch (syncError) {
            logger.error('Error starting sync:', syncError);
          }
        });
        
        // Comprehensive diagnostic check
        setTimeout(() => {
          logger.group('DITTO DIAGNOSTIC', () => {
            try {
              const graph = dittoInstance.presence.graph;
              const localPeer = graph.localPeer;
              
              logger.debug('LOCAL PEER ANALYSIS', {
                device: localPeer.deviceName,
                os: localPeer.os,
                sdkVersion: localPeer.dittoSdkVersion,
                siteId: localPeer.address.siteId,
                peerKey: localPeer.peerKeyString.substring(0, 20) + '...',
                connectedToCloud: localPeer.isConnectedToDittoCloud,
                activeConnections: localPeer.connections.length
              });
              
              if (localPeer.connections.length > 0) {
                logger.info('CONNECTION DETAILS');
                localPeer.connections.forEach((conn, i) => {
                  logger.debug(`Connection ${i}`, {
                    type: conn.connectionType || 'unknown',
                    peer1: conn.peerKeyString1?.substring(0, 10) + '...',
                    peer2: conn.peerKeyString2?.substring(0, 10) + '...',
                    approximateDistanceInMeters: conn.approximateDistanceInMeters
                  });
                });
              } else {
                logger.warning('NO ACTIVE CONNECTIONS');
                logger.info('TROUBLESHOOTING STEPS:', [
                  'Check WiFi allows peer-to-peer communication',
                  'Verify both devices have same App ID',
                  'Check if firewall/router blocks multicast',
                  'Try mobile hotspot test'
                ]);
              }
              
              logger.info(`REMOTE PEERS: ${graph.remotePeers.length}`);
              
              if (graph.remotePeers.length === 0) {
                logger.warning('NO REMOTE PEERS DISCOVERED');
              }
              
            } catch (e) {
              logger.error('Diagnostic error:', e);
            }
          });
        }, 5000);
        
        // Log transport configuration
        logger.debug('Ditto transport config', {
          siteID: dittoInstance.siteID,
          appID: identity.appID,
          identity_type: identity.type
        });
        
        // Check presence graph immediately
        const presenceGraph = dittoInstance.presence.graph;
        logger.debug('Initial presence graph', {
          localPeer: presenceGraph.localPeer.deviceName,
          remotePeersCount: presenceGraph.remotePeers.length
        });
        
        
        globalDittoInstance = dittoInstance;
        setDitto(dittoInstance);
      } catch (error) {
        logger.error('Failed to initialize Ditto:', error);
      }
    };

    void initializeDitto();

    // Cleanup function
    return () => {
      // Note: We don't stop the global instance here since it might be used by other components
      // In a real app, you'd want to implement proper reference counting or use a context provider
    };
  }, []);

  return { ditto };
};