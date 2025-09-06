import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import type { ListRenderItem } from 'react-native';
import { Ditto } from '@dittolive/ditto';
import { usePeers } from '../hooks/usePeers';
import type { PeerInfo } from '../hooks/usePeers';
import PeerItem from './PeerItem';

interface PeersListProps {
  style?: any;
  showConnectionDetails?: boolean;
  ditto: Ditto;
  headerComponent?: () => React.ReactElement;
}

const PeersList: React.FC<PeersListProps> = ({
  style,
  showConnectionDetails = true,
  ditto,
  headerComponent,
}) => {

  const emptyMessage = 'No peers found';
  const { peers, localPeer, isLoading, peerCount, error } = usePeers(ditto);

  const renderPeer: ListRenderItem<PeerInfo> = ({ item }) => (
    <PeerItem 
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
    <>
      <Text style={styles.peerHeaderText}>LOCAL PEER</Text>
      <View style={styles.peerItem}>
        {headerComponent && headerComponent()}
        <View style={styles.peerHeader}>
          <Text style={styles.deviceName}>{localPeer?.deviceName || 'Unknown Device'}</Text>
          <View style={styles.statusContainer}>
            {localPeer?.isConnectedToDittoCloud && (
              <View style={styles.cloudBadge}>
                <Text style={styles.cloudBadgeText}>Cloud</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.sdkVersion}>SDK Version: {localPeer?.dittoSdkVersion || 'Unknown'}</Text>
        
        {localPeer?.connections && (
          <View style={styles.connectionsContainer}>
            <Text style={styles.connectionsTitle}>Local Connections:</Text>
            {Array.isArray(localPeer.connections) ? (
              localPeer.connections.map((connection) => (
                <React.Fragment key={`connection-${connection.peerKeyString1 || 'unknown'}-${connection.connectionType || 'unknown'}`}>
                  <Text style={styles.connectionItem}>
                    {connection.peerKeyString1} - {connection.connectionType}
                  </Text>
                  <View style={styles.divider} />
                </React.Fragment>
              ))
            ) : (
              Object.entries(localPeer.connections).map(([type, count]) => (
                <Text key={type} style={styles.connectionItem}>
                  {type}: {String(count)}
                </Text>
              ))
            )}
          </View>
        )}
        
        <Text style={styles.peerHeader}>
          {isLoading ? 'Loading peers...' : `${peerCount} peer${peerCount !== 1 ? 's' : ''} found`}
        </Text>
      </View>
      <Text style={styles.peerHeaderText}>REMOTE PEERS</Text>
    </>
  );

  const keyExtractor = (item: PeerInfo) => 
    item.peerKeyString || item.deviceName;

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Text style={styles.errorText}>⚠️ Error loading peers</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

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
      <FlatList
        data={peers}
        renderItem={renderPeer}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={peers.length === 0 ? styles.emptyListContainer : styles.listContent}
        showsVerticalScrollIndicator={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7', // iOS system background color
  },
  listContent: {
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
  peerHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginTop: 16,
    marginBottom: 8,
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
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    marginLeft: 8,
  },
  sdkVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
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
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff3b30',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
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
});

export default PeersList;