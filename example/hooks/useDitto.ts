import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { DittoConfig } from '../types/ditto';
import { dittoLogger } from '../utils/dittoLogger';
import { useDittoInstance } from './useDittoInstance';
import { useDittoDiagnostics } from './useDittoDiagnostics';

export const useDitto = (userConfig?: Partial<DittoConfig>) => {
  const { ditto, isInitializing, isReady, error, initialize, retry, config } = useDittoInstance(userConfig);
  
  // Initialize on mount - only run once
  useEffect(() => {
    initialize();
  }, []); // Empty dependency array - only run once on mount

  // Set up diagnostics
  useDittoDiagnostics(ditto, {
    enabled: config.enableDiagnostics || false,
    interval: config.diagnosticsInterval || 5000,
  });

  // Handle app state changes for battery optimization
  useEffect(() => {
    if (!ditto) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        dittoLogger.info('App came to foreground - resuming sync');
        try {
          ditto.startSync();
        } catch (error) {
          dittoLogger.error('Error resuming sync:', error);
        }
      } else if (nextAppState === 'background') {
        dittoLogger.info('App went to background - pausing sync to save battery');
        try {
          ditto.stopSync();
        } catch (error) {
          dittoLogger.error('Error pausing sync:', error);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [ditto]);

  return {
    ditto,
    isInitializing,
    isReady,
    error,
    retry,
    config,
  };
};