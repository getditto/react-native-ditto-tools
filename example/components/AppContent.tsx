import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import { useDittoPermissions, useDitto, PeersList } from 'react-native-ditto-tools';

export function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const { permissionsGranted } = useDittoPermissions();
  const { ditto } = useDitto();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {!permissionsGranted && (
        <Text style={styles.warningText}>
          Permissions not granted. Ditto features may not work properly.
        </Text>
      )}
      <Text style={styles.title}>
        React Native Ditto Tools Example
      </Text>
      <Text style={styles.status}>
        Ditto SDK: {ditto ? 'Connected' : 'Not connected'}
      </Text>
      
      <View style={styles.peersContainer}>
        <PeersList 
          showConnectionDetails={true}
          emptyMessage="No peers discovered yet"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  warningText: {
    padding: 20,
    color: 'red',
  },
  title: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    textAlign: 'center',
    marginTop: 20,
  },
  peersContainer: {
    flex: 1,
    marginTop: 20,
  },
});