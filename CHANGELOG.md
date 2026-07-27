# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0]

### Changed

- **v5 SDK Support**: Updated peer dependency to `@dittolive/ditto` `>=5.0.0` (was `>=4.11.4`).
- **Peer API**: Updated `Peer` field references to v5 names: `isConnectedToDittoCloud` → `isConnectedToDittoServer`, `peerKeyString` → `peerKey`, `connection.peerKeyString1` / `peerKeyString2` → `connection.peer1` / `peer2`.
- **QueryResult API**: Updated mutated document ID retrieval to use `mutatedDocumentIDsV2()` (v5 method name).
- **Ditto persistence path**: Updated `useDataDirectoryExport` to use `ditto.absolutePersistenceDirectory` (v5 property name, was `persistenceDirectory`).
- **Example app**: Migrated initialization to `Ditto.open()`, `DittoConfig`, `auth.login`, and an authentication expiration handler, and upgraded the project to React Native 0.81.5 and CLI 20.1.3.

### Removed

- Removed support for Ditto React Native SDK 4.
- Removed obsolete v4 transport configuration and the `DITTO_WEBSOCKET_URL` example configuration.

## [1.0.0] - 2025-10-14

- **Updated**: Updated Ditto SDK to 4.11.6
- **Fixed**: Issue where results were not properly being displayed in the QueryEditor module
- **Fixed**: Updated Dependencies to make sure it works properly with Expo Dev Client based apps

## [0.2.1] - 2025-10-14

- **Fixed**: Issue with possible crashes using the QueryEditor

## [0.2.0] - 2025-10-10

### Added

- **Query Editor Component**: New component for executing DQL (Document Query Language) queries with multi-line input, expandable JSON results, and export functionality. Supports SELECT, INSERT, UPDATE, DELETE, and SHOW statements with performance optimization for large result sets (20,000+ records).
- **System Settings Component**: Self-contained component displaying all Ditto system settings from SHOW ALL DQL query with built-in search functionality, real-time filtering, and refresh capability.
- **Data Directory Export**: New hook and functionality to export and compress Ditto data directory using native share dialogs.
- **Log Export**: Enhanced log export functionality using Ditto's `Logger.exportToFile()` with native file save dialogs.

### Changed

- **Dependency Update**: Migrated from `react-native-fs` to `@dr.pogodin/react-native-fs` for improved file system operations.
- **Performance Improvements**: Optimized PeersList component with memoization and improved rendering performance.
- **UI Enhancements**: Updated PeersList and DiskUsage components with improved styling and layout.
- **Metro Configuration**: Enhanced metro.config.js for better module resolution and symlink support.
- **Documentation**: Comprehensive README updates with detailed component documentation, style customization examples, and development workflow instructions.

### Fixed

- Android and iOS build issues with proper native module linking.
- Permission handling for Android and iOS platforms.
- Export functionality compatibility with Expo-based applications.
- Performance issues with large peer lists and disk usage calculations.
- Console logging cleanup across components.

### Removed

- Unused hooks and components from codebase.
- Asset icon requirements that caused additional setup steps in external apps.
- Unnecessary environment variables from configuration.

## [0.1.1] - 2024-12-19

### Added

- Initial npm package release as `@dittolive/ditto-react-native-tools`.
- DittoProvider context component for sharing Ditto instance across the application.
- PeersList component for displaying and monitoring Ditto peer connections.
- DiskUsage component for monitoring Ditto's disk usage breakdown.
- usePeers hook for observing and managing peer connections.
- useDiskUsage hook for querying disk usage from \_\_small_peer_info.
- useLogExport hook for exporting Ditto logs.
- usePermissions hook for handling required permissions.
- Example React Native app demonstrating library usage.
- Comprehensive documentation in README.
- MIT License.

### Changed

- Updated package name to `@dittolive/ditto-react-native-tools` for npm publishing.
- Configured publishConfig for npm registry.
- Updated repository URLs and author information.

[0.2.0]: https://github.com/getditto/react-native-ditto-tools/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/getditto/react-native-ditto-tools/releases/tag/v0.1.1
