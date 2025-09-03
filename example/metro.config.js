const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

// Resolve the actual library path through the symlink
const libraryPath = path.resolve(__dirname, '..');

const config = {
  // Watch the parent directory for changes to the library source
  watchFolders: [
    libraryPath, // Parent directory (library source)
  ],
  
  resolver: {
    // Ensure Metro can resolve modules from both locations
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(libraryPath, 'node_modules'),
    ],
    
    // Enable symlinks (default in RN 0.77.1, but explicit for clarity)
    unstable_enableSymlinks: true,
    
    // Add custom resolver to handle the library module
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === '@dittolive/ditto-react-native-tools') {
        // Resolve to the library's source directly
        return {
          filePath: path.resolve(libraryPath, 'src/index.ts'),
          type: 'sourceFile',
        };
      }
      
      // Default resolution for other modules
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
