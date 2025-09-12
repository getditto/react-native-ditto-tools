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
    // Only use example's node_modules as primary resolution
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
    
    // Explicitly map only the modules we need from the library
    extraNodeModules: (() => {
      const modules = [
        'react',
        'react-native',
        '@dittolive/ditto',
        '@dr.pogodin/react-native-fs',
        'react-native-zip-archive',
      ];
      const result = {};
      for (const mod of modules) {
        try {
          // Try to resolve the module from the example app first, then from the library
          let resolvedPath;
          try {
            resolvedPath = path.dirname(require.resolve(`${mod}/package.json`, { paths: [path.resolve(__dirname, 'node_modules')] }));
          } catch (e) {
            resolvedPath = path.dirname(require.resolve(`${mod}/package.json`, { paths: [path.resolve(libraryPath, 'node_modules')] }));
          }
          if (fs.existsSync(resolvedPath)) {
            result[mod] = resolvedPath;
          }
        } catch (e) {
          // Module not found, skip
        }
      }
      return result;
    })(),
    
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
