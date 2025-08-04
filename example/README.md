# React Native Ditto Tools Example

This example app demonstrates how to use the `react-native-ditto-tools` library.

## Prerequisites

- React Native development environment ([Setup Guide](https://reactnative.dev/docs/environment-setup))
- Ditto license and App ID

## Running the Example

```bash
# Install dependencies
yarn install

# iOS
cd ios && pod install && cd ..
yarn ios

# Android
yarn android
```

## Configuration

Update the Ditto credentials in `hooks/useDittoInitialization.ts`:

```typescript
const identity = {
  type: 'offlinePlayground',
  appID: 'your-app-id',
  offlineToken: 'your-offline-token',
};
```

## Features Demonstrated

- DittoProvider setup
- PeersList component
- Custom logger implementation
- Peer discovery with transport configuration