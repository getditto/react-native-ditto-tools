import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, ScrollView } from 'react-native';
import { useDittoPermissions, PeersList, useDitto } from '@dittolive/ditto-react-native-tools';

export function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const { permissionsGranted } = useDittoPermissions();
  const { ditto } = useDitto(); // Use the provided ditto from DittoProvider context

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {!permissionsGranted && (
        <Text style={styles.warningText}>
          Permissions not granted. Ditto features may not work properly.
        </Text>
      )}
      <Text style={styles.title}>
        React Native Ditto Tools Example
      </Text>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>
          Ditto SDK: {ditto ? '✅ Ready' : '❌ Not initialized'}
        </Text>
      </View>
      
      {/* <SyncControls 
        style={styles.syncControls}
        showTransportOptions={true}
      /> */}
      
      <View style={styles.peersContainer}>
        <PeersList 
          showConnectionDetails={true}
          emptyMessage="No peers discovered yet"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  warningText: {
    padding: 20,
    color: 'red',
    backgroundColor: '#ffe5e5',
  },
  title: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  status: {
    textAlign: 'center',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffe5e5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  syncControls: {
    marginBottom: 20,
  },
  peersContainer: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 40,
  },
});