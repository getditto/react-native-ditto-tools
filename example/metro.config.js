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
  
  // Enable new architecture support
  transformer: {
    // Enable new architecture transforms
    unstable_allowRequireContext: true,
  },
  
  resolver: {
    // Only use example's node_modules as primary resolution
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
    
    // Explicitly force react and react-native to always use the example app's versions
    extraNodeModules: (() => {
      const result = {};
      
      // Force react and react-native to use example app's versions to ensure native components work
      const coreModules = ['react', 'react-native'];
      for (const mod of coreModules) {
        try {
          const resolvedPath = path.dirname(require.resolve(`${mod}/package.json`, { paths: [path.resolve(__dirname, 'node_modules')] }));
          if (fs.existsSync(resolvedPath)) {
            result[mod] = resolvedPath;
          }
        } catch (e) {
          // Module not found in example app, skip
        }
      }
      
      // For other modules, try example app first, then library
      const otherModules = [
        '@dittolive/ditto',
        '@dr.pogodin/react-native-fs',
        'react-native-zip-archive',
      ];
      for (const mod of otherModules) {
        try {
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
    
    // Add custom resolver to handle the library module and ensure react-native consistency
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === '@dittolive/ditto-react-native-tools') {
        // Use the same entry point that external apps will use (built module)
        // This ensures consistency between example app and external usage
        return {
          filePath: path.resolve(libraryPath, 'lib/module/index.js'),
          type: 'sourceFile',
        };
      }
      
      // Force react and react-native to always resolve to example app's versions
      if (moduleName === 'react' || moduleName === 'react-native') {
        try {
          const resolvedPath = require.resolve(moduleName, { paths: [path.resolve(__dirname, 'node_modules')] });
          return {
            filePath: resolvedPath,
            type: 'sourceFile',
          };
        } catch (e) {
          // Fall back to default resolution
        }
      }
      
      // Default resolution for other modules
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
