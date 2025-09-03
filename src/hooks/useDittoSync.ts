import { useState, useCallback } from 'react';
import { useDittoContext } from './useDittoContext';
import { TransportConfig } from '@dittolive/ditto';
import { Platform } from 'react-native';

export interface TransportOptions {
  bluetoothLE?: boolean;
  lan?: boolean;
  mdns?: boolean;
  multicast?: boolean;
  awdl?: boolean;
}

export interface DittoSyncState {
  isSyncing: boolean;
  transportOptions: TransportOptions;
}

const DEFAULT_TRANSPORT_OPTIONS: TransportOptions = {
  bluetoothLE: true,
  lan: true,
  mdns: true,
  multicast: true,
  awdl: true,
};

export const useDittoSync = () => {
  const { ditto } = useDittoContext();
  const [isSyncing, setIsSyncing] = useState(true); // Assume started
  const [transportOptions, setTransportOptions] = useState<TransportOptions>(DEFAULT_TRANSPORT_OPTIONS);

  // Start sync with current transport options
  const startSync = useCallback(() => {
    if (!ditto || isSyncing) return;
    
    try {
      console.log('Starting Ditto sync with options:', transportOptions);
      
      // Configure transports based on options
      const transportsConfig = new TransportConfig();
      
      if (transportOptions.bluetoothLE !== undefined) {
        transportsConfig.peerToPeer.bluetoothLE.isEnabled = transportOptions.bluetoothLE;
      }
      
      if (transportOptions.lan !== undefined) {
        transportsConfig.peerToPeer.lan.isEnabled = transportOptions.lan;
      }
      
      if (transportOptions.mdns !== undefined) {
        transportsConfig.peerToPeer.lan.isMdnsEnabled = transportOptions.mdns;
      }
      
      if (transportOptions.multicast !== undefined) {
        transportsConfig.peerToPeer.lan.isMulticastEnabled = transportOptions.multicast;
      }
      
      if (Platform.OS === 'ios' && transportOptions.awdl !== undefined) {
        transportsConfig.peerToPeer.awdl.isEnabled = transportOptions.awdl;
      }
      
      ditto.setTransportConfig(transportsConfig);
      ditto.startSync();
      setIsSyncing(true);
      
      console.log('Ditto sync started successfully');
    } catch (error) {
      console.error('Error starting sync:', error);
    }
  }, [ditto, isSyncing, transportOptions]);

  // Stop sync
  const stopSync = useCallback(() => {
    if (!ditto || !isSyncing) return;
    
    try {
      console.log('Stopping Ditto sync');
      ditto.stopSync();
      setIsSyncing(false);
      console.log('Ditto sync stopped successfully');
    } catch (error) {
      console.error('Error stopping sync:', error);
    }
  }, [ditto, isSyncing]);

  // Toggle sync
  const toggleSync = useCallback(() => {
    if (isSyncing) {
      stopSync();
    } else {
      startSync();
    }
  }, [isSyncing, startSync, stopSync]);

  // Update transport options and restart sync if needed
  const updateTransportOptions = useCallback((options: Partial<TransportOptions>) => {
    const newOptions = { ...transportOptions, ...options };
    setTransportOptions(newOptions);
    
    // If syncing, restart with new options
    if (isSyncing && ditto) {
      try {
        console.log('Updating transport configuration:', newOptions);
        
        const transportsConfig = new TransportConfig();
        
        if (newOptions.bluetoothLE !== undefined) {
          transportsConfig.peerToPeer.bluetoothLE.isEnabled = newOptions.bluetoothLE;
        }
        
        if (newOptions.lan !== undefined) {
          transportsConfig.peerToPeer.lan.isEnabled = newOptions.lan;
        }
        
        if (newOptions.mdns !== undefined) {
          transportsConfig.peerToPeer.lan.isMdnsEnabled = newOptions.mdns;
        }
        
        if (newOptions.multicast !== undefined) {
          transportsConfig.peerToPeer.lan.isMulticastEnabled = newOptions.multicast;
        }
        
        if (Platform.OS === 'ios' && newOptions.awdl !== undefined) {
          transportsConfig.peerToPeer.awdl.isEnabled = newOptions.awdl;
        }
        
        ditto.setTransportConfig(transportsConfig);
        console.log('Transport configuration updated');
      } catch (error) {
        console.error('Error updating transport options:', error);
      }
    }
  }, [ditto, isSyncing, transportOptions]);

  // Enable battery-saving mode
  const enableBatterySavingMode = useCallback(() => {
    console.log('Enabling battery saving mode');
    updateTransportOptions({
      bluetoothLE: false,
      lan: true,
      mdns: true,
      multicast: false,
      awdl: false,
    });
  }, [updateTransportOptions]);

  // Enable high-performance mode (use sparingly)
  const enableHighPerformanceMode = useCallback(() => {
    console.log('Enabling high performance mode');
    updateTransportOptions({
      bluetoothLE: true,
      lan: true,
      mdns: true,
      multicast: true,
      awdl: Platform.OS === 'ios',
    });
  }, [updateTransportOptions]);

  return {
    isSyncing,
    transportOptions,
    startSync,
    stopSync,
    toggleSync,
    updateTransportOptions,
    enableBatterySavingMode,
    enableHighPerformanceMode,
  };
};