import React, { useContext } from 'react';
import { SafeAreaContainer } from '../components/SafeAreaContainer';
import DittoContext from '../providers/DittoContext';
import { PeersList } from '@dittolive/ditto-react-native-tools';
import { colors, typography, spacing } from '../styles';
import { StyleSheet, View, Text } from 'react-native';

export const PeersListScreen: React.FC = () => {
  const context = useContext(DittoContext);
  if (!context) {
      throw new Error('PeersListScreen must be used within a DittoProvider');
  }
  const { dittoService } = context;
  const ditto = dittoService.getDitto();

  if (!ditto) {
    return (
      <SafeAreaContainer>
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <PeersList ditto={ditto} showConnectionDetails={true} style={styles.container} />
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.sizes.small,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.sizes.small,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  errorSubtext: {
    fontSize: typography.sizes.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  peerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
  },
  peerInfo: {
    flex: 1,
  },
  peerName: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  peerId: {
    fontSize: typography.sizes.small,
    color: colors.textSecondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
