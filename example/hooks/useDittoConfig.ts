import { useCallback } from 'react';
import { Platform } from 'react-native';
import { TransportConfig } from '@dittolive/ditto';
import { DittoConfig, DittoTransportConfig, DEFAULT_DITTO_CONFIG } from '../types/ditto';
import Config from 'react-native-config';

export const useDittoConfig = () => {
  const createDefaultConfig = (): DittoConfig => ({
    identity: {
      type: 'offlinePlayground',
      appID: Config.DITTO_APP_ID!,
    },
    offlineToken: Config.DITTO_OFFLINE_TOKEN!,
    ...DEFAULT_DITTO_CONFIG,
  });

  const createTransportConfig = useCallback((transports: DittoTransportConfig = {}): TransportConfig => {
    const config = new TransportConfig();
    
    // Configure Bluetooth LE
    if (transports.bluetoothLE !== undefined) {
      config.peerToPeer.bluetoothLE.isEnabled = transports.bluetoothLE;
    }
    
    // Configure LAN
    if (transports.lan !== undefined) {
      config.peerToPeer.lan.isEnabled = transports.lan;
    }
    
    // Configure mDNS (requires LAN)
    if (transports.mdns !== undefined) {
      config.peerToPeer.lan.isMdnsEnabled = transports.mdns;
    }
    
    // Configure Multicast (requires LAN)
    if (transports.multicast !== undefined) {
      config.peerToPeer.lan.isMulticastEnabled = transports.multicast;
    }
    
    // Configure AWDL (iOS only)
    if (Platform.OS === 'ios' && transports.awdl !== undefined) {
      config.peerToPeer.awdl.isEnabled = transports.awdl;
    }
    
    return config;
  }, []);

  const mergeConfig = useCallback((userConfig: Partial<DittoConfig>): DittoConfig => {
    const defaultConfig = createDefaultConfig();
    return {
      ...defaultConfig,
      ...userConfig,
      transports: {
        ...defaultConfig.transports,
        ...userConfig.transports,
      },
    };
  }, []);

  return {
    createDefaultConfig,
    createTransportConfig,
    mergeConfig,
  };
};