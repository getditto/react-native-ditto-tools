import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaContainer } from '../components/SafeAreaContainer';
import DittoContext from '../providers/DittoContext';
import { DiskUsage } from '@dittolive/ditto-react-native-tools';
import { colors, typography, spacing } from '../styles';

export const DiskUsageScreen: React.FC = () => {
  const context = useContext(DittoContext);
  if (!context) {
    throw new Error('DiskUsageScreen must be used within a DittoProvider');
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

  const handleExportDataDirectory = () => {
    // TODO: Implement export data directory functionality
    console.log('Export data directory pressed');
  };

  return (
    <SafeAreaContainer>
      <DiskUsage
      />
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
