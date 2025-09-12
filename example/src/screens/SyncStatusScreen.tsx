import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaContainer } from '../components/SafeAreaContainer';
import { colors, typography, spacing } from '../styles';

export const SyncStatusScreen: React.FC = () => {
  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Sync Status</Text>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>🔄</Text>
          <Text style={styles.placeholderTitle}>Sync Status</Text>
          <Text style={styles.placeholderSubtext}>
            This screen will show real-time synchronization status,
            including active subscriptions, sync progress, and connection health.
          </Text>
        </View>
      </View>
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  placeholderTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  placeholderSubtext: {
    fontSize: typography.sizes.small,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.sizes.small,
  },
});
