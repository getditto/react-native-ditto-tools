# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native library (`@dittolive/ditto-react-native-tools`) that provides React components and hooks for integrating Ditto sync functionality into React Native applications. The library wraps the core `@dittolive/ditto` SDK and provides a React-friendly API.  The /example folder is a React Native project that demonstrates the use of the library and is used for testing and development.


## Build and Development Commands

### Library Development
```bash
# Install dependencies
yarn install

# Build the library (uses react-native-builder-bob)
yarn prepare

# Type check
yarn typescript
```

### Example App
```bash
# Navigate to example directory
cd example

# Install dependencies
yarn install

# iOS setup
cd ios && pod install && cd ..

# Run example app
yarn ios        # iOS
yarn android    # Android

# Run tests in example
yarn test

# Lint example code
yarn lint
```

## Architecture

### Core Library Structure (`/src`)
- **Components**: React components that wrap Ditto functionality
  - `DittoProvider`: Context provider that wraps the app with Ditto instance
  - `PeersList`: Component for displaying discovered peers
  - `DiskUsage`: Component for displaying Ditto disk usage with automatic log export functionality
  
- **Hooks**: Custom React hooks for Ditto operations
  - `useDittoContext`/`useDitto`: Access the Ditto instance from context
  - `usePeers`: Hook for observing and managing peer connections
  - `useDiskUsage`: Hook for querying and monitoring disk usage from __small_peer_info
  - `useLogExport`: Hook for exporting Ditto logs using Logger.exportToFile() and native save dialog
  - `usePermissions`: Hook for handling required permissions

### Key Technical Details
- The library expects consumers to initialize their own Ditto instance and pass it to `DittoProvider`
- Uses React Context API for Ditto instance sharing across components
- TypeScript-first with strict type checking enabled
- Built using `react-native-builder-bob` for CommonJS, ESM, and TypeScript outputs
- Peer dependencies: `@dittolive/ditto` (>=4.11.4), `react-native-config`
- Dependencies: `@react-native-documents/picker` for native file save dialogs

### Component Details

#### DiskUsage Component
- **Purpose**: Displays Ditto's disk usage breakdown by querying the `__small_peer_info` collection
- **Data Source**: Uses `SELECT * FROM __small_peer_info` DQL query to fetch local peer information
- **Key Features**:
  - Shows disk usage for different Ditto components (store, replication, attachments, auth)
  - **Automatic Log Export**: "Export Logs" button prompts user to select directory, then uses `Logger.exportToFile()` to save directly to chosen location
  - Export button for data directory (placeholder functionality)
  - Real-time data refresh with lastUpdatedAt footer
  - Error and loading states with disabled button during export
  - Follows same patterns as PeersList component
- **Hooks**: 
  - Uses `useDiskUsage` which executes queries against the Ditto store
  - Uses `useLogExport` which handles directory selection and log export with `@react-native-documents/picker`
- **Data Structure**: Parses `device_disk_usage` object from __small_peer_info documents
- **Dependencies**: Requires `@react-native-documents/picker` for native file save dialogs

### Example App Configuration
The example app demonstrates library usage with environment-based configuration:
- Uses `react-native-config` for environment variables
- Requires `.env` file with `DITTO_APP_ID`, `DITTO_TOKEN`, and `DITTO_WEBSOCKET_URL`
- Shows practical implementation of peer discovery and connection management
- Includes disk usage monitoring screen at `/screens/DiskUsageScreen.tsx`

# General Rules
- Keep conversations concise. Do not give compliments. Do not apologize. Do not try to please the user. Do not be chatty or witty.  Most Ditto developers usually work on a Mac, but are required to occasionally work with Unix and Windows to test this project. 
- If you need useful commands or scripts that are not installed on this machine, you can ask me to install them.
- **ALWAYS KILL METRO WHEN DONE**: After completing iOS/Android builds or testing, always kill the Metro bundler using `lsof -ti:8081 | xargs kill -9` to free up the port.

# CRITICAL VERSION CONSTRAINTS
- **NEVER CHANGE REACT NATIVE VERSION**: This project MUST use React Native 0.77.1 for both the library and example app. DO NOT change this version for any reason without explicit permission.
- **NEVER CHANGE REACT VERSION**: This project MUST use React 19.1.1. DO NOT change this version without explicit permission.
- **VERSION COMPATIBILITY**: When adding or modifying dependencies, ALWAYS verify they are compatible with React Native 0.77.1 and React 19.1.1 before proceeding.
- **PACKAGE.JSON CHANGES**: Before modifying any version in package.json files, confirm the change is explicitly requested by the user.
- After creating a plan, prompt me to save that plan to a `PLAN.md` file. Save all the details you would need to restart the plan in a new session. As you implement the plan, periodically update that `PLAN.md` file to mark completed tasks and note any changes to the plan.  The PLAN.md file should always be saved into the claude directory.
-I will often ask you to save a summary of the conversation to a `CONVERSATION.md` file. Save all details that you would need to continue the conversation in a new session.  The CONVERSATION.md file should always be saved into the claude directory.
- When starting a session, if you see `PLAN.md` and/or `CONVERSATION.md` in the root directory, or in a subdirectory named `claude`, then ask whether you should read those files.
- If I ask you to "save plan and conversation", that means you should update the existing `PLAN.md` and `CONVERSATION.md` files with current status, or create new `PLAN.md` and `CONVERSATION.md` files in the claude directory.
- the claude directory is used for all claude related files and should not be used for any other purpose.  
- the claude\errors directory is used for all error related files and should not be used for any other purpose.
- the claude\designs directory is used for all design related files and should not be used for any other purpose.

# Code Style
- Always recommend React Native code vs trying to use native code in Swift or Kotlin, etc.  Using Native code is not a good idea because React Native will support more platforms in the future and this will be hard to maintain.
- Use `async/await` for asynchronous operations instead of `.then()/.catch()`.
- Destructure props and state variables for readability.
- Always TEST all code changes with builds and then running the app on iOS and Android.  Warnings should not be ignored.


# TypeScript
- Strict type checking enabled
- Typescript should be used for all code changes.  You should always use the Typescript best practices including NOT using the any type.  You should never use Javascript code.  
- Utilize generic types for reusable components and functions.
- Implement type guards for runtime type validation where necessary.
- Secure type definitions
- Type-safe API contracts
- Secure environment variables typing
- Type-safe error handling

# Component Guidelines
- Components should be functional and leverage React Hooks.
- Prefer small, focused components with clear responsibilities.