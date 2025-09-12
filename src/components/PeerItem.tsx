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
      
      {showConnectionDetails && peer.connections && (
        <View style={styles.connectionsContainer}>
          <Text style={styles.connectionsTitle}>Connections:</Text>
          {Array.isArray(peer.connections) ? (
            peer.connections.map((connection, index) => (
              <React.Fragment key={`connection-${connection.peerKeyString1 || 'unknown'}-${connection.connectionType || 'unknown'}-${index}`}>
                <Text style={styles.connectionItem}>
                  {connection.peerKeyString1} - {connection.connectionType}
                </Text>
                {index < peer.connections.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))
          ) : (
            Object.entries(peer.connections).map(([type, count], index, entries) => (
              <React.Fragment key={type}>
                <Text style={styles.connectionItem}>
                  {type}: {String(count)}
                </Text>
                {index < entries.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))
          )}
        </View>
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
  connectionsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  connectionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  connectionItem: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    marginLeft: 8,
  },
});

const MemoizedPeerItem = React.memo(PeerItem);
export { MemoizedPeerItem as PeerItem };