import {Authenticator, Ditto, DittoConfig, DittoConfigConnect, SyncSubscription, Logger} from '@dittolive/ditto';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  DITTO_APP_ID,
  DITTO_PLAYGROUND_TOKEN,
  DITTO_AUTH_URL,
} from '@env';

export class DittoService {
  private appId: string;
  private token: string;
  private authURL: string;

  private static instance: DittoService;
  public ditto: Ditto | null = null;
  private isInitializing = false;

  public movieSubscription: SyncSubscription | undefined;
  public commentsSubscription: SyncSubscription | undefined;
  public tasksSubscription: SyncSubscription | undefined;


  private constructor() {
    if (!DITTO_APP_ID) {
      throw new Error('DITTO_APP_ID not found in .env file');
    }
    if (!DITTO_PLAYGROUND_TOKEN) {
      throw new Error('DITTO_PLAYGROUND_TOKEN not found in .env file');
    }
    if (!DITTO_AUTH_URL) {
      throw new Error('DITTO_AUTH_URL not found in .env file');
    }
    this.appId = DITTO_APP_ID;
    this.token = DITTO_PLAYGROUND_TOKEN;
    this.authURL = DITTO_AUTH_URL;
  }

  public static getInstance(): DittoService {
    if (!DittoService.instance) {
      DittoService.instance = new DittoService();
    }
    return DittoService.instance;
  }

  private createConfig(): DittoConfig {
    const connectConfig: DittoConfigConnect = {
      mode: 'server',
      url: this.authURL,
    };
    return new DittoConfig(this.appId, connectConfig);
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

      // Initialize Ditto using the v5 API
      const config = this.createConfig();
      this.ditto = await Ditto.open(config);

      // Server mode requires an expiration handler before startSync()
      await this.ditto.auth.setExpirationHandler(
        async (dittoInstance, _timeUntilExpiration) => {
          if (dittoInstance.auth.loginSupported) {
            await dittoInstance.auth.login(
              this.token,
              Authenticator.DEVELOPMENT_PROVIDER,
            );
          }
        },
      );

      // Perform initial login with the playground token
      if (this.ditto.auth.loginSupported) {
        await this.ditto.auth.login(
          this.token,
          Authenticator.DEVELOPMENT_PROVIDER,
        );
      }

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
      this.ditto.sync.start();
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
      this.ditto.sync.stop();
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
