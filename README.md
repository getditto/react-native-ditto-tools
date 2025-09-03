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

When making changes to the root library code and testing them in the example app, follow this workflow:

1. **Make changes** to the library source code in `src/`

2. **Build the library** to compile your changes:
   ```bash
   yarn prepare
   ```

3. **Force refresh the dependency** in the example app:
   ```bash
   cd example
   yarn remove @dittolive/ditto-react-native-tools
   yarn add file:..
   ```

4. **Restart Metro and rebuild**:
   ```bash
   npx react-native start --reset-cache
   # In a new terminal:
   yarn ios --simulator="iPhone 16 Pro"
   ```

> **Note**: The `file:..` dependency creates a copy of the files rather than a live symlink, so you must repeat steps 3-4 every time you make changes to see them reflected in the example app.

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