# @dittolive/ditto-react-native-tools

Diagonistic and Debugging Tools for Ditto in React Native 

> **⚠️ Platform Compatibility Notice**  
> These tools currently do not support the **React Native MacOS platform**. They are designed for mobile (iOS, Android) platforms where Ditto's peer-to-peer functionality and file system access are available.

### Required Dependencies

This library requires the following peer dependencies to be installed in your app:

- `@dittolive/ditto` - Core Ditto SDK
- `@dr.pogodin/react-native-fs` - File system operations for log export and data directory cleanup
- `react-native-zip-archive` - Directory compression for data export functionality

> **⚠️ iOS Target Version**  
> Some tools require iOS version 15.5 or higher. You may need to update your iOS target version. 

## Installation

```sh
npm install @dittolive/ditto-react-native-tools @dittolive/ditto @dr.pogodin/react-native-fs react-native-zip-archive
```

or

```sh
yarn add @dittolive/ditto-react-native-tools @dittolive/ditto @dr.pogodin/react-native-fs react-native-zip-archive
```

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
import { DittoProvider, PeersList, DiskUsage, SystemSettings } from '@dittolive/ditto-react-native-tools';
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
      {/* Or use other components */}
      <SystemSettings ditto={ditto} />
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
- `style?: ViewStyle` - Custom styling for the main container
- `headerComponent?: () => React.ReactElement` - Optional header component

**Style Customization:**
The component's styling is controlled through built-in StyleSheet with the following key areas that can be customized via the `style` prop:
- **Main container**: Background color, flex properties, padding
- **List content**: Bottom padding and scroll behavior
- **Peer items**: Card-style containers with shadows and rounded corners
- **Loading/Error states**: Centered content with appropriate typography

```typescript
// Example custom styling
<PeersList 
  ditto={ditto}
  style={{ 
    flex: 1, 
    backgroundColor: '#1a1a1a',  // Dark theme background
    paddingHorizontal: 8         // Reduce horizontal margins
  }}
/>
```

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
- `style?: ViewStyle` - Custom styling for the main container
- `onExportDataDirectory?: () => void` - Callback when export data directory button is pressed

**Features:**
- **Automatic Log Export**: The "Export Logs" button uses Ditto's built-in `Logger.exportToFile()` method to save log files
- **Disk Usage Display**: Shows real-time disk usage breakdown for different Ditto components (store, replication, attachments, auth)
- **Last Updated Time**: Footer displays when the data was last refreshed

**Style Customization:**
The component's styling is controlled through built-in StyleSheet with the following key areas that can be customized via the `style` prop:
- **Main container**: Background color, flex properties, padding
- **Content layout**: Card-style containers with proper spacing
- **Usage displays**: Progress bars, labels, and value formatting
- **Action buttons**: Export button styling and disabled states
- **Footer information**: Last updated timestamp styling

```typescript
// Example custom styling
<DiskUsage 
  ditto={ditto}
  style={{ 
    flex: 1, 
    backgroundColor: '#f8f9fa',  // Light gray background
    padding: 16                   // Add container padding
  }}
/>
```

### SystemSettings

Display all Ditto system settings using the `SHOW ALL` DQL statement. Self-contained component with built-in refresh functionality.

```typescript
import { SystemSettings } from '@dittolive/ditto-react-native-tools';

<SystemSettings 
  ditto={ditto}
  style={{ flex: 1, backgroundColor: '#f5f5f5' }}
/>
```

**Props:**
- `ditto` (required): Your Ditto instance
- `style?: ViewStyle` - Custom styling for the main container

**Features:**
- **Self-contained**: No callbacks required - handles all interactions internally
- **System Settings Display**: Shows all Ditto system settings from SHOW ALL DQL query
- **Real-time Search**: Built-in search functionality with instant filtering
- **Search Capabilities**: Case-insensitive search across both setting keys and values
- **Smart Count Display**: Shows filtered results count (e.g., "5 of 141 settings")
- **Refresh Functionality**: Built-in refresh button to reload settings
- **Performance Optimized**: Uses FlatList virtualization and in-memory filtering for 200+ settings
- **Loading States**: Automatic loading, error, and empty state handling
- **Visual Design**: Clean search interface with bordered input and proper typography

**Style Customization:**
The component's styling is controlled through built-in StyleSheet with the following key areas that can be customized via the `style` prop:
- **Main container**: Background color, flex properties, padding
- **Header section**: Settings count and refresh button layout
- **Settings list**: Individual setting items with key-value pairs
- **Loading/Error states**: Centered content with appropriate messaging
- **Footer information**: Last updated timestamp styling

**Search Functionality:**
The component includes a built-in search feature that:
- Filters settings in real-time as you type
- Searches both setting keys and values
- Shows "X of Y settings" when actively searching
- Displays "No settings match 'searchterm'" for no results
- Includes a clear button (iOS) to reset the search
- Maintains search state while refreshing data

```typescript
// Example custom styling
<SystemSettings 
  ditto={ditto}
  style={{ 
    flex: 1, 
    backgroundColor: '#1a1a1a',  // Dark theme background
    paddingTop: 20               // Add top spacing
  }}
/>
```

## Example App

This repository includes a fully functional example app demonstrating all features. See the [example directory](./example) for setup instructions and implementation details.

## Development

### Testing Changes During Development

When making changes to the root library code and testing them in the example app, the project is setup with symlinks for testing.   

package.json:
```json
    "@dittolive/ditto-react-native-tools": "file:.."
```

To stop packages from bleeding from the library to the example app, the example app's metro.config.js is setup to only use the modules we need from the library:

```js
    // Explicitly map only the modules we need from the library
    extraNodeModules: (() => {
      const modules = [
        'react',
        'react-native',
        '@dittolive/ditto',
        '@dr.pogodin/react-native-fs',
        'react-native-zip-archive',
      ];
      const result = {};
      for (const mod of modules) {
        try {
          // Try to resolve the module from the example app first, then from the library
          let resolvedPath;
          try {
            resolvedPath = path.dirname(require.resolve(`${mod}/package.json`, { paths: [path.resolve(__dirname, 'node_modules')] }));
          } catch (e) {
            resolvedPath = path.dirname(require.resolve(`${mod}/package.json`, { paths: [path.resolve(libraryPath, 'node_modules')] }));
          }
          if (fs.existsSync(resolvedPath)) {
            result[mod] = resolvedPath;
          }
        } catch (e) {
          // Module not found, skip
        }
      }
      return result;
    })(),
    
    // Enable symlinks (default in RN 0.77.1, but explicit for clarity)
    unstable_enableSymlinks: true,
```


#### Development Workflow

After the initial setup, changes to the library source code will be immediately available in the example app:

1. **Make changes** to the library source code in `src/`

2. **Clean all caches and reset development environment**:
   ```bash
   cd example
   ./clear-cache.sh
   npx expo prebuild --clean
   ```

3. **Start Metro** (if not already running):
   ```bash
   npx react-native start --reset-cache
   ```

4. **Run the app**:
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

### Export Functionality  
- **[@dr.pogodin/react-native-fs](https://github.com/dr-pogodin-react-native/react-native-fs)** - File system access for React Native apps
- **[react-native-zip-archive](https://github.com/mockingbot/react-native-zip-archive)** - ZIP archive creation and extraction for React Native

We greatly appreciate the maintainers and contributors of these projects for making this library possible.
