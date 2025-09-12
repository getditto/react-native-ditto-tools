import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../styles';

interface MenuListItemProps {
  title: string;
  iconColor: string;
  iconComponent: React.ReactNode;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const MenuListItem: React.FC<MenuListItemProps> = ({
  title,
  iconColor,
  iconComponent,
  onPress,
  isFirst = false,
  isLast = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isFirst && styles.firstItem,
        isLast && styles.lastItem,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
          {iconComponent}
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
      {!isLast && <View style={styles.separator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
  },
  firstItem: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lastItem: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.regular,
    color: colors.text,
  },
  chevron: {
    fontSize: 18,
    color: colors.textTertiary,
    fontWeight: typography.weights.medium,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
    marginLeft: 56, // Icon width + icon margin + container padding
  },
});
