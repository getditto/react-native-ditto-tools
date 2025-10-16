# Example App for @dittolive/ditto-react-native-tools

This is an example React Native application that demonstrates the usage of the **@dittolive/ditto-react-native-tools** library. This example app showcases all the diagnostic and debugging tools available for Ditto in React Native applications.

## About the Tools

The **@dittolive/ditto-react-native-tools** library provides comprehensive diagnostic and debugging tools for Ditto in React Native applications, including:

- **PeersList** - Display and monitor Ditto peer connections in real-time
- **DiskUsage** - Monitor and display Ditto's disk usage breakdown with export functionality  
- **SystemSettings** - Display all Ditto system settings using the `SHOW ALL` DQL statement
- **QueryEditor** - Execute DQL (Document Query Language) queries against your Ditto store

For more detailed information about the library, components, and features, see the [main README](../README.md).

## Example App Features

This example app demonstrates all the tools available in the library:

- **Home Screen** - Navigation hub with access to all tools
- **Peers List** - Real-time monitoring of Ditto peer connections
- **Disk Usage** - Monitor Ditto's disk usage with export capabilities
- **System Settings** - View and search all Ditto system settings
- **Query Editor** - Execute DQL queries and view results
- **Sync Status** - Monitor Ditto synchronization status
- **Permissions** - Manage app permissions for Ditto functionality

## Prerequisites

Before running this example app, ensure you have:

1. **Ditto Setup** - Follow the [Ditto React Native Setup Guide](https://docs.ditto.live/sdk/latest/quickstarts/react-native)
2. **Required Dependencies** - The example app includes all necessary peer dependencies:
   - `@dittolive/ditto` (>=4.11.6)
   - `@dr.pogodin/react-native-fs`
   - `react-native-zip-archive`

## Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
./start.sh
```

OR 

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about the tools and how to integrate them into your own app:

- **[Main Library README](../README.md)** - Complete documentation of all components and features
- **[Ditto React Native Setup](https://docs.ditto.live/sdk/latest/quickstarts/react-native)** - Official Ditto setup guide for React Native
- **[Ditto Documentation](https://docs.ditto.live/)** - Complete Ditto SDK documentation
- **[React Native Website](https://reactnative.dev)** - Learn more about React Native development

## Integration in Your App

To use these tools in your own React Native app:

1. Install the library: `npm install @dittolive/ditto-react-native-tools`
2. Import the components you need: `import { PeersList, DiskUsage } from '@dittolive/ditto-react-native-tools'`
3. Pass your Ditto instance as a prop: `<PeersList ditto={yourDittoInstance} />`

See the [main README](../README.md) for detailed usage examples and component documentation.
