import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ditto } from '@dittolive/ditto';
import { usePeers } from '../hooks/usePeers';
import type { PeerInfo } from '../hooks/usePeers';

interface PeersListProps {
  style?: any;
  showConnectionDetails?: boolean;
  ditto?: Ditto;
  headerComponent?: () => React.ReactElement;
}

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
          <Text style={styles.connectionCount}>
            {getConnectionCount()} connection{getConnectionCount() !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      <Text style={styles.sdkVersion}>Peer ID: {peer.peerKey || 'Unknown'}</Text>
      
      {showConnectionDetails && getConnectionCount() > 0 && (
        <Text style={styles.connectionDetails}>{getConnectionTypes()}</Text>
      )}
    </View>
  );
};

const PeersList: React.FC<PeersListProps> = ({
  style,
  showConnectionDetails = true,
  ditto = null,
  headerComponent,
}) => {

  // santity check - ditto can't be null or not initialized
  const renderDittoNull = () => (
    <Text style={styles.headerText}>
      Error:  Passed in Ditto instance is null.  Make sure you have initialized Ditto and passed it to the PeersList component.
    </Text>
  );

  if (ditto === null) {
    return renderDittoNull();
  }

  const emptyMessage = 'No peers found';
  const { peers, isLoading, peerCount } = usePeers(ditto);

  const renderPeer = (item: PeerInfo, index: number) => (
    <PeerItem 
      key={`${item.deviceName}-${index}`} 
      peer={item} 
      showConnectionDetails={showConnectionDetails} 
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
      <Text style={styles.emptySubtext}>
        Make sure other devices with your app are nearby and connected to the same network.
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {headerComponent && headerComponent()}
      <Text style={styles.headerText}>
        {isLoading ? 'Loading peers...' : `${peerCount} peer${peerCount !== 1 ? 's' : ''} found`}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]}>
        <Text style={styles.loadingIndicator}>⏳</Text>
        <Text style={styles.loadingText}>Discovering peers...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      <View style={styles.peersContainer}>
        {peers.length === 0 ? renderEmpty() : peers.slice(0, 10).map(renderPeer)}
        {peers.length > 10 && (
          <Text style={styles.moreText}>
            ... and {peers.length - 10} more peers
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  peersContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
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
  connectionCount: {
    fontSize: 14,
    color: '#666',
  },
  sdkVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  connectionDetails: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Courier',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  moreText: {
    textAlign: 'center',
    padding: 16,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default PeersList;