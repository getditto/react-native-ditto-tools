import { useCallback, useReducer, useRef, useMemo } from 'react';
import { init, Ditto } from '@dittolive/ditto';
import { DittoConfig, DittoHookState } from '../types/ditto';
import { dittoLogger } from '../utils/dittoLogger';
import { useDittoConfig } from './useDittoConfig';

// Singleton to prevent multiple instances
let globalDittoInstance: Ditto | null = null;

// State management with useReducer
type DittoAction = 
  | { type: 'INIT_START' }
  | { type: 'INIT_SUCCESS'; payload: Ditto }
  | { type: 'INIT_ERROR'; payload: Error }
  | { type: 'RETRY' };

const initialState: DittoHookState = {
  ditto: null,
  isInitializing: false,
  isReady: false,
  error: null,
  retryCount: 0,
};

const dittoReducer = (state: DittoHookState, action: DittoAction): DittoHookState => {
  switch (action.type) {
    case 'INIT_START':
      return {
        ...state,
        isInitializing: true,
        error: null,
      };
    case 'INIT_SUCCESS':
      return {
        ...state,
        ditto: action.payload,
        isInitializing: false,
        isReady: true,
        error: null,
      };
    case 'INIT_ERROR':
      return {
        ...state,
        isInitializing: false,
        isReady: false,
        error: action.payload,
      };
    case 'RETRY':
      return {
        ...state,
        retryCount: state.retryCount + 1,
        error: null,
      };
    default:
      return state;
  }
};

export const useDittoInstance = (userConfig?: Partial<DittoConfig>) => {
  const [state, dispatch] = useReducer(dittoReducer, {
    ...initialState,
    ditto: globalDittoInstance, // Initialize with existing instance
  });
  
  const { mergeConfig, createTransportConfig } = useDittoConfig();
  const isInitializingRef = useRef(false);
  
  const config = useMemo(() => mergeConfig(userConfig || {}), [mergeConfig, userConfig]);
  
  // Set log level
  if (config.logLevel) {
    dittoLogger.setLogLevel(config.logLevel);
  }

  const initializeDitto = useCallback(async (): Promise<void> => {
    // If we already have a working instance, reuse it
    if (globalDittoInstance) {
      dittoLogger.info('Reusing existing Ditto instance');
      dispatch({ type: 'INIT_SUCCESS', payload: globalDittoInstance });
      return;
    }

    // Prevent concurrent initializations
    if (isInitializingRef.current) {
      dittoLogger.info('Ditto initialization already in progress');
      return;
    }

    isInitializingRef.current = true;
    dispatch({ type: 'INIT_START' });

    try {
      dittoLogger.info('Initializing Ditto SDK...');
      
      // Initialize Ditto SDK with retry logic for database locks
      await init();

      // Create Ditto instance
      dittoLogger.info('Creating Ditto instance...');
      const dittoInstance = new Ditto(config.identity);
      dittoLogger.success('Ditto instance created successfully');

      // Set offline license token if provided
      if (config.offlineToken) {
        dittoLogger.info('Setting offline license token...');
        dittoInstance.setOfflineOnlyLicenseToken(config.offlineToken);
        dittoLogger.success('Offline license token set successfully');
      }

      // Configure transports
      if (config.transports) {
        dittoLogger.group('Transport Configuration', () => {
          try {
            const transportConfig = createTransportConfig(config.transports);
            dittoInstance.setTransportConfig(transportConfig);
            dittoLogger.success('Transport configuration set successfully');
          } catch (transportError) {
            dittoLogger.error('Error configuring transports:', transportError);
          }
        });
      }

      // Start sync
      dittoLogger.group('Sync Initialization', () => {
        try {
          dittoInstance.startSync();
          dittoLogger.success('Ditto sync started successfully');
        } catch (syncError) {
          dittoLogger.error('Error starting sync:', syncError);
        }
      });

      // Log initial state
      const presenceGraph = dittoInstance.presence.graph;
      dittoLogger.debug('Ditto initialization complete', {
        siteID: dittoInstance.siteID,
        identityType: config.identity.type,
        localPeer: presenceGraph.localPeer.deviceName,
        remotePeersCount: presenceGraph.remotePeers.length
      });

      globalDittoInstance = dittoInstance;
      dispatch({ type: 'INIT_SUCCESS', payload: dittoInstance });
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      dittoLogger.error('Failed to initialize Ditto:', err);
      dispatch({ type: 'INIT_ERROR', payload: err });
    } finally {
      isInitializingRef.current = false;
    }
  }, [config, createTransportConfig]);

  const retry = useCallback(() => {
    dispatch({ type: 'RETRY' });
    void initializeDitto();
  }, [initializeDitto]);

  return {
    ...state,
    initialize: initializeDitto,
    retry,
    config,
  };
};