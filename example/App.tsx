import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DittoProvider } from '@dittolive/ditto-react-native-tools';
import { useDitto } from './hooks/useDitto';
import { AppContent } from './components/AppContent';

function App() {
  const { ditto, isInitializing } = useDitto();

  if (isInitializing || !ditto) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Initializing Ditto...</Text>
      </View>
    );
  }
  
  return (
    <DittoProvider ditto={ditto}>
      <AppContent />
    </DittoProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
  },
});

export default App;