import {Ditto, IdentityOnlinePlayground, SyncSubscription, Logger} from '@dittolive/ditto';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  DITTO_APP_ID,
  DITTO_TOKEN,
  DITTO_PLAYGROUND_TOKEN,
  DITTO_AUTH_URL,
  DITTO_WEBSOCKET_URL,
} from '@env';

export class DittoService {
  private appId: string;
  private token: string;
  private authURL: string;
  private websocketURL: string;

  private static instance: DittoService;
  public ditto: Ditto | null = null;
  private isInitializing = false;
  
  public movieSubscription: SyncSubscription | undefined;
  public commentsSubscription: SyncSubscription | undefined;
  public tasksSubscription: SyncSubscription | undefined;


  private constructor() {
    this.appId = DITTO_APP_ID || '';
    this.token = DITTO_TOKEN || DITTO_PLAYGROUND_TOKEN || '';
    this.authURL = DITTO_AUTH_URL || '';
    this.websocketURL = DITTO_WEBSOCKET_URL || '';
  }

  public static getInstance(): DittoService {
    if (!DittoService.instance) {
      DittoService.instance = new DittoService();
    }
    return DittoService.instance;
  }

  private createIdentity(): IdentityOnlinePlayground {
    return {
      type: 'onlinePlayground',
      appID: this.appId,
      token: this.token,
      customAuthURL: this.authURL,
      enableDittoCloudSync: false,
    };
  }

  /**
   * Requests the necessary permissions for Ditto's peer-to-peer functionality on Android devices.
   * This function handles the runtime permission requests required for Bluetooth and WiFi operations.
   *
   * The permissions requested include:
   * - BLUETOOTH_CONNECT
   * - BLUETOOTH_ADVERTISE
   * - NEARBY_WIFI_DEVICES
   * - BLUETOOTH_SCAN
   *
   * @returns {Promise<boolean>} A promise that resolves to:
   * - true if all permissions are granted
   * - false if any permission is denied
   *
   * @remarks
   * - This function only runs on Android devices
   * - On iOS, it immediately returns true as permissions are handled differently
   * - All permissions must be granted for Ditto to function properly
   *
   * @see https://docs.ditto.live/sdk/latest/install-guides/react-native#handling-permissions
   */
  private async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }
    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ];
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    return Object.values(granted).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED,
    );
  }

  public async initialize(): Promise<boolean> {
    if (this.ditto || this.isInitializing) {
      return this.ditto !== null;
    }

    this.isInitializing = true;

    try {
      // Request permissions first
      let permissionsGranted = await this.requestPermissions();
      if (!permissionsGranted) {
        throw new Error('Permissions not granted');
      }

      // Set minimum log level
      Logger.minimumLogLevel = 'Debug';

      // Initialize Ditto
      this.ditto = new Ditto(this.createIdentity());

      //https://docs.ditto.live/sdk/latest/install-guides/react-native#setting-transport-configurations
      this.ditto.updateTransportConfig(config => {
        config.peerToPeer.bluetoothLE.isEnabled = true;
        config.peerToPeer.lan.isEnabled = true;
        config.peerToPeer.lan.isMdnsEnabled = true;

        if (Platform.OS === 'ios') {
          config.peerToPeer.awdl.isEnabled = true;
        } else {
          config.peerToPeer.awdl.isEnabled = false;
        }
        config.connect.websocketURLs.push(this.websocketURL);
      });

      //Disable sync with v3 peers, required for DQL
      this.ditto.disableSyncWithV3();

      // Register subscriptions for testing
      // https://docs.ditto.live/sdk/latest/sync/syncing-data#subscriptions
      this.movieSubscription = this.ditto.sync.registerSubscription('SELECT * FROM movies');
      this.commentsSubscription = this.ditto.sync.registerSubscription('SELECT * FROM comments');
      this.tasksSubscription = this.ditto.sync.registerSubscription('SELECT * FROM tasks');

      // Disable DQL strict mode so that collection definitions are not required in DQL queries
      // https://docs.ditto.live/dql/strict-mode#introduction
      await this.ditto.store.execute(
        'ALTER SYSTEM SET DQL_STRICT_MODE = false',
      );

      // https://docs.ditto.live/sdk/latest/sync/syncing-data#start-sync
      this.ditto.startSync();
      return true;
    } catch (error) {
      this.ditto = null;
      return false;
    } finally {
      this.isInitializing = false;
    }
  }

  public async cleanup(): Promise<void> {
    if (this.ditto) {
      this.ditto.stopSync();
      this.ditto = null;
    }
  }

  public isInitialized(): boolean {
    return this.ditto !== null && !this.isInitializing;
  }

  public getDitto(): Ditto | null {
    return this.ditto;
  }
}
