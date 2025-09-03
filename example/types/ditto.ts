import { Ditto, Identity } from '@dittolive/ditto';

// Use the actual Ditto SDK Identity type instead of our custom one
export type DittoIdentity = Identity;

export interface DittoTransportConfig {
  bluetoothLE?: boolean;
  lan?: boolean;
  mdns?: boolean;
  multicast?: boolean;
  awdl?: boolean;
}

export interface DittoConfig {
  identity: DittoIdentity;
  offlineToken?: string;
  transports?: DittoTransportConfig;
  enableDiagnostics?: boolean;
  diagnosticsInterval?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'none';
}

export interface DittoHookState {
  ditto: Ditto | null;
  isInitializing: boolean;
  isReady: boolean;
  error: Error | null;
  retryCount: number;
}

export const DEFAULT_DITTO_CONFIG: Partial<DittoConfig> = {
  transports: {
    bluetoothLE: true,
    lan: true,
    mdns: true,
    multicast: true,
    awdl: true,
  },
  enableDiagnostics: false,
  diagnosticsInterval: 5000,
  logLevel: 'info',
};