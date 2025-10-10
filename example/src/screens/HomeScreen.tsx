import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { SafeAreaContainer } from '../components/SafeAreaContainer';
import { MenuSection } from '../components/MenuSection';
import { MenuListItem } from '../components/MenuListItem';
import { navigate } from '../services/NavigationService';
import { colors, typography, spacing } from '../styles';

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
            onPress={() => navigate('PeersList')}
            isFirst
          />
        </MenuSection>

        <MenuSection title="System">
          <MenuListItem
            title="Disk Usage"
            onPress={() => navigate('DiskUsage')}
            isFirst
          />
          <MenuListItem
            title="System Settings"
            onPress={() => navigate('SystemSettings')}
            isLast
          />
        </MenuSection>

        <MenuSection title="Ditto Store">
          <MenuListItem
            title="Query Editor"
            onPress={() => navigate('QueryEditor')}
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
});
