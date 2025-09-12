import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../styles';

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.itemsContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.small,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
    letterSpacing: 0.5,
  },
  itemsContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginHorizontal: spacing.md,
  },
});
