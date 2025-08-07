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

This repository includes a fully functional example app demonstrating all features. See the [example directory](https://github.com/getditto/react-native-ditto-tools/tree/main/example) for setup instructions and implementation details.