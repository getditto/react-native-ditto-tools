import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../styles';

interface SafeAreaContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
