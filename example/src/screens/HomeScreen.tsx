import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { SafeAreaContainer } from '../components/SafeAreaContainer';
import { MenuSection } from '../components/MenuSection';
import { MenuListItem } from '../components/MenuListItem';
import { navigate } from '../services/NavigationService';
import { colors, typography, spacing } from '../styles';

// Simple icon components using Unicode symbols
const PeersIcon = () => <Text style={styles.icon}>📱</Text>;
const DiskIcon = () => <Text style={styles.icon}>💾</Text>;

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Ditto Tools</Text>
        </View>

        <MenuSection title="Network">
          <MenuListItem
            title="Peers List"
            iconColor={colors.networkIcon}
            iconComponent={<PeersIcon />}
            onPress={() => navigate('PeersList')}
            isFirst
          />
        </MenuSection>

        <MenuSection title="System">
          <MenuListItem
            title="Disk Usage"
            iconColor={colors.diskIcon}
            iconComponent={<DiskIcon />}
            onPress={() => navigate('DiskUsage')}
            isFirst
          />
        </MenuSection>
      </ScrollView>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.largeTitle,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  icon: {
    fontSize: 16,
  },
});
