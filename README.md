# @dittolive/ditto-react-native-tools

React Native library for Ditto tools integration

## Installation

```sh
npm install @dittolive/ditto-react-native-tools @dittolive/ditto react-native-config react-native-fs react-native-zip-archive
```

or

```sh
yarn add @dittolive/ditto-react-native-tools @dittolive/ditto react-native-config react-native-fs react-native-zip-archive
```

### Required Dependencies

This library requires the following peer dependencies to be installed in your app:

- `@dittolive/ditto` - Core Ditto SDK
- `react-native-config` - Environment variable support  
- `react-native-fs` - File system operations for log export and data directory cleanup
- `react-native-zip-archive` - Directory compression for data export functionality

### iOS Setup

After installing dependencies, run:

```sh
cd ios && pod install && cd ..
```

### Android Setup

For React Native 0.77.1+, auto-linking should handle Android setup automatically. If you encounter linking issues, clean your build:

```sh
cd android && ./gradlew clean && cd ..
```

## Platform Setup

After installing this library, you need to configure your React Native app for Ditto.

**Please follow the official Ditto React Native quickstart guide:**
[React Native Setup](https://docs.ditto.live/sdk/latest/quickstarts/react-native)

## Usage

```typescript
import React from 'react';
import { DittoProvider, PeersList, DiskUsage } from '@dittolive/ditto-react-native-tools';
import { Ditto } from '@dittolive/ditto';

// Initialize your Ditto instance
const ditto = new Ditto({
  type: 'offlinePlayground',
  appID: 'your-app-id',
  offlineToken: 'your-offline-token',
});

function App() {
  return (
    <DittoProvider ditto={ditto}>
      <PeersList 
        showConnectionDetails={true}
        emptyMessage="No peers discovered yet"
      />
    </DittoProvider>
  );
}
```

## Components

### PeersList

Display and monitor Ditto peer connections in real-time.

```typescript
import { PeersList } from '@dittolive/ditto-react-native-tools';

<PeersList 
  ditto={ditto}
  showConnectionDetails={true}
  style={{ flex: 1 }}
/>
```

**Props:**
- `ditto` (required): Your Ditto instance
- `showConnectionDetails?: boolean` - Whether to show detailed connection information (default: true)
- `style?: ViewStyle` - Custom styling for the component
- `headerComponent?: () => React.ReactElement` - Optional header component

### DiskUsage

Monitor and display Ditto's disk usage breakdown with export functionality.

```typescript
import { DiskUsage } from '@dittolive/ditto-react-native-tools';

<DiskUsage 
  ditto={ditto}
  style={{ flex: 1 }}
  onExportDataDirectory={() => console.log('Export data')}
/>
```

**Props:**
- `ditto` (required): Your Ditto instance
- `style?: ViewStyle` - Custom styling for the component
- `onExportDataDirectory?: () => void` - Callback when export data directory button is pressed

**Features:**
- **Automatic Log Export**: The "Export Logs" button prompts users to select a directory, then uses Ditto's built-in `Logger.exportToFile()` method to save log files directly to the chosen location
- **Disk Usage Display**: Shows real-time disk usage breakdown for different Ditto components (store, replication, attachments, auth)
- **Last Updated Time**: Footer displays when the data was last refreshed

## Example App

This repository includes a fully functional example app demonstrating all features. See the [example directory](./example) for setup instructions and implementation details.

## Development

### Testing Changes During Development

When making changes to the root library code and testing them in the example app, you can now use live symlinks for instant updates:

#### Initial Setup (One-time)

1. **Create a yarn link** in the library root:
   ```bash
   yarn link
   ```

2. **Link the library** in the example app:
   ```bash
   cd example
   yarn link "@dittolive/ditto-react-native-tools"
   ```

#### Development Workflow

After the initial setup, changes to the library source code will be immediately available in the example app:

1. **Make changes** to the library source code in `src/`

2. **Start Metro** (if not already running):
   ```bash
   cd example
   npx react-native start --reset-cache
   ```

3. **Run the app**:
   ```bash
   # In a new terminal:
   yarn ios --simulator="iPhone 16 Pro"
   # or
   yarn android
   ```

> **Note**: With this setup, changes to the library code are immediately reflected in the example app through Fast Refresh. No need to rebuild or reinstall the library after each change!

> **Important**: The Metro configuration includes a custom resolver that directly points to the library's TypeScript source files, enabling live updates without compilation.

### Deploying to Connected Android Device

To build and deploy the example app to a connected Android device:

#### Prerequisites

1. **Enable Developer Mode** on your Android device:
   - Go to Settings → About phone
   - Tap "Build number" 7 times
   - Go back to Settings → Developer options
   - Enable "USB debugging"

2. **Connect your device** via USB and verify connection:
   ```bash
   adb devices
   ```
   You should see your device listed (e.g., `R5CN30DYCWA device`)

#### Building and Installing

There are two methods to deploy to your device:

##### Method 1: Direct Installation (Recommended if yarn android fails)

1. **Clean previous builds** (if needed):
   ```bash
   cd example/android
   ./gradlew clean
   ```

2. **Build the APK**:
   ```bash
   ./gradlew assembleDebug
   ```

3. **Install the APK**:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Start Metro bundler**:
   ```bash
   cd ../  # Back to example directory
   npx react-native start --reset-cache
   ```

5. **Launch the app**:
   ```bash
   adb shell monkey -p com.ditto.example -c android.intent.category.LAUNCHER 1
   ```

##### Method 2: Using React Native CLI

```bash
cd example
yarn android
```

This command will automatically build and deploy to the connected device.

#### Troubleshooting

- **Duplicate native libraries error**: If you encounter "2 files found with path 'lib/arm64-v8a/libdittoffi.so'", clean the gradle cache:
  ```bash
  rm -rf ~/.gradle/caches/*/transforms/*
  cd example/android && ./gradlew clean
  ```

- **App not launching**: Make sure the Metro bundler is running before launching the app
- **Device not found**: Ensure USB debugging is enabled and the device is properly connected

#### Reverting to Normal Dependencies

If you need to revert to the standard `file:..` dependency:

```bash
cd example
yarn unlink "@dittolive/ditto-react-native-tools"
yarn install --force
```

### Environment Variables

The example app uses environment variables for Ditto configuration. After changing values in the `.env` file:

1. **Restart Metro** with cache reset:
   ```bash
   npx react-native start --reset-cache
   ```

2. **Rebuild the app** to pick up the new environment values:
   ```bash
   yarn ios --simulator="iPhone 16 Pro"
   ```

> **Note**: Environment variables are compiled into the JavaScript bundle at build time, so you must rebuild the app after changing `.env` values.

## Credits

This library utilizes the following open-source projects:

### Core Dependencies
- **[Ditto](https://github.com/getditto/ditto)** - Edge sync platform for building real-time collaborative apps
- **[React Native Config](https://github.com/luggit/react-native-config)** - Environment variables for React Native apps

### Export Functionality  
- **[react-native-fs](https://github.com/itinance/react-native-fs)** - File system access for React Native apps
- **[react-native-zip-archive](https://github.com/mockingbot/react-native-zip-archive)** - ZIP archive creation and extraction for React Native

We greatly appreciate the maintainers and contributors of these projects for making this library possible.
