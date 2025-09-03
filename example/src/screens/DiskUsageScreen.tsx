import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaContainer } from '../components/SafeAreaContainer';
import { useDiskUsage } from '../hooks/useDiskUsage';
import { colors, typography, spacing } from '../styles';

export const DiskUsageScreen: React.FC = () => {
  const { diskUsage, loading, error } = useDiskUsage();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) {return '0 B';}
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderUsageItem = (label: string, bytes: number, color: string) => (
    <View key={label} style={styles.usageItem}>
      <View style={styles.usageInfo}>
        <Text style={styles.usageLabel}>{label}</Text>
        <Text style={styles.usageValue}>{formatBytes(bytes)}</Text>
      </View>
      <View style={[styles.usageIndicator, { backgroundColor: color }]} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaContainer>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Calculating disk usage...</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  if (error) {
    return (
      <SafeAreaContainer>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Error calculating disk usage</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Disk Usage</Text>

        <View style={styles.usageContainer}>
          {renderUsageItem('Total Size', diskUsage.totalSize, colors.primary)}
          {renderUsageItem('Documents', diskUsage.documentsSize, colors.success)}
          {renderUsageItem('Attachments', diskUsage.attachmentsSize, colors.warning)}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>💾</Text>
          <Text style={styles.infoText}>
            Monitor Ditto's disk usage including documents and attachments.
            Regular cleanup helps maintain optimal performance.
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
  usageContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  usageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  usageInfo: {
    flex: 1,
  },
  usageLabel: {
    fontSize: typography.sizes.body,
    color: colors.text,
    fontWeight: typography.weights.medium,
    marginBottom: 2,
  },
  usageValue: {
    fontSize: typography.sizes.small,
    color: colors.textSecondary,
  },
  usageIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  infoTitle: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: typography.sizes.small,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.sizes.small,
  },
});
