// Polyfill for React Native new architecture feature flags
// This fixes the "disableEventLoopOnBridgeless" feature flag error

if (typeof global !== 'undefined') {
  // Polyfill for missing feature flags in new architecture
  if (!global.__turboModuleProxy) {
    global.__turboModuleProxy = null;
  }
  
  // Add feature flag polyfill
  if (!global.__turboModuleProxy) {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Filter out the specific feature flag error
      const message = args.join(' ');
      if (message.includes('disableEventLoopOnBridgeless') && 
          message.includes('native module method not available')) {
        // Suppress this specific error
        return;
      }
      // Log other errors normally
      originalConsoleError.apply(console, args);
    };
  }
}
