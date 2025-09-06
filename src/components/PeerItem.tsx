import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import type { PeerInfo } from '../hooks/usePeers';

interface PeerItemProps {
  peer: PeerInfo;
  showConnectionDetails: boolean;
}

const PeerItem: React.FC<PeerItemProps> = ({ peer, showConnectionDetails }) => {
  const getConnectionCount = () => {
    // Use the connections array length if available, otherwise fallback to individual counts
    if (peer.connections && Array.isArray(peer.connections)) {
      return peer.connections.length;
    }
    // Fallback for different peer structure
    return Object.keys(peer.connections || {}).length;
  };

  const getConnectionTypes = () => {
    if (peer.connections && Array.isArray(peer.connections)) {
      return `${peer.connections.length} active connections`;
    }
    // Fallback to show connection count
    const connCount = Object.keys(peer.connections || {}).length;
    return `${connCount} connections`;
  };

  return (
    <View style={styles.peerItem}>
      <View style={styles.peerHeader}>
        <Text style={styles.deviceName}>{peer.deviceName || 'Unknown Device'}</Text>
        <View style={styles.statusContainer}>
          {peer.isConnectedToDittoCloud && (
            <View style={styles.cloudBadge}>
              <Text style={styles.cloudBadgeText}>Cloud</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.sdkVersion}>Peer ID: {peer.peerKeyString || 'Unknown'}</Text>
      <Text style={styles.sdkVersion}>SDK Version: {peer.dittoSdkVersion || 'Unknown'}</Text>
      
      {showConnectionDetails && getConnectionCount() > 0 && (
        <Text style={styles.connectionDetails}>{getConnectionTypes()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  peerItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  peerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  cloudBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  cloudBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  sdkVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  connectionDetails: {
    fontSize: 12,
    color: '#888',
  },
});

export default PeerItem;