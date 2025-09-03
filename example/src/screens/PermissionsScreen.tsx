import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaContainer } from '../components/SafeAreaContainer';
import { usePermissions } from '../hooks/usePermissions';
import { colors, typography, spacing } from '../styles';

export const PermissionsScreen: React.FC = () => {
  const { permissions, loading, error } = usePermissions();

  const renderPermissionItem = (name: string, granted: boolean) => (
    <View key={name} style={styles.permissionItem}>
      <Text style={styles.permissionName}>{name}</Text>
      <View style={[
        styles.statusIndicator,
        { backgroundColor: granted ? colors.success : colors.error },
      ]}>
        <Text style={styles.statusText}>{granted ? '✓' : '✗'}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaContainer>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Checking permissions...</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  if (error) {
    return (
      <SafeAreaContainer>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Error checking permissions</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Permissions Health</Text>

        <View style={styles.permissionsContainer}>
          {renderPermissionItem('Bluetooth', permissions.bluetooth)}
          {renderPermissionItem('WiFi', permissions.wifi)}
          {renderPermissionItem('Storage', permissions.storage)}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>🔒</Text>
          <Text style={styles.infoText}>
            Ditto requires these permissions to function properly.
            Green checkmarks indicate granted permissions, red X's indicate missing permissions.
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
  permissionsContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  permissionName: {
    fontSize: typography.sizes.body,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: colors.backgroundSecondary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
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
