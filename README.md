# @dittolive/ditto-react-native-tools

React Native library for Ditto tools integration

## Installation

```sh
npm install @dittolive/ditto-react-native-tools @dittolive/ditto
```

or

```sh
yarn add @dittolive/ditto-react-native-tools @dittolive/ditto
```

## Platform Setup

After installing this library, you need to configure your React Native app for Ditto.

**Please follow the official Ditto React Native quickstart guide:**
[React Native Setup](https://docs.ditto.live/sdk/latest/quickstarts/react-native)

## Usage

```typescript
import React from 'react';
import { DittoProvider, PeersList } from '@dittolive/ditto-react-native-tools';
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