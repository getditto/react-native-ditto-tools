import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaContainer } from '../components/SafeAreaContainer';
import DittoContext from '../providers/DittoContext';
import { SystemSettings } from '@dittolive/ditto-react-native-tools';
import { colors, typography, spacing } from '../styles';

export const SystemSettingsScreen: React.FC = () => {
  const context = useContext(DittoContext);
  if (!context) {
    throw new Error('SystemSettingsScreen must be used within a DittoProvider');
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
      <SystemSettings 
        ditto={ditto}
        style={styles.container}
      />
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  settingKey: {
    fontSize: typography.sizes.body,
    color: colors.text,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: typography.sizes.small,
    color: colors.textSecondary,
  },
});