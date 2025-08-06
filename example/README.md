# React Native Ditto Tools Example

This example app demonstrates how to use the `@dittolive/ditto-react-native-tools` library.

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

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Ditto credentials (see main README for details)

## Features Demonstrated

- DittoProvider setup
- PeersList component
- Custom logger implementation
- Peer discovery with transport configuration