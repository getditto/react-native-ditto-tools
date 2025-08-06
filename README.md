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

## Environment Configuration

Create a `.env` file in your project root with your Ditto credentials:

```env
DITTO_APP_ID=your_app_id_here
DITTO_TOKEN=your_playground_token_here  
DITTO_WEBSOCKET_URL=wss://your-websocket-url.com
```

**Note:** Copy `.env.example` to `.env` and update with your credentials. Never commit `.env` files to version control.

## Usage

```typescript
import React from 'react';
import { DittoProvider, PeersList } from '@dittolive/ditto-react-native-tools';
import { Ditto } from '@dittolive/ditto';
import Config from 'react-native-config';

// Initialize your Ditto instance using environment variables
const ditto = new Ditto({
  type: 'offlinePlayground',
  appID: Config.DITTO_APP_ID,
  offlineToken: Config.DITTO_TOKEN,
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